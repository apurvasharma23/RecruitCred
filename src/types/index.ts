export type SkillStatus = 'verified' | 'claimed' | 'pending';

export interface ProofSource {
  id: string;
  type: 'github' | 'leetcode' | 'hackerrank' | 'kaggle' | 'certification' | 'project';
  title: string;
  url?: string;
  details?: string;
  metric?: string; // e.g. "45 repos • 1.2k stars" or "340 solved (Top 5%)"
  connectedAt: string;
  isVerifiedDemo: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'AI & ML' | 'UI/UX' | 'Cloud & DevOps' | 'Mobile' | 'Systems';
  status: SkillStatus;
  score?: number; // 0 - 100
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verifiedAt?: string;
  verificationSource?: string; // e.g. "RecruitCred Assessment", "GitHub Code Analysis", "LeetCode Verification"
  assessmentId?: string;
  proofSources: ProofSource[];
  verificationId?: string; // cryptographic-like verification hash
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  verifiedSkills: string[];
  stars?: number;
}

export interface DigitalCertificate {
  id: string;
  certificateId: string; // e.g. "RC-PY-2026-001482"
  candidateName: string;
  candidateId: string;
  assessmentName: string;
  skillName: string;
  score: number;
  issueDate: string;
  status: 'Valid' | 'Revoked';
  issuer: string;
  verificationUrl?: string;
  criteria?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl?: string;
  isVerified: boolean;
  score?: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  bio: string;
  email?: string;
  education: string;
  college?: string;
  branch?: string;
  gradYear?: string;
  cgpa?: string;
  location: string;
  accountType?: 'student' | 'recruiter';
  experienceLevel: 'Student' | 'Junior' | 'Mid-Level' | 'Senior';
  placementStatus?: 'Actively Interviewing' | 'Available for Placement' | 'Offer Accepted';
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  githubUsername?: string;
  leetcodeUsername?: string;
  kaggleUsername?: string;
  hackathonsCount: number;
  teamsCount: number;
  overallScore: number;
  compatibilityScore?: number;
  isPro?: boolean;
  proSubscription?: ProSubscription;
  // Recruiter Specific Attributes
  companyName?: string;
  companyLogo?: string;
  designation?: string;
  workEmail?: string;
  companyWebsite?: string;
  industry?: string;
  companyLocation?: string;
  companyDescription?: string;
  hiringRoles?: string[];
}

export interface PartnerCollege {
  id: string;
  name: string;
  shortName: string;
  location: string;
  logo?: string;
  totalStudents: number;
  verifiedStudents: number;
  branches: string[];
}

export interface RecruiterCompanyProfile {
  companyName: string;
  companyLogo?: string;
  recruiterName: string;
  designation: string;
  workEmail: string;
  companyWebsite?: string;
  industry: string;
  companyLocation: string;
  companyDescription: string;
  hiringRoles: string[];
}

export interface RecruitmentRequirement {
  id: string;
  title: string;
  college: string;
  role: string;
  branches: string[];
  gradYear: string;
  minCgpa: number;
  requiredSkills: string[];
  requiredVerifiedSkills: string[];
  minAssessmentScore: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
}

export interface CandidateShortlistRecord {
  id: string;
  recruiterId: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar?: string;
  college: string;
  branch: string;
  cgpa: string;
  targetRole: string;
  verifiedSkills: string[];
  assessmentScore?: number;
  status: 'shortlisted' | 'saved' | 'interviewing' | 'rejected';
  dateAdded: string;
  notes?: string;
}

export interface RecruiterActivityRecord {
  id: string;
  recruiterId: string;
  type: 'candidate_viewed' | 'candidate_shortlisted' | 'candidate_saved' | 'requirement_created' | 'college_selected';
  title: string;
  description: string;
  timestamp: string;
  candidateId?: string;
  candidateName?: string;
}

export interface ProSubscription {
  id: string;
  userId: string;
  email?: string;
  plan: 'recruitcred_pro_monthly';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  amount: number; // 500
  currency: 'INR';
  provider: 'razorpay';
  providerOrderId: string;
  providerPaymentId?: string;
  providerSignature?: string;
  providerSubscriptionId?: string;
  startedAt: string;
  expiresAt: string;
  nextBillingDate?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  email?: string;
  orderId: string;
  paymentId: string;
  providerSignature?: string;
  amount: number; // 500
  currency: string; // "INR"
  provider: 'razorpay';
  status: 'captured' | 'failed' | 'refunded' | 'pending';
  planName: string;
  date: string;
  receiptUrl?: string;
  verifiedAt?: string;
}

export interface Question {
  id: string;
  question: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  category: string;
  variantId?: string;
}

export interface AssessmentPrerequisite {
  assessmentId: string;
  requiredScore: number;
  skillName: string;
  requiredLevelTitle: string;
}

export interface Assessment {
  id: string;
  skillName: string;
  category: 'Frontend' | 'Backend' | 'AI & ML' | 'UI/UX' | 'Cloud & DevOps' | 'Mobile' | 'Systems';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  questionCount: number;
  icon: string;
  description: string;
  syllabus: string[];
  passingScore: number;
  questions: Question[];
  level?: string; // e.g. "Level 1 — Fundamentals", "Level 2 — Intermediate", "Level 3 — Advanced"
  isLocked?: boolean;
  prerequisite?: AssessmentPrerequisite;
  certificateAvailable?: boolean;
  verificationContribution?: string; // e.g. "+8%", "+12%"
  proctoringRequired?: boolean;
  questionPoolSize?: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  skillName: string;
  score: number;
  accuracy: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  correctAnswersCount: number;
  submittedAt: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  answers: { [questionId: string]: number };
  passed: boolean;
  attemptNumber?: number;
  verificationContribution?: string;
  integrityStatus?: 'Normal' | 'Attention Required' | 'Additional Verification Recommended';
}

export interface AssessmentAssignment {
  id: string;
  title: string;
  company: string;
  skill: string;
  assignedDate: string;
  dueDate: string;
  durationMinutes: number;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Expired';
  score?: number;
  reviewer?: string;
  instructions?: string;
  assessmentId?: string;
}

export interface VerificationAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  verificationType: 'Live Technical Review' | 'Code Walkthrough' | 'AI Attention Verification' | 'Practical Task Assessment';
  status: 'Scheduled' | 'Completed' | 'Inconclusive' | 'Additional Verification Required';
  result?: string;
  followUpRequired?: string;
  evaluator?: string;
}

export interface SkillProgressionLevel {
  levelNumber: number;
  levelTitle: string; // e.g. "Level 1 — Fundamentals"
  status: 'Passed' | 'Available' | 'Locked';
  minScoreToUnlockNext: number;
  userScore?: number;
  assessmentId?: string;
  verificationBadge: string; // e.g. "Assessed", "Verified", "Advanced Verified"
  verificationContribution: string; // e.g. "+8%"
  prerequisiteDescription?: string;
}

export interface SkillProgressionRoadmap {
  skillName: string;
  category: string;
  currentLevelTitle: string;
  overallVerificationProgress: number; // e.g. 82%
  levels: SkillProgressionLevel[];
  nextRecommendedAction: string;
  verificationBreakdown: {
    evidenceScore: number;
    assessmentScore: number;
    projectScore: number;
    description: string;
  };
}

export interface IntegrityEvent {
  id: string;
  type: 'camera_interruption' | 'focus_loss' | 'multiple_faces' | 'face_missing' | 'fullscreen_exit' | 'copy_paste' | 'session_heartbeat';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  details: string;
}

export interface AssessmentSession {
  sessionId: string;
  userId: string;
  assessmentId: string;
  skillName: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  startedAt: string;
  expiresAt: string;
  heartbeats: number;
  isLocked: boolean;
  integrityStatus: 'Normal' | 'Attention Required' | 'Additional Verification Recommended';
  integrityEvents: IntegrityEvent[];
  cameraActive: boolean;
  fullscreenActive: boolean;
  faceDetected: boolean;
  multipleFacesDetected: boolean;
  blinkFrequencyNormal: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  tagline: string;
  bannerImage?: string;
  organizer: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  participantsCount: number;
  teamsCount: number;
  tags: string[];
  lookingForRoles: string[];
  requiredSkills: string[];
  description: string;
  isFeatured?: boolean;
}

export interface TeamMember {
  userId: string;
  role: string;
  isLeader?: boolean;
  joinedAt: string;
  verifiedSkills: string[];
}

export interface TeamChallenge {
  id: string;
  teamId: string;
  teamName: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  skillName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  timeLimitMinutes?: number;
  status: 'pending' | 'completed' | 'accepted' | 'rejected';
  score?: number;
  accuracy?: number;
  timeSpentSeconds?: number;
  recommendation?: 'Strong Candidate' | 'Promising Candidate' | 'Needs Practice';
  sentAt: string;
  completedAt?: string;
  feedback?: string;
  answers?: { [qId: string]: number };
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  description: string;
  leaderId: string;
  maxSize: number;
  members: TeamMember[];
  openRoles: string[];
  requiredSkills: string[];
  challengesSent: TeamChallenge[];
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  hackathonName: string;
  inviterName: string;
  inviterAvatar: string;
  invitedUserId: string;
  roleOffered: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'verification' | 'invitation' | 'challenge' | 'achievement';
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface Activity {
  id: string;
  type: 'assessment' | 'proof' | 'team_join' | 'invite' | 'challenge';
  title: string;
  description: string;
  timestamp: string;
  badge?: string;
  verified?: boolean;
}
