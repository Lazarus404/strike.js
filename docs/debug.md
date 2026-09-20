---
title: Debug
nav_order: 15
---

# installDebug

## What it is

Development helpers that log diffs and hydrate mismatches. Import only in
development.

## When to use it

- Investigating unexpected DOM updates
- Debugging island / hydrate mismatches
- Teaching yourself what the patch cycle is doing

Do not ship this to production bundles.

## Minimal example

```js
import { installDebug } from 'strike-fw/debug';

const stop = installDebug();
// logs [strike] diff <type> <key>
// logs [strike] hydrate mismatch ...

stop(); // restore previous options hooks
```

## How it works

`installDebug` hooks `options._diff`, `options._hydrationMismatch`, and
optionally `options.vnode` (see [render.md](render.md)). It does not change
production behavior when unused -- you have to import and call it.

Call the returned `stop` function to restore previous hooks.

## API / options

```js
installDebug({
  log: console.log.bind(console),
  diff: false, // skip diff logs
  vnode: node => {
    // extra vnode inspection (chains after prior options.vnode)
  }
});
```

| Option | Meaning |
|--------|---------|
| `log` | Logger function (default: console-style) |
| `diff` | Set `false` to skip diff logs |
| `vnode` | Extra vnode inspection callback |

## Common mistakes

- Leaving `installDebug()` in a production entry -- keep it behind a dev-only
  import or flag.
- Forgetting to call `stop()` in tests or HMR scenarios that re-install hooks.
- Expecting it to fix bugs -- it only logs; you still change app code.

## See also

- [Render](render.md) -- `options`
- [Mount and hydrate](mount.md)
- [Setup](setup.md)
