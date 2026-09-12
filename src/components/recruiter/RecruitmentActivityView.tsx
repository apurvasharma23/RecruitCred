import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckSquare,
  Bookmark,
  GraduationCap,
  Briefcase,
  Eye
} from 'lucide-react';

export const RecruitmentActivityView: React.FC = () => {
  const { recruiterActivities, navigateTo } = useApp();
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');

  const filteredActivities = activityTypeFilter === 'all'
    ? recruiterActivities
    : recruiterActivities.filter(a => a.type === activityTypeFilter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'candidate_shortlisted':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'candidate_saved':
        return <Bookmark className="w-4 h-4 text-amber-400" />;
      case 'requirement_created':
        return <Briefcase className="w-4 h-4 text-[#8B7CFF]" />;
      case 'college_selected':
        return <GraduationCap className="w-4 h-4 text-cyan-400" />;
      case 'candidate_viewed':
      default:
        return <Eye className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#8B7CFF]" />
            Recruitment Activity
          </h1>
          <p className="text-xs sm:text-sm text-[#666A7A] mt-1">
            Audit history of your recruitment searches, candidate evaluations, and campus pipeline decisions.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#666A7A] font-semibold">Filter:</span>
          <select
            value={activityTypeFilter}
            onChange={e => setActivityTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#171A2B] border border-[#252A46] rounded-xl text-xs text-white focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="all">All Actions</option>
            <option value="candidate_shortlisted">Shortlisted</option>
            <option value="candidate_saved">Saved</option>
            <option value="requirement_created">Requirements</option>
            <option value="college_selected">College Switched</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="p-6 rounded-2xl bg-[#171A2B] border border-[#252A46] space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#666A7A]">
            No recorded activities matching this filter.
          </div>
        ) : (
          <div className="relative border-l-2 border-[#252A46] ml-4 space-y-6 pl-6 py-2">
            {filteredActivities.map(act => (
              <div key={act.id} className="relative group">
                {/* Bullet Icon */}
                <div className="absolute -left-[35px] top-1 w-8 h-8 rounded-full bg-[#111424] border border-[#252A46] flex items-center justify-center shadow-md">
                  {getIcon(act.type)}
                </div>

                {/* Content Card */}
                <div className="p-4 rounded-xl bg-[#111424] border border-[#252A46] hover:border-[#6C63FF]/30 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white">{act.title}</h3>
                    <span className="text-[11px] font-mono text-[#666A7A]">{act.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {act.description}
                  </p>

                  {act.candidateName && (
                    <div className="mt-2 pt-2 border-t border-[#252A46] flex items-center justify-between text-xs">
                      <span className="text-[#8B7CFF] font-semibold">Candidate: {act.candidateName}</span>
                      <button
                        onClick={() => navigateTo('shortlisted-candidates')}
                        className="text-[#6C63FF] hover:underline font-bold"
                      >
                        View Shortlist →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
