import { db, DbUser } from './db';

/**
 * Extract public-safe profile fields
 */
export const getPublicProfileData = (user: DbUser) => {
  return {
    id: user.id,
    name: user.name || user.fullName,
    fullName: user.fullName || user.name,
    username: user.uniqueUserId || user.username,
    uniqueUserId: user.uniqueUserId || user.username,
    role: user.role,
    bio: user.bio,
    college: user.college,
    branch: user.branch,
    gradYear: user.gradYear,
    education: user.education || (user.branch && user.college ? `B.Tech in ${user.branch}, ${user.college}` : user.college),
    location: user.location || 'India',
    avatar: user.avatar,
    overallScore: user.overallScore,
    isPro: Boolean(user.isPro),
    createdAt: user.createdAt,
    skills: (user.skills || []).map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      status: s.status,
      score: s.score,
      level: s.level,
      verifiedAt: s.verifiedAt,
      verificationId: s.verificationId,
      proofSources: (s.proofSources || []).map(p => ({
        id: p.id,
        type: p.type,
        title: p.title,
        url: p.url,
        details: p.details,
        metric: p.metric,
        connectedAt: p.connectedAt,
        isVerifiedDemo: p.isVerifiedDemo
      }))
    })),
    projects: (user.projects || []).map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      githubUrl: p.githubUrl,
      verifiedSkills: p.verifiedSkills,
      stars: p.stars
    })),
    certifications: (user.certifications || []).map(c => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      issuedDate: c.issuedDate,
      credentialId: c.credentialId,
      skills: c.skills
    })),
    githubUsername: user.githubUsername,
    leetcodeUsername: user.leetcodeUsername
  };
};

/**
 * Handle GET /api/users/:uniqueUserId/public-profile
 */
export const handleGetPublicProfile = async (
  uniqueUserId: string
): Promise<{ status: number; data: any }> => {
  if (!uniqueUserId || !uniqueUserId.trim()) {
    return { status: 400, data: { error: 'Unique User ID parameter is required.' } };
  }

  const normalized = uniqueUserId.trim().toLowerCase();
  let user = db.getUserByUsername(normalized);

  // Fallback alias
  if (!user && normalized === 'rahul') user = db.getUserById('user-rahul');
  if (!user && normalized === 'rohan') user = db.getUserById('user-rohan');

  if (!user) {
    return {
      status: 404,
      data: {
        error: `Public profile for '@${normalized}' was not found. This identifier is not registered.`,
        notFound: true
      }
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      profile: getPublicProfileData(user)
    }
  };
};

/**
 * Handle GET /api/users/check-username/:uniqueUserId
 */
export const handleCheckUsernameAvailability = async (
  uniqueUserId: string
): Promise<{ status: number; data: any }> => {
  if (!uniqueUserId || !uniqueUserId.trim() || uniqueUserId.trim().length < 3) {
    return { status: 200, data: { available: false, reason: 'Must be at least 3 characters' } };
  }

  const normalized = uniqueUserId.trim().toLowerCase();
  const existing = db.getUserByUsername(normalized);

  return {
    status: 200,
    data: {
      available: !existing,
      uniqueUserId: normalized
    }
  };
};
