---
title: Strike UI
nav_order: 12
---

# Strike UI (core catalog)

## What it is

Optional controls shipped with `strike-fw`: buttons, fields, dialog, and more.
Each control is a separate module that self-injects CSS via `css`. The catalog
is never folded into `dist/strike.js`.

## When to use it

- You want ready-made accessible-ish building blocks on top of Strike
- You prefer importing only the controls you need

Extended layout / surfaces / snackbars live in `strike-fw-ui` (separate pack).
Form *state* (validate, submit) lives in `strike-fw-forms` -- pair those hooks
with `Field` / `Form` / `Select` / `Switch` here.

## Minimal example

```js
import { Btn } from 'strike-fw/ui/btn.js';
import { Field } from 'strike-fw/ui/field.js';
import { Dialog } from 'strike-fw/ui/dialog.js';
```

Or the barrel: `import { Btn, Field, cls } from 'strike-fw/ui'`.

## How it works

1. Import a control module (or the barrel).
2. Load design tokens CSS so variables like `--strike-radius` resolve.
3. Render the control like any other component (`h(Btn, props)` or JSX).

Per-control imports keep unused UI out of your graph. The barrel is convenient
when you use many controls.

## API / options

### Tokens

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/strike-fw@0.2.2/ui/tokens.css" />
```

Optional all-in: `strike-fw/ui.css`. CDN UI bundle: `dist/strike-ui.js` (peer to
`dist/strike.core+hooks.js`).

### Controls

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

## Common mistakes

- Importing the barrel when a single `ui/btn.js` import would be enough.
- Forgetting `tokens.css` / `ui.css` -- controls look unstyled or wrong.
- Expecting validation and submit state inside this catalog -- use
  `strike-fw-forms` for that.
- Looking for snackbars / heavy layout here -- those are in `strike-fw-ui`.

## See also

- [css](css.md)
- [Setup](setup.md)
- [Transitions](transition.md)
- [Hooks](hooks.md)
