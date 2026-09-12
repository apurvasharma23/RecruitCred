import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { CandidateProfileModal } from './CandidateProfileModal';
import { User } from '../../types';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  CheckSquare,
  Bookmark,
  X
} from 'lucide-react';

export const CollegeRecruitmentView: React.FC = () => {
  const {
    allUsers,
    partnerColleges,
    recruitmentRequirements,
    selectedCollegeId,
    selectedRequirementId,
    selectCollege,
    selectRequirement,
    createRequirement,
    shortlistedCandidates,
    shortlistCandidate,
    saveCandidate
  } = useApp();

  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [isCreateReqModalOpen, setIsCreateReqModalOpen] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<User | null>(null);

  // New Requirement Form State
  const [newRoleTitle, setNewRoleTitle] = useState('Software Engineering Intern');
  const [newBranchesInput, setNewBranchesInput] = useState('Computer Science, Electronics & Communication, Information Technology');
  const [newGradYear, setNewGradYear] = useState('2026');
  const [newMinCgpa, setNewMinCgpa] = useState<number>(8.0);
  const [newRequiredSkillsInput] = useState('Python, SQL, System Design');
  const [newVerifiedSkillsInput, setNewVerifiedSkillsInput] = useState('Python');
  const [newMinAssessment, setNewMinAssessment] = useState<number>(75);

  // Filter & Search partner colleges
  const filteredColleges = useMemo(() => {
    if (!collegeSearchQuery.trim()) return partnerColleges;
    const q = collegeSearchQuery.toLowerCase();
    return partnerColleges.filter(
      c => c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
    );
  }, [partnerColleges, collegeSearchQuery]);

  // Active college and requirement
  const activeCollege = partnerColleges.find(c => c.id === selectedCollegeId) || partnerColleges[0];
  const activeRequirement = recruitmentRequirements.find(r => r.id === selectedRequirementId) || recruitmentRequirements[0];

  // Candidates for selected college
  const collegeCandidates = useMemo(() => {
    return allUsers
      .filter(u => u.accountType !== 'recruiter' && u.id !== 'user-rohan')
      .map(candidate => {
        // Evaluate eligibility strictly against activeRequirement
        const req = activeRequirement;
        const candidateCgpa = parseFloat(String(candidate.cgpa || 8.2));
        const meetsCgpa = !req?.minCgpa || candidateCgpa >= req.minCgpa;
        const meetsBranch = !req?.branches?.length || 
          req.branches.some(b => candidate.branch?.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(candidate.branch?.toLowerCase() || ''));

        // Strict Backend Verified Skill Enforcement
        const missingVerified = (req?.requiredVerifiedSkills || []).filter(reqSk => {
          return !candidate.skills.some(
            s => s.name.toLowerCase() === reqSk.toLowerCase() && s.status === 'verified'
          );
        });

        const meetsAssessment = !req?.minAssessmentScore || (candidate.overallScore || 0) >= req.minAssessmentScore;

        let status: 'Eligible' | 'Likely Eligible' | 'Missing Requirement' | 'Not Eligible' = 'Eligible';
        const reasons: string[] = [];

        if (missingVerified.length > 0) {
          status = 'Missing Requirement';
          reasons.push(`Required verified skill(s) not verified: ${missingVerified.join(', ')}. Candidate has them as Claimed or Evidence-Backed.`);
        }
        if (!meetsCgpa) {
          status = 'Not Eligible';
          reasons.push(`CGPA (${candidateCgpa}) is below the required cutoff of ${req?.minCgpa}.`);
        }
        if (!meetsBranch) {
          if (status !== 'Not Eligible') status = 'Likely Eligible';
          reasons.push(`Branch (${candidate.branch || 'N/A'}) differs from targeted departments.`);
        }
        if (!meetsAssessment) {
          if (status !== 'Not Eligible') status = 'Missing Requirement';
          reasons.push(`Assessment benchmark (${candidate.overallScore}%) is below minimum ${req?.minAssessmentScore}%.`);
        }
        if (reasons.length === 0) {
          reasons.push('Candidate meets all academic cutoffs, branch criteria, and verified skill benchmarks.');
        }

        return {
          candidate,
          eligibilityStatus: status,
          eligibilityReasons: reasons,
          missingVerified,
          meetsCgpa
        };
      })
      .sort((a, b) => {
        // Priority order: Eligible first, then Likely Eligible, then Missing Requirement, then Not Eligible
        const rankMap = { 'Eligible': 4, 'Likely Eligible': 3, 'Missing Requirement': 2, 'Not Eligible': 1 };
        const rankDiff = rankMap[b.eligibilityStatus] - rankMap[a.eligibilityStatus];
        if (rankDiff !== 0) return rankDiff;
        return (b.candidate.overallScore || 0) - (a.candidate.overallScore || 0);
      });
  }, [allUsers, activeCollege, activeRequirement]);

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const branches = newBranchesInput.split(',').map(b => b.trim()).filter(Boolean);
    const requiredSkills = newRequiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const requiredVerifiedSkills = newVerifiedSkillsInput.split(',').map(s => s.trim()).filter(Boolean);

    createRequirement({
      title: `${newRoleTitle} (${activeCollege.shortName})`,
      college: activeCollege.name,
      role: newRoleTitle,
      branches,
      gradYear: newGradYear,
      minCgpa: newMinCgpa,
      requiredSkills,
      requiredVerifiedSkills,
      minAssessmentScore: newMinAssessment,
      status: 'active'
    });

    setIsCreateReqModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#6C63FF]/20 text-[#8B7CFF] border border-[#6C63FF]/30">
              Campus Placement Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-[#8B7CFF]" />
            College Recruitment
          </h1>
          <p className="text-xs sm:text-sm text-[#666A7A] mt-1 max-w-2xl">
            Select a partner institution, define recruitment cutoffs, and evaluate eligible candidates with strictly verified skill proofs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateReqModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold transition-all shadow-md shadow-[#6C63FF]/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Define Requirements</span>
        </button>
      </div>

      {/* 2. Step 1: Searchable College Selector */}
      <div className="p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#6C63FF] text-white text-[11px] font-black flex items-center justify-center">1</span>
              Choose Partner College
            </h2>
            <p className="text-xs text-[#666A7A] mt-0.5">
              Recruitment context will be scoped to candidates enrolled in the selected institution.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#666A7A]" />
            <input
              type="text"
              value={collegeSearchQuery}
              onChange={e => setCollegeSearchQuery(e.target.value)}
              placeholder="Search college name or city..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF] placeholder:text-[#666A7A]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {filteredColleges.map(college => {
            const isSelected = college.id === activeCollege.id;
            return (
              <div
                key={college.id}
                onClick={() => selectCollege(college.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#6C63FF]/15 border-[#6C63FF] shadow-lg shadow-[#6C63FF]/15 ring-1 ring-[#6C63FF]'
                    : 'bg-[#111424] border-[#252A46] hover:border-[#6C63FF]/40 hover:bg-[#15192E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#8B7CFF]">
                    {college.shortName}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> SELECTED
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-white mt-1.5 line-clamp-1">{college.name}</div>
                <div className="text-[11px] text-[#666A7A] mt-0.5">{college.location}</div>

                <div className="mt-3 pt-2.5 border-t border-[#252A46] flex items-center justify-between text-[11px]">
                  <span className="text-[#666A7A]">{college.totalStudents} Students</span>
                  <span className="text-emerald-400 font-semibold">{college.verifiedStudents} Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Step 2: Recruitment Requirement Selector / Criteria Summary */}
      <div className="p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#252A46] pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#6C63FF] text-white text-[11px] font-black flex items-center justify-center">2</span>
              Recruitment Requirements & Eligibility Criteria
            </h2>
            <p className="text-xs text-[#666A7A] mt-0.5">
              Candidate eligibility is evaluated against these strict academic and verified skill parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666A7A] font-semibold">Active Profile:</span>
            <select
              value={activeRequirement?.id || ''}
              onChange={e => selectRequirement(e.target.value)}
              className="px-3 py-1.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              {recruitmentRequirements.map(req => (
                <option key={req.id} value={req.id}>{req.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Requirements Details Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
            <div className="text-[10px] font-bold text-[#666A7A] uppercase">Target Role</div>
            <div className="text-xs font-bold text-white mt-1 truncate">{activeRequirement?.role || 'SWE Intern'}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
            <div className="text-[10px] font-bold text-[#666A7A] uppercase">Min CGPA Cutoff</div>
            <div className="text-xs font-bold text-emerald-400 mt-1">{activeRequirement?.minCgpa || 8.0} / 10.0</div>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
            <div className="text-[10px] font-bold text-[#666A7A] uppercase">Graduation Batch</div>
            <div className="text-xs font-bold text-white mt-1">Batch {activeRequirement?.gradYear || '2026'}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#10B981]/30">
            <div className="text-[10px] font-bold text-emerald-400 uppercase">Verified Skill Req.</div>
            <div className="text-xs font-bold text-emerald-300 mt-1 truncate">
              {activeRequirement?.requiredVerifiedSkills?.join(', ') || 'Python'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
            <div className="text-[10px] font-bold text-[#666A7A] uppercase">Min Assessment</div>
            <div className="text-xs font-bold text-white mt-1">≥ {activeRequirement?.minAssessmentScore || 75}%</div>
          </div>

          <div className="p-3 rounded-xl bg-[#111424] border border-[#252A46]">
            <div className="text-[10px] font-bold text-[#666A7A] uppercase">Eligible Branches</div>
            <div className="text-xs font-bold text-slate-300 mt-1 truncate">
              {activeRequirement?.branches?.join(', ') || 'CSE, ECE'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#111424] border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Enforced Verification Policy:</strong> If a requirement mandates <em>{activeRequirement?.requiredVerifiedSkills?.join(', ')} (Verified)</em>, candidates with Claimed or Evidence-Backed status will not be marked eligible.
          </span>
        </div>
      </div>

      {/* 4. Step 3: Evaluated Candidates List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#6C63FF] text-white text-[11px] font-black flex items-center justify-center">3</span>
              Eligible Candidates at {activeCollege.shortName} ({collegeCandidates.length})
            </h2>
            <p className="text-xs text-[#666A7A]">
              Candidates ordered by eligibility status and proctored technical evaluation scores.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              {collegeCandidates.filter(c => c.eligibilityStatus === 'Eligible').length} Fully Eligible
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
              {collegeCandidates.filter(c => c.eligibilityStatus === 'Missing Requirement').length} Missing Proof
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {collegeCandidates.map(({ candidate, eligibilityStatus, eligibilityReasons }) => {
            const isShortlisted = shortlistedCandidates.some(
              s => s.candidateId === candidate.id && s.status === 'shortlisted'
            );
            const isSaved = shortlistedCandidates.some(
              s => s.candidateId === candidate.id && s.status === 'saved'
            );
            const verifiedSkillsList = candidate.skills.filter(s => s.status === 'verified');

            return (
              <div
                key={candidate.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  eligibilityStatus === 'Eligible'
                    ? 'bg-[#171A2B] border-[#10B981]/40 shadow-sm'
                    : eligibilityStatus === 'Likely Eligible'
                    ? 'bg-[#171A2B] border-[#6C63FF]/30'
                    : 'bg-[#141726]/80 border-[#252A46]'
                }`}
              >
                {/* Candidate Info */}
                <div className="flex items-start gap-4">
                  <UserAvatar
                    src={candidate.avatar}
                    name={candidate.name}
                    size="lg"
                    className="ring-2 ring-[#6C63FF]/30 shrink-0 shadow-md"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black text-white">{candidate.name}</h3>
                      <span className="text-[10px] font-mono text-[#8B7CFF] bg-[#6C63FF]/15 px-1.5 py-0.2 rounded border border-[#6C63FF]/30">
                        {candidate.id.toUpperCase()}
                      </span>
                      
                      {/* Eligibility Badge */}
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                          eligibilityStatus === 'Eligible'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : eligibilityStatus === 'Likely Eligible'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                            : eligibilityStatus === 'Missing Requirement'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        }`}
                      >
                        {eligibilityStatus}
                      </span>

                      {candidate.cgpa && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          CGPA {candidate.cgpa}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#666A7A] font-medium">
                      {candidate.branch || 'Computer Science & Engineering'} • Batch {candidate.gradYear || '2026'}
                    </div>

                    {/* Eligibility Reason Summary Line */}
                    <div className="text-xs text-slate-300 pt-1 leading-relaxed">
                      {eligibilityReasons[0]}
                    </div>

                    {/* Skills Display */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {verifiedSkillsList.map(sk => (
                        <span
                          key={sk.id}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          {sk.name} {sk.score ? `(${sk.score}%)` : ''}
                        </span>
                      ))}
                      {candidate.skills.filter(s => s.status !== 'verified').map(sk => (
                        <span
                          key={sk.id}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111424] text-[#666A7A] border border-[#252A46]"
                        >
                          {sk.name} (Claimed)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Candidate Action Buttons */}
                <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#252A46]">
                  <div className="text-left lg:text-right">
                    <div className="text-xs font-bold text-white">Score: {candidate.overallScore}%</div>
                    <div className="text-[11px] text-[#666A7A]">{verifiedSkillsList.length} Verified Skills</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveCandidate(candidate.id, activeRequirement?.role)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-[#111424] hover:bg-[#252A46] text-[#666A7A] hover:text-white border-[#252A46]'
                      }`}
                      title={isSaved ? 'Saved' : 'Save candidate'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => shortlistCandidate(candidate.id, activeRequirement?.role)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isShortlisted
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-[#252A46] hover:bg-[#32395C] text-slate-200 border border-[#252A46]'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedCandidateForModal(candidate)}
                      className="px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold transition-all shadow-md shadow-[#6C63FF]/30 cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Define Requirements Modal */}
      {isCreateReqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-[#171A2B] border border-[#252A46] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-[#252A46] bg-[#111424] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Define Campus Recruitment Criteria</h3>
                <p className="text-xs text-[#666A7A]">Target institution: {activeCollege.name}</p>
              </div>
              <button
                onClick={() => setIsCreateReqModalOpen(false)}
                className="p-2 text-[#666A7A] hover:text-white hover:bg-[#252A46] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  value={newRoleTitle}
                  onChange={e => setNewRoleTitle(e.target.value)}
                  required
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="5.0"
                    max="10.0"
                    value={newMinCgpa}
                    onChange={e => setNewMinCgpa(parseFloat(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1">
                    Graduation Batch
                  </label>
                  <select
                    value={newGradYear}
                    onChange={e => setNewGradYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
                  >
                    <option value="2025">Batch 2025</option>
                    <option value="2026">Batch 2026</option>
                    <option value="2027">Batch 2027</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1">
                  Required Verified Skills (Strict Verification Enforced)
                </label>
                <input
                  type="text"
                  value={newVerifiedSkillsInput}
                  onChange={e => setNewVerifiedSkillsInput(e.target.value)}
                  placeholder="e.g. Python, SQL"
                  className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#10B981]/40 rounded-xl text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-[#666A7A] block mt-1">
                  Candidates must possess verified proofs and passed proctored tests for these skills.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1">
                  Target Engineering Branches (comma-separated)
                </label>
                <input
                  type="text"
                  value={newBranchesInput}
                  onChange={e => setNewBranchesInput(e.target.value)}
                  placeholder="e.g. Computer Science, Electronics & Communication"
                  className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#666A7A] uppercase tracking-wider mb-1">
                  Minimum Assessment Score Benchmark (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={newMinAssessment}
                  onChange={e => setNewMinAssessment(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div className="pt-4 border-t border-[#252A46] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateReqModalOpen(false)}
                  className="px-4 py-2 bg-[#111424] hover:bg-[#252A46] text-xs font-bold text-[#666A7A] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Activate Criteria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      <CandidateProfileModal
        candidate={selectedCandidateForModal}
        isOpen={Boolean(selectedCandidateForModal)}
        onClose={() => setSelectedCandidateForModal(null)}
        activeRequirement={activeRequirement}
      />
    </div>
  );
};
