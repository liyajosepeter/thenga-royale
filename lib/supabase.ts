import { createClient } from '@supabase/supabase-js';
import { Contestant } from './types';
import { calculatePageantAwards } from './awards';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'contestants';

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
 * Supports both 'contestants' and 'coconut_entries' tables seamlessly.
 */
export async function fetchLeaderboardEntries(): Promise<Contestant[]> {
  let rawList: Contestant[] = [];

  // Case A: Attempt fetching from Supabase
  if (supabase) {
    try {
      // Try 'contestants' table first, then fallback to 'coconut_entries'
      let response = await supabase
        .from('contestants')
        .select('*')
        .order('overall_score', { ascending: false });

      if (response.error || !response.data) {
        response = await supabase
          .from('coconut_entries')
          .select('*')
          .order('overall_score', { ascending: false });
      }

      const data = response.data;
      if (data && data.length > 0) {
        rawList = data.map((row: any, idx: number) => ({
          id: String(row.id),
          name: row.name || 'Contestant Palm',
          origin: row.origin || 'Coastal Grove',
          image_url: row.image_url,
          created_at: row.created_at,
          scores: {
            volume: Number(row.volume_score) || 0,
            spread: Number(row.spread_score) || 0,
            symmetry: Number(row.symmetry_score) || 0,
            wind_style: Number(row.wind_score) || 0,
            overall: Number(row.overall_score) || 0
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
  if (rawList.length === 0 && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('thenga_contestants');
      if (stored) {
        const localList: Contestant[] = JSON.parse(stored);
        const map = new Map<string, Contestant>();
        localList.forEach((c) => {
          if (!map.has(c.id)) map.set(c.id, c);
        });
        rawList = Array.from(map.values());
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  if (rawList.length === 0) {
    return [];
  }

  // Calculate and attach deterministic awards
  const awardsResult = calculatePageantAwards(rawList);
  return awardsResult.allContestants;
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

      // Try inserting into 'contestants' first, then 'coconut_entries'
      let { error } = await supabase.from('contestants').insert(rows);
      if (error) {
        const retry = await supabase.from('coconut_entries').insert(rows);
        if (retry.error) {
          console.warn('[Supabase Insert Notice]:', error.message, retry.error.message);
          return false;
        }
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
