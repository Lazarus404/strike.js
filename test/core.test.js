import { strict as assert } from 'node:assert';
import test from './harness.js';

import {
  Fragment,
  cloneElement,
  createElement,
  createRef,
  h,
  isValidElement,
  toChildArray,
} from '../index.js';

test('h creates a valid keyed vnode with children', () => {
  const vnode = h('button', { key: 'save', class: 'primary' }, 'Save');

  assert.equal(vnode.type, 'button');
  assert.equal(vnode.key, 'save');
  assert.equal(vnode.props.class, 'primary');
  assert.equal(vnode.props.children, 'Save');
  assert.equal(vnode.constructor, undefined);
  assert.equal(isValidElement(vnode), true);
});

test('fragment, clone, refs, and child flattening share the vnode model', () => {
  const original = createElement('span', { id: 'a' }, 'A');
  const clone = cloneElement(original, { id: 'b' });
  const ref = createRef();

  assert.equal(Fragment({ children: 'x' }), 'x');
  assert.equal(clone.props.id, 'b');
  assert.equal(clone.props.children, 'A');
  assert.deepEqual(ref, { current: null });
  assert.deepEqual(toChildArray([null, 'a', ['b'], false]), ['a', 'b']);
});
