<p align="center">
  <img src="assets/strike-logo.png" alt="strike.js" width="420" />
</p>

Small VDOM runtime (`strike.js`) plus an optional UI catalog (`strike/ui/*`).

## Runtime

```bash
npm test
node build.mjs
node size.mjs
```

- `dist/strike.js` - core
- `dist/strike.core+hooks.js` - core + hooks

```js
import { h, render, mount } from './index.js';
import { useState } from './hooks.js';
```

## JSX

Examples are authored as `.jsx` and compiled with esbuild **0.9.6**:

```bash
npm run build:jsx   # examples/*/app.jsx -> examples/*/app.js
```

In source, import `h` (and `Fragment` if needed). Build sets `jsxFactory: 'h'`, `jsxFragment: 'Fragment'` (see `build-jsx.mjs`). `jsx-runtime.js` is also available for automatic-runtime bundlers.

## Strike UI

Drop-in controls. Import only what you need (do not load unused widgets):

```js
import { Btn } from './ui/btn.js';
import { Field } from './ui/field.js';
```

Link tokens when hosting a page:

```html
<link rel="stylesheet" href="/strike/ui/tokens.css" />
```

Optional all-in CSS: `ui.css`. Optional all-controls JS bundle:

```bash
node build-ui.mjs   # writes dist/strike-ui.js
```

Per-control modules self-inject CSS via `css\`\``. The catalog is never folded into `dist/strike.js`.

Controls: `stack`, `text`, `btn`, `field`, `check`, `select`, `image`.

## Demos

In-package examples (source imports):

```bash
cd strike
npm run build:jsx
python3 -m http.server 8080
```

- [http://localhost:8080/examples/todo/](http://localhost:8080/examples/todo/)
- [http://localhost:8080/examples/login/](http://localhost:8080/examples/login/)
- [http://localhost:8080/examples/site/](http://localhost:8080/examples/site/)

## Licence

MIT License

Copyright (c) 2021 Jahred Love

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
