import React from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, Upload, ShieldCheck, Zap, Compass, Wind, Layers, ArrowRight } from 'lucide-react';
import { MOCK_CONTESTANTS } from '@/lib/mockData';
import ContestantCard from '@/components/ContestantCard';
import AwardBadge from '@/components/AwardBadge';

export default function HomePage() {
  const reigningChampion = MOCK_CONTESTANTS[0];
  const topThree = MOCK_CONTESTANTS.slice(0, 3);

  return (
    <div className="space-y-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-6 pb-12 text-center space-y-8">
        {/* Glow ambient background behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        {/* Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-serif font-semibold glow-gold">
          <span>👑</span>
          <span>THE WORLD&apos;S PREMIER ARBOREAL BEAUTY PAGEANT</span>
          <span>👑</span>
        </div>

        {/* Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-7xl font-black tracking-tight leading-none">
            <span className="gold-gradient-text block">THENGA ROYALE</span>
            <span className="text-2xl sm:text-4xl text-slate-300 font-normal tracking-wide block mt-2 font-sans">
              MR. COCONUT 2026
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The definitive scientific inquiry into an urgent botanical mystery:
            <br />
            <strong className="text-emerald-400 font-serif italic">&ldquo;Which coconut tree possesses the most magnificent hairstyle?&rdquo;</strong>
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/judge"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-serif font-bold text-base transition-all duration-300 glow-emerald hover:scale-105 shadow-xl shadow-emerald-950/60"
          >
            <Upload className="w-5 h-5" />
            <span>Enter Coconut Contestant</span>
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-palace-900/80 hover:bg-palace-800 border border-emerald-500/30 text-slate-200 hover:text-white font-medium text-base transition-all duration-200 hover:border-emerald-500/60"
          >
            <Trophy className="w-5 h-5 text-gold-400" />
            <span>View Hall of Fame</span>
          </Link>
        </div>

        {/* Pageant Live Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="font-serif text-2xl sm:text-3xl font-black text-emerald-400">128+</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">Palms Assessed</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="font-serif text-2xl sm:text-3xl font-black text-gold-400">94.6</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">Peak Crown Score</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="font-serif text-2xl sm:text-3xl font-black text-teal-400">4</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">Hairstyle Dimensions</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="font-serif text-2xl sm:text-3xl font-black text-cyan-400">0.0%</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">Photosynthetic Bias</div>
          </div>
        </div>
      </section>

      {/* REIGNING MONARCH SHOWCASE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-emerald-950 pb-4">
          <div>
            <div className="flex items-center gap-2 text-gold-400 text-xs font-serif uppercase tracking-widest font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Current Reigning Monarch</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Mr. Coconut 2026 Titleholder
            </h2>
          </div>
          <Link
            href={`/results?id=${reigningChampion.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Read Sovereign Frond Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel-gold rounded-3xl p-6 sm:p-8">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gold-500/40">
            <img
              src={reigningChampion.image_url}
              alt={reigningChampion.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-full bg-gold-400 text-slate-950 font-serif font-black text-xs shadow-xl flex items-center gap-1.5">
                <span>👑</span> #1 REIGNING MR. COCONUT
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-palace-950/80 backdrop-blur-md p-3 rounded-xl border border-gold-500/30 text-xs text-slate-200">
              <span className="font-bold text-gold-400">{reigningChampion.name}</span> — {reigningChampion.origin}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap gap-2">
              {reigningChampion.awards?.map(award => (
                <AwardBadge key={award.id} award={award} size="md" />
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-extrabold gold-gradient-text">
                {reigningChampion.name}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                &ldquo;{reigningChampion.jury_comment}&rdquo;
              </p>
            </div>

            {/* Score Pill Display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-palace-900/80 p-3 rounded-xl border border-emerald-950 text-center">
                <div className="text-[10px] uppercase text-slate-400">Volume</div>
                <div className="font-mono text-base font-bold text-teal-300">{reigningChampion.scores.volume}</div>
              </div>
              <div className="bg-palace-900/80 p-3 rounded-xl border border-emerald-950 text-center">
                <div className="text-[10px] uppercase text-slate-400">Spread</div>
                <div className="font-mono text-base font-bold text-cyan-300">{reigningChampion.scores.spread}</div>
              </div>
              <div className="bg-palace-900/80 p-3 rounded-xl border border-emerald-950 text-center">
                <div className="text-[10px] uppercase text-slate-400">Symmetry</div>
                <div className="font-mono text-base font-bold text-emerald-300">{reigningChampion.scores.symmetry}</div>
              </div>
              <div className="bg-palace-900/80 p-3 rounded-xl border border-emerald-950 text-center">
                <div className="text-[10px] uppercase text-slate-400">Wind Style</div>
                <div className="font-mono text-base font-bold text-amber-300">{reigningChampion.scores.wind_style}</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase text-slate-400">Composite Score</span>
                <div className="font-serif text-3xl font-black text-gold-400">
                  {reigningChampion.scores.overall.toFixed(1)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                </div>
              </div>
              <Link
                href={`/results?id=${reigningChampion.id}`}
                className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-bold text-xs font-serif transition-transform hover:scale-105"
              >
                Inspect Geometry &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE 4 GOLDEN DIMENSIONS (THE SCIENCE) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest font-semibold">
            The Botanical Protocol
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            The Four Hairstyle Dimensions
          </h2>
          <p className="text-sm text-slate-400">
            Every palm crown undergoes rigorous computer vision analysis via OpenCV color segmentation and moment calculation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-teal-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-2xl">
              🌿
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-white">Hair Volume</h3>
              <span className="font-mono text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">30%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Measures chloroplast canopy density and frond coverage relative to the convex hull envelope.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Crown King: <strong>VOLUME KING</strong>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
              ↔️
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-white">Hair Spread</h3>
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">25%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quantifies horizontal canopy wingspan vs. vertical height. Evaluates territorial coastal swagger.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Crown King: <strong>SPREAD KING</strong>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-white">Symmetry</h3>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">25%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bilateral frond equilibrium across the vertical trunk axis. Detects Cartesian architectural balance.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Crown King: <strong>SYMMETRY KING</strong>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              💨
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-white">Wind Style</h3>
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">20%</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sobel gradient vector analysis measuring aerodynamic drama and monsoonal hairtoss intensity.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Crown King: <strong>WIND KING</strong>
            </div>
          </div>

        </div>
      </section>

      {/* TOP CONTESTANTS PODIUM PREVIEW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-950 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Podium Contenders
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              The highest-scoring coconut palm hairstyles currently registered in the royal archives.
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>All Contestants</span>
            <ArrowRight className="w-4 h-4" />
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
