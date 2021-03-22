import * as esbuild from 'esbuild';
import { mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

/** UI controls must share one runtime with the app (hooks patch options). */
const externalCore = {
	name: 'external-strike-core',
	setup(build) {
		build.onResolve({ filter: /^\.\.\/index\.js$/ }, () => ({
			path: './strike.core+hooks.js',
			external: true
		}));
	}
};

await esbuild.build({
	entryPoints: ['ui/index.js'],
	bundle: true,
	minify: true,
	format: 'esm',
	outfile: 'dist/strike-ui.js',
	target: ['es2020'],
	plugins: [externalCore]
});

console.log('wrote dist/strike-ui.js');
