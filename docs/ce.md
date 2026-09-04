---
title: Custom elements
nav_order: 11
---

# define (strike-fw/ce)

Thin Custom Element wrapper: observed attributes become string props. Default
render target is light DOM (`this`). Pass `shadow: true` for an open shadow
root.

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

Attribute changes re-render while connected. Disconnect calls `unmount` on the
render root (keeps the host).
