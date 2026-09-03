'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import AwardBadge from '@/components/AwardBadge';
import MetricBar from '@/components/MetricBar';
import { Crown, Sparkles, Trophy, ArrowLeft, Share2, Check, Download, Layers, ShieldCheck, MapPin } from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const contestantId = searchParams.get('id') || 'contestant-1';

  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [showCVOverlay, setShowCVOverlay] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Search user-uploaded contestants from localStorage
    try {
      const stored = localStorage.getItem('thenga_contestants');
      if (stored) {
        const localList: Contestant[] = JSON.parse(stored);
        const match = localList.find((c) => c.id === contestantId) || localList[0];
        if (match) {
          setContestant(match);
          return;
        }
      }
    } catch (e) {
      // LocalStorage fallback
    }
  }, [contestantId]);

  if (!contestant) {
    return (
      <div className="glass-panel-gold p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border-gold-400/40">
        <span className="text-4xl">🌴</span>
        <h2 className="font-serif font-bold text-2xl text-white">No Evaluated Dossier Found</h2>
        <p className="text-xs text-slate-300">
          Upload and analyze coconut tree images in the Jury Chamber to generate an official certificate.
        </p>
        <Link
          href="/judge"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
        >
          <span>Go to Jury Chamber 🌴</span>
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isWinner = contestant.rank === 1;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/leaderboard"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sovereign Leaderboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCVOverlay(!showCVOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showCVOverlay
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-palace-900 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showCVOverlay ? 'CV Frond Overlay: ON' : 'CV Frond Overlay: OFF'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-palace-900 hover:bg-palace-800 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Sovereign Pageant Certificate */}
      <div
        className={`rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 ${
          isWinner
            ? 'glass-panel-gold glow-gold border-gold-400/60'
            : 'glass-panel border-emerald-500/40'
        }`}
      >
        {/* Certificate Watermark Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-950 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gold-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Certificate of Arboreal Splendor</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                {contestant.name}
              </h1>
              {contestant.hairstyle_title && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold-500/20 border border-gold-400/40 text-xs font-serif font-bold text-gold-300 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>{contestant.hairstyle_title}</span>
                </span>
              )}
            </div>
            {contestant.origin && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{contestant.origin}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase text-slate-400 font-medium">Final Certified Rating</div>
              <div className="font-serif text-4xl font-black gold-gradient-text">
                {contestant.scores.overall.toFixed(1)}
                <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
              </div>
            </div>
            {contestant.rank && (
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-serif font-black shadow-xl ${
                  contestant.rank === 1
                    ? 'bg-gradient-to-br from-gold-400 to-amber-500 text-slate-950 glow-gold'
                    : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                }`}
              >
                <span className="text-[10px] uppercase font-sans">Rank</span>
                <span className="text-lg leading-tight">#{contestant.rank}</span>
              </div>
            )}
          </div>
        </div>

        {/* Awards Conferred */}
        {contestant.awards && contestant.awards.length > 0 && (
          <div className="pt-6 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs text-slate-400 font-semibold font-serif">Conferred Pageant Honors:</span>
            {contestant.awards.map((award) => (
              <AwardBadge key={award.id} award={award} size="lg" />
            ))}
          </div>
        )}

        {/* Main Body: Image with CV scanner overlay & Score details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          
          {/* Photo with CV Overlay */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950">
              <img
                src={contestant.image_url}
                alt={contestant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                }}
              />

              {/* Simulated Computer Vision Annotations Overlay */}
              {showCVOverlay && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Canopy Bounding Box */}
                  <div
                    className="absolute border-2 border-emerald-400/80 rounded-lg bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                    style={{
                      left: '12%',
                      top: '15%',
                      width: '76%',
                      height: '65%',
                    }}
                  >
                    <div className="absolute -top-3 left-2 px-1.5 py-0.5 rounded bg-palace-950 border border-emerald-400 text-[9px] font-mono text-emerald-300">
                      Canopy Convex Hull [OpenCV]
                    </div>
                  </div>

                  {/* Symmetry Vertical Midline Axis */}
                  <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-dashed border-l border-gold-400/70 shadow-[0_0_8px_rgba(250,204,21,0.6)]">
                    <div className="absolute -top-2 -left-6 px-1 py-0.5 rounded bg-palace-950 border border-gold-400 text-[8px] font-mono text-gold-300">
                      Center Axis
                    </div>
                  </div>

                  {/* Frond Gradient Direction Indicators */}
                  <div className="absolute top-1/3 left-1/4 text-emerald-300 text-xs font-mono animate-pulse">
                    &larr; Vector L (48.8%)
                  </div>
                  <div className="absolute top-1/3 right-1/4 text-emerald-300 text-xs font-mono animate-pulse">
                    Vector R (51.2%) &rarr;
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
              <span>Segmented Frond Pixels: ~{contestant.frond_pixel_count?.toLocaleString() || '42,800'} px</span>
              <span className="text-emerald-400">Status: Verified CV 3.13</span>
            </div>
          </div>

          {/* Metric Breakdown & Mathematical Formula */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-base text-white flex items-center justify-between">
                <span>The 4 Hairstyle Dimensions</span>
                <span className="text-xs font-mono text-slate-400 font-normal">Weight Calibrated</span>
              </h3>

              <div className="space-y-3.5">
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
            </div>

            {/* Scientific Jury Commentary */}
            <div className="p-4 rounded-2xl bg-palace-900/80 border border-emerald-950 space-y-2">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold-400 font-semibold font-serif">
                <Sparkles className="w-3.5 h-3.5" />
                <span>High Commission Jury Remarks</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                &ldquo;{contestant.jury_comment}&rdquo;
              </p>
            </div>

            {/* Mathematical Certification Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-emerald-400 font-bold">CALCULATION AUDIT:</div>
              <div>({contestant.scores.volume} × 0.30) + ({contestant.scores.spread} × 0.25) + ({contestant.scores.symmetry} × 0.25) + ({contestant.scores.wind_style} × 0.20)</div>
              <div className="text-white font-bold">= {contestant.scores.overall.toFixed(1)} Composite Pageant Score</div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/judge"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-serif font-bold text-xs transition-colors"
          >
            <span>Evaluate Another Coconut Palm</span>
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-palace-900 hover:bg-palace-800 text-slate-200 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <Trophy className="w-4 h-4 text-gold-400" />
            <span>Return to Global Leaderboard</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading Pageant Dossier...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
