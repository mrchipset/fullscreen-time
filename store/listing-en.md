# Chrome Web Store Listing (English)

## Name

Fullscreen Time — Clock & Playback Overlay

## Summary (≤132 characters)

Show playback progress and the system clock at the top of the screen while a video or the browser is fullscreen.

## Detailed description

Fullscreen Time is a lightweight Chrome/Edge extension that overlays the current playback progress and system clock while a video or the browser is fullscreen, so you can check the time without leaving fullscreen.

Features:

- Video overlay: current time / duration | system clock, updated every second.
- Browser or other non-video fullscreen: system clock only.
- Independent toggles for seconds, playback progress and idle auto-hide.
- Snap-to-top or draggable float layout; positions are remembered separately for video and window overlays and can be reset.
- Default shortcuts: F9 toggles layout, F10 toggles visibility. A recorder supports custom combinations with conflict and reserved-key validation.
- English / Chinese UI; switching updates the popup, settings page, documentation and overlay labels.
- Supports iframe players, multiple videos, SPA-loaded videos and live streams (`--:--` when duration is unavailable).
- Dark mode, reduced motion and keyboard accessibility.

Requirements:

- Chrome or Edge (Chromium) 114+.
- No developer server, remote code or analytics at runtime.
- Settings are stored in Chrome Sync and may sync across devices signed into the same Chrome account; the developer cannot access them.

Permissions:

- `storage`: save display options, layout, language and shortcut bindings.
- Content script on all sites: detect page videos and fullscreen state to render the overlay. It does not read or upload page text, forms, browsing history or video content.
- `all_frames` / `match_about_blank` / `match_origin_as_fallback`: support players inside iframes, frames, embeds and objects.
- `web_accessible_resources` for `_locales/*`: the content script loads local locale files.
- `file:///*`: support local video files; the user must explicitly allow file URL access in the extension details.

Privacy:

- No data collection, sale or transmission to the developer or third parties.
- No cookies, ads, tracking scripts or remote analytics.
- Only the current video's playback time, duration and the system time are read while the overlay is shown.

Open source and support:

- Source: https://github.com/mrchipset/fullscreen-time
- Issues: https://github.com/mrchipset/fullscreen-time/issues
- Privacy policy: https://mrchipset.github.io/fullscreen-time/privacy-policy.html

## Category

Productivity

## Languages

English, Chinese (Simplified)

## Store screenshots (1280×800)

1. `store/screenshots/01-overlay.png` — video fullscreen overlay
2. `store/screenshots/02-popup.png` — popup settings
3. `store/screenshots/03-settings.png` — shortcut settings

## Support URL

https://github.com/mrchipset/fullscreen-time/issues

## Homepage URL

https://github.com/mrchipset/fullscreen-time
