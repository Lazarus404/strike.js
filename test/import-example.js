import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { STRIKE_FW_CDN } from '../examples/cdn.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const localBase = pathToFileURL(root + '/').href;

/**
 * Import a compiled example app.js, rewriting CDN strike-fw URLs to local files
 * so Node tests do not need the network.
 */
export async function importExampleApp(name) {
	const srcPath = join(root, 'examples', name, 'app.js');
	let code = readFileSync(srcPath, 'utf8');
	if (!code.includes(STRIKE_FW_CDN)) {
		throw new Error(
			'examples/' + name + '/app.js missing CDN imports; run npm run build:jsx'
		);
	}
	code = code.split(STRIKE_FW_CDN + '/').join(localBase);
	const outdir = join(root, 'tmp-jsx-test', 'examples', name);
	mkdirSync(outdir, { recursive: true });
	const outfile = join(outdir, 'app.js');
	writeFileSync(outfile, code);
	return import(pathToFileURL(outfile).href + '?t=' + Date.now());
}
