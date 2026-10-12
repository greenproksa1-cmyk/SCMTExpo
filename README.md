# معرض ومؤتمر ينبع لسلاسل الإمداد و النقل
### Yanbu Supply Chain and Transport Exhibition & Conference

Bilingual (Arabic-first, RTL) event website for the exhibition and conference in
**Yanbu, Kingdom of Saudi Arabia — 10 January 2027, three days**.

Organiser / project owner: **Green Projects (قرين بروجكتس)**, Riyadh.

---

## 1. Quick start

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /ar
```

Production build:

```bash
npm run build
npm run start
```

Other scripts:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint (next/core-web-vitals)
node scripts/check-content.cjs content/ar.json content/en.json   # content sanity check
```

Requires Node 18.18+ (developed on Node 20).

---

## 2. Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/ar` (or `/en` if the browser's `Accept-Language` prefers English) |
| `/ar` | **Default locale.** Arabic, `dir="rtl"` |
| `/en` | English, `dir="ltr"` |
| `/api/register` | `POST` endpoint for both registration forms (logs to console) |
| `/sitemap.xml`, `/robots.txt` | Generated per-locale |
| any other path | Localised 404 |

Locale routing is handled in `src/middleware.ts`.

The site uses **Next.js multiple root layouts**: `src/app/(rtl)/` owns `/ar`
and renders `<html lang="ar" dir="rtl">`, while `src/app/(ltr)/` owns `/en` and
renders `<html lang="en" dir="ltr">`. `src/app/layout.tsx` is a pass-through so
each group can own the document shell. That is what lets **both** pages be
statically generated with the correct `<html lang dir>` **and** their metadata
inside `<head>` — while still supporting a localised 404 page.

`/` redirects to `/ar`, or to `/en` when the browser's `Accept-Language`
header prefers English. Any other path returns a localised 404.

---

## 3. Editing content — the single source of truth

**All copy lives in two files and nowhere else:**

```
content/ar.json     ← Arabic is the source of truth
content/en.json
```

No component contains hard-coded user-facing text. To change any headline,
paragraph, list item, sector name, form label or validation message, edit the
relevant JSON key. Both files are validated against each other at compile time
(`src/lib/types.ts` derives the `Dictionary` type from `ar.json`), so a missing
or renamed key in `en.json` is a **build error**, not a silent gap.

Top-level keys: `meta`, `event`, `nav`, `chapters`, `ui`, `hero`, `introduction`,
`themes`, `objectives`, `ecosystem`, `visitors`, `whyExhibit`, `businessValue`,
`experience`, `location`, `register`, `organizer`, `footer`.

### Arabic text hygiene

PDF extraction once replaced five letters inside the Arabic word
"استراتيجيًا" with two Hangul syllables, and the damage survived into the
rendered page. Three guards now exist so it cannot come back silently:

```bash
# 1. content: foreign scripts and glued Latin words inside Arabic runs
node scripts/check-content.cjs content/ar.json content/en.json

# 2. source: stray characters in components, CSS, content or SVG
node scripts/scan-source.cjs

# 3. served output: what the browser actually receives
node scripts/scan-cjk.cjs http://localhost:3100/ar http://localhost:3100/en
```

Run all three after any bulk content edit. The first is the one to run in CI —
it exits non-zero on failure.

---

## 4. Editing design tokens

Colours, type scale and motion live in two places:

- `tailwind.config.ts` — navy / orange / surface / green palettes, display type
  scale, shadows, keyframes.
- `src/app/globals.css` — CSS custom properties and component classes.

### Accessibility note on colour roles

Muted and accent **text** colours are driven by role variables that flip with
the section tone:

```css
:root      { --text-muted: #143e6e; --text-accent: #a7480d; }  /* light */
.on-dark   { --text-muted: #b9cbe6; --text-accent: #efa86b; }  /* dark  */
```

Use `text-muted` / `text-accent` rather than a literal navy shade for body and
label copy. A single fixed colour cannot clear WCAG AA against both the very dark
navy and the very light surface backgrounds, so any new text should pick a role
class, and any new dark panel should carry the `on-dark` class. The `<Section>`
component applies `on-dark` automatically when `tone="dark"`.

---

## 5. Images & visual system

### Photography

All photography in `public/images/` was extracted from the event profile PDF;
nothing is hotlinked. A few extra crops were cut from the high-resolution hero
photograph so sections could use real imagery instead of illustration.

| File | Used by |
| --- | --- |
| `hero-port.jpg` | Hero background (full-bleed, parallax) |
| `intro-supply-chains.jpg` | Introduction feature card |
| `warehouse.jpg` | Introduction thumbnail |
| `themes-terminal.jpg` | Key themes feature panel |
| `land-transport.jpg` | Land Transportation theme panel |
| `containers.jpg` | Container-handling theme panel |
| `ship-quay.jpg` | Maritime theme panel |
| `crane-detail.jpg` | Port operations theme panel |
| `breakwater.jpg` | Coastal / marine theme panel |
| `vessel-bow.jpg` | Vessel & shipping theme panel |
| `location-yanbu.jpg` | Location photo inset |
| `green-projects.png` | Organiser logo in the footer |

To swap one, replace the file and keep the name (or update the `image` key in
`content/*.json`).

### Layout rules the design follows

Two rules keep the page readable and were the basis of the last redesign:

1. **Copy is never laid over artwork.** Text always lives in its own container
   next to the image. There are exactly two deliberate exceptions, both with
   their own legibility surface: the hero, which sits on a directional scrim
   over the photograph, and the Yanbu city plate, which has its own navy
   background.
2. **No patterned backgrounds.** No grids, no blueprints, no repeating motifs.
   Sections alternate between white, soft grey and navy to build rhythm.

### Icons

`src/components/ui/Icons.tsx` holds a single-weight 24×24 line icon set plus the
registries that map content IDs to icons (`themeIcons`, `sectorIcons`,
`visitorIcons`, `journeyIcons`, `reasonIcons`, `stationIcons`,
`objectiveGroupIcons`).

Every icon draws its line work with `stroke: var(--icon-stroke)`, **not**
`currentColor`, and the tile that holds it (`IconMark` in
`src/components/ui/Photo.tsx`) sets that variable itself:

| `IconMark` tone | Tile | Icon |
| --- | --- | --- |
| `light` | soft grey, hairline border | navy |
| `dark` | translucent, white border | white |
| `solid` | solid navy | white |

That is deliberate: a dark icon on a dark panel was invisible, and a `className`
override could silently lose to the tile's own background class. **Never pass a
`bg-*` class to `IconMark` — use `tone` instead.**

`IconMark` also sets `color`, so hand-written inline SVGs that use
`stroke="currentColor"` inherit the right colour too.

### Light and dark contexts

Two classes in `src/app/globals.css` control colour context:

- `.on-dark` — flips the text-role variables **and re-declares `color`**. This
  second part is required: `color` is an inherited computed value, so a variable
  change on an ancestor cannot retroactively recolour text already resolved on
  `body`.
- `.on-light` — the counterpart. Apply it to any light surface (chip, card,
  button) that can appear inside a dark section, otherwise it inherits white and
  becomes white-on-white.

Both are declared after `.btn-*` so they win when combined with a button.

---

## 6. Connecting the forms to a real backend

`src/app/api/register/route.ts` currently **validates, whitelists fields, and
logs** the submission. It is deliberately shaped so a provider can be dropped in
without changing the client:

```ts
const record = {
  type, locale, submittedAt, receivedAt, data, meta,
};

// TODO: forward `record` to your CRM / email / spreadsheet here.
console.log('[registration]', JSON.stringify(record));
```

Replace that `console.log` with, for example:

- an email provider (Resend, Postmark, SendGrid),
- a HubSpot / Salesforce webhook,
- a Google Apps Script endpoint that appends to Sheets.

The client (`src/components/RegistrationSection.tsx`) posts
`{ type: 'exhibit' | 'visitor', locale, submittedAt, data }` and only needs a
`2xx` response; anything else renders the error state.

**Content still to be supplied by the organiser** is listed in section 9 below.

---

## 7. SEO

- Per-locale metadata via `generateMetadata` in `src/app/[locale]/layout.tsx`.
- `hreflang` for `ar`, `en` and `x-default`, plus a canonical URL.
- Open Graph / Twitter card using the hero image.
- `JSON-LD` `Event` + `WebSite` graph (start/end dates, location, organiser with
  address and contact) injected in the layout.
- `src/app/sitemap.ts` lists both locales and each major chapter anchor.
- `src/app/robots.ts` allows crawling and disallows `/api/`.

> Set `NEXT_PUBLIC_SITE_URL` in production so canonical URLs, `hreflang` and
> Open Graph images point at the real domain. It falls back to
> `http://localhost:3000`.

---

## 8. Accessibility & performance

- Full keyboard support, visible focus rings, skip-to-content link.
- `prefers-reduced-motion` respected globally and per animation.
- Real landmarks: `banner`, `navigation`, `main`, labelled `region`s, `contentinfo`.
- Confirmed clean with axe-core across WCAG 2.0/2.1 A + AA and Lighthouse:
  **accessibility, best-practices and SEO all score 100 on both `/ar` and `/en`.**
- `/ar` and `/en` are statically generated (`○ /ar`, `○ /en`), with title,
  description, canonical, `hreflang` and JSON-LD all inside `<head>`.
- Arabic/English fonts self-hosted via `next/font` (IBM Plex Sans Arabic +
  Inter). The stack is locale-aware and resolves **per character**, so an
  Arabic run inside the English page still renders in IBM Plex Sans Arabic.
- Images use `next/image` with AVIF/WebP, explicit sizes and lazy loading; the
  hero is the only `priority` image.

---

## 9. Assumptions

Recorded so nothing is mistaken for profile data:

1. **Content is 100% from the profile PDF.** No sponsors, speakers, prices or
   statistics were invented. Where the profile has no data the site says so:
   - Exhibition venue → `location.venueTba` = *سيُعلن لاحقًا / To be announced*.
   - Booth sizes in the booking form are **indicative buckets only**, and the
     form states that final sizes and pricing will be announced later.
2. **Dates.** The profile gives only the start date, `10 January 2027`, and
   "three days". The countdown and JSON-LD use 10–12 January 2027 with an
   assumed 09:00 start / 18:00 finish. Adjust `event.startISO` / `event.endISO`
   in `content/*.json` if the times differ.
3. **Sector 05–07 mapping.** The English detail slides in the PDF mislabel
   sectors 05–07. The correct mapping is used everywhere:
   **05 Equipment & Infrastructure, 06 Finance, Insurance & Professional
   Services, 07 Energy & Sustainability.**
4. **Event experience stations.** The Arabic and English slides present
   stations 01–10 in the same logical order, so both locales share one
   numbering. Station 10 keeps its own wording per language ("لقاءات التواصل /
   Networking Meetings" vs "Networking Receptions") as printed in each deck.
5. **Business value steps.** Arabic and English slides pair subtitles with
   different steps; each locale uses its **own** deck's subtitles so no copy is
   misattributed.
6. **Contact details** are reproduced exactly as printed, including
   `contact@gren-pro.com` and `www.greeen-pro.com` (note the spelling).
7. **Yanbu map** is a stylised illustration of the Red Sea coast, not a
   geographic map — no coordinates or distances were invented.
8. **Hero statistics** (12 objectives, 7 sectors, 10 stations, 3 days) are counts
   of the profile's own content, not event metrics.

---

## 10. Project structure

```
content/                     ar.json · en.json   ← all copy
public/images/               images from the profile PDF
src/
  middleware.ts              locale detection + redirect
  app/
    layout.tsx               pass-through root (multiple-root-layouts pattern)
    localeShell.tsx          <html lang dir>, fonts, JSON-LD, per-locale metadata
    LandingPage.tsx          the long-scroll page, shared by both locales
    not-found.tsx            localised 404 (reads x-locale header)
    NotFoundBody.tsx         404 content
    globals.css              tokens + component classes
    (rtl)/layout.tsx         root layout → /ar, lang=ar dir=rtl
    (rtl)/ar/page.tsx
    (ltr)/layout.tsx         root layout → /en, lang=en dir=ltr
    (ltr)/en/page.tsx
    api/register/route.ts    registration endpoint
    sitemap.ts  robots.ts  icon.svg
  components/
    Header.tsx  Hero.tsx  Introduction.tsx  KeyThemes.tsx  Objectives.tsx
    ExhibitorEcosystem.tsx  TargetVisitors.tsx  WhyExhibit.tsx
    BusinessValue.tsx  EventExperience.tsx  LocationSection.tsx
    RegistrationSection.tsx  Footer.tsx  FloatingActions.tsx
    ChapterRail.tsx  PageLoader.tsx  Countdown.tsx  CountUp.tsx
    LanguageSwitcher.tsx
    ui/
      Icons.tsx          24×24 line icon set + id → icon registries
      Photo.tsx          IconMark · StatTile · AccentRule · PhotoCard
      Section.tsx        Section · SectionTitle
      Motion.tsx         Reveal / RevealGroup / RevealItem / RevealX
      Wordmark.tsx
  hooks/useScrollState.ts    active section, scroll progress
  lib/                       i18n, dictionary, cn, site facts
scripts/check-content.cjs    dictionary sanity check
```

### Reusable building blocks

`Section`, `SectionTitle`, `Reveal` / `RevealGroup` / `RevealItem` / `RevealX`,
`IconMark`, `StatTile`, `AccentRule`, `PhotoCard`, `Wordmark`, the `Icon*` set,
plus feature components `KeyThemes`, `Objectives`, `ExhibitorEcosystem`,
`TargetVisitors`, `WhyExhibit`, `BusinessValue`, `EventExperience`,
`LocationSection`, `RegistrationSection`.

`RevealGroup` / `RevealItem` take an `as` prop (`div | ul | ol | li | article`)
so a motion wrapper never breaks list semantics.

---

## 11. Deploying

Any Node host (Vercel, Node.js buildpack on cPanel/PaaS, Docker) works — there
is no database or external service.

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
npm run start
```

Remember to set `NEXT_PUBLIC_SITE_URL` so SEO metadata uses the real domain.