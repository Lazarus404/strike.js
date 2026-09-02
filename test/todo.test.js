import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHTML } from 'linkedom';
import { importExampleApp } from './import-example.js';

function installDom() {
	const { window } = parseHTML(
		'<html><head></head><body><div id="app"><i>Loading</i></div></body></html>'
	);
	Object.assign(globalThis, {
		document: window.document,
		window,
		HTMLElement: window.HTMLElement,
		customElements: window.customElements,
		requestAnimationFrame: cb => setTimeout(cb, 0)
	});
	return window;
}

test('todo add, toggle, filter, remove', async () => {
	const window = installDom();
	const { Todo } = await importExampleApp('todo');
	const { mount } = await import('../mount.js');

	mount('#app', Todo);
	const app = document.getElementById('app');
	const input = app.querySelector('input');
	const form = app.querySelector('form');

	input.value = 'Milk';
	input.dispatchEvent(new window.Event('input', { bubbles: true }));
	await Promise.resolve();
	form.dispatchEvent(
		new window.Event('submit', { bubbles: true, cancelable: true })
	);
	await Promise.resolve();

	input.value = 'Eggs';
	input.dispatchEvent(new window.Event('input', { bubbles: true }));
	await Promise.resolve();
	form.dispatchEvent(
		new window.Event('submit', { bubbles: true, cancelable: true })
	);
	await Promise.resolve();

	assert.match(app.textContent, /Milk/);
	assert.match(app.textContent, /Eggs/);

	const firstCheck = app.querySelector('input[type=checkbox]');
	firstCheck.dispatchEvent(new window.Event('change', { bubbles: true }));
	await Promise.resolve();

	const filters = [...app.querySelectorAll('.todo-filters button')];
	filters.find(b => b.textContent === 'done').click();
	await Promise.resolve();
	assert.match(app.textContent, /Milk/);
	assert.equal(app.textContent.includes('Eggs'), false);

	filters.find(b => b.textContent === 'open').click();
	await Promise.resolve();
	assert.match(app.textContent, /Eggs/);
	assert.equal(app.textContent.includes('Milk'), false);

	filters.find(b => b.textContent === 'all').click();
	await Promise.resolve();

	while (app.querySelector('.todo-list button')) {
		app.querySelector('.todo-list button').click();
		await Promise.resolve();
	}
	assert.equal(app.querySelectorAll('.todo-list li').length, 0);
});
