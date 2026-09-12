import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#252A46] bg-[#0E111F] py-8 px-4 sm:px-6 lg:px-8 mt-16 text-[#666A7A] text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#8B7CFF]" />
          <span className="font-bold text-white text-sm">RecruitCred</span>
          <span className="text-[#666A7A]">• Campus Recruitment Credibility & Skill Verification Platform</span>
        </div>

        <div className="flex items-center gap-6 text-[#666A7A]">
          <span>“Don’t just tell recruiters what you can do. Give them evidence.”</span>
          <span className="hidden sm:inline text-[#252A46]">•</span>
          <span className="flex items-center gap-1 text-[#8B7CFF] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            Empowering Transparent Campus Hiring
          </span>
        </div>
      </div>
    </footer>
  );
};
