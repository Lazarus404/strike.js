---
title: Concepts
nav_order: 2
---

# Concepts

**Goal:** understand what Strike is before you write an app.

Strike (`strike-fw` on npm) is a small **browser** UI library. You describe the
screen with JavaScript; Strike turns that description into real DOM nodes and
keeps them up to date when your data changes.

## Components are functions

A **component** is a function that returns a description of UI. You do not
build the page by calling `document.createElement` yourself for every update.
You return a tree; Strike applies it.

```js
function Hello({ name }) {
  return h('p', null, 'Hello, ', name);
}
```

`name` is a **prop** -- an input value passed into the component.

## VNodes

That return value is a **VNode** (virtual node): a plain JavaScript object that
means "an element or component with these props and children." Strike reads
VNodes and creates or updates real DOM to match.

You usually build VNodes with:

- `h(...)` / `createElement` -- the low-level helper
- JSX -- syntax sugar that compiles to `h` (needs a bundler)
- `html` tagged templates -- no JSX transform (see [jsx-or-html.md](jsx-or-html.md))

All three produce the same kind of tree. Strike has **one** patch engine:
it **diffs** the new tree against the previous one and updates only what
changed.

## Needs a DOM

Strike runs where `document` exists (a browser, or a test DOM like linkedom).
It is not a Node-first server renderer.

## `render` vs `mount`

Two common ways to put a tree on the page:

| API | Use when |
|-----|----------|
| `render(vnode, parent)` | You already have a parent element. Strike manages the children under it. |
| `mount(target, Component, props)` | You want to attach a component to a host (CSS selector or element). Good for several islands on one page. |

Sketch with `h` and `render`:

```js
import { h, render } from 'strike-fw';

function Hello({ name }) {
  return h('p', null, 'Hello, ', name);
}

render(h(Hello, { name: 'Ada' }), document.getElementById('root'));
```

`mount`, hydration, and islands are covered in [mount.md](mount.md).

## What to remember

1. Describe UI with functions that return VNodes.
2. Strike diffs and patches the DOM for you.
3. Pick `render` for a single app root, or `mount` for hosts / islands.

**Next:** [Your first app](first-app.md) -- a Counter you can run.
