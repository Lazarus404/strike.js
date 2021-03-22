import * as esbuild from 'esbuild';

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
	jsxFactory: 'h',
	jsxFragment: 'Fragment',
	loader: { '.jsx': 'jsx' },
	target: ['es2020']
});

console.log('wrote', entries.map(e => e.replace(/\.jsx$/, '.js')).join(', '));
