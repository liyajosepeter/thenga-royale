'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Contestant } from '@/lib/types';
import { fetchLeaderboardEntries } from '@/lib/supabase';
import AwardBadge from '@/components/AwardBadge';
import MetricBar from '@/components/MetricBar';
import { 
  Crown, 
  Sparkles, 
  Trophy, 
  ArrowLeft, 
  Share2, 
  Check, 
  Download, 
  Printer, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  Award,
  Calendar,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';

function ResultsContent() {
  const searchParams = useSearchParams();
  const contestantId = searchParams.get('id') || '';

  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [showCVOverlay, setShowCVOverlay] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContestant() {
      setIsLoading(true);
      try {
        const fullRoster = await fetchLeaderboardEntries();
        if (fullRoster.length > 0) {
          const match = fullRoster.find(
            (c) => String(c.id) === String(contestantId) || c.name.toLowerCase() === contestantId.toLowerCase()
          ) || fullRoster[0];
          setContestant(match);
        }
      } catch (e) {
        console.warn('Error loading dossier:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadContestant();
  }, [contestantId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // High-Resolution Graphical Certificate Image Generator & Downloader
  const handleDownloadCertificateImage = async () => {
    if (!contestant || isGeneratingImage) return;

    setIsGeneratingImage(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 850;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      // 1. Background Gradient (Deep Botanical Forest Green)
      const bgGrad = ctx.createRadialGradient(width / 2, height / 3, 50, width / 2, height / 2, 700);
      bgGrad.addColorStop(0, '#0E3327');
      bgGrad.addColorStop(0.5, '#071812');
      bgGrad.addColorStop(1, '#04100B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Metallic Gold Border
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#D4AF37';
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#E6CA85';
      ctx.strokeRect(28, 28, width - 56, height - 56);

      // 3. Header Text
      ctx.fillStyle = '#E6CA85';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('👑 HIGH COMMISSION FOR ARBOREAL SPLENDOR • THENGA ROYALE 2026 👑', width / 2, 60);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.fillText('OFFICIAL ARBOREAL JUDGING CARD', width / 2, 105);

      ctx.fillStyle = '#38B289';
      ctx.font = '13px "Courier New", monospace';
      ctx.fillText('AUTHENTICATED VIA PYTHON & OPENCV COMPUTER VISION', width / 2, 130);

      // 4. Horizontal Separator
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 148);
      ctx.lineTo(width - 60, 148);
      ctx.stroke();

      // 5. Load and Draw Contestant Photo
      const photoWidth = 440;
      const photoHeight = 350;
      const photoX = 60;
      const photoY = 175;

      // Draw photo container background & border
      ctx.fillStyle = '#04100B';
      ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.strokeRect(photoX, photoY, photoWidth, photoHeight);

      // Load Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => {
          try {
            ctx.save();
            ctx.beginPath();
            ctx.rect(photoX, photoY, photoWidth, photoHeight);
            ctx.clip();
            ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
            ctx.restore();
          } catch (e) {
            console.warn('Error drawing image on canvas:', e);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = contestant.image_url;
      });

      // Overlay on photo: Rank Tag
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(photoX + 12, photoY + 12, 110, 26);
      ctx.fillStyle = '#04100B';
      ctx.font = 'bold 12px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(`RANK #${contestant.rank || 1}`, photoX + 67, photoY + 29);

      // 6. Right Side Details
      const infoX = 540;
      ctx.textAlign = 'left';

      // Hairstyle Title Badge
      if (contestant.hairstyle_title) {
        ctx.fillStyle = '#0A261D';
        ctx.fillRect(infoX, 175, 580, 28);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1;
        ctx.strokeRect(infoX, 175, 580, 28);

        ctx.fillStyle = '#E6CA85';
        ctx.font = 'bold 12px Georgia, serif';
        ctx.fillText(`✨ ${contestant.hairstyle_title.toUpperCase()} ✨`, infoX + 14, 194);
      }

      // Contestant Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Georgia, serif';
      ctx.fillText(contestant.name, infoX, 240);

      // Provenance
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '14px sans-serif';
      ctx.fillText(`📍 Grove Origin: ${contestant.origin || 'Coastal Grove, Kerala'}`, infoX, 265);

      // Composite Rating Pill
      ctx.fillStyle = '#071812';
      ctx.fillRect(infoX, 285, 260, 48);
      ctx.strokeStyle = '#D4AF37';
      ctx.strokeRect(infoX, 285, 260, 48);

      ctx.fillStyle = '#E6CA85';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('HAIRSTYLE SCORE:', infoX + 14, 305);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText(`${contestant.scores.overall.toFixed(2)} / 100`, infoX + 14, 326);

      // 7. 4 Dimensions Meter Bars
      const barsY = 355;
      const metrics = [
        { label: '🌿 Hair Volume (30%)', score: contestant.scores.volume },
        { label: '↔️ Hair Spread (25%)', score: contestant.scores.spread },
        { label: '⚖️ Symmetry (25%)', score: contestant.scores.symmetry },
        { label: '💨 Wind Style (20%)', score: contestant.scores.wind_style },
      ];

      metrics.forEach((m, idx) => {
        const rowY = barsY + (idx * 40);
        ctx.fillStyle = '#D1D5DB';
        ctx.font = '13px Georgia, serif';
        ctx.fillText(m.label, infoX, rowY + 14);

        ctx.fillStyle = '#E6CA85';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${m.score.toFixed(1)} / 100`, infoX + 580, rowY + 14);
        ctx.textAlign = 'left';

        // Track
        ctx.fillStyle = '#061C14';
        ctx.fillRect(infoX, rowY + 20, 580, 8);

        // Fill
        ctx.fillStyle = '#38B289';
        const fillW = Math.min((m.score / 100) * 580, 580);
        ctx.fillRect(infoX, rowY + 20, fillW, 8);
      });

      // 8. Jury Proclamation Box (Lower center)
      const commY = 560;
      ctx.fillStyle = '#061C14';
      ctx.fillRect(60, commY, width - 120, 85);
      ctx.strokeStyle = 'rgba(56, 178, 137, 0.3)';
      ctx.strokeRect(60, commY, width - 120, 85);

      ctx.fillStyle = '#E6CA85';
      ctx.font = 'bold 12px Georgia, serif';
      ctx.fillText('📜 OFFICIAL JURY VERDICT:', 80, commY + 26);

      ctx.fillStyle = '#E5E7EB';
      ctx.font = 'italic 13px Georgia, serif';
      const comment = contestant.jury_comment || `${contestant.name} demonstrates exceptional crown spread with remarkable wind discipline.`;
      ctx.fillText(`“${comment.length > 120 ? comment.substring(0, 117) + '...' : comment}”`, 80, commY + 54);

      // 9. Bottom Signatory Blocks & High Commission Gold Seal
      const signY = 675;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.beginPath();
      ctx.moveTo(60, signY);
      ctx.lineTo(width - 60, signY);
      ctx.stroke();

      // Left Signatory
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Georgia, serif';
      ctx.fillText('Dr. K. Frondington', 80, signY + 35);
      ctx.fillStyle = '#38B289';
      ctx.font = '11px monospace';
      ctx.fillText('Chief Canopy Adjudicator', 80, signY + 52);
      ctx.fillStyle = '#6B7280';
      ctx.fillText('Dept. of Arboreal Geometry', 80, signY + 68);

      // Center Gold Seal
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D4AF37';
      ctx.font = '28px serif';
      ctx.fillText('👑', width / 2, signY + 38);
      ctx.font = 'bold 10px monospace';
      ctx.fillText('OFFICIAL HIGH COMMISSION SEAL', width / 2, signY + 56);
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText('AUTHENTICATED VIA OPENCV 3.14', width / 2, signY + 70);

      // Right Signatory
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Georgia, serif';
      ctx.fillText('Prof. S. Chloroplast', width - 80, signY + 35);
      ctx.fillStyle = '#E6CA85';
      ctx.font = '11px monospace';
      ctx.fillText('High Sovereign Registrar', width - 80, signY + 52);
      ctx.fillStyle = '#6B7280';
      ctx.fillText('International Coconut Council', width - 80, signY + 68);

      // 10. Trigger Instant PNG Download
      const safeName = contestant.name.replace(/[^a-zA-Z0-9]/g, '_');
      const link = document.createElement('a');
      link.download = `Thenga_Royale_Judging_Card_${safeName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (err) {
      console.error('Error generating certificate image:', err);
      alert('Unable to generate certificate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-16 rounded-3xl text-center space-y-4 max-w-md mx-auto">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <h3 className="font-serif text-lg font-bold text-white">Retrieving Judging Card...</h3>
      </div>
    );
  }

  if (!contestant) {
    return (
      <div className="glass-panel-gold p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border-gold-400/40">
        <span className="text-4xl">🌴</span>
        <h2 className="font-serif font-bold text-2xl text-white">No Evaluated Dossier Found</h2>
        <p className="text-xs text-sage-300 font-sans">
          Upload and analyze coconut tree images in the Jury Chamber to generate an official certificate.
        </p>
        <Link
          href="/judge"
          className="btn-glass-primary inline-flex items-center gap-2 py-3 px-6 rounded-2xl text-xs uppercase"
        >
          <span>Go to Jury Chamber 🌴</span>
        </Link>
      </div>
    );
  }

  const isWinner = contestant.rank === 1;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb & Controls (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <Link
          href="/leaderboard"
          className="flex items-center gap-2 text-xs font-serif font-bold text-sage-300 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to The Royal Rankings</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* DOWNLOAD CERTIFICATE IMAGE BUTTON */}
          <button
            id="download-certificate-button"
            disabled={isGeneratingImage}
            onClick={handleDownloadCertificateImage}
            className="btn-glass-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingImage ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>GENERATING IMAGE...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CERTIFICATE (PNG) 📥</span>
              </>
            )}
          </button>

          {/* Quick Print Option */}
          <button
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-sage-300 border border-emerald-500/30 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Official Pageant Judging Card */}
      <div
        className={`printable-certificate rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 ${
          isWinner
            ? 'glass-panel-gold glow-gold border-gold-400/70 shadow-2xl'
            : 'glass-panel border-emerald-500/40 shadow-xl'
        }`}
      >
        {/* Certificate Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-900/40 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-gold-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Arboreal Judging Card</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                {contestant.name}
              </h1>
              {contestant.hairstyle_title && contestant.hairstyle_title !== 'THE ARBOREAL CONTENDER' && contestant.hairstyle_title !== 'THE COASTAL RUNWAY CONTENDER' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gold-500/20 border border-gold-400/40 text-xs font-serif font-bold text-gold-300 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>{contestant.hairstyle_title}</span>
                </span>
              )}
            </div>
            {contestant.origin && (
              <div className="flex items-center gap-1.5 text-xs text-sage-300 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Grove Origin: {contestant.origin}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase text-sage-400 font-mono tracking-wider">HAIRSTYLE SCORE</div>
              <div className="font-serif text-4xl font-black gold-gradient-text">
                {contestant.scores.overall.toFixed(2)}
                <span className="text-sm font-normal text-sage-400 ml-1 font-mono">/ 100</span>
              </div>
            </div>
            {contestant.rank && (
              <div
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-serif font-black shadow-xl ${
                  contestant.rank === 1
                    ? 'bg-gradient-to-br from-gold-400 to-amber-500 text-forest-950 glow-gold'
                    : 'bg-forest-950 border border-emerald-500/40 text-mint-300'
                }`}
              >
                <span className="text-[10px] uppercase font-sans">Rank</span>
                <span className="text-lg leading-tight">#{contestant.rank}</span>
              </div>
            )}
          </div>
        </div>

        {/* Awards Conferred Badges */}
        {contestant.awards && contestant.awards.length > 0 && (
          <div className="pt-6 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs text-sage-400 font-serif font-semibold">Conferred Pageant Honors:</span>
            {contestant.awards.map((award) => (
              <AwardBadge key={award.id} award={award} size="lg" />
            ))}
          </div>
        )}

        {/* Main Body: Image with CV scanner overlay & Score details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* Photo with CV Overlay */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30 bg-forest-950">
              <img
                src={contestant.image_url}
                alt={contestant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%2304100b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2338b289'%3E🌴%3C/text%3E%3C/svg%3E";
                }}
              />

              {/* Computer Vision Annotations Overlay */}
              {showCVOverlay && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute border-2 border-emerald-400/80 rounded-lg bg-emerald-500/10 shadow-[0_0_15px_rgba(56,178,137,0.3)]"
                    style={{
                      left: '12%',
                      top: '12%',
                      width: '76%',
                      height: '74%',
                    }}
                  >
                    <div className="absolute -top-3 left-2 px-1.5 py-0.5 rounded bg-forest-950 border border-emerald-400 text-[9px] font-mono text-emerald-300">
                      Canopy Convex Hull [OpenCV]
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-dashed border-l border-gold-400/70 shadow-[0_0_8px_rgba(212,175,55,0.6)]">
                    <div className="absolute -top-2 -left-6 px-1 py-0.5 rounded bg-forest-950 border border-gold-400 text-[8px] font-mono text-gold-300">
                      Center Axis
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-sage-400 px-1 font-mono">
              <span>Segmented Canopy Pixels: ~{contestant.frond_pixel_count?.toLocaleString() || '42,800'} px</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Python & OpenCV Calibrated</span>
              </span>
            </div>
          </div>

          {/* Metric Breakdown & Mathematical Formula */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="font-serif font-bold text-base text-white flex items-center justify-between">
                <span>The 4 Hairstyle Dimensions</span>
                <span className="text-xs font-mono text-sage-400 font-normal">Weight Calibrated</span>
              </h3>

              <div className="space-y-3.5">
                <MetricBar
                  label="Hair Volume"
                  value={contestant.scores.volume}
                  weight={0.30}
                  icon="🌿"
                  color="teal"
                />
                <MetricBar
                  label="Hair Spread"
                  value={contestant.scores.spread}
                  weight={0.25}
                  icon="↔️"
                  color="cyan"
                />
                <MetricBar
                  label="Symmetry"
                  value={contestant.scores.symmetry}
                  weight={0.25}
                  icon="emerald"
                />
                <MetricBar
                  label="Wind Style"
                  value={contestant.scores.wind_style}
                  weight={0.20}
                  icon="💨"
                  color="amber"
                />
              </div>
            </div>

            {/* Official Jury Verdict Commentary */}
            <div className="p-4 rounded-2xl bg-forest-950/90 border border-emerald-900/40 space-y-2 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gold-400 font-serif font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL JURY VERDICT</span>
              </div>
              <p className="text-xs sm:text-sm text-sage-200 leading-relaxed italic font-sans">
                &ldquo;{contestant.jury_comment || `${contestant.name} demonstrates exceptional crown spread with remarkable wind discipline.`}&rdquo;
              </p>
            </div>

            {/* Mathematical Certification Box */}
            <div className="p-3.5 rounded-xl bg-forest-950 border border-emerald-900/30 text-[11px] font-mono text-sage-400 space-y-1">
              <div className="text-emerald-300 font-bold">CALCULATION AUDIT:</div>
              <div>({contestant.scores.volume.toFixed(1)} × 0.30) + ({contestant.scores.spread.toFixed(1)} × 0.25) + ({contestant.scores.symmetry.toFixed(1)} × 0.25) + ({contestant.scores.wind_style.toFixed(1)} × 0.20)</div>
              <div className="text-white font-bold">= {contestant.scores.overall.toFixed(2)} Composite Pageant Score</div>
            </div>

          </div>

        </div>

        {/* Official Sovereign Certification Signatures Block */}
        <div className="mt-10 pt-6 border-t border-emerald-900/40 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs text-sage-300">
          <div className="space-y-1">
            <div className="font-serif font-bold text-white text-sm">Dr. K. Frondington</div>
            <div className="text-[10px] font-mono text-emerald-300 uppercase font-semibold">Chief Canopy Adjudicator</div>
            <div className="text-[10px] text-sage-500">Department of Arboreal Geometry</div>
          </div>

          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="w-12 h-12 rounded-full border-2 border-gold-400 flex items-center justify-center text-gold-300 text-lg font-serif font-black shadow-md">
              👑
            </div>
            <div className="text-[9px] font-mono tracking-widest text-gold-400 uppercase font-bold">
              THENGA ROYALE 2026
            </div>
            <div className="text-[9px] text-sage-500">Official High Commission Seal</div>
          </div>

          <div className="space-y-1 sm:text-right">
            <div className="font-serif font-bold text-white text-sm">Prof. S. Chloroplast</div>
            <div className="text-[10px] font-mono text-gold-400 uppercase font-semibold">High Sovereign Registrar</div>
            <div className="text-[10px] text-sage-500">International Coconut Council</div>
          </div>
        </div>

        {/* Action Buttons in Footer (Hidden on Print) */}
        <div className="no-print mt-8 pt-6 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/judge"
              className="btn-glass-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase shadow-md"
            >
              <span>Evaluate Another Palm 🌴</span>
            </Link>

            <button
              onClick={handleDownloadCertificateImage}
              disabled={isGeneratingImage}
              className="btn-glass-gold flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Image (PNG)</span>
            </button>
          </div>

          <Link
            href="/leaderboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 border border-emerald-500/30 text-xs font-serif font-bold transition-colors"
          >
            <Trophy className="w-4 h-4 text-gold-400" />
            <span>The Royal Rankings</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sage-400">Loading Judging Card...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
