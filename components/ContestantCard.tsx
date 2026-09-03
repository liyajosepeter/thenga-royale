import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Contestant } from '@/lib/types';
import AwardBadge from './AwardBadge';
import MetricBar from './MetricBar';
import { Sparkles, MapPin, Award, ArrowUpRight } from 'lucide-react';

interface ContestantCardProps {
  contestant: Contestant;
  isLeaderboardView?: boolean;
}

export default function ContestantCard({ contestant, isLeaderboardView = false }: ContestantCardProps) {
  const isWinner = contestant.rank === 1;

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-300 overflow-hidden ${
        isWinner
          ? 'glass-panel-gold glow-gold scale-[1.02] border-gold-400/50 hover:border-gold-300'
          : 'glass-panel hover:border-emerald-500/50 hover:-translate-y-1'
      }`}
    >
      {/* Top Banner with Rank Badge */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={contestant.image_url}
          alt={contestant.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-palace-950 via-palace-950/30 to-transparent" />

        {/* Rank Badge */}
        {contestant.rank && (
          <div className="absolute top-3 left-3">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-serif font-black text-xs shadow-lg backdrop-blur-md ${
                contestant.rank === 1
                  ? 'bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 glow-gold'
                  : contestant.rank === 2
                  ? 'bg-slate-300/90 text-slate-950'
                  : contestant.rank === 3
                  ? 'bg-amber-700/90 text-white'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700'
              }`}
            >
              <span>#{contestant.rank}</span>
              {contestant.rank === 1 && <span>👑</span>}
            </div>
          </div>
        )}

        {/* Overall Score Floating Pill */}
        <div className="absolute top-3 right-3">
          <div className="flex flex-col items-end px-3 py-1.5 rounded-xl bg-palace-950/85 border border-emerald-500/30 backdrop-blur-md shadow-xl">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Pageant Score</span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-lg font-black text-emerald-400">
                {contestant.scores.overall.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">/ 100</span>
            </div>
          </div>
        </div>

        {/* Contestant Name & Origin at bottom of photo */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif font-bold text-lg text-white group-hover:text-emerald-300 transition-colors drop-shadow-md">
            {contestant.name}
          </h3>
          {contestant.origin && (
            <div className="flex items-center gap-1 text-xs text-slate-300 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{contestant.origin}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4">
        {/* Awards Row */}
        {contestant.awards && contestant.awards.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {contestant.awards.map((award) => (
              <AwardBadge key={award.id} award={award} size="sm" />
            ))}
          </div>
        )}

        {/* Hairstyle Dimensions Breakdown */}
        <div className="space-y-2.5 pt-1">
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

        {/* Scientific Jury Commentary Snippet */}
        {contestant.jury_comment && (
          <p className="text-xs text-slate-400 italic line-clamp-2 bg-palace-900/60 p-2.5 rounded-lg border border-emerald-950">
            &ldquo;{contestant.jury_comment}&rdquo;
          </p>
        )}

        {/* View Detailed Dossier Button */}
        <Link
          href={`/results?id=${contestant.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-palace-900/80 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold transition-all duration-200"
        >
          <span>Examine Frond Geometry</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
