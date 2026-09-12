import { User } from '../../types';

export interface RankingCriteria {
  requiredSkills?: string[];
  minCgpa?: number;
  branch?: string;
  gradYear?: string;
  experienceLevel?: string;
  searchQuery?: string;
}

export interface RankedCandidate extends User {
  relevanceScore: number;
  isEligible: boolean;
  comparableGroup: number;
  priorityVisibility: boolean;
  matchBreakdown: {
    skillRelevance: number;
    eligibilityScore: number;
    verifiedSkillRelevance: number;
    assessmentPerformance: number;
    projectEvidence: number;
    experienceRelevance: number;
  };
}

/**
 * Fair Recruiter Candidate Ranking Engine
 * 
 * Strict Ordering Principles:
 * 1. Skill relevance
 * 2. Eligibility
 * 3. Verified skill relevance
 * 4. Assessment performance
 * 5. Project/evidence relevance
 * 6. Experience relevance
 * 7. Pro priority ONLY among otherwise comparable candidates (comparable relevance bracket).
 * 
 * NOTE: Pro never overrides lower relevance. A high-relevance Free candidate stays ahead of a lower-relevance Pro candidate.
 */
export const rankCandidatesForRecruiter = (
  candidates: User[],
  criteria: RankingCriteria = {}
): RankedCandidate[] => {
  const {
    requiredSkills = [],
    minCgpa = 0,
    branch = '',
    gradYear = '',
    experienceLevel = 'All',
    searchQuery = ''
  } = criteria;

  const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const scoredCandidates: RankedCandidate[] = candidates.map(candidate => {
    const candidateSkillNames = candidate.skills.map(s => s.name.toLowerCase());
    const verifiedSkills = candidate.skills.filter(s => s.status === 'verified');
    const verifiedNames = verifiedSkills.map(s => s.name.toLowerCase());

    // 1. Skill Relevance (0 - 30 pts)
    let skillRelevance = 0;
    if (requiredSkills.length > 0) {
      const matchCount = requiredSkills.filter(req => candidateSkillNames.includes(req.toLowerCase())).length;
      skillRelevance = (matchCount / requiredSkills.length) * 30;
    } else {
      skillRelevance = Math.min(30, candidate.skills.length * 4);
    }

    if (searchTerms.length > 0) {
      const searchHits = searchTerms.filter(term =>
        candidate.name.toLowerCase().includes(term) ||
        candidate.role.toLowerCase().includes(term) ||
        candidateSkillNames.some(s => s.includes(term))
      ).length;
      skillRelevance += Math.min(10, searchHits * 5);
    }

    // 2. Eligibility (0 - 20 pts)
    let eligibilityScore = 20;
    let isEligible = true;

    if (minCgpa > 0) {
      const candidateCgpa = parseFloat(candidate.cgpa || '0');
      if (candidateCgpa < minCgpa) {
        eligibilityScore -= 12;
        isEligible = false;
      }
    }

    if (branch && branch !== 'All' && candidate.branch) {
      if (!candidate.branch.toLowerCase().includes(branch.toLowerCase())) {
        eligibilityScore -= 5;
      }
    }

    if (gradYear && gradYear !== 'All' && candidate.gradYear) {
      if (candidate.gradYear !== gradYear) {
        eligibilityScore -= 3;
      }
    }

    // 3. Verified Skill Relevance (0 - 20 pts)
    let verifiedSkillRelevance = 0;
    if (requiredSkills.length > 0) {
      const verifiedMatches = requiredSkills.filter(req => verifiedNames.includes(req.toLowerCase())).length;
      verifiedSkillRelevance = (verifiedMatches / requiredSkills.length) * 20;
    } else {
      verifiedSkillRelevance = Math.min(20, verifiedSkills.length * 3.5);
    }

    // 4. Assessment Performance (0 - 15 pts)
    const avgScore = verifiedSkills.length > 0
      ? verifiedSkills.reduce((sum, s) => sum + (s.score || 75), 0) / verifiedSkills.length
      : 70;
    const assessmentPerformance = (avgScore / 100) * 15;

    // 5. Project & Evidence Relevance (0 - 10 pts)
    const totalProofSources = candidate.skills.reduce((sum, s) => sum + s.proofSources.length, 0);
    const projectCount = candidate.projects.length;
    const projectEvidence = Math.min(10, projectCount * 3 + totalProofSources * 1.5);

    // 6. Experience Relevance (0 - 5 pts)
    let experienceRelevance = 5;
    if (experienceLevel !== 'All' && candidate.experienceLevel !== experienceLevel) {
      experienceRelevance = 2;
    }

    // Total Composite Relevance Score (0 - 100)
    const relevanceScore = Math.round(
      skillRelevance +
      eligibilityScore +
      verifiedSkillRelevance +
      assessmentPerformance +
      projectEvidence +
      experienceRelevance
    );

    // Group into comparable brackets (increments of 3 points)
    const comparableGroup = Math.floor(relevanceScore / 3);

    return {
      ...candidate,
      relevanceScore,
      isEligible,
      comparableGroup,
      priorityVisibility: Boolean(candidate.isPro),
      matchBreakdown: {
        skillRelevance: Math.round(skillRelevance),
        eligibilityScore: Math.round(eligibilityScore),
        verifiedSkillRelevance: Math.round(verifiedSkillRelevance),
        assessmentPerformance: Math.round(assessmentPerformance),
        projectEvidence: Math.round(projectEvidence),
        experienceRelevance: Math.round(experienceRelevance)
      }
    };
  });

  // Fair 7-Step Comparator
  return scoredCandidates.sort((a, b) => {
    // Primary: Compare by comparable relevance bracket
    if (b.comparableGroup !== a.comparableGroup) {
      return b.comparableGroup - a.comparableGroup;
    }

    // Tier 7: Pro priority ONLY among otherwise comparable candidates within same bracket
    if (a.isPro && !b.isPro) return -1;
    if (!a.isPro && b.isPro) return 1;

    // Secondary sub-tier: Exact relevance score
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }

    // Tertiary sub-tier: Verified skills count
    const aVerified = a.skills.filter(s => s.status === 'verified').length;
    const bVerified = b.skills.filter(s => s.status === 'verified').length;
    return bVerified - aVerified;
  });
};
