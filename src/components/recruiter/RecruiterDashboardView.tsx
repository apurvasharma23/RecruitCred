import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../common/UserAvatar';
import { RecruiterProfileModal } from './RecruiterProfileModal';
import { CandidateProfileModal } from './CandidateProfileModal';
import { User } from '../../types';
import {
  Building2,
  Users,
  ShieldCheck,
  BookmarkCheck,
  CheckSquare,
  GraduationCap,
  ArrowRight,
  Briefcase,
  Edit3,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const RecruiterDashboardView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    partnerColleges,
    recruitmentRequirements,
    shortlistedCandidates,
    recruiterActivities,
    selectedCollegeId,
    selectCollege,
    navigateTo
  } = useApp();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<User | null>(null);

  const selectedCollege = partnerColleges.find(c => c.id === selectedCollegeId) || partnerColleges[0];
  const collegeStudents = allUsers.filter(
    u => u.accountType !== 'recruiter' && u.id !== 'user-rohan'
  );

  const totalCandidatesAvailable = partnerColleges.reduce((acc, c) => acc + c.totalStudents, 0);
  const totalVerifiedCandidates = partnerColleges.reduce((acc, c) => acc + c.verifiedStudents, 0);
  const shortlistedCount = shortlistedCandidates.filter(s => s.status === 'shortlisted').length;
  const savedCount = shortlistedCandidates.filter(s => s.status === 'saved').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Recruiter Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#171A2B] via-[#1A1E35] to-[#171A2B] border border-[#252A46] shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#6C63FF]/20 text-[#8B7CFF] border border-[#6C63FF]/30">
              Recruiter Portal
            </span>
            <span className="text-xs text-[#666A7A]">• {currentUser.companyName || 'FinTech Global Consortium'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Recruiter Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#666A7A] max-w-2xl leading-relaxed">
            Find and evaluate candidates using verified skills, assessments, evidence and eligibility.
          </p>
        </div>

        {/* Recruiter Profile Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252A46] hover:bg-[#32395C] text-white border border-[#252A46] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#8B7CFF]" />
            <span>Company Profile</span>
          </button>

          <button
            onClick={() => navigateTo('college-recruitment')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold transition-all shadow-md shadow-[#6C63FF]/30 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Drive</span>
          </button>
        </div>
      </div>

      {/* 2. Key Recruitment Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#666A7A]">
            <span className="text-xs font-bold uppercase tracking-wider">Candidates Available</span>
            <Users className="w-4 h-4 text-[#8B7CFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {totalCandidatesAvailable.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#666A7A]">Across 4 Premier Partner Campuses</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#10B981]/30 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#666A7A]">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Candidates</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2">
            {totalVerifiedCandidates.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-500/80 font-medium">Evidence & Assessment Backed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#666A7A]">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted</span>
            <CheckSquare className="w-4 h-4 text-[#8B7CFF]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            {shortlistedCount}
          </div>
          <div className="text-[11px] text-[#666A7A]">In Interview & Placement Pipeline</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#666A7A]">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Candidates</span>
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            {savedCount}
          </div>
          <div className="text-[11px] text-[#666A7A]">Bookmarked for Future Drives</div>
        </div>
      </div>

      {/* 3. Quick College Recruitment Workspace Bar */}
      <div className="p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#8B7CFF]" />
              Select College Recruitment Workspace
            </h2>
            <p className="text-xs text-[#666A7A]">
              Choose a partner institution to recruit students meeting verified criteria and cutoffs.
            </p>
          </div>

          <button
            onClick={() => navigateTo('college-recruitment')}
            className="text-xs font-bold text-[#8B7CFF] hover:underline flex items-center gap-1 shrink-0"
          >
            Launch Full College Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {partnerColleges.map(college => {
            const isSelected = college.id === selectedCollegeId;
            return (
              <div
                key={college.id}
                onClick={() => selectCollege(college.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#6C63FF]/15 border-[#6C63FF] shadow-md shadow-[#6C63FF]/10'
                    : 'bg-[#111424] border-[#252A46] hover:border-[#6C63FF]/40 hover:bg-[#15192E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#8B7CFF]">
                    {college.shortName}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#6C63FF] text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white mt-1 truncate">{college.name}</div>
                <div className="text-[11px] text-[#666A7A] mt-0.5">{college.location}</div>
                
                <div className="mt-3 pt-3 border-t border-[#252A46]/60 flex items-center justify-between text-[11px]">
                  <span className="text-[#666A7A]">{college.totalStudents} Students</span>
                  <span className="text-emerald-400 font-semibold">{college.verifiedStudents} Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Active Requirements & Top Verified Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Top Verified Candidates for Current Campus */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Top Verified Candidates at {selectedCollege.shortName}
              </h2>
              <p className="text-xs text-[#666A7A]">Ranked by verified technical evidence and proctored assessment benchmarks.</p>
            </div>

            <button
              onClick={() => navigateTo('find-candidates')}
              className="text-xs font-bold text-[#8B7CFF] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {collegeStudents.slice(0, 4).map(student => {
              const verifiedSkillsList = student.skills.filter(s => s.status === 'verified');
              return (
                <div
                  key={student.id}
                  className="p-4 rounded-xl bg-[#171A2B] border border-[#252A46] hover:border-[#6C63FF]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <UserAvatar
                      src={student.avatar}
                      name={student.name}
                      size="md"
                      className="ring-2 ring-[#6C63FF]/30 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white">{student.name}</h3>
                        <span className="text-[10px] font-mono text-[#8B7CFF] bg-[#6C63FF]/15 px-1.5 py-0.2 rounded border border-[#6C63FF]/30">
                          {student.id.toUpperCase()}
                        </span>
                        {student.cgpa && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            CGPA {student.cgpa}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#666A7A] mt-0.5">
                        {student.branch || 'Computer Science & Engineering'} • Batch {student.gradYear || '2026'}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {verifiedSkillsList.map(sk => (
                          <span
                            key={sk.id}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            {sk.name} {sk.score ? `(${sk.score}%)` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedCandidateForModal(student)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#252A46] hover:bg-[#32395C] text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => setSelectedCandidateForModal(student)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#6C63FF] hover:bg-[#8B7CFF] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Evaluate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Active Recruitment Searches & Recent Activity */}
        <div className="space-y-6">
          
          {/* Active Requirements */}
          <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#8B7CFF]" />
                Active Searches ({recruitmentRequirements.length})
              </h3>
              <button
                onClick={() => navigateTo('college-recruitment')}
                className="text-[11px] text-[#8B7CFF] font-bold hover:underline"
              >
                + Define Search
              </button>
            </div>

            <div className="space-y-2.5">
              {recruitmentRequirements.slice(0, 3).map(req => (
                <div
                  key={req.id}
                  onClick={() => navigateTo('college-recruitment')}
                  className="p-3 rounded-xl bg-[#111424] border border-[#252A46] hover:border-[#6C63FF]/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{req.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-[#666A7A] mt-1">
                    Min CGPA: {req.minCgpa} • Verified: {req.requiredVerifiedSkills.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Recruitment Activity */}
          <div className="p-5 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8B7CFF]" />
                Recent Activity
              </h3>
              <button
                onClick={() => navigateTo('recruitment-activity')}
                className="text-[11px] text-[#8B7CFF] font-bold hover:underline"
              >
                Full Audit Log
              </button>
            </div>

            <div className="space-y-3">
              {recruiterActivities.slice(0, 4).map(act => (
                <div key={act.id} className="text-xs flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#6C63FF] mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 truncate">{act.title}</div>
                    <div className="text-[11px] text-[#666A7A] truncate">{act.description}</div>
                  </div>
                  <span className="text-[10px] text-[#666A7A] shrink-0">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Profile and Candidate Modals */}
      <RecruiterProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <CandidateProfileModal
        candidate={selectedCandidateForModal}
        isOpen={Boolean(selectedCandidateForModal)}
        onClose={() => setSelectedCandidateForModal(null)}
      />
    </div>
  );
};
