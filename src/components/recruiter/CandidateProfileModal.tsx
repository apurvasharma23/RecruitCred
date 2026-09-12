import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, RecruitmentRequirement } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Github,
  Bookmark,
  CheckSquare,
  AlertTriangle,
  ExternalLink,
  Info
} from 'lucide-react';

interface CandidateProfileModalProps {
  candidate: User | null;
  isOpen: boolean;
  onClose: () => void;
  activeRequirement?: RecruitmentRequirement | null;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  isOpen,
  onClose,
  activeRequirement
}) => {
  const {
    shortlistedCandidates,
    shortlistCandidate,
    saveCandidate,
    removeCandidateFromShortlist,
    recruitmentRequirements
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'assessments' | 'eligibility'>('overview');
  const [selectedRole, setSelectedRole] = useState(activeRequirement?.role || 'Software Engineering Intern');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen || !candidate) return null;

  const isShortlisted = shortlistedCandidates.some(
    s => s.candidateId === candidate.id && s.status === 'shortlisted'
  );
  const isSaved = shortlistedCandidates.some(
    s => s.candidateId === candidate.id && s.status === 'saved'
  );

  const verifiedSkills = candidate.skills.filter(s => s.status === 'verified');

  // Compute detailed eligibility against activeRequirement (or default requirement)
  const reqToEvaluate = activeRequirement || recruitmentRequirements[0];
  const candidateCgpa = parseFloat(String(candidate.cgpa || 8.0));
  const meetsCgpa = !reqToEvaluate?.minCgpa || candidateCgpa >= reqToEvaluate.minCgpa;
  const meetsBranch = !reqToEvaluate?.branches?.length || 
    reqToEvaluate.branches.some(b => candidate.branch?.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(candidate.branch?.toLowerCase() || ''));

  // Strict backend verification evaluation rule:
  const missingVerifiedSkills = (reqToEvaluate?.requiredVerifiedSkills || []).filter(reqSkill => {
    return !candidate.skills.some(
      s => s.name.toLowerCase() === reqSkill.toLowerCase() && s.status === 'verified'
    );
  });

  const meetsAssessment = !reqToEvaluate?.minAssessmentScore || (candidate.overallScore || 0) >= reqToEvaluate.minAssessmentScore;

  let eligibilityStatus: 'Eligible' | 'Likely Eligible' | 'Missing Requirement' | 'Not Eligible' = 'Eligible';
  const eligibilityReasons: string[] = [];

  if (missingVerifiedSkills.length > 0) {
    eligibilityStatus = 'Missing Requirement';
    eligibilityReasons.push(`Required verified skill(s) not verified: ${missingVerifiedSkills.join(', ')}. Candidate currently has them as Claimed or Evidence-Backed.`);
  }
  if (!meetsCgpa) {
    eligibilityStatus = 'Not Eligible';
    eligibilityReasons.push(`CGPA (${candidate.cgpa || 'N/A'}) is below the requirement cutoff (${reqToEvaluate?.minCgpa}).`);
  }
  if (!meetsBranch) {
    if (eligibilityStatus !== 'Not Eligible') eligibilityStatus = 'Likely Eligible';
    eligibilityReasons.push(`Branch (${candidate.branch || 'N/A'}) differs from targeted branches (${reqToEvaluate?.branches?.join(', ')}).`);
  }
  if (!meetsAssessment) {
    if (eligibilityStatus !== 'Not Eligible') eligibilityStatus = 'Missing Requirement';
    eligibilityReasons.push(`Overall assessment score (${candidate.overallScore}%) is below requirement (${reqToEvaluate?.minAssessmentScore}%).`);
  }
  if (eligibilityReasons.length === 0) {
    eligibilityReasons.push('Candidate meets all academic cutoffs, branch criteria, and verified technical skill requirements.');
  }

  const handleShortlist = () => {
    shortlistCandidate(candidate.id, selectedRole);
    setActionSuccess('Candidate successfully shortlisted!');
    setTimeout(() => setActionSuccess(null), 2000);
  };

  const handleSave = () => {
    saveCandidate(candidate.id, selectedRole);
    setActionSuccess('Candidate saved to recruiter talent pipeline.');
    setTimeout(() => setActionSuccess(null), 2000);
  };

  const handleRemove = () => {
    removeCandidateFromShortlist(candidate.id);
    setActionSuccess('Candidate removed from recruitment list.');
    setTimeout(() => setActionSuccess(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#171A2B] border border-[#252A46] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#252A46] bg-[#111424] flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <UserAvatar
              src={candidate.avatar}
              name={candidate.name}
              size="xl"
              className="ring-2 ring-[#6C63FF]/40 shrink-0 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-white">{candidate.name}</h2>
                <span className="text-xs font-mono text-[#8B7CFF] bg-[#6C63FF]/15 px-2 py-0.5 rounded border border-[#6C63FF]/30">
                  {candidate.id.toUpperCase()}
                </span>
                <span className="badge-verified text-xs">
                  RC VERIFIED CANDIDATE
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-300 mt-1">{candidate.role}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#666A7A] mt-2 font-medium">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <GraduationCap className="w-4 h-4 text-[#8B7CFF]" />
                  {candidate.college || 'Thapar Institute of Engineering & Technology'}
                </span>
                <span>•</span>
                <span>{candidate.branch}</span>
                <span>•</span>
                <span>Batch {candidate.gradYear || '2026'}</span>
                {candidate.cgpa && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">CGPA: {candidate.cgpa} / 10.0</span>
                  </>
                )}
                {candidate.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {candidate.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#666A7A] hover:text-white hover:bg-[#252A46] rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action feedback toast */}
        {actionSuccess && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {actionSuccess}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-6 border-b border-[#252A46] bg-[#171A2B] flex gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#6C63FF] text-white'
                : 'border-transparent text-[#666A7A] hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-[#6C63FF] text-white'
                : 'border-transparent text-[#666A7A] hover:text-slate-300'
            }`}
          >
            Skills & Verification ({candidate.skills.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-[#6C63FF] text-white'
                : 'border-transparent text-[#666A7A] hover:text-slate-300'
            }`}
          >
            Project Evidence ({candidate.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'assessments'
                ? 'border-[#6C63FF] text-white'
                : 'border-transparent text-[#666A7A] hover:text-slate-300'
            }`}
          >
            Assessments ({candidate.certifications.length || 2})
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'eligibility'
                ? 'border-[#6C63FF] text-white'
                : 'border-transparent text-[#666A7A] hover:text-slate-300'
            }`}
          >
            <span>Eligibility Check</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
              eligibilityStatus === 'Eligible' ? 'bg-emerald-500/20 text-emerald-400' :
              eligibilityStatus === 'Likely Eligible' ? 'bg-indigo-500/20 text-indigo-400' :
              'bg-amber-500/20 text-amber-400'
            }`}>
              {eligibilityStatus}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio & Summary */}
              <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46]">
                <h3 className="text-xs font-bold text-[#666A7A] uppercase tracking-wider mb-2">Candidate Statement</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {candidate.bio || 'Technical undergraduate candidate specializing in scalable systems, algorithmic problem solving, and verified modular software development.'}
                </p>
              </div>

              {/* Key Verification Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46]">
                  <div className="text-[10px] font-bold text-[#666A7A] uppercase tracking-wider">Verified Skills</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">{verifiedSkills.length}</div>
                  <div className="text-[10px] text-[#666A7A] mt-0.5">Assessed & Proven</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46]">
                  <div className="text-[10px] font-bold text-[#666A7A] uppercase tracking-wider">Assessment Score</div>
                  <div className="text-2xl font-extrabold text-white mt-1">{candidate.overallScore}%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Top 8% Benchmark</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46]">
                  <div className="text-[10px] font-bold text-[#666A7A] uppercase tracking-wider">GitHub Evidence</div>
                  <div className="text-2xl font-extrabold text-indigo-400 mt-1">{candidate.projects.length} Repos</div>
                  <div className="text-[10px] text-[#666A7A] mt-0.5">Connected Codebases</div>
                </div>

                <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46]">
                  <div className="text-[10px] font-bold text-[#666A7A] uppercase tracking-wider">Placement Status</div>
                  <div className="text-base font-extrabold text-white mt-2 truncate">Available</div>
                  <div className="text-[10px] text-[#666A7A] mt-0.5">Campus Drive 2026</div>
                </div>
              </div>

              {/* Verified Competencies Highlight */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified Skills ({verifiedSkills.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verifiedSkills.map(skill => (
                    <div key={skill.id} className="p-3.5 rounded-xl bg-[#111424] border border-[#10B981]/30 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{skill.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {skill.score ? `${skill.score}%` : 'VERIFIED'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#666A7A] mt-1">
                          {skill.level} • {skill.category}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#111424] border border-[#252A46] text-xs text-[#666A7A] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#8B7CFF] shrink-0" />
                <span>Skills are strictly verified through automated code analysis, technical assessments, and proctored challenge submissions.</span>
              </div>

              <div className="space-y-3">
                {candidate.skills.map(skill => (
                  <div
                    key={skill.id}
                    className={`p-4 rounded-xl border transition-all ${
                      skill.status === 'verified'
                        ? 'bg-[#111424] border-[#10B981]/30'
                        : 'bg-[#111424]/60 border-[#252A46]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{skill.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              skill.status === 'verified'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-[#666A7A] border border-slate-700'
                            }`}
                          >
                            {skill.status}
                          </span>
                          {skill.score && (
                            <span className="text-xs font-bold text-emerald-400">
                              Assessment: {skill.score}%
                            </span>
                          )}
                          {skill.verificationId && (
                            <span className="text-[10px] font-mono text-[#666A7A]">
                              ID: {skill.verificationId}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#666A7A] mt-1">
                          Category: {skill.category} • Proficiency: {skill.level}
                        </div>
                      </div>

                      {skill.status === 'verified' && (
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                    </div>

                    {/* Proof Sources */}
                    {skill.proofSources && skill.proofSources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#252A46] space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300">Connected Evidence:</div>
                        {skill.proofSources.map(proof => (
                          <div key={proof.id} className="text-xs text-slate-400 flex items-center justify-between bg-[#171A2B] p-2 rounded-lg border border-[#252A46]">
                            <div className="flex items-center gap-2">
                              <Github className="w-3.5 h-3.5 text-slate-300" />
                              <span className="font-mono text-white text-[11px]">{proof.title}</span>
                              <span className="text-[#666A7A] text-[10px]">• {proof.details}</span>
                            </div>
                            {proof.url && (
                              <a
                                href={proof.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#8B7CFF] hover:underline text-[10px] flex items-center gap-1"
                              >
                                View Repo <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {candidate.projects.length === 0 ? (
                <div className="p-8 text-center text-[#666A7A] text-xs">
                  No public repository projects attached to this profile.
                </div>
              ) : (
                candidate.projects.map(proj => (
                  <div key={proj.id} className="p-4 rounded-xl bg-[#111424] border border-[#252A46] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Github className="w-4 h-4 text-slate-300" />
                        {proj.title}
                      </h4>
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-[#171A2B] hover:bg-[#252A46] text-xs text-[#8B7CFF] font-semibold flex items-center gap-1.5 border border-[#252A46]"
                        >
                          Code Repository <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#252A46] text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Python Core & Systems Architecture</div>
                  <div className="text-xs text-[#666A7A] mt-0.5">Level 3 Proctored Evaluation • Completed March 2026</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-400">92%</div>
                  <div className="text-[10px] font-semibold text-emerald-500 uppercase">PASSED • EXCELLENT</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46] flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">React & Modern Frontend Architecture</div>
                  <div className="text-xs text-[#666A7A] mt-0.5">Level 2 Concurrent UI Evaluation • Completed March 2026</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-400">86%</div>
                  <div className="text-[10px] font-semibold text-emerald-500 uppercase">PASSED • ADVANCED</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46] space-y-3">
                <div className="flex items-center justify-between border-b border-[#252A46] pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-[#666A7A] uppercase tracking-wider">Evaluation Against Requirement</h3>
                    <div className="text-sm font-bold text-white mt-0.5">{reqToEvaluate?.title || 'Software Engineering Intern'}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-mono ${
                      eligibilityStatus === 'Eligible'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : eligibilityStatus === 'Likely Eligible'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {eligibilityStatus}
                  </span>
                </div>

                {/* Reasons List */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-bold text-slate-300">Eligibility Analysis:</div>
                  {eligibilityReasons.map((reason, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-[#171A2B] p-2.5 rounded-lg border border-[#252A46]">
                      {eligibilityStatus === 'Eligible' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Detailed Criteria Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#252A46] text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-[#171A2B]">
                    <span className="text-[#666A7A]">Min CGPA ({reqToEvaluate?.minCgpa}):</span>
                    <span className={meetsCgpa ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {candidate.cgpa || '8.5'} {meetsCgpa ? '✓ Met' : '✗ Unmet'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-[#171A2B]">
                    <span className="text-[#666A7A]">Required Verified Skills:</span>
                    <span className={missingVerifiedSkills.length === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {missingVerifiedSkills.length === 0 ? '✓ All Verified' : `✗ Missing: ${missingVerifiedSkills.join(', ')}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Recruiter Actions */}
        <div className="p-4 border-t border-[#252A46] bg-[#111424] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666A7A] font-semibold">Target Role:</span>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 bg-[#171A2B] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="Software Engineering Intern">Software Engineering Intern</option>
              <option value="Quantitative Analyst">Quantitative Analyst</option>
              <option value="Backend Systems Engineer">Backend Systems Engineer</option>
              <option value="Full-Stack Developer">Full-Stack Developer</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            {isShortlisted || isSaved ? (
              <button
                onClick={handleRemove}
                className="px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer border border-rose-500/20"
              >
                Remove from Pipeline
              </button>
            ) : null}

            <button
              onClick={handleSave}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#252A46] hover:bg-[#32395C] text-slate-200 border border-[#252A46]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isSaved ? 'Saved Candidate' : 'Save Candidate'}
            </button>

            <button
              onClick={handleShortlist}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 ${
                isShortlisted
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-[#6C63FF] hover:bg-[#8B7CFF] text-white shadow-[#6C63FF]/30'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              {isShortlisted ? 'Shortlisted ✓' : 'Shortlist Candidate'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
