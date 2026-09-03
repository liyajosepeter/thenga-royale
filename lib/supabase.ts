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
 * Helper to convert Base64 Data URL to a native Blob for Supabase Storage uploads.
 */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; contentType: string } | null {
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const match = parts[0].match(/:(.*?);/);
    const contentType = match ? match[1] : 'image/jpeg';
    
    // In Browser
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      const binary = window.atob(parts[1]);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      return { blob: new Blob([array], { type: contentType }), contentType };
    }
    
    // In Node.js / Serverless
    const buffer = Buffer.from(parts[1], 'base64');
    return { blob: new Blob([buffer], { type: contentType }), contentType };
  } catch (e) {
    console.warn('Error converting dataUrl to Blob:', e);
    return null;
  }
}

/**
 * Uploads a coconut image to Supabase Storage and returns its permanent Public URL.
 */
export async function uploadCoconutImageToStorage(dataUrl: string, contestantName: string): Promise<string> {
  if (!supabase || !dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  try {
    const converted = dataUrlToBlob(dataUrl);
    if (!converted) return dataUrl;

    const safeName = contestantName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 24);
    const ext = converted.contentType.includes('png') ? 'png' : 'jpg';
    const filePath = `coconuts/${Date.now()}_${safeName}.${ext}`;

    // 1. Try uploading to primary configured bucket (e.g. 'contestants')
    const { error } = await supabase.storage
      .from(supabaseBucket)
      .upload(filePath, converted.blob, {
        contentType: converted.contentType,
        upsert: true
      });

    if (!error) {
      const { data: publicUrlData } = supabase.storage
        .from(supabaseBucket)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        console.log(`[Supabase Storage] Successfully uploaded image to ${supabaseBucket}/${filePath}`);
        return publicUrlData.publicUrl;
      }
    } else {
      console.warn(`[Supabase Storage Upload Notice for ${supabaseBucket}]:`, error.message);
      
      // 2. Fallback attempt on 'coconuts' bucket if primary bucket had an issue
      if (supabaseBucket !== 'coconuts') {
        const retry = await supabase.storage
          .from('coconuts')
          .upload(filePath, converted.blob, {
            contentType: converted.contentType,
            upsert: true
          });

        if (!retry.error) {
          const { data: publicUrlData } = supabase.storage
            .from('coconuts')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            console.log(`[Supabase Storage] Successfully uploaded image to coconuts/${filePath}`);
            return publicUrlData.publicUrl;
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Supabase Storage Exception]:', err);
  }

  // Graceful fallback to original dataUrl if storage upload failed
  return dataUrl;
}

/**
 * Fetches all user-entered coconut entries sorted by overall_score DESC.
 * Supports both 'contestants' and 'coconut_entries' tables seamlessly.
 */
export async function fetchLeaderboardEntries(): Promise<Contestant[]> {
  let rawList: Contestant[] = [];

  // Case A: Attempt fetching from Supabase
  if (supabase) {
    try {
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
 * Persists evaluated contestants to Supabase (Storage + Database) and synchronizes localStorage.
 */
export async function persistCoconutEntries(contestants: Contestant[]): Promise<boolean> {
  if (!contestants || contestants.length === 0) return true;

  // 1. Upload images to Supabase Storage first to get permanent clean URLs
  const contestantsToSave: Contestant[] = [];
  for (const c of contestants) {
    let permanentUrl = c.image_url;
    if (c.image_url && c.image_url.startsWith('data:')) {
      permanentUrl = await uploadCoconutImageToStorage(c.image_url, c.name);
      c.image_url = permanentUrl;
    }
    contestantsToSave.push({ ...c, image_url: permanentUrl });
  }

  // 2. Sync to LocalStorage (Immediate client-side persistence)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('thenga_contestants');
      const existingList: Contestant[] = stored ? JSON.parse(stored) : [];
      const map = new Map<string, Contestant>();
      [...contestantsToSave, ...existingList].forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      });
      const updatedList = Array.from(map.values());
      localStorage.setItem('thenga_contestants', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage sync error:', e);
    }
  }

  // 3. Sync rows to Supabase Database
  if (supabase) {
    try {
      // 1. Full schema row (if table has hairstyle_title / jury_comment)
      const fullRows = contestantsToSave.map((c) => ({
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

      // 2. Standard schema row (for tables created with standard numerical scores)
      const standardRows = contestantsToSave.map((c) => ({
        name: c.name,
        origin: c.origin || 'Coastal Grove',
        image_url: c.image_url,
        volume_score: c.scores.volume,
        spread_score: c.scores.spread,
        symmetry_score: c.scores.symmetry,
        wind_score: c.scores.wind_style,
        overall_score: c.scores.overall
      }));

      // Try inserting into 'contestants' with fullRows, then fallback to standardRows
      let { error } = await supabase.from('contestants').insert(fullRows);
      if (error) {
        // Fallback to standard columns if column doesn't exist
        const standardInsert = await supabase.from('contestants').insert(standardRows);
        if (standardInsert.error) {
          console.warn('[Supabase contestants Insert Notice]:', standardInsert.error.message);
          const retry = await supabase.from('coconut_entries').insert(fullRows);
          if (retry.error) {
            await supabase.from('coconut_entries').insert(standardRows);
          }
        }
      }
      console.log(`[Supabase DB] Successfully stored ${contestantsToSave.length} coconut contestants.`);
      return true;
    } catch (err) {
      console.warn('[Supabase Insert Error]:', err);
      return false;
    }
  }

  return true;
}

/**
 * Helper to clear all local stored entries and Supabase database if operator wants a fresh start.
 */
export async function clearAllLocalContestants() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('thenga_contestants');
  }
  if (supabase) {
    try {
      await supabase.from('contestants').delete().neq('id', 0);
      await supabase.from('coconut_entries').delete().neq('id', '0');
    } catch (e) {
      console.warn('Error clearing Supabase entries:', e);
    }
  }
}
