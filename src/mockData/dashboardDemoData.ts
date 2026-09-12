import { DigitalCertificate } from '../types';

export interface SkillDevelopmentItem {
  id: string;
  name: string;
  category: 'Programming' | 'Web Development' | 'Data & AI' | 'Mechanical / Engineering' | 'Electronics' | 'Professional / Career Skills';
  currentStatus: 'Claimed' | 'Evidence-backed' | 'Assessed' | 'Verified';
  evidenceSnippet?: string;
  assessmentStatus: string; // e.g. "86%", "Not assessed", "Not attempted"
  assessmentScore?: number;
  recruitmentRelevance: 'High' | 'Very High' | 'Medium';
  recommendedAction: 'Take Assessment' | 'Add Evidence' | 'View Skill' | 'View Certificate';
  assessmentId?: string;
}

export interface CompanyRequirement {
  id: string;
  company: string;
  role: string;
  minAssessment: string;
  minScoreNumber: number;
  requiredAssessment: string;
  requiredCertification: string;
  eligibility: 'Eligible' | 'Likely Eligible' | 'Assessment Required' | 'Certification Required' | 'Missing';
  isDemoRequirement: boolean;
  branch: string;
  minCgpa: number;
  skills: string[];
  description: string;
  userAssessmentScore?: number;
  userHasCertification?: boolean;
}

export interface DashboardKPIs {
  credibilityScore: number;
  verifiedSkillsCount: number;
  evidenceItemsCount: number;
  assessmentsCompleted: number;
  profileStrength: number;
}

export interface CredibilitySkillStage {
  name: string;
  category: string;
  claimed: boolean;
  evidenceBacked: boolean;
  assessed: boolean;
  verified: boolean;
  score?: number;
  level: string;
  verificationId?: string;
  evidenceSnippet?: string;
  repoUrl?: string;
}

export interface OpportunityItem {
  id: string;
  company: string;
  logo?: string;
  role: string;
  location: string;
  type: string;
  stipendOrSalary: string;
  deadline: string;
  description: string;
  branchEligible: string;
  yearEligible: string;
  cgpaRequired: string;
  skillMatchPercentage: number;
  credibilityMatchPercentage: number;
  requiredSkills: string[];
  status: 'Likely Eligible' | 'Highly Recommended' | 'Action Required';
}

export interface NationalBenchmarkItem {
  skill: string;
  userScore: number;
  benchmarkScore: number;
  deltaPercentage: number;
}

export interface HackathonHistoryItem {
  id: string;
  title: string;
  year: string;
  result: 'Winner' | 'Finalist' | 'Participant';
  teamName: string;
  role: string;
  projectTitle: string;
  skillsUsed: string[];
  evidenceText: string;
  repoUrl?: string;
}

export interface FeaturedProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  evidenceType: string;
  status: 'Evidence-backed' | 'Verified Artifact';
  githubUrl: string;
  liveUrl?: string;
  stars: number;
  forks: number;
  userContribution: string;
}

export interface LeetCodeStats {
  username: string;
  profileUrl: string;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  contestRating: number;
  globalRankingTopPercent: number;
  recentActivity: string;
}

export interface ReadinessFactor {
  category: string;
  score: number;
  status: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'assessment' | 'evidence' | 'opportunity' | 'achievement' | 'verification';
  badge?: string;
}

export interface DashboardDemoData {
  kpis: DashboardKPIs;
  skillDevelopment: SkillDevelopmentItem[];
  companyRequirements: CompanyRequirement[];
  certificates: DigitalCertificate[];
  credibilityStages: CredibilitySkillStage[];
  opportunities: OpportunityItem[];
  benchmarks: {
    percentile: string;
    cohortSize: string;
    items: NationalBenchmarkItem[];
  };
  growthData: { month: string; python: number; react: number; problemSolving: number }[];
  skillGrowthTimeline: { month: string; score: number }[];
  assessmentPerformanceData: { skill: string; score: number; passScore: number }[];
  credibilityBreakdownData: { name: string; value: number; color: string }[];
  benchmarkComparison: { candidateReadiness: number; nationalBenchmark: number; delta: number; cohortLabel: string };
  assessmentScores: { skill: string; score: number; accuracy: number }[];
  credibilityDistribution: { name: string; value: number; color: string }[];
  readinessFactors: ReadinessFactor[];
  overallReadiness: number;
  hackathons: HackathonHistoryItem[];
  achievements: {
    hackathonWins: string;
    teamProjects: string;
    assessmentsPassed: string;
    evidenceItems: string;
    percentileBadge: string;
  };
  featuredProjects: FeaturedProjectItem[];
  leetcode: LeetCodeStats;
  recentActivity: ActivityItem[];
}

export const DASHBOARD_DEMO_DATA: DashboardDemoData = {
  kpis: {
    credibilityScore: 84,
    verifiedSkillsCount: 7,
    evidenceItemsCount: 12,
    assessmentsCompleted: 5,
    profileStrength: 91
  },

  skillDevelopment: [
    {
      id: 'sd-react',
      name: 'React',
      category: 'Web Development',
      currentStatus: 'Evidence-backed',
      evidenceSnippet: 'ecommerce-state-manager • 32 GitHub stars',
      assessmentStatus: 'Not assessed',
      recruitmentRelevance: 'High',
      recommendedAction: 'Take Assessment',
      assessmentId: 'react-core'
    },
    {
      id: 'sd-solidworks',
      name: 'SolidWorks',
      category: 'Mechanical / Engineering',
      currentStatus: 'Claimed',
      evidenceSnippet: 'CAD Design claim on profile',
      assessmentStatus: 'Not attempted',
      recruitmentRelevance: 'High',
      recommendedAction: 'Add Evidence'
    },
    {
      id: 'sd-python',
      name: 'Python',
      category: 'Programming',
      currentStatus: 'Verified',
      evidenceSnippet: '18 GitHub commits • fastapi-microservices-demo',
      assessmentStatus: '86%',
      assessmentScore: 86,
      recruitmentRelevance: 'Very High',
      recommendedAction: 'View Skill',
      assessmentId: 'python-core'
    },
    {
      id: 'sd-cad',
      name: 'CAD Fundamentals',
      category: 'Mechanical / Engineering',
      currentStatus: 'Verified',
      evidenceSnippet: 'Finite Element CAD Stress Simulator',
      assessmentStatus: '81%',
      assessmentScore: 81,
      recruitmentRelevance: 'High',
      recommendedAction: 'View Certificate',
      assessmentId: 'cad-core'
    },
    {
      id: 'sd-problem-solving',
      name: 'Problem Solving',
      category: 'Professional / Career Skills',
      currentStatus: 'Verified',
      evidenceSnippet: '186 LeetCode problems solved (1542 rating)',
      assessmentStatus: '88%',
      assessmentScore: 88,
      recruitmentRelevance: 'Very High',
      recommendedAction: 'View Skill',
      assessmentId: 'problem-solving-core'
    },
    {
      id: 'sd-c',
      name: 'C Programming',
      category: 'Programming',
      currentStatus: 'Assessed',
      evidenceSnippet: 'Systems level matrix solver',
      assessmentStatus: '82%',
      assessmentScore: 82,
      recruitmentRelevance: 'High',
      recommendedAction: 'View Certificate',
      assessmentId: 'cpp-core'
    },
    {
      id: 'sd-opencv',
      name: 'OpenCV & Computer Vision',
      category: 'Data & AI',
      currentStatus: 'Evidence-backed',
      evidenceSnippet: 'opencv-vision-pipeline • 28 stars',
      assessmentStatus: 'Not assessed',
      recruitmentRelevance: 'High',
      recommendedAction: 'Take Assessment',
      assessmentId: 'python-core'
    },
    {
      id: 'sd-arduino',
      name: 'Arduino & Embedded Systems',
      category: 'Electronics',
      currentStatus: 'Claimed',
      evidenceSnippet: 'Smart dustbin sensor prototype',
      assessmentStatus: 'Not attempted',
      recruitmentRelevance: 'Medium',
      recommendedAction: 'Add Evidence'
    },
    {
      id: 'sd-sql',
      name: 'SQL & Data Analysis',
      category: 'Data & AI',
      currentStatus: 'Assessed',
      evidenceSnippet: 'Distributed Query Engine Schemas',
      assessmentStatus: '74%',
      assessmentScore: 74,
      recruitmentRelevance: 'High',
      recommendedAction: 'Take Assessment',
      assessmentId: 'sql-core'
    }
  ],

  companyRequirements: [
    {
      id: 'cr-autoworks',
      company: 'AutoWorks',
      role: 'Mechanical Engineering Intern',
      minAssessment: '75%',
      minScoreNumber: 75,
      requiredAssessment: 'CAD Fundamentals',
      requiredCertification: 'RecruitCred CAD Fundamentals Certificate',
      eligibility: 'Eligible',
      isDemoRequirement: true,
      branch: 'Mechanical / Mechatronics / Allied',
      minCgpa: 7.5,
      skills: ['CAD', 'Mechanical Design', '3D Modeling', 'SolidWorks'],
      description: 'Design structural component models, conduct FEA tolerance checks, and collaborate on mechanical assemblies.',
      userAssessmentScore: 81,
      userHasCertification: true
    },
    {
      id: 'cr-demotech',
      company: 'DemoTech',
      role: 'Software Intern',
      minAssessment: '70%',
      minScoreNumber: 70,
      requiredAssessment: 'Python Fundamentals',
      requiredCertification: 'RecruitCred Python Fundamentals Certificate',
      eligibility: 'Eligible',
      isDemoRequirement: true,
      branch: 'CSE / IT / Allied Engineering',
      minCgpa: 7.0,
      skills: ['Python', 'Data Structures', 'Problem Solving', 'Git'],
      description: 'Develop backend API endpoints, write automated tests, and optimize data processing routines.',
      userAssessmentScore: 86,
      userHasCertification: true
    },
    {
      id: 'cr-datacore',
      company: 'DataCore',
      role: 'Data Analyst Intern',
      minAssessment: '80%',
      minScoreNumber: 80,
      requiredAssessment: 'SQL Fundamentals',
      requiredCertification: 'RecruitCred SQL Assessment Certificate',
      eligibility: 'Assessment Required',
      isDemoRequirement: true,
      branch: 'All Engineering Streams',
      minCgpa: 7.0,
      skills: ['SQL', 'Pandas', 'Data Analysis', 'NumPy'],
      description: 'Build automated reporting queries, analyze telemetry trends, and optimize relational database schemas.',
      userAssessmentScore: 74,
      userHasCertification: false
    },
    {
      id: 'cr-innovateai',
      company: 'InnovateAI',
      role: 'AI / Machine Learning Intern',
      minAssessment: '80%',
      minScoreNumber: 80,
      requiredAssessment: 'Python + ML Assessment',
      requiredCertification: 'RecruitCred Machine Learning Certificate',
      eligibility: 'Likely Eligible',
      isDemoRequirement: true,
      branch: 'CSE / AI / EE / Allied',
      minCgpa: 7.8,
      skills: ['Python', 'Machine Learning', 'OpenCV', 'Computer Vision'],
      description: 'Train and benchmark vision models, optimize inference pipeline latency, and annotate validation sets.',
      userAssessmentScore: 86,
      userHasCertification: false
    },
    {
      id: 'cr-tatamotors',
      company: 'Tata Motors',
      role: 'Autonomous Systems & Robotics Intern',
      minAssessment: '75%',
      minScoreNumber: 75,
      requiredAssessment: 'CAD + Python Assessment',
      requiredCertification: 'RecruitCred CAD Fundamentals Certificate',
      eligibility: 'Eligible',
      isDemoRequirement: true,
      branch: 'Mech / CSE / EE / Mechatronics',
      minCgpa: 7.5,
      skills: ['Python', 'CAD / SolidWorks', 'Embedded C', 'Robotics'],
      description: 'Design and evaluate embedded simulation nodes for vehicle telemetry and autonomous perception.',
      userAssessmentScore: 86,
      userHasCertification: true
    }
  ],

  certificates: [
    {
      id: 'cert-rc-py-1',
      certificateId: 'RC-PY-2026-001482',
      candidateName: 'Rahul Sharma',
      candidateId: 'user-rahul',
      assessmentName: 'Python Fundamentals Assessment',
      skillName: 'Python',
      score: 86,
      issueDate: '13 Sep 2026',
      status: 'Valid',
      issuer: 'RecruitCred',
      verificationUrl: 'https://recruitcred.dev/verify/RC-PY-2026-001482',
      criteria: 'Demonstrated mastery of Python fundamentals, data structures, memory management, generators, decorators, and OOP (Score >= 70% threshold).'
    },
    {
      id: 'cert-rc-cad-1',
      certificateId: 'RC-CAD-2026-008120',
      candidateName: 'Rahul Sharma',
      candidateId: 'user-rahul',
      assessmentName: 'CAD Fundamentals Assessment',
      skillName: 'CAD Fundamentals',
      score: 81,
      issueDate: '05 Sep 2026',
      status: 'Valid',
      issuer: 'RecruitCred',
      verificationUrl: 'https://recruitcred.dev/verify/RC-CAD-2026-008120',
      criteria: 'Validated parametric 3D modeling, geometric tolerance analysis, assembly constraints, and CAD export standards.'
    },
    {
      id: 'cert-rc-ps-1',
      certificateId: 'RC-PS-2026-003914',
      candidateName: 'Rahul Sharma',
      candidateId: 'user-rahul',
      assessmentName: 'Problem Solving Assessment',
      skillName: 'Problem Solving',
      score: 88,
      issueDate: '29 Aug 2026',
      status: 'Valid',
      issuer: 'RecruitCred',
      verificationUrl: 'https://recruitcred.dev/verify/RC-PS-2026-003914',
      criteria: 'Proven proficiency in algorithmic time complexity, graph traversal, dynamic programming, and edge-case handling.'
    },
    {
      id: 'cert-rc-cp-1',
      certificateId: 'RC-CP-2026-002108',
      candidateName: 'Rahul Sharma',
      candidateId: 'user-rahul',
      assessmentName: 'C Programming Assessment',
      skillName: 'C Programming',
      score: 82,
      issueDate: '18 Aug 2026',
      status: 'Valid',
      issuer: 'RecruitCred',
      verificationUrl: 'https://recruitcred.dev/verify/RC-CP-2026-002108',
      criteria: 'Assessed pointer arithmetic, manual heap memory management, bitwise operations, and structure layouts.'
    }
  ],

  credibilityStages: [
    {
      name: 'Python',
      category: 'Programming Languages',
      claimed: true,
      evidenceBacked: true,
      assessed: true,
      verified: true,
      score: 92,
      level: 'Expert',
      verificationId: 'RC-V92-PYT-4819',
      evidenceSnippet: '18 GitHub commits • fastapi-microservices-demo',
      repoUrl: 'https://github.com/rahulsharma-dev/fastapi-microservices-demo'
    },
    {
      name: 'React',
      category: 'Frontend',
      claimed: true,
      evidenceBacked: true,
      assessed: true,
      verified: true,
      score: 86,
      level: 'Advanced',
      verificationId: 'RC-V86-RCT-9482',
      evidenceSnippet: 'ecommerce-state-manager • 32 GitHub stars',
      repoUrl: 'https://github.com/rahulsharma-dev/ecommerce-state-manager'
    },
    {
      name: 'SQL & Database Design',
      category: 'Backend',
      claimed: true,
      evidenceBacked: true,
      assessed: true,
      verified: true,
      score: 88,
      level: 'Advanced',
      verificationId: 'RC-V88-SQL-3912',
      evidenceSnippet: 'Distributed Query Engine Schemas',
      repoUrl: 'https://github.com/rahulsharma-dev/task-queue-redis'
    },
    {
      name: 'CAD / SolidWorks',
      category: 'Engineering & Systems',
      claimed: true,
      evidenceBacked: true,
      assessed: true,
      verified: true,
      score: 79,
      level: 'Intermediate',
      verificationId: 'RC-V79-CAD-8120',
      evidenceSnippet: 'Finite Element CAD Stress Simulator',
      repoUrl: 'https://github.com/rahulsharma-dev/cad-stress-simulator'
    },
    {
      name: 'Node.js',
      category: 'Backend',
      claimed: true,
      evidenceBacked: true,
      assessed: true,
      verified: true,
      score: 82,
      level: 'Advanced',
      verificationId: 'RC-V82-NOD-2031',
      evidenceSnippet: '42 GitHub stars • Redis Queue Runner',
      repoUrl: 'https://github.com/rahulsharma-dev/task-queue-redis'
    },
    {
      name: 'Machine Learning / OpenCV',
      category: 'AI & ML',
      claimed: true,
      evidenceBacked: true,
      assessed: false,
      verified: false,
      level: 'Intermediate',
      evidenceSnippet: 'OpenCV Autonomous Vision Repo connected',
      repoUrl: 'https://github.com/rahulsharma-dev/opencv-vision-pipeline'
    },
    {
      name: 'C++',
      category: 'Systems',
      claimed: true,
      evidenceBacked: false,
      assessed: false,
      verified: false,
      level: 'Intermediate',
      evidenceSnippet: 'Self-reported claim (Assessment pending)'
    }
  ],

  opportunities: [
    {
      id: 'opp-tata-motors',
      company: 'Tata Motors',
      role: 'Autonomous Systems & Robotics Intern',
      location: 'Pune / Bangalore (Hybrid)',
      type: 'Internship ➔ PPO Track',
      stipendOrSalary: '₹45,000 / month',
      deadline: '15 April 2026',
      description: 'Design and evaluate embedded simulation nodes for electric vehicle powertrain telemetry and autonomous perception.',
      branchEligible: 'Mech / CSE / EE',
      yearEligible: '2026 / 2027',
      cgpaRequired: '≥ 7.5 CGPA (Yours: 8.7)',
      skillMatchPercentage: 92,
      credibilityMatchPercentage: 88,
      requiredSkills: ['Python', 'CAD / SolidWorks', 'C++'],
      status: 'Highly Recommended'
    },
    {
      id: 'opp-lt',
      company: 'Larsen & Toubro (L&T)',
      role: 'Graduate Engineer Trainee - Core Systems',
      location: 'Mumbai / Chennai',
      type: 'Full-time Campus Placement',
      stipendOrSalary: '₹9.5 - 12.0 LPA',
      deadline: '28 April 2026',
      description: 'Multi-disciplinary engineering modeling, automated structural verification, and project lifecycle management.',
      branchEligible: 'All Engineering Streams',
      yearEligible: '2026',
      cgpaRequired: '≥ 7.0 CGPA (Yours: 8.7)',
      skillMatchPercentage: 87,
      credibilityMatchPercentage: 84,
      requiredSkills: ['CAD', 'Systems Analysis', 'Python'],
      status: 'Likely Eligible'
    },
    {
      id: 'opp-msft',
      company: 'Microsoft IDC',
      role: 'Software Engineering Intern - Cloud & AI',
      location: 'Hyderabad / Bangalore',
      type: 'Summer Internship 2026',
      stipendOrSalary: '₹1,25,000 / month',
      deadline: '05 May 2026',
      description: 'Build distributed microservice telemetry, high-throughput cloud endpoints, and developer productivity tooling.',
      branchEligible: 'CSE / IT / ECE / Allied',
      yearEligible: '2026 / 2027',
      cgpaRequired: '≥ 8.0 CGPA (Yours: 8.7)',
      skillMatchPercentage: 89,
      credibilityMatchPercentage: 91,
      requiredSkills: ['Python', 'React', 'Problem Solving', 'SQL'],
      status: 'Highly Recommended'
    },
    {
      id: 'opp-bosch',
      company: 'Bosch Global Software Technologies',
      role: 'Embedded Software Developer',
      location: 'Bangalore / Coimbatore',
      type: 'Full-time Campus Placement',
      stipendOrSalary: '₹10.5 LPA',
      deadline: '10 May 2026',
      description: 'Firmware validation, real-time control algorithms, and sensor communication protocols for mobility electronics.',
      branchEligible: 'Mech / Mechatronics / CSE / ECE',
      yearEligible: '2026',
      cgpaRequired: '≥ 7.5 CGPA (Yours: 8.7)',
      skillMatchPercentage: 85,
      credibilityMatchPercentage: 82,
      requiredSkills: ['C++', 'Python', 'Embedded Systems'],
      status: 'Likely Eligible'
    }
  ],

  benchmarks: {
    percentile: 'Top 14%',
    cohortSize: '18,400+ Evaluated Engineering Candidates Across India',
    items: [
      { skill: 'Python Core', userScore: 92, benchmarkScore: 72, deltaPercentage: 20 },
      { skill: 'SQL & Database', userScore: 88, benchmarkScore: 75, deltaPercentage: 13 },
      { skill: 'React / Frontend', userScore: 86, benchmarkScore: 74, deltaPercentage: 12 },
      { skill: 'Problem Solving', userScore: 84, benchmarkScore: 71, deltaPercentage: 13 },
      { skill: 'CAD / SolidWorks', userScore: 79, benchmarkScore: 68, deltaPercentage: 11 }
    ]
  },

  growthData: [
    { month: 'Oct 2025', python: 64, react: 58, problemSolving: 62 },
    { month: 'Nov 2025', python: 72, react: 68, problemSolving: 70 },
    { month: 'Dec 2025', python: 81, react: 77, problemSolving: 76 },
    { month: 'Jan 2026', python: 88, react: 82, problemSolving: 80 },
    { month: 'Mar 2026', python: 92, react: 86, problemSolving: 84 }
  ],

  skillGrowthTimeline: [
    { month: 'May', score: 58 },
    { month: 'Jun', score: 64 },
    { month: 'Jul', score: 69 },
    { month: 'Aug', score: 76 },
    { month: 'Sep', score: 82 }
  ],

  assessmentPerformanceData: [
    { skill: 'Python', score: 86, passScore: 70 },
    { skill: 'Prob. Solving', score: 83, passScore: 70 },
    { skill: 'C', score: 81, passScore: 70 },
    { skill: 'CAD', score: 78, passScore: 70 },
    { skill: 'React', score: 74, passScore: 70 }
  ],

  credibilityBreakdownData: [
    { name: 'Verified Skills', value: 30, color: '#10B981' },
    { name: 'Assessments', value: 25, color: '#6C63FF' },
    { name: 'Evidence', value: 20, color: '#8B7CFF' },
    { name: 'Projects', value: 15, color: '#252A46' },
    { name: 'Verification', value: 10, color: '#666A7A' }
  ],

  benchmarkComparison: {
    candidateReadiness: 84,
    nationalBenchmark: 72,
    delta: 12,
    cohortLabel: 'Campus Cohort Benchmark (Demo)'
  },

  assessmentScores: [
    { skill: 'Python', score: 92, accuracy: 90 },
    { skill: 'SQL', score: 88, accuracy: 88 },
    { skill: 'React', score: 86, accuracy: 80 },
    { skill: 'Node.js', score: 82, accuracy: 85 },
    { skill: 'CAD', score: 79, accuracy: 75 }
  ],

  credibilityDistribution: [
    { name: 'Verified (Assessment-backed)', value: 58, color: '#10B981' },
    { name: 'Evidence-backed (GitHub/Repo)', value: 25, color: '#6366F1' },
    { name: 'Claimed (Self-reported)', value: 17, color: '#64748B' }
  ],

  readinessFactors: [
    { category: 'Profile Completion', score: 92, status: 'Complete', description: 'Academic records, bios, and verified identifiers linked.' },
    { category: 'Verified Skills', score: 86, status: 'Strong', description: '7 technical domains validated with cryptographic hashes.' },
    { category: 'Project Evidence', score: 81, status: 'Evidence-backed', description: '3 public repositories with commit logs & architecture.' },
    { category: 'Assessments', score: 78, status: 'Passed', description: '5 timed proctored code output evaluations completed.' },
    { category: 'Problem Solving', score: 85, status: 'Consistent', description: '186 LeetCode problems solved with 1542 contest rating.' },
    { category: 'Hackathon & Squad', score: 90, status: 'Exemplary', description: 'Smart India Hackathon Winner and active squad lead.' }
  ],

  overallReadiness: 85,

  hackathons: [
    {
      id: 'h-sih-2026',
      title: 'Smart India Hackathon 2026',
      year: '2026',
      result: 'Winner',
      teamName: 'TechForge Alpha',
      role: 'Lead Developer & Embedded Architect',
      projectTitle: 'Autonomous EV Fleet Load Balancer',
      skillsUsed: ['Python', 'FastAPI', 'IoT', 'Docker'],
      evidenceText: 'First Prize • Smart Mobility Track • Official Ministry Certificate',
      repoUrl: 'https://github.com/rahulsharma-dev/sih-ev-load-balancer'
    },
    {
      id: 'h-nic-2026',
      title: 'National Innovation Challenge',
      year: '2026',
      result: 'Finalist',
      teamName: 'Innovators TIET',
      role: 'Full-Stack Engineer',
      projectTitle: 'Decentralized Campus Resource Scheduler',
      skillsUsed: ['React', 'Node.js', 'SQL'],
      evidenceText: 'Top 5 National Finalist • Deployed Web Application',
      repoUrl: 'https://github.com/rahulsharma-dev/campus-resource-scheduler'
    },
    {
      id: 'h-cad-2025',
      title: 'Campus CAD Design Sprint',
      year: '2025',
      result: 'Participant',
      teamName: 'Apex Mech Squad',
      role: 'FEA & Stress Analyst',
      projectTitle: 'Lightweight Drone Airframe Topology Optimization',
      skillsUsed: ['SolidWorks', 'FEA', 'C++'],
      evidenceText: 'Engineered structural joint models & stress reports',
      repoUrl: 'https://github.com/rahulsharma-dev/cad-stress-simulator'
    }
  ],

  achievements: {
    hackathonWins: '2× Hackathon Winner & Finalist',
    teamProjects: '4 Completed Team Projects',
    assessmentsPassed: '5 Standardized Proctored Assessments',
    evidenceItems: '12 Verifiable Code Artifacts',
    percentileBadge: 'Top 14% National Cohort'
  },

  featuredProjects: [
    {
      id: 'proj-opencv',
      title: 'OpenCV Autonomous Vision Pipeline',
      description: 'Real-time multi-lane and obstacle detection pipeline with 45ms frame latency, automated unit benchmarks, and web streaming dashboard.',
      technologies: ['Python', 'OpenCV', 'Flask', 'NumPy'],
      evidenceType: 'GitHub Repository & Benchmarks',
      status: 'Evidence-backed',
      githubUrl: 'https://github.com/rahulsharma-dev/opencv-vision-pipeline',
      liveUrl: 'https://vision-demo.recruitcred.dev',
      stars: 28,
      forks: 9,
      userContribution: 'Built core Hough Transform lane filtering and multithreaded frame capture routines.'
    },
    {
      id: 'proj-queue',
      title: 'Distributed Task Execution Engine',
      description: 'High-throughput asynchronous job scheduler with priority queues, Redis Streams backend, dead-letter retries, and worker health monitors.',
      technologies: ['Node.js', 'TypeScript', 'Redis', 'Docker'],
      evidenceType: 'GitHub Repository & Docker Hub',
      status: 'Evidence-backed',
      githubUrl: 'https://github.com/rahulsharma-dev/task-queue-redis',
      stars: 42,
      forks: 14,
      userContribution: 'Architected atomic Redis Lua locking scripts and horizontal consumer scaling.'
    },
    {
      id: 'proj-cad',
      title: 'Finite Element CAD Stress Simulator',
      description: 'Stress deformation and thermal gradient computation on mechanical structural joints under multi-axis loads with exportable CSV visualizers.',
      technologies: ['C++', 'SolidWorks API', 'OpenGL'],
      evidenceType: 'GitHub Repository & Engineering Report',
      status: 'Evidence-backed',
      githubUrl: 'https://github.com/rahulsharma-dev/cad-stress-simulator',
      stars: 19,
      forks: 5,
      userContribution: 'Implemented 3D mesh node matrix solver and visual gradient shader.'
    }
  ],

  leetcode: {
    username: 'rahul_codes',
    profileUrl: 'https://leetcode.com/u/rahul_codes',
    totalSolved: 186,
    easy: 92,
    medium: 76,
    hard: 18,
    contestRating: 1542,
    globalRankingTopPercent: 14,
    recentActivity: 'Active (5 problems solved this week)'
  },

  recentActivity: [
    {
      id: 'act-1',
      title: 'Python Core Assessment Completed',
      description: 'Earned 92% score. Cryptographic verification hash RC-V92-PYT-4819 issued.',
      timestamp: '2 hours ago',
      type: 'assessment',
      badge: 'Score: 92%'
    },
    {
      id: 'act-2',
      title: 'Connected GitHub Evidence to opencv-vision-pipeline',
      description: 'Verified 28 stars and 14 authentic commit records.',
      timestamp: 'Yesterday',
      type: 'evidence',
      badge: 'Repo Synced'
    },
    {
      id: 'act-3',
      title: 'Matched with Tata Motors Autonomous Robotics Internship',
      description: '92% skill compatibility match based on verified credentials.',
      timestamp: '2 days ago',
      type: 'opportunity',
      badge: 'Eligible ✓'
    },
    {
      id: 'act-4',
      title: 'Awarded Smart India Hackathon 2026 Winner Badge',
      description: 'Team TechForge Alpha first place in Smart Mobility category.',
      timestamp: '4 days ago',
      type: 'achievement',
      badge: 'Winner 🏆'
    },
    {
      id: 'act-5',
      title: 'React Core Assessment Completed',
      description: 'Earned 86% score. Cryptographic verification hash RC-V86-RCT-9482 issued.',
      timestamp: '1 week ago',
      type: 'assessment',
      badge: 'Score: 86%'
    }
  ]
};
