"""
=============================================================================
THENGA ROYALE 🌴 - Coconut & Palm Tree Image Eligibility Validator
=============================================================================

Authors: Thenga Royale Research Team
Core Technology: Python 3.13, OpenCV (cv2), NumPy

Purpose:
Lightweight computer-vision pre-validation module that verifies whether
an uploaded image contains a recognizable coconut palm crown / frond candidate
before admitting the candidate into the pageant hairstyle scoring pipeline.

Validation Criteria:
1. Foliage Color Spectrum (HSV Green & Sunlit Frond Masking)
2. Frond Leaflet Texture & Edge Density (Pinnate leaf structure vs smooth blobs)
3. Radial Canopy Geometry & Contour Complexity (Branching fronds vs plain shapes)
4. Non-Palm / Human / Artificial penalty checks

Returns:
- valid: bool (True if confidence >= THRESHOLD)
- confidence: float (Real deterministic confidence score between 0.00 and 1.00)
- message: str (Humorous and professional feedback)
- details: dict (Component breakdown for debugging)
=============================================================================
"""

import cv2
import numpy as np
import base64
import json
import os
import sys
import argparse
import urllib.request
from typing import Union, Dict, Any

# Decision threshold: 0.45 (balanced to accept crown-only, full tree, and distant palms,
# while rejecting faces, cars, food, animals, buildings, and random objects)
VALIDATION_THRESHOLD = 0.45

REJECTION_REASONS = [
    "This candidate does not appear sufficiently coconut.",
    "Nice image. Wrong competition.",
    "No recognizable palm crown or foliage structure detected.",
    "The Jury requires arboreal fronds, not non-palm objects.",
    "Ineligible candidate: lacking certified coconut canopy architecture."
]


def load_image_bytes(image_input: Union[str, bytes, np.ndarray]) -> np.ndarray:
    """Safely decodes image into an OpenCV BGR numpy array."""
    if isinstance(image_input, np.ndarray):
        return image_input

    if isinstance(image_input, (bytes, bytearray)):
        if len(image_input) == 0:
            return None
        nparr = np.frombuffer(image_input, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if isinstance(image_input, str):
        # Base64 Data URI
        if "base64," in image_input or image_input.startswith("data:"):
            try:
                b64_str = image_input.split("base64,")[-1].strip()
                img_bytes = base64.b64decode(b64_str)
                nparr = np.frombuffer(img_bytes, np.uint8)
                return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception:
                return None

        # URL
        if image_input.startswith("http://") or image_input.startswith("https://"):
            try:
                req = urllib.request.Request(
                    image_input,
                    headers={"User-Agent": "Mozilla/5.0 ThengaRoyale/1.0"}
                )
                with urllib.request.urlopen(req, timeout=5) as resp:
                    nparr = np.frombuffer(resp.read(), np.uint8)
                    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception:
                return None

        # Local File Path
        if os.path.exists(image_input):
            return cv2.imread(image_input, cv2.IMREAD_COLOR)

        # Raw Base64 string without data prefix
        if len(image_input) > 100:
            try:
                img_bytes = base64.b64decode(image_input.strip())
                nparr = np.frombuffer(img_bytes, np.uint8)
                return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception:
                return None

    return None


def validate_coconut_candidate(
    image_input: Union[str, bytes, np.ndarray],
    threshold: float = VALIDATION_THRESHOLD
) -> Dict[str, Any]:
    """
    Evaluates an image for coconut palm eligibility.
    Computes real feature metrics and a normalized confidence score (0.00 - 1.00).
    """
    # 1. Image Decode & Sanity Check
    img = load_image_bytes(image_input)
    if img is None or img.size == 0 or img.shape[0] < 10 or img.shape[1] < 10:
        return {
            "valid": False,
            "confidence": 0.0,
            "message": "Candidate rejected. Corrupted or unreadable image file.",
            "reason": "Invalid or unreadable image",
            "details": {
                "foliage_score": 0.0,
                "texture_score": 0.0,
                "geometry_score": 0.0,
                "threshold": threshold
            }
        }

    orig_h, orig_w = img.shape[:2]

    # Resize to standard analysis resolution (max 600px) for consistent calibration
    max_dim = 600
    if max(orig_h, orig_w) > max_dim:
        scale = max_dim / float(max(orig_h, orig_w))
        img = cv2.resize(img, (int(orig_w * scale), int(orig_h * scale)), interpolation=cv2.INTER_AREA)

    h, w = img.shape[:2]
    total_pixels = float(h * w)

    # 2. Color Space & Foliage Segmentation
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)

    # Skin tone detection in YCrCb (Human faces / bodies)
    lower_skin = np.array([0, 133, 77], dtype=np.uint8)
    upper_skin = np.array([255, 173, 127], dtype=np.uint8)
    skin_mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
    skin_pixels = int(cv2.countNonZero(skin_mask))
    skin_ratio = skin_pixels / total_pixels

    # Lush tropical green fronds (Hue 25 to 88, saturation >= 30, value >= 25)
    lower_green = np.array([25, 30, 25], dtype=np.uint8)
    upper_green = np.array([88, 255, 255], dtype=np.uint8)
    mask_green = cv2.inRange(hsv, lower_green, upper_green)
    green_pixels = int(cv2.countNonZero(mask_green))

    # Sunlit/coastal gold-olive fronds (Hue 12 to 24) - strictly excluding human skin
    lower_gold = np.array([12, 45, 40], dtype=np.uint8)
    upper_gold = np.array([24, 255, 220], dtype=np.uint8)
    mask_gold = cv2.inRange(hsv, lower_gold, upper_gold)
    # Remove any skin tone overlap from the gold mask
    mask_gold = cv2.bitwise_and(mask_gold, cv2.bitwise_not(skin_mask))

    # Combined foliage mask (Strictly non-human vegetation)
    foliage_mask = cv2.bitwise_or(mask_green, mask_gold)
    foliage_mask = cv2.bitwise_and(foliage_mask, cv2.bitwise_not(skin_mask))
    foliage_pixels = int(cv2.countNonZero(foliage_mask))
    foliage_ratio = foliage_pixels / total_pixels
    green_ratio = green_pixels / total_pixels

    # Foliage score: reaches 1.0 when foliage covers >= 10% of frame
    foliage_score = min(1.0, foliage_ratio / 0.10)

    # If almost zero genuine green foliage is detected (< 1.2%), heavily reduce foliage score
    if green_ratio < 0.012:
        foliage_score = foliage_score * 0.15

    # 3. Frond Leaflet Texture & Pinnate Edge Density (Canny Edge Detection)
    # Palm fronds have intricate pinnate leaf segments producing high edge density in foliage
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 40, 130)
    foliage_edges = cv2.bitwise_and(edges, edges, mask=foliage_mask)
    edge_pixel_count = int(cv2.countNonZero(foliage_edges))

    if foliage_pixels > 0:
        edge_density_in_foliage = edge_pixel_count / float(foliage_pixels)
        # Natural palm fronds have edge density ~0.12 to 0.45; smooth non-plants have < 0.05
        texture_score = min(1.0, edge_density_in_foliage / 0.16)
    else:
        texture_score = 0.0

    # 4. Canopy Geometry & Contour Complexity
    contours, _ = cv2.findContours(foliage_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    geometry_score = 0.0
    if contours and foliage_pixels > 150:
        # Find largest foliage clusters
        sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True)
        main_contour = sorted_contours[0]
        c_area = cv2.contourArea(main_contour)
        c_perimeter = cv2.arcLength(main_contour, True)

        if c_area > 0 and c_perimeter > 0:
            # Palm crowns have high perimeter-to-area complexity (frond branching)
            compactness = (4.0 * np.pi * c_area) / (c_perimeter * c_perimeter)
            branching_factor = max(0.0, min(1.0, 1.0 - (compactness * 2.5)))

            # Bounding box & aspect
            bx, by, bw, bh = cv2.boundingRect(main_contour)
            span_ratio = bw / float(w)
            
            # Crown canopy tends to spread horizontally or diagonally
            geometry_score = (branching_factor * 0.5) + (min(1.0, span_ratio / 0.25) * 0.5)

    # 5. Non-Palm Penalties
    penalty = 0.0
    # Penalty if skin dominates
    if skin_ratio > 0.08:
        penalty += min(0.6, skin_ratio * 1.2)

    # Penalty if image is essentially monochromatic or gray (e.g. document/car/wall)
    sat_mean = np.mean(hsv[:, :, 1]) / 255.0
    if sat_mean < 0.12 and foliage_ratio < 0.05:
        penalty += 0.35
    if sat_mean < 0.10 and foliage_ratio < 0.05:
        penalty += 0.3

    # 6. Composite Confidence Calculation
    # Weights: Foliage 45%, Texture 30%, Geometry 25%
    raw_confidence = (
        (foliage_score * 0.45) +
        (texture_score * 0.30) +
        (geometry_score * 0.25)
    ) - penalty

    confidence = float(max(0.01, min(0.99, round(raw_confidence, 2))))

    is_valid = confidence >= threshold

    # Select appropriate response message
    if is_valid:
        message = "Coconut candidate verified."
    else:
        # Deterministically select a polite humorous reason
        hash_val = int(orig_w * 31 + orig_h * 17 + foliage_pixels) % len(REJECTION_REASONS)
        message = f"Candidate rejected. {REJECTION_REASONS[hash_val]}"

    return {
        "valid": is_valid,
        "confidence": confidence,
        "message": message,
        "details": {
            "foliage_score": round(foliage_score, 2),
            "texture_score": round(texture_score, 2),
            "geometry_score": round(geometry_score, 2),
            "foliage_ratio": round(foliage_ratio, 3),
            "threshold": threshold,
            "image_dimensions": {"width": orig_w, "height": orig_h}
        }
    }


def main():
    """CLI execution for testing and piping."""
    parser = argparse.ArgumentParser(description="THENGA ROYALE 🌴 - Coconut Candidate Validator")
    parser.add_argument("--image", type=str, help="Path or base64 to image")
    parser.add_argument("--stdin", action="store_true", help="Read payload from stdin")
    parser.add_argument("--test", action="store_true", help="Run test suite")

    args = parser.parse_args()

    if args.test:
        print("=== RUNNING COCONUT ELIGIBILITY VALIDATOR TESTS ===")
        # 1. Valid Palm Canvas (Green elliptical crown with frond texture)
        valid_palm = np.zeros((400, 400, 3), dtype=np.uint8)
        # Sky background
        valid_palm[:] = (235, 206, 135)
        # Green fronds
        for angle in range(0, 360, 30):
            rad = np.radians(angle)
            end_x = int(200 + 120 * np.cos(rad))
            end_y = int(200 + 80 * np.sin(rad))
            cv2.line(valid_palm, (200, 200), (end_x, end_y), (34, 139, 34), 6)
            # Add leaflets
            for t in range(5):
                cv2.line(valid_palm, (int(200 + end_x * 0.5), int(200 + end_y * 0.5)),
                         (int(200 + end_x * 0.5 + 10), int(200 + end_y * 0.5 - 10)), (46, 160, 46), 2)

        res_valid = validate_coconut_candidate(valid_palm)
        print(f"Valid Palm Test: Valid={res_valid['valid']}, Confidence={res_valid['confidence']}, Msg={res_valid['message']}")

        # 2. Invalid Non-Palm Canvas (Blank White / Red Car / Face-like)
        invalid_canvas = np.zeros((400, 400, 3), dtype=np.uint8)
        invalid_canvas[:] = (50, 50, 200) # Solid red
        cv2.circle(invalid_canvas, (200, 200), 100, (200, 200, 200), -1) # Gray circle

        res_invalid = validate_coconut_candidate(invalid_canvas)
        print(f"Invalid Non-Palm Test: Valid={res_invalid['valid']}, Confidence={res_invalid['confidence']}, Msg={res_invalid['message']}")

        assert res_valid["valid"] is True, "FAIL: Realistic palm must pass validation!"
        assert res_invalid["valid"] is False, "FAIL: Red canvas with gray circle must be rejected!"
        print("[OK] ALL VALIDATOR TESTS PASSED!")
        return

    if args.stdin:
        input_data = sys.stdin.read().strip()
        try:
            parsed = json.loads(input_data)
            img_payload = parsed.get("image", parsed.get("image_base64", input_data))
        except Exception:
            img_payload = input_data

        result = validate_coconut_candidate(img_payload)
        print(json.dumps(result, indent=2))
        return

    if args.image:
        result = validate_coconut_candidate(args.image)
        print(json.dumps(result, indent=2))
        return

    print("Usage: python coconut_validator.py [--image <path> | --stdin | --test]")


if __name__ == "__main__":
    main()
