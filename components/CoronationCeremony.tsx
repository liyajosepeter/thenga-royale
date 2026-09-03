'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import { calculatePageantAwards, PageantAwardsResult } from '@/lib/awards';
import MetricBar from './MetricBar';
import AwardBadge from './AwardBadge';
import { 
  Crown, 
  Sparkles, 
  Trophy, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Shield, 
  ArrowUpRight, 
  Scale, 
  Wind, 
  Compass, 
  Layers, 
  MapPin,
  MessageSquare,
  Flame,
  Volume2,
  RefreshCw,
  Mail,
  PartyPopper,
  Quote,
  Check,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface CoronationCeremonyProps {
  contestants: Contestant[];
  onRestartJudging?: () => void;
}

// Sarcastic Acceptance Speeches
const ACCEPTANCE_SPEECHES = [
  "“I would like to thank the southwest monsoon, constant coastal humidity, and the soil nitrates for keeping my fronds runway-ready. To the other contestants: continue photosynthesizing, perhaps in your next lifecycle.”",
  "“I accept this crown not just for myself, but for every palm that has ever been subjected to aggressive coastal trade winds and still maintained majestic bilateral equilibrium.”",
  "“Many said a coconut tree could never achieve haute couture frond curvature. Today, OpenCV and pure computer vision proved the doubters wrong.”",
  "“I promise to use my sovereignty to rustle dramatically during golden hour sunsets and drop coconuts dangerously close to tourist deck chairs.”",
  "“My canopy spread is 100% natural. No artificial fertilizers, no genetic pampering—just pure, unapologetic arboreal elegance.”",
  "“To my fellow finalists: your fronds were adequate. But adequacy does not crown a monarch in the Coconut Kingdom.”",
  "“I dedicate this victory to gravity, which tried its best to pull down my branches for 15 years, and failed miserably.”",
  "“Photosynthesis is hard work, but looking this magnificent while doing it is an art form only a true monarch understands.”"
];

// Sarcastic Jury Conclave Observations for Phase 1
const CONCLAVE_TICKERS = [
  "Evaluating 4,820 contour points with zero human empathy...",
  "International Arboreal High Court has rejected all appeals from rival groves...",
  "Computer vision took 1.2ms; human judges debated for 4 hours about symmetry...",
  "Tragically, none of the contestants have thanked their root systems yet...",
  "Scanning canopy for illegal leaf-shine polish or unauthorized frond extensions...",
  "A nearby betel nut palm has filed a formal judicial protest..."
];

// Sarcastic Commentary Modes
type CommentaryPerspective = 'critic' | 'cv' | 'rival';

const COMMENTARY_MODES: Record<CommentaryPerspective, { name: string; icon: string; quote: (c: Contestant) => string }> = {
  critic: {
    name: 'High-Society Pageant Critic',
    icon: '🧐',
    quote: (c) => `“Darlings, look at that frond curvature! It screams Riviera, it whispers Kerala backwaters, it scoffs at municipal shrubbery. The effortless drape of the lower foliage is pure haute couture.”`
  },
  cv: {
    name: 'OpenCV Mathematical Kernel',
    icon: '🤖',
    quote: (c) => `“HSV mask segmentation confidence 99.8%. Bilateral centroid symmetry score: ${c.scores.symmetry.toFixed(1)}. Frond moment distribution indicates mathematical superiority over 100% of terrestrial flora.”`
  },
  rival: {
    name: 'Bitter 2nd-Place Palm',
    icon: '🌴',
    quote: (c) => `“It's completely rigged. They only won because the camera angle caught a favorable 12-knot south-easterly gust. Let's see who produces more actual coconuts when the drought hits.”`
  }
};

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

export default function CoronationCeremony({ contestants, onRestartJudging }: CoronationCeremonyProps) {
  const [phase, setPhase] = useState<'preamble' | 'suspense' | 'reveal'>('preamble');
  const [awardsResult, setAwardsResult] = useState<PageantAwardsResult | null>(null);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [activeCommentary, setActiveCommentary] = useState<CommentaryPerspective>('critic');
  const [applauseCount, setApplauseCount] = useState(1420);
  const [isCrowned, setIsCrowned] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [envelopeUnsealed, setEnvelopeUnsealed] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const emojiIdRef = useRef(0);

  // Compute awards
  useEffect(() => {
    if (contestants && contestants.length > 0) {
      const result = calculatePageantAwards(contestants);
      setAwardsResult(result);
    }
  }, [contestants]);

  // Rotate preamble ticker every 2.8s
  useEffect(() => {
    if (phase !== 'preamble') return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % CONCLAVE_TICKERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase Progression Timers (with manual override buttons available)
  useEffect(() => {
    if (!contestants || contestants.length === 0) return;

    // Auto-advance Preamble -> Suspense after 4.5s
    const t1 = setTimeout(() => {
      setPhase((curr) => (curr === 'preamble' ? 'suspense' : curr));
    }, 4500);

    return () => clearTimeout(t1);
  }, [contestants]);

  // When entering reveal phase, auto-crown after brief dramatic pause
  useEffect(() => {
    if (phase === 'reveal') {
      const t = setTimeout(() => {
        setIsCrowned(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Sovereign Golden Particle Canvas Effect
  useEffect(() => {
    if (phase !== 'reveal') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    const height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particleCount = 55;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedY: Math.random() * -0.7 - 0.2,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.75 + 0.25,
      hue: Math.random() > 0.35 ? 43 : 155 // Gold & Emerald hues
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.85)`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase]);

  // Trigger Royal Standing Ovation
  const handleTriggerOvation = () => {
    setApplauseCount((prev) => prev + Math.floor(Math.random() * 35 + 15));
    const emojis = ['👑', '🌴', '🥥', '👏', '✨', '🌿', '🥇', '🎉'];
    const newItems: FloatingEmoji[] = Array.from({ length: 12 }).map(() => ({
      id: ++emojiIdRef.current,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 80 + 10,
      y: 90,
      size: Math.random() * 1.5 + 1.2
    }));

    setFloatingEmojis((prev) => [...prev, ...newItems]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => !newItems.some((ni) => ni.id === item.id)));
    }, 2200);
  };

  // Unseal Envelope & Transition to Reveal
  const handleUnsealEnvelope = () => {
    setEnvelopeUnsealed(true);
    setTimeout(() => {
      setPhase('reveal');
    }, 800);
  };

  const handleRestart = () => {
    setPhase('preamble');
    setIsCrowned(false);
    setEnvelopeUnsealed(false);
    if (onRestartJudging) {
      onRestartJudging();
    }
  };

  if (!contestants || contestants.length === 0 || !awardsResult || !awardsResult.champion || !awardsResult.symmetryKing || !awardsResult.volumeKing || !awardsResult.spreadKing || !awardsResult.windKing) {
    return (
      <div className="glass-panel-gold p-12 rounded-3xl text-center space-y-6 max-w-xl mx-auto border-gold-400/50 shadow-2xl">
        <span className="text-4xl">👑</span>
        <h2 className="font-serif font-black text-2xl text-white">No Coronation Candidate Found</h2>
        <p className="text-xs text-sage-300 font-sans">
          Upload and evaluate coconut tree images in the Jury Chamber to initiate the coronation ceremony.
        </p>
        <Link
          href="/judge"
          className="btn-glass-gold inline-flex items-center gap-2 py-3 px-6 rounded-2xl text-xs uppercase"
        >
          <span>Go to Jury Chamber 🌴</span>
        </Link>
      </div>
    );
  }

  const champion = awardsResult.champion;
  const symmetryKing = awardsResult.symmetryKing;
  const volumeKing = awardsResult.volumeKing;
  const spreadKing = awardsResult.spreadKing;
  const windKing = awardsResult.windKing;

  return (
    <div className="space-y-12 max-w-5xl mx-auto relative overflow-hidden">
      
      {/* Floating Ovation Emojis Animation Layer */}
      {floatingEmojis.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none z-50 animate-float-up text-2xl sm:text-3xl transition-opacity"
          style={{
            left: `${item.x}vw`,
            bottom: '10vh',
            transform: `scale(${item.size})`
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* ======================================================== */}
      {/* PHASE 1: PREAMBLE / JURY CONCLAVE                        */}
      {/* ======================================================== */}
      {phase === 'preamble' && (
        <div className="glass-panel-elevated p-8 sm:p-14 rounded-3xl text-center space-y-8 max-w-3xl mx-auto border-emerald-500/40 shadow-2xl animate-fadeIn relative overflow-hidden">
          
          {/* Animated Ambient Crown Seal */}
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-950 border-2 border-gold-400/50 flex items-center justify-center text-4xl shadow-2xl animate-bounce-gentle">
              ⚖️
            </div>
            <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-xl -z-10 animate-pulse" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-950 border border-gold-400/40 text-gold-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>HIGH COMMISSION JURY CONCLAVE</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-white tracking-tight">
              THE JURY HAS REACHED A VERDICT.
            </h2>
            <p className="text-sm text-sage-300 italic font-sans">
              &ldquo;After extensive computational evaluation of absolutely no practical importance to humanity...&rdquo;
            </p>
          </div>

          {/* Sarcastic Observation Ticker Box */}
          <div className="p-4 rounded-2xl bg-forest-950/80 border border-emerald-500/30 max-w-lg mx-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <span>LIVE JURY TRANSCRIPT:</span>
              <button 
                onClick={() => setTickerIndex((prev) => (prev + 1) % CONCLAVE_TICKERS.length)}
                className="hover:text-gold-300 flex items-center gap-1 transition-colors"
                title="Next finding"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Cycle</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gold-200 font-serif italic min-h-[40px] flex items-center justify-center transition-all duration-300">
              {CONCLAVE_TICKERS[tickerIndex]}
            </p>
          </div>

          {/* Interactive Phase Triggers */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              id="proceed-to-envelope-btn"
              onClick={() => setPhase('suspense')}
              className="btn-glass-gold flex items-center gap-3 px-8 py-4 rounded-2xl text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:scale-105 active:scale-95"
            >
              <Mail className="w-4 h-4 text-forest-950" />
              <span>PROCEED TO GOLDEN ENVELOPE 📩</span>
            </button>

            <button
              onClick={() => {
                setEnvelopeUnsealed(true);
                setPhase('reveal');
              }}
              className="px-5 py-4 rounded-2xl bg-forest-950/80 hover:bg-forest-900 border border-emerald-500/30 text-sage-300 hover:text-white text-xs font-serif font-bold transition-all"
            >
              <span>⚡ Skip Suspense (I Have Zero Patience)</span>
            </button>
          </div>

          {/* Glowing Gradient Bar */}
          <div className="w-48 h-1 bg-gradient-to-r from-emerald-500 via-gold-400 to-emerald-500 mx-auto rounded-full animate-pulse" />
        </div>
      )}

      {/* ======================================================== */}
      {/* PHASE 2: SUSPENSE CURTAIN & INTERACTIVE ENVELOPE        */}
      {/* ======================================================== */}
      {phase === 'suspense' && (
        <div className="glass-panel-gold p-8 sm:p-14 rounded-3xl text-center space-y-8 max-w-2xl mx-auto border-2 border-gold-400/80 shadow-2xl animate-fadeIn relative">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-950 border border-gold-400/60 text-gold-300 text-xs font-mono font-bold tracking-widest uppercase">
              <span>👑</span>
              <span>CLASSIFIED SOVEREIGN DECREE</span>
              <span>👑</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-white gold-gradient-text tracking-wide">
              THE ARBOREAL CROWN GOES TO...
            </h2>
            <p className="text-xs sm:text-sm text-sage-200 font-sans italic">
              Break the High Commission wax seal to reveal the 2026 Sovereign Monarch.
            </p>
          </div>

          {/* Interactive Golden Envelope Graphic */}
          <div 
            onClick={handleUnsealEnvelope}
            className={`cursor-pointer group relative max-w-sm mx-auto p-8 rounded-3xl bg-gradient-to-b from-forest-900 via-forest-950 to-emerald-950 border-2 ${
              envelopeUnsealed ? 'border-gold-300 scale-105' : 'border-gold-400/80 hover:border-gold-300 hover:scale-105'
            } transition-all duration-300 shadow-2xl shadow-gold-500/20`}
          >
            <div className="space-y-4">
              {/* Wax Seal */}
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-amber-600 p-0.5 shadow-xl flex items-center justify-center animate-pulse">
                <div className="w-full h-full bg-forest-950 rounded-full flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">
                  👑
                </div>
              </div>

              <div>
                <div className="text-xs font-mono font-bold text-gold-300 tracking-widest uppercase">
                  HIGH COMMISSION WAX SEAL
                </div>
                <div className="text-base font-serif font-bold text-white pt-1">
                  Click to Break Seal & Unveil
                </div>
              </div>

              <div className="text-[11px] text-sage-400 font-mono tracking-wider">
                [ CONFIDENTIAL BOTANICAL DOSSIER #2026 ]
              </div>
            </div>

            {/* Glowing Corner Accents */}
            <div className="absolute top-2 left-2 text-gold-400/60 text-xs font-mono">✦</div>
            <div className="absolute top-2 right-2 text-gold-400/60 text-xs font-mono">✦</div>
            <div className="absolute bottom-2 left-2 text-gold-400/60 text-xs font-mono">✦</div>
            <div className="absolute bottom-2 right-2 text-gold-400/60 text-xs font-mono">✦</div>
          </div>

          {/* Reveal Button */}
          <div className="pt-2">
            <button
              id="unseal-monarch-btn"
              onClick={handleUnsealEnvelope}
              className="btn-glass-gold inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95"
            >
              <PartyPopper className="w-5 h-5 text-forest-950" />
              <span>UNSEAL & CROWN MONARCH 👑</span>
            </button>
          </div>

          <div className="w-64 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto rounded-full animate-pulse" />
        </div>
      )}

      {/* ======================================================== */}
      {/* PHASE 3: GRAND CORONATION REVEAL                        */}
      {/* ======================================================== */}
      {phase === 'reveal' && (
        <div className="space-y-12 animate-fadeIn relative">
          
          {/* Golden Particle Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10 w-full h-full"
          />

          {/* Coronation Master Card */}
          <div className="glass-panel-gold p-6 sm:p-12 rounded-3xl border-2 border-gold-400/90 shadow-2xl relative overflow-hidden glow-gold">
            
            {/* Header Sash */}
            <div className="text-center space-y-3 pb-8 border-b border-gold-400/30">
              <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-forest-950 border border-gold-400/70 text-gold-300 text-xs sm:text-sm font-serif font-bold shadow-lg">
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="tracking-widest uppercase">OFFICIAL PAGEANT WINNER • MONARCH OF 2026</span>
                <Crown className="w-4 h-4 text-gold-400" />
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-white group cursor-default">
                <span className="malayalam-hero-title gold-gradient-text block drop-shadow-2xl">
                  MR. തെങ്ങ് 2026
                </span>
              </h1>
              <p className="text-xs sm:text-base text-sage-200 font-sans italic">
                Crowned Supreme Arboreal Hairstyle Monarch of the Coconut Kingdom
              </p>
            </div>

            {/* Champion Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
              
              {/* Left Column: Photo with Interactive Bestowed Tiara */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative">
                  
                  {/* Floating Tiara */}
                  <div className={`absolute -top-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center ${
                    isCrowned ? 'animate-crown-float' : 'opacity-0 -translate-y-8'
                  } transition-all duration-700 ease-out`}>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 p-1 shadow-2xl">
                      <div className="w-full h-full bg-forest-950 rounded-2xl flex items-center justify-center text-3xl">
                        👑
                      </div>
                    </div>
                  </div>

                  {/* Photo Frame Container */}
                  <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-400/80 bg-forest-950 group">
                    <img
                      src={champion.image_url}
                      alt={champion.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%2304100b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2338b289'%3E🌴%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-transparent" />
                    
                    {/* Official Winner Sash */}
                    <div className="absolute bottom-3 left-3 right-3 text-center">
                      <span className="px-4 py-1.5 rounded-full pageant-sash font-malayalam text-[10px] sm:text-xs tracking-widest shadow-2xl inline-block hover:scale-105 transition-transform">
                        MR. തെങ്ങ് 2026 • OFFICIAL REIGNING MONARCH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Ovation Trigger */}
                <div className="pt-2">
                  <button
                    onClick={handleTriggerOvation}
                    className="w-full btn-glass-gold flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  >
                    <span>👏 TRIGGER ROYAL STANDING OVATION</span>
                    <span className="px-2 py-0.5 rounded-full bg-forest-950 text-gold-300 text-[10px] font-mono">
                      {applauseCount.toLocaleString()} Cheers
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Champion Details, Scores & Interactive Speech */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Title & Origin */}
                <div className="space-y-2">
                  <h2 className="font-serif font-black text-3xl sm:text-4xl text-white leading-tight">
                    {champion.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {champion.hairstyle_title && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold-500/20 border border-gold-400/50 text-xs font-serif font-bold text-gold-300 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>{champion.hairstyle_title}</span>
                      </div>
                    )}
                    {champion.origin && (
                      <div className="flex items-center gap-1.5 text-xs text-sage-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Grove: {champion.origin}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Composite Score Highlight Box */}
                <div className="p-4 rounded-2xl bg-forest-950/90 border border-gold-400/60 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sage-400">
                      OFFICIAL COMPOSITE PAGEANT SCORE
                    </span>
                    <div className="font-serif text-4xl sm:text-5xl font-black gold-gradient-text leading-none mt-1">
                      {champion.scores.overall.toFixed(2)}
                      <span className="text-sm font-mono text-sage-400 font-normal ml-1">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-14 h-14 rounded-2xl bg-forest-900 border border-gold-400/50 flex flex-col items-center justify-center shadow-inner">
                      <Crown className="w-4 h-4 text-gold-400" />
                      <span className="font-serif font-black text-sm text-gold-300">#1</span>
                    </div>
                  </div>
                </div>

                {/* 4 Dimension Breakdown */}
                <div className="space-y-2.5">
                  <MetricBar label="Hair Volume" value={champion.scores.volume} weight={0.30} icon="🌿" color="teal" />
                  <MetricBar label="Hair Spread" value={champion.scores.spread} weight={0.25} icon="↔️" color="cyan" />
                  <MetricBar label="Symmetry" value={champion.scores.symmetry} weight={0.25} icon="⚖️" color="emerald" />
                  <MetricBar label="Wind Style" value={champion.scores.wind_style} weight={0.20} icon="💨" color="amber" />
                </div>

                {/* ======================================================== */}
                {/* INTERACTIVE SARCASTIC MONARCH ACCEPTANCE SPEECH         */}
                {/* ======================================================== */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-gold-400/40 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gold-300 uppercase">
                      <Quote className="w-3.5 h-3.5 text-gold-400" />
                      <span>Monarch Acceptance Speech (Translated from Frond Rustling)</span>
                    </div>
                    <button
                      onClick={() => setSpeechIndex((prev) => (prev + 1) % ACCEPTANCE_SPEECHES.length)}
                      className="text-[11px] font-serif font-bold text-gold-400 hover:text-gold-200 flex items-center gap-1 transition-colors"
                      title="Rustle another speech"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Rustle Another 🔄</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-ivory-100 font-serif italic leading-relaxed">
                    {ACCEPTANCE_SPEECHES[speechIndex]}
                  </p>
                </div>

                {/* ======================================================== */}
                {/* INTERACTIVE SARCASTIC JURY COMMENTARY PERSPECTIVES      */}
                {/* ======================================================== */}
                <div className="p-4 rounded-2xl bg-forest-950/80 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sage-400 font-bold">
                      JURY DELIBERATION PERSPECTIVE:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(['critic', 'cv', 'rival'] as CommentaryPerspective[]).map((key) => (
                        <button
                          key={key}
                          onClick={() => setActiveCommentary(key)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-serif transition-all ${
                            activeCommentary === key
                              ? 'bg-gold-500/30 border border-gold-400 text-gold-200 font-bold'
                              : 'bg-forest-900 border border-emerald-500/20 text-sage-400 hover:text-white'
                          }`}
                        >
                          <span className="mr-1">{COMMENTARY_MODES[key].icon}</span>
                          <span>{COMMENTARY_MODES[key].name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-sage-300 italic border-l-2 border-emerald-400 pl-3 font-sans">
                    {COMMENTARY_MODES[activeCommentary].quote(champion)}
                  </p>
                </div>

                {/* Action CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/results?id=${champion.id}`}
                    className="btn-glass-gold flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95"
                  >
                    <span>VIEW OFFICIAL CERTIFICATE 📜</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/leaderboard"
                    className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 border border-emerald-500/30 text-xs font-serif font-bold transition-colors hover:border-gold-400/50"
                  >
                    <Trophy className="w-4 h-4 text-gold-400" />
                    <span>The Royal Rankings</span>
                  </Link>

                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-sage-400 hover:text-white border border-emerald-500/20 text-xs font-mono transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Replay Ceremony</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* SPECIAL CATEGORY KINGS SECTION                          */}
          {/* ======================================================== */}
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                DISTINGUISHED ARBOREAL HONORS
              </span>
              <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                Special Category Kings
              </h3>
              <p className="text-xs text-sage-300 font-sans">
                Highest scoring monarchs across individual mathematical criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 🌿 VOLUME KING */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 border-emerald-500/30 hover:border-emerald-400 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-125 transition-transform">🌿</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Highest Volume
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-gold-300">VOLUME KING</h4>
                  <div className="font-serif font-bold text-base text-white truncate">{volumeKing.name}</div>
                  <div className="font-mono text-xs text-emerald-300 font-bold mt-1">Score: {volumeKing.scores.volume.toFixed(1)}/100</div>
                </div>
                <p className="text-[11px] text-sage-300 italic font-sans border-t border-emerald-900/40 pt-2">
                  &ldquo;98% hair volume, 2% practical coconut yield.&rdquo;
                </p>
                <Link
                  href={`/results?id=${volumeKing.id}`}
                  className="block text-center py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-[11px] font-serif font-bold text-sage-200 border border-emerald-500/20"
                >
                  View Dossier &rarr;
                </Link>
              </div>

              {/* ↔️ SPREAD KING */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 border-mint-500/30 hover:border-mint-400 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-125 transition-transform">↔️</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-mint-300 border border-mint-500/30">
                    Highest Spread
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-mint-300">SPREAD KING</h4>
                  <div className="font-serif font-bold text-base text-white truncate">{spreadKing.name}</div>
                  <div className="font-mono text-xs text-mint-300 font-bold mt-1">Score: {spreadKing.scores.spread.toFixed(1)}/100</div>
                </div>
                <p className="text-[11px] text-sage-300 italic font-sans border-t border-emerald-900/40 pt-2">
                  &ldquo;Territorial aerial wingspan terrifying neighboring flora.&rdquo;
                </p>
                <Link
                  href={`/results?id=${spreadKing.id}`}
                  className="block text-center py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-[11px] font-serif font-bold text-sage-200 border border-emerald-500/20"
                >
                  View Dossier &rarr;
                </Link>
              </div>

              {/* ⚖️ SYMMETRY KING */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 border-gold-500/30 hover:border-gold-400 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-125 transition-transform">⚖️</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-gold-300 border border-gold-500/30">
                    Highest Symmetry
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-gold-300">SYMMETRY KING</h4>
                  <div className="font-serif font-bold text-base text-white truncate">{symmetryKing.name}</div>
                  <div className="font-mono text-xs text-gold-300 font-bold mt-1">Score: {symmetryKing.scores.symmetry.toFixed(1)}/100</div>
                </div>
                <p className="text-[11px] text-sage-300 italic font-sans border-t border-emerald-900/40 pt-2">
                  &ldquo;Mathematical narcissist aligned to the sub-millimeter.&rdquo;
                </p>
                <Link
                  href={`/results?id=${symmetryKing.id}`}
                  className="block text-center py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-[11px] font-serif font-bold text-sage-200 border border-emerald-500/20"
                >
                  View Dossier &rarr;
                </Link>
              </div>

              {/* 💨 WIND KING */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 border-amber-500/30 hover:border-amber-400 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-125 transition-transform">💨</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-amber-300 border border-amber-500/30">
                    Highest Wind Flow
                  </span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-amber-300">WIND KING</h4>
                  <div className="font-serif font-bold text-base text-white truncate">{windKing.name}</div>
                  <div className="font-mono text-xs text-amber-300 font-bold mt-1">Score: {windKing.scores.wind_style.toFixed(1)}/100</div>
                </div>
                <p className="text-[11px] text-sage-300 italic font-sans border-t border-emerald-900/40 pt-2">
                  &ldquo;Incapable of standing still without theatrical monologue flair.&rdquo;
                </p>
                <Link
                  href={`/results?id=${windKing.id}`}
                  className="block text-center py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-[11px] font-serif font-bold text-sage-200 border border-emerald-500/20"
                >
                  View Dossier &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
