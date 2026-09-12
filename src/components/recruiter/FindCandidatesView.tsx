import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { CandidateProfileModal } from './CandidateProfileModal';
import { User } from '../../types';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  SlidersHorizontal,
  Bookmark,
  CheckSquare,
  X,
  RotateCcw
} from 'lucide-react';

export const FindCandidatesView: React.FC = () => {
  const {
    allUsers,
    partnerColleges,
    shortlistedCandidates,
    shortlistCandidate,
    saveCandidate
  } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState<string>('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedGradYearFilter, setSelectedGradYearFilter] = useState<string>('all');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [requiredVerifiedSkillFilter, setRequiredVerifiedSkillFilter] = useState<string>('all');
  const [minAssessmentScoreFilter, setMinAssessmentScoreFilter] = useState<number>(0);
  const [verificationStatusFilter, setVerificationStatusFilter] = useState<'all' | 'verified_only' | 'evidence_backed' | 'assessed' | 'claimed'>('all');

  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<User | null>(null);

  // Available skills in candidate pool for filter dropdown
  const allAvailableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    allUsers.forEach(u => {
      u.skills?.forEach(s => skillSet.add(s.name));
    });
    return Array.from(skillSet).sort();
  }, [allUsers]);

  // Candidates Filtering & Merit-Based Ranking (NO Pro priority!)
  const filteredCandidates = useMemo(() => {
    return allUsers
      .filter(u => u.accountType !== 'recruiter' && u.id !== 'user-rohan')
      .filter(candidate => {
        // Text Search
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = candidate.name.toLowerCase().includes(term);
          const matchId = candidate.id.toLowerCase().includes(term);
          const matchSkills = candidate.skills.some(s => s.name.toLowerCase().includes(term));
          const matchProjects = candidate.projects.some(
            p => p.title.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term))
          );
          const matchCollege = (candidate.college || '').toLowerCase().includes(term);
          const matchBranch = (candidate.branch || '').toLowerCase().includes(term);

          if (!matchName && !matchId && !matchSkills && !matchProjects && !matchCollege && !matchBranch) {
            return false;
          }
        }

        // College Filter
        if (selectedCollegeFilter !== 'all') {
          const college = partnerColleges.find(c => c.id === selectedCollegeFilter);
          if (college && !candidate.college?.toLowerCase().includes(college.shortName.toLowerCase()) && !candidate.college?.toLowerCase().includes(college.name.toLowerCase())) {
            return false;
          }
        }

        // Branch Filter
        if (selectedBranchFilter !== 'all') {
          if (!candidate.branch?.toLowerCase().includes(selectedBranchFilter.toLowerCase())) {
            return false;
          }
        }

        // Grad Year Filter
        if (selectedGradYearFilter !== 'all') {
          if (candidate.gradYear !== selectedGradYearFilter) {
            return false;
          }
        }

        // Min CGPA Filter
        if (minCgpaFilter > 0) {
          const candCgpa = parseFloat(String(candidate.cgpa || 0));
          if (candCgpa < minCgpaFilter) {
            return false;
          }
        }

        // Skill Filter
        if (selectedSkillFilter !== 'all') {
          const hasSkill = candidate.skills.some(s => s.name.toLowerCase() === selectedSkillFilter.toLowerCase());
          if (!hasSkill) return false;
        }

        // Required Verified Skill Filter (Strict backend-style rule)
        if (requiredVerifiedSkillFilter !== 'all') {
          const hasVerifiedSkill = candidate.skills.some(
            s => s.name.toLowerCase() === requiredVerifiedSkillFilter.toLowerCase() && s.status === 'verified'
          );
          if (!hasVerifiedSkill) return false;
        }

        // Min Assessment Score Filter
        if (minAssessmentScoreFilter > 0) {
          if ((candidate.overallScore || 0) < minAssessmentScoreFilter) {
            return false;
          }
        }

        // Verification Status Filter
        if (verificationStatusFilter === 'verified_only') {
          const hasAnyVerified = candidate.skills.some(s => s.status === 'verified');
          if (!hasAnyVerified) return false;
        } else if (verificationStatusFilter === 'evidence_backed') {
          const hasEvidence = candidate.skills.some(s => s.proofSources && s.proofSources.length > 0) || candidate.projects.length > 0;
          if (!hasEvidence) return false;
        } else if (verificationStatusFilter === 'assessed') {
          const hasAssessed = candidate.skills.some(s => s.status === 'verified') || (candidate.overallScore || 0) > 0;
          if (!hasAssessed) return false;
        }

        return true;
      })
      // Merit Ranking: Verified Skills Count -> Overall Assessment Score -> CGPA
      .sort((a, b) => {
        const aVerified = a.skills.filter(s => s.status === 'verified').length;
        const bVerified = b.skills.filter(s => s.status === 'verified').length;
        if (bVerified !== aVerified) return bVerified - aVerified;
        if ((b.overallScore || 0) !== (a.overallScore || 0)) return (b.overallScore || 0) - (a.overallScore || 0);
        const aCgpa = parseFloat(String(a.cgpa || 0));
        const bCgpa = parseFloat(String(b.cgpa || 0));
        return bCgpa - aCgpa;
      });
  }, [
    allUsers,
    searchTerm,
    selectedCollegeFilter,
    selectedBranchFilter,
    selectedGradYearFilter,
    minCgpaFilter,
    selectedSkillFilter,
    requiredVerifiedSkillFilter,
    minAssessmentScoreFilter,
    verificationStatusFilter,
    partnerColleges
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCollegeFilter('all');
    setSelectedBranchFilter('all');
    setSelectedGradYearFilter('all');
    setMinCgpaFilter(0);
    setSelectedSkillFilter('all');
    setRequiredVerifiedSkillFilter('all');
    setMinAssessmentScoreFilter(0);
    setVerificationStatusFilter('all');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCollegeFilter !== 'all' ||
    selectedBranchFilter !== 'all' ||
    selectedGradYearFilter !== 'all' ||
    minCgpaFilter > 0 ||
    selectedSkillFilter !== 'all' ||
    requiredVerifiedSkillFilter !== 'all' ||
    minAssessmentScoreFilter > 0 ||
    verificationStatusFilter !== 'all';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Search className="w-6 h-6 text-[#8B7CFF]" />
            Find Candidates
          </h1>
          <p className="text-xs sm:text-sm text-[#666A7A] mt-1">
            Search and evaluate candidates across partner institutions using multi-facet verification filters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              hasActiveFilters || showFiltersDrawer
                ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-white'
                : 'bg-[#171A2B] border-[#252A46] text-[#666A7A] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#252A46] hover:bg-[#32395C] text-[#666A7A] hover:text-white text-xs font-bold transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search Input & Quick Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#666A7A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, RecruitCred ID, skill (e.g. Python), technology, project, or campus..."
            className="w-full pl-10 pr-4 py-3 bg-[#111424] border border-[#252A46] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#6C63FF] transition-colors placeholder:text-[#666A7A]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3.5 text-[#666A7A] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Pill Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#666A7A] font-semibold">Quick Filters:</span>
          
          <button
            onClick={() => setVerificationStatusFilter(prev => prev === 'verified_only' ? 'all' : 'verified_only')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              verificationStatusFilter === 'verified_only'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#111424] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Candidates Only
          </button>

          <button
            onClick={() => setMinCgpaFilter(prev => prev === 8.5 ? 0 : 8.5)}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              minCgpaFilter === 8.5
                ? 'bg-[#6C63FF] text-white shadow-md'
                : 'bg-[#111424] text-slate-300 border border-[#252A46] hover:bg-[#252A46]'
            }`}
          >
            CGPA ≥ 8.5
          </button>

          <button
            onClick={() => setRequiredVerifiedSkillFilter(prev => prev === 'Python' ? 'all' : 'Python')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              requiredVerifiedSkillFilter === 'Python'
                ? 'bg-[#6C63FF] text-white shadow-md'
                : 'bg-[#111424] text-slate-300 border border-[#252A46] hover:bg-[#252A46]'
            }`}
          >
            Python (Verified)
          </button>

          <button
            onClick={() => setMinAssessmentScoreFilter(prev => prev === 80 ? 0 : 80)}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              minAssessmentScoreFilter === 80
                ? 'bg-[#6C63FF] text-white shadow-md'
                : 'bg-[#111424] text-slate-300 border border-[#252A46] hover:bg-[#252A46]'
            }`}
          >
            Assessment ≥ 80%
          </button>
        </div>
      </div>

      {/* Collapsible Detailed Filter Drawer */}
      {showFiltersDrawer && (
        <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
          
          {/* College Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Target College
            </label>
            <select
              value={selectedCollegeFilter}
              onChange={e => setSelectedCollegeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="all">All Partner Campuses</option>
              {partnerColleges.map(col => (
                <option key={col.id} value={col.id}>{col.name} ({col.shortName})</option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Engineering Branch
            </label>
            <select
              value={selectedBranchFilter}
              onChange={e => setSelectedBranchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="all">All Branches</option>
              <option value="Computer Science">Computer Science & Engineering</option>
              <option value="Electronics">Electronics & Communication</option>
              <option value="Data Science">AI & Data Science</option>
              <option value="Mechanical">Mechanical Engineering</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Graduation Year
            </label>
            <select
              value={selectedGradYearFilter}
              onChange={e => setSelectedGradYearFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="all">All Batches</option>
              <option value="2025">Batch 2025</option>
              <option value="2026">Batch 2026</option>
              <option value="2027">Batch 2027</option>
            </select>
          </div>

          {/* Required Verified Skill */}
          <div>
            <label className="block text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Required Verified Skill
            </label>
            <select
              value={requiredVerifiedSkillFilter}
              onChange={e => setRequiredVerifiedSkillFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#111424] border border-[#10B981]/40 rounded-xl text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Any Verified Competency</option>
              {allAvailableSkills.map(sk => (
                <option key={sk} value={sk}>{sk} (Must be Verified)</option>
              ))}
            </select>
          </div>

          {/* Min CGPA */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              <span>Minimum CGPA</span>
              <span className="text-white font-mono">{minCgpaFilter > 0 ? `${minCgpaFilter} / 10.0` : 'None'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="9.5"
              step="0.5"
              value={minCgpaFilter}
              onChange={e => setMinCgpaFilter(parseFloat(e.target.value))}
              className="w-full accent-[#6C63FF] cursor-pointer"
            />
          </div>

          {/* Min Assessment Score */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              <span>Min Assessment Score</span>
              <span className="text-emerald-400 font-mono">{minAssessmentScoreFilter > 0 ? `${minAssessmentScoreFilter}%` : 'None'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minAssessmentScoreFilter}
              onChange={e => setMinAssessmentScoreFilter(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-[11px] font-bold text-[#666A7A] uppercase tracking-wider mb-1.5">
              Verification Level
            </label>
            <select
              value={verificationStatusFilter}
              onChange={e => setVerificationStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="all">All Verification Levels</option>
              <option value="verified_only">Verified Only (Passed Proctored Test)</option>
              <option value="evidence_backed">Evidence-Backed (Has GitHub/Projects)</option>
              <option value="assessed">Assessed (Completed Evaluation)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <button
              onClick={resetFilters}
              className="w-full py-2 bg-[#252A46] hover:bg-[#32395C] text-xs font-bold text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFiltersDrawer(false)}
              className="w-full py-2 bg-[#6C63FF] hover:bg-[#8B7CFF] text-xs font-bold text-white rounded-xl transition-all shadow-md cursor-pointer"
            >
              Apply ({filteredCandidates.length})
            </button>
          </div>
        </div>
      )}

      {/* Candidate Results Count & Table View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#666A7A]">
          <span>Displaying <strong className="text-white">{filteredCandidates.length}</strong> matching candidates</span>
          <span>Ranked by verified technical relevance & assessment benchmarks</span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-3">
            <ShieldCheck className="w-10 h-10 text-[#666A7A] mx-auto" />
            <h3 className="text-base font-bold text-white">No candidates match your filters</h3>
            <p className="text-xs text-[#666A7A] max-w-md mx-auto">
              Try lowering the minimum CGPA cutoff or relaxing the verified skill requirement to view more profiles.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#6C63FF] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCandidates.map(candidate => {
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
                  className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] hover:border-[#6C63FF]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
                >
                  {/* Left Candidate Basic Info */}
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
                        <span className="badge-verified text-[10px]">
                          RC VERIFIED
                        </span>
                        {candidate.cgpa && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            CGPA {candidate.cgpa}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#666A7A] flex flex-wrap items-center gap-2 font-medium">
                        <span className="flex items-center gap-1 text-slate-300">
                          <GraduationCap className="w-3.5 h-3.5 text-[#8B7CFF]" />
                          {candidate.college || 'Thapar Institute of Engineering & Technology'}
                        </span>
                        <span>•</span>
                        <span>{candidate.branch}</span>
                        <span>•</span>
                        <span>Batch {candidate.gradYear || '2026'}</span>
                      </div>

                      {/* Verified & Claimed Skills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {verifiedSkillsList.map(sk => (
                          <span
                            key={sk.id}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            {sk.name} {sk.score ? `(${sk.score}%)` : '✓'}
                          </span>
                        ))}
                        {candidate.skills.filter(s => s.status !== 'verified').slice(0, 3).map(sk => (
                          <span
                            key={sk.id}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111424] text-[#666A7A] border border-[#252A46]"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Benchmarks */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#252A46]">
                    <div className="text-left lg:text-right">
                      <div className="text-xs font-bold text-white flex items-center lg:justify-end gap-1">
                        <span>Score: {candidate.overallScore}%</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        {verifiedSkillsList.length} Verified Competencies
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveCandidate(candidate.id)}
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
                        onClick={() => shortlistCandidate(candidate.id)}
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
                        Evaluate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      <CandidateProfileModal
        candidate={selectedCandidateForModal}
        isOpen={Boolean(selectedCandidateForModal)}
        onClose={() => setSelectedCandidateForModal(null)}
      />
    </div>
  );
};
