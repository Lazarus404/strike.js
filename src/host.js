import options from './options.js';
import { Fragment, createElement } from './graph.js';
import { DIRTY, FORCE, MODE_HYDRATE } from './flags.js';

let queue = [];
let pending = false;

/** @type {typeof import('./patch.js').patch} */
let patchFn;
/** @type {typeof import('./patch.js').unmountTree} */
let unmountFn;
/** @type {typeof import('./patch.js').applyRef} */
let applyRefFn;

export function bindPatch(api) {
	patchFn = api.patch;
	unmountFn = api.unmountTree;
	applyRefFn = api.applyRef;
}

export class Component {
	constructor(props, context) {
		this.props = props;
		this.context = context;
		this.state = {};
		this._nextState = null;
		this._vnode = null;
		this._parentDom = null;
		this._bits = 0;
		this._renderCallbacks = [];
		this._stateCallbacks = [];
		this.__hooks = null;
		this._depth = 0;
	}

	setState(update, callback) {
		const base = this._nextState == null ? (this._nextState = { ...this.state }) : this._nextState;
		const delta = typeof update === 'function' ? update(base, this.props) : update;
		if (delta) Object.assign(base, delta);
		if (callback) this._stateCallbacks.push(callback);
		if (this._vnode) enqueue(this);
	}

	forceUpdate(callback) {
		this._bits |= FORCE;
		if (callback) this._renderCallbacks.push(callback);
		if (this._vnode) enqueue(this);
	}

	update(partial, callback) {
		this.setState(partial, callback);
	}

	render() {
		return null;
	}
}

function fnRender(props, context) {
	return this.constructor(props, context);
}

export function createHost(Ctor, props, context) {
	if (Ctor.prototype && typeof Ctor.prototype.render === 'function') {
		return new Ctor(props, context);
	}
	const c = new Component(props, context);
	c.constructor = Ctor;
	c.render = fnRender;
	return c;
}

export function enqueue(c) {
	if (c._bits & DIRTY) return;
	c._bits |= DIRTY;
	queue.push(c);
	if (!pending) {
		pending = true;
		(options.debounceRendering || queueMicrotask)(flush);
	}
}

function flush() {
	pending = false;
	queue.sort((a, b) => a._depth - b._depth);
	const batch = queue;
	queue = [];
	for (let i = 0; i < batch.length; i++) {
		const c = batch[i];
		if ((c._bits & DIRTY) && c._vnode != null) {
			c._bits &= ~DIRTY;
			rerender(c);
		}
	}
}

function rerender(c) {
	const old = c._vnode;
	const parent = c._parentDom;
	const neu = createElement(old.type, {
		...old.props,
		key: old.key,
		ref: old.ref
	});
	neu._original = old._original;
	const commit = [];
	const refs = [];
	patchFn(parent, neu, old, c.context || {}, isSvg(parent), null, commit, null, false, refs);
	rewire(old, neu, parent);
	commitRoot(neu, commit, refs);
}

function rewire(old, neu, parentDom) {
	const parent = old._parent;
	if (parent && parent._children) {
		const i = parent._children.indexOf(old);
		if (i !== -1) parent._children[i] = neu;
		neu._parent = parent;
	}
	if (parentDom && parentDom.__root) {
		swapRoot(parentDom.__root.vnode, old, neu);
	}
}

function swapRoot(node, old, neu) {
	if (node === old) return neu;
	if (!node || !node._children) return node;
	for (let i = 0; i < node._children.length; i++) {
		const kid = node._children[i];
		if (kid === old) node._children[i] = neu;
		else swapRoot(kid, old, neu);
	}
	return node;
}

function isSvg(dom) {
	return !!(dom && dom.ownerSVGElement !== undefined);
}

export function commitRoot(root, commit, refs) {
	for (let i = 0; i < refs.length; i++) {
		applyRefFn(refs[i], refs[++i], refs[++i]);
	}
	if (options._commit) options._commit(root, commit);
	for (let i = 0; i < commit.length; i++) {
		const c = commit[i];
		const layout = c._renderCallbacks;
		c._renderCallbacks = [];
		for (let j = 0; j < layout.length; j++) layout[j].call(c);
		const stateCbs = c._stateCallbacks;
		c._stateCallbacks = [];
		for (let j = 0; j < stateCbs.length; j++) stateCbs[j].call(c);
	}
}

export function render(vnode, parent) {
	return draw(vnode, parent, false);
}

export function hydrate(vnode, parent) {
	return draw(vnode, parent, true);
}

function draw(vnode, parent, isHydrate) {
	if (!patchFn) throw new Error('Strike patch not bound');
	const prev = parent.__root ? parent.__root.vnode : null;
	// First client render and hydrate both reuse matching existing childNodes.
	const excess = isHydrate || !prev ? Array.from(parent.childNodes) : null;
	const root = createElement(Fragment, null, vnode);
	if (isHydrate) root._flags |= MODE_HYDRATE;
	const commit = [];
	const refs = [];
	patchFn(parent, root, prev, {}, false, excess, commit, null, isHydrate, refs);
	if (excess) {
		for (let i = 0; i < excess.length; i++) {
			const n = excess[i];
			if (n.parentNode === parent) n.remove();
		}
	}
	parent.__root = { vnode: root, hydrating: false };
	commitRoot(root, commit, refs);
	return root._dom;
}

export function unmountHost(parent, keepDom) {
	const root = parent.__root;
	if (!root) return;
	unmountFn(root.vnode, null, keepDom);
	parent.__root = null;
	if (!keepDom) parent.textContent = '';
}
