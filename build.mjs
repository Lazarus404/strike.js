import * as esbuild from 'esbuild';
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

const shared = { bundle: true, minify: true, format: 'esm', target: ['es2020'] };

await esbuild.build({
	...shared,
	entryPoints: ['index.js'],
	outfile: 'dist/strike.js'
});

await esbuild.build({
	...shared,
	entryPoints: ['measure-entry.js'],
	outfile: 'dist/strike.core+hooks.js'
});

const externalCore = {
	name: 'external-strike-core',
	setup(build) {
		build.onResolve({ filter: /^\.\.\/index\.js$/ }, () => ({
			path: './strike.core+hooks.js',
			external: true
		}));
		build.onResolve({ filter: /^\.\.\/hooks\.js$/ }, () => ({
			path: './strike.core+hooks.js',
			external: true
		}));
		build.onResolve({ filter: /^\.\/src\/graph\.js$/ }, () => ({
			path: './strike.core+hooks.js',
			external: true
		}));
	}
};

await esbuild.build({
	...shared,
	entryPoints: ['ui/index.js'],
	outfile: 'dist/strike-ui.js',
	plugins: [externalCore]
});

await esbuild.build({
	...shared,
	entryPoints: ['html.js'],
	outfile: 'dist/html.js',
	plugins: [externalCore]
});

writeFileSync(
	'dist/jsx-runtime.js',
	[
		'import{h,Fragment}from"./strike.core+hooks.js";',
		'export{Fragment};',
		'export function jsx(t,p,k){if(k!==void 0)p=p==null?{key:k}:{...p,key:k};return h(t,p)}',
		'export const jsxs=jsx,jsxDEV=jsx;'
	].join('') + '\n'
);
copyFileSync('ui/tokens.css', 'dist/tokens.css');
copyFileSync('ui.css', 'dist/ui.css');

console.log(
	'wrote dist/strike.js, strike.core+hooks.js, strike-ui.js, html.js, jsx-runtime.js, tokens.css, ui.css'
);
