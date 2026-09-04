---
title: Strike UI
nav_order: 9
---

# Strike UI (core catalog)

Import only what you need:

```js
import { Btn } from 'strike-fw/ui/btn.js';
import { Field } from 'strike-fw/ui/field.js';
import { Dialog } from 'strike-fw/ui/dialog.js';
```

Or the barrel: `import { Btn, Field, cls } from 'strike-fw/ui'`.

## Tokens

```html
<link rel="stylesheet" href=".../strike-fw@0.2.1/ui/tokens.css" />
```

Optional all-in: `strike-fw/ui.css`. CDN UI bundle: `dist/strike-ui.js` (peer to
`dist/strike.core+hooks.js`).

## Controls

| Module | Export | Notes |
|--------|--------|-------|
| `stack` | `Stack` | flex column/row spacing |
| `text` | `Text` | typography |
| `btn` | `Btn` | `variant` primary/ghost/default; `state` busy |
| `field` | `Field` | labeled input; `state` invalid |
| `check` | `Check` | checkbox; optional `indeterminate` |
| `select` | `Select` | native select |
| `image` | `Image` | img wrapper |
| `form` | `Form` | form shell |
| `switch` | `Switch` | toggle |
| `dialog` | `Dialog` | portal modal; `open` / `onClose` |
| `radio-group` | `RadioGroup` | options list |
| `number-field` | `NumberField` | steppers + number input |
| `btn-group` | `BtnGroup` | grouped buttons |
| `toggle-group` | `ToggleGroup` | exclusive or multi |
| `autocomplete` | `Autocomplete` | controlled listbox |
| `cls` | `cls` | className join helper |

Extended layout / surfaces / snackbars live in `strike-fw-ui` (separate pack).
Form *state* (validate, submit) lives in `strike-fw-forms` -- pair those hooks
with `Field` / `Form` / `Select` / `Switch` here.
