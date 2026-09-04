---
title: Transitions
nav_order: 10
---

# strike-fw/transition

Optional. Not folded into the main runtime. CSS presets, phase helpers, FLIP
layout moves, and a small hook.

```js
import {
  resolveTransition,
  transitionClass,
  transitionVars,
  waitMs,
  flipLayout,
  useTransition
} from 'strike-fw/transition';
```

## Presets

`fade`, `slide-up`, `slide-down`, `slide-start`, `slide-end`, `none`. Pass
`false` or `'none'` to disable.

```js
const tx = resolveTransition('fade', { ms: 200 });
// { enter, exit, move, ms, ease, distance, disabled }

const className = transitionClass(tx.enter, 'enter'); // strike-tx strike-tx--fade strike-tx--enter
const style = transitionVars({ ms: 180, distance: '0.75rem' });
```

Respects `prefers-reduced-motion` via injected CSS.

## FLIP

```js
const cancel = flipLayout(elements, { ms: 200 });
// returns a cancel function
```

## useTransition

```js
function Panel({ open, onExited }) {
  const { phase, className, style, requestExit } = useTransition({
    name: 'fade',
    open,
    onExited
  });
  return h('div', { class: className, style }, phase, /* ... */);
}
```

`phase` is `enter` | `in` | `exit`. Call `requestExit()` to leave; `onExited`
fires after the exit duration (`waitMs`).

Used by snackbar stacks in `strike-fw-ui` when `transition` is enabled.
