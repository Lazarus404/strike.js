import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHTML } from 'linkedom';
import { h, render } from '../index.js';
import { useState } from '../hooks.js';

function installDom() {
	const { window } = parseHTML(
		'<html><head></head><body></body></html>'
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

function click(el, window) {
	el.dispatchEvent(new window.Event('click', { bubbles: true }));
}

function keydown(el, window, key) {
	const e = new window.Event('keydown', { bubbles: true, cancelable: true });
	Object.defineProperty(e, 'key', { value: key });
	el.dispatchEvent(e);
}

test('RadioGroup selecting an option checks the right radio', async () => {
	const window = installDom();
	const { RadioGroup } = await import('../ui/radio-group.js');
	const host = document.createElement('div');

	function App() {
		const [v, setV] = useState('a');
		return h(RadioGroup, {
			name: 'pick',
			value: v,
			options: [
				{ value: 'a', label: 'A' },
				{ value: 'b', label: 'B' }
			],
			onChange: e => setV(e.target.value)
		});
	}

	render(h(App), host);
	const radios = host.querySelectorAll('.strike-radio__input');
	assert.ok(radios[0].hasAttribute('checked'));
	assert.equal(radios[1].hasAttribute('checked'), false);
	radios[1].dispatchEvent(new window.Event('change', { bubbles: true }));
	await Promise.resolve();
	const after = host.querySelectorAll('.strike-radio__input');
	assert.ok(after[1].hasAttribute('checked'));
});

test('NumberField stepper increments value', async () => {
	const window = installDom();
	const { NumberField } = await import('../ui/number-field.js');
	const host = document.createElement('div');

	function App() {
		const [n, setN] = useState(2);
		return h(NumberField, {
			label: 'Qty',
			value: n,
			onInput: e => setN(Number(e.target.value))
		});
	}

	render(h(App), host);
	click(host.querySelector('[aria-label="Increase"]'), window);
	await Promise.resolve();
	assert.equal(host.querySelector('.strike-number__input').value, '3');
});

test('BtnGroup wraps buttons', async () => {
	installDom();
	const { BtnGroup } = await import('../ui/btn-group.js');
	const { Btn } = await import('../ui/btn.js');
	const host = document.createElement('div');
	render(
		h(BtnGroup, null, h(Btn, null, 'A'), h(Btn, null, 'B')),
		host
	);
	assert.ok(host.querySelector('.strike-btn-group'));
	assert.equal(host.querySelectorAll('.strike-btn-group .strike-btn').length, 2);
});

test('ToggleGroup exclusive click fires onChange', async () => {
	const window = installDom();
	const { ToggleGroup } = await import('../ui/toggle-group.js');
	const host = document.createElement('div');
	let last = null;

	function App() {
		const [v, setV] = useState('s');
		return h(ToggleGroup, {
			value: v,
			options: [
				{ value: 's', label: 'S' },
				{ value: 'm', label: 'M' }
			],
			onChange: next => {
				last = next;
				setV(next);
			}
		});
	}

	render(h(App), host);
	click(host.querySelectorAll('.strike-btn')[1], window);
	await Promise.resolve();
	assert.equal(last, 'm');
	assert.equal(
		host.querySelectorAll('.strike-btn')[1].getAttribute('aria-checked'),
		'true'
	);
});

test('Autocomplete Enter selects and Escape closes', async () => {
	const window = installDom();
	const { Autocomplete } = await import('../ui/autocomplete.js');
	const host = document.createElement('div');
	let selected = null;

	function App() {
		const [q, setQ] = useState('');
		return h(Autocomplete, {
			id: 'ac',
			value: q,
			options: [
				{ value: 'oak', label: 'Oak' },
				{ value: 'pine', label: 'Pine' }
			],
			onInput: e => setQ(e.target.value),
			onSelect: opt => {
				selected = opt.value;
				setQ(opt.label);
			}
		});
	}

	render(h(App), host);
	const input = host.querySelector('.strike-autocomplete__input');
	input.dispatchEvent(new window.Event('focus', { bubbles: true }));
	await Promise.resolve();
	assert.ok(host.querySelector('.strike-autocomplete__list'));

	keydown(input, window, 'ArrowDown');
	await Promise.resolve();
	keydown(input, window, 'Enter');
	await Promise.resolve();
	assert.equal(selected, 'pine');

	input.dispatchEvent(new window.Event('focus', { bubbles: true }));
	await Promise.resolve();
	assert.ok(host.querySelector('.strike-autocomplete__list'));
	keydown(input, window, 'Escape');
	await Promise.resolve();
	assert.equal(host.querySelector('.strike-autocomplete__list'), null);
});
