---
title: Setup
nav_order: 5
---

# Install and bundles

## What it is

How to install `strike-fw` and choose an **entry point**: the main package,
hooks, JSX runtime, `html`, `css`, UI controls, transitions, custom elements,
or debug helpers. You can also load prebuilt files from a CDN.

## When to use it

- Starting a new Strike app with npm
- Dropping Strike into a page with a `<script type="module">` and no bundler
- Picking the smallest bundle that includes what you need

Requires Node 18+ for tooling. The runtime needs a browser DOM (or linkedom in
tests).

## Minimal example

```bash
npm i strike-fw
```

```js
import { h, render, mount } from 'strike-fw';
import { useState } from 'strike-fw/hooks';
```

## How it works

`package.json` `exports` map import paths to files. Import only what you use:

- App logic -> `strike-fw` + `strike-fw/hooks`
- JSX -> configure the bundler (see [jsx.md](jsx.md)); runtime comes from
  `strike-fw/jsx-runtime`
- No-build markup -> `strike-fw/html`
- Catalog controls -> `strike-fw/ui/btn.js` (or the barrel) plus tokens CSS

CDN builds under `dist/` bundle common combinations so a browser can import
them directly.

## API / options

### Imports

| Import | Role |
|--------|------|
| `strike-fw` | h, render, hydrate, mount, portals, context |
| `strike-fw/hooks` | hooks |
| `strike-fw/jsx-runtime` | automatic JSX |
| `strike-fw/html` | `html` templates |
| `strike-fw/css` | inject styles once |
| `strike-fw/ui` | UI barrel |
| `strike-fw/ui/btn.js` | single control |
| `strike-fw/transition` | optional motion helpers |
| `strike-fw/ce` | `define` custom elements |
| `strike-fw/debug` | dev logging |

### CDN

Core + hooks:

```html
<script type="module">
  import { h, render, useState } from
    'https://cdn.jsdelivr.net/npm/strike-fw@0.2.2/dist/strike.core+hooks.js';
</script>
```

Also on unpkg: `https://unpkg.com/strike-fw@0.2.2/dist/strike.core+hooks.js`.

### Dist files

After install or `npm run build`:

| File | Role | ~gzip |
|------|------|-------|
| `dist/strike.js` | core | ~5.1kb |
| `dist/strike.core+hooks.js` | core + hooks | ~5.8kb |
| `dist/strike-ui.js` | UI catalog (imports core) | ~4.4kb |
| `dist/html.js` | `html` templates | ~1.1kb |

```bash
npm test
npm run build
npm run size
```

Tokens CSS for the catalog:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/strike-fw@0.2.2/ui/tokens.css" />
```

Optional all-in CSS: `strike-fw/ui.css`. The catalog is never folded into
`dist/strike.js` -- import a control (or the UI bundle) to include it.

## Common mistakes

- Using `dist/strike.js` (core only) then calling `useState` -- use
  `strike.core+hooks.js` or import `strike-fw/hooks`.
- Importing UI controls without loading `ui/tokens.css` (or `ui.css`).
- Expecting Strike to run in plain Node without a DOM.
- Pinning a CDN version that does not match the docs or release you meant.

## See also

- [Your first app](first-app.md)
- [JSX](jsx.md)
- [Strike UI](ui.md)
- [Concepts](concepts.md)
