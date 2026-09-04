from http.server import BaseHTTPRequestHandler
import json
import base64
import sys
import os

# Add parent directory to sys.path so python package can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from python.coconut_validator import validate_coconut_candidate

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Batch validation support
            if "items" in data and isinstance(data["items"], list):
                results = []
                for entry in data["items"]:
                    img_b64 = entry.get("image_base64", entry.get("previewUrl", ""))
                    name = entry.get("name", "Contestant")
                    item_id = entry.get("id", "")
                    
                    if img_b64:
                        if "," in img_b64:
                            img_b64 = img_b64.split(",", 1)[1]
                        img_bytes = base64.b64decode(img_b64)
                        val_res = validate_coconut_candidate(img_bytes)
                    else:
                        val_res = {
                            "valid": False,
                            "confidence": 0.0,
                            "message": "Candidate rejected. Missing image payload."
                        }
                    
                    results.append({
                        "id": item_id,
                        "name": name,
                        **val_res
                    })
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "results": results}).encode('utf-8'))
                return

            image_b64 = data.get("image_base64", data.get("image", ""))
            if not image_b64:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "valid": False,
                    "confidence": 0.0,
                    "message": "Candidate rejected. Missing image data."
                }).encode('utf-8'))
                return

            if "," in image_b64:
                image_b64 = image_b64.split(",", 1)[1]
            
            image_bytes = base64.b64decode(image_b64)
            val_res = validate_coconut_candidate(image_bytes)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(val_res).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "valid": False,
                "confidence": 0.0,
                "message": f"Candidate rejected. Validation exception: {str(e)}"
            }).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
