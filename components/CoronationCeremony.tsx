'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import { calculatePageantAwards, PageantAwardsResult } from '@/lib/awards';
import MetricBar from './MetricBar';
import AwardBadge from './AwardBadge';
import { Crown, Sparkles, Trophy, ArrowRight, RotateCcw, Award, CheckCircle2, Shield, ArrowUpRight, Scale, Wind, Compass, Layers } from 'lucide-react';

interface CoronationCeremonyProps {
  contestants: Contestant[];
  onRestartJudging?: () => void;
}

export default function CoronationCeremony({ contestants, onRestartJudging }: CoronationCeremonyProps) {
  // Phase 1: Preamble ('preamble')
  // Phase 2: Suspense Curtain ('suspense')
  // Phase 3: Grand Reveal ('reveal')
  const [phase, setPhase] = useState<'preamble' | 'suspense' | 'reveal'>('preamble');
  const [awardsResult, setAwardsResult] = useState<PageantAwardsResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute awards
  useEffect(() => {
    if (contestants && contestants.length > 0) {
      const result = calculatePageantAwards(contestants);
      setAwardsResult(result);
    }
  }, [contestants]);

  // Phase Progression Timers
  useEffect(() => {
    if (!contestants || contestants.length === 0) return;

    // Phase 1 -> Phase 2 after 2.8s
    const t1 = setTimeout(() => {
      setPhase('suspense');
    }, 2800);

    // Phase 2 -> Phase 3 after another 2.5s (total 5.3s)
    const t2 = setTimeout(() => {
      setPhase('reveal');
    }, 5300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [contestants]);

  // Sovereign Golden Particle Canvas Effect (Subtle, tasteful, luxury aesthetic)
  useEffect(() => {
    if (phase !== 'reveal') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    const height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Subtle golden particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * -0.6 - 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      hue: Math.random() > 0.4 ? 43 : 155 // Gold & Emerald hues
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.8)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  const skipToReveal = () => setPhase('reveal');

  if (!contestants || contestants.length === 0 || !awardsResult || !awardsResult.champion) {
    return (
      <div className="glass-panel-gold p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto border-gold-400/40">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-3xl">
          🌴
        </div>
        <div className="space-y-2">
          <h2 className="font-serif font-bold text-2xl text-white">No Coronation Pending</h2>
          <p className="text-xs text-slate-300">
            Submit coconut tree crown images into the Jury Chamber to initiate the competition.
          </p>
        </div>
        <Link
          href="/judge"
          className="inline-flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-serif font-black text-xs glow-emerald"
        >
          <span>ENTER CONTESTANTS 🌴</span>
        </Link>
      </div>
    );
  }

  const { champion, symmetryKing, volumeKing, spreadKing, windKing } = awardsResult;

  return (
    <div className="relative min-h-[600px] w-full max-w-5xl mx-auto overflow-hidden">
      
      {/* Background Particle Canvas */}
      {phase === 'reveal' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0 opacity-70"
        />
      )}

      {/* STAGE 1: SOLEMN PREAMBLE */}
      {phase === 'preamble' && (
        <div className="glass-panel p-12 sm:p-20 rounded-3xl text-center space-y-8 max-w-3xl mx-auto border-gold-500/20 shadow-2xl animate-fadeIn relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>SOVEREIGN HIGH COMMISSION CONCLAVE</span>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-snug">
              &ldquo;After an extensive computational evaluation of absolutely no practical importance...&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono italic">
              Impartially calibrated across 4 botanical vectors using Python and OpenCV.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
            <button
              onClick={skipToReveal}
              className="text-xs font-mono text-slate-400 hover:text-gold-300 underline transition-colors"
            >
              Skip Animation &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: SUSPENSE BUILD */}
      {phase === 'suspense' && (
        <div className="glass-panel-gold p-12 sm:p-20 rounded-3xl text-center space-y-8 max-w-3xl mx-auto border-gold-400/50 shadow-2xl animate-fadeIn relative z-10 glow-gold">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-4xl animate-bounce">
            👑
          </div>

          <div className="space-y-3">
            <div className="text-xs font-mono text-gold-300 uppercase tracking-widest font-bold">
              The Jury Has Reached an Infallible Verdict
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide">
              THE COCONUT CROWN GOES TO...
            </h1>
          </div>

          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={skipToReveal}
              className="text-xs font-mono text-slate-400 hover:text-gold-300 underline transition-colors"
            >
              Reveal Monarch &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: THE GRAND CORONATION REVEAL */}
      {phase === 'reveal' && (
        <div className="space-y-12 animate-fadeIn relative z-10">
          
          {/* Main Monarch Spotlight Card */}
          <div className="glass-panel-gold p-6 sm:p-10 rounded-3xl border-2 border-gold-400/80 shadow-2xl glow-gold relative overflow-hidden">
            
            {/* Top Coronation Banner */}
            <div className="text-center space-y-2 border-b border-gold-500/30 pb-6 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 font-serif font-black text-xs shadow-xl tracking-wider uppercase">
                <Crown className="w-4 h-4" />
                <span>👑 MR. COCONUT 2026 — SOVEREIGN MONARCH</span>
                <Crown className="w-4 h-4" />
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight pt-2">
                {champion.name}
              </h2>

              {champion.hairstyle_title && (
                <div className="inline-block px-4 py-1 rounded-xl bg-palace-950 border border-gold-500/40 text-xs sm:text-sm font-serif font-bold text-gold-300 uppercase tracking-wider shadow-inner">
                  {champion.hairstyle_title}
                </div>
              )}
            </div>

            {/* Content Grid: Photo + Scores Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Photo Frame */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-400/80 bg-slate-950 glow-gold group">
                  <img
                    src={champion.image_url}
                    alt={champion.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-palace-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Provenance */}
                  <div className="absolute bottom-3 left-3 text-xs text-slate-200 font-mono backdrop-blur-md px-2.5 py-1 rounded-lg bg-palace-950/80 border border-slate-700">
                    📍 {champion.origin || 'Coastal Grove'}
                  </div>
                </div>

                {/* Champion Awards Conferred Ribbons */}
                {champion.awards && champion.awards.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {champion.awards.map((award) => (
                      <AwardBadge key={award.id} award={award} size="md" />
                    ))}
                  </div>
                )}
              </div>

              {/* Scores & Metrics Panel */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Grand Composite Score Callout */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-palace-950/90 border border-gold-500/40 shadow-inner">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">
                      Supreme Pageant Index
                    </span>
                    <span className="text-xs text-gold-300/80">
                      Weighted Composite Formula Score
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-4xl sm:text-5xl font-black gold-gradient-text drop-shadow-md">
                      {champion.scores.overall.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-slate-400 ml-1">/ 100</span>
                  </div>
                </div>

                {/* 4 Judging Dimensions Meters */}
                <div className="space-y-3.5 bg-palace-950/60 p-5 rounded-2xl border border-emerald-950">
                  <MetricBar
                    label="Hair Volume"
                    value={champion.scores.volume}
                    weight={0.30}
                    icon="🌿"
                    color="teal"
                  />
                  <MetricBar
                    label="Hair Spread"
                    value={champion.scores.spread}
                    weight={0.25}
                    icon="↔️"
                    color="cyan"
                  />
                  <MetricBar
                    label="Symmetry"
                    value={champion.scores.symmetry}
                    weight={0.25}
                    icon="⚖️"
                    color="emerald"
                  />
                  <MetricBar
                    label="Wind Style"
                    value={champion.scores.wind_style}
                    weight={0.20}
                    icon="💨"
                    color="amber"
                  />
                </div>

                {/* Jury Proclamation */}
                {champion.jury_comment && (
                  <div className="p-3.5 rounded-xl bg-palace-950/80 border border-slate-800 text-xs text-slate-300 italic">
                    &ldquo;{champion.jury_comment}&rdquo;
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* SPECIAL AWARDS SECTION (CATEGORY KINGS) */}
          <div className="space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>CATEGORY MONARCHS</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Special Category Honors
              </h3>
              <p className="text-xs text-slate-400">
                Determined by individual mathematical vectors. A coconut may claim multiple crowns.
              </p>
            </div>

            {/* 4 Category Kings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Symmetry King */}
              {symmetryKing && (
                <div className="glass-panel p-5 rounded-3xl border-emerald-500/40 space-y-3 hover:border-emerald-400 transition-all flex flex-col justify-between shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-black text-emerald-300 flex items-center gap-1.5">
                        <span>⚖️</span> SYMMETRY KING
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {symmetryKing.scores.symmetry.toFixed(1)}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                      <img
                        src={symmetryKing.image_url}
                        alt={symmetryKing.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-white truncate">{symmetryKing.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{symmetryKing.hairstyle_title || 'Arboreal Finalist'}</p>
                    </div>
                  </div>

                  <Link
                    href={`/results?id=${symmetryKing.id}`}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center justify-between pt-2 border-t border-emerald-950"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* 2. Volume King */}
              {volumeKing && (
                <div className="glass-panel p-5 rounded-3xl border-teal-500/40 space-y-3 hover:border-teal-400 transition-all flex flex-col justify-between shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-black text-teal-300 flex items-center gap-1.5">
                        <span>🌿</span> VOLUME KING
                      </span>
                      <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                        {volumeKing.scores.volume.toFixed(1)}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                      <img
                        src={volumeKing.image_url}
                        alt={volumeKing.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-white truncate">{volumeKing.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{volumeKing.hairstyle_title || 'Arboreal Finalist'}</p>
                    </div>
                  </div>

                  <Link
                    href={`/results?id=${volumeKing.id}`}
                    className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold flex items-center justify-between pt-2 border-t border-emerald-950"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* 3. Spread King */}
              {spreadKing && (
                <div className="glass-panel p-5 rounded-3xl border-cyan-500/40 space-y-3 hover:border-cyan-400 transition-all flex flex-col justify-between shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-black text-cyan-300 flex items-center gap-1.5">
                        <span>↔️</span> SPREAD KING
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        {spreadKing.scores.spread.toFixed(1)}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                      <img
                        src={spreadKing.image_url}
                        alt={spreadKing.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-white truncate">{spreadKing.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{spreadKing.hairstyle_title || 'Arboreal Finalist'}</p>
                    </div>
                  </div>

                  <Link
                    href={`/results?id=${spreadKing.id}`}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-between pt-2 border-t border-emerald-950"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* 4. Wind King */}
              {windKing && (
                <div className="glass-panel p-5 rounded-3xl border-amber-500/40 space-y-3 hover:border-amber-400 transition-all flex flex-col justify-between shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-black text-amber-300 flex items-center gap-1.5">
                        <span>💨</span> WIND KING
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                        {windKing.scores.wind_style.toFixed(1)}
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                      <img
                        src={windKing.image_url}
                        alt={windKing.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-white truncate">{windKing.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{windKing.hairstyle_title || 'Arboreal Finalist'}</p>
                    </div>
                  </div>

                  <Link
                    href={`/results?id=${windKing.id}`}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center justify-between pt-2 border-t border-emerald-950"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

            </div>
          </div>

          {/* ACTION BUTTONS (VIEW FULL LEADERBOARD & JUDGE MORE COCONUTS) */}
          <div className="glass-panel p-6 rounded-3xl border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                id="view-full-leaderboard-button"
                href="/leaderboard"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-slate-950 font-serif font-black text-xs transition-all shadow-xl glow-gold"
              >
                <Trophy className="w-4 h-4" />
                <span>VIEW FULL LEADERBOARD</span>
              </Link>

              <Link
                id="judge-more-coconuts-button"
                href="/judge"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-palace-900 hover:bg-palace-850 text-slate-100 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/50 font-serif font-bold text-xs transition-all"
              >
                <span>JUDGE MORE COCONUTS 🌴</span>
              </Link>
            </div>

            <Link
              id="view-winner-certificate-button"
              href={`/results?id=${champion.id}`}
              className="text-xs font-semibold text-gold-300 hover:text-gold-200 flex items-center gap-1 transition-colors"
            >
              <span>Examine Sovereign Certificate</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
