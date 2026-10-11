/**
 * Scan the built source for stray characters from a foreign script.
 *
 * The Hangul-in-the-title bug reached the page through content/ar.json, but the
 * same class of damage could sit in a hardcoded string, a comment, or an SVG.
 * Reads files as UTF-8 explicitly so the console codepage cannot fake it.
 *
 * Usage: node scripts/scan-source.cjs
 */
const fs = require('fs');
const path = require('path');

const SUSPECT =
  /[\u1100-\u11FF\u2E80-\u2FDF\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7AF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0400-\u04FF\u0370-\u03FF\u0590-\u05FF\u0530-\u058F\u0900-\u097F]/;

const scriptName = (cp) => {
  if (cp >= 0xac00 && cp <= 0xd7af) return 'hangul';
  if (cp >= 0x1100 && cp <= 0x11ff) return 'hangul-jamo';
  if (cp >= 0x4e00 && cp <= 0x9fff) return 'han';
  if (cp >= 0x3040 && cp <= 0x30ff) return 'kana';
  if (cp >= 0xff00 && cp <= 0xffef) return 'fullwidth';
  if (cp >= 0x0400 && cp <= 0x04ff) return 'cyrillic';
  if (cp >= 0x0370 && cp <= 0x03ff) return 'greek';
  if (cp >= 0x0590 && cp <= 0x05ff) return 'hebrew';
  return 'other';
};

const TEXT_EXT = /\.(ts|tsx|css|json|md|svg|cjs|mjs|txt)$/i;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (TEXT_EXT.test(entry.name)) out.push(full);
  }
  return out;
}

const roots = ['src', 'content', 'public'];
let hits = 0;
let scanned = 0;

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    scanned++;
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      [...line].forEach((ch) => {
        if (!SUSPECT.test(ch)) return;
        const cp = ch.codePointAt(0);
        console.log(
          `  ${file}:${i + 1}  ${scriptName(cp)} U+${cp.toString(16).toUpperCase().padStart(4, '0')}` +
            `  ${JSON.stringify(line.trim().slice(0, 70))}`,
        );
        hits++;
      });
    });
  }
}

console.log(
  `\nscanned ${scanned} files — ${hits ? hits + ' suspect character(s)' : 'no foreign-script characters found'}`,
);
process.exit(hits ? 1 : 0);