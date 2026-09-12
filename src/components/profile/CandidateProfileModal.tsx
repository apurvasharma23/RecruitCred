import React from 'react';
import { User } from '../../types';
import {
  X,
  ShieldCheck,
  GitBranch,
  Send,
  Zap,
  MapPin,
  GraduationCap
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface CandidateProfileModalProps {
  candidate: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (candidate: User) => void;
  onSendChallenge: (candidate: User) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSendInvite,
  onSendChallenge
}) => {
  if (!isOpen || !candidate) return null;

  const verifiedSkills = candidate.skills.filter(s => s.status === 'verified');
  const claimedSkills = candidate.skills.filter(s => s.status === 'claimed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Candidate Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-slate-800">
          <UserAvatar
            src={candidate.avatar}
            name={candidate.name}
            size="xl"
            className="ring-2 ring-[#6C63FF]/40 shadow-lg"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{candidate.name}</h2>
              <span className="badge-verified text-xs">
                RC VERIFIED
              </span>
              {candidate.placementStatus && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {candidate.placementStatus}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-brand-400 mt-0.5">{candidate.role}</p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                {candidate.college || candidate.education}
                {candidate.gradYear && ` • Class of ${candidate.gradYear}`}
              </span>
              {candidate.cgpa && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    CGPA: {candidate.cgpa} / 10.0
                  </span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="py-4 border-b border-slate-800 text-xs text-slate-300 leading-relaxed">
          {candidate.bio}
        </div>

        {/* Skills: Claimed vs Verified */}
        <div className="py-4 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Competencies ({verifiedSkills.length})
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              Readiness Rating: {candidate.overallScore}%
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {verifiedSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{skill.name}</span>
                  <span className="badge-verified text-[11px]">
                    ✓ {skill.score}% Score
                  </span>
                </div>

                {skill.verificationId && (
                  <div className="text-[10px] font-mono text-emerald-400 mt-2 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20 truncate">
                    Hash: {skill.verificationId}
                  </div>
                )}

                {skill.proofSources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-400">Proof: </span>
                    {skill.proofSources[0].metric || skill.proofSources[0].title}
                  </div>
                )}
              </div>
            ))}
          </div>

          {claimedSkills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Claimed (Unverified) Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {claimedSkills.map((skill) => (
                  <span
                    key={skill.id}
                    className="badge-claimed text-xs"
                  >
                    {skill.name} ○
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Projects */}
        {candidate.projects.length > 0 && (
          <div className="py-4 border-b border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-400" />
              Verifiable Projects ({candidate.projects.length})
            </h3>

            {candidate.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{proj.title}</span>
                  {proj.stars && (
                    <span className="text-[11px] text-amber-300 font-semibold">
                      ★ {proj.stars} stars
                    </span>
                  )}
                </div>
                <p className="text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {proj.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <button
            onClick={() => onSendChallenge(candidate)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Send Custom Skill Challenge
          </button>

          <button
            onClick={() => onSendInvite(candidate)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            Invite Candidate
          </button>
        </div>

      </div>
    </div>
  );
};
