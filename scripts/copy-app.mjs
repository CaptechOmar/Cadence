// Copies the single-file app into the Electron project before it is run or packaged.
import { mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'desktop', 'app'), { recursive: true });
copyFileSync(join(root, 'src', 'index.html'), join(root, 'desktop', 'app', 'index.html'));
console.log('Copied src/index.html to desktop/app/');
