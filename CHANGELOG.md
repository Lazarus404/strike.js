# Changelog

All notable changes to this project are documented in this file.

## [0.2.1] - 2026-09-02

### Added

- `Check` optional `indeterminate` prop (sets native `input.indeterminate`)
- Optional `strike-fw/transition`: CSS presets, phase helpers, FLIP layout moves, `useTransition`

### Fixed

- Layout effects (`useLayoutEffect`) run on component updates, not only on mount (needed for `Check.indeterminate` after selection changes)

## [0.2.0] - 2026-09-02

### Added

- Automatic JSX runtime (`strike/jsx-runtime`, `strike/jsx-dev-runtime`) with a correct `jsx`/`jsxs` wrapper (key is not treated as children)
- `html` tagged templates: `.prop`, `?bool`, `@event` prefixes and dynamic component tags (`strike/html`); `dist/html.js` bundle for vendor/demo use
- `installDebug()` / uninstall via `strike/debug`
- Strike UI controls: `form`, `switch`, `dialog` (portal), `radio-group`, `number-field`, `btn-group`, `toggle-group`, `autocomplete`; catalog also includes `stack`, `text`, `btn`, `field`, `check`, `select`, `image`
- Package exports for `html`, `debug`, `ui`, and `ui/*`
- Dist bundles: `strike.js`, `strike.core+hooks.js`, `strike-ui.js`, JSX runtime, tokens/UI CSS
- npm package `strike-fw` (exports, `files`, types, `sideEffects`, `prepublishOnly`; product name remains strike.js)
- Hydration helpers: `hydrate()`, `mount` with `data-hydrate` / `data-props`, strip `data-hydrate` after attach
- Examples (todo, login, site SPA) and repo demo that consumes dist only

### Fixed

- Swapping sibling function components now removes prior DOM (unmount under components)
- Portals returned from components stay on the portal target (`firstDom` no longer walks portal children)
- JSX `key` no longer leaks into children when the automatic runtime is used

### Changed

- Build and tooling target current Node / esbuild

## [0.1.0] - 2021-03-22

### Added

- Initial VDOM runtime: `h` / `createElement`, keyed diff, fragments, refs, portals, context
- Hooks, `mount` / `unmount` / `register`, custom elements (`strike/ce`), `css` helpers
- First Strike UI controls and MIT licence
