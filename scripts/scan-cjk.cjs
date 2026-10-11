/**
 * Fetch a rendered page and report every character outside the scripts the site
 * is supposed to use (Arabic, Latin, digits, punctuation) — in particular any
 * CJK ideograph, kana or hangul.
 *
 * Usage: node scripts/scan-cjk.cjs [url ...]
 */
const http = require('http');
const https = require('https');

const CJK =
  /[\u1100-\u11FF\u2E80-\u2FDF\u3000-\u303F\u3040-\u30FF\u3130-\u318F\u3400-\u4DBF\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7AF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]/;

const ALLOWED_BLOCKS = [
  [0x0000, 0x007f], // ASCII
  [0x0080, 0x00ff], // Latin-1 supplement
  [0x0600, 0x06ff], // Arabic
  [0x0750, 0x077f], // Arabic supplement
  [0x08a0, 0x08ff], // Arabic extended-A
  [0x2000, 0x206f], // general punctuation
  [0x2070, 0x209f], // super/subscripts
  [0x20a0, 0x20bf], // currency
  [0x2190, 0x21ff], // arrows
  [0x2200, 0x22ff], // math operators
  [0x25a0, 0x25ff], // geometric shapes
  [0xfb50, 0xfdff], // Arabic presentation A
  [0xfe70, 0xfeff], // Arabic presentation B
  [0xfffd, 0xfffd], // replacement character
  [0x1f300, 0x1f9ff], // emoji
];

const allowed = (cp) =>
  ALLOWED_BLOCKS.some(([lo, hi]) => cp >= lo && cp <= hi);

function get(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod
      .get(url, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

/** Walk visible text, skipping <script> and <style> bodies. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
}

(async () => {
  const urls = process.argv.slice(2);
  if (!urls.length) urls.push('http://localhost:3100/ar', 'http://localhost:3100/en');

  let totalCjk = 0;
  let totalOther = 0;

  for (const url of urls) {
    const html = await get(url);
    const text = visibleText(html);
    const cjk = [...text].filter((ch) => CJK.test(ch));
    const other = [...text].filter((ch) => !allowed(ch.codePointAt(0)));

    console.log(`\n=== ${url} ===`);
    console.log(`  CJK characters : ${cjk.length}`);
    console.log(`  other scripts  : ${other.length}`);
    totalCjk += cjk.length;
    totalOther += other.length;

    const report = (label, chars) => {
      if (!chars.length) return;
      const counts = new Map();
      for (const ch of chars) counts.set(ch, (counts.get(ch) || 0) + 1);
      console.log(`  ${label}:`);
      for (const [ch, n] of counts) {
        const idx = text.indexOf(ch);
        console.log(
          `    U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}  x${n}  "${ch}"  …${text
            .slice(Math.max(0, idx - 45), idx + 45)
            .replace(/\s+/g, ' ')}…`,
        );
      }
    };
    report('CJK', cjk);
    report('unexpected scripts', other);
  }

  console.log(`\ntotal CJK: ${totalCjk} | total unexpected: ${totalOther}`);
  process.exit(totalCjk + totalOther > 0 ? 1 : 0);
})();