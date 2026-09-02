import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHTML } from 'linkedom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { cls } from '../ui/cls.js';

function installDom() {
	const { window } = parseHTML('<html><head></head><body></body></html>');
	Object.assign(globalThis, {
		document: window.document,
		window,
		HTMLElement: window.HTMLElement,
		customElements: window.customElements,
		requestAnimationFrame: cb => setTimeout(cb, 0)
	});
	return window;
}

test('cls joins truthy parts', () => {
	assert.equal(cls('a', null, false, 'b', ''), 'a b');
});

test('each control renders with strike- class prefix', async () => {
	installDom();
	const { h, render } = await import('../index.js');
	const { Btn } = await import('../ui/btn.js');
	const { Field } = await import('../ui/field.js');
	const { Stack } = await import('../ui/stack.js');
	const { Text } = await import('../ui/text.js');
	const { Check } = await import('../ui/check.js');
	const { Select } = await import('../ui/select.js');
	const { Image } = await import('../ui/image.js');

	const host = document.createElement('div');

	render(
		h(
			Stack,
			null,
			h(Btn, { variant: 'primary' }, 'Go'),
			h(Field, { label: 'Name' }),
			h(Text, { tone: 'muted' }, 'Hi'),
			h(Check, { label: 'Ok' }),
			h(Select, { label: 'Pick', options: [{ value: 'a', label: 'A' }] }),
			h(Image, { src: 'x.png', alt: 'x', round: true })
		),
		host
	);

	assert.ok(host.querySelector('.strike-btn.strike-btn--primary'));
	assert.ok(host.querySelector('.strike-field'));
	assert.ok(host.querySelector('.strike-text.strike-text--muted'));
	assert.ok(host.querySelector('.strike-check'));
	assert.ok(host.querySelector('.strike-select__control'));
	assert.ok(host.querySelector('img.strike-image.strike-image--round'));
	assert.equal(host.querySelector('img').getAttribute('alt'), 'x');
});

test('btn module source does not import select', () => {
	const dir = dirname(fileURLToPath(import.meta.url));
	const src = readFileSync(join(dir, '../ui/btn.js'), 'utf8');
	assert.equal(/select\.js/.test(src), false);
});

test('login demo imports field and btn only from ui', () => {
	const dir = dirname(fileURLToPath(import.meta.url));
	const src = readFileSync(join(dir, '../examples/login/app.jsx'), 'utf8');
	assert.ok(src.includes('strike-fw/ui/btn.js'));
	assert.ok(src.includes('strike-fw/ui/field.js'));
	assert.ok(src.includes('strike-fw/ui/text.js'));
	assert.equal(src.includes('ui/select.js'), false);
	assert.equal(src.includes('ui/image.js'), false);
});

