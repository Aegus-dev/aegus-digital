#!/usr/bin/env python3
# Concept 4 refinement sweep — keep the dimensional angular A + heat rim
# that Hassan locked on, but swap the curved swoosh for a different
# cutting element. Hassan msg 4327: "the knife or the whatever thing
# that's coming from the side bending needs to be of some other shape".
import concurrent.futures
import json
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

SECRETS = Path.home() / ".openclaw" / "secrets.json"
OUT_DIR = Path("/tmp")

# Base Concept 4 scaffold — all variants share this, we only swap the
# cutting-element clause.
BASE_PROMPT = (
    "Minimalist flat vector logo mark for Aegus Digital — a sharp, dimensional, "
    "angular letter A with two internal facets suggesting depth and momentum. "
    "Pure white #ffffff on a solid #08090a near-black background. A subtle heat "
    "rim-light of warm orange #f97316 runs along the right-facing edge of the A, "
    "roughly 15% of the mark's surface. {cut_clause} "
    "Premium enterprise SaaS aesthetic. Crisp edges, no gradients on the white "
    "body. Clean, symmetric, iconic. No text, no wordmark, no tagline. Pure icon "
    "mark centered in the frame."
)

VARIATIONS = [
    (
        "wedge",
        "A single sharp straight wedge cuts diagonally through the lower-left "
        "portion of the A from outside the letter, ending in a clean point "
        "inside the negative space — no curves, no bending, a decisive straight "
        "slice.",
    ),
    (
        "chevron",
        "A small chevron (>) shape sits inside the triangular negative space "
        "of the A, pointing to the right, in warm orange #f97316 — compact, "
        "arrow-like, suggesting forward motion.",
    ),
    (
        "bar",
        "A single horizontal bar in warm orange #f97316 replaces the A's "
        "traditional crossbar — clean, solid, architectural, like a modernist "
        "crossbar rendered in heat.",
    ),
    (
        "notch",
        "A small triangular notch has been cut cleanly out of the lower-right "
        "edge of the A's leg, revealing a glimpse of warm orange #f97316 "
        "behind — a deliberate kerf mark, like a craftsman's signature.",
    ),
    (
        "orbit",
        "A small crisp circle in warm orange #f97316 sits in the triangular "
        "negative space of the A, like an orbital dot or a signal marker — "
        "precise, geometric, contained.",
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


def generate_one(key: str, name: str, cut_clause: str) -> tuple[str, str]:
    prompt = BASE_PROMPT.format(cut_clause=cut_clause)
    try:
        url = call_xai(key, prompt)
        img = download(url, key).resize((1024, 1024), Image.LANCZOS)
        out = OUT_DIR / f"aegus-logo-c4-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[gen_c4] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, c) for n, c in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
