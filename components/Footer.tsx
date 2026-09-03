import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-950 bg-palace-950/90 text-slate-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌴</span>
              <span className="font-serif font-bold text-xl gold-gradient-text tracking-wide">
                THENGA ROYALE 2026
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The premier arboreal beauty pageant dedicated to scientifically answering: <em>&ldquo;Which coconut tree has the most magnificent hairstyle?&rdquo;</em> Powered by Python and OpenCV.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                Python 3.13
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                OpenCV Headless
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-gold-400">
                Vercel Serverless
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              The 4 Dimensions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span>🌿</span> <span>Hair Volume (30%)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>↔️</span> <span>Hair Spread (25%)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⚖️</span> <span>Symmetry (25%)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>💨</span> <span>Wind Style (20%)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Pageant Chambers
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Grand Hall</Link>
              </li>
              <li>
                <Link href="/judge" className="hover:text-emerald-400 transition-colors">Jury & Appraisal Chamber</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">Hall of Fame Leaderboard</Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-emerald-400 transition-colors">Contestant Dossier</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-950/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Thenga Royale High Commission for Arboreal Splendor. All fronds reserved.</p>
          <p className="italic text-slate-400">
            No coconuts were harmed during the computer vision contour extraction.
          </p>
        </div>
      </div>
    </footer>
  );
}
