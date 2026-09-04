import { createElement } from './src/graph.js';
import { render, hydrate, unmountHost } from './src/host.js';
import './src/patch.js';

const registry = new Map();

/** Register a component name for mount(target, name). */
export function register(name, component) {
	registry.set(name, component);
}

function eachTarget(target, fn) {
	if (typeof target === 'string') {
		const nodes = document.querySelectorAll(target);
		const out = [];
		for (let i = 0; i < nodes.length; i++) out.push(fn(nodes[i]));
		return out;
	}
	return fn(target);
}

/**
 * Mount a component into a selector or element.
 * String targets mount every match (querySelectorAll).
 * If props omitted, reads JSON from each host's data-props.
 * If component is a string, resolves via register().
 */
export function mount(target, component, props, opts) {
	if (typeof target === 'string') {
		const nodes = document.querySelectorAll(target);
		if (!nodes.length) throw new Error('Strike mount: host not found');
	}
	return eachTarget(target, host => mountOne(host, component, props, opts));
}

function mountOne(host, component, props, opts) {
	if (!host) throw new Error('Strike mount: host not found');

	let Comp = component;
	if (typeof Comp === 'string') {
		Comp = registry.get(Comp);
		if (!Comp) throw new Error('Strike mount: unknown component "' + component + '"');
	}

	const merged = props != null ? props : readDataProps(host);
	const vnode = createElement(Comp, merged || {});
	const existing = host.__root;
	const wantsHydrate =
		(opts && opts.hydrate) ||
		(host.getAttribute && host.getAttribute('data-hydrate') != null);

	if (existing) {
		render(vnode, host);
	} else if (wantsHydrate) {
		hydrate(vnode, host);
		if (host.removeAttribute) host.removeAttribute('data-hydrate');
	} else {
		host.textContent = '';
		render(vnode, host);
	}

	return host;
}

export function unmount(target, keepHost) {
	if (typeof target === 'string') {
		eachTarget(target, host => unmountHost(host, keepHost));
		return;
	}
	if (!target) return;
	unmountHost(target, keepHost);
}

function readDataProps(host) {
	if (!host.getAttribute) return null;
	const raw = host.getAttribute('data-props');
	if (raw == null || raw === '') return null;
	return JSON.parse(raw);
}
