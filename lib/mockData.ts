import { Contestant } from './types';

export const MOCK_CONTESTANTS: Contestant[] = [
  {
    id: 'contestant-1',
    name: 'Sir Palmerston III',
    origin: 'Alappuzha Backwaters, Kerala',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-01T10:30:00Z',
    scores: {
      volume: 96.4,
      spread: 94.2,
      symmetry: 95.8,
      wind_style: 91.0,
      overall: 94.6
    },
    rank: 1,
    awards: [
      { id: 'mr_coconut_2026', title: 'MR. COCONUT 2026', icon: '👑', color: 'gold', description: 'Supreme Champion of Arboreal Aesthetics' },
      { id: 'volume_king', title: 'VOLUME KING', icon: '🌿', color: 'teal', description: 'Highest Chloroplast Canopy Density' }
    ],
    jury_comment: 'Sir Palmerston III commands the backwaters with an aristocratic frond crown of peerless density. The canopy convex hull displays near-zero photosynthetic leakage.',
    frond_pixel_count: 48290,
    canopy_box: { x: 80, y: 65, width: 640, height: 420 },
    is_verified_cv: true
  },
  {
    id: 'contestant-2',
    name: 'Lady Malabarica',
    origin: 'Varkala Cliff Promenade',
    image_url: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-01T14:15:00Z',
    scores: {
      volume: 88.0,
      spread: 98.5,
      symmetry: 92.0,
      wind_style: 89.0,
      overall: 91.8
    },
    rank: 2,
    awards: [
      { id: 'spread_king', title: 'SPREAD KING', icon: '↔️', color: 'cyan', description: 'Unrivaled Horizontal Horizon Coverage' }
    ],
    jury_comment: 'Lady Malabarica boasts an astonishing 2.45 aspect ratio wingspan. Her fronds claim maximum coastal airspace with effortless royal grace.',
    frond_pixel_count: 41920,
    canopy_box: { x: 50, y: 110, width: 700, height: 350 },
    is_verified_cv: true
  },
  {
    id: 'contestant-3',
    name: 'Professor Geometricus',
    origin: 'Kumarakom Bird Sanctuary',
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-02T09:00:00Z',
    scores: {
      volume: 86.0,
      spread: 82.0,
      symmetry: 99.6,
      wind_style: 72.0,
      overall: 85.6
    },
    rank: 3,
    awards: [
      { id: 'symmetry_king', title: 'SYMMETRY KING', icon: '⚖️', color: 'emerald', description: 'Flawless Bilateral Botanical Balance' }
    ],
    jury_comment: 'A mathematical triumph. Left-to-right pixel variance is under 0.4%, creating a hypnotic Cartesian harmony that stunned the judging panel.',
    frond_pixel_count: 38400,
    canopy_box: { x: 120, y: 80, width: 560, height: 410 },
    is_verified_cv: true
  },
  {
    id: 'contestant-4',
    name: 'Monsoon Maverick',
    origin: 'Kovalam Lighthouse Crest',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-02T16:45:00Z',
    scores: {
      volume: 84.5,
      spread: 86.0,
      symmetry: 78.0,
      wind_style: 99.2,
      overall: 86.2
    },
    rank: 4,
    awards: [
      { id: 'wind_king', title: 'WIND KING', icon: '💨', color: 'amber', description: 'Peak Aerodynamic Monsoonal Drama' }
    ],
    jury_comment: 'Monsoon Maverick channels Category 4 tradewinds into an electrifying hairtoss. Pure, untamed coastal swagger with maximum directional flair.',
    frond_pixel_count: 36200,
    canopy_box: { x: 90, y: 95, width: 610, height: 390 },
    is_verified_cv: true
  },
  {
    id: 'contestant-5',
    name: 'Breeze Lord Tharoor',
    origin: 'Thiruvananthapuram Golf Club',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-03T11:20:00Z',
    scores: {
      volume: 85.0,
      spread: 91.0,
      symmetry: 81.0,
      wind_style: 87.5,
      overall: 86.0
    },
    rank: 5,
    awards: [],
    jury_comment: 'Exhibits an eloquent and sesquipedalian frond arrangement, articulating botanical grandeur with dignified nonchalance.',
    frond_pixel_count: 37800,
    canopy_box: { x: 100, y: 90, width: 590, height: 400 },
    is_verified_cv: true
  },
  {
    id: 'contestant-6',
    name: 'Coco Chanel No. 5',
    origin: 'Fort Kochi Aspinwall House',
    image_url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-03T13:10:00Z',
    scores: {
      volume: 82.0,
      spread: 89.0,
      symmetry: 88.4,
      wind_style: 80.5,
      overall: 85.1
    },
    rank: 6,
    awards: [],
    jury_comment: 'Haute-couture frond tailoring with minimalist silhouette. A timeless classic on the pageant runway.',
    frond_pixel_count: 34500,
    canopy_box: { x: 110, y: 100, width: 570, height: 380 },
    is_verified_cv: true
  }
];
