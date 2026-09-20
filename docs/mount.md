---
title: Mount and hydrate
nav_order: 7
---

# mount, unmount, register, islands

## What it is

`mount` attaches a component to one or more **host** elements. `unmount` tears
the Strike tree down. `register` names components for string lookups. **Islands**
reuse existing markup via hydrate when you ask for it.

## When to use it

- Several interactive regions on a mostly static page
- Updating the same host later without wiping unrelated page state
- Hydrating server- or statically-rendered HTML that matches your component

For a single SPA root, `render` from [render.md](render.md) is often enough.

## Minimal example

```js
import { h, mount, unmount, register } from 'strike-fw';

function Cart({ n }) {
  return h('span', null, 'Items: ' + n);
}

mount('#cart', Cart, { n: 2 });
// later updates reuse the host (no wipe of sibling state elsewhere)
mount(document.getElementById('cart'), Cart, { n: 3 });

unmount('#cart'); // remove Strike tree; host stays unless keepHost false path
```

## How it works

1. Resolve the target: a CSS selector string uses `querySelectorAll` (every
   match), or pass an element directly.
2. If `props` is omitted, Strike reads JSON from the host's `data-props`.
3. If `component` is a string, it resolves via `register(name, Comp)`.
4. Without hydrate, a fresh host is cleared (`textContent = ''`) then rendered.
5. With hydrate (`data-hydrate` or `{ hydrate: true }`), Strike reuses matching
   markup, wires events, and strips `data-hydrate`. Later `mount` calls
   `render` on the same host without clearing state Strike already owns.

## API / options

### register

```js
register('Cart', Cart);
mount('#cart', 'Cart');
```

### Islands / hydrate

```html
<div id="cart" data-hydrate data-props='{"n":2}'></div>
```

```js
import { mount } from 'strike-fw';

mount('#cart', Cart);
// or mount(el, Cart, null, { hydrate: true })
```

### unmount

```js
unmount(host);           // tear down Strike tree on host
unmount(host, true);     // keep host element (used by custom elements)
unmount('#cart');        // all matches
```

## Common mistakes

- Expecting a normal `mount` (no hydrate) to keep pre-rendered HTML -- without
  hydrate the host is cleared first.
- Invalid JSON in `data-props` (must be valid JSON object text).
- Passing a string component name without `register` first.
- Hydrating markup that does not match what the component will render (see
  [debug.md](debug.md) for mismatch logs).

## See also

- [Concepts](concepts.md) -- `render` vs `mount`
- [Render](render.md) -- `hydrate` directly
- [Custom elements](ce.md) -- uses `unmount` on disconnect
- [Debug](debug.md)
