import React from 'react';

interface MetricBarProps {
  label: string;
  value: number;
  weight: number;
  icon: string;
  color?: 'emerald' | 'cyan' | 'teal' | 'amber' | 'gold';
  showDetails?: boolean;
}

export default function MetricBar({
  label,
  value,
  weight,
  icon,
  color = 'emerald',
  showDetails = true,
}: MetricBarProps) {
  const barColors = {
    emerald: 'from-emerald-600 via-emerald-400 to-emerald-300 shadow-[0_0_12px_rgba(56,178,137,0.4)]',
    cyan: 'from-mint-400 via-mint-300 to-teal-200 shadow-[0_0_12px_rgba(46,196,182,0.4)]',
    teal: 'from-emerald-700 via-emerald-500 to-mint-400 shadow-[0_0_12px_rgba(40,139,107,0.4)]',
    amber: 'from-amber-600 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(230,202,133,0.4)]',
    gold: 'from-gold-600 via-gold-400 to-gold-200 shadow-[0_0_15px_rgba(212,175,55,0.5)]',
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-sm select-none">{icon}</span>
          <span className="font-serif font-bold text-ivory-100">{label}</span>
          {showDetails && (
            <span className="text-[10px] text-sage-300 font-mono">
              ({Math.round(weight * 100)}%)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 font-mono font-bold text-ivory-100">
          <span className="text-gold-300">{value.toFixed(1)}</span>
          <span className="text-[10px] text-sage-400 font-normal">/ 100</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 rounded-full bg-forest-950 border border-emerald-500/20 overflow-hidden p-0.5 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColors[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
