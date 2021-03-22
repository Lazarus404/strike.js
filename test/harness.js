/**
 * Tiny test runner for Node 14.16+ (no node:test).
 * Collects test() calls, then run() executes them in order.
 */
import { strict as assert } from 'node:assert';

const queue = [];

export default function test(name, fn) {
	queue.push({ name, fn });
}

export { assert };

export async function run() {
	let failed = 0;
	for (let i = 0; i < queue.length; i++) {
		const t = queue[i];
		const start = Date.now();
		try {
			await t.fn();
			console.log('ok ' + (i + 1) + ' - ' + t.name + ' (' + (Date.now() - start) + 'ms)');
		} catch (err) {
			failed++;
			console.error('not ok ' + (i + 1) + ' - ' + t.name);
			console.error(err && err.stack ? err.stack : err);
		}
	}
	console.log('# tests ' + queue.length);
	console.log('# pass ' + (queue.length - failed));
	console.log('# fail ' + failed);
	if (failed) process.exitCode = 1;
}
