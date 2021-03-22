import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { run } from './harness.js';

const dir = dirname(fileURLToPath(import.meta.url));
const files = readdirSync(dir)
	.filter(f => f.endsWith('.test.js'))
	.sort();

for (const f of files) {
	await import(pathToFileURL(join(dir, f)).href);
}

await run();
