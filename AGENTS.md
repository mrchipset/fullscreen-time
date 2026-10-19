# Fullscreen Time — AGENTS.md

## What this is

Chrome Extension (Manifest V3) that overlays a time display when videos play in fullscreen. Content script injected on all pages via webpack bundle, plus a popup for settings.

## Build

```bash
pnpm run build-dev    # dev build (unminified, inline source map)
pnpm run build-prod   # production build (minified, no source maps)
pnpm run watch        # dev + watch mode
pnpm run clean        # removes extension/content.js and any .map
```

- Uses `pnpm` (see `packageManager` in `package.json`). Do not use `npm` or `yarn`.
- `pnpm run clean` is PowerShell-compatible.
- The committed `extension/content.js` is the **production** build. Rebuild after any
  `src/` change; use `build-dev` for readable debugging output.

## Source → built output

| Source | Built |
|---|---|
| `src/index.js` (entry) | `extension/content.js` |
| `src/widgets.js` | bundled into content.js |
| `src/utils.js` | bundled into content.js |
| `src/i18n.js` | bundled into content.js |
| `src/shortcutKeys.js` | bundled into content.js |

Webpack config: `webpack.config.js`. Entry: `./src/index.js` → output: `extension/content.js`. Babel via `.babelrc` with `@babel/preset-env` (modules: false).

## Extension anatomy

```
extension/
├── manifest.json       # MV3 manifest (all_frames + web_accessible_resources)
├── content.js          # built content script (tracked; production build)
├── background.js       # service worker (currently empty)
├── popup/
│   ├── popup.html      # grouped settings UI (display / behavior / general)
│   └── popup.js        # chrome.storage.sync read/write, reset float position
├── settings/
│   ├── settings.html   # centered shortcut recorder page
│   └── settings.js     # keyboard-startable recorder, conflict/reserved checks
├── shared/
│   ├── i18n.js         # page i18n loader/translator, language propagation
│   └── ui.css          # shared design tokens, dark mode, reduced motion
├── _locales/           # en + zh_CN message catalogs
├── icons/
└── doc.html            # in-product documentation + privacy
```

## Architecture notes

- **`content.js` is a build artifact** committed to git. The committed artifact is
  the production build; regenerate with `pnpm run build-dev` for readable debugging.
- **Two overlay widgets** share a `TimeDisplay` base class:
  - `TimeDisplay` — attaches to a `<video>`; visible when that video (or its
    fullscreen container) is fullscreen. Shows `MM:SS / MM:SS | HH:MM:SS`.
  - `WindowOverlayTimeDisplay` — top-frame overlay for browser fullscreen (F11) or
    non-video element fullscreen. Never appears over fullscreen video. Shows only
    `HH:MM:SS`.
  - Native `<video>` element fullscreen uses a `popover="manual"` top-layer overlay
    (display-only; close/drag are best-effort). Player-container fullscreen appends
    into the container. Content script runs in `all_frames`; frame/embed/object
    fullscreen is treated as child-owned to avoid duplicate clocks.
- Settings stored via `chrome.storage.sync` (booleans: `showWhenVideoFullscreen`,
  `showOnFullscreen`, `showSeconds`, `showProgress`, `autoHide`; strings:
  `layoutMode`, `floatPositionVideo`, `floatPositionWindow`, `language`,
  `keyToggleLayout`, `keyToggleVisibility`). Missing shortcut keys default to
  `F9`/`F10`; empty string disables a binding. Changes propagate in real-time via
  `chrome.storage.onChanged`.
- **Language** changes propagate to open popup/settings/doc pages and content-script
  widgets; locale files are fetched through `web_accessible_resources`.
- `background.js` is an empty service worker. It exists and is registered — don't
  delete it unless you also update `manifest.json`.
- Popup at `chrome-extension://<id>/popup/popup.html`, docs at `<id>/doc.html`.
- Manual acceptance procedure: `docs/testing-sop.md`.

## Debugging

VSCode launch config in `.vscode/launch.json` — "Debug Chrome Extension" loads the unpacked extension from `extension\` and launches at `https://www.baidu.com` with source map support. Source path override: `webpack://fullscreen-time/*` → `${webRoot}/*`. Source maps exist only in `build-dev`; use `build-dev` before debugging.

Manual: `chrome://extensions` → Developer mode → Load unpacked → select `extension/` directory.

## Key gotchas

- **No tests, no linter, no typechecker configured.** Use `docs/testing-sop.md` for
  manual acceptance; add automated checks before significant changes.
- **README.md is stale boilerplate** from a Chrome Extension template — do not trust it as documentation.
- `popup.js` / `popup.html` use Chinese labels (extension targets Chinese users). Keep or adjust based on audience.
- **Shortcut keys**: all shortcuts toggle settings temporarily and revert on fullscreen exit. Only the popup settings persist to `chrome.storage.sync`.
- **Shortcut settings page**: `extension/settings/settings.html` + `settings.js` provide a key-recorder UI, opened from the popup. Escape cancels, Delete unbinds, reserved browser keys are rejected, and defaults are `F9`/`F10`.
- Fullscreen detection uses the Fullscreen API plus a dimension-based ±2px check for browser-level fullscreen (F11). Native video-element fullscreen uses the Popover API top layer; frame/embed/object fullscreen is treated as child-owned to avoid duplicate clocks.
- `Ctrl+W` / `Ctrl+T` and similar browser-reserved shortcuts cannot be intercepted; the recorder rejects them.
- The committed `extension/content.js` is the production build. Do not hand-edit it; rebuild after `src/` changes.
