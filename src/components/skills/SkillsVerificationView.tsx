import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Skill } from '../../types';
import { AddSkillModal } from './AddSkillModal';
import { VerifySkillModal } from './VerifySkillModal';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  GitBranch,
  ExternalLink,
  Zap,
  Trophy
} from 'lucide-react';

export const SkillsVerificationView: React.FC = () => {
  const { currentUser } = useApp();

  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedSkillForVerify, setSelectedSkillForVerify] = useState<Skill | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'claimed'>('all');

  const categories = ['All', 'Frontend', 'Backend', 'AI & ML', 'UI/UX', 'Cloud & DevOps', 'Systems'];

  const filteredSkills = currentUser.skills.filter(skill => {
    const matchesCategory = filterCategory === 'All' || skill.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || skill.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const verifiedCount = currentUser.skills.filter(s => s.status === 'verified').length;
  const pendingCount = currentUser.skills.filter(s => s.status === 'pending').length;
  const claimedCount = currentUser.skills.filter(s => s.status === 'claimed').length;

  const handleOpenVerify = (skill: Skill) => {
    setSelectedSkillForVerify(skill);
    setIsVerifyModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Transparent Verification Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Skills & Verification Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Every technical claim must be backed by evidence. Claim competencies, connect external repositories, and take timed assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddSkillOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Claim New Skill
          </button>
        </div>
      </div>

      {/* Connected Integrations Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Connected Verification Sources</span>
            <span className="text-[11px] text-slate-400">Real-time repository sync and competitive coding rating</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-300">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            GitHub: <span className="text-emerald-400 font-bold">Connected ✓</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            LeetCode: <span className="text-emerald-400 font-bold">Connected ✓</span>
          </div>
        </div>
      </div>

      {/* Status KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Verified */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between shadow-glow-verified">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{verifiedCount} Verified</div>
              <div className="text-xs text-emerald-400/90 font-medium">Backed by code test scores</div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/20">
            Proven
          </span>
        </div>

        {/* Claimed */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{claimedCount} Claimed</div>
              <div className="text-xs text-slate-400">Awaiting assessment test</div>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-400 px-2.5 py-1 rounded bg-slate-800">
            Unverified
          </span>
        </div>

        {/* Pending */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 bg-amber-950/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{pendingCount} In Review</div>
              <div className="text-xs text-amber-300 font-medium">Evidence attached</div>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-300 px-2.5 py-1 rounded bg-amber-500/20">
            Pending
          </span>
        </div>

      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({currentUser.skills.length})
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setFilterStatus('claimed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === 'claimed' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Claimed ({claimedCount})
            </button>
          </div>
        </div>

      </div>

      {/* Skills Showcase Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSkills.map((skill) => {
          const isVerified = skill.status === 'verified';
          const isPending = skill.status === 'pending';
          const isClaimed = skill.status === 'claimed';

          return (
            <div
              key={skill.id}
              className={`p-6 sm:p-7 rounded-3xl border transition-all flex flex-col justify-between ${
                isVerified
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20 border-emerald-500/40 shadow-glow-verified hover:border-emerald-500/70'
                  : isPending
                  ? 'bg-gradient-to-b from-slate-900 to-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div>
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">{skill.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                        {skill.category}
                      </span>
                    </div>
                    {skill.level && (
                      <span className="text-xs text-slate-400 mt-1 block">
                        Assessed Level: <strong className="text-slate-200">{skill.level}</strong>
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  {isVerified && (
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      VERIFIED
                    </span>
                  )}

                  {isPending && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      PENDING REVIEW
                    </span>
                  )}

                  {isClaimed && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                      CLAIMED ○
                    </span>
                  )}
                </div>

                {/* Score & Verification details (for Verified) */}
                {isVerified && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-xs text-slate-300 space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Assessment Score:</span>
                      <span className="text-emerald-400 font-extrabold text-sm">{skill.score || 92}% Accuracy</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Verification Source:</span>
                      <span className="text-white font-semibold">{skill.verificationSource || 'RecruitCred Assessment'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Date Verified:</span>
                      <span className="text-emerald-300 font-medium">{skill.verifiedAt || 'Mar 8, 2026'}</span>
                    </div>

                    {skill.verificationId && (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-900 font-mono text-[10px]">
                        <span className="text-slate-500">Proof Hash:</span>
                        <span className="text-emerald-400">{skill.verificationId}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Claimed prompt */}
                {isClaimed && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-xs text-slate-400 space-y-1 mb-4">
                    <div className="font-semibold text-slate-300">Self-Declared Claim</div>
                    <div>Take a 10-minute code assessment or connect a verified GitHub repository to unlock verified status.</div>
                  </div>
                )}

                {/* Attached Proof Sources */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Attached Evidence ({skill.proofSources.length})
                  </div>

                  {skill.proofSources.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-500 text-center">
                      No external repository or test attached yet.
                    </div>
                  ) : (
                    skill.proofSources.map((proof) => (
                      <div
                        key={proof.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <GitBranch className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="font-bold text-slate-200 truncate">{proof.title}</div>
                            {proof.metric && (
                              <div className="text-[11px] text-emerald-400 font-medium">{proof.metric}</div>
                            )}
                          </div>
                        </div>

                        {proof.url && (
                          <a
                            href={proof.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                {isVerified ? (
                  <button
                    onClick={() => handleOpenVerify(skill)}
                    className="w-full py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    Retake Assessment / Add More Proof
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenVerify(skill)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    [Verify Skill] — Choose Evidence Pathway
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
      />

      <VerifySkillModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setSelectedSkillForVerify(null);
        }}
        skill={selectedSkillForVerify}
      />

    </div>
  );
};
