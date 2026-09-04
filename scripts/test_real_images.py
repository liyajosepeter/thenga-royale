import cv2
import numpy as np
import base64
import json
import urllib.request

# 1. Create a Realistic Coconut Palm Image (JPEG)
palm_img = np.zeros((400, 400, 3), dtype=np.uint8)
palm_img[:] = (235, 206, 135) # Sky blue/sand background
# Trunk
cv2.line(palm_img, (200, 380), (200, 180), (42, 60, 100), 14)
# Fronds
for angle in range(0, 360, 25):
    rad = np.radians(angle)
    end_x = int(200 + 130 * np.cos(rad))
    end_y = int(180 + 75 * np.sin(rad))
    cv2.line(palm_img, (200, 180), (end_x, end_y), (34, 139, 34), 5)
    for t in range(1, 6):
        mid_x = int(200 + (end_x - 200) * (t / 6.0))
        mid_y = int(180 + (end_y - 180) * (t / 6.0))
        cv2.line(palm_img, (mid_x, mid_y), (mid_x + 8, mid_y - 8), (46, 160, 46), 2)
        cv2.line(palm_img, (mid_x, mid_y), (mid_x - 8, mid_y + 8), (30, 120, 30), 2)

_, palm_jpg = cv2.imencode('.jpg', palm_img)
palm_b64 = "data:image/jpeg;base64," + base64.b64encode(palm_jpg).decode('utf-8')

# 2. Create a Non-Palm Image (Red Car / Circle on Gray)
non_palm_img = np.zeros((400, 400, 3), dtype=np.uint8)
non_palm_img[:] = (200, 200, 200)
cv2.rectangle(non_palm_img, (50, 200), (350, 320), (30, 30, 200), -1) # Red car body
cv2.circle(non_palm_img, (120, 320), 35, (30, 30, 30), -1) # Wheel
cv2.circle(non_palm_img, (280, 320), 35, (30, 30, 30), -1) # Wheel

_, non_palm_jpg = cv2.imencode('.jpg', non_palm_img)
non_palm_b64 = "data:image/jpeg;base64," + base64.b64encode(non_palm_jpg).decode('utf-8')

# Send to localhost:3000/api/validate
def test_api(name, b64):
    req = urllib.request.Request(
        "http://localhost:3000/api/validate",
        data=json.dumps({"name": name, "image_base64": b64}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

res_palm = test_api("Lord of Kumarakom", palm_b64)
res_non_palm = test_api("Red Sedan", non_palm_b64)

print("=== REAL JPEG VALIDATION API TEST ===")
print(f"Palm Test Result:     Valid={res_palm['valid']}, Confidence={res_palm['confidence']}, Message={res_palm['message']}")
print(f"Non-Palm Test Result: Valid={res_non_palm['valid']}, Confidence={res_non_palm['confidence']}, Message={res_non_palm['message']}")

assert res_palm["valid"] is True, "FAIL: Realistic palm should be verified!"
assert res_non_palm["valid"] is False, "FAIL: Non-palm should be rejected!"
print("\n>>> ALL REALISTIC API VALIDATION TESTS PASSED PERFECTLY! <<<")
