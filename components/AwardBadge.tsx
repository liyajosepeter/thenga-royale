import React from 'react';
import { PageantAward } from '@/lib/types';

interface AwardBadgeProps {
  award: PageantAward;
  size?: 'sm' | 'md' | 'lg';
}

export default function AwardBadge({ award, size = 'md' }: AwardBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
    lg: 'text-sm px-4 py-1.5 gap-2.5 font-bold',
  };

  const colorStyles = {
    gold: 'bg-gradient-to-r from-champagne-200/90 to-champagne-300/80 border-champagne-500/60 text-tropical-950 shadow-sm shadow-champagne-500/20 font-bold',
    emerald: 'bg-gradient-to-r from-tropical-100 to-tropical-200/80 border-tropical-600/40 text-tropical-950 shadow-sm font-semibold',
    teal: 'bg-gradient-to-r from-teal-50 to-teal-100/90 border-teal-500/40 text-teal-950 shadow-sm font-semibold',
    cyan: 'bg-gradient-to-r from-cyan-50 to-cyan-100/90 border-cyan-500/40 text-cyan-950 shadow-sm font-semibold',
    amber: 'bg-gradient-to-r from-amber-50 to-amber-100/90 border-amber-500/40 text-amber-950 shadow-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-serif border backdrop-blur-md transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${colorStyles[award.color] || colorStyles.gold}`}
      title={award.description || award.title}
    >
      <span className="text-sm select-none">{award.icon}</span>
      <span className="tracking-wide uppercase">{award.title}</span>
    </span>
  );
}
