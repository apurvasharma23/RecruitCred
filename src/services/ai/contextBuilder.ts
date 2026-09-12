import { User } from '../../types';
import { ChatContextPayload } from '../../types/chat';

export const buildChatContext = (
  currentUser?: User | null,
  currentPage: string = 'landing',
  teamsCount: number = 0,
  attemptsCount: number = 0
): ChatContextPayload => {
  const user = currentUser || {
    id: 'guest',
    name: 'Student',
    role: 'Student',
    overallScore: 85,
    skills: [
      { id: 's1', name: 'Python', category: 'Programming Languages' as const, status: 'verified' as const, score: 92 },
      { id: 's2', name: 'React', category: 'Frontend' as const, status: 'claimed' as const }
    ],
    projects: [
      { id: 'p1', title: 'Campus Portal', description: 'Student engagement system', technologies: ['React', 'Node'] }
    ],
    hackathonsCount: 2
  };

  const skills = Array.isArray(user.skills) ? user.skills : [];
  const projects = Array.isArray(user.projects) ? user.projects : [];

  const verifiedSkills = skills
    .filter(s => s && s.status === 'verified')
    .map(s => `${s.name} (${s.score || 90}%)`);

  const claimedSkills = skills
    .filter(s => s && s.status === 'claimed')
    .map(s => s.name);

  const pendingSkills = skills
    .filter(s => s && s.status === 'pending')
    .map(s => s.name);

  const isRecruiter = (user.id === 'user-rohan') || (Boolean(user.role) && (user.role.toLowerCase().includes('lead') || user.role.toLowerCase().includes('recruiter')));

  return {
    role: isRecruiter ? 'recruiter' : 'student',
    userName: user.name || 'Student',
    currentPage: currentPage || 'landing',
    overallScore: typeof user.overallScore === 'number' ? user.overallScore : 85,
    skillsCount: {
      verified: verifiedSkills.length,
      claimed: claimedSkills.length,
      pending: pendingSkills.length
    },
    verifiedSkills,
    claimedSkills,
    projectsCount: projects.length,
    completedAssessmentsCount: attemptsCount > 0 ? attemptsCount : 4,
    hackathonsCount: user.hackathonsCount || 2,
    teamsCount
  };
};
