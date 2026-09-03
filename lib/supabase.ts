import { createClient } from '@supabase/supabase-js';
import { Contestant } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    })
  : null;

/**
 * Fetches all user-entered coconut entries sorted by overall_score DESC.
 * Returns ONLY what the user/operator has actually uploaded (no fake mock data).
 */
export async function fetchLeaderboardEntries(): Promise<Contestant[]> {
  // Case A: Attempt fetching from Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('coconut_entries')
        .select('*')
        .order('overall_score', { ascending: false });

      if (!error && data) {
        return data.map((row: any, idx: number) => ({
          id: row.id,
          name: row.name || 'Contestant Palm',
          origin: row.origin || 'Coastal Grove',
          image_url: row.image_url,
          created_at: row.created_at,
          scores: {
            volume: Number(row.volume_score),
            spread: Number(row.spread_score),
            symmetry: Number(row.symmetry_score),
            wind_style: Number(row.wind_score),
            overall: Number(row.overall_score)
          },
          rank: idx + 1,
          hairstyle_title: row.hairstyle_title || 'THE COASTAL RUNWAY CONTENDER',
          jury_comment: row.jury_comment,
          is_verified_cv: true
        }));
      }
    } catch (err) {
      console.warn('[Supabase Fetch Notice]: Using local operator store', err);
    }
  }

  // Case B: Local Storage (Strictly user-entered coconuts)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('thenga_contestants');
      if (stored) {
        const localList: Contestant[] = JSON.parse(stored);
        // Filter unique by ID
        const map = new Map<string, Contestant>();
        localList.forEach((c) => {
          if (!map.has(c.id)) map.set(c.id, c);
        });
        const combined = Array.from(map.values());
        combined.sort((a, b) => b.scores.overall - a.scores.overall);
        combined.forEach((c, idx) => {
          c.rank = idx + 1;
        });
        return combined;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // If no coconuts entered yet, return empty list (No mock data)
  return [];
}

/**
 * Persists evaluated contestants to Supabase and synchronizes localStorage.
 */
export async function persistCoconutEntries(contestants: Contestant[]): Promise<boolean> {
  if (!contestants || contestants.length === 0) return true;

  // 1. Sync to LocalStorage (Immediate client-side persistence)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('thenga_contestants');
      const existingList: Contestant[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, Contestant>();
      [...contestants, ...existingList].forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      });
      const updatedList = Array.from(map.values());
      localStorage.setItem('thenga_contestants', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage sync error:', e);
    }
  }

  // 2. Sync to Supabase if configured
  if (supabase) {
    try {
      const rows = contestants.map((c) => ({
        id: c.id.startsWith('contestant-') || c.id.length < 30 ? undefined : c.id,
        name: c.name,
        origin: c.origin || 'Coastal Grove',
        image_url: c.image_url,
        volume_score: c.scores.volume,
        spread_score: c.scores.spread,
        symmetry_score: c.scores.symmetry,
        wind_score: c.scores.wind_style,
        overall_score: c.scores.overall,
        hairstyle_title: c.hairstyle_title || 'THE COASTAL RUNWAY CONTENDER',
        jury_comment: c.jury_comment
      }));

      const { error } = await supabase.from('coconut_entries').insert(rows);
      if (error) {
        console.warn('[Supabase Insert Notice]:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase Insert Error]:', err);
      return false;
    }
  }

  return true;
}

/**
 * Helper to clear all local stored entries if operator wants a fresh start.
 */
export function clearAllLocalContestants() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('thenga_contestants');
  }
}
