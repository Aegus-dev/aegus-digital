#!/usr/bin/env python3
# Regenerate the Aegus mark with a subtle heat accent for the Anthropic event.
# Palette D locked: pure white mark, orange (#f97316) edge highlight only.
# Output: public/aegus-logo-heat.png (1024x1024, RGBA, transparent background)
import json
import os
import sys
import urllib.request
import urllib.error
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
SECRETS = Path.home() / ".openclaw" / "secrets.json"

PROMPT = (
    "Minimalist flat vector logo mark for Aegus Digital — an AI agency and "
    "autonomous trading hub. The letter A rendered as a sharp, dimensional, "
    "angular wedge with two internal facets suggesting depth and momentum. "
    "Pure white #ffffff on a solid #08090a near-black background. Add a "
    "subtle heat highlight on the right-facing edge only — warm orange "
    "#f97316, a single crisp rim-light, roughly 15% of the mark's surface. "
    "Premium enterprise SaaS aesthetic. Crisp edges, no gradients on the "
    "white body. Clean, symmetric, iconic. No text, no wordmark, no tagline. "
    "Pure icon mark centered in the frame. Studio-grade."
)


def call_xai(key: str) -> str:
    body = json.dumps({
        "model": "grok-imagine-image",
        "prompt": PROMPT,
        "n": 1,
        "response_format": "url",
    }).encode()
    req = urllib.request.Request(
        "https://api.x.ai/v1/images/generations",
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        payload = json.loads(r.read())
    return payload["data"][0]["url"]


def download(url: str, key: str) -> Image.Image:
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {key}",
            "User-Agent": "aegus-digital/1.0",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        raw = r.read()
    return Image.open(BytesIO(raw)).convert("RGBA")


def key_background(img: Image.Image, threshold: int = 30) -> Image.Image:
    """Punch out the near-black background so the mark sits on transparency."""
    out = img.copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if r < threshold and g < threshold and b < threshold:
                px[x, y] = (0, 0, 0, 0)
    return out


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[gen_logo_heat] calling grok-imagine-image …", flush=True)
    url = call_xai(key)
    print(f"[gen_logo_heat] image url: {url}", flush=True)
    img = download(url, key)
    img = img.resize((1024, 1024), Image.LANCZOS)
    keyed = key_background(img, threshold=35)
    out_path = PUBLIC / "aegus-logo-heat.png"
    keyed.save(out_path, "PNG")
    raw_path = PUBLIC / "aegus-logo-heat-raw.png"
    img.save(raw_path, "PNG")
    print(f"[gen_logo_heat] saved {out_path} and {raw_path}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
