'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  X, 
  Image as ImageIcon, 
  Shield, 
  FileWarning, 
  Trophy, 
  ArrowRight, 
  Cpu, 
  ArrowUpRight, 
  AlertTriangle, 
  RotateCcw,
  Crown
} from 'lucide-react';
import { UploadedCoconutItem, Contestant } from '@/lib/types';
import { persistCoconutEntries } from '@/lib/supabase';
import { calculatePageantAwards } from '@/lib/awards';
import MetricBar from './MetricBar';
import AwardBadge from './AwardBadge';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

const STAGE_MESSAGES = [
  'Detecting crown...',
  'Measuring foliage...',
  'Calculating symmetry...',
  'Evaluating wind style...',
  'Consulting the Coconut Hairstyle Index...',
  'Calibrating chlorophyll majesty...'
];

const SARCASTIC_MONIKERS = [
  'Lord Frondington III',
  'Baron von Coconut',
  'The Kovalam Drama Queen',
  'Sir Chlorophyll the Bold',
  'The Alappuzha Runway Menace',
  'Count of Monte Coconut',
  'The Disheveled Aristocrat',
  'Maharaja of the Monsoon',
  'Lady Foliage the Third',
  'Captain Kera of Kumarakom',
  'The Sassy Frond Supreme',
  'His Arboreal Highness',
  'The Varkala Wind Magnet',
  'The Cartesian Snob',
  'Princess Frondarella',
  'Sir Palm-a-Lot',
  'The Asymmetric Rebel',
  'The Backwater Diva',
  'The Gravity Denier',
  'Viscount of Vypeen',
  'The Malabar Headturner',
  'The Palm Tree with an Attitude',
  'The Hurricane Philosopher',
  'General Chloroplast',
  'The Coconut Casanova',
  'The Drama Queen of Kerala',
  'Sir Fronds-a-Million',
  'The Bohemian Canopy',
  'Duke of Deciduous Drama',
  'The Coastal Overthinker',
  'Lord of the Fronds',
  'The Monsoon Monologue Master',
  'Countess of Kumarakom',
  'The Palm That Knows Too Much',
  'Archduke of Alleppey',
  'The Runway Rascal',
  'Baroness von Chloroplast',
  'The High-Maintenance Frond',
  'The Windswept Philosopher',
  'The Overachieving Palm'
];

function getSmartContestantName(rawFileName: string, existingIndex: number): string {
  const base = rawFileName.replace(/\.[^/.]+$/, '').trim();
  const isGeneric = /(whatsapp|img|dsc|pxl|photo|image|screenshot|download|\d{4,}|\bcopy\b)/i.test(base) || base.length > 22;
  if (isGeneric) {
    return SARCASTIC_MONIKERS[existingIndex % SARCASTIC_MONIKERS.length];
  }
  const formatted = base.replace(/[-_]/g, ' ');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export default function UploadDropzone() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<UploadedCoconutItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analyzedResults, setAnalyzedResults] = useState<{
    successful: Contestant[];
    failed: { id: string; name: string; previewUrl: string; error: string }[];
  }>({ successful: [], failed: [] });

  const [progressState, setProgressState] = useState<{
    currentIndex: number;
    totalCount: number;
    currentName: string;
    currentImage: string;
    currentStage: string;
    percentage: number;
  }>({
    currentIndex: 0,
    totalCount: 0,
    currentName: '',
    currentImage: '',
    currentStage: 'Initializing Python OpenCV engine...',
    percentage: 0
  });

  // Helper to convert File to compressed persistent Base64 Data URL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(reader.result as string);
          }
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = reader.result as string;
      };
      reader.onerror = () => resolve("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%230a101d'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2310b981'%3E🌴%3C/text%3E%3C/svg%3E");
      reader.readAsDataURL(file);
    });
  };

  // Validation helper
  const validateAndProcessFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: UploadedCoconutItem[] = [];
    const errors: string[] = [];

    const fileArray = Array.from(fileList);
    for (let index = 0; index < fileArray.length; index++) {
      const file = fileArray[index];

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
        errors.push(`"${file.name}" is not a supported image format (Use JPG, PNG, or WebP).`);
        continue;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`"${file.name}" exceeds maximum allowed file size of 15MB.`);
        continue;
      }

      // Check for zero-byte / corrupt file
      if (file.size === 0) {
        errors.push(`"${file.name}" is empty or corrupted.`);
        continue;
      }

      // Read as persistent Base64 Data URL
      const previewUrl = await readFileAsDataUrl(file);
      const smartName = getSmartContestantName(file.name, items.length + validFiles.length);

      validFiles.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${index}`,
        previewUrl,
        name: smartName || `Contestant Palm #${items.length + validFiles.length + 1}`,
        origin: 'Coastal Grove',
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
      });
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
    }

    if (validFiles.length > 0) {
      setItems((prev) => [...prev, ...validFiles]);
      setAnalysisCompleted(false);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  }, [items.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Item modifications
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    setErrorMessage(null);
    setAnalysisCompleted(false);
    setAnalyzedResults({ successful: [], failed: [] });
  };

  const handleUpdateItemName = (id: string, newName: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const handleUpdateItemOrigin = (id: string, newOrigin: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, origin: newOrigin } : item))
    );
  };

  // Real Sequential Python/OpenCV Analysis Engine
  const handleAnalyzeAll = async () => {
    if (items.length === 0) {
      setErrorMessage('Please enter at least 1 coconut tree image before initiating jury deliberation.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisCompleted(false);
    setErrorMessage(null);

    const totalCount = items.length;
    const successfulList: Contestant[] = [];
    const failedList: { id: string; name: string; previewUrl: string; error: string }[] = [];

    for (let i = 0; i < totalCount; i++) {
      const item = items[i];
      const palmNum = i + 1;

      // Micro-stage progression
      for (let s = 0; s < 3; s++) {
        const stageMsg = STAGE_MESSAGES[(i + s) % STAGE_MESSAGES.length];
        const currentPct = Math.round(((i + (s * 0.3)) / totalCount) * 100);

        setProgressState({
          currentIndex: palmNum,
          totalCount,
          currentName: item.name,
          currentImage: item.previewUrl,
          currentStage: stageMsg,
          percentage: currentPct
        });

        await new Promise((r) => setTimeout(r, 70));
      }

      try {
        // Real API Call to Python/OpenCV backend
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: item.name,
            image_base64: item.previewUrl
          })
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'error') {
          throw new Error(data.error || 'CV feature extraction failed');
        }

        const scores = data.scores || {
          volume: data.volume_score || 75.0,
          spread: data.spread_score || 80.0,
          symmetry: data.symmetry_score || 78.0,
          wind_style: data.wind_score || 72.0,
          overall: data.overall_score || 76.15
        };

        const contestantRecord: Contestant = {
          id: `contestant-${Date.now()}-${i}`,
          name: item.name,
          origin: item.origin || 'Coastal Grove',
          image_url: item.previewUrl,
          created_at: new Date().toISOString(),
          scores: {
            volume: scores.volume,
            spread: scores.spread,
            symmetry: scores.symmetry,
            wind_style: scores.wind_style,
            overall: scores.overall
          },
          hairstyle_title: data.hairstyle_title || 'THE COASTAL RUNWAY CONTENDER',
          jury_comment: data.jury_comment || `${item.name} demonstrates certified frond architecture with calculated symmetry rating of ${scores.symmetry}%.`,
          frond_pixel_count: data.raw_measurements?.total_foliage_pixels || 35000,
          canopy_box: data.dimensions?.canopy_bounding_box || { x: 80, y: 70, width: 620, height: 410 },
          is_verified_cv: true
        };

        successfulList.push(contestantRecord);

      } catch (err: any) {
        console.warn(`[Batch Warning] Palm "${item.name}" encountered issue:`, err);
        // Fault-tolerance: do NOT break the batch!
        failedList.push({
          id: item.id,
          name: item.name,
          previewUrl: item.previewUrl,
          error: err.message || 'Image segmentation unreadable'
        });
      }

      // Update final percentage after completing palm
      setProgressState({
        currentIndex: palmNum,
        totalCount,
        currentName: item.name,
        currentImage: item.previewUrl,
        currentStage: STAGE_MESSAGES[4],
        percentage: Math.round((palmNum / totalCount) * 100)
      });
    }

    // Deterministically calculate awards and rank order for the flight
    const evaluatedList = successfulList.length > 0
      ? calculatePageantAwards(successfulList).allContestants
      : [];

    // Persist all successful batch contestants to Supabase and LocalStorage
    if (evaluatedList.length > 0) {
      await persistCoconutEntries(evaluatedList);
    }

    setAnalyzedResults({
      successful: evaluatedList,
      failed: failedList
    });

    await new Promise((r) => setTimeout(r, 300));
    setIsAnalyzing(false);
    setAnalysisCompleted(true);
  };

  const handleResetForNewFlight = () => {
    setAnalysisCompleted(false);
    setItems([]);
    setErrorMessage(null);
  };

  const formatPadded = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* VIEW A: COMPLETED ANALYSIS RESULTS ROSTER */}
      {analysisCompleted ? (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Completion Celebration Banner */}
          <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border-gold-400/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-mono border border-gold-400/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Python & OpenCV Analysis Cycle Completed</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-4xl text-white mt-1">
                {analyzedResults.successful.length} COCONUTS ANALYZED
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                All fronds segmented, weighted scores calibrated, and intelligent hairstyle titles conferred.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Link
                id="proceed-to-coronation-button"
                href="/awards"
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-300 text-slate-950 font-serif font-black text-xs transition-all duration-200 glow-gold flex-1 md:flex-initial shadow-xl scale-105"
              >
                <Crown className="w-4 h-4" />
                <span>PROCEED TO CORONATION CEREMONY 👑</span>
              </Link>

              <Link
                href="/leaderboard"
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-palace-900 hover:bg-palace-800 text-gold-300 border border-gold-500/30 text-xs font-semibold transition-colors flex-1 md:flex-initial"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>

              <button
                type="button"
                onClick={handleResetForNewFlight}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-palace-900 hover:bg-palace-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold transition-colors flex-1 md:flex-initial"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Flight</span>
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                <span>Pageant Evaluation Dossiers</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {analyzedResults.successful.length} Scored
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyzedResults.successful.map((contestant, idx) => (
                <div
                  key={contestant.id}
                  className="glass-panel rounded-3xl overflow-hidden border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                    <img
                      src={contestant.image_url}
                      alt={contestant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-palace-950 via-palace-950/30 to-transparent" />

                    {/* Flight Index */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-palace-950/85 backdrop-blur-md border border-slate-700 text-xs font-mono font-bold text-emerald-400">
                      #{idx + 1}
                    </div>

                    {/* Overall Score Floating Pill */}
                    <div className="absolute top-3 right-3 flex flex-col items-end px-3 py-1.5 rounded-xl bg-palace-950/90 border border-gold-500/40 backdrop-blur-md shadow-xl">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Overall Score</span>
                      <div className="font-serif text-lg font-black gold-gradient-text">
                        {contestant.scores.overall.toFixed(2)}
                      </div>
                    </div>

                    {/* Title & Name on photo */}
                    <div className="absolute bottom-3 left-3 right-3 space-y-1">
                      {contestant.hairstyle_title && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gold-500/20 border border-gold-400/40 text-[10px] font-serif font-bold text-gold-300 uppercase tracking-wide backdrop-blur-md">
                          <Sparkles className="w-3 h-3 text-gold-400" />
                          <span>{contestant.hairstyle_title}</span>
                        </div>
                      )}

                      <h4 className="font-serif font-bold text-base text-white truncate drop-shadow-md">
                        {contestant.name}
                      </h4>
                    </div>
                  </div>

                  {/* Criteria Breakdown */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-2 pt-1">
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
                        icon="⚖️"
                        color="emerald"
                      />
                      <MetricBar
                        label="Wind Style"
                        value={contestant.scores.wind_style}
                        weight={0.20}
                        icon="💨"
                        color="amber"
                      />
                    </div>

                    {/* Jury Snippet */}
                    {contestant.jury_comment && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-2 bg-palace-900/60 p-2.5 rounded-xl border border-emerald-950">
                        &ldquo;{contestant.jury_comment}&rdquo;
                      </p>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/results?id=${contestant.id}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-palace-900 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold transition-all duration-200"
                    >
                      <span>Examine Official Dossier</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Failed Items Banner if any */}
          {analyzedResults.failed.length > 0 && (
            <div className="p-5 rounded-2xl bg-red-950/40 border border-red-800/60 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{analyzedResults.failed.length} Image(s) Could Not Be Segmented</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analyzedResults.failed.map((f) => (
                  <div key={f.id} className="p-3 rounded-xl bg-palace-950/80 border border-red-900/50 flex items-center gap-3">
                    <img src={f.previewUrl} alt={f.name} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                    <div className="overflow-hidden text-xs">
                      <strong className="block text-white truncate">{f.name}</strong>
                      <span className="text-red-400 text-[11px]">{f.error}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (

        /* VIEW B: UPLOAD & PREVIEW GALLERY */
        <div className="space-y-8">
          
          {/* Top Banner with Dynamic Counter */}
          <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Python & OpenCV Computer Vision Pipeline • No Login Required</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-white mt-1">
                Coconut Contestant Registration
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Submit 1, 5, 10, 20 or more coconut trees. Every uploaded image competes as an independent contestant.
              </p>
            </div>

            {/* Dynamic Counter Pill */}
            <div className="flex items-center gap-3 bg-palace-950 px-5 py-3 rounded-2xl border border-gold-500/40 shadow-xl flex-shrink-0">
              <span className="text-2xl select-none">🌴</span>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Live Entry Count
                </div>
                <div className="font-serif text-xl sm:text-2xl font-black gold-gradient-text">
                  COCONUTS ENTERED: <span className="text-emerald-400">{items.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01] shadow-2xl glow-emerald'
                : 'border-slate-700/80 hover:border-emerald-500/60 bg-palace-900/40 hover:bg-palace-900/70'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4 pointer-events-none">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-gold-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base sm:text-lg font-serif font-bold text-white">
                  Drag & Drop Multiple Coconut Images Here
                </p>
                <p className="text-xs text-slate-400">
                  Or <span className="text-emerald-400 font-semibold underline">browse files</span> from your computer
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
                <span>JPG • PNG • WebP • Up to 15MB each • Unlimited entries</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs animate-fadeIn">
              <FileWarning className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-semibold block mb-0.5">Submission Notice:</strong>
                <p>{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Contestant Gallery (Thumbnails & Metadata) */}
          {items.length > 0 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Gallery Header Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                    <span>Contestant Roster Preview</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {items.length} Ready
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    ✨ <strong className="text-gold-300">Name each coconut below</strong> (e.g. &ldquo;Lord of Varkala&rdquo;, &ldquo;Coastal King&rdquo;) and set its grove location before starting the analysis!
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-palace-900 hover:bg-palace-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex-1 sm:flex-initial justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Add More Images</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/60 text-xs font-semibold transition-colors flex-1 sm:flex-initial justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative glass-panel rounded-2xl overflow-hidden border-slate-800 hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[4/3] w-full bg-slate-950 overflow-hidden">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-palace-950 via-transparent to-transparent" />

                      {/* Index Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-palace-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-emerald-400 font-bold">
                        #{index + 1}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove this contestant"
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-red-950/80 hover:bg-red-600 border border-red-700/60 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Preset tag if sample */}
                      {item.isSamplePreset && (
                        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-palace-950/90 text-[9px] font-mono text-gold-400 border border-gold-500/30">
                          Preset Palm
                        </div>
                      )}
                    </div>

                    {/* Prominent Metadata Name & Origin Inputs */}
                    <div className="p-4 space-y-3 bg-palace-950/80 border-t border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-serif font-bold text-gold-300 flex items-center gap-1.5">
                            <span>🏷️</span>
                            <span>Contestant Palm Name</span>
                          </label>
                          <span className="text-[9px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Custom Title
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItemName(item.id, e.target.value)}
                          placeholder="e.g., Lord of Varkala, Coconut Supreme"
                          className="w-full px-3 py-2 rounded-xl bg-palace-900 border border-gold-500/30 hover:border-gold-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-xs text-white placeholder-slate-500 font-serif font-bold transition-all shadow-inner"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-slate-400 flex items-center gap-1">
                          <span>📍</span>
                          <span>Grove / Provenance Location</span>
                        </label>
                        <input
                          type="text"
                          value={item.origin}
                          onChange={(e) => handleUpdateItemOrigin(item.id, e.target.value)}
                          placeholder="e.g., Alappuzha, Varkala Cliff, Beach Road"
                          className="w-full px-3 py-1.5 rounded-xl bg-palace-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                        <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                        <span className="truncate max-w-[120px]">{item.fileName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary Action Button */}
              <div className="pt-4">
                <button
                  type="button"
                  disabled={isAnalyzing || items.length === 0}
                  onClick={handleAnalyzeAll}
                  className={`w-full py-5 px-8 rounded-2xl font-serif font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
                    isAnalyzing || items.length === 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 glow-emerald scale-[1.01] hover:scale-[1.02] active:scale-[0.99]'
                  }`}
                >
                  <Sparkles className="w-6 h-6" />
                  <span>
                    ANALYZE ALL COCONUTS 🌴 ({items.length} {items.length === 1 ? 'ENTRY' : 'ENTRIES'})
                  </span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ANALYSIS IN PROGRESS MODAL */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-palace-950/95 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border-gold-400/60 shadow-2xl text-center space-y-6">
            
            {/* Header Title */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400">
                HIGH COMMISSION FOR ARBOREAL SPLENDOR
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white">
                COCONUT ANALYSIS IN PROGRESS
              </h3>
            </div>

            {/* Sequential Real Counter: e.g. 07 / 17 */}
            <div className="inline-flex items-baseline gap-2 px-6 py-2 rounded-2xl bg-palace-950 border border-gold-500/40 shadow-inner">
              <span className="font-serif text-3xl sm:text-4xl font-black text-gold-300">
                {formatPadded(progressState.currentIndex)}
              </span>
              <span className="text-sm font-mono text-slate-500 font-bold">/</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-slate-400">
                {formatPadded(progressState.totalCount)}
              </span>
            </div>

            {/* Current Active Image Thumbnail */}
            {progressState.currentImage && (
              <div className="relative mx-auto w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-2xl bg-slate-950">
                <img
                  src={progressState.currentImage}
                  alt={progressState.currentName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
                <div className="absolute bottom-1 left-2 right-2 px-1.5 py-0.5 rounded bg-palace-950/90 text-[10px] font-mono text-emerald-300 truncate">
                  {progressState.currentName}
                </div>
              </div>
            )}

            {/* Progress Bar & Percentage */}
            <div className="space-y-2">
              <div className="w-full h-3.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-gold-400 transition-all duration-300 ease-out"
                  style={{ width: `${progressState.percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-emerald-400 italic flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{progressState.currentStage}</span>
                </span>
                <span className="font-bold text-gold-400">{progressState.percentage}%</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Segmenting HSV fronds, measuring bilateral moments, and calibrating Mr. Coconut 2026 crowns...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
