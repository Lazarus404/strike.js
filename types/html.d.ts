import type { ComponentChild } from './index.js';

/** Tagged template -> VNodes. Prefixes: .prop ?bool @event */
export declare function html(
	strings: TemplateStringsArray,
	...values: unknown[]
): ComponentChild;
