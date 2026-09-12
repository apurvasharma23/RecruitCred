import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateTeamModal } from './CreateTeamModal';
import {
  Users,
  Plus,
  ArrowRight,
  Crown
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const MyTeamsView: React.FC = () => {
  const { teams, currentUser, allUsers, navigateTo } = useApp();
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Hackathon Squad Headquarters
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Hackathon Teams</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Manage your project rosters, monitor member skill verifications, send test challenges, and track upcoming deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateTeamOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Create Hackathon Team
          </button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {teams.map((team) => {
          const isLeader = team.leaderId === currentUser.id;

          const members = team.members.map(m => {
            const u = allUsers.find(user => user.id === m.userId);
            return { ...m, user: u };
          });

          return (
            <div
              key={team.id}
              onClick={() => navigateTo('team-detail', { teamId: team.id })}
              className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 shadow-xl hover:shadow-2xl cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                
                {/* Team Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                      {team.hackathonName}
                    </span>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      {team.name}
                      {isLeader && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                          Lead
                        </span>
                      )}
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {team.members.length} / {team.maxSize} Members
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-6">
                  {team.description}
                </p>

                {/* Member Avatars & Verified Skills */}
                <div className="space-y-3 mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Roster Members:
                  </div>

                  <div className="flex items-center gap-2">
                    {members.map((m, idx) => (
                      <div key={idx} className="relative group/avatar" title={`${m.user?.name} (${m.role})`}>
                        <UserAvatar
                          src={m.user?.avatar}
                          name={m.user?.name || 'Member'}
                          size="md"
                          className="ring-2 ring-[#6C63FF]/40"
                        />
                        {m.isLeader && (
                          <span className="absolute -top-1 -right-1 p-0.5 bg-amber-500 rounded-full text-slate-950">
                            <Crown className="w-2.5 h-2.5 fill-current" />
                          </span>
                        )}
                      </div>
                    ))}
                    {Array.from({ length: team.maxSize - team.members.length }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="w-10 h-10 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs font-bold"
                      >
                        +
                      </div>
                    ))}
                  </div>
                </div>

                {/* Open roles pills */}
                {team.openRoles.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-semibold text-amber-400">Actively Recruiting:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {team.openRoles.map((role, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-medium">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                <span>Manage Squad & Review Tests</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          );
        })}
      </div>

      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
      />

    </div>
  );
};
