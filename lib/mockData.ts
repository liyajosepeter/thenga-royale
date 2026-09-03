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
      overall: 94.62
    },
    rank: 1,
    hairstyle_title: 'THE COCONUT GENTLEMAN',
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
      overall: 91.83
    },
    rank: 2,
    hairstyle_title: 'THE FROND FASHION MODEL',
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
      overall: 85.60
    },
    rank: 3,
    hairstyle_title: 'THE CARTESIAN PERFECTIONIST',
    awards: [
      { id: 'symmetry_king', title: 'SYMMETRY KING', icon: '⚖️', color: 'emerald', description: 'Flawless Mathematical Frond Equilibrium' }
    ],
    jury_comment: 'With a 99.6% bilateral moment score, Professor Geometricus achieves mathematical symmetry that makes grown crystallographers weep.',
    frond_pixel_count: 36500,
    canopy_box: { x: 120, y: 80, width: 560, height: 460 },
    is_verified_cv: true
  },
  {
    id: 'contestant-4',
    name: 'Captain Monsoon',
    origin: 'Kovalam Lighthouse Ridge',
    image_url: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-02T16:45:00Z',
    scores: {
      volume: 78.0,
      spread: 85.0,
      symmetry: 68.0,
      wind_style: 99.2,
      overall: 81.49
    },
    rank: 4,
    hairstyle_title: 'THE MONSOONAL DRAMA MONARCH',
    awards: [
      { id: 'wind_king', title: 'WIND KING', icon: '💨', color: 'amber', description: 'Maximum Monsoonal Hairtoss & Aerodynamic Drama' }
    ],
    jury_comment: 'Captain Monsoon channels raw Arabian Sea gale-force wind vectors with breathtaking kinetic frond orientation.',
    frond_pixel_count: 31200,
    canopy_box: { x: 90, y: 120, width: 620, height: 380 },
    is_verified_cv: true
  },
  {
    id: 'contestant-5',
    name: 'Duke of Thiruvananthapuram',
    origin: 'Padmanabhaswamy Palace Gardens',
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-02T18:00:00Z',
    scores: {
      volume: 84.0,
      spread: 79.0,
      symmetry: 88.0,
      wind_style: 74.0,
      overall: 81.75
    },
    rank: 5,
    hairstyle_title: 'THE BILATERAL BARON',
    awards: [],
    jury_comment: 'A dignified sovereign contender presenting harmonious proportion and classic coastal royal comportment.',
    frond_pixel_count: 34100,
    canopy_box: { x: 100, y: 90, width: 600, height: 430 },
    is_verified_cv: true
  },
  {
    id: 'contestant-6',
    name: 'Baron Von Malabar',
    origin: 'Bekal Fort Outpost',
    image_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
    created_at: '2026-09-03T08:20:00Z',
    scores: {
      volume: 91.0,
      spread: 74.0,
      symmetry: 82.0,
      wind_style: 68.0,
      overall: 79.90
    },
    rank: 6,
    hairstyle_title: 'THE FOLIAGE FASHIONISTA',
    awards: [],
    jury_comment: 'Robust frond structure with thick, sun-drenched foliage capable of withstanding relentless coastal spray.',
    frond_pixel_count: 38900,
    canopy_box: { x: 110, y: 70, width: 580, height: 450 },
    is_verified_cv: true
  }
];
