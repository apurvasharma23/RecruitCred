import React from 'react';

interface ProBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ProBadge: React.FC<ProBadgeProps> = ({
  size = 'sm',
  showLabel = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-bold tracking-wider',
    md: 'text-xs px-2 py-0.5 font-bold tracking-wide',
    lg: 'text-sm px-2.5 py-1 font-bold tracking-wide'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-[#6C63FF]/30 bg-[#6C63FF]/10 text-[#8B7CFF] uppercase select-none ${sizeClasses[size]} ${className}`}
      title="RecruitCred Pro Subscriber — Priority profile visibility when relevance is comparable"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
      PRO
      {showLabel && <span className="text-[10px] font-medium normal-case text-gray-400">· Priority</span>}
    </span>
  );
};
