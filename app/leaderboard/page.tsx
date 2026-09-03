'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contestant, AwardType } from '@/lib/types';
import ContestantCard from '@/components/ContestantCard';
import AwardBadge from '@/components/AwardBadge';
import MetricBar from '@/components/MetricBar';
import { fetchLeaderboardEntries, clearAllLocalContestants } from '@/lib/supabase';
import { Trophy, Crown, Sparkles, Filter, ArrowUpRight, Search, Plus, RefreshCw, Shield, Trash2, MapPin } from 'lucide-react';

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
        const cleanList = raw.filter(c => !c.id.match(/^contestant-[1-6]$/));
        setContestants(cleanList);
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

  const handleClearLeaderboard = async () => {
    if (typeof window !== 'undefined') {
      if (window.confirm('Clear all stored contestants and reset the championship archive?')) {
        await clearAllLocalContestants();
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
  const showPodium = topThree.length >= 3 && activeFilter === 'all' && !searchQuery;
  const displayRoster = showPodium ? filteredContestants.slice(3) : filteredContestants;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Top Banner with Prominent Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-gold-400/40 text-gold-300 text-xs font-mono">
            <Trophy className="w-3.5 h-3.5 text-gold-400" />
            <span>Sovereign Pageant Standings</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
            THE ROYAL RANKINGS
          </h1>
          <p className="text-xs sm:text-sm text-sage-300 italic font-sans">
            &ldquo;Only one can wear the crown.&rdquo;
          </p>
        </div>

        {/* Action Buttons */}
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
            className="btn-glass-primary flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Submit Coconuts 🌴</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <RefreshCw className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Loading Royal Standings...</h3>
        </div>
      ) : contestants.length === 0 ? (

        /* CLEAN EMPTY STATE */
        <div className="glass-panel-gold p-12 sm:p-16 rounded-3xl text-center space-y-6 max-w-xl mx-auto border-gold-400/50 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-forest-950 border border-gold-400/40 flex items-center justify-center text-4xl shadow-inner">
            🌴
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              NO CANDIDATES HAVE ENTERED THE PAGEANT YET.
            </h2>
            <p className="text-xs sm:text-sm text-sage-300 font-sans">
              The High Commission is awaiting its first candidate flight. Upload coconut palm photos in the Jury Chamber to start the competition.
            </p>
          </div>
          <Link
            href="/judge"
            className="btn-glass-gold inline-flex items-center gap-2 py-4 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all scale-105 shadow-xl"
          >
            <span>ENTER THE FIRST CANDIDATE 🌴</span>
          </Link>
        </div>

      ) : (

        <div className="space-y-12 animate-fadeIn">
          
          {/* CURRENT COCONUT CHAMPION HIGHLIGHT BANNER */}
          {champion && (
            <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border-gold-400/70 shadow-2xl relative overflow-hidden glow-gold">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Photo with Crown Badge */}
                <div className="md:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-400/60 bg-forest-950">
                  <img
                    src={champion.image_url}
                    alt={champion.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%2304100b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2338b289'%3E🌴%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-forest-950 font-serif font-black text-xs shadow-xl flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    <span>#1 CHAMPION</span>
                  </div>
                </div>

                {/* Champion Details */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-gold-300 bg-forest-950/80 px-2.5 py-1 rounded-full border border-gold-400/30">
                      <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                      <span>CURRENT COCONUT MONARCH 👑</span>
                    </div>
                    <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
                      {champion.name}
                    </h2>
                    {champion.hairstyle_title && (
                      <div className="text-xs font-serif font-bold text-gold-300 uppercase tracking-wide">
                        {champion.hairstyle_title}
                      </div>
                    )}
                    {champion.origin && (
                      <div className="flex items-center gap-1 text-xs text-sage-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{champion.origin}</span>
                      </div>
                    )}
                  </div>

                  {/* 4 Scores Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-forest-950/90 border border-emerald-500/30 text-center">
                      <span className="text-[10px] text-sage-400 font-mono block">🌿 VOLUME</span>
                      <strong className="text-sm font-mono text-emerald-300">{champion.scores.volume.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-forest-950/90 border border-emerald-500/30 text-center">
                      <span className="text-[10px] text-sage-400 font-mono block">↔️ SPREAD</span>
                      <strong className="text-sm font-mono text-mint-300">{champion.scores.spread.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-forest-950/90 border border-emerald-500/30 text-center">
                      <span className="text-[10px] text-sage-400 font-mono block">⚖️ SYMMETRY</span>
                      <strong className="text-sm font-mono text-gold-300">{champion.scores.symmetry.toFixed(1)}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-forest-950/90 border border-emerald-500/30 text-center">
                      <span className="text-[10px] text-sage-400 font-mono block">💨 WIND</span>
                      <strong className="text-sm font-mono text-amber-300">{champion.scores.wind_style.toFixed(1)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-sage-400">OVERALL PAGEANT SCORE</span>
                      <div className="font-serif text-3xl font-black gold-gradient-text">
                        {champion.scores.overall.toFixed(2)}
                        <span className="text-xs font-mono text-sage-400 font-normal ml-1">/ 100</span>
                      </div>
                    </div>

                    <Link
                      href={`/results?id=${champion.id}`}
                      className="btn-glass-gold flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg"
                    >
                      <span>VIEW OFFICIAL CERTIFICATE</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3-TIER GRAND PODIUM */}
          {showPodium && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
                  THE SOVEREIGN PODIUM
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-white">
                  Top 3 Highest Scoring Palms
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
                
                {/* 🥈 2ND PLACE (Left) */}
                <div className="order-2 md:order-1 glass-panel p-5 rounded-3xl space-y-4 border-slate-600 shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="text-center space-y-1">
                    <span className="px-3 py-1 rounded-full bg-slate-300 text-forest-950 font-serif font-black text-xs shadow-md">
                      🥈 2ND PLACE
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-950 border border-slate-600">
                    <img src={topThree[1].image_url} alt={topThree[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-serif font-bold text-lg text-white truncate">{topThree[1].name}</h4>
                    <span className="font-serif text-2xl font-black text-slate-300 block">{topThree[1].scores.overall.toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/results?id=${topThree[1].id}`}
                    className="block text-center py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-xs font-serif font-bold text-ivory-100 border border-emerald-500/30 transition-colors"
                  >
                    Examine Dossier &rarr;
                  </Link>
                </div>

                {/* 🥇 1ST PLACE (Center - Visually Dominant) */}
                <div className="order-1 md:order-2 glass-panel-gold p-6 rounded-3xl space-y-5 border-2 border-gold-400/80 shadow-2xl glow-gold scale-[1.04] md:-translate-y-4 relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-500 flex items-center justify-center text-2xl shadow-xl">
                      👑
                    </div>
                  </div>
                  <div className="text-center space-y-1 pt-2">
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-forest-950 font-serif font-malayalam font-black text-xs shadow-lg inline-block hover:scale-105 transition-transform cursor-default">
                      🥇 MR. തെങ്ങ് 2026
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-950 border-2 border-gold-400/60 shadow-inner">
                    <img src={topThree[0].image_url} alt={topThree[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-serif font-black text-xl text-white truncate">{topThree[0].name}</h4>
                    <span className="font-serif text-3xl font-black gold-gradient-text block">{topThree[0].scores.overall.toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/results?id=${topThree[0].id}`}
                    className="btn-glass-gold block text-center py-3 rounded-xl text-xs uppercase tracking-wider"
                  >
                    View Champion Certificate &rarr;
                  </Link>
                </div>

                {/* 🥉 3RD PLACE (Right) */}
                <div className="order-3 glass-panel p-5 rounded-3xl space-y-4 border-amber-700/60 shadow-xl hover:-translate-y-1 transition-transform">
                  <div className="text-center space-y-1">
                    <span className="px-3 py-1 rounded-full bg-amber-700 text-white font-serif font-black text-xs shadow-md">
                      🥉 3RD PLACE
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-950 border border-amber-700/60">
                    <img src={topThree[2].image_url} alt={topThree[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-serif font-bold text-lg text-white truncate">{topThree[2].name}</h4>
                    <span className="font-serif text-2xl font-black text-amber-300 block">{topThree[2].scores.overall.toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/results?id=${topThree[2].id}`}
                    className="block text-center py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-xs font-serif font-bold text-ivory-100 border border-emerald-500/30 transition-colors"
                  >
                    Examine Dossier &rarr;
                  </Link>
                </div>

              </div>
            </div>
          )}

          {/* SEARCH & FILTER TABS BAR */}
          <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border-emerald-900/40">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold tracking-wider transition-all ${
                  activeFilter === 'all'
                    ? 'bg-emerald-600/30 text-mint-100 border border-emerald-400/50 shadow-inner'
                    : 'text-sage-300 hover:text-white hover:bg-forest-900'
                }`}
              >
                ALL ({contestants.length})
              </button>

              <button
                onClick={() => setActiveFilter('mr_coconut_2026')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-malayalam font-bold tracking-wider transition-all ${
                  activeFilter === 'mr_coconut_2026'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-400/50 shadow-inner'
                    : 'text-sage-300 hover:text-white hover:bg-forest-900'
                }`}
              >
                👑 MR. തെങ്ങ്
              </button>

              <button
                onClick={() => setActiveFilter('volume')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold tracking-wider transition-all ${
                  activeFilter === 'volume'
                    ? 'bg-emerald-600/30 text-mint-100 border border-emerald-400/50'
                    : 'text-sage-300 hover:text-white hover:bg-forest-900'
                }`}
              >
                🌿 VOLUME KING
              </button>

              <button
                onClick={() => setActiveFilter('spread')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold tracking-wider transition-all ${
                  activeFilter === 'spread'
                    ? 'bg-mint-500/20 text-mint-200 border border-mint-400/50'
                    : 'text-sage-300 hover:text-white hover:bg-forest-900'
                }`}
              >
                ↔️ SPREAD KING
              </button>

              <button
                onClick={() => setActiveFilter('symmetry')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold tracking-wider transition-all ${
                  activeFilter === 'symmetry'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-400/50'
                    : 'text-sage-300 hover:text-white hover:bg-forest-900'
                }`}
              >
                ⚖️ SYMMETRY KING
              </button>

              <button
                onClick={() => setActiveFilter('wind')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold tracking-wider transition-all ${
                  activeFilter === 'wind'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50'
                    : 'text-sage-300 hover:text-white hover:bg-forest-900'
                }`}
              >
                💨 WIND KING
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-sage-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contestant..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-forest-950 border border-emerald-500/30 text-xs text-white placeholder-sage-500 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          </div>

          {/* COMPLETE CONTESTANT ROSTER GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sage-400">
                Displaying {filteredContestants.length} of {contestants.length} Candidate(s)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayRoster.map((contestant) => (
                <ContestantCard key={contestant.id} contestant={contestant} isLeaderboardView={true} />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
