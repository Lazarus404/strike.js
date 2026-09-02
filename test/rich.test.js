import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHTML } from 'linkedom';
import { h, render, hydrate, createPortal } from '../index.js';
import { html } from '../html.js';
import { mount } from '../mount.js';
import { useState } from '../hooks.js';
import { installDebug } from '../debug.js';

function installDom() {
	const { window } = parseHTML(
		'<html><head></head><body><div id="app"></div></body></html>'
	);
	Object.assign(globalThis, {
		document: window.document,
		window,
		HTMLElement: window.HTMLElement,
		customElements: window.customElements,
		requestAnimationFrame: cb => setTimeout(cb, 0),
		queueMicrotask
	});
	return window;
}

test('html maps .prop ?bool @event prefixes', () => {
	const window = installDom();
	const host = document.createElement('div');
	let clicked = 0;
	render(
		html`<input .value=${'hi'} ?disabled=${true} @click=${() => clicked++} />`,
		host
	);
	const input = host.querySelector('input');
	assert.equal(input.value, 'hi');
	assert.equal(input.disabled, true);
	input.dispatchEvent(new window.Event('click', { bubbles: true }));
	assert.equal(clicked, 1);
});

test('html supports dynamic component tags', () => {
	installDom();
	const host = document.createElement('div');
	function Box({ children }) {
		return h('section', { class: 'box' }, children);
	}
	render(html`<${Box}>inside</${Box}>`, host);
	assert.equal(host.querySelector('section.box').textContent, 'inside');
});

test('data-hydrate keeps matching DOM and wires events', async () => {
	const window = installDom();
	const host = document.createElement('div');
	host.setAttribute('data-hydrate', '');
	host.innerHTML = '<button type="button">0</button>';
	document.body.append(host);
	const btn = host.firstChild;

	function Counter() {
		const [n, setN] = useState(0);
		return h(
			'button',
			{ type: 'button', onClick: () => setN(n + 1) },
			String(n)
		);
	}

	mount(host, Counter);
	assert.equal(host.firstChild, btn);
	assert.equal(host.hasAttribute('data-hydrate'), false);
	btn.dispatchEvent(new window.Event('click', { bubbles: true }));
	await Promise.resolve();
	assert.equal(btn.textContent, '1');
});

test('hydrate() API reuses matching markup', () => {
	installDom();
	const host = document.createElement('div');
	host.innerHTML = '<p class="x">Hi</p>';
	const p = host.firstChild;
	hydrate(h('p', { class: 'x' }, 'Hi'), host);
	assert.equal(host.firstChild, p);
});

test('component-returned portal stays on target container', () => {
	installDom();
	const host = document.getElementById('app');
	function Gate() {
		return createPortal(h('p', { class: 'port' }, 'X'), document.body);
	}
	render(h(Gate), host);
	assert.equal(host.querySelector('.port'), null);
	assert.equal(document.body.querySelector('.port').textContent, 'X');
});

test('Form Switch Dialog controls render', async () => {
	const window = installDom();
	const { Form } = await import('../ui/form.js');
	const { Switch } = await import('../ui/switch.js');
	const { Dialog } = await import('../ui/dialog.js');
	const host = document.createElement('div');
	let submitted = 0;

	render(
		h(
			'div',
			null,
			h(
				Form,
				{ onSubmit: () => submitted++ },
				h(Switch, { label: 'On', checked: true }),
				h('button', { type: 'submit' }, 'Save')
			),
			h(Dialog, { open: true, title: 'Note' }, h('p', null, 'Hello'))
		),
		host
	);

	assert.ok(host.querySelector('.strike-form'));
	assert.ok(host.querySelector('.strike-switch__input'));
	assert.ok(document.querySelector('.strike-dialog'));

	host.querySelector('form').dispatchEvent(
		new window.Event('submit', { bubbles: true, cancelable: true })
	);
	assert.equal(submitted, 1);
});

test('installDebug wraps options and uninstalls', () => {
	installDom();
	const lines = [];
	const stop = installDebug({ log: (...a) => lines.push(a.join(' ')) });
	render(h('span', null, 'x'), document.createElement('div'));
	assert.ok(lines.some(l => l.includes('diff')));
	stop();
});
