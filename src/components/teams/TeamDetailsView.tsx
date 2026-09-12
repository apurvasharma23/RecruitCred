import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, TeamChallenge } from '../../types';
import { CandidateProfileModal } from '../profile/CandidateProfileModal';
import { TeamChallengeModal } from './TeamChallengeModal';
import { TeamChallengeResultModal } from './TeamChallengeResultModal';
import { TakeChallengeModal } from './TakeChallengeModal';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Zap,
  Check,
  ArrowLeft,
  Sparkles,
  Crown,
  RotateCcw,
  UserCheck,
  Play,
  Eye
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const TeamDetailsView: React.FC = () => {
  const {
    teams,
    selectedTeamId,
    allUsers,
    currentUser,
    reviewChallengeDecision,
    navigateTo
  } = useApp();

  const team = teams.find(t => t.id === selectedTeamId) || teams[0];

  // Modals state
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isCreateTestModalOpen, setIsCreateTestModalOpen] = useState(false);
  
  // Results inspection modal state
  const [inspectedChallenge, setInspectedChallenge] = useState<TeamChallenge | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Take challenge modal state
  const [challengeToTake, setChallengeToTake] = useState<TeamChallenge | null>(null);
  const [isTakeModalOpen, setIsTakeModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!team) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold text-white">No team found.</h3>
        <button
          onClick={() => navigateTo('teams')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Back to My Teams
        </button>
      </div>
    );
  }

  const teamMembers = team.members.map(member => {
    const user = allUsers.find(u => u.id === member.userId);
    return {
      ...member,
      user
    };
  });

  const isCurrentUserLeader = team.leaderId === currentUser.id;

  // Calculate covered vs missing skills
  const coveredSkills = Array.from(new Set(team.members.flatMap(m => m.verifiedSkills)));
  const missingSkills = team.requiredSkills.filter(
    rs => !coveredSkills.some(cs => cs.toLowerCase() === rs.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcceptCandidate = (challengeId: string) => {
    reviewChallengeDecision(challengeId, 'accepted');
    const ch = team.challengesSent.find(c => c.id === challengeId);
    showToast(`✓ ${ch?.candidateName || 'Candidate'} has been admitted to ${team.name}!`);
  };

  const handleRejectCandidate = (challengeId: string) => {
    reviewChallengeDecision(challengeId, 'rejected');
    const ch = team.challengesSent.find(c => c.id === challengeId);
    showToast(`Candidate ${ch?.candidateName || ''} marked as rejected.`);
  };

  const handleRequestAnotherTest = (candidateId: string) => {
    const cand = allUsers.find(u => u.id === candidateId);
    if (cand) {
      setSelectedCandidate(cand);
      setIsCreateTestModalOpen(true);
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return '7:42';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 shadow-glow-verified text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Back button and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('teams')}
            className="p-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-400 font-semibold">{team.hackathonName}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
                Squad Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 mt-0.5">
              {team.name}
              {isCurrentUserLeader && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  You are Team Lead
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* PRIMARY ACTIONS: Test Candidate & Recruit Member */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedCandidate(null);
              setIsCreateTestModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 fill-current" />
            Test Candidate
          </button>

          <button
            onClick={() => navigateTo('find-teammates')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Find Teammates
          </button>
        </div>
      </div>

      {/* Team Overview Card & Skill Gap Analysis */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Project Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {team.description}
          </p>
        </div>

        {/* Skill Coverage vs Missing Skills Bar */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          
          {/* Team Skill Coverage */}
          <div>
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Team Skill Coverage (Verified in Roster):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {coveredSkills.map((sk, idx) => (
                <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3 text-emerald-400" />
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Missing Complementary Skills (Need Candidates):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.length > 0 ? (
                missingSkills.map((sk, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {sk} Needed
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  100% full skill coverage achieved!
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* TEAM ROSTER (Current Members) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Current Members ({team.members.length} of {team.maxSize})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Active engineers accepted into {team.name}.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-semibold font-mono">
            {team.maxSize - team.members.length} Open Seats Left
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {teamMembers.map((member, idx) => {
            if (!member.user) return null;

            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4 shadow-lg group hover:border-slate-700 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <UserAvatar
                      src={member.user.avatar}
                      name={member.user.name}
                      size="lg"
                      className="ring-2 ring-[#6C63FF]/40 group-hover:ring-[#8B7CFF] transition-all shadow-md"
                    />
                    {member.isLeader && (
                      <span className="absolute -top-1.5 -right-1.5 p-1 bg-amber-500 rounded-full text-slate-950 shadow-md">
                        <Crown className="w-3 h-3 fill-current" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{member.user.name}</h4>
                      {member.isLeader && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                          Leader
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-indigo-400 font-medium mt-0.5">{member.role}</div>
                    
                    {/* Member Verified Skills */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {member.verifiedSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs shrink-0">
                  <div className="font-black text-emerald-400 text-sm">{member.user.overallScore}%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Proof Score</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE DIFFERENTIATING FEATURE: PRE-ACCEPTANCE SKILL TEST QUEUE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pre-Acceptance Verification Engine
            </div>
            <h3 className="text-xl font-black text-white">
              Candidate Skill Test Queue
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review custom skill tests completed by potential teammates before accepting them into the roster.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCandidate(null);
              setIsCreateTestModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            + New Skill Test
          </button>
        </div>

        {team.challengesSent.length === 0 ? (
          <div className="py-12 text-center p-6 rounded-2xl bg-slate-950/40 border border-slate-800">
            <Zap className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No active candidate tests in queue</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Send prospective members a custom 5-10 minute skill challenge to verify their ability before admitting them.
            </p>
            <button
              onClick={() => setIsCreateTestModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Dispatch Candidate Test
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {team.challengesSent.map((challenge) => {
              const isCompleted = challenge.status === 'completed';
              const isAccepted = challenge.status === 'accepted';
              const isRejected = challenge.status === 'rejected';
              const isPending = challenge.status === 'pending';

              return (
                <div
                  key={challenge.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-xl ${
                    isCompleted
                      ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/40 shadow-glow-verified'
                      : isAccepted
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-90'
                      : isRejected
                      ? 'bg-slate-950/60 border-slate-800 opacity-60'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  
                  {/* Candidate Info + Test Overview */}
                  <div className="flex items-start gap-4">
                    <img
                      src={challenge.candidateAvatar}
                      alt={challenge.candidateName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40 shrink-0 shadow-md"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-white">
                          {challenge.candidateName}
                        </h4>
                        
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {challenge.skillName} Skill Test
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                        <span>Difficulty: <strong className="text-slate-300">{challenge.difficulty}</strong></span>
                        <span>•</span>
                        <span>{challenge.questionCount} Questions</span>
                        <span>•</span>
                        <span>Time Limit: {challenge.timeLimitMinutes || 10}m</span>
                        <span>•</span>
                        <span>Sent: {challenge.sentAt}</span>
                      </div>

                      {challenge.feedback && isCompleted && (
                        <p className="text-[11px] text-slate-300 mt-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 max-w-xl">
                          <strong className="text-indigo-400">Feedback: </strong> {challenge.feedback}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RESULTS METRICS & ACTIONS AS SPECIFIED IN USER REQUEST */}
                  {isCompleted && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 justify-between lg:justify-end">
                      
                      {/* Metric Chips (Score, Accuracy, Time, Recommendation) */}
                      <div className="grid grid-cols-4 gap-2 text-center bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
                        <div className="px-2">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Score</div>
                          <div className="text-base font-black text-emerald-400 mt-0.5">
                            {challenge.score !== undefined ? `${challenge.score}%` : '91%'}
                          </div>
                        </div>

                        <div className="px-2 border-l border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</div>
                          <div className="text-base font-black text-cyan-300 mt-0.5">
                            {challenge.accuracy !== undefined ? `${challenge.accuracy}%` : '90%'}
                          </div>
                        </div>

                        <div className="px-2 border-l border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Time</div>
                          <div className="text-base font-black text-purple-300 font-mono mt-0.5">
                            {formatTime(challenge.timeSpentSeconds)}
                          </div>
                        </div>

                        <div className="px-2 border-l border-slate-800">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Recommendation</div>
                          <div className="text-xs font-black text-amber-300 mt-1 truncate">
                            {challenge.recommendation || 'Strong Candidate'}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Inspect, Accept, Reject, Request Another Test */}
                      <div className="flex items-center gap-2">
                        
                        <button
                          onClick={() => {
                            setInspectedChallenge(challenge);
                            setIsResultModalOpen(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="View complete solutions & answers"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => handleRequestAnotherTest(challenge.candidateId)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Request Another Test"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRejectCandidate(challenge.id)}
                          className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => handleAcceptCandidate(challenge.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" />
                          Accept Candidate
                        </button>
                      </div>

                    </div>
                  )}

                  {/* Accepted State */}
                  {isAccepted && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-300 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Candidate Accepted into Squad
                      </span>
                    </div>
                  )}

                  {/* Rejected State */}
                  {isRejected && (
                    <span className="text-xs font-semibold text-slate-400 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                      Candidate Rejected
                    </span>
                  )}

                  {/* Pending State */}
                  {isPending && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-amber-300 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        Awaiting Candidate Submission
                      </span>

                      {/* Interactive Demo Simulator Button */}
                      <button
                        onClick={() => {
                          setChallengeToTake(challenge);
                          setIsTakeModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
                        title="Simulate candidate taking the test"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Take / Simulate Test
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL 1: Create Skill Test Modal */}
      <TeamChallengeModal
        isOpen={isCreateTestModalOpen}
        onClose={() => setIsCreateTestModalOpen(false)}
        candidate={selectedCandidate}
        defaultTeamId={team.id}
      />

      {/* MODAL 2: Team Challenge Result Inspection Modal */}
      <TeamChallengeResultModal
        isOpen={isResultModalOpen}
        onClose={() => {
          setIsResultModalOpen(false);
          setInspectedChallenge(null);
        }}
        challenge={inspectedChallenge}
        onAccept={handleAcceptCandidate}
        onReject={handleRejectCandidate}
        onRequestAnotherTest={handleRequestAnotherTest}
      />

      {/* MODAL 3: Candidate Test Execution Modal */}
      <TakeChallengeModal
        isOpen={isTakeModalOpen}
        onClose={() => {
          setIsTakeModalOpen(false);
          setChallengeToTake(null);
        }}
        challenge={challengeToTake}
      />

      {/* MODAL 4: Candidate Profile Modal */}
      <CandidateProfileModal
        isOpen={isCandidateModalOpen}
        onClose={() => {
          setIsCandidateModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
        onSendInvite={() => {}}
        onSendChallenge={(cand) => {
          setIsCandidateModalOpen(false);
          setSelectedCandidate(cand);
          setIsCreateTestModalOpen(true);
        }}
      />

    </div>
  );
};
