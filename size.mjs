import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

function measure(path) {
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
			coreAndHooks: measure('dist/strike.core+hooks.js')
		},
		null,
		2
	)
);
