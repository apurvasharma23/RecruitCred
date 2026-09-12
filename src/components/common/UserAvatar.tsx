import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showVerified?: boolean;
  showOnline?: boolean;
  onClick?: () => void;
  title?: string;
}

export const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  showVerified = false,
  showOnline = false,
  onClick,
  title
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-20 h-20 text-lg',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28 text-2xl',
    custom: ''
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;
  const initials = getInitials(name);
  const hasValidImage = Boolean(src && src.trim() !== '' && !imageError);

  return (
    <div
      onClick={onClick}
      title={title || name}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${currentSizeClass} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {hasValidImage ? (
        <img
          src={src!}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#171A2B] via-[#252A46] to-[#1F243B] border border-[#6C63FF]/30 flex items-center justify-center font-extrabold text-[#8B7CFF] shadow-inner">
          <span>{initials}</span>
        </div>
      )}

      {showOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-[#0E111F]" />
      )}

      {showVerified && (
        <span className="absolute -bottom-1 -right-1 p-0.5 bg-[#10B981] rounded-full text-[#0E111F] ring-2 ring-[#0E111F]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </div>
  );
};
