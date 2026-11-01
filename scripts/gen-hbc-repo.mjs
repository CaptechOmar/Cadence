// Builds a Homebrew Channel repository (apps.json + manifest + icon) for GitHub Pages.
// Usage: node scripts/gen-hbc-repo.mjs <ipk-file> <github-owner> <repo-name> <tag> <out-dir>
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename } from 'node:path';

const [ipk, owner, repo, tag, out] = process.argv.slice(2);
if (!out) { console.error('usage: gen-hbc-repo.mjs <ipk> <owner> <repo> <tag> <out-dir>'); process.exit(1); }
const info = JSON.parse(readFileSync(new URL('../webos/appinfo.json', import.meta.url)));
const pages = `https://${owner.toLowerCase()}.github.io/${repo}`;
const iconUri = `${pages}/${info.icon}`;
const manifest = {
  id: info.id, version: info.version, type: info.type, title: info.title,
  appDescription: 'Apple Music-style client for Navidrome and other Subsonic servers.',
  iconUri, sourceUrl: `https://github.com/${owner}/${repo}`, rootRequired: false,
  ipkUrl: `https://github.com/${owner}/${repo}/releases/download/${tag}/${basename(ipk)}`,
  ipkHash: { sha256: createHash('sha256').update(readFileSync(ipk)).digest('hex') },
  ipkSize: statSync(ipk).size,
};
const manifestFile = `${info.id}.manifest.json`;
const index = { packages: [{
  id: info.id, title: info.title, iconUri,
  manifestUrl: `${pages}/${manifestFile}`, manifest,
  pool: 'main', shortDescription: 'Apple Music-style Navidrome client',
}] };
mkdirSync(out, { recursive: true });
copyFileSync(new URL(`../webos/${info.icon}`, import.meta.url), `${out}/${info.icon}`);
writeFileSync(`${out}/${manifestFile}`, JSON.stringify(manifest, null, 2));
writeFileSync(`${out}/apps.json`, JSON.stringify(index, null, 2));
console.log(`Add this URL in Homebrew Channel: ${pages}/apps.json`);
