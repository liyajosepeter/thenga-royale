import React from 'react';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import MetricBar from './MetricBar';
import AwardBadge from './AwardBadge';
import { Sparkles, Trophy, ArrowRight, Shield, RotateCcw, CheckCircle2 } from 'lucide-react';

interface AnalysisResultCardProps {
  contestant: Contestant;
  onReset?: () => void;
}

export default function AnalysisResultCard({ contestant, onReset }: AnalysisResultCardProps) {
  return (
    <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border-gold-500/40 space-y-6 shadow-2xl animate-fadeIn">
      
      {/* Top Header with Verified CV Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-xl flex-shrink-0">
            🌴
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Verified Python OpenCV CV Analysis
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white mt-1">
              {contestant.name}
            </h3>
          </div>
        </div>

        {/* Hairstyle Title Badge */}
        {contestant.hairstyle_title && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-gold-500/20 via-amber-500/10 to-gold-500/20 border border-gold-400/50 shadow-lg">
            <Sparkles className="w-4 h-4 text-gold-400 animate-pulse" />
            <span className="font-serif font-black text-xs sm:text-sm gold-gradient-text uppercase tracking-wider">
              {contestant.hairstyle_title}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Photo & Metric Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Photo Container with Canopy Frond Box */}
        <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/30 shadow-xl">
          <img
            src={contestant.image_url}
            alt={contestant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-palace-950/80 via-transparent to-transparent" />
          
          {/* Provenance Badge */}
          {contestant.origin && (
            <div className="absolute bottom-3 left-3 text-xs text-slate-300 font-mono">
              📍 {contestant.origin}
            </div>
          )}
        </div>

        {/* Metric Bars Column */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Pageant Hairstyle Index Breakdown */}
          <div className="space-y-3 bg-palace-950/60 p-5 rounded-2xl border border-emerald-950">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-emerald-950 pb-2">
              <span>CRITERIA DIMENSIONS</span>
              <span>CALIBRATED SCORE</span>
            </div>

            <MetricBar
              label="Hair Volume"
              value={contestant.scores.volume}
              weight={0.30}
              icon="🌿"
              color="teal"
            />
            <MetricBar
              label="Hair Spread"
              value={contestant.scores.spread}
              weight={0.25}
              icon="↔️"
              color="cyan"
            />
            <MetricBar
              label="Symmetry"
              value={contestant.scores.symmetry}
              weight={0.25}
              icon="⚖️"
              color="emerald"
            />
            <MetricBar
              label="Wind Style"
              value={contestant.scores.wind_style}
              weight={0.20}
              icon="💨"
              color="amber"
            />
          </div>

          {/* Large Overall Hairstyle Score Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-palace-950 via-palace-900 to-palace-950 border border-gold-500/40 flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Composite Hairstyle Index
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-black gold-gradient-text">
                {contestant.scores.overall.toFixed(2)}{' '}
                <span className="text-sm font-normal text-slate-500 font-mono">/ 100.00</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                Official Title
              </span>
              <span className="font-serif font-bold text-xs sm:text-sm text-gold-300">
                {contestant.hairstyle_title || 'Runway Contender'}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Jury Commentary */}
      {contestant.jury_comment && (
        <div className="p-4 rounded-2xl bg-palace-950/70 border border-emerald-950 space-y-1">
          <div className="text-[10px] uppercase font-mono text-gold-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Certified Jury Appraisal</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
            &ldquo;{contestant.jury_comment}&rdquo;
          </p>
        </div>
      )}

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-palace-900 hover:bg-palace-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors w-full sm:w-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Evaluate Another Palm</span>
          </button>
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/leaderboard"
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-palace-900 hover:bg-palace-800 text-slate-200 border border-gold-500/30 text-xs font-semibold transition-colors flex-1 sm:flex-initial"
          >
            <Trophy className="w-3.5 h-3.5 text-gold-400" />
            <span>View Leaderboard</span>
          </Link>

          <Link
            href={`/results?id=${contestant.id}`}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-serif font-bold text-xs transition-colors glow-emerald flex-1 sm:flex-initial"
          >
            <span>Full CV Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
