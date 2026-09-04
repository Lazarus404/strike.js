---
title: Render
nav_order: 3
---

# h, render, portals, context

## h / createElement

```js
import { h, render, Fragment } from 'strike-fw';

function App() {
  return h('div', { class: 'app' }, h('p', null, 'Hello'));
}

render(h(App), document.getElementById('root'));
```

`h` and `createElement` are the same. Props use DOM-ish names (`class`,
`onClick`). Children may be VNodes, strings, numbers, arrays, or falsy
(skipped).

## Fragment, refs, clone

```js
import {
  h,
  Fragment,
  createRef,
  cloneElement,
  isValidElement,
  toChildArray
} from 'strike-fw';

h(Fragment, null, h('li', null, 'a'), h('li', null, 'b'));

const ref = createRef();
h('input', { ref });

cloneElement(vnode, { id: 'x' });
isValidElement(vnode); // true for Strike VNodes
toChildArray(children); // flat list, drops null/false
```

## render and hydrate

```js
import { render, hydrate } from 'strike-fw';

render(vnode, parent); // replace children under parent
hydrate(vnode, parent); // reuse matching markup, wire events
```

Prefer `mount` with `data-hydrate` for islands (see `mount.md`). Call
`hydrate` directly when you already own the parent node.

## Portals

```js
import { h, createPortal, render } from 'strike-fw';

function Modal({ children }) {
  return createPortal(h('div', { class: 'modal' }, children), document.body);
}
```

A portal returned from a component stays on the portal target across updates.

## Context

```js
import { h, createContext } from 'strike-fw';
import { useContext } from 'strike-fw/hooks';

const Theme = createContext('light');

function App() {
  return h(Theme.Provider, { value: 'dark' }, h(Child));
}

function Child() {
  const theme = useContext(Theme);
  return h('span', null, theme);
}
```

Also `Theme.Consumer` with a render-prop child.

## Class components

`Component` supports `setState`, lifecycle hooks, and
`static getDerivedStateFromError` / `useErrorBoundary` for error UI.

## options

```js
import { options } from 'strike-fw';

options.vnode = node => { /* inspect every vnode */ };
options.diffed = node => {};
options.unmount = node => {};
options.event = e => e; // wrap DOM events
options.debounceRendering = fn => queueMicrotask(fn);
```

Used by `strike-fw/debug` and advanced tooling. Prefer not to touch unless you
need hooks into the patch cycle.
