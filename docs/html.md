---
title: html templates
nav_order: 10
---

# No-build html

## What it is

`html` is a tagged template helper that builds **VNodes** (htm-class, not
lit-html parts). Same `diff` path as JSX and `h`.

## When to use it

- CDN or no-bundler pages
- You want markup-like syntax without a JSX transform

See [jsx-or-html.md](jsx-or-html.md) for choosing between JSX and `html`.

## Minimal example

```js
import { html } from 'strike-fw/html';
import { render } from 'strike-fw';

render(
  html`<button .disabled=${busy} @click=${save}>Save</button>`,
  root
);
```

## How it works

The template is parsed into the same VNode shapes `h` would create. Dynamic
values go in `${...}` interpolations. Special prefixes tell Strike whether a
binding is a DOM property, boolean attribute, or event listener.

Bare attributes without a prefix are string attributes. You can pass a
function/component in the tag position for dynamic components.

## API / options

### Prefixes

| Prefix | Meaning |
|--------|---------|
| `.prop` | DOM property (`el.disabled = ...`) |
| `?bool` | boolean attribute (present when truthy) |
| `@event` | event listener (`onclick` / `onClick` style) |

### CDN / vendor

`dist/html.js` after build (see [setup.md](setup.md)).

## Common mistakes

- Writing JSX-style `disabled={busy}` or `onClick={fn}` inside `html` -- use
  `.disabled=${busy}` and `@click=${fn}`.
- Assuming lit-html Part objects -- Strike `html` outputs VNodes for `diff`.
- Forgetting to import from `strike-fw/html` (or the CDN `html.js` build).

## See also

- [JSX or html templates](jsx-or-html.md)
- [JSX](jsx.md)
- [Render](render.md)
- [Setup](setup.md)
