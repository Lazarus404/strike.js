import * as esbuild from 'esbuild';
import { mkdirSync, copyFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

await esbuild.build({
	entryPoints: ['index.js'],
	bundle: true,
	minify: true,
	format: 'esm',
	outfile: 'dist/strike.js',
	target: ['es2020']
});

await esbuild.build({
	entryPoints: ['measure-entry.js'],
	bundle: true,
	minify: true,
	format: 'esm',
	outfile: 'dist/strike.core+hooks.js',
	target: ['es2020']
});

copyFileSync('ui/tokens.css', 'dist/tokens.css');
copyFileSync('ui.css', 'dist/ui.css');

console.log('wrote dist/strike.js');
console.log('wrote dist/strike.core+hooks.js');
console.log('wrote dist/tokens.css, dist/ui.css');
