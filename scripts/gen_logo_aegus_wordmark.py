#!/usr/bin/env python3
# Wordmark sweep anchored on Hassan's reference (msg 4353/4356):
# "AEGUS." all-caps bold geometric sans-serif with a circle period,
# white on #08090a. Source palette was mint/teal in v1's reference;
# this sweep uses OUR locked heat orange #f97316 for the period and
# any accent treatment.
#
# The wordmark IS the logo — no separate icon mark. All variants are
# text-forward. Shipping 5 distinct treatments of the same concept.
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
        "circle-period",
        "Horizontal wordmark logo for a brand named Aegus. Pure white "
        "#ffffff uppercase letters spelling AEGUS set in a bold geometric "
        "sans-serif (heavy weight, modern, Inter or Helvetica Now style), "
        "wide letter spacing, on a solid #08090a near-black background. "
        "Immediately after the final S, a crisp solid filled circle dot "
        "in warm orange #f97316 sits at the baseline as the period — the "
        "circle is the same visual weight as the letter strokes. The "
        "wordmark is the entire logo. No icon mark, no additional text, "
        "no shadow, no 3D, no ornamentation. Centered in the frame.",
    ),
    (
        "square-period",
        "Horizontal wordmark logo for a brand named Aegus. Pure white "
        "#ffffff uppercase AEGUS set in a bold geometric sans-serif "
        "(heavy, modern, wide letter spacing), on a solid #08090a near-"
        "black background. Immediately after the final S, a small solid "
        "square in warm orange #f97316 sits at the baseline as the "
        "period — sharp corners, same visual weight as the letter "
        "strokes. The square period gives a more typographic, fintech "
        "feel. No icon mark, no additional text, no 3D. Centered.",
    ),
    (
        "orange-s",
        "Horizontal wordmark logo for a brand named Aegus. Bold geometric "
        "sans-serif uppercase AEGUS on a solid #08090a background. The "
        "first four letters AEGU in pure white #ffffff, the FINAL S in "
        "warm orange #f97316 — the heat is structural, carrying the "
        "brand identity through the last letter. No period, no icon "
        "mark, wide letter spacing, heavy weight. Premium SaaS feel. "
        "Centered in the frame.",
    ),
    (
        "thin-line",
        "Horizontal wordmark logo for a brand named Aegus. Uppercase "
        "AEGUS in a tall narrow geometric sans-serif (medium weight, "
        "elongated, refined), pure white #ffffff on solid #08090a. A "
        "thin horizontal line in warm orange #f97316 runs along the "
        "bottom of the letters as an underscore that unifies them. No "
        "period, no icon mark, no shadow. The underscore is the "
        "architectural element. Centered.",
    ),
    (
        "ligature",
        "Horizontal wordmark logo for a brand named Aegus. Uppercase "
        "AEGUS in bold geometric sans-serif, pure white #ffffff on "
        "solid #08090a. The A and E share a common vertical stroke "
        "(a ligature that fuses the two letters), and the final S ends "
        "with a crisp warm orange #f97316 circle period. Tight letter "
        "spacing for the ligature pair, normal for the rest. Premium "
        "custom-typographic feel — like the brand commissioned its own "
        "letterform. No icon mark, centered in the frame.",
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
        out = OUT_DIR / f"aegus-wordmark-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[wordmark] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, p) for n, p in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
