import { createElement } from './src/graph.js';
import { render } from './src/host.js';
import { unmount } from './mount.js';
import './src/patch.js';

/**
 * Thin Custom Element wrapper: observed attrs are strings to props.
 * Default: light DOM (`this`). Pass shadow: true for an open shadow root.
 */
export function define(name, Component, opts = {}) {
	const propNames = opts.props || [];
	const useShadow = !!opts.shadow;
	const styles = opts.styles;

	class StrikeElement extends HTMLElement {
		static get observedAttributes() {
			return propNames.slice();
		}

		constructor() {
			super();
			this._props = {};
			this._root = this;
			if (useShadow) {
				this._root = this.attachShadow({ mode: 'open' });
				applyShadowStyles(this._root, styles);
			}
		}

		connectedCallback() {
			for (const p of propNames) {
				if (this.hasAttribute(p)) this._props[p] = this.getAttribute(p);
			}
			this._draw();
		}

		disconnectedCallback() {
			unmount(this._root, true);
		}

		attributeChangedCallback(attr, _old, value) {
			this._props[attr] = value;
			if (this.isConnected) this._draw();
		}

		_draw() {
			render(createElement(Component, { ...this._props }), this._root);
		}
	}

	if (!customElements.get(name)) {
		customElements.define(name, StrikeElement);
	}
	return StrikeElement;
}

function applyShadowStyles(root, styles) {
	if (styles == null) return;
	const list = Array.isArray(styles) ? styles : [styles];
	const sheets = [];
	for (let i = 0; i < list.length; i++) {
		const s = list[i];
		if (typeof CSSStyleSheet !== 'undefined' && s instanceof CSSStyleSheet) {
			sheets.push(s);
		} else if (typeof s === 'string') {
			if (typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
				const sheet = new CSSStyleSheet();
				sheet.replaceSync(s);
				sheets.push(sheet);
			} else {
				const el = document.createElement('style');
				el.textContent = s;
				root.appendChild(el);
			}
		}
	}
	if (sheets.length && 'adoptedStyleSheets' in root) {
		root.adoptedStyleSheets = sheets;
	}
}
