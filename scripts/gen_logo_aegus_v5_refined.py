#!/usr/bin/env python3
# Round 5 — tight refinement matching Hassan's chosen ChatGPT reference (msg 4387):
# Sharp AE ligature, long sweeping A tail to the left with ORANGE ACCENT LINE
# along the bottom edge of the tail, forward-leaning italic, bold GUS,
# orange circle period. White on near-black. Slight 3D/emboss feel optional.
import concurrent.futures
import json
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

SECRETS = Path.home() / ".openclaw" / "secrets.json"
OUT_DIR = Path("/tmp")

BASE = (
    "Horizontal wordmark logo spelling AEGUS followed by a solid filled "
    "CIRCLE dot in warm orange #f97316. White #ffffff letters on solid "
    "#08090a near-black background. No tagline, no shadow. Centered. "
    "CRITICAL: The A and E form a CUSTOM LIGATURE. The A has a very sharp "
    "pointed apex and a LONG sweeping tail extending far to the lower-left "
    "like a blade or speed streak. Along the bottom edge of that sweeping "
    "A tail there is a thin ORANGE #f97316 accent line that traces the "
    "underside of the blade shape. The A's horizontal crossbar extends "
    "rightward to form the E's three horizontal strokes. The whole AE "
    "reads as one aggressive custom letterform. G U S are bold clean "
    "sans-serif letters matching the stroke weight, with a slight forward "
    "italic lean (5 degrees). {variant_clause}"
)

VARIATIONS = [
    (
        "exact-match",
        "The overall composition matches a high-end automotive badge: "
        "the A-tail is the dominant visual element, sweeping long and sharp "
        "to the left. The orange accent line under the tail is thin and "
        "precise. The G has a clean horizontal crossbar. The U is smooth "
        "and rounded at the bottom. The S has balanced curves. Heavy bold "
        "weight throughout. Premium racing typography.",
    ),
    (
        "tighter-kern",
        "Same aggressive AE ligature with the long blade tail and orange "
        "underline accent. But the letter spacing between G, U, S is very "
        "tight — letters almost touching. This creates a more compact, "
        "dense wordmark. The orange period sits close to the S. Think "
        "Formula 1 team livery typography.",
    ),
    (
        "deeper-lean",
        "Same AE ligature but with a stronger forward italic lean (about "
        "10 degrees). The entire wordmark leans forward aggressively, "
        "conveying speed and momentum. The A-tail sweeps even further "
        "left. The orange accent line follows the lean. Think Lamborghini "
        "Aventador badge — pure velocity in typography.",
    ),
    (
        "double-accent",
        "Same AE ligature with the sweeping tail, but the orange accent "
        "appears in TWO places: the thin line under the A-tail AND a "
        "small orange highlight at the apex of the A where the two "
        "diagonal strokes meet. This creates a visual anchor at both "
        "ends of the A. The circle period completes the trio of orange "
        "touches. Subtle but distinctive.",
    ),
    (
        "wider-stance",
        "Same aggressive AE ligature but with wider letter spacing and "
        "wider horizontal proportions. The GUS letters are broad and "
        "commanding. The A-tail is long but the overall wordmark has "
        "a wide confident stance. Think luxury automotive — Aston Martin "
        "or Bentley wordmark proportions but with the aggressive AE "
        "ligature and orange accents. Premium and spacious.",
    ),
]


def call_xai(key: str, prompt: str) -> str:
    body = json.dumps(
        {"model": "grok-imagine-image", "prompt": prompt, "n": 1, "response_format": "url"}
    ).encode()
    req = urllib.request.Request(
        "https://api.x.ai/v1/images/generations",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        payload = json.loads(r.read())
    return payload["data"][0]["url"]


def download(url: str, key: str) -> Image.Image:
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {key}", "User-Agent": "aegus-digital/1.0"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        raw = r.read()
    return Image.open(BytesIO(raw)).convert("RGBA")


def generate_one(key: str, name: str, clause: str) -> tuple[str, str]:
    prompt = BASE.format(variant_clause=clause)
    try:
        url = call_xai(key, prompt)
        img = download(url, key).resize((1024, 1024), Image.LANCZOS)
        out = OUT_DIR / f"aegus-wordmark-v5-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[wordmark-v5 refined] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, c) for n, c in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
