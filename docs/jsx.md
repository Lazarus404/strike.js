---
title: JSX
nav_order: 9
---

# JSX

## What it is

JSX is HTML-like syntax in JavaScript that a bundler compiles into `h` calls
(or the automatic JSX runtime). Strike supports automatic and classic modes.

## When to use it

- You already have Vite, esbuild, or similar
- You want component files that read like markup

If you want no transform, use [html.md](html.md) or plain `h` instead. See
[jsx-or-html.md](jsx-or-html.md).

## Minimal example

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

## How it works

With **automatic** runtime, the bundler imports helpers from
`strike-fw/jsx-runtime` (and `jsx-dev-runtime` in development). You do not
import `h` in app source. The wrapper keeps `key` out of children (it is not
treated as a child prop).

With **classic** factory, JSX becomes `h(...)` and you import `h` / `Fragment`
yourself.

## API / options

### Automatic runtime

Bundler settings:

```js
// esbuild / similar
{
  jsx: 'automatic',
  jsxImportSource: 'strike-fw'
}
```

Entries: `strike-fw/jsx-runtime` and `strike-fw/jsx-dev-runtime`.

### Classic factory

```js
// jsxFactory: 'h', jsxFragment: 'Fragment'
import { h, Fragment } from 'strike-fw';
```

### In-repo examples

Examples under `examples/` compile JSX with `npm run build:jsx` and load Strike
from the CDN pin in `examples/cdn.mjs`. Bump that pin when pointing examples at
a newer release.

## Common mistakes

- Forgetting `jsxImportSource: 'strike-fw'` (the transform looks in the wrong
  package).
- Classic mode without `import { h, Fragment } from 'strike-fw'`.
- Expecting `key` to appear as a normal prop on your component -- it is for
  list identity during diff.
- Trying to run raw `.jsx` in the browser with no build step.

## See also

- [JSX or html templates](jsx-or-html.md)
- [Setup](setup.md)
- [Hooks](hooks.md)
- [html templates](html.md)
