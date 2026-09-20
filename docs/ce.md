---
title: Custom elements
nav_order: 14
---

# define (strike-fw/ce)

## What it is

`define` wraps a Strike function component as a **Custom Element**. Observed
attributes become string props. Default render target is light DOM (`this`);
pass `shadow: true` for an open shadow root.

## When to use it

- Embedding Strike widgets in non-Strike pages
- Progressive enhancement with `<strike-hello name="Ada">` markup

For SPA roots, prefer `render` / `mount` instead.

## Minimal example

```js
import { define } from 'strike-fw/ce';
import { h } from 'strike-fw';

function Hello({ name }) {
  return h('p', null, 'Hello ', name);
}

define('strike-hello', Hello, {
  props: ['name'],
  // shadow: true,
  // styles: css`p { color: green }`  // or string / array for shadow
});
```

```html
<strike-hello name="Ada"></strike-hello>
```

## How it works

1. `define` registers the custom element name with the browser.
2. Listed `props` map from HTML attributes (strings) into component props.
3. While connected, attribute changes re-render the Strike tree.
4. On disconnect, Strike calls `unmount` on the render root (keeps the host).

## API / options

| Option | Meaning |
|--------|---------|
| `props` | Attribute names observed and passed as string props |
| `shadow: true` | Render into an open shadow root |
| `styles` | `css` result, string, or array -- for shadow styling |

Light DOM is the default render target (`this`).

## Common mistakes

- Custom element names must include a hyphen (`strike-hello`, not `hello`).
- Expecting non-string types from attributes -- HTML attributes are strings;
  parse inside the component if you need numbers / booleans.
- Forgetting that disconnect unmounts the Strike tree on the render root.
- Putting complex app routing only inside custom elements when `mount` islands
  would be simpler -- see [mount.md](mount.md).

## See also

- [Mount and hydrate](mount.md)
- [css](css.md)
- [Render](render.md)
- [Setup](setup.md)
