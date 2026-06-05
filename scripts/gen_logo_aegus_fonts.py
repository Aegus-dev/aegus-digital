#!/usr/bin/env python3
# Round 2 wordmark sweep after Hassan msg 4368: "Yes we go with the
# circle-period one but change the font a bit because it looks too basic."
# Locked constraints: AEGUS uppercase, circle period in warm orange
# #f97316, white on #08090a. Only the TYPEFACE CHARACTER varies —
# naming specific reference families in the prompts so grok-imagine
# doesn't default to generic Inter/Helvetica.
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
    "Horizontal wordmark logo for a brand named Aegus. Uppercase AEGUS "
    "followed immediately by a solid filled circle dot period in warm "
    "orange #f97316 at the baseline (same visual weight as the letter "
    "strokes). Pure white #ffffff letters on a solid #08090a near-black "
    "background. The wordmark IS the entire logo — no icon mark, no "
    "tagline, no shadow, no 3D. Centered in the frame. {font_clause}"
)

VARIATIONS = [
    (
        "custom-sharp",
        "The typeface is a CUSTOM angular display sans with signature "
        "details: the A has a razor-sharp apex cut flat, the E has "
        "extended arms of unequal length, the G has a straight vertical "
        "crossbar instead of a curl, and the S has high-contrast stroke "
        "transitions. Think a hybrid of Migra Display and F37 Neuro — "
        "architectural, deliberate, obviously custom. Heavy weight, "
        "wide letter spacing.",
    ),
    (
        "condensed-black",
        "The typeface is an ULTRA-BLACK COMPRESSED display sans: tall "
        "narrow letters, minimal horizontal width, maximum vertical "
        "stroke thickness, tight letter spacing, aggressive energy. "
        "Think Druk Wide Super or Brutalist Grotesk Black. Letters "
        "almost touching. Assertive and modern.",
    ),
    (
        "humanist",
        "The typeface is a HUMANIST sans with subtle warm curves and "
        "character: medium-heavy weight, slight stroke modulation, "
        "rounded internal corners, a G with an open counter, an "
        "E with subtly tapered arms. Think Graphik Bold or Söhne "
        "Breit Kräftig — clean but with personality, not robotic.",
    ),
    (
        "wide-geometric",
        "The typeface is a WIDE GEOMETRIC sans in the Futura Bold "
        "family: perfect circles inside the G and the O shapes of "
        "the letters, very wide horizontal proportions, uniform stroke "
        "weight, classic mid-century modernist feel. Generous letter "
        "spacing. The A has a perfectly pointed apex. Industrial "
        "confidence.",
    ),
    (
        "display-serif",
        "The typeface is a modern DISPLAY SERIF with sharp wedge serifs "
        "and high contrast between thick and thin strokes. Think "
        "GT Super Display Bold or Ogg Bold — editorial, confident, "
        "slightly literary. Not a quiet serif, an assertive display "
        "one. Heavy weight. The orange circle period sits as a "
        "punctuation anchor at the baseline.",
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


def generate_one(key: str, name: str, font_clause: str) -> tuple[str, str]:
    prompt = BASE.format(font_clause=font_clause)
    try:
        url = call_xai(key, prompt)
        img = download(url, key).resize((1024, 1024), Image.LANCZOS)
        out = OUT_DIR / f"aegus-wordmark-v2-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[wordmark-v2] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, c) for n, c in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
