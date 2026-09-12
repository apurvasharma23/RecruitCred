import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  X,
  Zap,
  CheckCircle2,
  Send,
  Sparkles
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

interface TeamChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: User | null;
  defaultTeamId?: string;
}

export const TeamChallengeModal: React.FC<TeamChallengeModalProps> = ({
  isOpen,
  onClose,
  candidate,
  defaultTeamId
}) => {
  const { teams, allUsers, currentUser, sendTeamChallenge } = useApp();
  
  // Eligible candidates (excluding current user and existing members)
  const candidateOptions = allUsers.filter(u => u.id !== currentUser.id);

  // Teams led by current user or all teams
  const userTeams = teams.filter(t => t.leaderId === currentUser.id || t.members.some(m => m.userId === currentUser.id));
  const availableTeams = userTeams.length > 0 ? userTeams : teams;

  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    defaultTeamId || availableTeams[0]?.id || ''
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidate?.id || candidateOptions[0]?.id || ''
  );
  const [skillName, setSkillName] = useState<string>('React');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(10);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const activeCandidate = candidate || allUsers.find(u => u.id === selectedCandidateId) || candidateOptions[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !activeCandidate) return;

    sendTeamChallenge(
      selectedTeamId,
      activeCandidate.id,
      skillName,
      difficulty,
      questionCount,
      timeLimitMinutes
    );
    
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1200);
  };

  const skillOptions = [
    'React',
    'Python',
    'C++',
    'JavaScript',
    'SQL',
    'Git',
    'HTML/CSS'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-dropdown rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="text-center py-8 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-verified">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Skill Test Dispatched!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              <strong className="text-amber-300">{activeCandidate?.name}</strong> has received the <strong>{difficulty} {skillName} Test ({questionCount} Qs • {timeLimitMinutes}m)</strong>. The results will appear in your Team Pre-Acceptance Queue.
            </p>
          </div>
        ) : (
          <div>
            
            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  Create Candidate Skill Test
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test a potential member's code capability before admitting them to your squad.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* 1. Target Team */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Select Squad
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {availableTeams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.hackathonName})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Candidate Selection (if not locked) */}
              {!candidate && (
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Select Candidate to Test
                  </label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {candidateOptions.map(cand => (
                      <option key={cand.id} value={cand.id}>
                        {cand.name} — {cand.role} ({cand.experienceLevel})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selected Candidate Quick View */}
              {activeCandidate && (
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar
                      src={activeCandidate.avatar}
                      name={activeCandidate.name}
                      size="sm"
                      className="ring-1 ring-amber-500/40"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{activeCandidate.name}</div>
                      <div className="text-[10px] text-slate-400">{activeCandidate.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeCandidate.experienceLevel}
                  </span>
                </div>
              )}

              {/* 3. Skill & Difficulty */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Skill
                  </label>
                  <select
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {skillOptions.map(sk => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Beginner">Beginner (Foundations)</option>
                    <option value="Intermediate">Intermediate (Standard)</option>
                    <option value="Advanced">Advanced (Production Deep Dive)</option>
                  </select>
                </div>
              </div>

              {/* 4. Questions Count & Time Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Number of Questions
                  </label>
                  <div className="flex gap-1.5">
                    {[3, 5, 8, 10].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          questionCount === num
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                    Time Limit
                  </label>
                  <div className="flex gap-1.5">
                    {[5, 10, 15, 20].map(mins => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setTimeLimitMinutes(mins)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          timeLimitMinutes === mins
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Example Summary Preview */}
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Test Parameters Summary:
                </div>
                <div className="text-slate-300">
                  Candidate: <strong className="text-white">{activeCandidate?.name}</strong> • Skill: <strong className="text-white">{skillName}</strong> • Difficulty: <strong className="text-white">{difficulty}</strong> • Questions: <strong className="text-white">{questionCount}</strong> • Time: <strong className="text-white">{timeLimitMinutes} minutes</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Test
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
