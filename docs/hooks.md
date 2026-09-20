---
title: Hooks
nav_order: 8
---

# Hooks

## What it is

Hooks let function components hold state, run effects, read context, and more.
Import them from `strike-fw/hooks`.

## When to use it

- Local UI state (`useState`, `useReducer`)
- Subscriptions, timers, or DOM side effects (`useEffect`, `useLayoutEffect`)
- Stable ids for labels / aria (`useId`)
- Catching render errors in a subtree (`useErrorBoundary`)

## Minimal example

```js
import { h, render } from 'strike-fw';
import { useState } from 'strike-fw/hooks';

function Counter() {
  const [n, setN] = useState(0);
  return h(
    'button',
    { type: 'button', onClick: () => setN(n + 1) },
    n
  );
}

render(h(Counter), document.getElementById('root'));
```

## How it works

Hooks run only inside function components. Call them at the **top level** of
the component function (not inside loops, conditions, or nested helpers) so
Strike can match hook calls to the same slots on every render.

`useState` returns the current value and a setter. The setter can take a next
value or an updater function `x => next`. After you set state, Strike re-runs
the component and diffs the new tree.

## API / options

```js
import {
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
  useErrorBoundary,
  useId
} from 'strike-fw/hooks';
```

### State

```js
const [n, setN] = useState(0);
setN(1);
setN(x => x + 1);

const [state, dispatch] = useReducer(reducer, initial);
const [state, dispatch] = useReducer(reducer, arg, init); // init(arg)
```

### Effects

```js
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, [tick]);

useLayoutEffect(() => {
  // runs after DOM patch, before paint (needed for DOM measurements / flags)
}, [deps]);
```

`useLayoutEffect` also runs on component *updates*, not only mount (needed for
controls like `Check` indeterminate after selection changes).

Omit `deps` to run every commit. Pass `[]` for mount/unmount only.

### Refs, memo, callback, id

```js
const ref = useRef(null); // { current }
const value = useMemo(() => expensive(a), [a]);
const onClick = useCallback(() => save(id), [id]);
const id = useId(); // stable string id for labels / aria
```

### Context and errors

```js
const theme = useContext(Theme);

const [error, reset] = useErrorBoundary(err => {
  console.error(err);
});
if (error) return h('p', null, 'Failed', h('button', { onClick: reset }, 'Retry'));
```

Create the context object with `createContext` from `strike-fw` (see
[render.md](render.md)).

## Common mistakes

- Calling hooks inside `if` / loops -- breaks the stable order Strike expects.
- Forgetting the cleanup function for intervals, listeners, or subscriptions.
- Assuming `useLayoutEffect` runs only once on mount -- it also runs on updates.
- Omitting dependency arrays when you meant "run once" -- use `[]` explicitly.
- Using hooks outside a function component (or in a plain event handler module).

## See also

- [Your first app](first-app.md)
- [Render](render.md) -- context providers
- [JSX](jsx.md)
- [Strike UI](ui.md)
