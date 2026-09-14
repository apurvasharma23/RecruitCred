import { db, DbAssessmentSession, DbViolationEvent } from './db';
import { COMPREHENSIVE_ASSESSMENTS } from '../mockData/assessmentData';

/**
 * Handle POST /api/assessments/start
 */
export const handleStartAssessment = async (body: {
  userId?: string;
  assessmentId?: string;
}): Promise<{ status: number; data: any }> => {
  const { userId, assessmentId } = body;

  if (!userId || !assessmentId) {
    return { status: 400, data: { error: 'userId and assessmentId are required.' } };
  }

  const assessment = COMPREHENSIVE_ASSESSMENTS.find(a => a.id === assessmentId) || COMPREHENSIVE_ASSESSMENTS[0];

  // Check if there is an active session
  const activeSession = db.getActiveSessionForUserAndAssessment(userId, assessmentId);
  if (activeSession) {
    const violations = db.getViolationEventsBySession(activeSession.id);
    return {
      status: 200,
      data: {
        success: true,
        session: activeSession,
        violations,
        isExisting: true
      }
    };
  }

  // Create new server-backed assessment session
  const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const newSession: DbAssessmentSession = {
    id: sessionId,
    userId,
    assessmentId: assessment.id,
    skillName: assessment.skillName,
    startedAt: new Date().toISOString(),
    status: 'in_progress',
    warningCount: 0,
    autoSubmitted: false,
    answers: {},
    timeSpentSeconds: 0,
    totalQuestions: assessment.questions.length
  };

  db.createAssessmentSession(newSession);

  console.log(`[AssessmentBackend] Started session ${sessionId} for user ${userId} (${assessment.skillName})`);

  return {
    status: 201,
    data: {
      success: true,
      session: newSession,
      violations: []
    }
  };
};

/**
 * Handle POST /api/assessments/violation
 * Enforces:
 * 1. >3 people detected (4+ people) -> Immediate Auto-Submit with cheating alert.
 * 2. 3-Warnings Rule -> Prohibited objects, camera violations, tab switches accumulate warnings; 3rd warning auto-submits.
 */
export const handleRecordViolation = async (body: {
  sessionId?: string;
  userId?: string;
  type?: DbViolationEvent['type'];
  details?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high';
}): Promise<{ status: number; data: any }> => {
  const { sessionId, userId, type, details, metadata, severity } = body;

  if (!sessionId || !type) {
    return { status: 400, data: { error: 'sessionId and violation type are required.' } };
  }

  const session = db.getAssessmentSession(sessionId);
  if (!session) {
    return { status: 404, data: { error: 'Assessment session not found.' } };
  }

  if (session.status === 'submitted' || session.status === 'locked' || session.status === 'terminated') {
    return {
      status: 400,
      data: {
        error: 'Assessment is already submitted and locked. No further violations accepted.',
        session
      }
    };
  }

  const faceCount = Number(metadata?.faceCount || 0);
  const isMultiplePeopleCritical = type === 'multiple_people_critical' || faceCount > 3;

  let newWarningCount = session.warningCount;
  let autoSubmitted = false;
  let newStatus: DbAssessmentSession['status'] = session.status;
  let terminationReason: string | undefined = session.submissionReason;
  let cheatingDetected = false;

  // RULE 1: If MORE THAN 3 people (>3 = 4+) detected in frame -> Immediate Auto-Submit
  if (isMultiplePeopleCritical) {
    newWarningCount = Math.max(session.warningCount + 1, 3);
    autoSubmitted = true;
    newStatus = 'locked';
    cheatingDetected = true;
    terminationReason = 'More than 3 people were detected in the camera frame.';

    console.warn(`[AssessmentBackend] CRITICAL CHEATING: More than 3 people detected in session ${sessionId}! Auto-submitting.`);
  } else {
    // Increment server-side warning count
    newWarningCount = session.warningCount + 1;

    // RULE 2: If 3 valid warnings reached -> Auto-Submit
    if (newWarningCount >= 3) {
      autoSubmitted = true;
      newStatus = 'locked';
      terminationReason = 'Assessment automatically submitted after 3 warnings.';

      console.warn(`[AssessmentBackend] Session ${sessionId} reached 3 warnings. Auto-submitting.`);
    }
  }

  // Record violation event in server DB
  const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const violationEvent: DbViolationEvent = {
    id: eventId,
    assessmentSessionId: sessionId,
    userId: userId || session.userId,
    type: isMultiplePeopleCritical ? 'multiple_people_critical' : type,
    timestamp: new Date().toISOString(),
    metadata: metadata || {},
    warningNumber: newWarningCount,
    severity: isMultiplePeopleCritical ? 'high' : (severity || 'medium'),
    details: details || (isMultiplePeopleCritical ? 'More than 3 people detected in camera frame.' : 'Proctoring violation detected.')
  };

  db.recordViolationEvent(violationEvent);

  // Update session state in DB
  const updatedSession = db.updateAssessmentSession(sessionId, {
    warningCount: newWarningCount,
    status: newStatus,
    autoSubmitted,
    submissionReason: terminationReason,
    submittedAt: autoSubmitted ? new Date().toISOString() : undefined
  });

  return {
    status: 200,
    data: {
      success: true,
      event: violationEvent,
      session: updatedSession,
      warningCount: newWarningCount,
      autoSubmitted,
      status: newStatus,
      cheatingDetected,
      message: isMultiplePeopleCritical
        ? 'Assessment automatically submitted: cheating detected.'
        : autoSubmitted
        ? 'Assessment automatically submitted after 3 warnings.'
        : `Warning ${newWarningCount}/3 recorded.`,
      terminationReason
    }
  };
};

/**
 * Handle POST /api/assessments/submit
 * Grades the assessment on the server, calculates integrity penalty, and saves results.
 */
export const handleSubmitAssessment = async (body: {
  sessionId?: string;
  userId?: string;
  assessmentId?: string;
  answers?: Record<string, number>;
  timeSpentSeconds?: number;
  integrity?: {
    autoSubmitted?: boolean;
    terminationReason?: string;
    events?: any[];
  };
}): Promise<{ status: number; data: any }> => {
  const { sessionId, userId, assessmentId, answers = {}, timeSpentSeconds = 0, integrity } = body;

  const targetAssessmentId = assessmentId || 'python-core';
  const assessment = COMPREHENSIVE_ASSESSMENTS.find(a => a.id === targetAssessmentId) || COMPREHENSIVE_ASSESSMENTS[0];

  let session: DbAssessmentSession | null = null;
  if (sessionId) {
    session = db.getAssessmentSession(sessionId);
  }

  // Server-Side Grading
  let correctCount = 0;
  assessment.questions.forEach(q => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const rawAccuracy = Math.round((correctCount / assessment.questions.length) * 100);

  // Server-side integrity calculation
  const serverViolations = sessionId ? db.getViolationEventsBySession(sessionId) : [];
  const clientEvents = integrity?.events || [];
  const totalViolations = serverViolations.length > 0 ? serverViolations : clientEvents;

  const integrityPenalty = Math.min(
    35,
    totalViolations.reduce((penalty: number, event: any) => {
      if (event.severity === 'high' || event.type === 'multiple_people_critical') return penalty + 15;
      if (event.severity === 'medium') return penalty + 7;
      return penalty + 2;
    }, 0)
  );

  const accuracy = Math.max(0, rawAccuracy - integrityPenalty);
  const passed = accuracy >= assessment.passingScore;

  let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
  if (accuracy >= 90) level = 'Expert';
  else if (accuracy >= 80) level = 'Advanced';
  else if (accuracy >= 70) level = 'Intermediate';
  else level = 'Beginner';

  const autoSubmitted = Boolean(integrity?.autoSubmitted || (session && session.autoSubmitted));
  const terminationReason = integrity?.terminationReason || session?.submissionReason || undefined;

  const attemptId = `att-${Date.now()}`;
  const submittedAt = new Date().toISOString();

  // If session exists, update it to submitted & locked
  if (session) {
    db.updateAssessmentSession(session.id, {
      submittedAt,
      status: 'submitted',
      answers,
      timeSpentSeconds,
      correctAnswersCount: correctCount,
      score: accuracy,
      accuracy,
      passed,
      level,
      integrityPenalty,
      autoSubmitted,
      submissionReason: terminationReason
    });
  }

  // Update verified skill on user's profile in DB
  const targetUserId = userId || session?.userId;
  if (targetUserId) {
    const user = db.getUserById(targetUserId);
    if (user) {
      const existingSkillIndex = user.skills.findIndex(
        s => s.name.toLowerCase() === assessment.skillName.toLowerCase()
      );
      const verificationId = `RC-V${accuracy}-${assessment.skillName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const updatedSkills = [...user.skills];
      if (existingSkillIndex >= 0) {
        updatedSkills[existingSkillIndex] = {
          ...updatedSkills[existingSkillIndex],
          status: passed ? 'verified' : updatedSkills[existingSkillIndex].status,
          score: Math.max(updatedSkills[existingSkillIndex].score || 0, accuracy),
          level,
          verifiedAt: passed ? submittedAt.split('T')[0] : updatedSkills[existingSkillIndex].verifiedAt,
          assessmentId: assessment.id,
          verificationId: passed ? verificationId : updatedSkills[existingSkillIndex].verificationId
        };
      } else {
        updatedSkills.push({
          id: `sk-${Date.now()}`,
          name: assessment.skillName,
          category: assessment.category,
          status: passed ? 'verified' : 'claimed',
          score: accuracy,
          level,
          verifiedAt: passed ? submittedAt.split('T')[0] : undefined,
          assessmentId: assessment.id,
          verificationId: passed ? verificationId : undefined,
          proofSources: []
        });
      }

      // Recompute overall readiness score
      const verifiedSkills = updatedSkills.filter(s => s.status === 'verified');
      const avgVerifiedScore =
        verifiedSkills.length > 0
          ? Math.round(verifiedSkills.reduce((acc, s) => acc + (s.score || 70), 0) / verifiedSkills.length)
          : user.overallScore;

      db.updateUser(targetUserId, {
        skills: updatedSkills,
        overallScore: avgVerifiedScore
      });
    }
  }

  const attemptResult = {
    id: attemptId,
    assessmentId: assessment.id,
    userId: targetUserId || 'user-current',
    skillName: assessment.skillName,
    score: accuracy,
    accuracy,
    timeSpentSeconds,
    totalQuestions: assessment.questions.length,
    correctAnswersCount: correctCount,
    submittedAt,
    level,
    answers,
    passed,
    integrityPenalty,
    integrityEvents: totalViolations,
    integrityStatus: totalViolations.length >= 3 ? 'Additional Verification Recommended' : totalViolations.length >= 1 ? 'Attention Required' : 'Normal',
    autoSubmitted,
    terminationReason
  };

  console.log(`[AssessmentBackend] Graded assessment ${assessment.skillName}: score=${accuracy}%, passed=${passed}, autoSubmitted=${autoSubmitted}`);

  return {
    status: 200,
    data: {
      success: true,
      attempt: attemptResult
    }
  };
};

/**
 * Handle GET /api/assessments/session/:sessionId
 */
export const handleGetAssessmentSession = async (
  sessionId: string
): Promise<{ status: number; data: any }> => {
  if (!sessionId) {
    return { status: 400, data: { error: 'sessionId is required.' } };
  }

  const session = db.getAssessmentSession(sessionId);
  if (!session) {
    return { status: 404, data: { error: 'Session not found.' } };
  }

  const violations = db.getViolationEventsBySession(sessionId);

  return {
    status: 200,
    data: {
      success: true,
      session,
      violations
    }
  };
};
