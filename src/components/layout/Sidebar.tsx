import React from 'react';
import { useApp, ActivePage } from '../../context/AppContext';
import {
  LayoutDashboard,
  UserCircle2,
  ShieldCheck,
  FileCode2,
  Award,
  Users,
  Compass,
  Inbox,
  Settings,
  Globe2,
  LogOut,
  Bot,
  Sparkles,
  Search,
  GraduationCap,
  CheckSquare,
  Clock
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: {
    id: ActivePage;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    isSidebarCollapsed, 
    invitations, 
    currentUser,
    teams,
    logout,
    isRecruiter,
    shortlistedCandidates
  } = useApp();

  const myPendingInvites = invitations.filter(
    i => i.invitedUserId === currentUser.id && i.status === 'pending'
  ).length;

  const myPendingChallenges = teams.reduce((count, team) => {
    return count + team.challengesSent.filter(
      c => c.candidateId === currentUser.id && c.status === 'pending'
    ).length;
  }, 0);

  const totalActionCount = myPendingInvites + myPendingChallenges;
  const verifiedSkillsCount = currentUser.skills.filter(s => s.status === 'verified').length;
  const shortlistedCount = shortlistedCandidates.filter(s => s.status === 'shortlisted').length;

  // Role-specific navigation groups
  const studentNavGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'PROFILE & CREDENTIALS',
      items: [
        { id: 'profile', label: 'My Profile', icon: UserCircle2 },
        { id: 'skills', label: 'Skills & Evidence', icon: ShieldCheck, badge: `${verifiedSkillsCount} Ver.`, badgeColor: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30' }
      ]
    },
    {
      title: 'RECRUITMENT & SQUADS',
      items: [
        { id: 'find-teammates', label: 'Opportunities & Teams', icon: Compass },
        { id: 'teams', label: 'My Squads', icon: Users },
        { id: 'invitations', label: 'Invitations & Inbox', icon: Inbox, badge: totalActionCount > 0 ? totalActionCount : undefined, badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
      ]
    },
    {
      title: 'ASSESSMENTS',
      items: [
        { id: 'assessments', label: 'Assessment Center', icon: FileCode2 },
        { id: 'certificates', label: 'Certificates', icon: Award }
      ]
    }
  ];

  const recruiterNavGroups: NavGroup[] = [
    {
      title: 'RECRUITER WORKSPACE',
      items: [
        { id: 'recruiter-dashboard', label: 'Recruiter Dashboard', icon: LayoutDashboard },
        { id: 'find-candidates', label: 'Find Candidates', icon: Search },
        { id: 'college-recruitment', label: 'College Recruitment', icon: GraduationCap },
        { id: 'shortlisted-candidates', label: 'Shortlisted Candidates', icon: CheckSquare, badge: shortlistedCount > 0 ? shortlistedCount : undefined, badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
        { id: 'recruitment-activity', label: 'Recruitment Activity', icon: Clock }
      ]
    }
  ];

  const activeNavGroups = isRecruiter ? recruiterNavGroups : studentNavGroups;

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-[#111424] lg:bg-transparent border-r border-[#252A46] transition-all duration-200 flex flex-col justify-between p-3.5 shrink-0 select-none ${
        isSidebarCollapsed ? 'w-18' : 'w-60'
      }`}
    >
      {/* Top Grouped Navigation */}
      <div className="space-y-5 overflow-y-auto scrollbar-none pr-0.5">
        {activeNavGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold text-[#666A7A] uppercase tracking-wider">
                {group.title}
              </div>
            )}

            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || 
                (item.id === 'assessments' && (currentPage === 'assessment-runner' || currentPage === 'assessment-result')) ||
                (item.id === 'teams' && currentPage === 'team-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#6C63FF]/15 text-white border border-[#6C63FF]/30 shadow-xs'
                      : 'text-[#666A7A] hover:text-slate-200 hover:bg-[#171A2B]'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#8B7CFF]' : 'text-[#666A7A] group-hover:text-slate-300'
                      }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!isSidebarCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* CredAI Quick Trigger Button */}
        <div className="pt-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-credai'))}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#8B7CFF] bg-[#6C63FF]/10 hover:bg-[#6C63FF]/20 border border-[#6C63FF]/25 transition-all group cursor-pointer"
            title="CredAI Assistant"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Bot className="w-4 h-4 text-[#8B7CFF] shrink-0 group-hover:scale-110 transition-transform" />
              {!isSidebarCollapsed && (
                <span className="truncate flex items-center gap-1 font-bold">
                  CredAI Assistant
                  <Sparkles className="w-2.5 h-2.5 text-[#8B7CFF]" />
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#6C63FF] text-white">
                AI
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-1 pt-3 border-t border-[#252A46]">
        <button
          onClick={() => navigateTo('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            currentPage === 'settings'
              ? 'bg-[#171A2B] text-white border border-[#252A46]'
              : 'text-[#666A7A] hover:text-slate-200 hover:bg-[#171A2B]'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4 text-[#666A7A] shrink-0" />
          {!isSidebarCollapsed && <span>Settings</span>}
        </button>

        {!isRecruiter && (
          <button
            onClick={() => navigateTo('landing')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#666A7A] hover:text-[#8B7CFF] hover:bg-[#171A2B] transition-colors cursor-pointer"
            title="Landing Page"
          >
            <Globe2 className="w-4 h-4 text-[#666A7A] shrink-0" />
            {!isSidebarCollapsed && <span>Landing Page</span>}
          </button>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
          title="Log Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
