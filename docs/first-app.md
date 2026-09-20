---
title: Your first app
nav_order: 3
---

# Your first app

**Goal:** build a Counter and put it on a page.

You will use `h`, `render`, and `useState` -- no JSX yet, so you do not need a
JSX bundler config. Read [concepts.md](concepts.md) first if "VNode" is new.

## Option A -- npm

```bash
npm i strike-fw
```

Create a module (for example `counter.js`):

```js
import { h, render } from 'strike-fw';
import { useState } from 'strike-fw/hooks';

function Counter() {
  const [n, setN] = useState(0);
  return h(
    'button',
    { type: 'button', onClick: () => setN(n + 1) },
    'Clicked ',
    n,
    ' times'
  );
}

render(h(Counter), document.getElementById('root'));
```

HTML shell:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Counter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./counter.js"></script>
  </body>
</html>
```

Serve the folder with any static server so ES modules load (for example
`python3 -m http.server`).

## Option B -- CDN

Same idea without a package install. Pin matches the README CDN version:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Counter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import { h, render, useState } from
        'https://cdn.jsdelivr.net/npm/strike-fw@0.2.2/dist/strike.core+hooks.js';

      function Counter() {
        const [n, setN] = useState(0);
        return h(
          'button',
          { type: 'button', onClick: () => setN(n + 1) },
          'Clicked ',
          n,
          ' times'
        );
      }

      render(h(Counter), document.getElementById('root'));
    </script>
  </body>
</html>
```

Also on unpkg: `https://unpkg.com/strike-fw@0.2.2/dist/strike.core+hooks.js`.

## What you should see

A button that says `Clicked 0 times`. Each click increases the number.

## What "re-render" means

`useState` gives you the current value and a setter. When you call `setN`,
Strike schedules your component function to run again. That produces a **new**
VNode tree. Strike **diffs** it into the DOM that is already on the page.

You do **not** call `render` again yourself for ordinary state updates inside
that tree. The first `render(h(Counter), root)` attaches the app; state drives
updates after that.

## Longer demos

In this repo, after `npm run build:jsx` and a static server (see the README):

- `examples/todo/`
- `examples/login/`
- `examples/site/`

Those load Strike from the CDN pin in `examples/cdn.mjs`.

**Next:** [JSX or html templates](jsx-or-html.md) -- choose how you write markup.
