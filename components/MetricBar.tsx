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
    emerald: 'from-emerald-600 to-emerald-400 shadow-emerald-500/30',
    cyan: 'from-cyan-600 to-cyan-400 shadow-cyan-500/30',
    teal: 'from-teal-600 to-teal-400 shadow-teal-500/30',
    amber: 'from-amber-600 to-amber-400 shadow-amber-500/30',
    gold: 'from-yellow-600 to-gold-400 shadow-gold-500/30',
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-sm select-none">{icon}</span>
          <span className="font-medium text-slate-200">{label}</span>
          {showDetails && (
            <span className="text-[10px] text-slate-500 font-mono">
              ({Math.round(weight * 100)}%)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-100">
          <span>{value.toFixed(1)}</span>
          <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 rounded-full bg-slate-900/80 border border-slate-800/80 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColors[color]} transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
