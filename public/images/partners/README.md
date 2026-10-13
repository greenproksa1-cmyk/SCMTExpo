# Partner logos

The six marks on `/ar/partners` and `/en/partners`, processed and ready.

| File | Organisation |
| --- | --- |
| `mawani.png` | هيئة الموانئ — Saudi Ports Authority |
| `tga.png` | هيئة النقل — Transport General Authority |
| `roads.png` | هيئة الطرق — Roads General Authority |
| `yanbu-chamber.png` | الغرفة التجارية بمدينة ينبع — Yanbu Chamber |
| `rcjy.png` | الهيئة الملكية للجبيل وينبع — Royal Commission for Jubail and Yanbu |
| `aramco.png` | أرامكو — Aramco |

## Do not hand-edit these files

Each one is processed, not downloaded as it arrived:

1. `python scripts/prepare-partner-logos.py` — makes the background
   transparent, trims the dead white space, scales it down and re-saves.
2. `python scripts/partner-logo-scale.py --write` — reads the resulting
   dimensions and writes `logoW`, `logoH` and `logoScale` into the partner
   entries in `content/ar.json` and `content/en.json`.

Run both, in that order, after replacing a file.

## Why the white space had to go

The sources were padded generously — Aramco and Roads had around 45% of their
canvas empty. Because a logo is fitted to its own bounding box, that padding is
what the browser fits, so a padded mark prints visibly smaller than a tight
one. Trimming first is the single thing that makes the wall look deliberate:

| Mark | As downloaded | After trimming | Ratio |
| --- | --- | --- | --- |
| `roads.png` | 522x383 | 469x111 | 4.23 |
| `aramco.png` | 554x554 | 418x160 | 2.61 |
| `mawani.png` | 1280x720 | 704x345 | 2.04 |
| `tga.png` | 545x366 | 451x274 | 1.65 |
| `rcjy.png` | 3840x3575 | 780x728 | 1.07 |
| `yanbu-chamber.png` | 556x551 | 404x519 | 0.78 |

Note that the padding was lying about the shapes. Before trimming, the Royal
Commission looked like a wide banner and Aramco looked square; in truth the
Roads mark is the wide one at 4.23:1.

## Why each mark is sized individually

0.78 to 4.23 is a factor of 5.4. Given one shared box, the Chamber would print
at 87x112 and the Roads mark at 253x60 — four logos would look large and two
would look lost.

So `logoScale` gives each mark a width as a percentage of its card, chosen so
all six occupy the same **area**: width proportional to `sqrt(ratio)`, height to
`1 / sqrt(ratio)`. Equal area is what the eye reads as "equally important",
which is the whole point of a partner wall. A wide wordmark stays wide and
short, because that is what it is — it is simply no longer half the size of the
others. Measured spread across the six is 1.00, within a rounding step, at
every viewport from 360px to 1920px.

## Where the untouched downloads live

`assets/partner-logos-source/`, deliberately outside `public/` so they are not
served at a URL. The processing script is idempotent and always starts from
those, so the wall can be re-balanced without going back to the source links.

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