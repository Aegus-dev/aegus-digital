#!/usr/bin/env python3
# Logo variation sweep v2 — Hassan feedback: "the A looks like a normal font A,
# nothing going on, orange touch is basic." This sweep pushes into NON-letterform
# territory where the heat is STRUCTURAL (makes the form exist), not decorative.
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
        "sliced",
        "Modern flat vector logo mark for Aegus Digital — an angular letter "
        "A shape that has been horizontally sliced into 3 stacked plates, "
        "each plate offset slightly sideways, with a glowing warm orange "
        "#f97316 gap running between the top and middle plates like a seam "
        "of molten metal. Plates are pure white #ffffff on solid #08090a "
        "background. The orange is not on the surface — it's BETWEEN the "
        "plates, lighting the edge of each slice. No text. Pure icon mark.",
    ),
    (
        "cracked",
        "Modern flat vector logo mark for Aegus Digital — an angular letter "
        "A with a single deep diagonal crack running through it from upper "
        "right to lower left, revealing a glowing warm orange #f97316 core "
        "inside. The visible A is pure white #ffffff on #08090a, cracked "
        "open to show heat underneath. Like a shell cracked to reveal fire. "
        "Iconic, bold, dimensional. No text. Pure icon mark.",
    ),
    (
        "kinetic",
        "Modern flat vector logo mark for Aegus Digital — a letter A "
        "deconstructed into 5 separated angular rectangles of pure white "
        "#ffffff floating on #08090a, arranged so your eye completes the A "
        "shape. Between two of the rectangles, a sharp warm orange #f97316 "
        "wedge sits filling a gap — the heat element is one of the "
        "structural blocks, not a decoration. Motion, deconstruction, "
        "velocity. No text. Pure icon mark.",
    ),
    (
        "crystalline",
        "Modern flat vector logo mark for Aegus Digital — a letter A "
        "rendered as a faceted crystal with 6-8 sharp facets, some white "
        "#ffffff and some warm orange #f97316 filling alternating faces, "
        "like a cut gemstone viewed face-on. Background #08090a. Heat is "
        "not on the edge — it IS the surface of half the facets. "
        "Architectural, precise, jewel-like. No text. Pure icon mark.",
    ),
    (
        "prism",
        "Modern flat vector logo mark for Aegus Digital — a letter A formed "
        "by the negative space between two overlapping tall triangles, like "
        "a prism from the side. One triangle is pure white #ffffff, the "
        "other is warm orange #f97316, overlapping to reveal the letter A "
        "in the shared negative space. Background #08090a. Two colors, one "
        "mark, interlocked. No text. Pure icon mark.",
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
        out = OUT_DIR / f"aegus-logo-v2-{name}.png"
        img.save(out, "PNG")
        return (name, str(out))
    except Exception as e:
        return (name, f"ERROR: {e}")


def main() -> int:
    key = json.loads(SECRETS.read_text())["xai_api_key"]
    print(f"[gen_v2] firing {len(VARIATIONS)} parallel generations...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(VARIATIONS)) as ex:
        futures = [ex.submit(generate_one, key, n, p) for n, p in VARIATIONS]
        for f in concurrent.futures.as_completed(futures):
            name, result = f.result()
            print(f"  {name}: {result}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
