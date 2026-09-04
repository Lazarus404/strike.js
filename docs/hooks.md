---
title: Hooks
nav_order: 5
---

# Hooks

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

Hooks run only inside function components (same rules as React-shaped hooks).

## State

```js
const [n, setN] = useState(0);
setN(1);
setN(x => x + 1);

const [state, dispatch] = useReducer(reducer, initial);
const [state, dispatch] = useReducer(reducer, arg, init); // init(arg)
```

## Effects

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

## Refs, memo, callback, id

```js
const ref = useRef(null); // { current }
const value = useMemo(() => expensive(a), [a]);
const onClick = useCallback(() => save(id), [id]);
const id = useId(); // stable string id for labels / aria
```

## Context and errors

```js
const theme = useContext(Theme);

const [error, reset] = useErrorBoundary(err => {
  console.error(err);
});
if (error) return h('p', null, 'Failed', h('button', { onClick: reset }, 'Retry'));
```
