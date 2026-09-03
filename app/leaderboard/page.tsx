'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contestant, AwardType } from '@/lib/types';
import ContestantCard from '@/components/ContestantCard';
import AwardBadge from '@/components/AwardBadge';
import MetricBar from '@/components/MetricBar';
import { fetchLeaderboardEntries, clearAllLocalContestants } from '@/lib/supabase';
import { Trophy, Crown, Sparkles, Filter, ArrowUpRight, Search, Plus, RefreshCw, Shield, Trash2 } from 'lucide-react';

export default function LeaderboardPage() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mr_coconut_2026' | 'volume' | 'spread' | 'symmetry' | 'wind'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load persistent user entries only (strip any old mock legacy IDs)
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const raw = await fetchLeaderboardEntries();
        // Filter out any legacy mock entries
        const cleanList = raw.filter(c => !c.id.match(/^contestant-[1-6]$/));
        setContestants(cleanList);
        // Clean localStorage if it had mock data
        if (typeof window !== 'undefined') {
          localStorage.setItem('thenga_contestants', JSON.stringify(cleanList));
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleClearLeaderboard = () => {
    if (typeof window !== 'undefined') {
      if (window.confirm('Clear all stored contestants and reset the championship archive?')) {
        clearAllLocalContestants();
        setContestants([]);
      }
    }
  };

  // Filter and sort logic
  const filteredContestants = contestants.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.origin && c.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.hairstyle_title && c.hairstyle_title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'mr_coconut_2026') return c.rank === 1 || c.awards?.some((a) => a.id === 'mr_coconut_2026');
    if (activeFilter === 'volume') return c.scores.volume >= 85 || c.awards?.some((a) => a.id === 'volume_king');
    if (activeFilter === 'spread') return c.scores.spread >= 85 || c.awards?.some((a) => a.id === 'spread_king');
    if (activeFilter === 'symmetry') return c.scores.symmetry >= 85 || c.awards?.some((a) => a.id === 'symmetry_king');
    if (activeFilter === 'wind') return c.scores.wind_style >= 85 || c.awards?.some((a) => a.id === 'wind_king');
    return true;
  });

  const champion = contestants.length > 0 ? contestants[0] : null;
  const topThree = contestants.slice(0, 3);
  const remainingEntries = filteredContestants.slice(topThree.length >= 3 && activeFilter === 'all' && !searchQuery ? 3 : 0);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Top Banner with Prominent Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono">
            <Trophy className="w-3.5 h-3.5 text-gold-400" />
            <span>Sovereign Global Standings • Operator Submissions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            Leaderboard & Hall of Fame
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Strictly displaying only contestants uploaded by your active flight submissions.
          </p>
        </div>

        {/* Prominent Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {contestants.length > 0 && (
            <button
              type="button"
              id="clear-archive-button"
              onClick={handleClearLeaderboard}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/70 text-red-300 hover:text-white border border-red-800/80 text-xs font-semibold transition-all shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Archive ({contestants.length})</span>
            </button>
          )}

          <Link
            href="/judge"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-serif font-black text-xs transition-all glow-emerald shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Coconuts 🌴</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <RefreshCw className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Loading Operator Roster...</h3>
        </div>
      ) : contestants.length === 0 ? (

        /* CLEAN EMPTY STATE */
        <div className="glass-panel-gold p-12 sm:p-16 rounded-3xl text-center space-y-6 max-w-xl mx-auto border-gold-400/40 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-4xl">
            🌴
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              NO COCONUTS HAVE ENTERED THE CHAMPIONSHIP YET.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              The Sovereign High Commission is awaiting its first contestant flight. Upload coconut tree crown images to start the pageant.
            </p>
          </div>
          <Link
            href="/judge"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-serif font-black text-sm transition-all duration-200 glow-emerald scale-105"
          >
            <span>ENTER THE FIRST COCONUT 🌴</span>
          </Link>
        </div>

      ) : (

        <div className="space-y-12 animate-fadeIn">
          
          {/* CURRENT COCONUT CHAMPION HIGHLIGHT BANNER */}
          {champion && (
            <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border-gold-400/60 shadow-2xl relative overflow-hidden glow-gold">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Photo with Crown Badge */}
                <div className="md:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-400/60 bg-slate-950">
                  <img
                    src={champion.image_url}
                    alt={champion.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 font-serif font-black text-xs shadow-xl flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>#1 CHAMPION</span>
                  </div>
                </div>

                {/* Champion Details */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold-400/20 text-gold-300 text-xs font-mono border border-gold-400/40">
                      <span>CURRENT COCONUT CHAMPION 👑</span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
                        {champion.name}
                      </h2>
                      {champion.hairstyle_title && (
                        <span className="text-xs font-serif font-bold text-gold-300 uppercase px-2.5 py-0.5 rounded bg-palace-950 border border-gold-500/30">
                          {champion.hairstyle_title}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{champion.origin || 'Coastal Grove'}</p>
                  </div>

                  {/* 4 Dimension Metrics Mini Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-palace-950/80 p-3 rounded-2xl border border-gold-500/30">
                    <div className="p-2 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">🌿 Volume</span>
                      <span className="font-serif font-bold text-sm text-teal-300">{champion.scores.volume.toFixed(1)}</span>
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">↔️ Spread</span>
                      <span className="font-serif font-bold text-sm text-cyan-300">{champion.scores.spread.toFixed(1)}</span>
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">⚖️ Symmetry</span>
                      <span className="font-serif font-bold text-sm text-emerald-300">{champion.scores.symmetry.toFixed(1)}</span>
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">💨 Wind</span>
                      <span className="font-serif font-bold text-sm text-amber-300">{champion.scores.wind_style.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Overall Pageant Score</span>
                      <span className="font-serif text-3xl font-black gold-gradient-text">
                        {champion.scores.overall.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ 100</span>
                      </span>
                    </div>

                    <Link
                      href={`/results?id=${champion.id}`}
                      className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-serif font-bold text-xs transition-colors shadow-lg"
                    >
                      <span>View Sovereign Certificate</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SOVEREIGN PODIUM (TOP 3) - Shown in 'all' filter mode */}
          {activeFilter === 'all' && !searchQuery && topThree.length >= 3 && (
            <div className="space-y-6 pt-4">
              <h3 className="text-center font-serif text-xs uppercase tracking-widest text-gold-400 font-bold">
                ✨ THE SOVEREIGN PODIUM ✨
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
                
                {/* 🥈 2nd Place: SECOND */}
                <div className="order-2 md:order-1 glass-panel p-5 rounded-3xl border-slate-400/40 space-y-3 text-center transform hover:-translate-y-1 transition-all shadow-xl">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-300 text-slate-950 font-serif font-black text-xs shadow-md">
                    <span>🥈</span> SECOND PLACE
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-950">
                    <img
                      src={topThree[1].image_url}
                      alt={topThree[1].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white truncate">{topThree[1].name}</h4>
                    {topThree[1].hairstyle_title && (
                      <span className="text-[10px] font-mono text-gold-300 block">{topThree[1].hairstyle_title}</span>
                    )}
                    <div className="font-serif text-2xl font-black text-emerald-400 mt-1">
                      {topThree[1].scores.overall.toFixed(2)} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </div>
                  </div>
                  <Link
                    href={`/results?id=${topThree[1].id}`}
                    className="inline-block text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
                  >
                    Examine Dossier &rarr;
                  </Link>
                </div>

                {/* 🥇 1st Place: FIRST */}
                <div className="order-1 md:order-2 glass-panel-gold p-6 rounded-3xl border-gold-400/70 space-y-4 text-center transform md:-translate-y-4 hover:-translate-y-5 transition-all glow-gold shadow-2xl">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 font-serif font-black text-xs shadow-xl">
                    <span>🥇</span> FIRST PLACE • MR. COCONUT
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-400/60 bg-slate-950">
                    <img
                      src={topThree[0].image_url}
                      alt={topThree[0].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-xl gold-gradient-text truncate">{topThree[0].name}</h4>
                    {topThree[0].hairstyle_title && (
                      <span className="text-xs font-mono text-gold-300 font-bold block">{topThree[0].hairstyle_title}</span>
                    )}
                    <div className="font-serif text-3xl font-black gold-gradient-text mt-1">
                      {topThree[0].scores.overall.toFixed(2)} <span className="text-sm text-slate-400 font-normal">pts</span>
                    </div>
                  </div>
                  <Link
                    href={`/results?id=${topThree[0].id}`}
                    className="inline-block py-2 px-6 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-bold text-xs font-serif shadow-lg"
                  >
                    Examine Sovereign Dossier &rarr;
                  </Link>
                </div>

                {/* 🥉 3rd Place: THIRD */}
                <div className="order-3 glass-panel p-5 rounded-3xl border-amber-700/50 space-y-3 text-center transform hover:-translate-y-1 transition-all shadow-xl">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-700 text-white font-serif font-black text-xs shadow-md">
                    <span>🥉</span> THIRD PLACE
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-950">
                    <img
                      src={topThree[2].image_url}
                      alt={topThree[2].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white truncate">{topThree[2].name}</h4>
                    {topThree[2].hairstyle_title && (
                      <span className="text-[10px] font-mono text-gold-300 block">{topThree[2].hairstyle_title}</span>
                    )}
                    <div className="font-serif text-2xl font-black text-emerald-400 mt-1">
                      {topThree[2].scores.overall.toFixed(2)} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </div>
                  </div>
                  <Link
                    href={`/results?id=${topThree[2].id}`}
                    className="inline-block text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
                  >
                    Examine Dossier &rarr;
                  </Link>
                </div>

              </div>
            </div>
          )}

          {/* CONTROLS BAR: Filter Tabs & Search */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border-emerald-950 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-palace-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  All Entries ({contestants.length})
                </button>

                <button
                  onClick={() => setActiveFilter('mr_coconut_2026')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeFilter === 'mr_coconut_2026'
                      ? 'bg-gold-400 text-slate-950 font-bold glow-gold'
                      : 'bg-palace-900 text-gold-300 hover:bg-slate-800 border border-gold-500/20'
                  }`}
                >
                  <span>👑</span> Mr. Coconut
                </button>

                <button
                  onClick={() => setActiveFilter('volume')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === 'volume'
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-palace-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  🌿 Volume Kings
                </button>

                <button
                  onClick={() => setActiveFilter('spread')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === 'spread'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-palace-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ↔️ Spread Kings
                </button>

                <button
                  onClick={() => setActiveFilter('symmetry')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === 'symmetry'
                      ? 'bg-emerald-400 text-slate-950 font-bold'
                      : 'bg-palace-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ⚖️ Symmetry Kings
                </button>

                <button
                  onClick={() => setActiveFilter('wind')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === 'wind'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-palace-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  💨 Wind Kings
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search palm or title..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-palace-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>
          </div>

          {/* ALL CONTESTANT CARDS GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-2">
              <h3 className="font-serif font-bold text-lg text-white">
                {activeFilter === 'all' && !searchQuery ? 'Full Pageant Roster' : `Filtered Results (${filteredContestants.length})`}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingEntries.map((contestant) => (
                <ContestantCard key={contestant.id} contestant={contestant} isLeaderboardView={true} />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
