import { checkIsBrowserFullscreen } from './utils';
import {
  TimeDisplay,
  WindowOverlayTimeDisplay,
  getFullscreenElement,
  FULLSCREEN_EVENTS
} from './widgets';
import { init, reloadFromStorage } from './i18n';
import {
  DEFAULT_KEY_TOGGLE_LAYOUT,
  DEFAULT_KEY_TOGGLE_VISIBILITY,
  buildKeyString,
  isEditableTarget
} from './shortcutKeys';

const IS_TOP_FRAME = window.top === window;
const MAX_SCAN_RETRIES = 5;

// 初始化自定义 i18n（异步加载翻译）
init().then(() => {
  // Widgets may have been created with fallback labels before translations
  // resolved. Re-apply settings so localized labels are refreshed.
  distributeSettings();
});

// --- centralized settings ------------------------------------------------

const DEFAULT_SETTINGS = {
  showWhenVideoFullscreen: true,
  showOnFullscreen: true,
  showSeconds: true,
  showProgress: true,
  autoHide: false,
  layoutMode: 'snap',
  floatPositionVideo: null,
  floatPositionWindow: null
};

const settings = Object.assign({}, DEFAULT_SETTINGS);

// Shortcut bindings are cached so the keydown path stays synchronous.
const shortcutKeys = {
  keyToggleLayout: DEFAULT_KEY_TOGGLE_LAYOUT,
  keyToggleVisibility: DEFAULT_KEY_TOGGLE_VISIBILITY
};

function normalizeStoredShortcut(value) {
  // Normalize legacy Space bindings to the canonical "Space" name.
  // Bare " " => "Space"; "Ctrl+ " => "Ctrl+Space".
  if (value === ' ') return 'Space';
  if (value.endsWith('+ ')) return `${value.slice(0, -1)}Space`;
  return value;
}

function readStoredShortcut(value, fallback) {
  // Missing/non-string => default; empty string => explicitly disabled;
  // any other string => binding (normalized if needed).
  if (typeof value !== 'string') return fallback;
  if (value === '') return '';
  return normalizeStoredShortcut(value);
}

const SETTING_KEYS = [
  'showWhenVideoFullscreen',
  'showOnFullscreen',
  'showSeconds',
  'showProgress',
  'autoHide',
  'layoutMode',
  'floatPositionVideo',
  'floatPositionWindow'
];

// video -> widget (prevents duplicate binding)
const videoWidgets = new WeakMap();
// iterable companion to the WeakMap (WeakMap is not iterable)
const trackedVideos = new Set();

let overlayTimeDisp = IS_TOP_FRAME
  ? new WindowOverlayTimeDisplay(document.body || document.documentElement)
  : null;

// All timers created by index are tracked so teardown can clear them.
const pendingTimeouts = new Set();

function scheduleTimeout(callback, delay) {
  const id = setTimeout(() => {
    pendingTimeouts.delete(id);
    callback();
  }, delay);
  pendingTimeouts.add(id);
  return id;
}

function clearPendingTimeouts() {
  pendingTimeouts.forEach((id) => clearTimeout(id));
  pendingTimeouts.clear();
}

function distributeSettings() {
  trackedVideos.forEach((video) => {
    const widget = videoWidgets.get(video);
    if (widget) widget.applySettings(settings);
  });
  if (overlayTimeDisp) overlayTimeDisp.applySettings(settings);
  // applySettings is pure; visibility (and single-widget selection) is
  // centralized so multiple matching videos never stack clocks.
  updateAllVisibility();
}

function loadSettings() {
  chrome.storage.sync.get(
    Object.assign({
      floatPosition: null,
      keyToggleLayout: DEFAULT_KEY_TOGGLE_LAYOUT,
      keyToggleVisibility: DEFAULT_KEY_TOGGLE_VISIBILITY
    }, DEFAULT_SETTINGS),
    (items) => {
      const legacy = items.floatPosition;

      const normalizedLayout = readStoredShortcut(
        items.keyToggleLayout,
        DEFAULT_KEY_TOGGLE_LAYOUT
      );
      const normalizedVisibility = readStoredShortcut(
        items.keyToggleVisibility,
        DEFAULT_KEY_TOGGLE_VISIBILITY
      );

      shortcutKeys.keyToggleLayout = normalizedLayout;
      shortcutKeys.keyToggleVisibility = normalizedVisibility;

      // One-time normalization migration for legacy Space bindings (or other
      // corrected values). Normalization is idempotent, so this cannot loop.
      const shortcutUpdates = {};
      if (normalizedLayout !== items.keyToggleLayout) {
        shortcutUpdates.keyToggleLayout = normalizedLayout;
      }
      if (normalizedVisibility !== items.keyToggleVisibility) {
        shortcutUpdates.keyToggleVisibility = normalizedVisibility;
      }
      if (Object.keys(shortcutUpdates).length > 0) {
        chrome.storage.sync.set(shortcutUpdates);
      }

      settings.showWhenVideoFullscreen = items.showWhenVideoFullscreen !== false;
      settings.showOnFullscreen = items.showOnFullscreen !== false;
      settings.showSeconds = items.showSeconds !== false;
      settings.showProgress = items.showProgress !== false;
      settings.autoHide = items.autoHide === true;
      settings.layoutMode = items.layoutMode === 'float' ? 'float' : 'snap';
      settings.floatPositionVideo = items.floatPositionVideo || null;
      settings.floatPositionWindow = items.floatPositionWindow || null;

      // One-time migration of the legacy shared float position. Use it for
      // both widget types, then remove the old key.
      let migrated = false;
      if (legacy && typeof legacy === 'object') {
        if (!settings.floatPositionVideo) {
          settings.floatPositionVideo = legacy;
          migrated = true;
        }
        if (!settings.floatPositionWindow) {
          settings.floatPositionWindow = legacy;
          migrated = true;
        }
      }

      distributeSettings();

      if (legacy !== null && legacy !== undefined) {
        if (migrated) {
          chrome.storage.sync.set({
            floatPositionVideo: settings.floatPositionVideo,
            floatPositionWindow: settings.floatPositionWindow
          });
        }
        chrome.storage.sync.remove('floatPosition');
      }
    }
  );
}

loadSettings();

// Single storage listener for the whole page / frame.
function handleStorageChanged(changes, namespace) {
  if (namespace !== 'sync') return;

  let changed = false;
  SETTING_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      settings[key] = changes[key].newValue;
      changed = true;
    }
  });

  if (Object.prototype.hasOwnProperty.call(changes, 'keyToggleLayout')) {
    shortcutKeys.keyToggleLayout = readStoredShortcut(
      changes.keyToggleLayout.newValue,
      DEFAULT_KEY_TOGGLE_LAYOUT
    );
  }
  if (Object.prototype.hasOwnProperty.call(changes, 'keyToggleVisibility')) {
    shortcutKeys.keyToggleVisibility = readStoredShortcut(
      changes.keyToggleVisibility.newValue,
      DEFAULT_KEY_TOGGLE_VISIBILITY
    );
  }

  const languageChanged = Object.prototype.hasOwnProperty.call(changes, 'language');

  // Language change must not swallow co-changed settings.
  if (languageChanged) {
    reloadFromStorage().then(() => distributeSettings());
  }
  if (changed) distributeSettings();
}

chrome.storage.onChanged.addListener(handleStorageChanged);

// --- media discovery / binding ------------------------------------------

function bindVideo(video) {
  if (!video || video.tagName !== 'VIDEO') return;
  if (videoWidgets.has(video)) return;

  const widget = new TimeDisplay(video);
  videoWidgets.set(video, widget);
  trackedVideos.add(video);

  widget.applySettings(settings);
  updateAllVisibility();
}

function destroyVideo(video) {
  const widget = videoWidgets.get(video);
  if (widget) widget.destroy();
  videoWidgets.delete(video);
  trackedVideos.delete(video);
}

function scanForMedia(root) {
  const videos = (root || document).querySelectorAll('video');
  let found = 0;
  videos.forEach((video) => {
    if (!videoWidgets.has(video)) {
      bindVideo(video);
      found++;
    }
  });
  return found;
}

// Scan immediately; if no videos exist yet, retry a bounded number of times
// (5 x 1s) rather than polling forever.
let scanRetries = 0;

function initialScan() {
  const found = scanForMedia(document);
  if (found > 0) {
    return;
  }

  if (scanRetries < MAX_SCAN_RETRIES) {
    scanRetries++;
    scheduleTimeout(initialScan, 1000);
  }
}

initialScan();

// Dynamic videos: bind newly added videos and destroy widgets for removed ones.
const mediaObserver = new MutationObserver((mutations) => {
  let sawRemoval = false;

  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (!node || node.nodeType !== 1) return;
      if (node.tagName === 'VIDEO') {
        bindVideo(node);
      }
      if (node.querySelectorAll) {
        node.querySelectorAll('video').forEach((video) => bindVideo(video));
      }
    });

    if (mutation.removedNodes && mutation.removedNodes.length > 0) {
      sawRemoval = true;
    }
  });

  if (sawRemoval) {
    // Defer so a moved video (removed + re-added) is not destroyed.
    scheduleTimeout(cleanupRemovedVideos, 0);
  }
});

mediaObserver.observe(document.documentElement, {
  childList: true,
  subtree: true
});

function cleanupRemovedVideos() {
  trackedVideos.forEach((video) => {
    if (!video.isConnected) destroyVideo(video);
  });
}

// --- centralized scheduling / visibility --------------------------------

const ticker = setInterval(() => {
  trackedVideos.forEach((video) => {
    const widget = videoWidgets.get(video);
    if (widget && widget.isShowing()) widget.updateTime();
  });
  if (overlayTimeDisp && overlayTimeDisp.isShowing()) {
    overlayTimeDisp.updateTime();
  }
}, 1000);

function updateAllVisibility() {
  const fsEl = getFullscreenElement();
  let winnerWidget = null;

  if (fsEl) {
    // Only one clock may win inside a fullscreen container. Prefer the video
    // that is actually playing, then the exact fullscreen element, then the
    // first matching widget.
    const candidates = [];
    trackedVideos.forEach((video) => {
      const widget = videoWidgets.get(video);
      if (widget && widget.checkIsToShow()) {
        candidates.push({ video, widget });
      }
    });

    let winner = null;
    if (candidates.length > 0) {
      winner = candidates.find((c) => !c.video.paused && !c.video.ended) ||
               candidates.find((c) => c.video === fsEl) ||
               candidates[0];
    }

    winnerWidget = winner ? winner.widget : null;
    trackedVideos.forEach((video) => {
      const widget = videoWidgets.get(video);
      if (widget && widget !== winnerWidget && widget.isShowing()) {
        widget.hide();
      }
    });
    if (winnerWidget) winnerWidget.updateVisibility();
  } else {
    trackedVideos.forEach((video) => {
      const widget = videoWidgets.get(video);
      if (widget) widget.updateVisibility();
    });
  }

  if (overlayTimeDisp) {
    // Contract with the overlay: a video/embedded fullscreen owns the view,
    // regardless of whether its clock is currently visible.
    overlayTimeDisp.videoOverlayActive = isVideoContentFullscreen();
    overlayTimeDisp.updateVisibility();
  }
}

function handleResize() {
  updateAllVisibility();
  trackedVideos.forEach((video) => {
    const widget = videoWidgets.get(video);
    if (widget) widget.handleResize();
  });
  if (overlayTimeDisp) overlayTimeDisp.handleResize();
}

function handleFullscreenChange() {
  if (!getFullscreenElement() && !checkIsBrowserFullscreen()) {
    restoreTempValues();
  }
  updateAllVisibility();
}

// Single set of global fullscreen/resize listeners.
FULLSCREEN_EVENTS.forEach((eventName) => {
  document.addEventListener(eventName, handleFullscreenChange);
});
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

// --- 快捷键处理（均为临时切换，不写 storage） ---

// 被快捷键临时改动的设置，退出全屏时恢复原值
const _tempOverrides = {};

// 将某个设置值应用到所有 widget 实例（不写 storage）
function applySettingToWidgets(settingKey, value) {
  if (!Object.prototype.hasOwnProperty.call(settings, settingKey)) return;
  settings[settingKey] = value;
  distributeSettings();
}

// 快捷键临时切换：记录原始值 → 写入 widget
function tempToggle(settingKey, newValue, currentValue) {
  if (!(settingKey in _tempOverrides)) {
    _tempOverrides[settingKey] = currentValue;
  }
  applySettingToWidgets(settingKey, newValue);
}

// 退出全屏时恢复所有临时改动
function restoreTempValues() {
  for (const [key, originalValue] of Object.entries(_tempOverrides)) {
    applySettingToWidgets(key, originalValue);
  }
  for (const key in _tempOverrides) {
    delete _tempOverrides[key];
  }
}

// 检测退出全屏（含 F11）
function checkFullscreenExit() {
  const isFs = getFullscreenElement() || checkIsBrowserFullscreen();
  if (!isFs) {
    restoreTempValues();
  }
}

window.addEventListener('resize', checkFullscreenExit);

// 关闭按钮 × → 临时隐藏（同快捷键 hide 行为）
function handleDismiss(e) {
  const settingKey = e.detail && e.detail.displayType === 'window-overlay'
    ? 'showOnFullscreen'
    : 'showWhenVideoFullscreen';
  const currentVal = settings[settingKey];
  if (currentVal === false) return; // 已经隐藏
  tempToggle(settingKey, false, currentVal);
}

document.addEventListener('fs-time-dismiss', handleDismiss);

function isVideoContentFullscreen() {
  const fsEl = getFullscreenElement();
  if (!fsEl) return false;

  // Native video fullscreen.
  if (typeof HTMLVideoElement !== 'undefined' && fsEl instanceof HTMLVideoElement) {
    return true;
  }

  // Embedded content owns the fullscreen view; the child frame handles its own
  // video clock, so the top frame must not also render one.
  const embeddedConstructors = [
    typeof HTMLIFrameElement !== 'undefined' ? HTMLIFrameElement : null,
    typeof HTMLFrameElement !== 'undefined' ? HTMLFrameElement : null,
    typeof HTMLEmbedElement !== 'undefined' ? HTMLEmbedElement : null,
    typeof HTMLObjectElement !== 'undefined' ? HTMLObjectElement : null
  ];
  for (let i = 0; i < embeddedConstructors.length; i += 1) {
    const Constructor = embeddedConstructors[i];
    if (Constructor && fsEl instanceof Constructor) return true;
  }

  // Player-container fullscreen containing a tracked video.
  let containsTrackedVideo = false;
  trackedVideos.forEach((video) => {
    if (!containsTrackedVideo && fsEl.contains(video)) {
      containsTrackedVideo = true;
    }
  });
  return containsTrackedVideo;
}

function handleKeydown(e) {
  // Reserved browser key / key-repeat / IME composition.
  if (e.key === 'Escape' || e.repeat || e.isComposing) return;

  // Never steal keys while the user is typing.
  if (isEditableTarget(e.target)) return;

  const isFs = getFullscreenElement() || checkIsBrowserFullscreen();
  if (!isFs) return;

  const pressed = buildKeyString(e);
  if (!pressed) return;

  // Synchronous cache check: no async storage read in the keydown path.
  if (pressed === shortcutKeys.keyToggleLayout) {
    e.preventDefault();
    e.stopPropagation();
    // 从集中设置读取当前布局模式（storage 未被 shortcut 写过）
    const currentMode = settings.layoutMode;
    const newMode = currentMode === 'float' ? 'snap' : 'float';
    tempToggle('layoutMode', newMode, currentMode);
    return;
  }

  if (pressed === shortcutKeys.keyToggleVisibility) {
    e.preventDefault();
    e.stopPropagation();

    // Video context is based on the fullscreen element itself, not on whether
    // the video clock is currently visible. This lets F10 restore a hidden
    // video overlay and prevents it from turning the window overlay on.
    const settingKey = isVideoContentFullscreen()
      ? 'showWhenVideoFullscreen'
      : 'showOnFullscreen';

    // 从集中设置读取当前状态（storage 从未被 shortcut 写过）
    const currentVal = settings[settingKey];
    tempToggle(settingKey, !currentVal, currentVal);
  }
}

// Capture phase so page handlers cannot swallow the shortcut first.
document.addEventListener('keydown', handleKeydown, true);

// --- teardown ------------------------------------------------------------

function teardown() {
  clearInterval(ticker);
  clearPendingTimeouts();
  mediaObserver.disconnect();

  FULLSCREEN_EVENTS.forEach((eventName) => {
    document.removeEventListener(eventName, handleFullscreenChange);
  });
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('orientationchange', handleResize);
  window.removeEventListener('resize', checkFullscreenExit);

  chrome.storage.onChanged.removeListener(handleStorageChanged);
  document.removeEventListener('keydown', handleKeydown, true);
  document.removeEventListener('fs-time-dismiss', handleDismiss);

  trackedVideos.forEach((video) => {
    const widget = videoWidgets.get(video);
    if (widget) widget.destroy();
    videoWidgets.delete(video);
  });
  trackedVideos.clear();

  if (overlayTimeDisp) {
    overlayTimeDisp.destroy();
    overlayTimeDisp = null;
  }
}

// bfcache: pagehide fires when entering the back/forward cache too; only tear
// down on a real unload.
function handlePageHide(event) {
  if (event.persisted) return;
  teardown();
}

window.addEventListener('pagehide', handlePageHide);
