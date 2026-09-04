export interface ScoreBreakdown {
  volume: number;      // 🌿 HAIR VOLUME  (30%)
  spread: number;      // ↔️ HAIR SPREAD  (25%)
  symmetry: number;    // ⚖️ SYMMETRY     (25%)
  wind_style: number;  // 💨 WIND STYLE   (20%)
  overall: number;     // Weighted composite score (0-100)
}

export type AwardType = 
  | 'mr_coconut_2026' 
  | 'symmetry_king' 
  | 'volume_king' 
  | 'spread_king' 
  | 'wind_king';

export interface PageantAward {
  id: AwardType;
  title: string;
  icon: string;
  color: 'gold' | 'emerald' | 'teal' | 'cyan' | 'amber';
  description?: string;
}

export interface ContourBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Contestant {
  id: string;
  name: string;
  origin?: string;
  image_url: string;
  created_at: string;
  scores: ScoreBreakdown;
  rank?: number;
  hairstyle_title?: string;
  awards?: PageantAward[];
  jury_comment?: string;
  frond_pixel_count?: number;
  canopy_box?: ContourBBox;
  is_verified_cv?: boolean;
}

export interface UploadedCoconutItem {
  id: string;
  previewUrl: string;
  name: string;
  origin: string;
  fileSize: number;
  fileName: string;
  fileType: string;
  isSamplePreset?: boolean;
  validationStatus?: 'pending' | 'validating' | 'valid' | 'invalid' | 'error';
  validationConfidence?: number;
  validationMessage?: string;
}

