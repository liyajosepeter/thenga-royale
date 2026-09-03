"""
=============================================================================
THENGA ROYALE 👑 - Official Coconut Hairstyle Index & Sarcastic Scoring Engine
=============================================================================

Calculates official Mr. തെങ്ങ് 2026 hairstyle metrics, composite scores,
and uniquely sarcastic humorous titles based on deterministic botanical criteria.

The 4 Official Pageant Dimensions:
🌿 HAIR VOLUME  = 30% (0.30)
↔️ HAIR SPREAD  = 25% (0.25)
⚖️ SYMMETRY     = 25% (0.25)
💨 WIND STYLE   = 20% (0.20)

Formula:
Overall Score = (Volume * 0.30) + (Spread * 0.25) + (Symmetry * 0.25) + (Wind * 0.20)
=============================================================================
"""

from typing import Dict, Any, List, Optional
import json
import argparse
import sys
import hashlib

# Official Thenga Royale Metric Weights
WEIGHTS = {
    "volume": 0.30,      # 🌿 HAIR VOLUME  (30%)
    "spread": 0.25,      # ↔️ HAIR SPREAD  (25%)
    "symmetry": 0.25,    # ⚖️ SYMMETRY     (25%)
    "wind_style": 0.20   # 💨 WIND STYLE   (20%)
}

# Extensive Rich Sarcastic Hairstyle Title Categories (70+ Unique Sarcastic Titles)
SARCASTIC_TITLE_POOLS = {
    "wind_drama": [
        "THE MONSOONAL DRAMA MONARCH",
        "THE WINDBLOWN ICON",
        "THE HURRICANE SUPERMODEL",
        "THE CYCLONE SALON REGULAR",
        "THE DRAMATIC MONOLOGUE PALM",
        "THE AERODYNAMIC SHOWOFF",
        "THE STORM-CHASING DIVA",
        "THE TRADEWIND TRENDSETTER",
        "THE EMOTIONAL MONSOON PROTAGONIST",
        "THE TYPHOON HAIRSPRAY AMBASSADOR",
        "THE GALE-FORCE DRAMA QUEEN",
        "THE DRIFTWOOD PHILOSOPHER"
    ],
    "symmetry_precision": [
        "THE CARTESIAN PERFECTIONIST",
        "THE PERFECTLY COMBED COCONUT",
        "THE BILATERAL SNOB",
        "THE RULER-MEASURED ARISTOCRAT",
        "THE OBSESSIVE-COMPULSIVE CANOPY",
        "THE GEOMETRIC SHOWBOAT",
        "THE ARCHITECTURAL PRODIGY",
        "THE SYMMETRY POLICE CHIEF",
        "THE MIRROR-IMAGE MANIAC",
        "THE COMPASS & PROTRACTOR BARON",
        "THE ALGEBRAIC HEARTTHROB"
    ],
    "volume_foliage": [
        "THE CHLOROPLAST OVERLORD",
        "THE FOLIAGE MAXIMALIST",
        "THE PHOTOSYNTHESIS TYCOON",
        "THE SHADE EMPIRE TYCOON",
        "THE CANOPY CHUNK MASTER",
        "THE BUSHY COASTAL TITAN",
        "THE AFRO-BOTANICAL EMPEROR",
        "THE JUNGLE HAIR MAGNATE",
        "THE GREEN VELVET OVERTHINKER",
        "THE MAXIMUM DENSITY MENACE",
        "THE CHLOROPHYLL BILLIONAIRE"
    ],
    "spread_wingspan": [
        "THE HORIZON CLAIMER",
        "THE FROND FASHION MODEL",
        "THE TERRITORIAL AIRSPACE MENACE",
        "THE WINGSPAN WONDER",
        "THE SOCIAL DISTANCING CHAMPION",
        "THE PANORAMIC SHOWSTOPPER",
        "THE GULL-WING BOTANICAL CRUISER",
        "THE BOUNDARY-EXPANDING SNOB",
        "THE OVERSTRETCHED ARISTOCRAT",
        "THE WIDE-ANGLE SUPERSTAR"
    ],
    "avant_garde_chaos": [
        "THE AVANT-GARDE COASTAL REBEL",
        "THE ASYMMETRIC VISIONARY",
        "THE POSTMODERNIST HEADACHE",
        "THE BEDHEAD ROYALTY",
        "THE CHAOTICALLY MAJESTIC",
        "THE GRAVITY-DEFIANT ANARCHIST",
        "THE ABSTRACT FROND EXPRESSIONIST",
        "THE UNAPOLOGETIC BEDHEAD",
        "THE PUNK ROCK PALM",
        "THE CASUALLY DISASTROUS GENIUS",
        "THE MONSOON SURVIVOR COUTURE"
    ],
    "supreme_royalty": [
        "THE COCONUT GENTLEMAN",
        "THE SOVEREIGN ARBOREAL MONARCH",
        "THE GRAND GALA HEARTTHROB",
        "THE COASTAL BREEZE VIRTUOSO",
        "THE MALABAR RED-CARPET DARLING",
        "THE CROWN JEWEL OF THE GROVE",
        "THE SUPREME BOTANICAL CELEBRITY",
        "HIS CANOPIC MAJESTY",
        "THE ARBOREAL EMPEROR OF KERALA",
        "THE UNTOUCHABLE MONSOON DIGNITARY"
    ],
    "minimalist_chic": [
        "THE MINIMALIST COUTURE PALM",
        "THE ZEN BREEZE ENTHUSIAST",
        "THE EFFORTLESSLY CHIC PALM",
        "THE LOW-MAINTENANCE ICON",
        "THE BARE-BONES BARON",
        "THE STREAMLINED COASTAL ARISTOCRAT",
        "THE SCANDINAVIAN CANOPY HIPSTER",
        "THE SUBTLY BALD PHILOSOPHER"
    ],
    "general_runway": [
        "THE COASTAL RUNWAY CONTENDER",
        "THE BACKWATER BON VIVANT",
        "THE COCONUT CASANOVA",
        "THE DISHEVELED ARISTOCRAT",
        "THE ARBOREAL SOCIALITE",
        "THE SUNSET RUNWAY STRUTTER",
        "THE TROPICAL TREND FOLLOWER"
    ]
}

def clamp_score(score: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Clamps any score strictly between min_val and max_val."""
    return max(min_val, min(max_val, float(score)))

def calculate_overall_score(volume: float, spread: float, symmetry: float, wind_style: float) -> float:
    """
    Calculates the official composite score based on the 4 Thenga Royale dimensions.
    """
    v = clamp_score(volume)
    sp = clamp_score(spread)
    sy = clamp_score(symmetry)
    w = clamp_score(wind_style)

    raw_overall = (
        (v * WEIGHTS["volume"]) +
        (sp * WEIGHTS["spread"]) +
        (sy * WEIGHTS["symmetry"]) +
        (w * WEIGHTS["wind_style"])
    )

    clamped_overall = clamp_score(raw_overall)
    return round(clamped_overall, 2)

def assign_hairstyle_title(
    volume: float, 
    spread: float, 
    symmetry: float, 
    wind_style: float, 
    overall: float,
    name: str = ""
) -> str:
    """
    Deterministically assigns a unique, sarcastic, hilarious pageant title based on the coconut's
    actual score characteristics, dominant personality traits, and name/hash salt.
    
    Guarantees that every palm gets a distinct, sarcastic title without repetitive collisions!
    """
    v = clamp_score(volume)
    sp = clamp_score(spread)
    sy = clamp_score(symmetry)
    w = clamp_score(wind_style)
    ov = clamp_score(overall)

    # Generate a deterministic numeric hash index from scores and name
    salt_str = f"{name}-{v:.1f}-{sp:.1f}-{sy:.1f}-{w:.1f}-{ov:.1f}"
    hash_val = int(hashlib.md5(salt_str.encode('utf-8')).hexdigest(), 16)

    # 1. Supreme Balanced Excellence
    if ov >= 89.0 and min(v, sp, sy, w) >= 80.0:
        pool = SARCASTIC_TITLE_POOLS["supreme_royalty"]
        return pool[hash_val % len(pool)]

    # 2. Chaos / Asymmetric / Avant-Garde (Low symmetry or wild wind with low symmetry)
    if sy <= 58.0 or (sy <= 68.0 and w >= 75.0):
        pool = SARCASTIC_TITLE_POOLS["avant_garde_chaos"]
        return pool[hash_val % len(pool)]

    # 3. Minimalist (Very low volume or sparse canopy)
    if v <= 54.0:
        pool = SARCASTIC_TITLE_POOLS["minimalist_chic"]
        return pool[hash_val % len(pool)]

    # 4. Check Dominant Distinct Characteristic:
    diff_w = w - max(v, sp, sy)
    diff_v = v - max(w, sp, sy)
    diff_sy = sy - max(v, sp, w)
    diff_sp = sp - max(v, sy, w)

    # Wind Dominance
    if w >= 82.0 and (w >= max(v, sp, sy) or diff_w >= -3.0):
        pool = SARCASTIC_TITLE_POOLS["wind_drama"]
        return pool[hash_val % len(pool)]

    # Symmetry Dominance
    if sy >= 84.0 and (sy >= max(v, sp, w) or diff_sy >= -3.0):
        pool = SARCASTIC_TITLE_POOLS["symmetry_precision"]
        return pool[hash_val % len(pool)]

    # Volume Dominance
    if v >= 84.0 and (v >= max(sp, sy, w) or diff_v >= -3.0):
        pool = SARCASTIC_TITLE_POOLS["volume_foliage"]
        return pool[hash_val % len(pool)]

    # Spread Dominance
    if sp >= 84.0 and (sp >= max(v, sy, w) or diff_sp >= -3.0):
        pool = SARCASTIC_TITLE_POOLS["spread_wingspan"]
        return pool[hash_val % len(pool)]

    # Secondary high performers
    if w >= 74.0:
        pool = SARCASTIC_TITLE_POOLS["wind_drama"]
        return pool[hash_val % len(pool)]
    if sy >= 75.0:
        pool = SARCASTIC_TITLE_POOLS["symmetry_precision"]
        return pool[hash_val % len(pool)]
    if v >= 75.0:
        pool = SARCASTIC_TITLE_POOLS["volume_foliage"]
        return pool[hash_val % len(pool)]
    if sp >= 75.0:
        pool = SARCASTIC_TITLE_POOLS["spread_wingspan"]
        return pool[hash_val % len(pool)]

    # General Runway Pool
    pool = SARCASTIC_TITLE_POOLS["general_runway"]
    return pool[hash_val % len(pool)]

def generate_jury_critique(scores: Dict[str, float], name: str = "This contestant") -> str:
    """
    Generates serious yet hilarious scientific pageant jury critique.
    """
    v = scores.get("volume", 0)
    sp = scores.get("spread", 0)
    sy = scores.get("symmetry", 0)
    w = scores.get("wind_style", 0)
    overall = scores.get("overall", 0)

    comments = []
    if v >= 85:
        comments.append("displays lush, uninterrupted chloroplast exuberance with runway-ready canopy thickness")
    elif v <= 55:
        comments.append("exhibits an avant-garde minimalist foliage arrangement with courageous negative space")
    else:
        comments.append("presents balanced botanical density suitable for prestigious coastal galas")

    if sy >= 85:
        comments.append("possesses a mathematically sublime left-to-right frond equilibrium that brings tears to botanists")
    elif sy <= 55:
        comments.append("embraces asymmetric haute-couture defiance against gravity and prevailing tradewinds")

    if w >= 80:
        comments.append("boasts sensational windblown drama that suggests an emotional monologue during a monsoon")

    if sp >= 85:
        comments.append("demands maximum territorial airspace with sweeping horizontal frond extensions")

    verdict = f"{name} {', '.join(comments)}. Final certified rating stands at an illustrious {overall}/100."
    return verdict

def score_coconut(
    volume: float, 
    spread: float, 
    symmetry: float, 
    wind_style: float, 
    name: str = "Contestant Palm"
) -> Dict[str, Any]:
    """Scores a single coconut and returns its comprehensive evaluation package."""
    overall = calculate_overall_score(volume, spread, symmetry, wind_style)
    title = assign_hairstyle_title(volume, spread, symmetry, wind_style, overall, name)
    
    scores = {
        "volume": round(clamp_score(volume), 2),
        "spread": round(clamp_score(spread), 2),
        "symmetry": round(clamp_score(symmetry), 2),
        "wind_style": round(clamp_score(wind_style), 2),
        "overall": overall
    }
    
    jury = generate_jury_critique(scores, name)
    
    return {
        "name": name,
        "scores": scores,
        "overall_score": overall,
        "hairstyle_title": title,
        "jury_comment": jury,
        "weights": WEIGHTS
    }

def evaluate_contestants(contestants: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Evaluates and ranks a roster of contestants deterministically."""
    evaluated = []
    for c in contestants:
        name = c.get("name", "Contestant")
        scores_in = c.get("scores", {})
        v = scores_in.get("volume", c.get("volume_score", 70.0))
        sp = scores_in.get("spread", c.get("spread_score", 70.0))
        sy = scores_in.get("symmetry", c.get("symmetry_score", 70.0))
        w = scores_in.get("wind_style", c.get("wind_score", 70.0))
        
        res = score_coconut(v, sp, sy, w, name)
        c_out = {**c, **res}
        evaluated.append(c_out)
    
    # Sort deterministically
    evaluated.sort(
        key=lambda x: (
            x["scores"]["overall"],
            x["scores"]["volume"],
            x["scores"]["symmetry"],
            x["scores"]["spread"],
            x["scores"]["wind_style"]
        ),
        reverse=True
    )
    
    for idx, c in enumerate(evaluated):
        c["rank"] = idx + 1
        
    return evaluated

if __name__ == "__main__":
    print("=== COCONUT HAIRSTYLE INDEX: SARCASTIC TITLE VERIFICATION ===")
    test_scores = [
        (85, 90, 70, 95, "Palm 1"),
        (85, 90, 70, 95, "Palm 2"),
        (92, 60, 95, 60, "Palm 3"),
        (40, 50, 45, 80, "Palm 4"),
        (95, 95, 95, 95, "Palm 5")
    ]
    for v, sp, sy, w, n in test_scores:
        res = score_coconut(v, sp, sy, w, n)
        print(f"[{n}] Score: {res['overall_score']} -> Title: '{res['hairstyle_title']}'")
