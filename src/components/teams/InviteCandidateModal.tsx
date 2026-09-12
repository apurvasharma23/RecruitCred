import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  X,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface InviteCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: User | null;
  compatibilityScore?: number;
  matchReason?: string;
  onSuccessToast: (message: string) => void;
}

export const InviteCandidateModal: React.FC<InviteCandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  compatibilityScore = 88,
  matchReason,
  onSuccessToast
}) => {
  const { teams, currentUser, sendTeamInvitation } = useApp();

  const userTeams = teams.filter(t => t.leaderId === currentUser.id || t.members.some(m => m.userId === currentUser.id));
  const defaultTeam = userTeams[0] || teams[0];

  const [selectedTeamId, setSelectedTeamId] = useState<string>(defaultTeam?.id || '');
  const [roleOffered, setRoleOffered] = useState<string>(candidate?.role || 'Full-Stack Developer');
  const [message, setMessage] = useState<string>(
    candidate ? `Hey ${candidate.name}! We saw your verified skills on RecruitCred and would love to have you join our squad for the upcoming hackathon.` : ''
  );
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !candidate) return null;

  const verifiedSkills = candidate.skills.filter(s => s.status === 'verified');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    setIsSending(true);
    setTimeout(() => {
      sendTeamInvitation(
        selectedTeamId,
        candidate.id,
        roleOffered,
        message
      );
      setIsSending(false);
      onClose();
      onSuccessToast(`Invitation sent to ${candidate.name} as ${roleOffered}!`);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <UserAvatar
            src={candidate.avatar}
            name={candidate.name}
            size="lg"
            className="ring-2 ring-[#6C63FF]/50 shadow-md shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {compatibilityScore}% Complementary Match
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Invite {candidate.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Send a verified squad invitation for your target hackathon.
            </p>
          </div>
        </div>

        {/* Match Rationale Pill */}
        {matchReason && (
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 mb-5 text-xs text-indigo-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{matchReason}</span>
          </div>
        )}

        {/* Verified skills pills */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Candidate's Verified Competencies:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {verifiedSkills.map((s) => (
              <span
                key={s.id}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {s.name} ({s.score}%)
              </span>
            ))}
          </div>
        </div>

        {/* Invitation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Target Team Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Select Your Team
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.hackathonName})
                </option>
              ))}
            </select>
          </div>

          {/* Role Offered */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Role Offered
            </label>
            <input
              type="text"
              required
              value={roleOffered}
              onChange={(e) => setRoleOffered(e.target.value)}
              placeholder="e.g. Machine Learning Lead, Full-Stack Developer"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Invitation Message */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Pitch / Invitation Message
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the candidate why they are a great fit for your hackathon project..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Sending...' : 'Dispatch Invitation'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
