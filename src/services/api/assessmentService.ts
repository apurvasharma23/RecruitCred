export interface ApiAssessmentSession {
  id: string;
  userId: string;
  assessmentId: string;
  skillName: string;
  startedAt: string;
  submittedAt?: string;
  status: 'in_progress' | 'submitted' | 'locked' | 'terminated';
  warningCount: number;
  autoSubmitted: boolean;
  submissionReason?: string;
  answers: Record<string, number>;
  timeSpentSeconds: number;
  totalQuestions: number;
  score?: number;
  accuracy?: number;
  passed?: boolean;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ApiViolationResponse {
  success: boolean;
  warningCount: number;
  autoSubmitted: boolean;
  status: string;
  cheatingDetected?: boolean;
  message?: string;
  terminationReason?: string;
  error?: string;
}

export const apiStartAssessment = async (
  userId: string,
  assessmentId: string
): Promise<{
  success: boolean;
  session?: ApiAssessmentSession;
  violations?: any[];
  error?: string;
}> => {
  try {
    const res = await fetch('/api/assessments/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, assessmentId })
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to start assessment session.' };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error starting assessment.' };
  }
};

export const apiRecordViolation = async (payload: {
  sessionId: string;
  userId: string;
  type: string;
  details?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high';
}): Promise<ApiViolationResponse> => {
  try {
    const res = await fetch('/api/assessments/violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        warningCount: 0,
        autoSubmitted: false,
        status: 'error',
        error: data.error || 'Failed to record violation event.'
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      warningCount: 0,
      autoSubmitted: false,
      status: 'error',
      error: err.message || 'Network error recording violation.'
    };
  }
};

export const apiSubmitAssessment = async (payload: {
  sessionId?: string;
  userId: string;
  assessmentId: string;
  answers: Record<string, number>;
  timeSpentSeconds: number;
  integrity?: {
    autoSubmitted?: boolean;
    terminationReason?: string;
    events?: any[];
  };
}): Promise<{
  success: boolean;
  attempt?: any;
  error?: string;
}> => {
  try {
    const res = await fetch('/api/assessments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to submit assessment.' };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error submitting assessment.' };
  }
};

export const apiGetAssessmentSession = async (
  sessionId: string
): Promise<{
  success: boolean;
  session?: ApiAssessmentSession;
  violations?: any[];
  error?: string;
}> => {
  try {
    const res = await fetch(`/api/assessments/session/${encodeURIComponent(sessionId)}`);
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to fetch session.' };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error fetching session.' };
  }
};
