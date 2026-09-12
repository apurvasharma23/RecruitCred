export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  quickReplies?: string[];
  actionLink?: {
    label: string;
    page: string;
  };
}

export interface ChatContextPayload {
  role: 'student' | 'recruiter' | 'team_lead';
  userName: string;
  currentPage: string;
  overallScore: number;
  skillsCount: {
    verified: number;
    claimed: number;
    pending: number;
  };
  verifiedSkills: string[];
  claimedSkills: string[];
  projectsCount: number;
  completedAssessmentsCount: number;
  hackathonsCount: number;
  teamsCount: number;
}
