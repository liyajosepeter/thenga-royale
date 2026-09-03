import { Contestant, PageantAward, AwardType } from './types';

export const PAGEANT_AWARDS_DEF: Record<AwardType, PageantAward> = {
  mr_coconut_2026: {
    id: 'mr_coconut_2026',
    title: '👑 MR. COCONUT 2026',
    icon: '👑',
    color: 'gold',
    description: 'Supreme Pageant Champion — Highest Composite Hairstyle Index'
  },
  symmetry_king: {
    id: 'symmetry_king',
    title: '⚖️ SYMMETRY KING',
    icon: '⚖️',
    color: 'emerald',
    description: 'Highest Frond Bilateral Equilibrium & Geometric Centroid Alignment'
  },
  volume_king: {
    id: 'volume_king',
    title: '🌿 VOLUME KING',
    icon: '🌿',
    color: 'teal',
    description: 'Highest Foliage Density & Convex Hull Canopy Biomass'
  },
  spread_king: {
    id: 'spread_king',
    title: '↔️ SPREAD KING',
    icon: '↔️',
    color: 'cyan',
    description: 'Greatest Horizontal Frond Wingspan & Territorial Presence'
  },
  wind_king: {
    id: 'wind_king',
    title: '💨 WIND KING',
    icon: '💨',
    color: 'amber',
    description: 'Supreme Monsoonal Curvature & Aerodynamic Gradient Dispersion'
  }
};

export interface PageantAwardsResult {
  champion: Contestant | null;
  symmetryKing: Contestant | null;
  volumeKing: Contestant | null;
  spreadKing: Contestant | null;
  windKing: Contestant | null;
  allContestants: Contestant[];
}

/**
 * Deterministically calculates all pageant titles and category kings.
 * A single coconut can win both Mr. Coconut 2026 and any/all Category King titles.
 */
export function calculatePageantAwards(contestants: Contestant[]): PageantAwardsResult {
  if (!contestants || contestants.length === 0) {
    return {
      champion: null,
      symmetryKing: null,
      volumeKing: null,
      spreadKing: null,
      windKing: null,
      allContestants: []
    };
  }

  // Clone contestants to avoid side effects
  const cloned: Contestant[] = contestants.map((c) => ({
    ...c,
    awards: []
  }));

  // 1. Determine MR. COCONUT 2026 (Highest Overall Score with deterministic tie-breaker)
  const sortedByOverall = [...cloned].sort((a, b) => {
    if (b.scores.overall !== a.scores.overall) {
      return b.scores.overall - a.scores.overall;
    }
    if (b.scores.volume !== a.scores.volume) {
      return b.scores.volume - a.scores.volume;
    }
    if (b.scores.symmetry !== a.scores.symmetry) {
      return b.scores.symmetry - a.scores.symmetry;
    }
    if (b.scores.spread !== a.scores.spread) {
      return b.scores.spread - a.scores.spread;
    }
    if (b.scores.wind_style !== a.scores.wind_style) {
      return b.scores.wind_style - a.scores.wind_style;
    }
    return String(a.id || a.name).localeCompare(String(b.id || b.name));
  });

  // Assign ranks
  sortedByOverall.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  const champion = sortedByOverall[0];
  champion.awards = champion.awards || [];
  champion.awards.push(PAGEANT_AWARDS_DEF.mr_coconut_2026);

  // 2. Determine ⚖️ SYMMETRY KING (Highest Symmetry)
  const sortedBySymmetry = [...cloned].sort((a, b) => {
    if (b.scores.symmetry !== a.scores.symmetry) {
      return b.scores.symmetry - a.scores.symmetry;
    }
    if (b.scores.overall !== a.scores.overall) {
      return b.scores.overall - a.scores.overall;
    }
    return String(a.id || a.name).localeCompare(String(b.id || b.name));
  });
  const symmetryKing = sortedBySymmetry[0];
  symmetryKing.awards = symmetryKing.awards || [];
  if (!symmetryKing.awards.some(a => a.id === 'symmetry_king')) {
    symmetryKing.awards.push(PAGEANT_AWARDS_DEF.symmetry_king);
  }

  // 3. Determine 🌿 VOLUME KING (Highest Volume)
  const sortedByVolume = [...cloned].sort((a, b) => {
    if (b.scores.volume !== a.scores.volume) {
      return b.scores.volume - a.scores.volume;
    }
    if (b.scores.overall !== a.scores.overall) {
      return b.scores.overall - a.scores.overall;
    }
    return String(a.id || a.name).localeCompare(String(b.id || b.name));
  });
  const volumeKing = sortedByVolume[0];
  volumeKing.awards = volumeKing.awards || [];
  if (!volumeKing.awards.some(a => a.id === 'volume_king')) {
    volumeKing.awards.push(PAGEANT_AWARDS_DEF.volume_king);
  }

  // 4. Determine ↔️ SPREAD KING (Highest Spread)
  const sortedBySpread = [...cloned].sort((a, b) => {
    if (b.scores.spread !== a.scores.spread) {
      return b.scores.spread - a.scores.spread;
    }
    if (b.scores.overall !== a.scores.overall) {
      return b.scores.overall - a.scores.overall;
    }
    return String(a.id || a.name).localeCompare(String(b.id || b.name));
  });
  const spreadKing = sortedBySpread[0];
  spreadKing.awards = spreadKing.awards || [];
  if (!spreadKing.awards.some(a => a.id === 'spread_king')) {
    spreadKing.awards.push(PAGEANT_AWARDS_DEF.spread_king);
  }

  // 5. Determine 💨 WIND KING (Highest Wind Style)
  const sortedByWind = [...cloned].sort((a, b) => {
    if (b.scores.wind_style !== a.scores.wind_style) {
      return b.scores.wind_style - a.scores.wind_style;
    }
    if (b.scores.overall !== a.scores.overall) {
      return b.scores.overall - a.scores.overall;
    }
    return String(a.id || a.name).localeCompare(String(b.id || b.name));
  });
  const windKing = sortedByWind[0];
  windKing.awards = windKing.awards || [];
  if (!windKing.awards.some(a => a.id === 'wind_king')) {
    windKing.awards.push(PAGEANT_AWARDS_DEF.wind_king);
  }

  return {
    champion,
    symmetryKing,
    volumeKing,
    spreadKing,
    windKing,
    allContestants: sortedByOverall
  };
}
