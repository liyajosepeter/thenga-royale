"""
THENGA ROYALE 👑 - Python CV & Scoring Package
"""
from .image_analysis import analyze_coconut_image
from .scoring import calculate_overall_score, evaluate_contestants, generate_jury_critique, WEIGHTS

__all__ = [
    "analyze_coconut_image",
    "calculate_overall_score",
    "evaluate_contestants",
    "generate_jury_critique",
    "WEIGHTS"
]
