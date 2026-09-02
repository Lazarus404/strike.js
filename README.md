<p align="center">
  <img src="assets/strike-logo.png" alt="strike.js" width="420" />
</p>

<small align="center">

[![npm](https://img.shields.io/npm/v/strike-fw.svg)](https://www.npmjs.com/package/strike-fw)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/strike-fw/badge)](https://www.jsdelivr.com/package/npm/strike-fw)

</small>

Small browser VDOM runtime plus an optional UI catalog. Requires a DOM (not a Node-first server runtime).

```bash
npm i strike-fw
```

## Runtime

```js
import { h, render, mount } from 'strike-fw';
import { useState } from 'strike-fw/hooks';
```

CDN (core + hooks):

```html
<script type="module">
  import { h, render, useState } from 'https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/dist/strike.core+hooks.js';
</script>
```

Also on unpkg: `https://unpkg.com/strike-fw@0.2.0/dist/strike.core+hooks.js`.

Prebuilt files under `dist/` (after install or `npm run build`):

| File | Role | ~gzip |
|------|------|-------|
| `dist/strike.js` | core | ~5.0kb |
| `dist/strike.core+hooks.js` | core + hooks | ~5.8kb |
| `dist/strike-ui.js` | UI catalog (imports core) | ~4.3kb |
| `dist/html.js` | `html` templates | ~1.1kb |

```bash
npm test
npm run build
npm run size
```

## JSX

Automatic runtime — no `h` import in app source:

```js
// bundler: jsx: 'automatic', jsxImportSource: 'strike-fw'
import { useState } from 'strike-fw/hooks';

export function Counter() {
  const [n, setN] = useState(0);
  return <button type="button" onClick={() => setN(n + 1)}>{n}</button>;
}
```

Classic `jsxFactory: 'h'` still works with `import { h } from 'strike-fw'`.

## No-build `html`

```js
import { html } from 'strike-fw/html';
import { render } from 'strike-fw';

render(html`<button .disabled=${busy} @click=${save}>Save</button>`, root);
```

Prefixes: `.prop`, `?bool`, `@event`. Still VNodes — same `diff` as JSX.

## Islands / hydrate

```html
<div id="cart" data-hydrate data-props='{"n":2}'></div>
```

```js
import { mount } from 'strike-fw';

mount('#cart', Cart); // or mount(el, Cart, null, { hydrate: true })
```

First attach reuses matching markup; later `mount` updates without wiping state.

## Strike UI

Import only what you need:

```js
import { Btn } from 'strike-fw/ui/btn.js';
import { Field } from 'strike-fw/ui/field.js';
import { Dialog } from 'strike-fw/ui/dialog.js';
```

Or the barrel: `import { Btn, Field } from 'strike-fw/ui'`.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/strike-fw@0.2.0/ui/tokens.css" />
```

Optional all-in CSS: `strike-fw/ui.css`. Optional CDN UI bundle: `dist/strike-ui.js` (peer to `dist/strike.core+hooks.js`).

Per-control modules self-inject CSS via the `css` tagged template. The catalog is never folded into `dist/strike.js`.

Controls: `stack`, `text`, `btn`, `field`, `check`, `select`, `image`, `form`, `switch`, `dialog`, `radio-group`, `number-field`, `btn-group`, `toggle-group`, `autocomplete`.

## Debug

```js
import { installDebug } from 'strike-fw/debug';
const stop = installDebug(); // logs diffs / hydrate mismatches
```

## Demo

[Harbor Goods](https://github.com/Lazarus404/strike.js-demo) — ecommerce SPA that consumes Strike dist only.

In-repo examples (relative source imports):

```bash
npm run build:jsx
python3 -m http.server 8080
```

- [http://localhost:8080/examples/todo/](http://localhost:8080/examples/todo/)
- [http://localhost:8080/examples/login/](http://localhost:8080/examples/login/)
- [http://localhost:8080/examples/site/](http://localhost:8080/examples/site/)

## Publishing (maintainers)

No remote CI — run locally before a release:

1. `npm test`
2. `npm run build && npm run size`
3. `npm pack --dry-run` (confirm no `test/`, `examples/`, secrets)
4. `npm publish --access public`
5. `git tag v0.2.0 && git push --tags`

`prepublishOnly` runs `npm test && node build.mjs` so `dist/` is always in the tarball.

## Licence

[MIT](./LICENSE) — Copyright (c) 2021 Jahred Love
