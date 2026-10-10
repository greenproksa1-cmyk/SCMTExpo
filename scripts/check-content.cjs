// Scans dictionary JSON for suspicious mixed-script tokens (Latin words that
// should not appear inside Arabic copy, stray CJK, control chars, etc.)
const fs = require('fs');

const files = process.argv.slice(2);
const CJK = /[\u3000-\u9fff\uf900-\ufaff]/;
const CTRL = /[\u0000-\u0008\u000b-\u001f\u007f]/;

let problems = 0;

function walk(node, path) {
  if (typeof node === 'string') {
    if (CJK.test(node)) {
      console.log(`CJK   ${path}: ${JSON.stringify(node)}`);
      problems++;
    }
    if (CTRL.test(node)) {
      console.log(`CTRL  ${path}`);
      problems++;
    }
    if (/[\u064B-\u0652]/.test(node) && /[a-z]/i.test(node)) {
      // Arabic diacritics mixed with latin letters is nearly always corruption
      console.log(`MIXED ${path}: ${JSON.stringify(node)}`);
      problems++;
    }
    // Arabic letters followed immediately by latin letters (no space) = glued junk
    const m = node.match(/[\u0621-\u064A][a-zA-Z]{2,}|[a-zA-Z]{2,}[\u0621-\u064A]/g);
    if (m) {
      console.log(`GLUE  ${path}: ${JSON.stringify(m)} in ${JSON.stringify(node)}`);
      problems++;
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, `${path}[${i}]`));
    return;
  }
  if (node && typeof node === 'object') {
    Object.entries(node).forEach(([k, v]) => walk(v, `${path}.${k}`));
  }
}

for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  if (raw.charCodeAt(0) === 0xfeff) {
    console.log(`BOM   ${f}`);
    problems++;
  }
  walk(JSON.parse(raw), f);
}

console.log(problems === 0 ? 'CLEAN — no issues found' : `${problems} issue(s)`);
process.exit(problems === 0 ? 0 : 1);