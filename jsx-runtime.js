import { h } from './src/graph.js';

/** Automatic JSX runtime entry (jsx / jsxs). Bundlers map jsxImportSource here. */
export function jsx(type, props, key) {
	const p = props == null ? {} : { ...props };
	if (key !== undefined) {
		return h(type, { ...p, key });
	}
	return h(type, p);
}

export const jsxs = jsx;
export { Fragment } from './src/graph.js';
