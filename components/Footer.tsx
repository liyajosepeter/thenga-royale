import React from 'react';
import Link from 'next/link';
import { Crown, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/40 bg-forest-950/90 text-sage-300 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-serif text-sm font-bold text-ivory-100 uppercase tracking-wider mb-3">
              The 4 Judging Criteria
            </h4>
            <ul className="space-y-2 text-xs text-sage-300/80 font-sans">
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
            <h4 className="font-serif text-sm font-bold text-ivory-100 uppercase tracking-wider mb-3">
              Pageant Chambers
            </h4>
            <ul className="space-y-2 text-xs text-sage-300/80 font-sans">
              <li>
                <Link href="/" className="hover:text-gold-300 transition-colors">Grand Hall</Link>
              </li>
              <li>
                <Link href="/judge" className="hover:text-gold-300 transition-colors">Jury Deliberation Chamber</Link>
              </li>
              <li>
                <Link href="/awards" className="hover:text-gold-300 transition-colors">Coronation Gala 👑</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-gold-300 transition-colors">The Royal Rankings</Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-gold-300 transition-colors">Official Dossier</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-900/30 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-400 gap-4 font-sans">
          <p>© 2026 Thenga Royale High Commission for Arboreal Splendor. All fronds reserved.</p>
          <p className="italic text-sage-400/80">
            No coconuts were harmed during contour segmentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
