/**
 * Replace the `partners` block in both dictionaries from
 * scripts/partners-block.json, so the block has a single source while it is
 * still being shaped.
 *
 * Run: node scripts/sync-partners.cjs
 */
const fs = require('fs');

const CJK = /[\u2E80-\u9FFF\uAC00-\uD7AF\uFF00-\uFFEF]/;
const block = JSON.parse(fs.readFileSync('scripts/partners-block.json', 'utf8'));

const walk = (node, path, out) => {
  if (typeof node === 'string') out.push([path, node]);
  else if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  else if (node && typeof node === 'object') Object.entries(node).forEach(([k, v]) => walk(v, `${path}.${k}`, out));
  return out;
};

const strings = walk(block, '', []);
for (const [p, v] of strings) {
  if (CJK.test(v)) {
    console.error(`foreign-script character in ${p}`);
    process.exit(1);
  }
}
console.log(`block ok — ${strings.length} strings, ${block.items.length} partners`);

for (const file of ['content/ar.json', 'content/en.json']) {
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  dict.partners = block;
  const out = JSON.stringify(dict, null, 2) + '\n';
  JSON.parse(out);
  fs.writeFileSync(file, out, 'utf8');
  console.log(`${file}: partners synchronised`);
}