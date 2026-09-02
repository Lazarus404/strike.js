import type { ComponentChild, ComponentChildren, Key } from './index.js';

export { Fragment } from './index.js';

export declare function jsx(
	type: string | ((props: Record<string, unknown>) => ComponentChild),
	props: Record<string, unknown> | null,
	key?: Key
): ComponentChild;

export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;

export type { ComponentChild, ComponentChildren, Key };
