'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Crown, Sparkles, Trophy, Upload, Menu, X, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'HOME', icon: Sparkles },
    { href: '/judge', label: 'JUDGE', icon: Upload },
    { href: '/awards', label: 'CORONATION 👑', icon: Crown },
    { href: '/leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { href: '/results', label: 'RESULTS', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 mb-4">
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel border-emerald-500/25 shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between h-20 px-4 sm:px-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600/30 to-gold-500/20 border border-emerald-400/40 group-hover:border-gold-400/70 transition-all duration-300 group-hover:scale-105 glow-emerald">
              <span className="text-2xl select-none group-hover:rotate-12 transition-transform duration-300">🌴</span>
              <span className="absolute -top-1.5 -right-1.5 text-xs animate-crown-float">👑</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-wider text-xl sm:text-2xl gold-gradient-text">
                  THENGA ROYALE
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-sage-300 font-sans tracking-wide">
                The 2026 Coconut Beauty Pageant
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-serif font-bold tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600/30 text-mint-100 border border-emerald-400/40 shadow-inner'
                      : 'text-ivory-200/80 hover:text-white hover:bg-emerald-900/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400' : 'text-emerald-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              id="nav-judge-button"
              href="/judge"
              className="btn-glass-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-200"
            >
              <span>JUDGE A COCONUT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-ivory-200 hover:text-white bg-emerald-950/60 border border-emerald-500/30 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6 text-mint-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-2xl glass-panel-elevated border-emerald-500/30 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-serif font-bold tracking-wider transition-colors ${
                  isActive
                    ? 'bg-emerald-600/30 text-gold-300 border border-gold-400/40'
                    : 'text-ivory-200 hover:bg-emerald-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-emerald-400'}`} />
                  <span>{link.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/judge"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-glass-gold flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs tracking-wider uppercase"
            >
              <span>JUDGE A COCONUT 🌴</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
