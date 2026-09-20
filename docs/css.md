---
title: css
nav_order: 11
---

# css tagged template

## What it is

`css` injects a `<style data-strike>` into `document.head` once. Strike UI
controls call it at module load so importing a control brings its styles.

## When to use it

- Shipping small component CSS with a JS module
- Avoiding a separate CSS bundler step for catalog styles

This is **global** CSS injection, not Shadow DOM scoping (unless you pass
styles into custom elements -- see [ce.md](ce.md)).

## Minimal example

```js
import { css } from 'strike-fw/css';

css`
.strike-btn {
  font: inherit;
  border-radius: var(--strike-radius, 6px);
}
`;
```

## How it works

Strike dedupes by template strings identity and by joined text, so re-importing
a module does not stack duplicate rules. You can also pass a plain string:
`css('.x { color: red }')`.

## API / options

- Tagged template: `css\`...rules...\``
- String form: `css('.x { color: red }')`
- Injects into `document.head` with `data-strike`
- Deduped so repeat imports are safe

## Common mistakes

- Expecting styles to be scoped to one component automatically -- selectors are
  global unless you design them that way (or use shadow styles in `define`).
- Worrying that hot-reloading imports will multiply rules -- dedupe prevents
  stacking identical text.
- Forgetting that UI catalog CSS still needs **tokens** from `ui/tokens.css`
  (see [ui.md](ui.md)).

## See also

- [Strike UI](ui.md)
- [Custom elements](ce.md)
- [Setup](setup.md)
