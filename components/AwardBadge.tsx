import React from 'react';
import { PageantAward } from '@/lib/types';

interface AwardBadgeProps {
  award: PageantAward;
  size?: 'sm' | 'md' | 'lg';
}

export default function AwardBadge({ award, size = 'md' }: AwardBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2',
    lg: 'text-sm px-4 py-1.5 gap-2.5 font-bold',
  };

  const colorStyles = {
    gold: 'bg-gold-500/15 border-gold-500/40 text-gold-300 glow-gold shadow-gold-500/10',
    emerald: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 glow-emerald',
    teal: 'bg-teal-500/15 border-teal-500/40 text-teal-300',
    cyan: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    amber: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-serif font-semibold border shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 ${sizeClasses[size]} ${colorStyles[award.color] || colorStyles.gold}`}
      title={award.description || award.title}
    >
      <span className="text-base select-none">{award.icon}</span>
      <span>{award.title}</span>
    </span>
  );
}
