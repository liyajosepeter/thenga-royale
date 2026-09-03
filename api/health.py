from http.server import BaseHTTPRequestHandler
import json
import sys
import os

try:
    import cv2
    cv2_version = cv2.__version__
except Exception as e:
    cv2_version = f"Error: {e}"

try:
    import numpy as np
    numpy_version = np.__version__
except Exception as e:
    numpy_version = f"Error: {e}"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "status": "healthy",
            "service": "THENGA ROYALE 👑 - Python CV Engine",
            "competition": "Mr. Coconut 2026",
            "python_version": sys.version,
            "opencv_version": cv2_version,
            "numpy_version": numpy_version,
            "weights": {
                "volume": 0.30,
                "spread": 0.25,
                "symmetry": 0.25,
                "wind_style": 0.20
            }
        }
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == "__main__":
    print("Health check verification:")
    print("Python:", sys.version)
    print("OpenCV:", cv2_version)
    print("NumPy:", numpy_version)
