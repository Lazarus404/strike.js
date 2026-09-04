---
title: JSX
nav_order: 6
---

# JSX

## Automatic runtime

No `h` import in app source. Bundler settings:

```js
// esbuild / similar
{
  jsx: 'automatic',
  jsxImportSource: 'strike-fw'
}
```

```js
import { useState } from 'strike-fw/hooks';

export function Counter() {
  const [n, setN] = useState(0);
  return (
    <button type="button" onClick={() => setN(n + 1)}>
      {n}
    </button>
  );
}
```

Entries: `strike-fw/jsx-runtime` and `strike-fw/jsx-dev-runtime`. The wrapper
keeps `key` out of children (it is not treated as a child prop).

## Classic factory

```js
// jsxFactory: 'h', jsxFragment: 'Fragment'
import { h, Fragment } from 'strike-fw';
```

## In-repo examples

Examples under `examples/` compile JSX with `npm run build:jsx` and load Strike
from the CDN pin in `examples/cdn.mjs`. Bump that pin when pointing examples at
a newer release.
