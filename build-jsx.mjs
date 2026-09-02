import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

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
	jsxImportSource: 'strike',
	loader: { '.jsx': 'jsx' },
	target: ['es2020']
});

for (const entry of entries) {
	const out = entry.replace(/\.jsx$/, '.js');
	const code = readFileSync(out, 'utf8').replace(
		/from\s*["']strike\/jsx-(?:dev-)?runtime["']/g,
		'from "../../jsx-runtime.js"'
	);
	writeFileSync(out, code);
}

console.log('wrote', entries.map(e => e.replace(/\.jsx$/, '.js')).join(', '));
