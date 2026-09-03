"""
=============================================================================
THENGA ROYALE 👑 - Official Coconut Hairstyle Index & Scoring Engine
=============================================================================

Calculates official Mr. Coconut 2026 hairstyle metrics, composite scores,
and intelligent humorous titles based on deterministic botanical criteria.

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

# Official Thenga Royale Metric Weights
WEIGHTS = {
    "volume": 0.30,      # 🌿 HAIR VOLUME  (30%)
    "spread": 0.25,      # ↔️ HAIR SPREAD  (25%)
    "symmetry": 0.25,    # ⚖️ SYMMETRY     (25%)
    "wind_style": 0.20   # 💨 WIND STYLE   (20%)
}

def clamp_score(score: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Clamps any score strictly between min_val and max_val."""
    return max(min_val, min(max_val, float(score)))

def calculate_overall_score(volume: float, spread: float, symmetry: float, wind_style: float) -> float:
    """
    Calculates the official composite score based on the 4 Thenga Royale dimensions.
    Guarantees deterministic output rounded to exactly two decimal places, clamped between 0 and 100.
    
    Formula:
    overall_score = (volume_score * 0.30) + (spread_score * 0.25) + (symmetry_score * 0.25) + (wind_score * 0.20)
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

def assign_hairstyle_title(volume: float, spread: float, symmetry: float, wind_style: float, overall: float) -> str:
    """
    Deterministically assigns intelligent, humorous pageant titles based on the coconut's
    actual score characteristics and standout distribution.
    
    No random assignment: the title reflects the true geometric personality of the palm.
    """
    v = clamp_score(volume)
    sp = clamp_score(spread)
    sy = clamp_score(symmetry)
    w = clamp_score(wind_style)
    ov = clamp_score(overall)

    # 1. Balanced Supreme Excellence
    if ov >= 92.0 and min(v, sp, sy, w) >= 85.0:
        return "THE COCONUT GENTLEMAN"

    if ov >= 88.0 and sy >= 90.0 and v >= 88.0:
        return "THE SOVEREIGN ARBOREAL MONARCH"

    # 2. Extreme Characteristic Specializations
    # Wind Dominance
    if w >= 93.0 or (w >= 85.0 and w > max(v, sp, sy) + 5.0):
        if w >= 96.0:
            return "THE MONSOONAL DRAMA MONARCH"
        return "THE WINDBLOWN ICON"

    # Volume Dominance
    if v >= 93.0 or (v >= 85.0 and v > max(sp, sy, w) + 5.0):
        if v >= 96.0:
            return "THE CHLOROPLAST OVERLORD"
        return "THE FOLIAGE FASHIONISTA"

    # Symmetry Dominance
    if sy >= 93.0 or (sy >= 86.0 and sy > max(v, sp, w) + 5.0):
        if sy >= 97.0:
            return "THE CARTESIAN PERFECTIONIST"
        return "THE PERFECTLY COMBED COCONUT"

    # Spread Dominance
    if sp >= 93.0 or (sp >= 85.0 and sp > max(v, sy, w) + 5.0):
        if sp >= 96.0:
            return "THE HORIZON CLAIMER"
        return "THE FROND FASHION MODEL"

    # 3. High Performing Balanced Pageant Contenders
    if ov >= 82.0:
        if sy >= 85.0:
            return "THE BILATERAL BARON"
        if w >= 80.0:
            return "THE COASTAL BREEZE VIRTUOSO"
        return "THE GRAND GALA CHAMPION"

    # 4. Asymmetric / Avant-Garde Stylings
    if sy <= 55.0 and w >= 75.0:
        return "THE AVANT-GARDE COASTAL REBEL"

    if sy <= 58.0:
        return "THE ASYMMETRIC VISIONARY"

    # 5. Minimalist Foliage
    if v <= 55.0:
        return "THE MINIMALIST COUTURE PALM"

    # 6. Default Runway Contender
    return "THE COASTAL RUNWAY CONTENDER"

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
    """
    Evaluates a single coconut tree independently and returns official metrics,
    overall score, and intelligent title.
    """
    v = clamp_score(volume)
    sp = clamp_score(spread)
    sy = clamp_score(symmetry)
    w = clamp_score(wind_style)
    overall = calculate_overall_score(v, sp, sy, w)
    title = assign_hairstyle_title(v, sp, sy, w, overall)

    scores_dict = {
        "volume": v,
        "spread": sp,
        "symmetry": sy,
        "wind_style": w,
        "overall": overall
    }

    jury_comment = generate_jury_critique(scores_dict, name)

    return {
        "contestant_name": name,
        "volume_score": v,
        "spread_score": sp,
        "symmetry_score": sy,
        "wind_score": w,
        "overall_score": overall,
        "hairstyle_title": title,
        "scores": scores_dict,
        "jury_comment": jury_comment
    }

def evaluate_contestants(contestants: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Takes a list of contestant score dictionaries, assigns ranks, titles, and special awards.
    """
    if not contestants:
        return []

    for c in contestants:
        scores = c.get("scores", {})
        v = scores.get("volume", 0)
        sp = scores.get("spread", 0)
        sy = scores.get("symmetry", 0)
        w = scores.get("wind_style", 0)
        
        overall = calculate_overall_score(v, sp, sy, w)
        scores["overall"] = overall
        c["scores"] = scores
        
        title = assign_hairstyle_title(v, sp, sy, w, overall)
        c["hairstyle_title"] = title
        
        if not c.get("jury_comment"):
            c["jury_comment"] = generate_jury_critique(scores, c.get("name", "Contestant"))

    # Sort descending by overall score
    sorted_contestants = sorted(contestants, key=lambda x: x["scores"]["overall"], reverse=True)

    # Determine Award Kings
    max_volume = max(contestants, key=lambda x: x["scores"]["volume"])
    max_spread = max(contestants, key=lambda x: x["scores"]["spread"])
    max_symmetry = max(contestants, key=lambda x: x["scores"]["symmetry"])
    max_wind = max(contestants, key=lambda x: x["scores"]["wind_style"])
    mr_coconut = sorted_contestants[0]

    for rank, c in enumerate(sorted_contestants, start=1):
        c["rank"] = rank
        awards = []
        if c.get("id") == mr_coconut.get("id"):
            awards.append({"id": "mr_coconut_2026", "title": "MR. COCONUT 2026", "icon": "👑", "color": "gold"})
        if c.get("id") == max_symmetry.get("id"):
            awards.append({"id": "symmetry_king", "title": "SYMMETRY KING", "icon": "⚖️", "color": "emerald"})
        if c.get("id") == max_volume.get("id"):
            awards.append({"id": "volume_king", "title": "VOLUME KING", "icon": "🌿", "color": "teal"})
        if c.get("id") == max_spread.get("id"):
            awards.append({"id": "spread_king", "title": "SPREAD KING", "icon": "↔️", "color": "cyan"})
        if c.get("id") == max_wind.get("id"):
            awards.append({"id": "wind_king", "title": "WIND KING", "icon": "💨", "color": "amber"})
        
        c["awards"] = awards

    return sorted_contestants

def run_unit_tests():
    """Deterministic Unit Tests for the Coconut Hairstyle Index."""
    print("=== RUNNING COCONUT HAIRSTYLE INDEX UNIT TEST SUITE ===")

    # Test 1: All Zeroes
    s0 = calculate_overall_score(0, 0, 0, 0)
    assert s0 == 0.0, f"Expected 0.0, got {s0}"
    print(f"Test 1 [Zeroes]: (0, 0, 0, 0) -> {s0} [OK]")

    # Test 2: All 100s
    s100 = calculate_overall_score(100, 100, 100, 100)
    assert s100 == 100.0, f"Expected 100.0, got {s100}"
    print(f"Test 2 [Max 100s]: (100, 100, 100, 100) -> {s100} [OK]")

    # Test 3: Mixed Known Values (80*0.3 + 90*0.25 + 70*0.25 + 60*0.20 = 24 + 22.5 + 17.5 + 12 = 76.00)
    s_mix = calculate_overall_score(80, 90, 70, 60)
    assert s_mix == 76.0, f"Expected 76.00, got {s_mix}"
    print(f"Test 3 [Mixed]: (80, 90, 70, 60) -> {s_mix} [OK]")

    # Test 4: Decimals (94.6*0.30 + 94.2*0.25 + 95.8*0.25 + 91.0*0.20 = 28.38 + 23.55 + 23.95 + 18.20 = 94.08)
    s_dec = calculate_overall_score(94.6, 94.2, 95.8, 91.0)
    assert s_dec == 94.08, f"Expected 94.08, got {s_dec}"
    print(f"Test 4 [Decimals]: (94.6, 94.2, 95.8, 91.0) -> {s_dec} [OK]")

    # Test 5: Out of Bounds Clamping (-20 and 150)
    s_clamp = calculate_overall_score(-20, 150, 50, 50)
    # (0*0.30 + 100*0.25 + 50*0.25 + 50*0.20 = 0 + 25 + 12.5 + 10 = 47.50)
    assert s_clamp == 47.5, f"Expected 47.5, got {s_clamp}"
    print(f"Test 5 [Clamping]: (-20, 150, 50, 50) -> {s_clamp} [OK]")

    # Test 6: Intelligent Title Assignment Verification
    t_wind = assign_hairstyle_title(70, 70, 70, 95, 75.0)
    assert t_wind in ["THE WINDBLOWN ICON", "THE MONSOONAL DRAMA MONARCH"], f"Got {t_wind}"
    print(f"Test 6a [Wind Title]: {t_wind} [OK]")

    t_sym = assign_hairstyle_title(70, 70, 98, 70, 75.0)
    assert t_sym in ["THE PERFECTLY COMBED COCONUT", "THE CARTESIAN PERFECTIONIST"], f"Got {t_sym}"
    print(f"Test 6b [Symmetry Title]: {t_sym} [OK]")

    t_vol = assign_hairstyle_title(97, 70, 70, 70, 78.0)
    assert t_vol in ["THE FOLIAGE FASHIONISTA", "THE CHLOROPLAST OVERLORD"], f"Got {t_vol}"
    print(f"Test 6c [Volume Title]: {t_vol} [OK]")

    t_gentleman = assign_hairstyle_title(95, 92, 94, 90, 93.0)
    assert t_gentleman == "THE COCONUT GENTLEMAN", f"Got {t_gentleman}"
    print(f"Test 6d [Gentleman Title]: {t_gentleman} [OK]")

    print("\n[OK] ALL COCONUT HAIRSTYLE INDEX TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="THENGA ROYALE 👑 - Hairstyle Index Engine")
    parser.add_argument("--test", action="store_true", help="Run scoring unit tests")
    parser.add_argument("--volume", type=float, default=80.0)
    parser.add_argument("--spread", type=float, default=80.0)
    parser.add_argument("--symmetry", type=float, default=80.0)
    parser.add_argument("--wind", type=float, default=80.0)
    parser.add_argument("--name", type=str, default="Contestant Palm")

    args = parser.parse_args()

    if args.test:
        run_unit_tests()
    else:
        res = score_coconut(args.volume, args.spread, args.symmetry, args.wind, args.name)
        print(json.dumps(res, indent=2))
