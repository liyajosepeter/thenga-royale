'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import { fetchLeaderboardEntries } from '@/lib/supabase';
import CoronationCeremony from '@/components/CoronationCeremony';
import { Crown, Sparkles, Trophy, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AwardsPage() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContestants() {
      setIsLoading(true);
      try {
        const data = await fetchLeaderboardEntries();
        setContestants(data);
      } catch (err) {
        console.error('Error loading awards:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadContestants();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Official Pageant Honours & Category Sovereignty</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white mt-1">
            Coronation & Pageant Awards 👑
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Crowning Mr. Coconut 2026 and conferring the 4 botanical category crowns.
          </p>
        </div>

        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>View Standings Roster &rarr;</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <RefreshCw className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Consulting High Commission Conclave...</h3>
        </div>
      ) : contestants.length === 0 ? (
        <div className="glass-panel-gold p-12 sm:p-16 rounded-3xl text-center space-y-6 max-w-xl mx-auto border-gold-400/40 shadow-2xl animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-4xl">
            👑
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              NO COCONUTS HAVE ENTERED THE CHAMPIONSHIP YET.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              The Sovereign Throne is awaiting its first flight of contestants. Submit coconut tree crowns to start the coronation.
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
        <CoronationCeremony contestants={contestants} />
      )}

    </div>
  );
}
