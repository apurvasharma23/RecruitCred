import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface DbUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  passwordHash: string;
  uniqueUserId: string;
  username: string;
  emailVerified: boolean;
  createdAt: string;
  accountType: 'student' | 'recruiter';
  role: string;
  bio: string;
  college?: string;
  branch?: string;
  gradYear?: string;
  education?: string;
  location?: string;
  avatar: string;
  overallScore: number;
  skills: Array<{
    id: string;
    name: string;
    category: 'Frontend' | 'Backend' | 'AI & ML' | 'Systems' | 'Cloud & DevOps' | 'Mobile' | 'UI/UX';
    status: 'claimed' | 'verified';
    score?: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    verifiedAt?: string;
    assessmentId?: string;
    verificationId?: string;
    proofSources?: any[];
  }>;
  projects?: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    githubUrl?: string;
    verifiedSkills: string[];
    stars?: number;
  }>;
  certifications?: Array<{
    id: string;
    title: string;
    issuer: string;
    issuedDate: string;
    expiryDate?: string;
    credentialId: string;
    credentialUrl?: string;
    skills: string[];
  }>;
  githubUsername?: string;
  leetcodeUsername?: string;
  companyName?: string;
  designation?: string;
  workEmail?: string;
  isPro?: boolean;
}

export interface DbOtpSession {
  id: string;
  email: string;
  otpHash: string;
  expiresAt: number; // ms timestamp
  attempts: number;
  maxAttempts: number;
  resendCount: number;
  lastSentAt: number;
  verified: boolean;
  regToken?: string;
  fullName?: string;
  uniqueUserId?: string;
  passwordHash?: string;
  accountType?: 'student' | 'recruiter';
}

export interface DbViolationEvent {
  id: string;
  assessmentSessionId: string;
  userId: string;
  type:
    | 'multiple_people_critical'
    | 'multiple_faces'
    | 'prohibited_object'
    | 'camera_interruption'
    | 'additional_camera'
    | 'tab_switch'
    | 'focus_loss'
    | 'fullscreen_exit'
    | 'copy_paste'
    | 'gaze_deviation'
    | 'presence_loss';
  timestamp: string;
  metadata?: Record<string, any>;
  warningNumber: number;
  severity: 'low' | 'medium' | 'high';
  details: string;
}

export interface DbAssessmentSession {
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
  correctAnswersCount?: number;
  score?: number;
  accuracy?: number;
  passed?: boolean;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  integrityPenalty?: number;
}

export interface DbEmailDeliveryLog {
  id: string;
  requestId: string;
  recipientEmail: string;
  timestamp: string;
  provider: string;
  messageId?: string;
  status: 'sent' | 'failed' | 'rejected';
  responseDetails?: string;
  errorDetails?: string;
}

interface DatabaseSchema {
  users: DbUser[];
  otpSessions: DbOtpSession[];
  assessmentSessions: DbAssessmentSession[];
  violationEvents: DbViolationEvent[];
  emailDeliveryLogs: DbEmailDeliveryLog[];
}

const DB_DIR = path.resolve(process.cwd(), 'scratch');
const DB_FILE = path.join(DB_DIR, 'server_db.json');

// Ensure storage directory exists
if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch {}
}

const getInitialUsers = (): DbUser[] => {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('password123', salt);

  return [
    {
      id: 'user-rahul',
      fullName: 'Rahul Sharma',
      name: 'Rahul Sharma',
      email: 'rahul@thapar.edu',
      passwordHash: defaultPasswordHash,
      uniqueUserId: 'rahulsharma',
      username: 'rahulsharma',
      emailVerified: true,
      createdAt: '2026-01-15T10:00:00.000Z',
      accountType: 'student',
      role: 'Full-Stack Developer & AI Enthusiast',
      bio: 'Final year CSE undergraduate at Thapar Institute. Specializing in high-performance Python microservices, distributed systems, and React web apps.',
      college: 'Thapar Institute of Engineering & Technology',
      branch: 'Computer Science & Engineering',
      gradYear: '2026',
      education: 'B.Tech in Computer Science & Engineering, Thapar Institute',
      location: 'Patiala / Bengaluru, India',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      overallScore: 88,
      githubUsername: 'rahulsharma-dev',
      leetcodeUsername: 'rahul_codes',
      isPro: true,
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
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Distributed Event-Driven Order Processing Engine',
          description: 'Production-ready event-sourcing backend utilizing FastAPI, Redis Pub/Sub, and PostgreSQL with zero-data-loss commit semantics.',
          tags: ['Python', 'FastAPI', 'Redis', 'PostgreSQL', 'Docker'],
          githubUrl: 'https://github.com/rahulsharma-dev/fastapi-microservices-demo',
          verifiedSkills: ['Python', 'Docker'],
          stars: 18
        },
        {
          id: 'proj-2',
          title: 'Real-Time Collaborative Code Playground',
          description: 'WebRTC & WebSocket powered paired programming canvas featuring CRDT conflict resolution and isolated WebWorker code execution.',
          tags: ['React', 'TypeScript', 'WebSockets', 'TailwindCSS'],
          githubUrl: 'https://github.com/rahulsharma-dev/ecommerce-state-manager',
          verifiedSkills: ['React', 'TypeScript'],
          stars: 32
        }
      ],
      certifications: [
        {
          id: 'cert-py-01',
          title: 'RecruitCred Certified Python Systems Specialist (Level 4)',
          issuer: 'RecruitCred Autonomous Assessment Authority',
          issuedDate: '2026-03-08',
          credentialId: 'RC-V92-PYT-4819',
          skills: ['Python', 'Algorithms', 'FastAPI']
        }
      ]
    },
    {
      id: 'user-rohan',
      fullName: 'Rohan Mehta',
      name: 'Rohan Mehta',
      email: 'rohan@enterprise.com',
      passwordHash: defaultPasswordHash,
      uniqueUserId: 'rohan_lead',
      username: 'rohan_lead',
      emailVerified: true,
      createdAt: '2026-01-10T08:00:00.000Z',
      accountType: 'recruiter',
      role: 'Lead Campus Talent Acquisition Partner',
      bio: 'Head of Emerging Talent & University Relations at Enterprise Tech Partners. Hiring top tier engineers backed by cryptographic proof.',
      college: 'Enterprise Tech Partners',
      location: 'Bengaluru, India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      overallScore: 95,
      companyName: 'Enterprise Tech Partners',
      designation: 'University Talent Lead',
      workEmail: 'rohan@enterprise.com',
      skills: [],
      projects: [],
      certifications: []
    }
  ];
};

class DatabaseService {
  private inMemoryDb: DatabaseSchema;

  constructor() {
    this.inMemoryDb = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          // Ensure default users exist
          const initialUsers = getInitialUsers();
          initialUsers.forEach(initUser => {
            if (!parsed.users.some((u: DbUser) => u.uniqueUserId === initUser.uniqueUserId || u.id === initUser.id)) {
              parsed.users.push(initUser);
            }
          });
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[DB] Failed to load server database file, initializing defaults:', e);
    }

    const defaultDb: DatabaseSchema = {
      users: getInitialUsers(),
      otpSessions: [],
      assessmentSessions: [],
      violationEvents: [],
      emailDeliveryLogs: []
    };
    this.persistDatabase(defaultDb);
    return defaultDb;
  }

  private persistDatabase(db: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Error persisting database file:', e);
    }
  }

  private sync() {
    this.persistDatabase(this.inMemoryDb);
  }

  // --- USER METHODS ---

  public getAllUsers(): DbUser[] {
    return this.inMemoryDb.users;
  }

  public getUserById(id: string): DbUser | null {
    return this.inMemoryDb.users.find(u => u.id === id) || null;
  }

  public getUserByUsername(username: string): DbUser | null {
    if (!username) return null;
    const normalized = username.trim().toLowerCase();
    return this.inMemoryDb.users.find(u => u.uniqueUserId.toLowerCase() === normalized || u.username.toLowerCase() === normalized) || null;
  }

  public getUserByEmail(email: string): DbUser | null {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return this.inMemoryDb.users.find(u => u.email.toLowerCase() === normalized) || null;
  }

  public createUser(user: DbUser): DbUser {
    this.inMemoryDb.users.unshift(user);
    this.sync();
    return user;
  }

  public updateUser(id: string, updates: Partial<DbUser>): DbUser | null {
    const idx = this.inMemoryDb.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.inMemoryDb.users[idx] = { ...this.inMemoryDb.users[idx], ...updates };
    this.sync();
    return this.inMemoryDb.users[idx];
  }

  // --- OTP SESSION METHODS ---

  public getOtpSessionByEmail(email: string): DbOtpSession | null {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return this.inMemoryDb.otpSessions.find(s => s.email.toLowerCase() === normalized) || null;
  }

  public getOtpSessionByToken(token: string): DbOtpSession | null {
    if (!token) return null;
    return this.inMemoryDb.otpSessions.find(s => s.regToken === token) || null;
  }

  public saveOtpSession(session: DbOtpSession): DbOtpSession {
    const existingIdx = this.inMemoryDb.otpSessions.findIndex(s => s.email.toLowerCase() === session.email.toLowerCase());
    if (existingIdx >= 0) {
      this.inMemoryDb.otpSessions[existingIdx] = session;
    } else {
      this.inMemoryDb.otpSessions.push(session);
    }
    this.sync();
    return session;
  }

  public deleteOtpSession(email: string) {
    const normalized = email.trim().toLowerCase();
    this.inMemoryDb.otpSessions = this.inMemoryDb.otpSessions.filter(s => s.email.toLowerCase() !== normalized);
    this.sync();
  }

  // --- ASSESSMENT SESSION METHODS ---

  public getAssessmentSession(id: string): DbAssessmentSession | null {
    return this.inMemoryDb.assessmentSessions.find(s => s.id === id) || null;
  }

  public getActiveSessionForUserAndAssessment(userId: string, assessmentId: string): DbAssessmentSession | null {
    return (
      this.inMemoryDb.assessmentSessions.find(
        s => s.userId === userId && s.assessmentId === assessmentId && s.status === 'in_progress'
      ) || null
    );
  }

  public createAssessmentSession(session: DbAssessmentSession): DbAssessmentSession {
    this.inMemoryDb.assessmentSessions.unshift(session);
    this.sync();
    return session;
  }

  public updateAssessmentSession(id: string, updates: Partial<DbAssessmentSession>): DbAssessmentSession | null {
    const idx = this.inMemoryDb.assessmentSessions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.inMemoryDb.assessmentSessions[idx] = { ...this.inMemoryDb.assessmentSessions[idx], ...updates };
    this.sync();
    return this.inMemoryDb.assessmentSessions[idx];
  }

  // --- VIOLATION EVENT METHODS ---

  public recordViolationEvent(event: DbViolationEvent): DbViolationEvent {
    this.inMemoryDb.violationEvents.push(event);
    this.sync();
    return event;
  }

  public getViolationEventsBySession(sessionId: string): DbViolationEvent[] {
    return this.inMemoryDb.violationEvents.filter(e => e.assessmentSessionId === sessionId);
  }

  // --- EMAIL DELIVERY LOG METHODS ---

  public recordEmailDeliveryLog(log: DbEmailDeliveryLog): DbEmailDeliveryLog {
    if (!this.inMemoryDb.emailDeliveryLogs) {
      this.inMemoryDb.emailDeliveryLogs = [];
    }
    this.inMemoryDb.emailDeliveryLogs.unshift(log);
    this.sync();
    return log;
  }

  public getEmailDeliveryLogs(): DbEmailDeliveryLog[] {
    return this.inMemoryDb.emailDeliveryLogs || [];
  }
}

export const db = new DatabaseService();
