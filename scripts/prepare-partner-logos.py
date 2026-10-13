"""
Prepare the partner logos for the logo wall.

The six source files are inconsistent in two ways that matter here:

  * dead white space around the mark, in places up to 45% of the canvas.
    Aramco and Roads are the worst. With `object-contain` inside a fixed-height
    box, that padding is what the browser fits to the box, so a padded logo
    renders visibly smaller than a tight one. Trimming first is what makes the
    wall read as six equal marks.
  * one 305 KB, 3840 px file.

Processing, in order:

  1. Drop the background. Only near-white pixels connected to the border are
     removed, so white *inside* a mark survives and the pale colours in these
     logos — Mawani's cyan, the Commission's lavender, the Chamber's gold,
     Aramco's green square — keep their anti-aliased edges instead of being
     keyed away. The cut is feathered by each pixel's own darkness, which
     removes the white halo you would otherwise see along those edges.
  2. Trim to the bounding box of what is left, then add the same small margin
     to every mark so none sits flush against the card edge.
  3. Scale the long edge down to a size that is still sharp at 2x for the
     largest card, and write an optimised PNG.

Idempotent: it always works from the pristine copies in
`assets/partner-logos-source`. After replacing a mark, run this, then
`scripts/partner-logo-scale.py --write` to re-balance the wall.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

HERE = Path(__file__).resolve().parent.parent
PARTNERS = HERE / "public" / "images" / "partners"
# Outside public/ on purpose: these are the untouched downloads, and anything
# under public/ is served at a URL. They stay in the repository so the wall can
# be re-balanced without going back to the source links.
ORIGINALS = HERE / "assets" / "partner-logos-source"

FILES = ["mawani", "tga", "roads", "yanbu-chamber", "rcjy", "aramco"]

# A pixel is a background candidate when every channel is at least this bright.
WHITE_CUT = 246
# Below this minimum channel a pixel counts as solid ink, so the feathering
# never makes a genuinely light brand colour partly transparent.
INK_FLOOR = 200
LONG_EDGE = 760
MARGIN = 10


def strip_background(im: Image.Image) -> Image.Image:
    """Make the border-connected near-white area transparent."""
    arr = np.asarray(im.convert("RGB")).astype(np.int16)
    height, width, _ = arr.shape

    near_white = arr.min(axis=2) >= WHITE_CUT

    # Keep only the near-white regions that touch an edge. scipy does this in
    # one pass; a Python flood fill over 14 million pixels would not.
    labels, count = ndimage.label(near_white)
    if count == 0:
        return im.convert("RGBA")

    touching = set(labels[0, :]) | set(labels[-1, :])
    touching |= set(labels[:, 0]) | set(labels[:, -1])
    touching.discard(0)
    if not touching:
        return im.convert("RGBA")

    background = np.isin(labels, list(touching))

    # Feather the cut: the anti-aliased pixels just inside the background were
    # never marked as background, so give them partial alpha in proportion to
    # how dark they already were. That is what kills the white halo.
    alpha = np.clip((255.0 - arr.min(axis=2).astype(np.float64)) / (255.0 - INK_FLOOR), 0.0, 1.0)
    alpha[background] = 0.0
    # Near-white that does not touch an edge is white *inside* the mark; keep it.
    alpha[near_white & ~background] = 1.0

    out = np.dstack(
        [
            arr[:, :, 0].astype(np.uint8),
            arr[:, :, 1].astype(np.uint8),
            arr[:, :, 2].astype(np.uint8),
            (alpha * 255).round().astype(np.uint8),
        ]
    )
    return Image.fromarray(out, "RGBA")


def trim_and_pad(im: Image.Image, margin: int = MARGIN) -> Image.Image:
    """Cut to the ink, then give every mark the same breathing room."""
    box = im.getchannel("A").getbbox()
    if box is None:
        return im
    im = im.crop(box)

    canvas = Image.new("RGBA", (im.width + margin * 2, im.height + margin * 2), (0, 0, 0, 0))
    canvas.paste(im, (margin, margin), im)
    return canvas


def scale_down(im: Image.Image, long_edge: int = LONG_EDGE) -> Image.Image:
    width, height = im.size
    if max(width, height) <= long_edge:
        return im
    if width >= height:
        new = (long_edge, max(1, round(height * long_edge / width)))
    else:
        new = (max(1, round(width * long_edge / height)), long_edge)
    return im.resize(new, Image.LANCZOS)


def main() -> None:
    ORIGINALS.mkdir(exist_ok=True)

    print(f"{'file':<16}{'source':>12}   {'result':<12}{'saved':>10}")
    print("-" * 54)

    for name in FILES:
        pristine = ORIGINALS / f"{name}.png"
        target = PARTNERS / f"{name}.png"

        # Keep one untouched copy so re-running stays safe.
        if not pristine.exists():
            if not target.exists():
                print(f"{name:<16}missing — skipped")
                continue
            pristine.write_bytes(target.read_bytes())

        source = Image.open(pristine)
        size_before = f"{source.width}x{source.height}"
        before_kb = pristine.stat().st_size // 1024

        out = trim_and_pad(scale_down(strip_background(source)))
        out.save(target, "PNG", optimize=True)

        after_kb = target.stat().st_size // 1024
        # ASCII only: the Windows console codepage cannot render a real arrow.
        print(
            f"{name:<16}{size_before:>12}   {f'{out.width}x{out.height}':<12}"
            f"{before_kb} -> {after_kb} KB"
        )

    print("\nDone.")


if __name__ == "__main__":
    main()