import assert from 'node:assert/strict';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { installDom } from './dom.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('site navigates between pages via hash', async () => {
	const { window, location } = installDom(
		'<html><head></head><body><div id="app"><i>Loading</i></div></body></html>',
		'#/'
	);
	await import(
		pathToFileURL(join(root, 'examples/site/app.js')).href + '?t=' + Date.now()
	);
	await Promise.resolve();

	const app = document.getElementById('app');
	assert.match(app.textContent, /Quiet tools/);

	location.hash = '#/about';
	window.dispatchEvent({ type: 'hashchange' });
	await Promise.resolve();
	assert.match(app.textContent, /function components/);
	assert.equal(app.textContent.includes('Quiet tools'), false);

	location.hash = '#/work';
	window.dispatchEvent({ type: 'hashchange' });
	await Promise.resolve();
	assert.match(app.textContent, /Harbor desk/);

	location.hash = '#/contact';
	window.dispatchEvent({ type: 'hashchange' });
	await Promise.resolve();
	assert.ok(app.querySelector('form'));
});
