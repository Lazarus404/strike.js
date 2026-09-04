---
title: html templates
nav_order: 7
---

# No-build html

Tagged templates produce VNodes (htm-class, not lit-html). Same `diff` path as
JSX.

```js
import { html } from 'strike-fw/html';
import { render } from 'strike-fw';

render(
  html`<button .disabled=${busy} @click=${save}>Save</button>`,
  root
);
```

## Prefixes

| Prefix | Meaning |
|--------|---------|
| `.prop` | DOM property (`el.disabled = ...`) |
| `?bool` | boolean attribute (present when truthy) |
| `@event` | event listener (`onclick` / `onClick` style) |

Bare attributes are string attributes. Dynamic component tags work (pass a
function/component into the tag position).

CDN / vendor: `dist/html.js` after build.
