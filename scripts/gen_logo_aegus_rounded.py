#!/usr/bin/env python3
# Round 3 wordmark sweep after Hassan msg 4373:
# "Still too basic. I need the font to look more circular and rounded."
# Target: rounded geometric sans with circular counters and soft
# terminals. Think Circular, Poppins, Pitch, DM Sans Rounded, Ciircular.
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
    "followed by a solid filled CIRCLE period in warm orange #f97316 at "
    "the baseline. Pure white #ffffff letters on solid #08090a near-"
    "black background. No icon mark, no tagline, no shadow, no 3D. "
    "Centered in the frame. {font_clause}"
)

VARIATIONS = [
    (
        "circular-lineto",
        "The typeface is Lineto CIRCULAR or Spotify Ciircular — a bold "
        "geometric sans where every curve is a perfect circle arc. The G "
        "counter is circular, the S curves are circular, the top of the "
        "A is rounded not sharp, the E has rounded terminals. Heavy "
        "weight, uniform stroke thickness, friendly but confident. Every "
        "letter feels like it was constructed with a compass. Premium "
        "brand wordmark feel.",
    ),
    (
        "poppins-heavy",
        "The typeface is Poppins Black or Montserrat Black — a geometric "
        "sans with perfectly circular O counters, the G has an almost "
        "complete circle, the S has symmetrical bowls, the A has a "
        "pointed apex. Heavy weight, generous letter spacing. "
        "Friendly, approachable, modern SaaS feel.",
    ),
    (
        "pitch-rounded",
        "The typeface is a ROUNDED geometric sans in the style of Pitch "
        "Sans Bold or DM Sans Rounded: all stroke terminals are rounded "
        "(no sharp cuts), the inner counters are circular, corners where "
        "strokes meet are softened. Heavy weight. Think of it as bold "
        "letters with every hard edge smoothed off.",
    ),
    (
        "quicksand-black",
        "The typeface is Quicksand Black — a rounded display sans with "
        "very circular O and G, the A has a rounded apex (not pointed), "
        "the E and S have gentle curves at every junction, the terminals "
        "are fully rounded. Heavy weight, friendly, approachable, warm.",
    ),
    (
        "circular-ultra",
        "The typeface is a CUSTOM ultra-circular display bold where "
        "every letter is constructed from parts of a perfect circle: "
        "the A is a triangle with a circular top arc, the E is three "
        "horizontal bars with rounded ends, the G is almost a perfect "
        "circle with a short horizontal bar, the U has a full-circle "
        "bottom curve, the S is two stacked circle halves. Heavy "
        "weight, compass-drawn look. Premium custom-typography feel.",
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
        out = OUT_DIR / f"aegus-wordmark-v3-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[wordmark-v3 rounded] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, c) for n, c in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
