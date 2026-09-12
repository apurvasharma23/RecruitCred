import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamChallenge } from '../../types';
import { TakeChallengeModal } from '../teams/TakeChallengeModal';
import {
  Inbox,
  CheckCircle2,
  Zap,
  Users,
  Check
} from 'lucide-react';

export const InvitationsView: React.FC = () => {
  const {
    currentUser,
    teams,
    invitations,
    respondToInvitation
  } = useApp();

  const [activeTab, setActiveTab] = useState<'challenges' | 'invitations'>('challenges');
  const [selectedChallenge, setSelectedChallenge] = useState<TeamChallenge | null>(null);
  const [isTakeChallengeOpen, setIsTakeChallengeOpen] = useState(false);

  // Challenges sent to current user
  const incomingChallenges = teams.flatMap(t => 
    t.challengesSent.filter(c => c.candidateId === currentUser.id)
  );

  // Invitations sent to current user
  const incomingInvitations = invitations.filter(
    i => i.invitedUserId === currentUser.id
  );

  const handleStartChallenge = (ch: TeamChallenge) => {
    setSelectedChallenge(ch);
    setIsTakeChallengeOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <Inbox className="w-3.5 h-3.5 text-indigo-400" />
            Recruitment Inbox & Challenge Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Invitations & Skill Challenges</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Accept team invitations, solve pre-acceptance custom skill tests dispatched by team leads, and join winning squads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-amber-400">
              {incomingChallenges.filter(c => c.status === 'pending').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Tests Pending</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'challenges'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          Skill Challenges ({incomingChallenges.length})
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'invitations'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Team Invitations ({incomingInvitations.length})
        </button>
      </div>

      {/* Tab Content: Skill Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {incomingChallenges.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
              No custom skill challenges received yet. Keep your verified profile updated to attract team challenges.
            </div>
          ) : (
            incomingChallenges.map((challenge) => {
              const isPending = challenge.status === 'pending';
              const isCompleted = challenge.status === 'completed';
              const isAccepted = challenge.status === 'accepted';

              return (
                <div
                  key={challenge.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    isPending
                      ? 'bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/40 shadow-glow-amber'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-1">
                        <Zap className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{challenge.teamName}</h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                            {challenge.difficulty} {challenge.skillName} Test
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {challenge.teamName} wants to test your proficiency in <strong className="text-slate-200">{challenge.skillName}</strong> ({challenge.questionCount} Questions).
                        </p>

                        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                          <span>Dispatched: {challenge.sentAt}</span>
                          <span>•</span>
                          <span>Anti-Cheat Timed Session</span>
                        </div>
                      </div>
                    </div>

                    {/* Action or Score */}
                    <div className="shrink-0 flex items-center gap-3">
                      {isPending && (
                        <button
                          onClick={() => handleStartChallenge(challenge)}
                          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
                        >
                          <Zap className="w-4 h-4 fill-current" />
                          Start 5-Min Test
                        </button>
                      )}

                      {isCompleted && (
                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-400">
                            Score: {challenge.score}%
                          </div>
                          <div className="text-xs text-slate-400">
                            Status: Awaiting Team Lead Approval
                          </div>
                        </div>
                      )}

                      {isAccepted && (
                        <span className="text-xs font-bold text-emerald-400 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Accepted into Team!
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab Content: Team Invitations */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          {incomingInvitations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
              No team invitations right now.
            </div>
          ) : (
            incomingInvitations.map((inv) => {
              const isPending = inv.status === 'pending';

              return (
                <div
                  key={inv.id}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={inv.inviterAvatar}
                      alt={inv.inviterName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{inv.teamName}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                          {inv.roleOffered}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5">
                        Invited by <strong className="text-slate-300">{inv.inviterName}</strong> for {inv.hackathonName}
                      </div>

                      <p className="text-xs text-slate-300 mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 italic">
                        "{inv.message}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2.5">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => respondToInvitation(inv.id, 'accepted')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          Accept Invite
                        </button>
                        <button
                          onClick={() => respondToInvitation(inv.id, 'declined')}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                        {inv.status === 'accepted' ? 'Accepted' : 'Declined'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Challenge Runner Modal */}
      <TakeChallengeModal
        challenge={selectedChallenge}
        isOpen={isTakeChallengeOpen}
        onClose={() => {
          setIsTakeChallengeOpen(false);
          setSelectedChallenge(null);
        }}
      />

    </div>
  );
};
