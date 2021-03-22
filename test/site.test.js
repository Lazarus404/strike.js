import { strict as assert } from 'node:assert';
import test from './harness.js';
import { parseHTML } from 'linkedom';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function installDom(hash = '#/') {
	const { window } = parseHTML(
		'<html><head></head><body><div id="app"><i>Loading</i></div></body></html>'
	);
	const location = {
		hash,
		href: 'http://localhost/' + hash,
		assign() {},
		replace() {}
	};
	const listeners = Object.create(null);
	window.addEventListener = (type, fn) => {
		(listeners[type] || (listeners[type] = [])).push(fn);
	};
	window.removeEventListener = (type, fn) => {
		listeners[type] = (listeners[type] || []).filter(f => f !== fn);
	};
	window.dispatchEvent = ev => {
		for (const fn of listeners[ev.type] || []) fn(ev);
		return true;
	};
	Object.assign(globalThis, {
		document: window.document,
		window,
		location,
		HTMLElement: window.HTMLElement,
		customElements: window.customElements,
		requestAnimationFrame: cb => setTimeout(cb, 0)
	});
	return { window, location };
}

test('site navigates between pages via hash', async () => {
	const { window, location } = installDom('#/');
	// Side-effect mount from the module; do not remount.
	await import(
		pathToFileURL(join(root, 'examples/site/app.js')).href + '?t=' + Date.now()
	);
	await Promise.resolve();

	const app = document.getElementById('app');
	assert.match(app.textContent, /Quiet tools/);
	assert.match(app.textContent, /Northline/);

	location.hash = '#/about';
	window.dispatchEvent({ type: 'hashchange' });
	await Promise.resolve();
	assert.match(app.textContent, /About/);
	assert.match(app.textContent, /function components/);
	assert.equal(app.textContent.includes('Quiet tools'), false);

	location.hash = '#/work';
	window.dispatchEvent({ type: 'hashchange' });
	await Promise.resolve();
	assert.match(app.textContent, /Harbor desk/);

	location.hash = '#/contact';
	window.dispatchEvent({ type: 'hashchange' });
	await Promise.resolve();
	assert.match(app.textContent, /Contact/);
	assert.ok(app.querySelector('form'));
});
