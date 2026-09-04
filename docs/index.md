---
title: strike-fw Docs
nav_order: 1
---

# strike-fw docs

Small browser VDOM runtime with hooks, JSX, `html` templates, and an optional
UI catalog. Requires a DOM (not a Node-first server runtime). Package name on
npm is `strike-fw`; product name remains strike.js.

| Need | Use |
|------|-----|
| VDOM + render / mount | this pack (`strike-fw`) |
| Shared atoms / persist | `strike-fw-store` |
| Forms validate / submit | `strike-fw-forms` |
| Extended UI catalog | `strike-fw-ui` |
| Client routing | `strike-fw-router` |
| Keyed HTTP cache | `strike-fw-data` |

1. `setup.md` - install, CDN, dist bundles
2. `render.md` - h, Fragment, render, portals, context, options
3. `mount.md` - mount, unmount, register, hydrate, islands
4. `hooks.md` - useState through useId
5. `jsx.md` - automatic and classic JSX
6. `html.md` - tagged templates (`.prop` `?bool` `@event`)
7. `css.md` - `css` tagged template inject
8. `ui.md` - Strike UI catalog
9. `transition.md` - CSS presets, FLIP, useTransition
10. `ce.md` - custom elements via `define`
11. `debug.md` - installDebug
