import options from './options.js';

let nextId = 1;

/**
 * Build a Strike node (VNode). `constructor` is always undefined so JSON
 * objects cannot be mistaken for nodes.
 */
export function createElement(type, props, ...rest) {
	// Text / primitive nodes store the value as props directly
	if (type == null && (typeof props === 'string' || typeof props === 'number' || typeof props === 'bigint')) {
		return makeNode(null, props, null, null);
	}

	const p = {};
	let key = null;
	let ref = null;
	if (props != null && typeof props === 'object') {
		for (const k in props) {
			if (k === 'key') key = props.key;
			else if (k === 'ref') ref = props.ref;
			else p[k] = props[k];
		}
	}
	if (rest.length === 1) p.children = rest[0];
	else if (rest.length > 1) p.children = rest;

	return makeNode(type, p, key, ref);
}

export const h = createElement;

function makeNode(type, props, key, ref) {
	const node = {
		type,
		props,
		key,
		ref,
		_children: null,
		_parent: null,
		_depth: 0,
		_dom: null,
		_component: null,
		constructor: undefined,
		_original: nextId++,
		_index: 0,
		_flags: 0
	};
	if (options.vnode) options.vnode(node);
	return node;
}

export function Fragment(props) {
	return props.children;
}

export function createRef() {
	return { current: null };
}

export function isValidElement(node) {
	return (
		node != null &&
		typeof node === 'object' &&
		node.constructor === undefined &&
		'type' in node
	);
}

export function cloneElement(node, props, ...rest) {
	const p = { ...node.props };
	let key = node.key;
	let ref = node.ref;
	if (props != null) {
		for (const k in props) {
			if (k === 'key') key = props.key;
			else if (k === 'ref') ref = props.ref;
			else if (props[k] !== undefined) p[k] = props[k];
		}
	}
	if (rest.length === 1) p.children = rest[0];
	else if (rest.length > 1) p.children = rest;
	const out = makeNode(node.type, p, key, ref);
	out._original = node._original;
	return out;
}

export function toChildArray(children, out = []) {
	if (children == null || typeof children === 'boolean') return out;
	if (Array.isArray(children)) {
		for (const c of children) toChildArray(c, out);
	} else {
		out.push(children);
	}
	return out;
}
