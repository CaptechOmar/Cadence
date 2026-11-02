// Usage: node scripts/set-version.mjs 2.15.0   (or a pre-release such as 2.16.0-beta.1)
// Keeps the webOS package and the desktop package on the same version number.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const v = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$/.test(v || '')) { console.error('Give a version like 2.15.0 or 2.16.0-beta.1'); process.exit(1); }
const base = v.split('-')[0];   // webOS wants plain numbers; the desktop package keeps the full name
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['webos/appinfo.json', 'desktop/package.json']) {
  const p = join(root, f), j = JSON.parse(readFileSync(p, 'utf8'));
  const nv = f.startsWith('webos') ? base : v;
  j.version = nv; writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  console.log(f, '->', nv);
}
const mi = join(root, 'flatpak', 'cadence.metainfo.xml');
let x = readFileSync(mi, 'utf8');
if (!x.includes(`version="${v}"`)) {
  x = x.replace('<releases>', `<releases>\n    <release version="${v}"${v === base ? '' : ' type="development"'} date="${new Date().toISOString().slice(0, 10)}"/>`);
  writeFileSync(mi, x); console.log('flatpak/cadence.metainfo.xml -> added release', v);
}
