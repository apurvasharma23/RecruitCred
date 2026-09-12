import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickActionsProps {
  isRecruiter: boolean;
  onSelectAction: (actionText: string) => void;
  currentPage?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  isRecruiter,
  onSelectAction,
  currentPage: _currentPage
}) => {
  const studentActions = [
    'Improve My Profile',
    'Understand My Credibility Score',
    'Add Project Evidence',
    'Prepare for Verification',
    'Find Relevant Opportunities',
    'Find Teammates',
    'Understand RecruitCred Pro',
    'How RecruitCred Works'
  ];

  const recruiterActions = [
    'Find Candidates',
    'Understand Verification',
    'Compare Candidates',
    'RecruitCred Overview',
    'Understand RecruitCred Pro'
  ];

  const actions = isRecruiter ? recruiterActions : studentActions;

  return (
    <div className="p-3 bg-slate-900/90 border-t border-slate-800">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>How can CredAI help?</span>
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={() => onSelectAction(act)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600/30 hover:border-brand-500/50 text-[11px] text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer text-left"
          >
            {act}
          </button>
        ))}
      </div>
    </div>
  );
};
