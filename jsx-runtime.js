import { h, Fragment } from './index.js';

export { Fragment };

/** Automatic JSX: key is the third argument, never a child. */
export function jsx(type, props, key) {
	if (key !== undefined) {
		props = props == null ? { key } : { ...props, key };
	}
	return h(type, props);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
