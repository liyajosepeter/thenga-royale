'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Trophy, 
  Upload, 
  ArrowRight, 
  Layers, 
  Compass, 
  Wind, 
  Scale, 
  Maximize2, 
  Activity, 
  Cpu, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  BarChart3,
  Flame,
  Award
} from 'lucide-react';
import { MOCK_CONTESTANTS } from '@/lib/mockData';
import ContestantCard from '@/components/ContestantCard';
import AwardBadge from '@/components/AwardBadge';
import MetricBar from '@/components/MetricBar';

export default function HomePage() {
  const reigningChampion = MOCK_CONTESTANTS[0];
  const topThree = MOCK_CONTESTANTS.slice(0, 3);

  // Interactive Live Score Simulator State for the Hero Section
  const [simVolume, setSimVolume] = useState(94);
  const [simSpread, setSimSpread] = useState(88);
  const [simSymmetry, setSimSymmetry] = useState(96);
  const [simWind, setSimWind] = useState(90);

  const simOverall = Number((
    simVolume * 0.30 +
    simSpread * 0.25 +
    simSymmetry * 0.25 +
    simWind * 0.20
  ).toFixed(1));

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 text-center space-y-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-gold-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />

        {/* Pageant Official Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-serif font-semibold glow-gold animate-float">
          <span>👑</span>
          <span className="tracking-wider">THE SOVEREIGN ARBOREAL PAGEANT</span>
          <span>👑</span>
        </div>

        {/* Hero Headings */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-xs sm:text-sm font-mono tracking-widest text-emerald-400 uppercase font-semibold">
            HIGH COMMISSION FOR ARBOREAL SPLENDOR PRESENTS
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
            <span className="gold-gradient-text block drop-shadow-lg">MR. COCONUT 2026</span>
          </h1>
          <h2 className="text-xl sm:text-3xl lg:text-4xl text-slate-200 font-serif font-bold tracking-wide">
            WHO HAS THE BEST HAIRSTYLE IN THE COCONUT KINGDOM?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto italic font-sans">
            &ldquo;The world&apos;s most unnecessary coconut-tree evaluation protocol.&rdquo;
          </p>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            id="hero-judge-button"
            href="/judge"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-serif font-bold text-base transition-all duration-300 glow-emerald hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-950/60"
          >
            <span>JUDGE A COCONUT 🌴</span>
          </Link>

          <Link
            id="hero-leaderboard-button"
            href="/leaderboard"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-palace-900/90 hover:bg-palace-850 border border-emerald-500/40 text-slate-100 hover:text-gold-300 font-serif font-semibold text-base transition-all duration-200 hover:border-gold-400/60 hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>VIEW LEADERBOARD 🏆</span>
          </Link>
        </div>

        {/* Interactive Live Hairstyle Score Simulator Widget */}
        <div className="max-w-4xl mx-auto mt-12 glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/20 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-950 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                Interactive CV Calibration Preview
              </span>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                Live Coconut Hairstyle Score Simulator
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Computed Output:</span>
              <div className="px-3 py-1 rounded-xl bg-palace-950 border border-gold-500/40 font-serif text-lg font-black gold-gradient-text">
                {simOverall} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span>🌿</span> <span>Hair Volume</span>
                </span>
                <span className="font-mono font-bold text-teal-400">{simVolume}% (×0.30)</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simVolume}
                onChange={(e) => setSimVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <p className="text-[10px] text-slate-500">Chloroplast canopy thickness</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span>↔️</span> <span>Hair Spread</span>
                </span>
                <span className="font-mono font-bold text-cyan-400">{simSpread}% (×0.25)</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simSpread}
                onChange={(e) => setSimSpread(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[10px] text-slate-500">Canopy aspect ratio & span</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span>⚖️</span> <span>Symmetry</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{simSymmetry}% (×0.25)</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simSymmetry}
                onChange={(e) => setSimSymmetry(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <p className="text-[10px] text-slate-500">Bilateral trunk balance</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1.5">
                  <span>💨</span> <span>Wind Style</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{simWind}% (×0.20)</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simWind}
                onChange={(e) => setSimWind(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <p className="text-[10px] text-slate-500">Monsoonal hairtoss drama</p>
            </div>

          </div>

          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <span className="text-emerald-400 font-semibold font-mono">Formula Applied:</span>
            <code className="bg-palace-950 px-2 py-0.5 rounded border border-emerald-950 font-mono text-[11px] text-slate-300">
              ({simVolume}×0.30) + ({simSpread}×0.25) + ({simSymmetry}×0.25) + ({simWind}×0.20) = {simOverall}
            </code>
          </div>
        </div>
      </section>


      {/* 2. THE FOUR JUDGING CRITERIA */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span>THE QUAD-DIMENSIONAL SPECIFICATION</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            The Four Judging Criteria
          </h2>
          <p className="text-sm text-slate-400">
            Engineered with strict botanical impartiality. Every frond is analyzed using OpenCV HSV color space isolation and contour moment calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Hair Volume */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-teal-500/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🌿
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Weight</span>
                <span className="font-serif text-2xl font-black text-teal-400">30%</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-teal-300 transition-colors">
                HAIR VOLUME
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates total foliage surface area and leaf density against the crown&apos;s convex hull envelope.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Special Title:</span>
              <span className="text-teal-300 font-bold">VOLUME KING</span>
            </div>
          </div>

          {/* 2. Hair Spread */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-cyan-500/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                ↔️
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Weight</span>
                <span className="font-serif text-2xl font-black text-cyan-400">25%</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                HAIR SPREAD
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measures horizontal canopy wingspan relative to vertical trunk height. Quantifies territorial coastal presence.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Special Title:</span>
              <span className="text-cyan-300 font-bold">SPREAD KING</span>
            </div>
          </div>

          {/* 3. Symmetry */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Weight</span>
                <span className="font-serif text-2xl font-black text-emerald-400">25%</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-emerald-300 transition-colors">
                SYMMETRY
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compares bilateral frond equilibrium across the vertical centroid trunk axis using mathematical moments.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Special Title:</span>
              <span className="text-emerald-300 font-bold">SYMMETRY KING</span>
            </div>
          </div>

          {/* 4. Wind Style */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden group hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                💨
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Weight</span>
                <span className="font-serif text-2xl font-black text-amber-400">20%</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-300 transition-colors">
                WIND STYLE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates Sobel gradient variance to detect aerodynamic flow, dynamic curvature, and monsoonal hairtoss drama.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-950 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Special Title:</span>
              <span className="text-amber-300 font-bold">WIND KING</span>
            </div>
          </div>

        </div>
      </section>


      {/* 3. HOW IT WORKS SECTION */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono">
            <span>THE EVALUATION PIPELINE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            HOW IT WORKS
          </h2>
          <p className="text-sm text-slate-400">
            From raw palm photo to certified monarch of the arboreal runway.
          </p>
        </div>

        {/* 5-Step Process Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          
          {/* Step 1: Upload */}
          <div className="glass-panel p-5 rounded-2xl text-center space-y-3 relative group hover:border-emerald-500/50 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <div className="text-2xl">📷</div>
            <h3 className="font-serif font-bold text-base text-white">UPLOAD</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Drop any coconut tree crown image into the Jury Chamber. No signups or limits.
            </p>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold z-10">
              &rarr;
            </div>
          </div>

          {/* Step 2: Analyze */}
          <div className="glass-panel p-5 rounded-2xl text-center space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <div className="text-2xl">🔬</div>
            <h3 className="font-serif font-bold text-base text-white">ANALYZE</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Python & OpenCV segment fronds via HSV mask and calculate bilateral moments.
            </p>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold z-10">
              &rarr;
            </div>
          </div>

          {/* Step 3: Score */}
          <div className="glass-panel p-5 rounded-2xl text-center space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <div className="text-2xl">📊</div>
            <h3 className="font-serif font-bold text-base text-white">SCORE</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Computes the exact weighted composite score out of 100 with zero human bias.
            </p>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold z-10">
              &rarr;
            </div>
          </div>

          {/* Step 4: Rank */}
          <div className="glass-panel p-5 rounded-2xl text-center space-y-3 relative group hover:border-amber-500/50 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
              04
            </div>
            <div className="text-2xl">🏆</div>
            <h3 className="font-serif font-bold text-base text-white">RANK</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Enters the global leaderboard alongside coastal contestants worldwide.
            </p>
            <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold z-10">
              &rarr;
            </div>
          </div>

          {/* Step 5: Crown */}
          <div className="glass-panel-gold p-5 rounded-2xl text-center space-y-3 relative group hover:border-gold-400 glow-gold transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-gold-400 text-slate-950 flex items-center justify-center font-serif font-black text-sm">
              05
            </div>
            <div className="text-2xl">👑</div>
            <h3 className="font-serif font-bold text-base gold-gradient-text">CROWN</h3>
            <p className="text-[11px] text-slate-300 leading-normal">
              Bestows Mr. Coconut 2026 or Category King distinctions & official certificates.
            </p>
          </div>

        </div>
      </section>


      {/* 4. WHY DOES THIS EXIST? SECTION */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border-emerald-950 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
            <span>CRITICAL PHILOSOPHICAL INQUIRY</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black text-white">
            WHY DOES THIS EXIST?
          </h2>

          <div className="py-4">
            <div className="font-serif text-4xl sm:text-6xl font-black gold-gradient-text tracking-tight italic">
              &ldquo;It doesn&apos;t.&rdquo;
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            <p>
              For centuries, humanity has obsessed over barbers, stylists, runway pageants, and hair care products. Yet our planet&apos;s most magnificent coastal citizens — <em>Cocos nucifera</em> — have endured tropical tradewinds, monsoons, and relentless gravity without a single official arboreal styling title.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 italic">
              Thenga Royale rights this botanical injustice through rigorous, over-engineered computer vision mathematics.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/judge"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-serif font-bold text-xs transition-transform hover:scale-105"
            >
              Participate in the Absurdity &rarr;
            </Link>
          </div>

        </div>
      </section>


      {/* 5. TOP CONTESTANTS PREVIEW SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-950 pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-serif uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Current Sovereign Monarchs</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Top Ranked Arboreal Hairstyle Titleholders
            </h2>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View Complete Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((contestant) => (
            <ContestantCard key={contestant.id} contestant={contestant} />
          ))}
        </div>
      </section>

    </div>
  );
}
