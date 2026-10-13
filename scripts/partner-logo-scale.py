"""
Work out how large each partner logo should render inside its card.

A logo wall looks wrong the moment the marks stop sharing a visual weight, and
these six span 0.78 to 4.23 — a factor of 5.4. Left to `object-contain` in one
shared box, the Chamber would print at 87x112 and the Roads mark at 253x60, so
four logos would look large and two would look lost.

So each mark is given a width expressed as a percentage of the card's inner
width, chosen so every logo occupies the same *area*:

    rendered width  w_i  proportional to  sqrt(r_i)
    rendered height h_i  proportional to  1 / sqrt(r_i)
    w_i * h_i         constant

where r_i is the logo's own aspect ratio. Equal area is what the eye reads as
"equally important", which is the entire point of a partner wall. A wide
wordmark stays wide and short, because that is what it is — it is simply no
longer half the size of the others.

The percentages are read from the processed PNGs rather than typed in, so
replacing a logo and re-running `prepare-partner-logos.py` then this script
keeps the wall balanced without anyone re-tuning numbers by eye.

The intrinsic pixel dimensions are written alongside the percentage, because a
logo rendered at `width: X%` with `height: auto` will only keep its true shape
if the browser is told the real ratio. The old placeholder ratio would stretch
every mark.

Writes `logoW`, `logoH` and `logoScale` into the partner entries of both
dictionaries.

Run: python scripts/partner-logo-scale.py [--write]
"""

import json
import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent.parent
PARTNERS = HERE / "public" / "images" / "partners"
DICTIONARIES = [HERE / "content" / "ar.json", HERE / "content" / "en.json"]

# The nominal height a mark would reach if the card were this wide, in px.
# Only used to derive the common area target — nothing caps the rendered height.
ROW_HEIGHT = 112

# A typical card's inner width at the widest breakpoint, used only to turn the
# area target into a percentage that lands in a sensible range. The percentage
# is relative, so the exact value only sets the overall scale on the wall.
REFERENCE_WIDTH = 300

# The rendered height is allowed to follow from the width and the logo's own
# ratio. That is deliberate: capping it at a fixed row height would leave the
# portrait marks short of the others' area, since only they would be clipped.
# These bounds merely stop a pathological file from vanishing or sprawling.
MIN_SCALE = 24.0
MAX_SCALE = 82.0


def read_sizes() -> dict[str, tuple[int, int]]:
    sizes = {}
    for png in sorted(PARTNERS.glob("*.png")):
        with Image.open(png) as im:
            sizes[png.stem] = (im.width, im.height)
    return sizes


def scales_for(sizes: dict[str, tuple[int, int]]) -> dict[str, float]:
    """One percentage width per logo, equalising rendered area."""
    ratios = {name: w / h for name, (w, h) in sizes.items()}
    smallest = min(ratios.values())
    target_area = (ROW_HEIGHT**2) * smallest

    out = {}
    for name, ratio in ratios.items():
        width = (target_area * ratio) ** 0.5
        pct = 100.0 * width / REFERENCE_WIDTH
        out[name] = round(min(MAX_SCALE, max(MIN_SCALE, pct)), 1)
    return out


def main() -> None:
    write = "--write" in sys.argv

    sizes = read_sizes()
    scales = scales_for(sizes)

    print(f"{'logo':<16}{'pixels':>12}{'ratio':>7}{'pct width':>11}{'at ref width -> w x h':>26}")
    print("-" * 72)
    for name, (px_w, px_h) in sizes.items():
        ratio = px_w / px_h
        pct = scales[name]
        w = REFERENCE_WIDTH * pct / 100.0
        h = w / ratio
        print(
            f"{name:<16}{f'{px_w}x{px_h}':>12}{ratio:>7.2f}{pct:>10.1f}%"
            f"{f'{w:.0f} x {h:.0f}':>26}"
        )
    print("-" * 72)
    print(
        "equal-area target: "
        f"{(ROW_HEIGHT ** 2) * min(w / h for w, h in sizes.values()):.0f} px2, "
        f"reference width {REFERENCE_WIDTH}px"
    )

    if not write:
        print("\nDry run. Re-run with --write to store these in the dictionaries.")
        return

    for path in DICTIONARIES:
        data = json.loads(path.read_text(encoding="utf-8"))
        missing = []
        for item in data["partners"]["items"]:
            logo = Path(item["logo"]).stem
            if logo not in scales:
                missing.append(logo)
                continue
            px_w, px_h = sizes[logo]
            item["logoW"] = px_w
            item["logoH"] = px_h
            item["logoScale"] = scales[logo]

        if missing:
            raise SystemExit(f"{path.name}: no image for {', '.join(missing)}")

        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"{path.name}: logo dimensions and scale written")


if __name__ == "__main__":
    main()