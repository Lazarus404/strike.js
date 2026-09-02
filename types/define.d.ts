import type { ComponentType } from './index.js';

export interface DefineOptions {
	shadow?: boolean | 'open' | 'closed';
	observedAttributes?: string[];
	props?: string[];
	[key: string]: unknown;
}

/** Register a custom element that mounts a Strike component. */
export declare function define(
	name: string,
	Component: ComponentType,
	opts?: DefineOptions
): CustomElementConstructor;
