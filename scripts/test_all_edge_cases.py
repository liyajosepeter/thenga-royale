import cv2
import numpy as np
import base64
import json
import urllib.request

def create_palm_image(w=400, h=400):
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[:] = (235, 206, 135) # Sand/Sky background
    # Fronds
    for angle in range(0, 360, 20):
        rad = np.radians(angle)
        end_x = int(w/2 + (w*0.35) * np.cos(rad))
        end_y = int(h*0.45 + (h*0.2) * np.sin(rad))
        cv2.line(img, (int(w/2), int(h*0.45)), (end_x, end_y), (34, 139, 34), 5)
        for t in range(1, 6):
            mx = int(w/2 + (end_x - w/2) * (t / 6.0))
            my = int(h*0.45 + (end_y - h*0.45) * (t / 6.0))
            cv2.line(img, (mx, my), (mx + 6, my - 6), (46, 160, 46), 2)
            cv2.line(img, (mx, my), (mx - 6, my + 6), (30, 120, 30), 2)
    _, buf = cv2.imencode('.jpg', img)
    return "data:image/jpeg;base64," + base64.b64encode(buf).decode('utf-8')

def create_car_image(w=400, h=400):
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[:] = (220, 220, 220) # Gray
    cv2.rectangle(img, (50, 180), (350, 280), (20, 20, 220), -1) # Red car
    cv2.circle(img, (110, 280), 30, (20, 20, 20), -1)
    cv2.circle(img, (290, 280), 30, (20, 20, 20), -1)
    _, buf = cv2.imencode('.jpg', img)
    return "data:image/jpeg;base64," + base64.b64encode(buf).decode('utf-8')

def create_face_image(w=400, h=400):
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[:] = (240, 240, 240)
    # Face skin tone
    cv2.ellipse(img, (200, 200), (90, 120), 0, 0, 360, (140, 180, 220), -1)
    cv2.circle(img, (165, 170), 12, (50, 50, 50), -1) # Eye
    cv2.circle(img, (235, 170), 12, (50, 50, 50), -1) # Eye
    _, buf = cv2.imencode('.jpg', img)
    return "data:image/jpeg;base64," + base64.b64encode(buf).decode('utf-8')

def post_json(endpoint, payload):
    req = urllib.request.Request(
        f"http://localhost:3000{endpoint}",
        data=json.dumps(payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.getcode(), json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def main():
    print("==================================================")
    print("[COCONUT VALIDATION] RUNNING FULL TEST MATRIX")
    print("==================================================")

    # 1. Test Valid Palm Candidate
    palm_b64 = create_palm_image()
    code, res = post_json('/api/validate', {"name": "Lord Frondington", "image_base64": palm_b64})
    print(f"\n[1] Valid Palm Test: Status={code}, Valid={res.get('valid')}, Confidence={res.get('confidence')}, Msg='{res.get('message')}'")
    assert res.get('valid') is True, "Expected valid palm to be true"

    # 2. Test Invalid Car Image
    car_b64 = create_car_image()
    code, res = post_json('/api/validate', {"name": "Red Sedan", "image_base64": car_b64})
    print(f"\n[2] Red Car Test: Status={code}, Valid={res.get('valid')}, Confidence={res.get('confidence')}, Msg='{res.get('message')}'")
    assert res.get('valid') is False, "Expected car to be rejected"

    # 3. Test Invalid Face Image
    face_b64 = create_face_image()
    code, res = post_json('/api/validate', {"name": "Human Portrait", "image_base64": face_b64})
    print(f"\n[3] Human Face Test: Status={code}, Valid={res.get('valid')}, Confidence={res.get('confidence')}, Msg='{res.get('message')}'")
    assert res.get('valid') is False, "Expected face to be rejected"

    # 4. Test Empty / Corrupted Image
    code, res = post_json('/api/validate', {"name": "Empty Image", "image_base64": "data:image/jpeg;base64,"})
    print(f"\n[4] Empty Image Test: Status={code}, Valid={res.get('valid')}, Confidence={res.get('confidence')}, Msg='{res.get('message')}'")
    assert res.get('valid') is False, "Expected empty image to be rejected"

    # 5. Test Batch with 2 Valid + 1 Invalid
    code, res = post_json('/api/validate', {
        "items": [
            {"id": "c1", "name": "Varkala Palm", "image_base64": palm_b64},
            {"id": "c2", "name": "Alappuzha Palm", "image_base64": palm_b64},
            {"id": "c3", "name": "Red Car", "image_base64": car_b64}
        ]
    })
    print(f"\n[5] Batch Mixed (2 Valid + 1 Invalid) Test: Status={code}, Count={res.get('count')}")
    results = res.get('results', [])
    for r in results:
        print(f"    - {r['name']}: Valid={r['valid']}, Confidence={r['confidence']}, Message='{r['message']}'")
    
    assert results[0]['valid'] is True, "Palm 1 should be valid"
    assert results[1]['valid'] is True, "Palm 2 should be valid"
    assert results[2]['valid'] is False, "Car should be rejected"

    # 6. Verify that valid candidates can proceed to /api/analyze and score correctly
    code, score_res = post_json('/api/analyze', {
        "name": "Lord Frondington",
        "image_base64": palm_b64
    })
    print(f"\n[6] Existing Scoring Verification for Valid Candidate: Status={code}, Overall Score={score_res.get('scores', {}).get('overall')}, Title='{score_res.get('hairstyle_title')}'")
    assert score_res.get('scores', {}).get('overall') > 0, "Expected valid overall score"

    print("\n==================================================")
    print("[PASS] ALL 6 VALIDATION & REGRESSION TESTS PASSED!")
    print("==================================================")

if __name__ == '__main__':
    main()
