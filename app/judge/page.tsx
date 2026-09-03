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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>High Commission for Arboreal Splendor</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-white">
          The Scientific Jury Chamber
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Submit any number of coconut tree crowns to the official pageant algorithm. Each uploaded image is entered as an independent contestant.
        </p>
      </div>

      {/* Main Submission Interface */}
      <UploadDropzone />

      {/* Pageant Protocol Rules Footer */}
      <div className="glass-panel p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-400 border-emerald-950">
        <div className="space-y-1.5">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5 text-sm">
            <span>🌿</span>
            <span>Anonymous Submissions</span>
          </div>
          <p className="leading-relaxed">
            No accounts, logins, or user profiles. Upload 1, 10, or 20 palms in a single flight.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5 text-sm">
            <span>⚖️</span>
            <span>Python & OpenCV Calibrated</span>
          </div>
          <p className="leading-relaxed">
            Each palm undergoes color-space foliage segmentation, bounding envelope calculation, and symmetry moment evaluation.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5 text-sm">
            <span>👑</span>
            <span>Sovereign Global Comparison</span>
          </div>
          <p className="leading-relaxed">
            All submitted contestants immediately join the sovereign leaderboard competing for the 2026 title and special Category King honors.
          </p>
        </div>
      </div>

    </div>
  );
}
