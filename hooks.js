import options from './src/options.js';
import { enqueue } from './src/host.js';

let current = null;
let hookIndex = 0;

const prevRender = options._render;
options._render = vnode => {
	if (prevRender) prevRender(vnode);
	current = vnode._component;
	hookIndex = 0;
	if (current && !current.__hooks) {
		current.__hooks = { _list: [], _pending: [] };
	}
};

const prevCommit = options._commit;
options._commit = (root, commit) => {
	if (prevCommit) prevCommit(root, commit);
	for (let i = 0; i < commit.length; i++) flushLayout(commit[i]);
	const hosts = collectHosts(root);
	(options.requestAnimationFrame || raf)(() => {
		for (const c of hosts) flushPassive(c);
	});
};

const prevUnmount = options.unmount;
options.unmount = vnode => {
	const c = vnode._component;
	if (c && c.__hooks) {
		const list = c.__hooks._list;
		for (let i = 0; i < list.length; i++) {
			const h = list[i];
			if (h._cleanup) {
				h._cleanup();
				h._cleanup = null;
			}
		}
	}
	if (prevUnmount) prevUnmount(vnode);
};

function collectHosts(vnode, out = []) {
	if (!vnode) return out;
	if (vnode._component && vnode._component.__hooks) out.push(vnode._component);
	const kids = vnode._children;
	if (kids) for (let i = 0; i < kids.length; i++) collectHosts(kids[i], out);
	return out;
}

function flushLayout(c) {
	const hooks = c.__hooks;
	if (!hooks) return;
	for (let i = 0; i < hooks._list.length; i++) {
		const h = hooks._list[i];
		if (h._pendingLayout) {
			if (h._cleanup) h._cleanup();
			const cleanup = h._pendingLayout();
			h._cleanup = typeof cleanup === 'function' ? cleanup : null;
			h._pendingLayout = null;
		}
	}
}

function flushPassive(c) {
	const hooks = c.__hooks;
	if (!hooks) return;
	for (let i = 0; i < hooks._list.length; i++) {
		const h = hooks._list[i];
		if (h._pendingEffect) {
			if (h._cleanup) h._cleanup();
			const cleanup = h._pendingEffect();
			h._cleanup = typeof cleanup === 'function' ? cleanup : null;
			h._pendingEffect = null;
		}
	}
}

function raf(fn) {
	if (typeof requestAnimationFrame === 'function') requestAnimationFrame(fn);
	else setTimeout(fn, 0);
}

function getHook(initial) {
	const hooks = current.__hooks._list;
	if (hookIndex >= hooks.length) {
		hooks.push(typeof initial === 'function' ? initial() : initial);
	}
	return hooks[hookIndex++];
}

export function useState(initial) {
	return useReducer(invoke, initial);
}

function invoke(state, action) {
	return typeof action === 'function' ? action(state) : action;
}

export function useReducer(reducer, initial, init) {
	const h = getHook(() => ({
		_value: init ? init(initial) : typeof initial === 'function' ? initial() : initial,
		_reducer: reducer
	}));
	h._reducer = reducer;
	const c = current;
	const dispatch = action => {
		const next = h._reducer(h._value, action);
		if (next !== h._value) {
			h._value = next;
			enqueue(c);
		}
	};
	return [h._value, dispatch];
}

export function useEffect(effect, deps) {
	effectHook(effect, deps, false);
}

export function useLayoutEffect(effect, deps) {
	effectHook(effect, deps, true);
}

function effectHook(effect, deps, layout) {
	const h = getHook(() => ({ _deps: undefined, _cleanup: null }));
	if (changed(h._deps, deps)) {
		h._deps = deps;
		if (layout) h._pendingLayout = effect;
		else h._pendingEffect = effect;
	}
}

function changed(prev, next) {
	if (prev == null) return true;
	if (next == null) return true;
	if (prev.length !== next.length) return true;
	for (let i = 0; i < prev.length; i++) if (prev[i] !== next[i]) return true;
	return false;
}

export function useRef(initial) {
	return getHook(() => ({ current: initial }));
}

export function useMemo(factory, deps) {
	const h = getHook(() => ({ _deps: undefined, _value: undefined }));
	if (changed(h._deps, deps)) {
		h._deps = deps;
		h._value = factory();
	}
	return h._value;
}

export function useCallback(fn, deps) {
	return useMemo(() => fn, deps);
}

export function useContext(ctx) {
	const provider = current.context[ctx._id];
	if (provider && provider.sub) provider.sub(current);
	return provider ? provider.props.value : ctx._defaultValue;
}

/**
 * Catch render errors in this component's subtree.
 * Returns [error, reset] - call reset() to clear and retry.
 */
export function useErrorBoundary(onError) {
	const [err, setErr] = useState(null);
	const c = current;
	c.componentDidCatch = error => {
		setErr(error);
		if (onError) onError(error);
	};
	return [err, () => setErr(null)];
}

export function useId() {
	const h = getHook(() => ({ _id: 's' + Math.random().toString(36).slice(2, 9) }));
	return h._id;
}
