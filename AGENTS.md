# Fullscreen Time — AGENTS.md

## What this is

Chrome Extension (Manifest V3) that overlays a time display when videos play in fullscreen. Content script injected on all pages via webpack bundle, plus a popup for settings.

## Build

```bash
pnpm run build-dev    # dev build (unminified, inline sourcemaps)
pnpm run build-prod   # minified production build
pnpm run watch        # dev + watch mode
pnpm run clean        # removes extension/content.js and .map
```

- Uses `pnpm` (see `packageManager` in `package.json`). Do not use `npm` or `yarn`.
- `pnpm run clean` calls `rm` (Unix) — will fail on Windows PowerShell.

## Source → built output

| Source | Built |
|---|---|
| `src/index.js` (entry) | `extension/content.js` |
| `src/utils.js` | bundled into content.js |
| `src/widgets.js` | bundled into content.js |

Webpack config: `webpack.config.js`. Entry: `./src/index.js` → output: `extension/content.js`. Babel via `.babelrc` with `@babel/preset-env` (modules: false).

## Extension anatomy

```
extension/
├── manifest.json       # MV3 manifest
├── content.js          # built content script (git-tracked artifact)
├── background.js       # service worker (currently empty)
├── popup/
│   ├── popup.html      # settings UI (5 checkboxes + layout radios)
│   └── popup.js        # chrome.storage.sync read/write
├── settings/
│   ├── settings.html   # shortcut key recorder UI
│   └── settings.js     # shortcut binding logic
├── icons/
└── doc.html            # static documentation page
```

## Architecture notes

- **`content.js` is a build artifact** committed to git. Regenerate with `pnpm run build-dev` before testing.
- **Two overlay widgets** share a `TimeDisplay` base class:
  - `TimeDisplay` — attaches to a `<video>` element; visible when that video is fullscreen. Shows `MM:SS / MM:SS | HH:MM:SS`.
  - `WindowOverlayTimeDisplay` — fixed-position overlay on `document.body`; visible when the browser window OR any element is fullscreen (controlled by `showOnFullscreen` setting). Shows only `HH:MM:SS`.
- Settings stored via `chrome.storage.sync` (booleans: `showWhenVideoFullscreen`, `showOnFullscreen`, `showSeconds`, `showProgress`, `autoHide`; string: `layoutMode`, `keyToggleLayout`, `keyToggleVisibility`). Changes propagate in real-time via `chrome.storage.onChanged`.
- `background.js` is an empty service worker. It exists and is registered — don't delete it unless you also update `manifest.json`.
- Popup at `chrome-extension://<id>/popup/popup.html` and docs at `<id>/doc.html`.

## Debugging

VSCode launch config in `.vscode/launch.json` — "Debug Chrome Extension" loads the unpacked extension from `extension\` and launches at `https://www.baidu.com` with source map support. Source path override: `webpack://fullscreen-time/*` → `${webRoot}/*`.

Manual: `chrome://extensions` → Developer mode → Load unpacked → select `extension/` directory.

## Key gotchas

- **No tests, no linter, no typechecker configured.** Add your own before making significant changes.
- **README.md is stale boilerplate** from a Chrome Extension template — do not trust it as documentation.
- `popup.js` / `popup.html` use Chinese labels (extension targets Chinese users). Keep or adjust based on audience.
- **Shortcut keys**: all shortcuts toggle settings temporarily and revert on fullscreen exit. Only the popup settings persist to `chrome.storage.sync`.
- **Shortcut settings page**: `extension/settings/settings.html` + `settings.js` provide a key-recorder UI, opened from the popup.
- Fullscreen detection uses both the standard Fullscreen API (`document.fullscreenElement`) and a dimension-based check (`window.innerHeight === screen.height`) for browser-level fullscreen (F11).
