import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('docs cover setup render hooks jsx html and ui', function () {
	const index = readFileSync(new URL('../docs/index.md', import.meta.url), 'utf8');
	const setup = readFileSync(new URL('../docs/setup.md', import.meta.url), 'utf8');
	const render = readFileSync(new URL('../docs/render.md', import.meta.url), 'utf8');
	const mount = readFileSync(new URL('../docs/mount.md', import.meta.url), 'utf8');
	const hooks = readFileSync(new URL('../docs/hooks.md', import.meta.url), 'utf8');
	const jsx = readFileSync(new URL('../docs/jsx.md', import.meta.url), 'utf8');
	const html = readFileSync(new URL('../docs/html.md', import.meta.url), 'utf8');
	const ui = readFileSync(new URL('../docs/ui.md', import.meta.url), 'utf8');
	const transition = readFileSync(
		new URL('../docs/transition.md', import.meta.url),
		'utf8'
	);
	assert.match(index, /setup\.md/);
	assert.match(index, /transition\.md/);
	assert.match(setup, /strike\.core\+hooks\.js|dist\/strike/);
	assert.match(render, /createPortal|createContext/);
	assert.match(mount, /data-hydrate|register/);
	assert.match(hooks, /useLayoutEffect|useErrorBoundary/);
	assert.match(jsx, /jsxImportSource|automatic/);
	assert.match(html, /\.prop|\?bool|@event/);
	assert.match(ui, /Btn|Dialog|Autocomplete/);
	assert.match(transition, /useTransition|flipLayout/);
});
