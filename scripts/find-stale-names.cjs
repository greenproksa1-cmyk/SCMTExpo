/**
 * Guard for renames: fail if the previous event name survives in a field that
 * carries the name.
 *
 * Deliberately JSON-aware. A phrase like "النقل البري والبحري" legitimately
 * describes the sectors in body copy and must not be flagged — only the
 * identity fields are checked, so this stays useful after a rename instead of
 * crying wolf.
 *
 * Usage: node scripts/find-stale-names.cjs
 */
const fs = require('fs');
const path = require('path');

/** Fragments that only ever appeared in the old event name. */
const STALE = [
  'Land & Maritime',
  'Supply Chain, Land',
  'Transport Expo',
  'معرض ومؤتمر سلاسل الإمداد',
  'سلاسل الإمداد والنقل البري والبحري',
];

/** Dictionary paths that hold the identity of the event. */
const IDENTITY_PATHS = [
  'event.nameAr',
  'event.nameEn',
  'event.wordmarkAr',
  'event.wordmarkEn',
  'event.heroTitleAr',
  'event.heroTitleEn',
  'meta.shortEventName',
  'meta.title',
  'meta.description',
];

const TEXT = /\.(ts|tsx|css|json|md|svg|cjs|mjs)$/i;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (TEXT.test(e.name)) out.push(full);
  }
  return out;
}

function get(obj, dotted) {
  return dotted.split('.').reduce((n, k) => (n == null ? n : n[k]), obj);
}

let hits = 0;
const report = (where, value) => {
  for (const s of STALE) {
    if (!value.includes(s)) continue;
    console.log(`  ${where}  [${s}]`);
    console.log(`      ${value.slice(0, 90)}`);
    hits++;
  }
};

// 1. dictionary identity fields
for (const file of ['content/ar.json', 'content/en.json']) {
  if (!fs.existsSync(file)) continue;
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const p of IDENTITY_PATHS) {
    const v = get(dict, p);
    if (typeof v === 'string') report(`${file}  ${p}`, v);
  }
}

// 2. hardcoded copies in code — the real risk, since those drift silently
const codeFiles = [...walk('src'), ...walk('scripts'), 'README.md'].filter(
  (f) => fs.existsSync(f) && path.basename(f) !== 'find-stale-names.cjs',
);
for (const f of codeFiles) {
  fs.readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      const looksLikeContent = /^\s*["'`]/.test(line) && /[؀-ۿ]/.test(line);
      if (looksLikeContent) return; // Arabic string literals are checked via the dictionaries
      for (const s of STALE) {
        if (!line.includes(s)) continue;
        console.log(`  ${f}:${i + 1}  [${s}]`);
        console.log(`      ${line.trim().slice(0, 90)}`);
        hits++;
      }
    });
}

console.log(
  hits
    ? `\n${hits} stale reference(s) to the previous name`
    : '\nno stale references to the previous name',
);
process.exit(hits ? 1 : 0);