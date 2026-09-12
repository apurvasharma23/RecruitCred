import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { CandidateProfileModal } from './CandidateProfileModal';
import { User } from '../../types';
import {
  CheckSquare,
  CheckCircle2,
  Trash2,
  GraduationCap,
  Search,
  Users
} from 'lucide-react';

export const ShortlistedCandidatesView: React.FC = () => {
  const {
    shortlistedCandidates,
    updateCandidateShortlistStatus,
    removeCandidateFromShortlist,
    allUsers,
    navigateTo
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'shortlisted' | 'saved' | 'interviewing' | 'rejected'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<User | null>(null);

  // Available roles
  const availableRoles = useMemo(() => {
    const set = new Set<string>();
    shortlistedCandidates.forEach(s => {
      if (s.targetRole) set.add(s.targetRole);
    });
    return Array.from(set);
  }, [shortlistedCandidates]);

  // Filtered List
  const filteredList = useMemo(() => {
    return shortlistedCandidates.filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (roleFilter !== 'all' && item.targetRole !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.candidateName.toLowerCase().includes(q);
        const matchCollege = (item.college || '').toLowerCase().includes(q);
        const matchBranch = (item.branch || '').toLowerCase().includes(q);
        if (!matchName && !matchCollege && !matchBranch) return false;
      }
      return true;
    });
  }, [shortlistedCandidates, statusFilter, roleFilter, searchQuery]);

  const handleOpenCandidate = (candidateId: string) => {
    const user = allUsers.find(u => u.id === candidateId);
    if (user) {
      setSelectedCandidateForModal(user);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-[#8B7CFF]" />
            Shortlisted & Saved Candidates
          </h1>
          <p className="text-xs sm:text-sm text-[#666A7A] mt-1">
            Track and manage candidates across your active campus recruitment and interview pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('college-recruitment')}
            className="px-4 py-2 bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Discover More Candidates</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#252A46] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search & Role Filter */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#666A7A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search candidate..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          {availableRoles.length > 0 && (
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="all">All Roles</option>
              {availableRoles.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#6C63FF] text-white'
                : 'bg-[#111424] text-[#666A7A] hover:text-white'
            }`}
          >
            All ({shortlistedCandidates.length})
          </button>
          <button
            onClick={() => setStatusFilter('shortlisted')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'shortlisted'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-[#111424] text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            Shortlisted ({shortlistedCandidates.filter(s => s.status === 'shortlisted').length})
          </button>
          <button
            onClick={() => setStatusFilter('saved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              statusFilter === 'saved'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-[#111424] text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            Saved ({shortlistedCandidates.filter(s => s.status === 'saved').length})
          </button>
        </div>
      </div>

      {/* Candidates Table / Cards */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-3">
          <Users className="w-10 h-10 text-[#666A7A] mx-auto" />
          <h3 className="text-base font-bold text-white">No candidates found in this view</h3>
          <p className="text-xs text-[#666A7A] max-w-sm mx-auto">
            Evaluate and shortlist candidates from College Recruitment or Find Candidates to manage your hiring pipeline here.
          </p>
          <button
            onClick={() => navigateTo('find-candidates')}
            className="px-4 py-2 bg-[#6C63FF] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Find Candidates Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map(record => (
            <div
              key={record.id}
              className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] hover:border-[#6C63FF]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Candidate Info */}
              <div className="flex items-start gap-4">
                <UserAvatar
                  src={record.candidateAvatar}
                  name={record.candidateName}
                  size="lg"
                  className="ring-2 ring-[#6C63FF]/30 shrink-0 shadow-md"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-white">{record.candidateName}</h3>
                    <span className="text-[10px] font-mono text-[#8B7CFF] bg-[#6C63FF]/15 px-1.5 py-0.2 rounded border border-[#6C63FF]/30">
                      {record.targetRole}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                        record.status === 'shortlisted'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : record.status === 'saved'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {record.status}
                    </span>
                    {record.cgpa && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        CGPA {record.cgpa}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#666A7A] flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-[#8B7CFF]" />
                    <span>{record.college}</span>
                    <span>•</span>
                    <span>{record.branch}</span>
                    <span>•</span>
                    <span>Added {record.dateAdded}</span>
                  </div>

                  {/* Verified Skills */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {record.verifiedSkills?.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {sk}
                      </span>
                    ))}
                  </div>

                  {record.notes && (
                    <div className="text-xs text-slate-400 pt-1 italic">
                      Notes: {record.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#252A46]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#666A7A] font-semibold">Stage:</span>
                  <select
                    value={record.status}
                    onChange={e => updateCandidateShortlistStatus(record.id, e.target.value as any)}
                    className="px-3 py-1.5 bg-[#111424] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
                  >
                    <option value="shortlisted">Shortlisted</option>
                    <option value="saved">Saved</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCandidate(record.candidateId)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => removeCandidateFromShortlist(record.candidateId)}
                    className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-500/20 transition-colors cursor-pointer"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedCandidateForModal}
        isOpen={Boolean(selectedCandidateForModal)}
        onClose={() => setSelectedCandidateForModal(null)}
      />
    </div>
  );
};
