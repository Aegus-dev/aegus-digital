#!/usr/bin/env python3
# Round 4 wordmark sweep after Hassan shared ChatGPT references (msgs 4377-4378):
# Sharp angular AE ligature — the A has a sweeping backward tail/point,
# the A crossbar flows into the E horizontal strokes forming a custom
# ligature. Speed/automotive energy. Orange circle period. White on black.
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
    "CIRCLE period in warm orange #f97316 at the baseline. Pure white "
    "#ffffff letters on solid #08090a near-black background. No icon mark, "
    "no tagline, no shadow, no 3D. Centered in the frame. "
    "CRITICAL DESIGN DETAIL: The letters A and E form a CUSTOM LIGATURE — "
    "the A is a sharp angular letter with a sweeping pointed tail extending "
    "to the left, and the horizontal crossbar of the A extends rightward to "
    "become the horizontal strokes of the E. The AE reads as one connected "
    "custom letterform. {variant_clause}"
)

VARIATIONS = [
    (
        "speed-razor",
        "The A has a razor-sharp apex and a long sweeping tail that extends "
        "far to the left like a speed streak. The E's horizontal bars are "
        "parallel extensions of the A's crossbar. The G U S are clean "
        "geometric sans-serif in heavy weight matching the AE stroke "
        "thickness. Overall feel: automotive, racing, high-performance tech. "
        "Think Lamborghini or McLaren wordmark energy.",
    ),
    (
        "angular-tech",
        "The A has a sharp triangular shape with angular cuts instead of "
        "curves. The tail of the A sweeps left at a 15-degree angle. The "
        "E is formed by three horizontal bars extending from the A's right "
        "side. G U S are in a matching angular display sans with flat "
        "terminals and no rounded corners anywhere. Think cyberpunk, "
        "tech startup, aggressive precision.",
    ),
    (
        "aero-sweep",
        "The A has an aerodynamic shape — the left leg sweeps backward "
        "with a curved tail like an aircraft wing. The crossbar connects "
        "into the E creating a fluid AE monogram. G U S are in a modern "
        "bold sans-serif that matches the stroke weight. The overall shape "
        "has forward momentum, like the wordmark is moving to the right. "
        "Think aerospace, velocity, sleek engineering.",
    ),
    (
        "blade-minimal",
        "The A is constructed from two sharp diagonal strokes meeting at "
        "a pointed apex, with a blade-like tail extending left. The "
        "connection to E is minimal — just the crossbar extending into "
        "two clean horizontal lines. G U S are in an ultra-clean geometric "
        "sans with generous spacing. Premium minimal — think Acura or "
        "Lexus typography. Maximum whitespace, surgical precision.",
    ),
    (
        "dynamic-italic",
        "The entire wordmark has a slight forward lean (5-7 degrees italic). "
        "The A has a dynamic pointed tail sweeping left and upward. The AE "
        "ligature flows naturally with the italic angle. G U S match the "
        "italic lean in a bold condensed sans-serif. The orange circle "
        "period grounds the composition. Think motorsport, dynamic energy, "
        "movement and speed.",
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
        out = OUT_DIR / f"aegus-wordmark-v4-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[wordmark-v4 sharp-ae] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, c) for n, c in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
