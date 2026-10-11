/**
 * Guard against the class of bug that produced the Hangul-in-the-title:
 * stray characters from a foreign script inside Arabic or English copy.
 *
 * Fails if any content value contains a character outside Arabic, Latin,
 * digits and common punctuation.
 *
 * Usage: node scripts/check-content.cjs [file ...]
 */
const fs = require('fs');

const ALLOWED = [
  [0x0009, 0x000d], // tab, LF, CR
  [0x0020, 0x007e], // ASCII
  [0x00a0, 0x00ff], // Latin-1 supplement
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic supplement
  [0x08a0, 0x08ff], // Arabic extended-A
  [0xfb50, 0xfdff], // Arabic presentation A
  [0xfe70, 0xfeff], // Arabic presentation B
  [0x2010, 0x2027], // dashes and quotes
  [0x2030, 0x205e], // per-mille, primes, bullets, ellipsis
  [0x20ac, 0x20ac], // euro
];

const allowed = (cp) => ALLOWED.some(([lo, hi]) => cp >= lo && cp <= hi);

/** Names the offenders readably instead of showing a bare codepoint. */
function describe(ch) {
  const cp = ch.codePointAt(0);
  if (cp >= 0xac00 && cp <= 0xd7af) return 'hangul';
  if (cp >= 0x1100 && cp <= 0x11ff) return 'hangul-jamo';
  if (cp >= 0x4e00 && cp <= 0x9fff) return 'han';
  if (cp >= 0x3040 && cp <= 0x30ff) return 'kana';
  if (cp >= 0xff00 && cp <= 0xffef) return 'fullwidth';
  if (cp >= 0x0400 && cp <= 0x04ff) return 'cyrillic';
  if (cp >= 0x0370 && cp <= 0x03ff) return 'greek';
  if (cp >= 0x0590 && cp <= 0x05ff) return 'hebrew';
  if (cp >= 0x0530 && cp <= 0x058f) return 'armenian';
  if (cp >= 0x0900 && cp <= 0x097f) return 'devanagari';
  return 'non-latin';
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node scripts/check-content.cjs <file.json ...>');
  process.exit(2);
}

/** Walk every string in the dictionary with its JSON path. */
function walk(node, path, out) {
  if (typeof node === 'string') {
    out.push([path, node]);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`, out);
  }
  return out;
}

let problems = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  let dict;
  try {
    dict = JSON.parse(raw);
  } catch (err) {
    console.log(`FAIL ${file} — not valid JSON: ${err.message}`);
    problems++;
    continue;
  }

  const strings = walk(dict, '', []);
  const offenders = [];

  for (const [path, value] of strings) {
    [...value].forEach((ch, i) => {
      if (allowed(ch.codePointAt(0))) return;
      offenders.push({
        path,
        index: i,
        ch,
        script: describe(ch),
        context: `${value.slice(Math.max(0, i - 25), i)}[${ch}][${value.slice(i + 1, i + 26)}]`,
      });
    });
  }

  // Also catch Latin words glued inside Arabic, which is the other half of the
  // same damage: an English fragment where an Arabic word should be.
  const mixed = strings.filter(([path, v]) =>
    /[\u0600-\u06FF][A-Za-z]{2,}|[A-Za-z]{2,}[\u0600-\u06FF]/.test(v),
  );

  if (offenders.length || mixed.length) {
    console.log(`FAIL ${file} — ${strings.length} strings checked`);
    for (const o of offenders) {
      console.log(
        `  ${o.script} U+${o.ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}` +
          `  at ${o.path}[${o.index}]  ${o.context}`,
      );
    }
    for (const [path, v] of mixed) {
      console.log(`  mixed-script  at ${path}  "${v.slice(0, 60)}"`);
    }
    problems += offenders.length + mixed.length;
  } else {
    console.log(`OK   ${file} — ${strings.length} strings, all Arabic/Latin`);
  }
}

console.log(problems ? `\n${problems} problem(s) found` : '\nCLEAN — no issues found');
process.exit(problems ? 1 : 0);