/**
 * Dev helpers. Import only in development.
 *   import { installDebug } from 'strike/debug';
 *   installDebug();
 */
import options from './src/options.js';

export function installDebug(opts) {
	const log = (opts && opts.log) || console.log.bind(console);
	const prevDiff = options._diff;
	const prevMismatch = options._hydrationMismatch;
	const prevVnode = options.vnode;

	options._diff = vnode => {
		if (prevDiff) prevDiff(vnode);
		if (opts && opts.diff === false) return;
		const t = vnode && vnode.type;
		log(
			'[strike] diff',
			typeof t === 'function' ? t.name || 'fn' : t,
			vnode && vnode.key
		);
	};

	options._hydrationMismatch = (type, excess) => {
		if (prevMismatch) prevMismatch(type, excess);
		log('[strike] hydrate mismatch', type, excess && excess.length);
	};

	if (opts && opts.vnode) {
		options.vnode = node => {
			if (prevVnode) prevVnode(node);
			opts.vnode(node);
		};
	}

	return function uninstall() {
		options._diff = prevDiff;
		options._hydrationMismatch = prevMismatch;
		options.vnode = prevVnode;
	};
}
