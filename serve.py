"""
Simple static server with extensionless URL support.
Run: python serve.py
Opens: http://localhost:8080
"""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        # If path has no extension and doesn't end with /, try .html
        if "." not in os.path.basename(path) and not path.endswith("/"):
            candidate = os.path.join(ROOT, path.lstrip("/") + ".html")
            if os.path.exists(candidate):
                self.path = path + ".html"
        super().do_GET()

    def log_message(self, fmt, *args):
        pass  # silent

print(f"Server running at http://localhost:{PORT}")
print("Press Ctrl+C to stop.")
http.server.HTTPServer(("", PORT), Handler).serve_forever()
