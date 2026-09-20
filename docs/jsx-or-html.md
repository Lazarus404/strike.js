---
title: JSX or html templates
nav_order: 4
---

# JSX or html templates

**Goal:** pick a UI syntax. Both produce VNodes and use the same `diff`.

You already built a Counter with `h(...)` in [first-app.md](first-app.md).
JSX and `html` are two nicer ways to write the same trees.

## JSX (bundler)

JSX looks like HTML inside JavaScript. A bundler turns it into `h` calls.

Settings (esbuild / similar):

```js
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
      Clicked {n} times
    </button>
  );
}
```

No `h` import in app source with the automatic runtime. Details:
[jsx.md](jsx.md).

**Choose JSX when** you already use a bundler and like component files that
read like markup.

## `html` tagged templates (no-build)

```js
import { html } from 'strike-fw/html';
import { render } from 'strike-fw';

render(
  html`<button .disabled=${busy} @click=${save}>Save</button>`,
  root
);
```

Prefixes (not the same as raw HTML attributes):

| Prefix | Meaning |
|--------|---------|
| `.prop` | DOM property (`el.disabled = ...`) |
| `?bool` | boolean attribute (present when truthy) |
| `@event` | event listener |

Bare attributes are string attributes. This is still VNodes (htm-class), not
lit-html parts. Details: [html.md](html.md). CDN file: `dist/html.js`.

**Choose `html` when** you prefer no JSX transform -- for example a CDN
`<script type="module">` page.

## Same engine either way

```text
JSX  --->  VNodes  --->  diff  --->  DOM
html --->  VNodes  --->  diff  --->  DOM
h()  --->  VNodes  --->  diff  --->  DOM
```

You can mix styles in one project if you want; they are interchangeable at the
VNode layer.

## Quick pick

| Situation | Prefer |
|-----------|--------|
| Vite / esbuild / similar already set up | JSX |
| Single HTML file + CDN | `html` or plain `h` |
| Learning Strike internals | start with `h`, then add sugar |

**Next:** [Setup](setup.md) for install, entry points, and bundles. Then dive
into [hooks.md](hooks.md) and [render.md](render.md) as you need them.
