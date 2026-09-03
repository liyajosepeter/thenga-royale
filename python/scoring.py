"""
THENGA ROYALE 👑 - Scoring & Pageant Award Engine
Calculates official Mr. Coconut 2026 hairstyle metrics and special pageant crowns.
"""

from typing import Dict, Any, List, Optional

# Official Thenga Royale Metric Weights
WEIGHTS = {
    "volume": 0.30,      # 🌿 HAIR VOLUME  (30%)
    "spread": 0.25,      # ↔️ HAIR SPREAD  (25%)
    "symmetry": 0.25,    # ⚖️ SYMMETRY     (25%)
    "wind_style": 0.20   # 💨 WIND STYLE   (20%)
}

def calculate_overall_score(volume: float, spread: float, symmetry: float, wind_style: float) -> float:
    """
    Calculate the official composite score based on the 4 Thenga Royale dimensions:
    Overall Score = Volume * 0.30 + Spread * 0.25 + Symmetry * 0.25 + Wind Style * 0.20
    """
    raw_score = (
        (volume * WEIGHTS["volume"]) +
        (spread * WEIGHTS["spread"]) +
        (symmetry * WEIGHTS["symmetry"]) +
        (wind_style * WEIGHTS["wind_style"])
    )
    return round(float(raw_score), 2)

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

    verdict = f"{name} {', '.join(comments)}. Final jury rating stands at an illustrious {overall}/100."
    return verdict

def evaluate_contestants(contestants: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Takes a list of contestant score dictionaries, assigns ranks and awards:
    - 👑 MR. COCONUT 2026 (Highest Overall Score)
    - ⚖️ SYMMETRY KING
    - 🌿 VOLUME KING
    - ↔️ SPREAD KING
    - 💨 WIND KING
    """
    if not contestants:
        return []

    # Calculate overall scores if not already set
    for c in contestants:
        scores = c.get("scores", {})
        if "overall" not in scores or scores["overall"] == 0:
            scores["overall"] = calculate_overall_score(
                scores.get("volume", 0),
                scores.get("spread", 0),
                scores.get("symmetry", 0),
                scores.get("wind_style", 0)
            )
            c["scores"] = scores
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
