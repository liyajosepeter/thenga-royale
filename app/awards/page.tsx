'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import { fetchLeaderboardEntries } from '@/lib/supabase';
import CoronationCeremony from '@/components/CoronationCeremony';
import { Crown, Sparkles, Trophy, ArrowLeft, RefreshCw, Upload } from 'lucide-react';

export default function AwardsPage() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContestants() {
      setIsLoading(true);
      try {
        const data = await fetchLeaderboardEntries();
        const clean = data.filter((c) => !c.id.match(/^contestant-[1-6]$/));
        setContestants(clean);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-gold-400/40 text-gold-300 text-xs font-mono">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span>Official Pageant Honours & Category Sovereignty</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white mt-1">
            Coronation & Pageant Awards 👑
          </h1>
          <p className="text-xs sm:text-sm text-sage-300 font-sans">
            Crowning Mr. തെങ്ങ് 2026 and conferring the 4 botanical category crowns.
          </p>
        </div>

        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-200 font-serif font-bold transition-colors"
        >
          <Trophy className="w-3.5 h-3.5 text-gold-400" />
          <span>The Royal Rankings &rarr;</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-md mx-auto">
          <RefreshCw className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Consulting High Commission Conclave...</h3>
        </div>
      ) : contestants.length === 0 ? (
        <div className="glass-panel-gold p-12 sm:p-16 rounded-3xl text-center space-y-6 max-w-xl mx-auto border-gold-400/50 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-forest-950 border border-gold-400/40 flex items-center justify-center text-4xl shadow-inner">
            👑
          </div>
          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
              No Candidates Registered For Coronation
            </h2>
            <p className="text-xs sm:text-sm text-sage-300 font-sans">
              Enter coconut palm photos in the Jury Chamber to calculate scores and reveal the 2026 crown winner.
            </p>
          </div>
          <Link
            href="/judge"
            className="btn-glass-gold inline-flex items-center gap-2 py-4 px-8 rounded-2xl text-xs uppercase tracking-wider transition-all scale-105 shadow-xl"
          >
            <Upload className="w-4 h-4" />
            <span>ENTER CANDIDATE PALMS 🌴</span>
          </Link>
        </div>
      ) : (
        <CoronationCeremony contestants={contestants} />
      )}

    </div>
  );
}
