#!/usr/bin/env python3
"""Static site on :8080 plus Google Maps address suggestions."""

from __future__ import annotations

import json
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = "0.0.0.0"
PORT = 8080
GOOGLE_SUGGEST = "https://www.google.com/s"
# Türkiye genel görünümü — Maps arama önerileri
GOOGLE_PB = (
    "!2i17!4m12!1m3!1d2500000!2d35.2!3d39.0!2m3!1f0!2f0!3f0!3m2!1i1128!2i686!"
    "4f13.1!7i20!10b1!12m16!1m2!18b1!17b1!19m4!2m1!1e1!2m1!1e0!20m1!1b1!"
    "2m2!1e2!5e0!2m2!1e5!5e0!3m1!2e0!20m2!1e0!2b1!22m1!1e1!28m0!30m1!2e2!31m0"
)


def collect_strings(node, out=None):
    if out is None:
        out = []
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, list):
        for item in node:
            collect_strings(item, out)
    return out


def parse_google_suggestions(raw: str):
    text = raw
    if text.startswith(")]}'"):
        text = text[4:].lstrip("\n")
    data = json.loads(text)
    if not isinstance(data, list) or not data:
        return []
    block = data[0]
    if not isinstance(block, list) or len(block) < 2 or not block[1]:
        return []
    lines = []
    seen = set()
    for item in block[1][:8]:
        strings = collect_strings(item)
        candidates = []
        for value in strings:
            if len(value) < 8:
                continue
            if value.startswith("0x") or value.startswith("http") or "BChIJ" in value:
                continue
            if "," not in value and "/" not in value:
                continue
            candidates.append(value)
        if not candidates:
            continue
        pick = sorted(set(candidates), key=len, reverse=True)[0].strip()
        key = pick.casefold()
        if not pick or key in seen:
            continue
        seen.add(key)
        lines.append(pick)
        if len(lines) >= 6:
            break
    return lines


def google_address_suggestions(query: str):
    query = (query or "").strip()
    if len(query) < 2:
        return []
    params = urllib.parse.urlencode(
        {
            "tbm": "map",
            "gs_ri": "maps",
            "suggest": "p",
            "hl": "tr",
            "gl": "tr",
            "authuser": "0",
            "q": query,
            "ech": "1",
            "pb": GOOGLE_PB,
        }
    )
    url = GOOGLE_SUGGEST + "?" + params
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
            "Referer": "https://www.google.com/maps",
        },
    )
    with urllib.request.urlopen(req, timeout=8) as res:
        raw = res.read().decode("utf-8", "replace")
    return parse_google_suggestions(raw)


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **getattr(SimpleHTTPRequestHandler, "extensions_map", {}),
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".json": "application/json",
        ".css": "text/css",
        ".html": "text/html",
        ".svg": "image/svg+xml",
        "": "application/octet-stream",
    }

    def end_headers(self):
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_OPTIONS(self):
        if self.path.startswith("/api/"):
            self.send_response(204)
            self.end_headers()
            return
        self.send_error(404)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ("/api/google-address", "/api/google-address/"):
            qs = urllib.parse.parse_qs(parsed.query)
            query = (qs.get("q") or [""])[0]
            try:
                lines = google_address_suggestions(query)
                payload = json.dumps({"ok": True, "suggestions": lines}, ensure_ascii=False).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            except Exception as exc:  # noqa: BLE001 — return JSON error to the page
                payload = json.dumps(
                    {"ok": False, "suggestions": [], "error": str(exc)},
                    ensure_ascii=False,
                ).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            return
        return SimpleHTTPRequestHandler.do_GET(self)

    def log_message(self, fmt, *args):
        # Keep terminal quiet except API misses / errors.
        if args and str(args[0]).startswith("/api/"):
            super().log_message(fmt, *args)


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Harbi Yemek 7 → http://{HOST}:{PORT}/index.html", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
