'use client';

import React from 'react';
import Link from 'next/link';
import UploadDropzone from '@/components/UploadDropzone';
import { Shield, Sparkles, Trophy, Award, Layers } from 'lucide-react';

export default function JudgePage() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Shield className="w-3.5 h-3.5 text-gold-400" />
          <span>High Commission for Arboreal Splendor</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
          JURY DELIBERATION CHAMBER
        </h1>
        <p className="text-sm sm:text-base text-sage-300 max-w-2xl mx-auto font-sans italic">
          &ldquo;Submit your candidate to the Coconut Kingdom.&rdquo;
        </p>
      </div>

      {/* Main Submission Interface */}
      <UploadDropzone />

      {/* Pageant Protocol Rules Footer */}
      <div className="glass-panel p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-sage-300 border-emerald-900/30">
        <div className="space-y-1.5">
          <div className="font-serif font-bold text-ivory-100 flex items-center gap-1.5 text-sm">
            <span>🌿</span>
            <span>Anonymous Submissions</span>
          </div>
          <p className="leading-relaxed font-sans">
            No logins or paywalls. Upload 1, 5, 10, or 20 coconut trees in a single flight.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-serif font-bold text-ivory-100 flex items-center gap-1.5 text-sm">
            <span>⚖️</span>
            <span>Python & OpenCV Calibrated</span>
          </div>
          <p className="leading-relaxed font-sans">
            Each palm undergoes color-space foliage segmentation, convex hull extraction, and bilateral moment evaluation.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-serif font-bold text-ivory-100 flex items-center gap-1.5 text-sm">
            <span>👑</span>
            <span>Sovereign Global Comparison</span>
          </div>
          <p className="leading-relaxed font-sans">
            All submitted contestants immediately join the sovereign leaderboard competing for Mr. തെങ്ങ് 2026 and Category King honors.
          </p>
        </div>
      </div>

    </div>
  );
}
