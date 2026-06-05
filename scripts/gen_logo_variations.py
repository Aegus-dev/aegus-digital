#!/usr/bin/env python3
# Generate N logo variations in parallel via grok-imagine-image and save them
# to /tmp/aegus-logo-variant-<N>.png for Hassan to compare side-by-side.
# Palette is locked (white mark + #f97316 heat accent on #08090a canvas) —
# the variations explore FORM, not color.
import concurrent.futures
import json
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

SECRETS = Path.home() / ".openclaw" / "secrets.json"
OUT_DIR = Path("/tmp")

# Each variation picks a different A-mark construction. Wording is deliberate —
# grok-imagine is prompt-sensitive and these concepts already produced distinct
# masks in prior generation runs.
VARIATIONS = [
    (
        "geometric",
        "Minimalist flat vector logo mark for Aegus Digital — a sharp "
        "equilateral letter A built from two intersecting angular planes, "
        "like a folded sheet of paper seen from above. Pure white #ffffff on "
        "a solid #08090a near-black background. A single subtle heat "
        "highlight in warm orange #f97316 on the inner crossbar edge. "
        "Premium enterprise SaaS aesthetic. Crisp, architectural, symmetric, "
        "iconic. No text, no wordmark. Pure icon mark centered in the frame.",
    ),
    (
        "wave",
        "Minimalist flat vector logo mark for Aegus Digital — a letter A "
        "where the horizontal crossbar becomes a flowing wave-like arc, "
        "suggesting motion and data flow. Pure white #ffffff on a solid "
        "#08090a near-black background. A single heat glow highlight in warm "
        "orange #f97316 along the wave arc. Premium fintech aesthetic. "
        "Clean, crisp, with a hint of motion. Symmetric overall. No text, no "
        "wordmark. Pure icon mark centered in the frame.",
    ),
    (
        "shield",
        "Minimalist flat vector logo mark for Aegus Digital — a letter A "
        "formed as a stacked shield with two overlapping angular plates, "
        "suggesting protection, trust, and institutional strength. Pure "
        "white #ffffff on a solid #08090a near-black background. A single "
        "subtle heat rim-light in warm orange #f97316 on one plate's edge. "
        "Premium enterprise aesthetic — think JPMorgan + Stripe. Bold, "
        "defensive, iconic. No text, no wordmark. Pure icon mark centered in "
        "the frame.",
    ),
    (
        "glyph",
        "Minimalist flat vector logo mark for Aegus Digital — a highly "
        "abstracted glyph version of the letter A, reduced to two "
        "asymmetric strokes that imply the form without drawing it "
        "literally. Pure white #ffffff on a solid #08090a near-black "
        "background. One stroke tinted warm orange #f97316 as a heat "
        "accent. Premium, avant-garde, minimal SaaS aesthetic — think "
        "Linear + Arc Browser. Negative space carries the identity. No "
        "text, no wordmark. Pure icon mark centered in the frame.",
    ),
    (
        "monogram",
        "Minimalist flat vector logo mark for Aegus Digital — an "
        "italicized monogram letter A rendered in a strong, slanted "
        "custom typeface, as if it were the brand's own letterform. Pure "
        "white #ffffff on a solid #08090a near-black background. A single "
        "heat accent stroke in warm orange #f97316 underscoring the "
        "letter base. Premium SaaS aesthetic — think Vercel + Linear. "
        "Clean, typographic, confident. No extra text, no wordmark below. "
        "Pure icon mark centered in the frame.",
    ),
]


def call_xai(key: str, prompt: str) -> str:
    body = json.dumps(
        {
            "model": "grok-imagine-image",
            "prompt": prompt,
            "n": 1,
            "response_format": "url",
        }
    ).encode()
    req = urllib.request.Request(
        "https://api.x.ai/v1/images/generations",
        data=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as r:
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


def generate_one(key: str, name: str, prompt: str) -> tuple[str, str]:
    try:
        url = call_xai(key, prompt)
        img = download(url, key).resize((1024, 1024), Image.LANCZOS)
        out = OUT_DIR / f"aegus-logo-variant-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[gen_variations] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, name, prompt) for name, prompt in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
