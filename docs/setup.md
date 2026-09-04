---
title: Setup
nav_order: 2
---

# Install and bundles

Requires Node 18+ for tooling. Runtime needs a browser DOM (or linkedom in
tests).

```bash
npm i strike-fw
```

## Imports

```js
import { h, render, mount } from 'strike-fw';
import { useState } from 'strike-fw/hooks';
```

Entry points (see `package.json` `exports`):

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

## CDN

Core + hooks:

```html
<script type="module">
  import { h, render, useState } from
    'https://cdn.jsdelivr.net/npm/strike-fw@0.2.1/dist/strike.core+hooks.js';
</script>
```

Also on unpkg: `https://unpkg.com/strike-fw@0.2.1/dist/strike.core+hooks.js`.

## Dist files

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
  href="https://cdn.jsdelivr.net/npm/strike-fw@0.2.1/ui/tokens.css" />
```

Optional all-in CSS: `strike-fw/ui.css`. The catalog is never folded into
`dist/strike.js` -- import a control (or the UI bundle) to include it.
