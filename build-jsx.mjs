import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';
import { rewriteStrikeFwImports } from './examples/cdn.mjs';

const entries = [
	'examples/todo/app.jsx',
	'examples/login/app.jsx',
	'examples/site/app.jsx'
];

await esbuild.build({
	entryPoints: entries,
	outdir: 'examples',
	outbase: 'examples',
	format: 'esm',
	jsx: 'automatic',
	jsxImportSource: 'strike-fw',
	loader: { '.jsx': 'jsx' },
	target: ['es2020']
});

for (const entry of entries) {
	const out = entry.replace(/\.jsx$/, '.js');
	writeFileSync(out, rewriteStrikeFwImports(readFileSync(out, 'utf8')));
}

console.log('wrote', entries.map(e => e.replace(/\.jsx$/, '.js')).join(', '));
