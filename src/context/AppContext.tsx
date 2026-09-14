import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Skill,
  ProofSource,
  Assessment,
  AssessmentAttempt,
  Hackathon,
  Team,
  TeamChallenge,
  TeamInvitation,
  Notification,
  Activity,
  ProSubscription,
  PaymentTransaction,
  PartnerCollege,
  RecruitmentRequirement,
  CandidateShortlistRecord,
  RecruiterActivityRecord,
  RecruiterCompanyProfile,
  IntegrityEvent
} from '../types';
import {
  createProOrder as apiCreateProOrder,
  verifyPaymentSignature as apiVerifyPaymentSignature,
  cancelProSubscription as apiCancelProSubscription,
  getStoredSubscriptions,
  getStoredTransactions,
  RazorpayOrderResponse
} from '../services/payment/paymentService';
import {
  INITIAL_USERS,
  INITIAL_HACKATHONS,
  INITIAL_TEAMS,
  INITIAL_INVITATIONS,
  INITIAL_ACTIVITIES,
  PARTNER_COLLEGES,
  INITIAL_RECRUITMENT_REQUIREMENTS,
  INITIAL_SHORTLISTED_CANDIDATES,
  INITIAL_RECRUITER_ACTIVITIES
} from '../mockData/initialData';
import {
  COMPREHENSIVE_ASSESSMENTS,
  DEMO_ASSESSMENT_ATTEMPTS
} from '../mockData/assessmentData';

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'profile'
  | 'skills'
  | 'assessments'
  | 'assessment-runner'
  | 'assessment-result'
  | 'certificates'
  | 'find-teammates'
  | 'teams'
  | 'team-detail'
  | 'invitations'
  | 'settings'
  | 'pro'
  // Recruiter specific pages
  | 'recruiter-dashboard'
  | 'find-candidates'
  | 'college-recruitment'
  | 'shortlisted-candidates'
  | 'recruitment-activity';

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password?: string;
  college?: string;
  branch?: string;
  gradYear?: string;
  role?: string;
  accountType?: 'student' | 'recruiter';
  skills?: string[];
  githubUsername?: string;
  leetcodeUsername?: string;
}

import {
  apiLogin,
  apiLogout
} from '../services/auth/authService';
import {
  apiStartAssessment,
  apiSubmitAssessment
} from '../services/api/assessmentService';

export interface AppContextType {
  // Auth state & Role
  isAuthenticated: boolean;
  isRecruiter: boolean;
  currentUser: User;
  allUsers: User[];
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  isFirstTimeUser: boolean;
  activeAssessmentSessionId: string | null;
  setActiveAssessmentSessionId: (id: string | null) => void;
  openAuthModal: (mode?: 'signin' | 'signup' | 'login') => void;
  closeAuthModal: () => void;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (dataOrName: SignupData | string, email?: string, password?: string, role?: string) => void;
  syncUserSession: (user: any) => void;
  isUsernameAvailable: (username: string) => boolean;
  logout: () => void;
  loginAsDemoUser: (userId: string) => void;

  // App state
  assessments: Assessment[];
  hackathons: Hackathon[];
  teams: Team[];
  invitations: TeamInvitation[];
  activities: Activity[];
  notifications: Notification[];
  attempts: AssessmentAttempt[];
  currentPage: ActivePage;
  selectedAssessmentId: string | null;
  selectedAttemptId: string | null;
  selectedTeamId: string | null;
  selectedHackathonId: string | null;
  activeChallengeToTake: TeamChallenge | null;
  searchQuery: string;
  isSidebarCollapsed: boolean;

  // Recruiter specific state & actions
  partnerColleges: PartnerCollege[];
  recruitmentRequirements: RecruitmentRequirement[];
  shortlistedCandidates: CandidateShortlistRecord[];
  recruiterActivities: RecruiterActivityRecord[];
  selectedCollegeId: string | null;
  selectedRequirementId: string | null;
  selectCollege: (collegeId: string) => void;
  selectRequirement: (reqId: string | null) => void;
  createRequirement: (req: Omit<RecruitmentRequirement, 'id' | 'createdAt'>) => void;
  updateRequirement: (id: string, updates: Partial<RecruitmentRequirement>) => void;
  shortlistCandidate: (candidateId: string, roleName?: string, notes?: string) => void;
  saveCandidate: (candidateId: string, roleName?: string) => void;
  removeCandidateFromShortlist: (candidateId: string) => void;
  updateCandidateShortlistStatus: (recordId: string, status: CandidateShortlistRecord['status']) => void;
  recordRecruiterActivity: (activity: Omit<RecruiterActivityRecord, 'id' | 'recruiterId' | 'timestamp'>) => void;
  updateRecruiterCompanyProfile: (profile: Partial<RecruiterCompanyProfile>) => void;

  // Navigation actions
  navigateTo: (page: ActivePage, params?: {
    assessmentId?: string;
    attemptId?: string;
    teamId?: string;
    hackathonId?: string;
    challenge?: TeamChallenge;
  }) => void;
  setSearchQuery: (query: string) => void;
  toggleSidebar: () => void;
  switchUser: (userId: string) => void;

  // Skills & Proof Actions
  addSkill: (skillName: string, category: Skill['category']) => void;
  connectProofToSkill: (skillId: string, proof: Omit<ProofSource, 'id' | 'connectedAt' | 'isVerifiedDemo'>) => void;
  
  // Assessment Actions
  startAssessment: (assessmentId: string) => void;
  submitAssessment: (assessmentId: string, answers: { [qId: string]: number }, timeSpentSeconds: number, integrity?: {
    events?: IntegrityEvent[];
    status?: AssessmentAttempt['integrityStatus'];
    autoSubmitted?: boolean;
    terminationReason?: string;
  }) => AssessmentAttempt;
  
  // Teams & Matching Actions
  createTeam: (teamData: Omit<Team, 'id' | 'leaderId' | 'members' | 'challengesSent'>) => void;
  sendTeamInvitation: (teamId: string, candidateId: string, roleOffered: string, message: string) => void;
  respondToInvitation: (invitationId: string, response: 'accepted' | 'declined') => void;
  
  // Custom Team Challenge Actions
  sendTeamChallenge: (teamId: string, candidateId: string, skillName: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', questionCount: number, timeLimitMinutes?: number) => void;
  startTakingChallenge: (challenge: TeamChallenge) => void;
  submitTeamChallenge: (challengeId: string, score: number, answers?: { [qId: string]: number }, timeSpentSeconds?: number) => void;
  reviewChallengeDecision: (challengeId: string, decision: 'accepted' | 'rejected') => void;

  // Profile actions
  updateProfile: (updatedData: Partial<Omit<User, 'id' | 'overallScore' | 'skills' | 'certifications'>>) => void;
  updateAvatar: (newAvatarUrl: string) => void;

  // RecruitCred Pro & Payment Subscriptions
  isPro: boolean;
  proSubscription: ProSubscription | null;
  paymentTransactions: PaymentTransaction[];
  createProOrder: () => Promise<RazorpayOrderResponse>;
  verifyAndActivatePro: (payload: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    userId?: string;
    email?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  cancelPro: () => Promise<boolean>;

  // Notification & Reset
  markNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  resetAllData: () => void;
}

const STORAGE_KEY = 'recruitcred_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_auth`) === 'true';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');

  const openAuthModal = (mode: 'signin' | 'signup' | 'login' = 'signup') => {
    setAuthModalMode(mode === 'login' ? 'signin' : mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_current_user`);
    return saved || 'user-rahul';
  });

  const [assessments] = useState<Assessment[]>(COMPREHENSIVE_ASSESSMENTS);
  const [hackathons] = useState<Hackathon[]>(INITIAL_HACKATHONS);

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [invitations, setInvitations] = useState<TeamInvitation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invites`);
    return saved ? JSON.parse(saved) : INITIAL_INVITATIONS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Seed default recent assessment attempts for Rahul with realistic demo history
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attempts`);
    if (saved) return JSON.parse(saved);
    return DEMO_ASSESSMENT_ATTEMPTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      userId: 'user-rahul',
      title: 'Skill Challenge Received!',
      message: 'Team Alpha requested a 5-question Python Verification Challenge.',
      type: 'challenge',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'notif-2',
      userId: 'user-rahul',
      title: 'Team Alpha Invitation',
      message: 'You have been invited to join Team Alpha for AI Innovation Challenge 2026.',
      type: 'invitation',
      timestamp: '2 hours ago',
      read: false
    }
  ]);

  // Page Routing & Navigation
  const [currentPage, setCurrentPage] = useState<ActivePage>(() => {
    return isAuthenticated ? 'dashboard' : 'landing';
  });

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [activeAssessmentSessionId, setActiveAssessmentSessionId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>('hack-ai-innovate');
  const [activeChallengeToTake, setActiveChallengeToTake] = useState<TeamChallenge | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Pro Subscriptions & Transactions state
  const [subscriptions, setSubscriptions] = useState<ProSubscription[]>(() => {
    return getStoredSubscriptions();
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    return getStoredTransactions();
  });

  // Recruiter specific state
  const [partnerColleges] = useState<PartnerCollege[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_colleges`);
    return saved ? JSON.parse(saved) : PARTNER_COLLEGES;
  });

  const [recruitmentRequirements, setRecruitmentRequirements] = useState<RecruitmentRequirement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requirements`);
    return saved ? JSON.parse(saved) : INITIAL_RECRUITMENT_REQUIREMENTS;
  });

  const [shortlistedCandidates, setShortlistedCandidates] = useState<CandidateShortlistRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_shortlisted`);
    return saved ? JSON.parse(saved) : INITIAL_SHORTLISTED_CANDIDATES;
  });

  const [recruiterActivities, setRecruiterActivities] = useState<RecruiterActivityRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_recruiter_activities`);
    return saved ? JSON.parse(saved) : INITIAL_RECRUITER_ACTIVITIES;
  });

  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_selected_college`) || 'col-thapar';
  });

  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_selected_req`) || 'req-swe-2026';
  });

  // Sync recruiter state to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_colleges`, JSON.stringify(partnerColleges));
    localStorage.setItem(`${STORAGE_KEY}_requirements`, JSON.stringify(recruitmentRequirements));
    localStorage.setItem(`${STORAGE_KEY}_shortlisted`, JSON.stringify(shortlistedCandidates));
    localStorage.setItem(`${STORAGE_KEY}_recruiter_activities`, JSON.stringify(recruiterActivities));
    if (selectedCollegeId) localStorage.setItem(`${STORAGE_KEY}_selected_college`, selectedCollegeId);
    if (selectedRequirementId) localStorage.setItem(`${STORAGE_KEY}_selected_req`, selectedRequirementId);
  }, [partnerColleges, recruitmentRequirements, shortlistedCandidates, recruiterActivities, selectedCollegeId, selectedRequirementId]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auth`, isAuthenticated ? 'true' : 'false');
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_current_user`, currentUserId);
    localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
    localStorage.setItem(`${STORAGE_KEY}_invites`, JSON.stringify(invitations));
    localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    localStorage.setItem(`${STORAGE_KEY}_attempts`, JSON.stringify(attempts));
  }, [isAuthenticated, users, currentUserId, teams, invitations, activities, attempts]);

  // Find active subscription for current user directly from backend store
  const activeUserSubscription = subscriptions.find(
    s => s.userId === currentUserId && s.status === 'active'
  ) || null;
  const isUserPro = Boolean(activeUserSubscription && activeUserSubscription.status === 'active');

  // Find current user profile or fallback and enrich strictly with verified backend Pro state
  const baseUser = users.find(u => u.id === currentUserId) || users[0];
  const currentUser: User = {
    ...baseUser,
    isPro: isUserPro,
    proSubscription: activeUserSubscription || undefined
  };

  // Determine recruiter role status strictly
  const isRecruiter = Boolean(
    currentUser.accountType === 'recruiter' ||
    (currentUser.role && (
      currentUser.role.toLowerCase().includes('recruiter') ||
      currentUser.role.toLowerCase().includes('hiring') ||
      currentUser.role.toLowerCase().includes('talent acquisition') ||
      currentUser.role.toLowerCase().includes('partner')
    )) ||
    currentUser.id === 'user-rohan'
  );

  // Auto-protect routes based on active role
  useEffect(() => {
    if (isAuthenticated) {
      const studentOnlyPages: ActivePage[] = [
        'dashboard', 'skills', 'assessments', 'assessment-runner', 'assessment-result',
        'certificates', 'find-teammates', 'teams', 'team-detail', 'invitations', 'pro'
      ];
      const recruiterOnlyPages: ActivePage[] = [
        'recruiter-dashboard', 'find-candidates', 'college-recruitment', 'shortlisted-candidates', 'recruitment-activity'
      ];

      if (isRecruiter) {
        if (studentOnlyPages.includes(currentPage)) {
          setCurrentPage('recruiter-dashboard');
        }
      } else {
        if (recruiterOnlyPages.includes(currentPage)) {
          setCurrentPage('dashboard');
        }
      }
    }
  }, [isRecruiter, isAuthenticated, currentPage]);

  // Make sure Rahul has Python 92%, React 86%, C++ Claimed as explicitly specified in prompt
  useEffect(() => {
    if (currentUser.id === 'user-rahul') {
      const hasCpp = currentUser.skills.some(s => s.name.toLowerCase() === 'c++');
      if (!hasCpp) {
        setUsers(prev => prev.map(u => {
          if (u.id === 'user-rahul') {
            return {
              ...u,
              skills: [
                {
                  id: 'sk-py',
                  name: 'Python',
                  category: 'Backend',
                  status: 'verified',
                  score: 92,
                  level: 'Expert',
                  verifiedAt: '2026-03-08',
                  assessmentId: 'python-core',
                  verificationId: 'RC-V92-PYT-4819',
                  proofSources: [
                    {
                      id: 'ps-py-1',
                      type: 'github',
                      title: 'fastapi-microservices-demo',
                      url: 'https://github.com/rahulsharma-dev/fastapi-microservices-demo',
                      details: 'Async SQLAlchemy handlers & JWT verification',
                      metric: '18 stars • 14 commits',
                      connectedAt: '2026-03-01',
                      isVerifiedDemo: true
                    }
                  ]
                },
                {
                  id: 'sk-rct',
                  name: 'React',
                  category: 'Frontend',
                  status: 'verified',
                  score: 86,
                  level: 'Advanced',
                  verifiedAt: '2026-03-06',
                  assessmentId: 'react-core',
                  verificationId: 'RC-V86-RCT-9482',
                  proofSources: [
                    {
                      id: 'ps-rct-1',
                      type: 'github',
                      title: 'ecommerce-state-manager',
                      url: 'https://github.com/rahulsharma-dev/ecommerce-state-manager',
                      details: 'React 18 concurrent frontend architecture',
                      metric: '32 stars • 8 forks',
                      connectedAt: '2026-02-28',
                      isVerifiedDemo: true
                    }
                  ]
                },
                {
                  id: 'sk-cpp',
                  name: 'C++',
                  category: 'Systems',
                  status: 'claimed',
                  level: 'Intermediate',
                  proofSources: []
                },
                {
                  id: 'sk-node',
                  name: 'Node.js',
                  category: 'Backend',
                  status: 'verified',
                  score: 82,
                  level: 'Intermediate',
                  verifiedAt: '2026-02-28',
                  assessmentId: 'nodejs-backend',
                  verificationId: 'RC-V82-NOD-3310',
                  proofSources: []
                }
              ]
            };
          }
          return u;
        }));
      }
    }
  }, [currentUser.id]);

  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  // Sync user session directly from verified server responses
  const syncUserSession = (serverUser: any) => {
    if (!serverUser) return;
    const formattedUser: User = {
      ...serverUser,
      id: serverUser.id,
      name: serverUser.name || serverUser.fullName,
      username: serverUser.uniqueUserId || serverUser.username,
      skills: serverUser.skills || [],
      projects: serverUser.projects || [],
      certifications: serverUser.certifications || []
    };

    setUsers(prev => {
      const exists = prev.some(u => u.id === formattedUser.id || u.username === formattedUser.username);
      if (exists) {
        return prev.map(u => u.id === formattedUser.id ? { ...u, ...formattedUser } : u);
      }
      return [formattedUser, ...prev];
    });

    setCurrentUserId(formattedUser.id);
    setIsAuthenticated(true);
    setIsFirstTimeUser(false);
    const isUserRecruiter = Boolean(
      formattedUser.accountType === 'recruiter' ||
      (formattedUser.role && formattedUser.role.toLowerCase().includes('recruiter')) ||
      formattedUser.id === 'user-rohan'
    );
    setCurrentPage(isUserRecruiter ? 'recruiter-dashboard' : 'dashboard');
  };

  // Auth actions
  const isUsernameAvailable = (username: string): boolean => {
    if (!username || username.trim().length < 3) return false;
    const normalized = username.trim().toLowerCase();
    return !users.some(u => u.username.toLowerCase() === normalized);
  };

  const login = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const res = await apiLogin(identifier, password);
    if (res.success && res.user) {
      syncUserSession(res.user);
      return { success: true };
    }

    // Fallback for local demo usernames if server is in demo mode
    const normalized = identifier.trim().toLowerCase();
    const foundUser = users.find(
      u => u.username.toLowerCase() === normalized || 
           u.id.toLowerCase() === normalized || 
           (u.email && u.email.toLowerCase() === normalized)
    );
    if (foundUser) {
      setCurrentUserId(foundUser.id);
      setIsFirstTimeUser(false);
      setIsAuthenticated(true);
      const isUserRecruiter = Boolean(
        foundUser.accountType === 'recruiter' ||
        (foundUser.role && foundUser.role.toLowerCase().includes('recruiter')) ||
        foundUser.id === 'user-rohan'
      );
      setCurrentPage(isUserRecruiter ? 'recruiter-dashboard' : 'dashboard');
      return { success: true };
    }

    return { success: false, error: res.error || 'Incorrect RecruitCred ID or password. Please try again.' };
  };

  const signup = (
    dataOrName: SignupData | string,
    email?: string,
    _password?: string,
    role?: string
  ) => {
    const isObject = typeof dataOrName === 'object';
    const name = isObject ? dataOrName.name : dataOrName;
    const username = isObject && dataOrName.username
      ? dataOrName.username.trim().toLowerCase()
      : (email ? email.split('@')[0].replace(/[^a-z0-9_]/gi, '').toLowerCase() : `user_${Date.now()}`);
    const normalizedEmail = (isObject ? dataOrName.email : email || '').trim().toLowerCase();
    if (users.some(u => u.username.toLowerCase() === username || u.email?.toLowerCase() === normalizedEmail)) {
      return;
    }
    const userCollege = isObject && dataOrName.college ? dataOrName.college : 'Thapar Institute of Engineering & Technology';
    const userBranch = isObject && dataOrName.branch ? dataOrName.branch : 'Computer Science & Engineering';
    const userGradYear = isObject && dataOrName.gradYear ? dataOrName.gradYear : '2026';
    const userRole = isObject && dataOrName.role ? dataOrName.role : (role || 'Full-Stack Developer');
    const userAccountType = isObject && dataOrName.accountType ? dataOrName.accountType : 'student';
    const githubUser = isObject ? dataOrName.githubUsername : `${username}-dev`;
    const leetcodeUser = isObject ? dataOrName.leetcodeUsername : `${username}_code`;

    const newUserId = `user-${Date.now()}`;

    const initialSkillNames = isObject && dataOrName.skills && dataOrName.skills.length > 0
      ? dataOrName.skills
      : ['Python', 'C++', 'SQL'];

    const initialSkills: Skill[] = initialSkillNames.map((skName, idx) => {
      let cat: Skill['category'] = 'Backend';
      if (skName === 'React' || skName === 'HTML/CSS' || skName === 'JavaScript') cat = 'Frontend';
      else if (skName === 'Git') cat = 'Cloud & DevOps';
      else if (skName === 'C++' || skName.includes('CAD') || skName.includes('Embedded')) cat = 'Systems';
      else if (skName.includes('Machine') || skName.includes('AI')) cat = 'AI & ML';

      return {
        id: `sk-${Date.now()}-${idx + 1}`,
        name: skName,
        category: cat,
        status: 'claimed',
        level: 'Intermediate',
        proofSources: []
      };
    });

    const newUser: User = {
      id: newUserId,
      name,
      username,
      role: userRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      bio: userAccountType === 'recruiter' 
        ? `Talent Acquisition Lead at partner technology enterprise.`
        : `Enthusiastic ${userBranch} student at ${userCollege} building evidence-backed technical competencies.`,
      education: `B.Tech in ${userBranch}, ${userCollege}`,
      email: normalizedEmail,
      emailVerified: true,
      passwordHash: btoa(isObject ? dataOrName.password || '' : _password || ''),
      college: userCollege,
      branch: userBranch,
      gradYear: userGradYear,
      location: 'Bengaluru, India',
      experienceLevel: userAccountType === 'recruiter' ? 'Senior' : 'Student',
      accountType: userAccountType,
      companyName: userAccountType === 'recruiter' ? 'Enterprise Tech Partners' : undefined,
      designation: userAccountType === 'recruiter' ? 'Lead Technical Recruiter' : undefined,
      workEmail: userAccountType === 'recruiter' ? `${username}@enterprise.com` : undefined,
      githubUsername: githubUser || undefined,
      leetcodeUsername: leetcodeUser || undefined,
      hackathonsCount: 0,
      teamsCount: 0,
      overallScore: 70,
      skills: initialSkills,
      projects: githubUser ? [
        {
          id: `proj-${Date.now()}`,
          title: `${userBranch.split(' ')[0]} Capstone System`,
          description: `Engineering project developed at ${userCollege} showcasing structured system design and modular architecture.`,
          tags: [initialSkillNames[0] || 'Python', 'Git', 'System Design'],
          githubUrl: `https://github.com/${githubUser}/capstone-project`,
          verifiedSkills: [],
          stars: 4
        }
      ] : [],
      certifications: []
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUserId);
    setIsFirstTimeUser(true);
    setIsAuthenticated(true);
    setCurrentPage(userAccountType === 'recruiter' ? 'recruiter-dashboard' : 'dashboard');
  };

  const logout = async () => {
    await apiLogout();
    setIsAuthenticated(false);
    localStorage.removeItem(`${STORAGE_KEY}_auth`);
    setCurrentPage('landing');
  };

  const loginAsDemoUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setIsAuthenticated(true);
      const isTargetRecruiter = Boolean(
        target.accountType === 'recruiter' ||
        (target.role && (
          target.role.toLowerCase().includes('recruiter') ||
          target.role.toLowerCase().includes('hiring') ||
          target.role.toLowerCase().includes('talent acquisition')
        )) ||
        target.id === 'user-rohan'
      );
      setCurrentPage(isTargetRecruiter ? 'recruiter-dashboard' : 'dashboard');
    }
  };

  const navigateTo = (page: ActivePage, params?: {
    assessmentId?: string;
    attemptId?: string;
    teamId?: string;
    hackathonId?: string;
    challenge?: TeamChallenge;
  }) => {
    if (params?.assessmentId) setSelectedAssessmentId(params.assessmentId);
    if (params?.attemptId) setSelectedAttemptId(params.attemptId);
    if (params?.teamId) setSelectedTeamId(params.teamId);
    if (params?.hackathonId) setSelectedHackathonId(params.hackathonId);
    if (params?.challenge) setActiveChallengeToTake(params.challenge);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: 'team_join',
          title: `Switched demo profile to ${target.name}`,
          description: `Logged in as ${target.name} (${target.role}).`,
          timestamp: 'Just now'
        },
        ...prev
      ]);
    }
  };

  // Add Skill
  const addSkill = (skillName: string, category: Skill['category']) => {
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: skillName,
      category,
      status: 'claimed',
      level: 'Intermediate',
      proofSources: []
    };

    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        if (u.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
          return u;
        }
        return {
          ...u,
          skills: [...u.skills, newSkill]
        };
      }
      return u;
    }));

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'proof',
        title: `Claimed skill: ${skillName}`,
        description: `Added ${skillName} (${category}). Take an assessment or attach proof to verify.`,
        timestamp: 'Just now'
      },
      ...prev
    ]);
  };

  // Connect Proof Source
  const connectProofToSkill = (skillId: string, proof: Omit<ProofSource, 'id' | 'connectedAt' | 'isVerifiedDemo'>) => {
    const newProof: ProofSource = {
      id: `ps-${Date.now()}`,
      ...proof,
      connectedAt: new Date().toISOString().split('T')[0],
      isVerifiedDemo: true
    };

    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          skills: u.skills.map(s => {
            if (s.id === skillId) {
              return {
                ...s,
                proofSources: [...s.proofSources, newProof]
              };
            }
            return s;
          })
        };
      }
      return u;
    }));

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'proof',
        title: `Connected ${proof.type.toUpperCase()} Proof`,
        description: `Linked ${proof.title} (${proof.metric || 'Verified integration'}).`,
        timestamp: 'Just now',
        verified: true
      },
      ...prev
    ]);
  };

  // Start Assessment with server-backed session
  const startAssessment = async (assessmentId: string) => {
    setSelectedAssessmentId(assessmentId);
    try {
      const res = await apiStartAssessment(currentUserId, assessmentId);
      if (res.success && res.session) {
        setActiveAssessmentSessionId(res.session.id);
      }
    } catch {}
    setCurrentPage('assessment-runner');
  };

  // Submit Assessment with server-backed evaluation
  const submitAssessment = (assessmentId: string, answers: { [qId: string]: number }, timeSpentSeconds: number, integrity?: {
    events?: IntegrityEvent[];
    status?: AssessmentAttempt['integrityStatus'];
    autoSubmitted?: boolean;
    terminationReason?: string;
  }): AssessmentAttempt => {
    const assessment = assessments.find(a => a.id === assessmentId) || COMPREHENSIVE_ASSESSMENTS.find(a => a.id === assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    // Call backend submit asynchronously to record on server
    apiSubmitAssessment({
      sessionId: activeAssessmentSessionId || undefined,
      userId: currentUserId,
      assessmentId,
      answers,
      timeSpentSeconds,
      integrity: {
        autoSubmitted: integrity?.autoSubmitted,
        terminationReason: integrity?.terminationReason,
        events: integrity?.events
      }
    }).catch(err => console.warn('[Backend Submit Sync Error]:', err));

    let correctCount = 0;
    assessment.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const rawAccuracy = Math.round((correctCount / assessment.questions.length) * 100);
    const integrityEvents = integrity?.events || [];
    const integrityPenalty = Math.min(35, integrityEvents.reduce((penalty, event) => {
      if (event.severity === 'high' || event.type === 'multiple_people_critical') return penalty + 15;
      if (event.severity === 'medium') return penalty + 7;
      return penalty + 2;
    }, 0));
    const accuracy = Math.max(0, rawAccuracy - integrityPenalty);
    const passed = accuracy >= assessment.passingScore;
    
    let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
    if (accuracy >= 90) level = 'Expert';
    else if (accuracy >= 80) level = 'Advanced';
    else if (accuracy >= 70) level = 'Intermediate';
    else level = 'Beginner';

    const attemptId = `att-${Date.now()}`;
    const newAttempt: AssessmentAttempt = {
      id: attemptId,
      assessmentId,
      userId: currentUserId,
      skillName: assessment.skillName,
      score: accuracy,
      accuracy,
      timeSpentSeconds,
      totalQuestions: assessment.questions.length,
      correctAnswersCount: correctCount,
      submittedAt: new Date().toISOString(),
      level,
      answers,
      passed,
      integrityPenalty,
      integrityEvents,
      integrityStatus: integrity?.status || 'Normal',
      autoSubmitted: integrity?.autoSubmitted,
      terminationReason: integrity?.terminationReason
    };

    setAttempts(prev => [newAttempt, ...prev]);

    // Update verified status on user's profile
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        const existingSkillIndex = u.skills.findIndex(s => s.name.toLowerCase() === assessment.skillName.toLowerCase());
        const verificationHash = `RC-V${accuracy}-${assessment.skillName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        let updatedSkills = [...u.skills];
        if (existingSkillIndex >= 0) {
          updatedSkills[existingSkillIndex] = {
            ...updatedSkills[existingSkillIndex],
            status: passed ? 'verified' : updatedSkills[existingSkillIndex].status,
            score: accuracy,
            level,
            verifiedAt: passed ? new Date().toISOString().split('T')[0] : updatedSkills[existingSkillIndex].verifiedAt,
            assessmentId,
            verificationId: passed ? verificationHash : undefined
          };
        } else {
          updatedSkills.push({
            id: `sk-${Date.now()}`,
            name: assessment.skillName,
            category: assessment.category,
            status: passed ? 'verified' : 'claimed',
            score: accuracy,
            level,
            verifiedAt: passed ? new Date().toISOString().split('T')[0] : undefined,
            assessmentId,
            verificationId: passed ? verificationHash : undefined,
            proofSources: []
          });
        }

        const verifiedSkills = updatedSkills.filter(s => s.status === 'verified' && s.score);
        const overallScore = verifiedSkills.length > 0 
          ? Math.round(verifiedSkills.reduce((sum, s) => sum + (s.score || 0), 0) / verifiedSkills.length)
          : u.overallScore;

        return {
          ...u,
          skills: updatedSkills,
          overallScore
        };
      }
      return u;
    }));

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'assessment',
        title: `${assessment.skillName} Assessment ${passed ? 'Verified' : 'Completed'}`,
        description: `Scored ${accuracy}% after ${integrityPenalty}% integrity adjustment (${correctCount}/${assessment.questions.length} correct). Level: ${level}.`,
        timestamp: 'Just now',
        badge: `${accuracy}%`,
        verified: passed
      },
      ...prev
    ]);

    setSelectedAttemptId(attemptId);
    return newAttempt;
  };

  // Create Team
  const createTeam = (teamData: Omit<Team, 'id' | 'leaderId' | 'members' | 'challengesSent'>) => {
    const leaderSkills = currentUser.skills.filter(s => s.status === 'verified').map(s => s.name);
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      ...teamData,
      leaderId: currentUserId,
      members: [
        {
          userId: currentUserId,
          role: `${currentUser.role} (Team Lead)`,
          isLeader: true,
          joinedAt: new Date().toISOString().split('T')[0],
          verifiedSkills: leaderSkills
        }
      ],
      challengesSent: []
    };

    setTeams(prev => [newTeam, ...prev]);

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'team_join',
        title: `Created team: ${newTeam.name}`,
        description: `Formed new squad for ${newTeam.hackathonName}. Looking for: ${newTeam.openRoles.join(', ')}.`,
        timestamp: 'Just now'
      },
      ...prev
    ]);
  };

  // Send Team Invitation
  const sendTeamInvitation = (teamId: string, candidateId: string, roleOffered: string, message: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    const newInvite: TeamInvitation = {
      id: `inv-${Date.now()}`,
      teamId,
      teamName: team.name,
      hackathonName: team.hackathonName,
      inviterName: currentUser.name,
      inviterAvatar: currentUser.avatar,
      invitedUserId: candidateId,
      roleOffered,
      message,
      status: 'pending',
      sentAt: new Date().toISOString().split('T')[0]
    };

    setInvitations(prev => [newInvite, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: candidateId,
        title: `Team Invitation: ${team.name}`,
        message: `${currentUser.name} invited you to join ${team.name} as ${roleOffered}.`,
        type: 'invitation',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  // Respond to Invitation
  const respondToInvitation = (invitationId: string, response: 'accepted' | 'declined') => {
    const invite = invitations.find(i => i.id === invitationId);
    if (!invite) return;

    setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, status: response } : i));

    if (response === 'accepted') {
      const myVerifiedSkills = currentUser.skills.filter(s => s.status === 'verified').map(s => s.name);
      setTeams(prev => prev.map(t => {
        if (t.id === invite.teamId) {
          return {
            ...t,
            members: [
              ...t.members,
              {
                userId: currentUserId,
                role: invite.roleOffered,
                joinedAt: new Date().toISOString().split('T')[0],
                verifiedSkills: myVerifiedSkills
              }
            ]
          };
        }
        return t;
      }));

      setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, teamsCount: u.teamsCount + 1 } : u));

      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: 'team_join',
          title: `Joined ${invite.teamName}`,
          description: `Accepted invitation for ${invite.roleOffered} in ${invite.hackathonName}.`,
          timestamp: 'Just now',
          verified: true
        },
        ...prev
      ]);
    }
  };

  // Send Team Challenge
  const sendTeamChallenge = (teamId: string, candidateId: string, skillName: string, difficulty: 'Beginner' | 'Intermediate' | 'Advanced', questionCount: number, timeLimitMinutes: number = 10) => {
    const team = teams.find(t => t.id === teamId);
    const candidate = users.find(u => u.id === candidateId);
    if (!team || !candidate) return;

    const newChallenge: TeamChallenge = {
      id: `ch-${Date.now()}`,
      teamId,
      teamName: team.name,
      candidateId,
      candidateName: candidate.name,
      candidateAvatar: candidate.avatar,
      skillName,
      difficulty,
      questionCount,
      timeLimitMinutes,
      status: 'pending',
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          challengesSent: [newChallenge, ...t.challengesSent]
        };
      }
      return t;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: candidateId,
        title: `Custom Test Challenge from ${team.name}`,
        message: `${team.name} sent you a ${difficulty} ${skillName} technical assessment test (${questionCount} Qs • ${timeLimitMinutes}m).`,
        type: 'challenge',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const startTakingChallenge = (challenge: TeamChallenge) => {
    setActiveChallengeToTake(challenge);
  };

  const submitTeamChallenge = (challengeId: string, score: number, answers?: { [qId: string]: number }, timeSpentSeconds: number = 462) => {
    let recommendation: 'Strong Candidate' | 'Promising Candidate' | 'Needs Practice' = 'Needs Practice';
    if (score >= 85) recommendation = 'Strong Candidate';
    else if (score >= 70) recommendation = 'Promising Candidate';

    // Calculate accuracy percentage
    const accuracy = score >= 90 ? 90 : score >= 80 ? 80 : score;

    setTeams(prev => prev.map(t => {
      return {
        ...t,
        challengesSent: t.challengesSent.map(c => {
          if (c.id === challengeId) {
            return {
              ...c,
              status: 'completed',
              score,
              accuracy,
              timeSpentSeconds,
              recommendation,
              completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              answers,
              feedback: score >= 85
                ? `Demonstrated solid grasp of ${c.skillName} core syntax, edge cases, error boundary handling, and clean code architecture.`
                : score >= 70
                ? `Decent understanding of ${c.skillName} basics. Would benefit from deeper debugging and architectural review.`
                : `Needs further hands-on practice in ${c.skillName} fundamentals before admitting to squad.`
            };
          }
          return c;
        })
      };
    }));

    setActiveChallengeToTake(null);

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'challenge',
        title: `Team Skill Test Evaluated (${score}%)`,
        description: `Candidate test completed. Rating: ${recommendation}.`,
        timestamp: 'Just now',
        badge: `${score}%`,
        verified: score >= 70
      },
      ...prev
    ]);
  };

  const reviewChallengeDecision = (challengeId: string, decision: 'accepted' | 'rejected') => {
    let acceptedCandidateId: string | null = null;

    setTeams(prev => prev.map(t => {
      const targetChallenge = t.challengesSent.find(c => c.id === challengeId);
      if (targetChallenge) {
        acceptedCandidateId = targetChallenge.candidateId;

        const updatedChallenges = t.challengesSent.map(c => {
          if (c.id === challengeId) {
            return {
              ...c,
              status: decision
            } as TeamChallenge;
          }
          return c;
        });

        let updatedMembers = [...t.members];
        if (decision === 'accepted') {
          const candidateUser = users.find(u => u.id === targetChallenge.candidateId);
          if (candidateUser && !updatedMembers.some(m => m.userId === candidateUser.id)) {
            updatedMembers.push({
              userId: candidateUser.id,
              role: `${candidateUser.role}`,
              joinedAt: new Date().toISOString().split('T')[0],
              verifiedSkills: candidateUser.skills.filter(s => s.status === 'verified').map(s => s.name)
            });
          }
        }

        return {
          ...t,
          members: updatedMembers,
          challengesSent: updatedChallenges
        };
      }
      return t;
    }));

    if (decision === 'accepted' && acceptedCandidateId) {
      setUsers(prev => prev.map(u => u.id === acceptedCandidateId ? { ...u, teamsCount: u.teamsCount + 1 } : u));
    }
  };

  const updateProfile = (updatedData: Partial<Omit<User, 'id' | 'overallScore' | 'skills' | 'certifications'>>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          ...updatedData
        };
      }
      return u;
    }));
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'proof',
        title: 'Profile Updated',
        description: 'Updated academic and professional credentials.',
        timestamp: 'Just now'
      },
      ...prev
    ]);
  };

  const updateAvatar = (newAvatarUrl: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          avatar: newAvatarUrl
        };
      }
      return u;
    }));
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'proof',
        title: 'Profile Picture Updated',
        description: 'New verified profile image uploaded.',
        timestamp: 'Just now'
      },
      ...prev
    ]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read && n.userId === currentUserId).length;

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('user-rahul');
    setIsAuthenticated(true);
    setTeams(INITIAL_TEAMS);
    setInvitations(INITIAL_INVITATIONS);
    setActivities(INITIAL_ACTIVITIES);
    setAttempts([]);
    setCurrentPage('dashboard');
  };

  // Recruiter Specific Actions
  const selectCollege = (collegeId: string) => {
    setSelectedCollegeId(collegeId);
    const college = partnerColleges.find(c => c.id === collegeId);
    if (college) {
      recordRecruiterActivity({
        type: 'college_selected',
        title: `Selected ${college.name}`,
        description: `Campus recruitment workspace switched to ${college.shortName} (${college.location}).`
      });
    }
  };

  const selectRequirement = (reqId: string | null) => {
    setSelectedRequirementId(reqId);
    if (reqId) {
      const req = recruitmentRequirements.find(r => r.id === reqId);
      if (req) {
        recordRecruiterActivity({
          type: 'requirement_created',
          title: `Loaded criteria for ${req.title}`,
          description: `Set requirements: Min CGPA ${req.minCgpa}, Verified: ${req.requiredVerifiedSkills.join(', ')}`
        });
      }
    }
  };

  const createRequirement = (reqData: Omit<RecruitmentRequirement, 'id' | 'createdAt'>) => {
    const newReq: RecruitmentRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRecruitmentRequirements(prev => [newReq, ...prev]);
    setSelectedRequirementId(newReq.id);
    recordRecruiterActivity({
      type: 'requirement_created',
      title: `Created requirement: ${reqData.title}`,
      description: `Targeting ${reqData.college || 'Selected College'} with Min CGPA ${reqData.minCgpa}.`
    });
  };

  const updateRequirement = (id: string, updates: Partial<RecruitmentRequirement>) => {
    setRecruitmentRequirements(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const shortlistCandidate = (candidateId: string, roleName?: string, notes?: string) => {
    const candidate = users.find(u => u.id === candidateId);
    if (!candidate) return;
    const existing = shortlistedCandidates.find(s => s.candidateId === candidateId && s.recruiterId === currentUserId);
    if (existing) {
      setShortlistedCandidates(prev => prev.map(s => s.id === existing.id ? { ...s, status: 'shortlisted', targetRole: roleName || s.targetRole, notes: notes || s.notes } : s));
    } else {
      const newRecord: CandidateShortlistRecord = {
        id: `shortlist-${Date.now()}`,
        recruiterId: currentUserId,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAvatar: candidate.avatar,
        college: candidate.college || 'Partner College',
        branch: candidate.branch || 'Computer Science & Engineering',
        cgpa: candidate.cgpa ? String(candidate.cgpa) : '8.5',
        targetRole: roleName || 'Software Engineering Intern',
        status: 'shortlisted',
        notes: notes || 'Shortlisted based on verified assessment scores and project proof.',
        dateAdded: new Date().toISOString().split('T')[0],
        verifiedSkills: candidate.skills.filter(s => s.status === 'verified').map(s => s.name),
        assessmentScore: candidate.overallScore
      };
      setShortlistedCandidates(prev => [newRecord, ...prev]);
    }
    recordRecruiterActivity({
      type: 'candidate_shortlisted',
      candidateId: candidate.id,
      candidateName: candidate.name,
      title: `Shortlisted ${candidate.name}`,
      description: `Added ${candidate.name} to shortlist for ${roleName || 'Software Engineering Intern'}.`
    });
  };

  const saveCandidate = (candidateId: string, roleName?: string) => {
    const candidate = users.find(u => u.id === candidateId);
    if (!candidate) return;
    const existing = shortlistedCandidates.find(s => s.candidateId === candidateId && s.recruiterId === currentUserId);
    if (existing) {
      setShortlistedCandidates(prev => prev.map(s => s.id === existing.id ? { ...s, status: 'saved' } : s));
    } else {
      const newRecord: CandidateShortlistRecord = {
        id: `shortlist-${Date.now()}`,
        recruiterId: currentUserId,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAvatar: candidate.avatar,
        college: candidate.college || 'Partner College',
        branch: candidate.branch || 'Computer Science & Engineering',
        cgpa: candidate.cgpa ? String(candidate.cgpa) : '8.5',
        targetRole: roleName || 'General Evaluation',
        status: 'saved',
        dateAdded: new Date().toISOString().split('T')[0],
        verifiedSkills: candidate.skills.filter(s => s.status === 'verified').map(s => s.name),
        assessmentScore: candidate.overallScore
      };
      setShortlistedCandidates(prev => [newRecord, ...prev]);
    }
    recordRecruiterActivity({
      type: 'candidate_saved',
      candidateId: candidate.id,
      candidateName: candidate.name,
      title: `Saved ${candidate.name}`,
      description: `Saved profile for future recruitment pipeline review.`
    });
  };

  const removeCandidateFromShortlist = (candidateId: string) => {
    setShortlistedCandidates(prev => prev.filter(s => !(s.candidateId === candidateId && s.recruiterId === currentUserId)));
  };

  const updateCandidateShortlistStatus = (recordId: string, status: CandidateShortlistRecord['status']) => {
    setShortlistedCandidates(prev => prev.map(s => s.id === recordId ? { ...s, status } : s));
  };

  const recordRecruiterActivity = (activity: Omit<RecruiterActivityRecord, 'id' | 'recruiterId' | 'timestamp'>) => {
    const newActivity: RecruiterActivityRecord = {
      ...activity,
      id: `rec-act-${Date.now()}`,
      recruiterId: currentUserId,
      timestamp: 'Just now'
    };
    setRecruiterActivities(prev => [newActivity, ...prev]);
  };

  const updateRecruiterCompanyProfile = (profileUpdates: Partial<RecruiterCompanyProfile>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUserId) {
        return {
          ...u,
          ...profileUpdates
        };
      }
      return u;
    }));
    recordRecruiterActivity({
      type: 'candidate_viewed',
      title: 'Recruiter Profile Updated',
      description: 'Company profile and hiring preferences were saved successfully.'
    });
  };

  // Pro Payment and Subscription Handlers
  const createProOrder = async (): Promise<RazorpayOrderResponse> => {
    if (isRecruiter) {
      throw new Error('Pro subscriptions are only available for student accounts.');
    }
    return await apiCreateProOrder(currentUserId);
  };

  const verifyAndActivatePro = async (payload: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    userId?: string;
    email?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isRecruiter) {
        return { success: false, error: 'Recruiter accounts are not eligible for RecruitCred Pro.' };
      }
      const orderId = payload.razorpay_order_id || payload.orderId || '';
      const paymentId = payload.razorpay_payment_id || payload.paymentId || '';
      const signature = payload.razorpay_signature || payload.signature || '';
      const uId = payload.userId || currentUserId;
      const email = payload.email || currentUser.email;

      const result = await apiVerifyPaymentSignature({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        userId: uId,
        email
      });

      if (result.verified) {
        setSubscriptions(prev => {
          const filtered = prev.filter(s => s.userId !== uId);
          return [...filtered, result.subscription];
        });

        setTransactions(prev => [result.transaction, ...prev.filter(t => t.paymentId !== result.transaction.paymentId)]);

        // Update user state
        setUsers(prev => prev.map(u => {
          if (u.id === uId) {
            return {
              ...u,
              isPro: true,
              proSubscription: result.subscription
            };
          }
          return u;
        }));

        setActivities(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'proof',
            title: 'RecruitCred Pro Activated',
            description: 'Priority profile visibility enabled across campus drives.',
            timestamp: 'Just now'
          },
          ...prev
        ]);

        return { success: true };
      }
      return { success: false, error: 'Payment signature could not be verified' };
    } catch (err: any) {
      console.error('[AppContext] Failed to verify payment signature:', err);
      return { success: false, error: err.message || 'Payment verification failed' };
    }
  };

  const cancelPro = async (): Promise<boolean> => {
    try {
      const updated = await apiCancelProSubscription(currentUserId);
      if (updated) {
        setSubscriptions(prev => prev.map(s => {
          if (s.userId === currentUserId && s.id === updated.id) {
            return updated;
          }
          return s;
        }));

        setUsers(prev => prev.map(u => {
          if (u.id === currentUserId) {
            return {
              ...u,
              isPro: false,
              proSubscription: updated
            };
          }
          return u;
        }));

        setActivities(prev => [
          {
            id: `act-${Date.now()}`,
            type: 'proof',
            title: 'Pro Subscription Cancelled',
            description: 'RecruitCred Pro plan set to expire at end of billing cycle.',
            timestamp: 'Just now'
          },
          ...prev
        ]);

        return true;
      }
      return false;
    } catch (err) {
      console.error('[AppContext] Failed to cancel Pro subscription:', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isRecruiter,
        currentUser,
        allUsers: users,
        isAuthModalOpen,
        authModalMode,
        isFirstTimeUser,
        activeAssessmentSessionId,
        setActiveAssessmentSessionId,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        syncUserSession,
        isUsernameAvailable,
        logout,
        loginAsDemoUser,
        assessments,
        hackathons,
        teams,
        invitations,
        activities,
        notifications,
        attempts,
        currentPage,
        selectedAssessmentId,
        selectedAttemptId,
        selectedTeamId,
        selectedHackathonId,
        activeChallengeToTake,
        searchQuery,
        isSidebarCollapsed,
        partnerColleges,
        recruitmentRequirements,
        shortlistedCandidates,
        recruiterActivities,
        selectedCollegeId,
        selectedRequirementId,
        selectCollege,
        selectRequirement,
        createRequirement,
        updateRequirement,
        shortlistCandidate,
        saveCandidate,
        removeCandidateFromShortlist,
        updateCandidateShortlistStatus,
        recordRecruiterActivity,
        updateRecruiterCompanyProfile,
        navigateTo,
        setSearchQuery,
        toggleSidebar,
        switchUser,
        addSkill,
        connectProofToSkill,
        startAssessment,
        submitAssessment,
        createTeam,
        sendTeamInvitation,
        respondToInvitation,
        sendTeamChallenge,
        startTakingChallenge,
        submitTeamChallenge,
        reviewChallengeDecision,
        updateProfile,
        updateAvatar,
        isPro: isRecruiter ? false : (isUserPro || Boolean(currentUser.isPro)),
        proSubscription: isRecruiter ? null : (activeUserSubscription || currentUser.proSubscription || null),
        paymentTransactions: transactions.filter(t => t.userId === currentUserId),
        createProOrder,
        verifyAndActivatePro,
        cancelPro,
        markNotificationsAsRead,
        unreadNotificationsCount,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
