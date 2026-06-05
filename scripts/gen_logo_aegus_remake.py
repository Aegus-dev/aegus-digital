#!/usr/bin/env python3
# Logo remake sweep after Hassan msg 4349: drop "Digital" from wordmark,
# just "Aegus." with a period as style anchor. Taking cues from v1's
# 2026-04-11 aegus-central work (3D origami A + Ae monogram) but staying
# in OUR locked Palette D (white + heat orange on #08090a), NOT v1's teal.
import concurrent.futures
import json
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

SECRETS = Path.home() / ".openclaw" / "secrets.json"
OUT_DIR = Path("/tmp")

VARIATIONS = [
    (
        "origami",
        "Minimalist flat vector logo mark for Aegus — a dimensional letter A "
        "constructed like a folded sheet of paper, with one visible face in "
        "pure white #ffffff and the inner fold face in a darker shade of "
        "white suggesting depth. No crossbar. Background solid #08090a "
        "near-black. A single crisp warm orange #f97316 highlight runs along "
        "the fold crease where the two faces meet. Premium SaaS brand mark. "
        "Architectural, confident, minimal. No text, no wordmark. Pure icon "
        "mark centered in the frame.",
    ),
    (
        "ae-monogram",
        "Minimalist flat vector logo mark for Aegus — a typographic monogram "
        "combining an uppercase A and a lowercase e into a single letterform, "
        "with a bold square period immediately after. 'Ae.' set in a strong "
        "modern geometric sans-serif, pure white #ffffff on a solid #08090a "
        "background. The square period is in warm orange #f97316 — small, "
        "square, deliberate, like a punctuation mark that carries the brand. "
        "Premium fintech aesthetic like Stripe or Linear. Confident, "
        "typographic, no 3D, no shadow. Pure monogram centered in the frame.",
    ),
    (
        "stacked-A",
        "Minimalist flat vector logo mark for Aegus — a bold angular letter "
        "A rendered as a vertical stack of 3 identical chevron shapes, like "
        "a neat architectural layer cake seen from the front. Each chevron "
        "in pure white #ffffff. Background solid #08090a. A single warm "
        "orange #f97316 horizontal line running across the middle chevron "
        "like a crossbar or a strata line. Clean, symmetric, iconic. No "
        "text, no wordmark. Pure icon mark centered in the frame.",
    ),
    (
        "inverse-A",
        "Minimalist flat vector logo mark for Aegus — a geometric letter A "
        "formed by the NEGATIVE SPACE inside a bold solid white #ffffff "
        "rounded square on a #08090a background. The A is the void cut out "
        "of the white square, like a keyhole. A single warm orange #f97316 "
        "dot or wedge sits inside the negative-space A. Premium brand mark. "
        "No text, no wordmark. Pure icon mark centered in the frame.",
    ),
    (
        "prism-A",
        "Minimalist flat vector logo mark for Aegus — a letter A formed by "
        "three overlapping angular planes stacked at slight depth offsets, "
        "like a crystal prism seen from the front. Two planes pure white "
        "#ffffff, one plane warm orange #f97316, all sharing the same A "
        "outline but offset by a few pixels each to suggest dimensionality. "
        "Background solid #08090a. Clean, architectural, geometric. No text, "
        "no wordmark. Pure icon mark centered in the frame.",
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


def generate_one(key: str, name: str, prompt: str) -> tuple[str, str]:
    try:
        url = call_xai(key, prompt)
        img = download(url, key).resize((1024, 1024), Image.LANCZOS)
        out = OUT_DIR / f"aegus-logo-remake-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[remake] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, p) for n, p in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
