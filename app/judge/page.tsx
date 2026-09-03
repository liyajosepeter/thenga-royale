'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import UploadDropzone from '@/components/UploadDropzone';
import ContestantCard from '@/components/ContestantCard';
import MetricBar from '@/components/MetricBar';
import AwardBadge from '@/components/AwardBadge';
import { Contestant } from '@/lib/types';
import { Sparkles, Trophy, ArrowRight, RotateCcw, CheckCircle2, Shield } from 'lucide-react';

export default function JudgePage() {
  const [analyzedContestant, setAnalyzedContestant] = useState<Contestant | null>(null);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>High Commission for Arboreal Splendor</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
          The Scientific Jury Chamber
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Submit any coconut tree crown to our Python & OpenCV computer vision algorithm. Every frond will be measured, segmented, and weighed for the Mr. Coconut 2026 title.
        </p>
      </div>

      {/* Main Analysis Section */}
      {!analyzedContestant ? (
        <UploadDropzone onAnalyzeSuccess={(res) => setAnalyzedContestant(res)} />
      ) : (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Success Banner */}
          <div className="p-4 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  Contestant Successfully Evaluated!
                </h3>
                <p className="text-xs text-emerald-300">
                  Frond contours segmented and official weighted Thenga score calibrated.
                </p>
              </div>
            </div>

            <button
              onClick={() => setAnalyzedContestant(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Evaluate Another Palm</span>
            </button>
          </div>

          {/* Result Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6">
              <ContestantCard contestant={analyzedContestant} />
            </div>

            <div className="md:col-span-6 glass-panel p-6 rounded-2xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-emerald-950 pb-3">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                    CV Diagnostic Report
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    {analyzedContestant.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Location: {analyzedContestant.origin || 'Unspecified Coastal Grove'}
                  </p>
                </div>

                {/* Score Big Indicator */}
                <div className="p-4 rounded-xl bg-palace-950/80 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Overall Pageant Score</div>
                    <div className="font-serif text-3xl font-black gold-gradient-text">
                      {analyzedContestant.scores.overall.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Status</span>
                    <div className="text-xs font-mono font-bold text-emerald-400">ARCHIVED IN SYSTEM</div>
                  </div>
                </div>

                {/* Awards */}
                {analyzedContestant.awards && analyzedContestant.awards.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-300">Conferred Distinctions:</div>
                    <div className="flex flex-wrap gap-2">
                      {analyzedContestant.awards.map((award) => (
                        <AwardBadge key={award.id} award={award} size="md" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Jury Commentary */}
                <div className="p-4 rounded-xl bg-palace-900/60 border border-emerald-950 space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Jury Verdict & Commentary</span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{analyzedContestant.jury_comment}&rdquo;
                  </p>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-950">
                <Link
                  href={`/results?id=${analyzedContestant.id}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-serif font-bold text-xs transition-colors"
                >
                  <span>Official Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-palace-900 hover:bg-palace-800 text-slate-200 border border-emerald-500/30 font-semibold text-xs transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5 text-gold-400" />
                  <span>Leaderboard</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Rules Card */}
      <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-400">
        <div className="space-y-1.5">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <span>🌿</span>
            <span>No Accounts Required</span>
          </div>
          <p>
            Any spectator or researcher can submit unlimited palms. There is no one-entry limit.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <span>⚖️</span>
            <span>OpenCV Python Analysis</span>
          </div>
          <p>
            Contours, convex hulls, and bilateral moments are calculated purely through Python computer vision.
          </p>
        </div>
        <div className="space-y-1.5">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <span>👑</span>
            <span>Universal Comparison</span>
          </div>
          <p>
            All submitted trees immediately join the global leaderboard competing for the 2026 King crowns.
          </p>
        </div>
      </div>

    </div>
  );
}
