import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET(req: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        status: 'local_mode',
        entries: [],
        message: 'Supabase unconfigured, using client-side persistent storage'
      });
    }

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

    return NextResponse.json({
      status: 'success',
      count: data?.length || 0,
      entries: data || []
    });

  } catch (error: any) {
    console.error('[API /api/entries GET Error]:', error);
    return NextResponse.json(
      { status: 'error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [body];

    if (!supabase) {
      return NextResponse.json({
        status: 'local_mode',
        count: items.length,
        message: 'Saved to local mode store'
      });
    }

    const rows = items.map((item: any) => ({
      name: item.name || 'Contestant Palm',
      origin: item.origin || 'Coastal Grove',
      image_url: item.image_url || item.previewUrl || '',
      volume_score: item.scores?.volume ?? item.volume_score ?? 0,
      spread_score: item.scores?.spread ?? item.spread_score ?? 0,
      symmetry_score: item.scores?.symmetry ?? item.symmetry_score ?? 0,
      wind_score: item.scores?.wind_style ?? item.wind_score ?? 0,
      overall_score: item.scores?.overall ?? item.overall_score ?? 0,
      hairstyle_title: item.hairstyle_title || '',
      jury_comment: item.jury_comment || ''
    }));

    let result = await supabase.from('contestants').insert(rows).select();
    if (result.error) {
      result = await supabase.from('coconut_entries').insert(rows).select();
      if (result.error) {
        throw result.error;
      }
    }

    return NextResponse.json({
      status: 'success',
      inserted: result.data?.length || 0,
      entries: result.data
    });

  } catch (error: any) {
    console.error('[API /api/entries POST Error]:', error);
    return NextResponse.json(
      { status: 'error', error: error.message },
      { status: 500 }
    );
  }
}
