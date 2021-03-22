import { strict as assert } from 'node:assert';
import test from './harness.js';
import { parseHTML } from 'linkedom';

import { h, render, Component } from '../index.js';
import { css } from '../css.js';
import { define } from '../define.js';
import { html } from '../html.js';
import { useState } from '../hooks.js';
import { mount, unmount, register } from '../mount.js';

function installDom() {
  const { window } = parseHTML('<html><head></head><body></body></html>');
  Object.assign(globalThis, {
    document: window.document,
    window,
    HTMLElement: window.HTMLElement,
    customElements: window.customElements,
    requestAnimationFrame: callback => setTimeout(callback, 0),
  });
  return window;
}

test('render updates matching DOM in place', () => {
  installDom();
  const host = document.createElement('div');

  render(h('p', null, 'one'), host);
  const paragraph = host.firstChild;
  render(h('p', null, 'two'), host);

  assert.equal(host.firstChild, paragraph);
  assert.equal(paragraph.textContent, 'two');
});

test('mount replaces a placeholder then preserves hook state on update', async () => {
  const window = installDom();
  const host = document.createElement('div');
  host.innerHTML = '<i>Loading</i>';

  function Counter({ label }) {
    const [count, setCount] = useState(0);
    return h(
      'button',
      { onClick: () => setCount(value => value + 1) },
      `${label}:${count}`,
    );
  }

  mount(host, Counter, { label: 'A' });
  host.firstChild.dispatchEvent(new window.Event('click', { bubbles: true }));
  await Promise.resolve();
  mount(host, Counter, { label: 'B' });

  assert.equal(host.textContent, 'B:1');
});

test('mount creates independent component instances per host', async () => {
  const window = installDom();
  const first = document.createElement('div');
  const second = document.createElement('div');

  function Counter() {
    const [count, setCount] = useState(0);
    return h('button', { onClick: () => setCount(count + 1) }, count);
  }

  mount(first, Counter);
  mount(second, Counter);
  first.firstChild.dispatchEvent(new window.Event('click', { bubbles: true }));
  await Promise.resolve();

  assert.equal(first.textContent, '1');
  assert.equal(second.textContent, '0');
  unmount(first);
  assert.equal(first.childNodes.length, 0);
});

test('css injects each template once', () => {
  installDom();
  const theme = () => css`.strike-btn { color: red }`;

  theme();
  theme();

  assert.equal(document.head.querySelectorAll('style[data-strike]').length, 1);
  assert.equal(document.head.textContent.includes('.strike-btn'), true);
});

test('html produces the same vnode model', () => {
  installDom();
  const host = document.createElement('div');

  render(html`<button class="strike-btn">${'Go'}</button>`, host);

  assert.equal(host.innerHTML, '<button class="strike-btn">Go</button>');
});

test('define mounts a component and maps observed attributes to props', async () => {
  installDom();

  function Greeting({ name }) {
    return h('p', null, `Hello ${name}`);
  }

  define('strike-greeting', Greeting, { props: ['name'] });
  const element = document.createElement('strike-greeting');
  element.setAttribute('name', 'Ada');
  document.body.append(element);
  await Promise.resolve();

  assert.equal(element.textContent, 'Hello Ada');
  element.setAttribute('name', 'Grace');
  await Promise.resolve();
  assert.equal(element.textContent, 'Hello Grace');
});

test('keyed reorder keeps DOM identity', () => {
  installDom();
  const host = document.createElement('div');

  function List({ order }) {
    return h(
      'div',
      null,
      order.map(id => h('input', { key: id, id: 'i' + id, value: id })),
    );
  }

  render(h(List, { order: ['a', 'b', 'c'] }), host);
  const inputB = host.querySelector('#ib');
  if (typeof inputB.focus === 'function') inputB.focus();
  render(h(List, { order: ['c', 'a', 'b'] }), host);

  assert.equal(host.querySelector('#ib'), inputB);
  assert.deepEqual(
    [...host.querySelectorAll('input')].map(n => n.id),
    ['ic', 'ia', 'ib'],
  );
});

test('swapping sibling component types removes prior DOM', () => {
  installDom();
  const host = document.createElement('div');
  function A() {
    return h('p', { class: 'a' }, 'A');
  }
  function B() {
    return h('p', { class: 'b' }, 'B');
  }
  render(h('main', null, h(A)), host);
  render(h('main', null, h(B)), host);
  assert.equal(host.querySelectorAll('p').length, 1);
  assert.equal(host.querySelector('p').className, 'b');
});

test('mount reads data-props when props omitted', () => {
  installDom();
  const host = document.createElement('div');
  host.setAttribute('data-props', '{"name":"Ada"}');
  document.body.append(host);

  function Greeting({ name }) {
    return h('p', null, `Hello ${name}`);
  }

  mount(host, Greeting);
  assert.equal(host.textContent, 'Hello Ada');
});

test('useErrorBoundary catches child render errors', async () => {
  installDom();
  const { useErrorBoundary } = await import('../hooks.js');
  const host = document.createElement('div');

  function Boom() {
    throw new Error('boom');
  }

  function Boundary() {
    const [err, reset] = useErrorBoundary();
    if (err) return h('span', { onClick: reset }, 'caught:' + err.message);
    return h(Boom);
  }

  render(h(Boundary), host);
  await Promise.resolve();
  assert.equal(host.textContent, 'caught:boom');
});

test('mount selector attaches every match independently', async () => {
  const window = installDom();
  document.body.innerHTML = '<div class="island"></div><div class="island"></div>';

  function Counter() {
    const [count, setCount] = useState(0);
    return h('button', { onClick: () => setCount(count + 1) }, String(count));
  }

  const hosts = mount('.island', Counter);
  assert.equal(hosts.length, 2);
  hosts[0].firstChild.dispatchEvent(new window.Event('click', { bubbles: true }));
  await Promise.resolve();
  assert.equal(hosts[0].textContent, '1');
  assert.equal(hosts[1].textContent, '0');
});

test('first render reuses matching existing DOM', () => {
  installDom();
  const host = document.createElement('div');
  host.innerHTML = '<p>one</p>';
  const paragraph = host.firstChild;

  render(h('p', null, 'two'), host);

  assert.equal(host.firstChild, paragraph);
  assert.equal(paragraph.textContent, 'two');
});

test('getDerivedStateFromError recovers with class boundary', async () => {
  installDom();
  const host = document.createElement('div');

  function Boom() {
    throw new Error('explode');
  }

  class Boundary extends Component {
    constructor(props) {
      super(props);
      this.state = { err: null };
    }
    static getDerivedStateFromError(err) {
      return { err };
    }
    render(props, state) {
      if (this.state.err) return h('span', null, 'safe');
      return h(Boom);
    }
  }

  render(h(Boundary), host);
  await Promise.resolve();
  assert.equal(host.textContent, 'safe');
});

test('define shadow renders into shadow root', async () => {
  installDom();

  function Label({ text }) {
    return h('span', null, text);
  }

  define('strike-shadow', Label, { props: ['text'], shadow: true });
  const el = document.createElement('strike-shadow');
  el.setAttribute('text', 'Hi');
  document.body.append(el);
  await Promise.resolve();

  assert.equal(el.shadowRoot != null, true);
  assert.equal(el.shadowRoot.childNodes.length > 0, true);
  assert.equal(el.shadowRoot.firstChild.textContent, 'Hi');
  assert.equal(el.childNodes.length, 0);
});

test('svg camelCase attrs become kebab attributes', () => {
  installDom();
  const host = document.createElement('div');
  render(h('svg', null, h('circle', { strokeWidth: 2, cx: 1, cy: 1, r: 1 })), host);
  const circle = host.querySelector('circle');
  assert.equal(circle.getAttribute('stroke-width'), '2');
});

test('register resolves component name for mount', () => {
  installDom();
  const host = document.createElement('div');
  host.id = 'greet';
  document.body.append(host);

  function Greeting({ name }) {
    return h('p', null, `Hi ${name}`);
  }

  register('greet', Greeting);
  mount('#greet', 'greet', { name: 'Ada' });
  assert.equal(host.textContent, 'Hi Ada');
});
