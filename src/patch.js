import options from './options.js';
import { Fragment, createElement } from './graph.js';
import { createHost, bindPatch, enqueue } from './host.js';
import { INSERT, MATCHED, MODE_HYDRATE, DIRTY, FORCE } from './flags.js';

const NS_SVG = 'http://www.w3.org/2000/svg';
const NS_MATH = 'http://www.w3.org/1998/Math/MathML';
const EMPTY = {};

/**
 * Recursive reconcile.
 * Keyed match + LIS is O(n log n) on the moved subset.
 */
export function patch(
	parentDom,
	neu,
	old,
	context,
	isSvg,
	excess,
	commit,
	_oldDom,
	hydrating,
	refs
) {
	if (neu == null || neu.constructor !== undefined) return null;

	if (options._diff) options._diff(neu);

	try {
		if (typeof neu.type === 'function') {
			patchComponent(
				parentDom,
				neu,
				old,
				context,
				isSvg,
				excess,
				commit,
				hydrating,
				refs
			);
		} else if (neu.type == null) {
			patchText(neu, old, excess, hydrating);
		} else {
			patchElement(
				parentDom,
				neu,
				old,
				context,
				isSvg,
				excess,
				commit,
				hydrating,
				refs
			);
		}
	} catch (e) {
		catchError(e, neu, old);
	}

	if (options.diffed) options.diffed(neu);
	return neu._dom;
}

function patchText(neu, old, excess, hydrating) {
	const text = '' + neu.props;
	let dom = old && old.type === null ? old._dom : null;
	if (dom == null || dom.nodeType !== 3) {
		if (excess) {
			for (let i = 0; i < excess.length; i++) {
				if (excess[i].nodeType === 3) {
					dom = excess.splice(i, 1)[0];
					break;
				}
			}
		}
		if (dom == null) dom = document.createTextNode(text);
	}
	if (dom.data !== text) dom.data = text;
	neu._dom = dom;
}

function patchComponent(
	parentDom,
	neu,
	old,
	context,
	isSvg,
	excess,
	commit,
	hydrating,
	refs
) {
	if (neu.type === Fragment || (neu.props && neu.props._parentDom)) {
		return patchFragment(
			parentDom,
			neu,
			old,
			context,
			isSvg,
			excess,
			commit,
			hydrating,
			refs
		);
	}

	let c = old && old.type === neu.type ? old._component : null;
	const isSame = !!c;

	if (neu.type.contextType != null) {
		const provider = context[neu.type.contextType._id];
		neu._contextValue = provider
			? provider.props.value
			: neu.type.contextType._defaultValue;
	}

	if (isSame) {
		neu._component = c;
		c._vnode = neu;
		c.props = neu.props;
	} else {
		if (old) unmountTree(old, null, true);
		c = createHost(neu.type, neu.props, context);
		neu._component = c;
		c._vnode = neu;
		c._parentDom = parentDom;
		c._depth = (neu._depth || 0) + 1;
	}

	c.context = context;

	let state = c._nextState != null ? c._nextState : c.state;
	c._nextState = null;

	if (
		!(c._bits & FORCE) &&
		isSame &&
		c.shouldComponentUpdate &&
		!c.shouldComponentUpdate(neu.props, state, context)
	) {
		c.state = state;
		neu._dom = old._dom;
		neu._children = old._children;
		c._bits &= ~DIRTY;
		linkKids(neu);
		return;
	}

	c.state = state;
	c._bits &= ~(DIRTY | FORCE);

	if (options._render) options._render(neu);

	let rendered;
	let loops = 0;
	do {
		c._bits &= ~DIRTY;
		if (options._render) options._render(neu);
		rendered = c.render(
			c.props,
			neu.type.contextType != null ? neu._contextValue : context
		);
	} while ((c._bits & DIRTY) && ++loops < 25);

	if (c.getChildContext) {
		context = Object.assign({}, context, c.getChildContext());
	}

	const portal = neu.props && neu.props._parentDom;
	const target = portal || parentDom;

	diffChildren(
		target,
		neu,
		old,
		rendered,
		context,
		isSvg,
		excess,
		commit,
		hydrating,
		refs
	);

	neu._dom = portal ? null : firstDom(neu._children);

	commit.push(c);
	if (!isSame) {
		if (c.componentDidMount) {
			c._renderCallbacks.push(() => c.componentDidMount());
		}
	} else if (c.componentDidUpdate) {
		const prevState = old._component && old._component.state;
		c._renderCallbacks.push(() => c.componentDidUpdate(old.props, prevState));
	}

	if (neu.ref) refs.push(neu.ref, c, neu);
}

function patchFragment(
	parentDom,
	neu,
	old,
	context,
	isSvg,
	excess,
	commit,
	hydrating,
	refs
) {
	const target = (neu.props && neu.props._parentDom) || parentDom;
	diffChildren(
		target,
		neu,
		old,
		neu.props.children,
		context,
		isSvg,
		excess,
		commit,
		hydrating,
		refs
	);
	neu._dom = neu.props && neu.props._parentDom ? null : firstDom(neu._children);
}

function patchElement(
	parentDom,
	neu,
	old,
	context,
	isSvg,
	excess,
	commit,
	hydrating,
	refs
) {
	const type = neu.type;
	if (type === 'svg') isSvg = true;
	if (type === 'foreignObject') isSvg = false;

	let dom = old && old.type === type ? old._dom : null;
	const oldProps = old && old.type === type ? old.props : EMPTY;
	const props = neu.props;

	if (dom == null) {
		if (excess) dom = takeExcess(excess, type);
		if (dom == null) {
			const ns = isSvg ? NS_SVG : type === 'math' ? NS_MATH : null;
			dom = ns
				? document.createElementNS(ns, type)
				: document.createElement(type);
			hydrating = false;
			excess = null;
		}
	}

	neu._dom = dom;

	if (props.dangerouslySetInnerHTML != null) {
		const html = props.dangerouslySetInnerHTML.__html;
		const prev =
			oldProps.dangerouslySetInnerHTML && oldProps.dangerouslySetInnerHTML.__html;
		if (!hydrating && html !== prev) dom.innerHTML = html || '';
	} else {
		const childExcess =
			excess != null || hydrating ? Array.from(dom.childNodes) : null;
		diffChildren(
			dom,
			neu,
			old && old.type === type ? old : null,
			props.children,
			context,
			isSvg,
			childExcess,
			commit,
			hydrating,
			refs
		);
	}

	applyProps(dom, props, oldProps, isSvg, hydrating);
	if (neu.ref) refs.push(neu.ref, dom, neu);
}

function takeExcess(excess, type) {
	for (let i = 0; i < excess.length; i++) {
		const n = excess[i];
		const name = n.localName || n.nodeName;
		if (
			(typeof type === 'string' && name && name.toLowerCase() === type.toLowerCase()) ||
			(type == null && n.nodeType === 3)
		) {
			return excess.splice(i, 1)[0];
		}
	}
	if (options._hydrationMismatch) options._hydrationMismatch(type, excess);
	return null;
}

function linkKids(vnode) {
	const kids = vnode._children;
	if (!kids) return;
	for (let i = 0; i < kids.length; i++) {
		if (kids[i]) kids[i]._parent = vnode;
	}
}

function diffChildren(
	parentDom,
	parentVNode,
	oldParent,
	rawChildren,
	context,
	isSvg,
	excess,
	commit,
	hydrating,
	refs
) {
	const oldKids = (oldParent && oldParent._children) || [];
	const kids = (parentVNode._children = []);
	const flat = [];
	flatten(rawChildren, flat);

	for (let i = 0; i < flat.length; i++) {
		let child = flat[i];
		if (child == null || typeof child === 'boolean' || typeof child === 'function') {
			kids[i] = null;
			continue;
		}
		if (typeof child === 'string' || typeof child === 'number' || typeof child === 'bigint') {
			child = createElement(null, child);
		} else if (Array.isArray(child)) {
			child = createElement(Fragment, null, child);
		} else if (child._parent != null || child._component != null) {
			child = createElement(child.type, {
				...child.props,
				key: child.key,
				ref: child.ref
			});
		}
		child._parent = parentVNode;
		child._depth = (parentVNode._depth || 0) + 1;
		kids[i] = child;
	}

	const matched = new Array(oldKids.length);
	const oldIndexOf = new Array(kids.length);

	for (let i = 0; i < kids.length; i++) {
		const child = kids[i];
		if (child == null) {
			oldIndexOf[i] = -1;
			continue;
		}
		const idx = findMatch(child, oldKids, matched, i);
		oldIndexOf[i] = idx;
		if (idx !== -1) {
			matched[idx] = true;
			child._index = idx;
		}
	}

	const movable = [];
	for (let i = 0; i < kids.length; i++) {
		if (kids[i] != null && oldIndexOf[i] !== -1) movable.push(oldIndexOf[i]);
	}
	const lis = new Set(longestIncreasing(movable));

	for (let i = 0; i < kids.length; i++) {
		const child = kids[i];
		if (child == null) continue;
		const oi = oldIndexOf[i];
		if (oi === -1 || !lis.has(oi)) child._flags |= INSERT;
	}

	for (let i = 0; i < oldKids.length; i++) {
		if (!matched[i] && oldKids[i]) unmountTree(oldKids[i], parentDom, false);
	}

	for (let i = 0; i < kids.length; i++) {
		const child = kids[i];
		if (child == null) continue;
		const oldV = oldIndexOf[i] !== -1 ? oldKids[oldIndexOf[i]] : null;

		patch(
			parentDom,
			child,
			oldV,
			context,
			isSvg,
			oldV ? null : excess,
			commit,
			null,
			hydrating && !oldV,
			refs
		);
	}

	for (let i = 0; i < kids.length; i++) {
		const child = kids[i];
		if (!child || !child._dom) continue;
		if (child._flags & INSERT) {
			place(parentDom, child._dom, nextStableDom(kids, i + 1));
		}
		child._flags &= ~(INSERT | MATCHED);
	}
}

function flatten(children, out) {
	if (children == null || typeof children === 'boolean') return;
	if (Array.isArray(children)) {
		for (let i = 0; i < children.length; i++) flatten(children[i], out);
	} else out.push(children);
}

function findMatch(child, oldKids, matched, skewIndex) {
	const guess = oldKids[skewIndex];
	if (
		guess &&
		!matched[skewIndex] &&
		guess.key == null &&
		child.key == null &&
		guess.type === child.type
	) {
		return skewIndex;
	}
	for (let i = 0; i < oldKids.length; i++) {
		const o = oldKids[i];
		if (o && !matched[i] && o.key === child.key && o.type === child.type) return i;
	}
	return -1;
}

function longestIncreasing(seq) {
	if (!seq.length) return [];
	const tails = [];
	const prev = new Array(seq.length).fill(-1);
	for (let i = 0; i < seq.length; i++) {
		let lo = 0,
			hi = tails.length;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (seq[tails[mid]] < seq[i]) lo = mid + 1;
			else hi = mid;
		}
		if (lo > 0) prev[i] = tails[lo - 1];
		tails[lo] = i;
	}
	const out = [];
	for (let i = tails[tails.length - 1]; i !== -1; i = prev[i]) out.push(seq[i]);
	return out.reverse();
}

function firstDom(children) {
	if (!children) return null;
	for (let i = 0; i < children.length; i++) {
		const c = children[i];
		if (!c) continue;
		// Portal content lives under _parentDom, not this parent.
		if (c.props && c.props._parentDom) continue;
		if (c._dom) return c._dom;
		const d = firstDom(c._children);
		if (d) return d;
	}
	return null;
}

function nextStableDom(kids, start) {
	for (let i = start; i < kids.length; i++) {
		const c = kids[i];
		if (!c || c._flags & INSERT) continue;
		if (c.props && c.props._parentDom) continue;
		if (c._dom) return c._dom;
		const d = firstDom(c._children);
		if (d) return d;
	}
	return null;
}

function place(parent, dom, before) {
	if (before == null) {
		if (parent.lastChild !== dom) parent.appendChild(dom);
	} else if (dom.nextSibling !== before) {
		parent.insertBefore(dom, before);
	}
}

function applyProps(dom, props, oldProps, isSvg, hydrating) {
	for (const name in oldProps) {
		if (SKIP[name]) continue;
		if (!(name in props)) setProp(dom, name, null, oldProps[name], isSvg);
	}
	for (const name in props) {
		if (SKIP[name] || name === 'dangerouslySetInnerHTML') continue;
		const value = props[name];
		if (hydrating && (name === 'value' || name === 'checked')) continue;
		if (oldProps[name] === value) continue;
		setProp(dom, name, value, oldProps[name], isSvg);
	}
}

const SKIP = { children: 1, key: 1, ref: 1 };

function setAttr(dom, name, value) {
	if (value == null || value === false) dom.removeAttribute(name);
	else if (value === true) dom.setAttribute(name, '');
	else dom.setAttribute(name, value);
}

function setProp(dom, name, value, old, isSvg) {
	if (name === 'class' || name === 'className') {
		dom.setAttribute('class', value || '');
		return;
	}
	if (name === 'style') {
		setStyle(dom, value, old);
		return;
	}
	if (name[0] === 'o' && name[1] === 'n' && name.length > 2) {
		setEvent(dom, name, value);
		return;
	}

	if (isSvg) {
		const attr = SVG_ATTR[name] || name;
		if (name === 'xlinkHref' || attr === 'href') {
			if (value == null || value === false) {
				dom.removeAttributeNS('http://www.w3.org/1999/xlink', 'href');
				dom.removeAttribute('href');
			} else {
				dom.setAttribute('href', value);
			}
			return;
		}
		setAttr(dom, attr, value);
		return;
	}

	if (
		name !== 'href' &&
		name !== 'list' &&
		name !== 'form' &&
		name !== 'tabIndex' &&
		name !== 'download' &&
		name in dom
	) {
		try {
			dom[name] = value == null ? '' : value;
			return;
		} catch (_) {}
	}
	if (typeof value === 'function') return;
	setAttr(dom, name, value);
}

const SVG_ATTR = {
	strokeWidth: 'stroke-width',
	strokeLinecap: 'stroke-linecap',
	strokeLinejoin: 'stroke-linejoin',
	fillOpacity: 'fill-opacity',
	clipPath: 'clip-path',
	fontSize: 'font-size',
	stopColor: 'stop-color',
	stopOpacity: 'stop-opacity',
	xlinkHref: 'href'
};

const UNITLESS = {
	animationIterationCount: 1,
	columnCount: 1,
	flexGrow: 1,
	flexShrink: 1,
	fontWeight: 1,
	lineHeight: 1,
	opacity: 1,
	order: 1,
	orphans: 1,
	widows: 1,
	zIndex: 1,
	zoom: 1
};

function setStyle(dom, value, old) {
	if (value == null) {
		dom.removeAttribute('style');
		return;
	}
	if (typeof value === 'string') {
		dom.style.cssText = value;
		return;
	}
	const style = dom.style;
	if (old && typeof old === 'object') {
		for (const k in old) if (!(value && k in value)) style.setProperty(kebab(k), '');
	}
	for (const k in value) {
		const v = value[k];
		const out = typeof v === 'number' && !UNITLESS[k] ? v + 'px' : v == null ? '' : '' + v;
		if (k.startsWith('--')) style.setProperty(k, out);
		else style[k] = out;
	}
}

function kebab(s) {
	return s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

function setEvent(dom, name, value) {
	const listeners = dom._listeners || (dom._listeners = {});
	let type = name.slice(2);
	let capture = false;
	if (type.endsWith('Capture')) {
		capture = true;
		type = type.slice(0, -7);
	}
	const key = type.toLowerCase() + (capture ? 'c' : '');
	const prev = listeners[key];
	if (!prev && value) {
		dom.addEventListener(type.toLowerCase(), dispatch, capture);
	} else if (prev && !value) {
		dom.removeEventListener(type.toLowerCase(), dispatch, capture);
	}
	listeners[key] = value;
}

function dispatch(e) {
	this._listeners;
	const capture = e.eventPhase === 1;
	const key = e.type + (capture ? 'c' : '');
	let fn = this._listeners && this._listeners[key];
	if (!fn && this._listeners) {
		fn = this._listeners[e.type];
	}
	if (fn) {
		if (options.event) e = options.event(e);
		return fn.call(this, e);
	}
}

export function unmountTree(vnode, parentDom, skipRemove) {
	if (!vnode) return;
	if (options.unmount) options.unmount(vnode);

	if (vnode.ref) applyRef(vnode.ref, null, vnode);

	const c = vnode._component;
	if (c) {
		if (c.componentWillUnmount) {
			try {
				c.componentWillUnmount();
			} catch (e) {
				catchError(e, vnode);
			}
		}
		c._parentDom = null;
		c._vnode = null;
	}

	const kids = vnode._children;
	if (kids) {
		// Host nodes remove themselves (children skip). Components/fragments
		// have no host node, so children must remove their own DOM.
		const childSkip =
			skipRemove ||
			typeof vnode.type === 'string' ||
			vnode.type == null;
		for (let i = 0; i < kids.length; i++) {
			if (kids[i]) {
				unmountTree(
					kids[i],
					typeof vnode.type === 'string' || vnode.type == null
						? vnode._dom
						: parentDom,
					childSkip
				);
			}
		}
	}

	const dom = vnode._dom;
	vnode._dom = null;
	vnode._component = null;

	if (
		!skipRemove &&
		dom &&
		dom.parentNode &&
		(typeof vnode.type === 'string' || vnode.type == null)
	) {
		dom.remove();
	}
}

export function applyRef(ref, value, vnode) {
	try {
		if (typeof ref === 'function') {
			const prev = ref._cleanup;
			if (typeof prev === 'function') prev();
			const cleanup = ref(value);
			ref._cleanup = typeof cleanup === 'function' ? cleanup : null;
		} else if (ref) {
			ref.current = value;
		}
	} catch (e) {
		catchError(e, vnode);
	}
}

function catchError(error, vnode, old) {
	for (let p = vnode; p; p = p._parent) {
		const c = p._component;
		if (!c) continue;
		const Ctor = c.constructor;
		let handled = false;
		if (Ctor && typeof Ctor.getDerivedStateFromError === 'function') {
			const next = Ctor.getDerivedStateFromError(error);
			c._nextState = Object.assign({}, c._nextState || c.state, next || {});
			c._bits |= FORCE;
			c._bits &= ~DIRTY;
			enqueue(c);
			handled = true;
		}
		if (typeof c.componentDidCatch === 'function') {
			c.componentDidCatch(error);
			handled = true;
		}
		if (handled) return;
	}
	if (options._catchError) options._catchError(error, vnode, old);
	else throw error;
}

export function createPortal(child, container) {
	return createElement(Fragment, { _parentDom: container }, child);
}

export { MODE_HYDRATE, INSERT, MATCHED };

bindPatch({ patch, unmountTree, applyRef });
