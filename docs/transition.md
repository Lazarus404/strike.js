---
title: Transitions
nav_order: 13
---

# strike-fw/transition

## What it is

Optional motion helpers: CSS presets, phase class names, FLIP layout moves, and
a small `useTransition` hook. **Not** folded into the main runtime.

## When to use it

- Enter / exit animations for panels or overlays
- FLIP moves when a list changes position
- Pairing with UI that opts into transitions (for example snackbar stacks in
  `strike-fw-ui`)

Skip this module if you do not need motion.

## Minimal example

```js
import {
  resolveTransition,
  transitionClass,
  transitionVars
} from 'strike-fw/transition';

const tx = resolveTransition('fade', { ms: 200 });
const className = transitionClass(tx.enter, 'enter');
const style = transitionVars({ ms: 180, distance: '0.75rem' });
```

## How it works

`resolveTransition` turns a preset name (or `false` / `'none'`) into enter /
exit / move config. You apply `transitionClass` / `transitionVars` to real DOM
nodes (or VNode props). Injected CSS respects `prefers-reduced-motion`.

`useTransition` tracks `enter` | `in` | `exit` for open/close UI and calls
`onExited` after the exit duration.

## API / options

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

### Presets

`fade`, `slide-up`, `slide-down`, `slide-start`, `slide-end`, `none`. Pass
`false` or `'none'` to disable.

```js
const tx = resolveTransition('fade', { ms: 200 });
// { enter, exit, move, ms, ease, distance, disabled }

const className = transitionClass(tx.enter, 'enter'); // strike-tx strike-tx--fade strike-tx--enter
const style = transitionVars({ ms: 180, distance: '0.75rem' });
```

### FLIP

```js
const cancel = flipLayout(elements, { ms: 200 });
// returns a cancel function
```

### useTransition

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

## Common mistakes

- Importing transitions but never putting `className` / `style` on an element --
  nothing will animate.
- Expecting the core `dist/strike.js` bundle to include this module -- import
  `strike-fw/transition` explicitly.
- Ignoring reduced-motion users -- presets disable via injected CSS, but custom
  CSS you add might not.

## See also

- [Strike UI](ui.md)
- [Hooks](hooks.md)
- [Setup](setup.md)
