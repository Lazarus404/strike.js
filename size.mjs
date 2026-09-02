import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

function measure(path) {
	if (!existsSync(path)) {
		return { file: path, missing: true };
	}
	const raw = readFileSync(path);
	const gz = gzipSync(raw, { level: 9 });
	return {
		file: path,
		raw: raw.length,
		gzip: gz.length,
		gzipKb: +(gz.length / 1024).toFixed(2)
	};
}

console.log(
	JSON.stringify(
		{
			core: measure('dist/strike.js'),
			coreAndHooks: measure('dist/strike.core+hooks.js'),
			ui: measure('dist/strike-ui.js'),
			html: measure('dist/html.js')
		},
		null,
		2
	)
);
