import { strict as assert } from 'node:assert';
import test from './harness.js';
import { parseHTML } from 'linkedom';
import * as esbuild from 'esbuild';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('esbuild jsxFactory h compiles and mounts', async () => {
	const { window } = parseHTML(
		'<html><head></head><body><div id="app"></div></body></html>'
	);
	Object.assign(globalThis, {
		document: window.document,
		window,
		HTMLElement: window.HTMLElement,
		customElements: window.customElements,
		requestAnimationFrame: cb => setTimeout(cb, 0)
	});

	const source = `
		import { h, Fragment } from './index.js';
		import { useState } from './hooks.js';
		import { mount } from './mount.js';

		function App() {
			const [n, setN] = useState(0);
			return (
				<button onClick={() => setN(n + 1)}>
					{n}
				</button>
			);
		}
		mount('#app', App);
	`;

	const outdir = join(root, 'tmp-jsx-test');
	mkdirSync(outdir, { recursive: true });
	const outfile = join(outdir, 'app.js');

	await esbuild.build({
		stdin: {
			contents: source,
			resolveDir: root,
			sourcefile: 'jsx-test.jsx',
			loader: 'jsx'
		},
		bundle: true,
		format: 'esm',
		outfile,
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
		loader: { '.js': 'js', '.jsx': 'jsx' }
	});

	const code = readFileSync(outfile, 'utf8');
	assert.match(code, /\bh\(/);
	assert.equal(code.includes('<button'), false);

	await import(pathToFileURL(outfile).href + '?t=' + Date.now());
	await Promise.resolve();

	const btn = document.querySelector('#app button');
	assert.ok(btn);
	assert.equal(btn.textContent, '0');
	btn.dispatchEvent(new window.Event('click', { bubbles: true }));
	await Promise.resolve();
	assert.equal(btn.textContent, '1');
});

test('example sources use JSX tags', () => {
	for (const name of ['todo', 'login', 'site']) {
		const src = readFileSync(join(root, `examples/${name}/app.jsx`), 'utf8');
		assert.match(src, /<[A-Za-z]/, `${name} has JSX tags`);
		assert.equal(/\bh\s*\(/.test(src), false, `${name} source is JSX not h()`);
	}
});

