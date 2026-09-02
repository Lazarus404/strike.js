import { parseHTML } from 'linkedom';

/** Linkedom window + optional hashchange bus for route tests. */
export function installDom(html, hash) {
	const { window: dom } = parseHTML(
		html || '<html><head></head><body><div id="app"></div></body></html>'
	);
	const listeners = Object.create(null);
	const location = {
		hash: hash || '#/',
		href: 'http://localhost/',
		assign() {},
		replace() {}
	};
	const window = {
		document: dom.document,
		HTMLElement: dom.HTMLElement,
		customElements: dom.customElements,
		Event: dom.Event,
		addEventListener(type, fn) {
			(listeners[type] || (listeners[type] = [])).push(fn);
		},
		removeEventListener(type, fn) {
			listeners[type] = (listeners[type] || []).filter(f => f !== fn);
		},
		dispatchEvent(ev) {
			for (const fn of listeners[ev.type] || []) fn(ev);
			return true;
		}
	};
	Object.assign(globalThis, {
		document: window.document,
		window,
		location,
		HTMLElement: window.HTMLElement,
		customElements: window.customElements,
		requestAnimationFrame: cb => setTimeout(cb, 0),
		queueMicrotask
	});
	return { window, location, document: window.document };
}
