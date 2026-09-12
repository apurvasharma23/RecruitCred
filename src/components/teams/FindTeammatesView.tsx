import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { CandidateProfileModal } from '../profile/CandidateProfileModal';
import { InviteCandidateModal } from './InviteCandidateModal';
import { TeamChallengeModal } from './TeamChallengeModal';
import { UserAvatar } from '../common/UserAvatar';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  Send,
  Zap,
  Search,
  Trophy
} from 'lucide-react';

export const FindTeammatesView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    hackathons,
    selectedHackathonId
  } = useApp();

  // Top Section Filters
  const [activeHackathonId, setActiveHackathonId] = useState<string>(selectedHackathonId || hackathons[0].id);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [experienceFilter, setExperienceFilter] = useState<string>('All');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0); // 0 = Any, 70, 80, 85, 90
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);

  // Modals & Selection
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [selectedMatchScore, setSelectedMatchScore] = useState<number>(88);
  const [selectedMatchReason, setSelectedMatchReason] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [inviteSuccessToast, setInviteSuccessToast] = useState<string | null>(null);

  const activeHackathon = hackathons.find(h => h.id === activeHackathonId) || hackathons[0];

  const skillFilterOptions = [
    'All',
    'Python',
    'C++',
    'JavaScript',
    'React',
    'SQL',
    'Git',
    'HTML/CSS',
    'Machine Learning',
    'UI/UX',
    'Cloud & DevOps'
  ];

  const roleFilterOptions = [
    'All',
    'Frontend',
    'Backend',
    'Machine Learning',
    'UI/UX',
    'DevOps',
    'Systems'
  ];

  const experienceFilterOptions = ['All', 'Junior', 'Mid-Level', 'Senior'];

  // COMPLEMENTARY SKILL MATCHING ALGORITHM
  // Prioritizes complementary capabilities (ML, UI/UX, Cloud, DevOps, Hardware)
  // over duplicate competencies when the current team already has Frontend + Backend.
  const calculateComplementaryMatch = (candidate: User): { score: number; reason: string; missingProvided: string[] } => {
    // Current user's verified skills & categories
    const mySkills = currentUser.skills.filter(s => s.status === 'verified');
    const mySkillNames = mySkills.map(s => s.name.toLowerCase());
    const myCategories = new Set(mySkills.map(s => s.category));

    // Has frontend + backend?
    const hasFrontend = myCategories.has('Frontend') || mySkillNames.includes('react') || mySkillNames.includes('javascript') || mySkillNames.includes('html/css');
    const hasBackend = myCategories.has('Backend') || mySkillNames.includes('python') || mySkillNames.includes('sql');

    const candidateVerifiedSkills = candidate.skills.filter(s => s.status === 'verified');
    const candidateSkillNames = candidateVerifiedSkills.map(s => s.name.toLowerCase());
    
    let baseScore = 60;
    let missingSkillsFound: string[] = [];
    let specialtyReason = '';

    // 1. Check for Machine Learning / AI complementarity
    const isML = candidate.role.toLowerCase().includes('machine learning') || candidate.role.toLowerCase().includes('ai') || candidateSkillNames.includes('python') && candidate.username.includes('ai');
    if (isML && hasFrontend && hasBackend) {
      baseScore += 26;
      missingSkillsFound.push('Machine Learning & PyTorch');
      specialtyReason = `Strong match because your squad has Frontend + Backend and needs ML expertise. This candidate brings verified Python (${candidateVerifiedSkills.find(s=>s.name==='Python')?.score || 96}%) + ML models.`;
    }

    // 2. Check for UI/UX Design complementarity
    const isDesign = candidate.role.toLowerCase().includes('designer') || candidate.role.toLowerCase().includes('ui/ux') || candidateSkillNames.includes('html/css') && candidate.username.includes('design');
    if (isDesign && hasBackend) {
      baseScore += 24;
      missingSkillsFound.push('UI/UX Design Systems');
      specialtyReason = `Exceptional match because your squad has core engineering but lacks dedicated UI/UX design. This candidate has verified HTML/CSS (${candidateVerifiedSkills.find(s=>s.name==='HTML/CSS')?.score || 94}%) & design systems.`;
    }

    // 3. Check for Cloud / DevOps / Git infrastructure
    const isDevOps = candidate.role.toLowerCase().includes('devops') || candidate.role.toLowerCase().includes('cloud') || candidateSkillNames.includes('git') && candidate.skills.some(s=>s.category === 'Cloud & DevOps');
    if (isDevOps && hasFrontend) {
      baseScore += 22;
      missingSkillsFound.push('Cloud & DevOps Infra');
      specialtyReason = `High compatibility: provides verified Git (${candidateVerifiedSkills.find(s=>s.name==='Git')?.score || 96}%) CI/CD automation & Kubernetes infra to deploy your hackathon project reliably.`;
    }

    // 4. Check for Systems / C++ / Embedded Hardware
    const isSystems = candidate.role.toLowerCase().includes('systems') || candidate.role.toLowerCase().includes('hardware') || candidate.role.toLowerCase().includes('iot') || candidateSkillNames.includes('c++');
    if (isSystems && hasFrontend) {
      baseScore += 23;
      missingSkillsFound.push('Low-latency Systems & C++');
      specialtyReason = `Strategic complementary match: brings verified low-level C++ (${candidateVerifiedSkills.find(s=>s.name==='C++')?.score || 94}%) performance optimization to power heavy computation.`;
    }

    // Complementary skill delta
    candidateVerifiedSkills.forEach(cs => {
      if (!mySkillNames.includes(cs.name.toLowerCase()) && !missingSkillsFound.includes(cs.name)) {
        baseScore += 6;
        missingSkillsFound.push(cs.name);
      }
    });

    // 5. Hackathon requirements alignment
    if (activeHackathon.requiredSkills.some(req => candidateSkillNames.includes(req.toLowerCase()))) {
      baseScore += 8;
    }

    // 6. High assessment scores bonus
    const highestScore = Math.max(...candidateVerifiedSkills.map(s => s.score || 80), 80);
    if (highestScore >= 95) baseScore += 8;
    else if (highestScore >= 90) baseScore += 5;

    // 7. Proof sources bonus
    const totalProofSources = candidate.skills.reduce((sum, s) => sum + s.proofSources.length, 0);
    if (totalProofSources >= 1) baseScore += 5;

    // Final compatibility score capped between 74% and 98%
    const finalScore = Math.min(98, Math.max(74, Math.round(baseScore)));

    let finalReason = specialtyReason;
    if (!finalReason) {
      if (missingSkillsFound.length > 0) {
        finalReason = `Strong match because candidate supplies verified complementary capabilities in ${missingSkillsFound.slice(0, 2).join(' & ')} for ${activeHackathon.title}.`;
      } else {
        finalReason = `Verified peer with complementary ${candidate.role} expertise and high assessment proof.`;
      }
    }

    return {
      score: finalScore,
      reason: finalReason,
      missingProvided: missingSkillsFound
    };
  };

  // Candidates list excluding current logged-in user
  const candidates = allUsers
    .filter(u => u.id !== currentUser.id)
    .filter(u => {
      // 1. Search filter
      const matchesSearch = !searchFilter.trim() || 
        u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.bio.toLowerCase().includes(searchFilter.toLowerCase()) ||
        u.skills.some(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()));

      // 2. Role filter
      const matchesRole = roleFilter === 'All' || u.role.toLowerCase().includes(roleFilter.toLowerCase());

      // 3. Experience filter
      const matchesExp = experienceFilter === 'All' || u.experienceLevel === experienceFilter;

      // 4. Minimum verification score filter
      const highestScore = Math.max(...u.skills.filter(s => s.status === 'verified').map(s => s.score || 0), 0);
      const matchesMinScore = minScoreFilter === 0 || highestScore >= minScoreFilter;

      // 5. Skill filter
      const matchesSkill = selectedSkillFilter === 'All' || u.skills.some(s => {
        if (selectedSkillFilter === 'Machine Learning') return s.name === 'Python' && (u.role.includes('Machine Learning') || u.role.includes('AI'));
        if (selectedSkillFilter === 'UI/UX') return s.name === 'HTML/CSS' || u.role.includes('Designer') || u.role.includes('UI/UX');
        if (selectedSkillFilter === 'Cloud & DevOps') return s.name === 'Git' || s.category === 'Cloud & DevOps';
        return s.name.toLowerCase() === selectedSkillFilter.toLowerCase();
      });

      // 6. Verified only filter
      const hasVerified = !verifiedOnly || u.skills.some(s => s.status === 'verified');

      return matchesSearch && matchesRole && matchesExp && matchesMinScore && matchesSkill && hasVerified;
    })
    .map(candidate => {
      const match = calculateComplementaryMatch(candidate);
      return {
        ...candidate,
        matchScore: match.score,
        matchReason: match.reason,
        missingProvided: match.missingProvided
      };
    })
    // Pure Merit & Verified Skill Relevance Ranking
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      const bVerified = b.skills.filter(s => s.status === 'verified').length;
      const aVerified = a.skills.filter(s => s.status === 'verified').length;
      return bVerified - aVerified;
    });

  const handleOpenProfile = (candidate: User, matchScore: number, matchReason: string) => {
    setSelectedCandidate(candidate);
    setSelectedMatchScore(matchScore);
    setSelectedMatchReason(matchReason);
    setIsProfileModalOpen(true);
  };

  const handleOpenInviteModal = (candidate: User, matchScore: number, matchReason: string) => {
    setSelectedCandidate(candidate);
    setSelectedMatchScore(matchScore);
    setSelectedMatchReason(matchReason);
    setIsInviteModalOpen(true);
  };

  const handleOpenChallenge = (candidate: User) => {
    setSelectedCandidate(candidate);
    setIsChallengeModalOpen(true);
  };

  const handleToast = (msg: string) => {
    setInviteSuccessToast(msg);
    setTimeout(() => setInviteSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {inviteSuccessToast && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 shadow-glow-verified text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{inviteSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Complementary Skill Matching Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Find Hackathon Teammates</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Discover and recruit candidates with <strong>complementary skills</strong> rather than duplicate competencies. Match with verified peers and inspect authentic proof before sending team invites.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[140px]">
            <div className="text-2xl font-black text-indigo-400">{candidates.length}</div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Matched Candidates</div>
          </div>
        </div>
      </div>

      {/* TOP SECTION: HACKATHON SELECTOR + FILTERS */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        
        {/* 1. Hackathon Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Target Hackathon Squad Discovery
            </label>
            <span className="text-[11px] text-slate-400 font-semibold">
              Matching for: <strong className="text-indigo-300">{activeHackathon.title}</strong>
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {hackathons.map((hack) => {
              const isSelected = activeHackathonId === hack.id;
              return (
                <button
                  key={hack.id}
                  onClick={() => setActiveHackathonId(hack.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-950/70 to-slate-900 border-indigo-500 shadow-glow-brand ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-bold truncate leading-snug ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {hack.title}
                    </span>
                    <span className="text-xs text-emerald-400 font-black shrink-0 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30">
                      {hack.prizePool}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                    <span className="text-indigo-400 font-semibold">Roles Needed:</span>
                    <span className="truncate text-slate-300">{hack.lookingForRoles.slice(0, 2).join(', ')}</span>
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1">
                    {hack.startDate} – {hack.endDate}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Search & Primary Filter Row */}
        <div className="grid sm:grid-cols-12 gap-3 pt-4 border-t border-slate-800">
          
          {/* Search Input */}
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Search Candidates
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by name, skill, or role..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Role Specialization
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {roleFilterOptions.map(r => (
                <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Experience
            </label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {experienceFilterOptions.map(exp => (
                <option key={exp} value={exp}>{exp === 'All' ? 'All Levels' : exp}</option>
              ))}
            </select>
          </div>

          {/* Minimum Verification Score Filter */}
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Min Verified Score
            </label>
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={0}>Any Score</option>
              <option value={70}>70%+ (Passing)</option>
              <option value={80}>80%+ (Advanced)</option>
              <option value={85}>85%+ (Top Tier)</option>
              <option value={90}>90%+ (Expert)</option>
            </select>
          </div>

        </div>

        {/* 3. Skill Filter Pills & Verified Toggle */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Filter by Skill Competency:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {skillFilterOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillFilter(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSkillFilter === skill
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end pb-1">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                verifiedOnly
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

      </div>

      {/* CANDIDATE CARDS GRID */}
      {candidates.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No Matching Candidates Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, lowering the minimum verification score, or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchFilter('');
              setRoleFilter('All');
              setSelectedSkillFilter('All');
              setExperienceFilter('All');
              setMinScoreFilter(0);
            }}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {candidates.map((candidate) => {
            const verifiedSkills = candidate.skills.filter(s => s.status === 'verified');
            const claimedSkills = candidate.skills.filter(s => s.status === 'claimed');

            return (
              <div
                key={candidate.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Card Header: Photo + Name + Role + Compatibility Percentage */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <UserAvatar
                        src={candidate.avatar}
                        name={candidate.name}
                        size="lg"
                        className="ring-2 ring-[#6C63FF]/40 group-hover:ring-[#8B7CFF] transition-all shadow-md shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">
                            {candidate.name}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                            {candidate.experienceLevel}
                          </span>
                        </div>
                        
                        <p className="text-xs font-semibold text-indigo-400 mt-0.5">{candidate.role}</p>
                        
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{candidate.location}</span>
                          <span>•</span>
                          <span>{candidate.education}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compatibility Percentage Badge (e.g. 87% Match) */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40 shadow-glow-verified">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {candidate.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* “Why this match?” Explanation Box */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-4 text-xs text-indigo-200 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block mb-0.5">Why this match?</span>
                      <p className="leading-relaxed text-[11px] text-indigo-100">
                        {candidate.matchReason}
                      </p>
                    </div>
                  </div>

                  {/* Verified Skills with Assessment Scores (e.g. Python ✓ 92%, React ✓ 86%, Node.js ✓ 81%) */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Verified Skills & Scores:</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">All Tests Passed</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {verifiedSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{skill.name}</span>
                          <span className="text-emerald-200 font-extrabold bg-emerald-950/80 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                            {skill.score}%
                          </span>
                        </div>
                      ))}

                      {claimedSkills.slice(0, 2).map((skill) => (
                        <div
                          key={skill.id}
                          className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 font-medium"
                        >
                          {skill.name} <span className="text-slate-500">(Claimed)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verifiable Stats Summary (Projects, Proof Index, Hackathons) */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400 mb-4">
                    <div>
                      <span className="font-extrabold text-white block text-sm">{candidate.projects.length}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Projects</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-emerald-400 block text-sm">{candidate.overallScore}%</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Proof Score</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-indigo-300 block text-sm">{candidate.hackathonsCount}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Hackathons</span>
                    </div>
                  </div>

                </div>

                {/* Card Actions: View Profile, Invite to Team, Skill Test */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  
                  {/* 1. View Profile Button */}
                  <button
                    onClick={() => handleOpenProfile(candidate, candidate.matchScore, candidate.matchReason)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    View Profile
                  </button>

                  {/* 2. Skill Test Challenge Button */}
                  <button
                    onClick={() => handleOpenChallenge(candidate)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Send a custom verification challenge"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Skill Test</span>
                  </button>

                  {/* 3. Invite to Team Button */}
                  <button
                    onClick={() => handleOpenInviteModal(candidate, candidate.matchScore, candidate.matchReason)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invite to Team</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Candidate Deep Profile Inspection */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedCandidate(null);
        }}
        onSendInvite={(cand) => {
          setIsProfileModalOpen(false);
          handleOpenInviteModal(cand, selectedMatchScore, selectedMatchReason);
        }}
        onSendChallenge={(cand) => {
          setIsProfileModalOpen(false);
          handleOpenChallenge(cand);
        }}
      />

      {/* MODAL 2: Team Invitation Dispatch */}
      <InviteCandidateModal
        candidate={selectedCandidate}
        compatibilityScore={selectedMatchScore}
        matchReason={selectedMatchReason}
        isOpen={isInviteModalOpen}
        onClose={() => {
          setIsInviteModalOpen(false);
          setSelectedCandidate(null);
        }}
        onSuccessToast={handleToast}
      />

      {/* MODAL 3: Skill Challenge Modal */}
      <TeamChallengeModal
        candidate={selectedCandidate}
        isOpen={isChallengeModalOpen}
        onClose={() => {
          setIsChallengeModalOpen(false);
          setSelectedCandidate(null);
        }}
      />

    </div>
  );
};
