import assert from 'node:assert/strict';
import test from 'node:test';
import { installDom } from './dom.js';
import { importExampleApp } from './import-example.js';

test('site navigates between pages via hash', async () => {
	const { window, location } = installDom(
		'<html><head></head><body><div id="app"><i>Loading</i></div></body></html>',
		'#/'
	);
	await importExampleApp('site');
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
