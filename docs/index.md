---
title: strike-fw Docs
nav_order: 1
---

# strike-fw docs

Strike is a small **browser** VDOM runtime with hooks, JSX, `html` templates,
and an optional UI catalog. The npm package is `strike-fw`; the product name
remains strike.js. It needs a DOM (not a Node-first server runtime).

## Who this is for

Junior JavaScript engineers learning Strike from scratch. Start with the
learning path, then use the API pages as reference.

## Start here

1. [Concepts](concepts.md) -- VNodes, components, `render` vs `mount`
2. [Your first app](first-app.md) -- Counter with npm or CDN
3. [JSX or html templates](jsx-or-html.md) -- choose a markup style

## API reference

1. [Setup](setup.md) -- install, CDN, dist bundles
2. [Render](render.md) -- `h`, Fragment, render, portals, context, options
3. [Mount and hydrate](mount.md) -- mount, unmount, register, islands
4. [Hooks](hooks.md) -- `useState` through `useId`
5. [JSX](jsx.md) -- automatic and classic JSX
6. [html templates](html.md) -- tagged templates (`.prop` `?bool` `@event`)
7. [css](css.md) -- `css` tagged template inject
8. [Strike UI](ui.md) -- core UI catalog
9. [Transitions](transition.md) -- CSS presets, FLIP, `useTransition`
10. [Custom elements](ce.md) -- `define`
11. [Debug](debug.md) -- `installDebug`

## Ecosystem

Sibling packages (documented in their own repos). This guide stays on
`strike-fw`.

| Need | Use |
|------|-----|
| VDOM + render / mount | this pack (`strike-fw`) |
| Shared atoms / persist | `strike-fw-store` |
| Forms validate / submit | `strike-fw-forms` |
| Extended UI catalog | `strike-fw-ui` |
| Client routing | `strike-fw-router` |
| Keyed HTTP cache | `strike-fw-data` |
