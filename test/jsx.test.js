import assert from 'node:assert/strict';
import test from 'node:test';
import * as esbuild from 'esbuild';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { installDom } from './dom.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('automatic JSX runtime compiles and mounts', async () => {
	const { window } = installDom();

	const source = `
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
		jsx: 'automatic',
		jsxImportSource: 'strike',
		alias: {
			'strike/jsx-runtime': join(root, 'jsx-runtime.js'),
			'strike/jsx-dev-runtime': join(root, 'jsx-runtime.js')
		},
		loader: { '.js': 'js', '.jsx': 'jsx' }
	});

	const code = readFileSync(outfile, 'utf8');
	assert.match(code, /jsx-runtime|function jsx\b|\bjxs?\(/);
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

test('jsx() keeps key out of children', async () => {
	const { jsx } = await import('../jsx-runtime.js');
	const vnode = jsx('li', { children: 'Milk' }, 'k1');
	assert.equal(vnode.key, 'k1');
	assert.equal(vnode.props.children, 'Milk');
});

test('example sources use JSX without importing h', () => {
	for (const name of ['todo', 'login', 'site']) {
		const src = readFileSync(join(root, `examples/${name}/app.jsx`), 'utf8');
		assert.match(src, /<[A-Za-z]/);
		assert.equal(/\bimport\s*\{[^}]*\bh\b/.test(src), false);
	}
});
