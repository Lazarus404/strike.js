---
title: Mount and hydrate
nav_order: 4
---

# mount, unmount, register, islands

## mount

```js
import { mount, unmount, register } from 'strike-fw';

function Cart({ n }) {
  return h('span', null, 'Items: ' + n);
}

mount('#cart', Cart, { n: 2 });
// later updates reuse the host (no wipe of sibling state elsewhere)
mount(document.getElementById('cart'), Cart, { n: 3 });

unmount('#cart'); // remove Strike tree; host stays unless keepHost false path
```

- String targets use `querySelectorAll` (every match).
- If `props` is omitted, reads JSON from the host's `data-props`.
- If `component` is a string, resolves via `register(name, Comp)`.

```js
register('Cart', Cart);
mount('#cart', 'Cart');
```

## Islands / hydrate

Server or static HTML can leave matching markup:

```html
<div id="cart" data-hydrate data-props='{"n":2}'></div>
```

```js
import { mount } from 'strike-fw';

mount('#cart', Cart);
// or mount(el, Cart, null, { hydrate: true })
```

First attach with `data-hydrate` (or `{ hydrate: true }`) calls `hydrate` and
strips `data-hydrate`. Later `mount` calls `render` on the same host without
clearing state that Strike already owns.

Without hydrate, a fresh host is cleared (`textContent = ''`) then rendered.

## unmount

```js
unmount(host);           // tear down Strike tree on host
unmount(host, true);     // keep host element (used by custom elements)
unmount('#cart');        // all matches
```
