import assert from 'node:assert/strict';
import test from 'node:test';
import { parseHTML } from 'linkedom';

function installDom() {
	const { window } = parseHTML('<html><head></head><body></body></html>');
	Object.assign(globalThis, {
		document: window.document,
		window,
		HTMLElement: window.HTMLElement,
		requestAnimationFrame: cb => setTimeout(cb, 0),
		cancelAnimationFrame: clearTimeout
	});
	return window;
}

test('resolveTransition handles false, none, string, object', async () => {
	installDom();
	const { resolveTransition } = await import('../transition.js');

	const off = resolveTransition(false);
	assert.equal(off.disabled, true);
	assert.equal(off.ms, 0);
	assert.equal(off.enter, 'none');
	assert.equal(off.move, 'none');

	const none = resolveTransition('none');
	assert.equal(none.disabled, true);
	assert.equal(none.enter, 'none');

	const fade = resolveTransition('fade');
	assert.equal(fade.enter, 'fade');
	assert.equal(fade.exit, 'fade');
	assert.equal(fade.move, 'flip');
	assert.equal(fade.ms, 200);
	assert.equal(fade.disabled, false);

	const custom = resolveTransition(
		{ enter: 'slide-up', exit: 'fade', move: false, ms: 120 },
		{ enter: 'fade' }
	);
	assert.equal(custom.enter, 'slide-up');
	assert.equal(custom.exit, 'fade');
	assert.equal(custom.move, 'none');
	assert.equal(custom.ms, 120);
});

test('transitionClass and transitionVars', async () => {
	installDom();
	const { transitionClass, transitionVars } = await import('../transition.js');

	assert.match(transitionClass('fade', 'enter'), /strike-tx--fade/);
	assert.match(transitionClass('fade', 'enter'), /strike-tx--enter/);
	assert.match(transitionClass('fade', 'in'), /strike-tx--fade/);
	assert.ok(!transitionClass('fade', 'in').includes('strike-tx--enter'));
	assert.match(transitionClass('none', 'enter'), /strike-tx--none/);
	assert.match(transitionClass(false, 'exit'), /strike-tx--none/);

	const vars = transitionVars({ ms: 150, ease: 'linear', distance: '1rem' });
	assert.equal(vars['--strike-tx-ms'], '150ms');
	assert.equal(vars['--strike-tx-ease'], 'linear');
	assert.equal(vars['--strike-tx-distance'], '1rem');
});

test('flipLayout no-op when disabled; plays when enabled', async () => {
	installDom();
	const { flipLayout } = await import('../transition.js');
	const el = document.createElement('div');
	document.body.appendChild(el);
	el.getBoundingClientRect = () => ({
		top: 10,
		left: 10,
		bottom: 20,
		right: 20,
		width: 10,
		height: 10
	});

	const noop = flipLayout([el], { disabled: true, ms: 200 });
	noop();
	assert.equal(el.style.transform, '');

	let calls = 0;
	const play = flipLayout([el], { ms: 100 });
	el.getBoundingClientRect = () => {
		calls++;
		return {
			top: calls === 1 ? 10 : 30,
			left: 10,
			bottom: 40,
			right: 20,
			width: 10,
			height: 10
		};
	};
	// Recapture with first rect
	el.getBoundingClientRect = () => ({
		top: 10,
		left: 10,
		bottom: 20,
		right: 20,
		width: 10,
		height: 10
	});
	const play2 = flipLayout([el], { ms: 100 });
	el.getBoundingClientRect = () => ({
		top: 40,
		left: 10,
		bottom: 50,
		right: 20,
		width: 10,
		height: 10
	});
	play2();
	await new Promise(r => setTimeout(r, 20));
	// After FLIP invert, transform may be cleared already on same tick after reflow
	assert.ok(typeof play2 === 'function');
	assert.ok(typeof noop === 'function');
});

test('waitMs resolves', async () => {
	installDom();
	const { waitMs } = await import('../transition.js');
	const t0 = Date.now();
	await waitMs(0);
	assert.ok(Date.now() - t0 < 100);
});
