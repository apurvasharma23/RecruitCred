import React from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  isOpen,
  onClick,
  unreadCount = 0
}) => {
  if (isOpen) {
    return (
      <button
        onClick={onClick}
        aria-label="Close CredAI Assistant"
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-[#171A2B] text-white border border-[#252A46] shadow-2xl hover:bg-[#252A46] transition-all cursor-pointer flex items-center justify-center group"
      >
        <X className="w-5 h-5 text-slate-300 group-hover:text-white" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label="Open CredAI Assistant"
      className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-2xl bg-[#171A2B] hover:bg-[#252A46] text-white border border-[#252A46] hover:border-[#6C63FF]/50 shadow-2xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer group hover:scale-[1.02]"
    >
      <div className="w-7 h-7 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/40 flex items-center justify-center text-[#8B7CFF] shrink-0 group-hover:bg-[#6C63FF] group-hover:text-white transition-colors">
        <Bot className="w-4 h-4" />
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
            CredAI
            <Sparkles className="w-2.5 h-2.5 text-[#8B7CFF]" />
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="text-[10px] text-[#666A7A] group-hover:text-slate-300 font-medium transition-colors hidden sm:block">
          Your RecruitCred assistant
        </div>
      </div>

      {unreadCount > 0 && (
        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#6C63FF] text-[9px] font-bold text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
