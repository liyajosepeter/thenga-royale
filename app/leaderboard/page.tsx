'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_CONTESTANTS } from '@/lib/mockData';
import { Contestant, AwardType } from '@/lib/types';
import ContestantCard from '@/components/ContestantCard';
import AwardBadge from '@/components/AwardBadge';
import { Trophy, Crown, Sparkles, Filter, ArrowUpRight, Search } from 'lucide-react';

export default function LeaderboardPage() {
  const [contestants, setContestants] = useState<Contestant[]>(MOCK_CONTESTANTS);
  const [activeFilter, setActiveFilter] = useState<'all' | AwardType | 'volume' | 'spread' | 'symmetry' | 'wind_style'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load any newly evaluated contestants from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('thenga_contestants');
      if (stored) {
        const localList: Contestant[] = JSON.parse(stored);
        // Combine unique by id
        const map = new Map<string, Contestant>();
        [...localList, ...MOCK_CONTESTANTS].forEach(c => {
          if (!map.has(c.id)) map.set(c.id, c);
        });
        const combined = Array.from(map.values());
        // Sort descending
        combined.sort((a, b) => b.scores.overall - a.scores.overall);
        // Re-assign ranks
        combined.forEach((c, idx) => {
          c.rank = idx + 1;
        });
        setContestants(combined);
      }
    } catch (e) {
      // LocalStorage fallback
    }
  }, []);

  // Filter and sort logic
  const filteredContestants = contestants.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.origin && c.origin.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'mr_coconut_2026') return c.rank === 1 || c.awards?.some(a => a.id === 'mr_coconut_2026');
    if (activeFilter === 'volume_king' || activeFilter === 'volume') return c.awards?.some(a => a.id === 'volume_king') || c.scores.volume >= 85;
    if (activeFilter === 'spread_king' || activeFilter === 'spread') return c.awards?.some(a => a.id === 'spread_king') || c.scores.spread >= 85;
    if (activeFilter === 'symmetry_king' || activeFilter === 'symmetry') return c.awards?.some(a => a.id === 'symmetry_king') || c.scores.symmetry >= 85;
    if (activeFilter === 'wind_king' || activeFilter === 'wind_style') return c.awards?.some(a => a.id === 'wind_king') || c.scores.wind_style >= 85;
    return true;
  });

  const topThree = contestants.slice(0, 3);

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono">
          <Trophy className="w-3.5 h-3.5 text-gold-400" />
          <span>The Official Sovereign Standings</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
          Leaderboard & Hall of Fame
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Rankings calibrated strictly according to the 4-dimensional Thenga Royale formula. Special King awards are granted to category masters.
        </p>
      </div>

      {/* Royal Podium (Top 3) */}
      {topThree.length >= 3 && (
        <div className="pt-6 pb-2">
          <h2 className="text-center font-serif text-xs uppercase tracking-widest text-gold-400 font-semibold mb-6">
            ✨ The Sovereign Pageant Podium ✨
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-5xl mx-auto">
            
            {/* 2nd Place */}
            <div className="order-2 md:order-1 glass-panel p-5 rounded-2xl border-slate-400/30 space-y-3 text-center transform hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-300 text-slate-950 font-serif font-black flex items-center justify-center text-sm shadow-md">
                #2
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-700">
                <img src={topThree[1].image_url} alt={topThree[1].name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white truncate">{topThree[1].name}</h3>
                <div className="font-serif text-xl font-black text-emerald-400 mt-0.5">
                  {topThree[1].scores.overall.toFixed(1)} <span className="text-xs text-slate-400 font-normal">pts</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {topThree[1].awards?.map(a => <AwardBadge key={a.id} award={a} size="sm" />)}
              </div>
              <Link
                href={`/results?id=${topThree[1].id}`}
                className="block text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
              >
                Inspect Dossier &rarr;
              </Link>
            </div>

            {/* 1st Place (Winner, elevated) */}
            <div className="order-1 md:order-2 glass-panel-gold p-6 rounded-3xl border-gold-400/60 space-y-4 text-center transform md:-translate-y-4 hover:-translate-y-5 transition-all glow-gold">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 text-slate-950 font-serif font-black text-xs shadow-xl">
                <span>👑</span> #1 REIGNING MR. COCONUT
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-gold-400/50">
                <img src={topThree[0].image_url} alt={topThree[0].name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl gold-gradient-text truncate">{topThree[0].name}</h3>
                <p className="text-xs text-slate-300">{topThree[0].origin}</p>
                <div className="font-serif text-3xl font-black gold-gradient-text mt-1">
                  {topThree[0].scores.overall.toFixed(1)} <span className="text-sm text-slate-400 font-normal">pts</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {topThree[0].awards?.map(a => <AwardBadge key={a.id} award={a} size="md" />)}
              </div>
              <Link
                href={`/results?id=${topThree[0].id}`}
                className="inline-block py-2 px-6 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 font-bold text-xs font-serif shadow-lg"
              >
                View Sovereign Certificate &rarr;
              </Link>
            </div>

            {/* 3rd Place */}
            <div className="order-3 glass-panel p-5 rounded-2xl border-amber-700/40 space-y-3 text-center transform hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-700 text-white font-serif font-black flex items-center justify-center text-sm shadow-md">
                #3
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-700">
                <img src={topThree[2].image_url} alt={topThree[2].name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white truncate">{topThree[2].name}</h3>
                <div className="font-serif text-xl font-black text-emerald-400 mt-0.5">
                  {topThree[2].scores.overall.toFixed(1)} <span className="text-xs text-slate-400 font-normal">pts</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {topThree[2].awards?.map(a => <AwardBadge key={a.id} award={a} size="sm" />)}
              </div>
              <Link
                href={`/results?id=${topThree[2].id}`}
                className="block text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
              >
                Inspect Dossier &rarr;
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Category Filter:</span>
            </span>

            {[
              { id: 'all', label: 'All Contestants', icon: '🌴' },
              { id: 'mr_coconut_2026', label: '👑 Mr. Coconut', icon: '' },
              { id: 'volume_king', label: '🌿 Volume King', icon: '' },
              { id: 'spread_king', label: '↔️ Spread King', icon: '' },
              { id: 'symmetry_king', label: '⚖️ Symmetry King', icon: '' },
              { id: 'wind_king', label: '💨 Wind King', icon: '' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-palace-900/80 text-slate-300 hover:bg-palace-800 hover:text-white border border-emerald-950'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search palm or origin..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-palace-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* Contestants Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong>{filteredContestants.length}</strong> evaluated coconut palms</span>
          <span className="font-mono">Formula: V(30%) + Sp(25%) + Sym(25%) + W(20%)</span>
        </div>

        {filteredContestants.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
            <span className="text-4xl">🥥</span>
            <h3 className="font-serif font-bold text-lg text-slate-200">No palms match current filter</h3>
            <p className="text-xs text-slate-400">Try selecting &ldquo;All Contestants&rdquo; or clearing your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContestants.map((contestant) => (
              <ContestantCard key={contestant.id} contestant={contestant} isLeaderboardView />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
