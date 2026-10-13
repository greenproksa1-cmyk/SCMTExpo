# Partner logos

Drop the six logo files here. The page reads exactly these paths.

| File | Organisation |
| --- | --- |
| `mawani.png` | هيئة الموانئ — Saudi Ports Authority |
| `tga.png` | هيئة النقل — Transport General Authority |
| `roads.png` | هيئة الطرق — Roads General Authority |
| `yanbu-chamber.png` | الغرفة التجارية بمدينة ينبع — Yanbu Chamber |
| `rcjy.png` | الهيئة الملكية للجبيل وينبع — Royal Commission for Jubail and Yanbu |
| `aramco.png` | أرامكو — Aramco |

## What works

PNG with a transparent background is best. SVG works too, but then the file
name has to keep the `.png` extension, which is confusing — convert to PNG
instead.

The layout fits every logo with `object-contain` inside a fixed box, so the
proportions do not matter. The six marks are genuinely different shapes —
Mawani and Aramco are near-square, the Royal Commission is about three times
wider than it is tall — and each gets the same generous box, so none of them is
cropped or stretched. The Royal Commission card spans two grid columns because
of that width.

## Until a file is there

The card shows the organisation's name in the brand typeface instead. That is
deliberate: a missing image never leaves a broken-image icon in the grid.

## A note on sourcing

These are real organisations, so use each logo from its own official source and
keep it on a transparent background. Recreating or redrawing one is not a good
idea — the marks carry specific colours and proportions that the public expects
to see unchanged.

If any organisation has not actually agreed to be listed as a partner, remove
its entry from `content/ar.json` and `content/en.json` (`partners.items`) and
delete the matching row here. The page is built for these six, not for six at
any cost.