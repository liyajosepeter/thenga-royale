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
    gold: 'bg-gradient-to-r from-gold-500/20 via-gold-400/25 to-gold-500/20 border-gold-400/60 text-gold-300 shadow-md shadow-gold-500/20 font-bold',
    emerald: 'bg-gradient-to-r from-emerald-600/25 to-emerald-500/20 border-emerald-400/50 text-mint-200 shadow-md font-semibold',
    teal: 'bg-gradient-to-r from-teal-600/25 to-teal-500/20 border-teal-400/50 text-teal-200 shadow-md font-semibold',
    cyan: 'bg-gradient-to-r from-mint-500/25 to-mint-400/20 border-mint-400/50 text-mint-200 shadow-md font-semibold',
    amber: 'bg-gradient-to-r from-amber-600/25 to-gold-500/20 border-amber-400/50 text-amber-200 shadow-md font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-serif font-malayalam border backdrop-blur-md transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${colorStyles[award.color] || colorStyles.gold}`}
      title={award.description || award.title}
    >
      <span className="text-sm select-none">{award.icon}</span>
      <span className="tracking-wide uppercase">{award.title}</span>
    </span>
  );
}
