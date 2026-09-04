---
title: Debug
nav_order: 12
---

# installDebug

Dev helpers. Import only in development.

```js
import { installDebug } from 'strike-fw/debug';

const stop = installDebug();
// logs [strike] diff <type> <key>
// logs [strike] hydrate mismatch ...

stop(); // restore previous options hooks
```

Options:

```js
installDebug({
  log: console.log.bind(console),
  diff: false, // skip diff logs
  vnode: node => {
    // extra vnode inspection (chains after prior options.vnode)
  }
});
```

Hooks `options._diff`, `options._hydrationMismatch`, and optionally
`options.vnode`. Does not change production behavior when unused.
