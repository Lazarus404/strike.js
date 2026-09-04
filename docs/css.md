---
title: css
nav_order: 8
---

# css tagged template

```js
import { css } from 'strike-fw/css';

css`
.strike-btn {
  font: inherit;
  border-radius: var(--strike-radius, 6px);
}
`;
```

Injects a `<style data-strike>` into `document.head` once. Dedupes by template
strings identity and by joined text, so re-importing a module does not stack
duplicate rules.

Also accepts a plain string: `css('.x { color: red }')`.

Strike UI controls call `css` at module load so importing a control includes
its styles. You do not need a separate CSS bundler step for catalog CSS.
