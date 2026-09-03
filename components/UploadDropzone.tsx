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
  Crown,
  MapPin
} from 'lucide-react';
import { UploadedCoconutItem, Contestant } from '@/lib/types';
import { persistCoconutEntries } from '@/lib/supabase';
import { calculatePageantAwards } from '@/lib/awards';
import MetricBar from './MetricBar';
import AwardBadge from './AwardBadge';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

const CV_STAGES = [
  'FOLIAGE DETECTION',
  'CANOPY ANALYSIS',
  'SYMMETRY ANALYSIS',
  'WIND STYLE ANALYSIS',
  'FINAL SCORE'
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
    stageIndex: number;
    percentage: number;
  }>({
    currentIndex: 0,
    totalCount: 0,
    currentName: '',
    currentImage: '',
    currentStage: CV_STAGES[0],
    stageIndex: 0,
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
      reader.onerror = () => resolve("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%2304100b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='%2338b289'%3E🌴%3C/text%3E%3C/svg%3E");
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
  }, [items]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

  const handleClearAll = () => {
    setItems([]);
    setErrorMessage(null);
  };

  // Preset Sample Palm Loader
  const handleLoadSamplePalms = () => {
    const samples: UploadedCoconutItem[] = [
      {
        id: `sample-${Date.now()}-1`,
        name: 'Lord of Varkala',
        origin: 'Varkala Cliff Grove',
        previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        fileSize: 420000,
        fileName: 'varkala_cliff_palm.jpg',
        fileType: 'image/jpeg',
        isSamplePreset: true
      },
      {
        id: `sample-${Date.now()}-2`,
        name: 'Baron von Coconut',
        origin: 'Kumarakom Backwaters',
        previewUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        fileSize: 380000,
        fileName: 'kumarakom_baron.jpg',
        fileType: 'image/jpeg',
        isSamplePreset: true
      },
      {
        id: `sample-${Date.now()}-3`,
        name: 'The Monsoon Runway Queen',
        origin: 'Alappuzha Beach',
        previewUrl: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
        fileSize: 450000,
        fileName: 'alappuzha_monsoon.jpg',
        fileType: 'image/jpeg',
        isSamplePreset: true
      }
    ];

    setItems((prev) => [...prev, ...samples]);
    setErrorMessage(null);
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

      // Stage progression through CV stages
      for (let s = 0; s < CV_STAGES.length; s++) {
        const stageName = CV_STAGES[s];
        const currentPct = Math.round(((i + (s / CV_STAGES.length)) / totalCount) * 100);

        setProgressState({
          currentIndex: palmNum,
          totalCount,
          currentName: item.name,
          currentImage: item.previewUrl,
          currentStage: stageName,
          stageIndex: s,
          percentage: currentPct
        });

        await new Promise((r) => setTimeout(r, 90));
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
        currentStage: CV_STAGES[4],
        stageIndex: 4,
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
          <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border-gold-400/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-gold-300 text-xs font-mono border border-gold-400/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Python & OpenCV Computer Vision Cycle Completed</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-4xl text-white mt-1">
                {analyzedResults.successful.length} COCONUTS EVALUATED
              </h2>
              <p className="text-xs sm:text-sm text-sage-300 font-sans">
                All crowns segmented, weighted scores calibrated, and intelligent hairstyle titles conferred.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Link
                id="proceed-to-coronation-button"
                href="/awards"
                className="btn-glass-gold flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider flex-1 md:flex-initial shadow-xl hover:scale-105"
              >
                <Crown className="w-4 h-4" />
                <span>CORONATION CEREMONY 👑</span>
              </Link>

              <Link
                href="/leaderboard"
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-forest-900/90 hover:bg-forest-800 text-gold-300 border border-gold-500/40 text-xs font-serif font-bold transition-colors flex-1 md:flex-initial"
              >
                <Trophy className="w-4 h-4" />
                <span>The Royal Rankings</span>
              </Link>

              <button
                type="button"
                onClick={handleResetForNewFlight}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-forest-950 hover:bg-forest-900 text-sage-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-colors flex-1 md:flex-initial"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Flight</span>
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
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
                  className="glass-panel rounded-3xl overflow-hidden border-emerald-900/40 hover:border-emerald-400/50 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full bg-forest-950 overflow-hidden">
                    <img
                      src={contestant.image_url}
                      alt={contestant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />

                    {/* Flight Index */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-forest-950/85 backdrop-blur-md border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
                      #{idx + 1}
                    </div>

                    {/* Overall Score Floating Pill */}
                    <div className="absolute top-3 right-3 flex flex-col items-end px-3 py-1.5 rounded-xl bg-forest-950/90 border border-gold-400/50 backdrop-blur-md shadow-xl">
                      <span className="text-[9px] uppercase tracking-wider text-sage-300 font-mono">Score</span>
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

                  {/* Body Metrics */}
                  <div className="p-4 space-y-3 bg-forest-950/40">
                    <div className="space-y-2">
                      <MetricBar label="Volume" value={contestant.scores.volume} weight={0.30} icon="🌿" color="teal" showDetails={false} />
                      <MetricBar label="Spread" value={contestant.scores.spread} weight={0.25} icon="↔️" color="cyan" showDetails={false} />
                      <MetricBar label="Symmetry" value={contestant.scores.symmetry} weight={0.25} icon="⚖️" color="emerald" showDetails={false} />
                      <MetricBar label="Wind" value={contestant.scores.wind_style} weight={0.20} icon="💨" color="amber" showDetails={false} />
                    </div>

                    <Link
                      href={`/results?id=${contestant.id}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-forest-900 hover:bg-emerald-800 text-ivory-100 border border-emerald-500/30 text-xs font-serif font-bold transition-colors"
                    >
                      <span>View Official Certificate</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
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
                  <div key={f.id} className="p-3 rounded-xl bg-forest-950/80 border border-red-900/50 flex items-center gap-3">
                    <img src={f.previewUrl} alt={f.name} className="w-12 h-12 rounded-lg object-cover bg-forest-950" />
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
          <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Python & OpenCV Computer Vision Pipeline • No Login Required</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-white mt-1">
                JURY DELIBERATION REGISTRATION
              </h2>
              <p className="text-xs sm:text-sm text-sage-300 font-sans">
                Submit 1, 5, 10, or 20 coconut trees. Every candidate palm competes as an independent contestant.
              </p>
            </div>

            {/* Dynamic Counter Pill */}
            <div className="flex items-center gap-3 bg-forest-950 px-5 py-3 rounded-2xl border border-gold-400/50 shadow-2xl flex-shrink-0">
              <span className="text-2xl select-none">🌴</span>
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-sage-400">
                  Roster Counter
                </div>
                <div className="font-serif text-lg sm:text-xl font-black gold-gradient-text">
                  COCONUTS ENTERED: <span className="text-emerald-300">{items.length}</span>
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
                ? 'border-emerald-400 bg-emerald-950/60 scale-[1.01] shadow-2xl glow-emerald'
                : 'border-emerald-500/30 hover:border-emerald-400/60 bg-forest-950/50 hover:bg-forest-950/80 shadow-xl'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4 pointer-events-none">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600/30 to-gold-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-xl">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base sm:text-lg font-serif font-bold text-white">
                  Drop Coconut Crown Photos Here
                </p>
                <p className="text-xs text-sage-300 font-sans">
                  or <span className="text-gold-300 font-semibold underline">browse from your device</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-sage-400 font-mono pt-2">
                <span>JPG, PNG, WebP • Up to 15MB each</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Sample Palms Loader */}
          {items.length === 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-xs text-sage-400">
              <span>Don&apos;t have coconut photos right now?</span>
              <button
                type="button"
                onClick={handleLoadSamplePalms}
                className="px-4 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-serif font-bold tracking-wide transition-colors"
              >
                🌴 Load 3 Preset Contestant Palms
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Uploaded Items Staging Grid */}
          {items.length > 0 && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-white">
                    Candidate Flight Roster
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-forest-950 border border-gold-400/40 text-gold-300 text-xs font-mono font-bold">
                    {items.length} {items.length === 1 ? 'Contestant' : 'Contestants'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory-100 border border-emerald-500/30 text-xs font-semibold transition-colors flex-1 sm:flex-initial justify-center"
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
                    className="group relative glass-panel rounded-2xl overflow-hidden border-emerald-900/40 hover:border-emerald-400/50 transition-all duration-200 flex flex-col justify-between shadow-lg"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[4/3] w-full bg-forest-950 overflow-hidden">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />

                      {/* Index Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-forest-950/90 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300 font-bold">
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
                        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-forest-950/90 text-[9px] font-mono text-gold-400 border border-gold-500/30">
                          Preset Palm
                        </div>
                      )}
                    </div>

                    {/* Metadata Name & Origin Inputs */}
                    <div className="p-4 space-y-3 bg-forest-950/80 border-t border-emerald-900/40">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-serif font-bold text-gold-300 flex items-center gap-1.5">
                            <span>🏷️</span>
                            <span>Contestant Palm Name</span>
                          </label>
                          <span className="text-[9px] font-mono text-emerald-300 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Custom Title
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItemName(item.id, e.target.value)}
                          placeholder="e.g., Lord of Varkala, Coconut Supreme"
                          className="w-full px-3 py-2 rounded-xl bg-forest-900 border border-gold-400/30 hover:border-gold-400 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-xs text-white placeholder-slate-500 font-serif font-bold transition-all shadow-inner"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-sage-400 flex items-center gap-1">
                          <span>📍</span>
                          <span>Grove / Provenance Location</span>
                        </label>
                        <input
                          type="text"
                          value={item.origin}
                          onChange={(e) => handleUpdateItemOrigin(item.id, e.target.value)}
                          placeholder="e.g., Alappuzha, Varkala Cliff, Beach Road"
                          className="w-full px-3 py-1.5 rounded-xl bg-forest-900 border border-emerald-900/40 hover:border-emerald-700 focus:border-emerald-500 text-[11px] text-sage-200 placeholder-slate-600 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-sage-400 pt-1 border-t border-emerald-900/30">
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
                      ? 'bg-forest-950 text-slate-600 cursor-not-allowed border border-emerald-950'
                      : 'btn-glass-primary glow-emerald scale-[1.01] hover:scale-[1.02] active:scale-[0.99]'
                  }`}
                >
                  <Sparkles className="w-6 h-6 text-gold-400" />
                  <span>
                    ANALYZE ALL CANDIDATES 🌴 ({items.length} {items.length === 1 ? 'CONTESTANT' : 'CONTESTANTS'})
                  </span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* POLISHED COMPUTER VISION DELIBERATION SCANNING MODAL */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-forest-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl border-gold-400/70 shadow-2xl text-center space-y-6">
            
            {/* Header Title */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold">
                HIGH COMMISSION FOR ARBOREAL SPLENDOR
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white">
                CV DELIBERATION IN PROGRESS
              </h3>
            </div>

            {/* Sequential Real Counter: e.g. 02 / 03 */}
            <div className="inline-flex items-baseline gap-2 px-6 py-2 rounded-2xl bg-forest-950 border border-gold-400/40 shadow-inner">
              <span className="font-serif text-3xl sm:text-4xl font-black text-gold-300">
                {formatPadded(progressState.currentIndex)}
              </span>
              <span className="text-sm font-mono text-sage-400 font-bold">/</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-sage-300">
                {formatPadded(progressState.totalCount)}
              </span>
            </div>

            {/* Current Active Image Thumbnail with Subtle Green Laser Scanning Line */}
            {progressState.currentImage && (
              <div className="relative mx-auto w-40 h-32 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-2xl bg-forest-950">
                <img
                  src={progressState.currentImage}
                  alt={progressState.currentName}
                  className="w-full h-full object-cover"
                />
                
                {/* Green Laser Scan Line Overlay */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_15px_#38b289] animate-laser-scan" />

                <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                <div className="absolute bottom-1 left-2 right-2 px-1.5 py-0.5 rounded bg-forest-950/90 text-[10px] font-mono text-emerald-300 truncate">
                  {progressState.currentName}
                </div>
              </div>
            )}

            {/* 5-Stage Computer Vision Protocol Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-gold-300 px-1">
                <span>Stage: {progressState.currentStage}</span>
                <span>{progressState.percentage}%</span>
              </div>

              {/* Multi-step pill indicators */}
              <div className="grid grid-cols-5 gap-1.5">
                {CV_STAGES.map((st, idx) => (
                  <div
                    key={st}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx <= progressState.stageIndex
                        ? 'bg-gradient-to-r from-emerald-400 to-gold-400 shadow-[0_0_8px_rgba(56,178,137,0.5)]'
                        : 'bg-forest-900 border border-emerald-900/30'
                    }`}
                  />
                ))}
              </div>

              {/* Progress Bar & Percentage */}
              <div className="w-full h-2 rounded-full bg-forest-900 border border-emerald-500/20 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-mint-400 to-gold-400 transition-all duration-300 ease-out"
                  style={{ width: `${progressState.percentage}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-sage-400 italic font-sans">
              Segmenting chlorophyll fronds, calculating bilateral moments, and awarding crowns...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
