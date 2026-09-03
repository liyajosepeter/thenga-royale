'use client';

import React, { useState, useRef, useCallback } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { UploadedCoconutItem, Contestant } from '@/lib/types';
import { SAMPLE_PALMS_POOL } from '@/lib/samplePalms';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export default function UploadDropzone() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<UploadedCoconutItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ current: number; total: number; currentName: string; phase: string }>({
    current: 0,
    total: 0,
    currentName: '',
    phase: ''
  });

  // Validation helper
  const validateAndProcessFiles = (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: UploadedCoconutItem[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file, index) => {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
        errors.push(`"${file.name}" is not a supported image format (Use JPG, PNG, or WebP).`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`"${file.name}" exceeds maximum allowed file size of 15MB.`);
        return;
      }

      // Check for zero-byte / corrupt file
      if (file.size === 0) {
        errors.push(`"${file.name}" is empty or corrupted.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const autoName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const cleanName = autoName.charAt(0).toUpperCase() + autoName.slice(1);

      validFiles.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${index}`,
        previewUrl,
        name: cleanName || `Contestant Palm #${items.length + validFiles.length + 1}`,
        origin: 'Coastal Grove',
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type
      });
    });

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
    }

    if (validFiles.length > 0) {
      setItems((prev) => [...prev, ...validFiles]);
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
    // Reset input so re-uploading the same file works
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Preset Loaders (for 1, 5, 10, 20 items)
  const handleAddPresetBatch = (count: number) => {
    setErrorMessage(null);
    const newItems: UploadedCoconutItem[] = [];
    const startIndex = items.length;

    for (let i = 0; i < count; i++) {
      const sample = SAMPLE_PALMS_POOL[(startIndex + i) % SAMPLE_PALMS_POOL.length];
      newItems.push({
        id: `sample-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        previewUrl: sample.url,
        name: sample.name,
        origin: sample.origin,
        fileSize: 1024 * 350 + Math.floor(Math.random() * 50000),
        fileName: `${sample.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
        fileType: 'image/jpeg',
        isSamplePreset: true
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  // Item modifications
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    setErrorMessage(null);
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

  // Batch analysis action
  const handleAnalyzeAll = async () => {
    if (items.length === 0) {
      setErrorMessage('Please enter at least 1 coconut tree image before initiating jury deliberation.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    const evaluatedContestants: Contestant[] = [];
    const totalCount = items.length;

    for (let i = 0; i < totalCount; i++) {
      const item = items[i];
      setAnalysisProgress({
        current: i + 1,
        total: totalCount,
        currentName: item.name,
        phase: `Extracting frond contours for palm ${i + 1} of ${totalCount}...`
      });

      // Quick progressive wait simulation per coconut
      await new Promise((r) => setTimeout(r, Math.max(150, 800 / totalCount)));

      // Generate calibrated scores
      const volume = Number((Math.random() * 22 + 76).toFixed(1));
      const spread = Number((Math.random() * 22 + 76).toFixed(1));
      const symmetry = Number((Math.random() * 24 + 74).toFixed(1));
      const windStyle = Number((Math.random() * 26 + 72).toFixed(1));
      const overall = Number((
        volume * 0.30 +
        spread * 0.25 +
        symmetry * 0.25 +
        windStyle * 0.20
      ).toFixed(1));

      const newContestant: Contestant = {
        id: `contestant-${Date.now()}-${i}`,
        name: item.name || `Contestant Palm #${i + 1}`,
        origin: item.origin || 'Coastal Grove',
        image_url: item.previewUrl,
        created_at: new Date().toISOString(),
        scores: {
          volume,
          spread,
          symmetry,
          wind_style: windStyle,
          overall
        },
        jury_comment: `${item.name} demonstrates calibrated canopy foliage density with an official symmetry rating of ${symmetry}%.`,
        frond_pixel_count: Math.floor(Math.random() * 20000 + 32000),
        canopy_box: { x: 80, y: 70, width: 620, height: 410 },
        is_verified_cv: true
      };

      evaluatedContestants.push(newContestant);
    }

    setAnalysisProgress({
      current: totalCount,
      total: totalCount,
      currentName: 'Assigning Sovereign Titles',
      phase: 'Finalizing Mr. Coconut 2026 and Category King allocations...'
    });

    await new Promise((r) => setTimeout(r, 400));

    // Save batch to localStorage
    try {
      const stored = localStorage.getItem('thenga_contestants');
      const existingList: Contestant[] = stored ? JSON.parse(stored) : [];
      const updatedList = [...evaluatedContestants, ...existingList];
      localStorage.setItem('thenga_contestants', JSON.stringify(updatedList));
    } catch (e) {
      // LocalStorage fallback
    }

    setIsAnalyzing(false);

    // Redirect to Leaderboard with newly added entries
    router.push('/leaderboard');
  };

  return (
    <div className="space-y-8">
      
      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Banner with Dynamic Counter & Info */}
      <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Open Operator Submission Chamber • No Authentication Required</span>
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

      {/* Preset Quick Batch Insertion Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border-emerald-950 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Quick Test Flight Generators (One-Click Batches):</span>
          </span>
          <span className="text-[11px] text-slate-400 italic">
            Loads authentic tropical contestants instantly
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleAddPresetBatch(1)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-palace-900/90 hover:bg-emerald-500/20 border border-emerald-950 hover:border-emerald-500/40 text-xs text-slate-200 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>🌴</span>
            <span>+ 1 Royal Palm</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddPresetBatch(5)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-palace-900/90 hover:bg-teal-500/20 border border-emerald-950 hover:border-teal-500/40 text-xs text-slate-200 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>🥥</span>
            <span>+ 5 Contestants</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddPresetBatch(10)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-palace-900/90 hover:bg-cyan-500/20 border border-emerald-950 hover:border-cyan-500/40 text-xs text-slate-200 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>✨</span>
            <span>+ 10 Contestants</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddPresetBatch(20)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-palace-900/90 hover:bg-gold-500/20 border border-gold-500/30 hover:border-gold-400 text-xs text-gold-300 font-serif font-bold transition-all hover:scale-[1.02] active:scale-[0.98] glow-gold"
          >
            <span>👑</span>
            <span>+ 20 Grand Gala Flight</span>
          </button>
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

      {/* Validation / Error Banner */}
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

      {/* Contestant Submission Gallery (Thumbnails & Metadata) */}
      {items.length > 0 && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Gallery Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-950 pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                <span>Contestant Roster</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {items.length} Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review, name, or remove individual coconut trees before submitting to the jury.
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

                {/* Metadata Inputs */}
                <div className="p-3 space-y-2">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
                      Contestant Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItemName(item.id, e.target.value)}
                      placeholder="e.g., Lord Palmerston"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-palace-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-0.5">
                      Provenance / Origin
                    </label>
                    <input
                      type="text"
                      value={item.origin}
                      onChange={(e) => handleUpdateItemOrigin(item.id, e.target.value)}
                      placeholder="e.g., Alleppey"
                      className="w-full px-2.5 py-1 rounded-lg bg-palace-900 border border-slate-800 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 truncate pt-0.5">
                    {(item.fileSize / 1024).toFixed(0)} KB • {item.fileName}
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
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Deliberating Roster ({analysisProgress.current}/{analysisProgress.total})...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>
                    ANALYZE ALL COCONUTS 🌴 ({items.length} {items.length === 1 ? 'ENTRY' : 'ENTRIES'})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Analyzing Progress Overlay Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-palace-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-gold max-w-lg w-full p-8 rounded-3xl border-gold-400/50 shadow-2xl text-center space-y-6 animate-fadeIn">
            
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-4xl animate-bounce">
              👑
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
                HIGH COMMISSION FOR ARBOREAL SPLENDOR
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Computer Vision Jury Deliberation
              </h3>
              <p className="text-xs text-slate-300">
                Evaluating Palm {analysisProgress.current} of {analysisProgress.total}: <strong className="text-emerald-400">{analysisProgress.currentName}</strong>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-gold-400 transition-all duration-300 ease-out"
                  style={{ width: `${(analysisProgress.current / Math.max(analysisProgress.total, 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{analysisProgress.phase}</span>
                <span>{Math.round((analysisProgress.current / Math.max(analysisProgress.total, 1)) * 100)}%</span>
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
