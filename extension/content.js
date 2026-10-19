/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/i18n.js":
/*!*********************!*\
  !*** ./src/i18n.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCurrentLang: () => (/* binding */ getCurrentLang),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   reloadFromStorage: () => (/* binding */ reloadFromStorage),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
/**
 * Custom i18n module for content script (webpack-bundled).
 * Loads translations from _locales/{lang}/messages.json at runtime.
 */

var SUPPORTED_LANGS = ['en', 'zh_CN'];
var STORAGE_KEY = 'language';
var _currentLang = null;
var _translations = {};
var _initPromise = null;
var _loadToken = 0;

/**
 * Translate a message key.
 */
function t(key) {
  if (_translations[key] && _translations[key].message) {
    return _translations[key].message;
  }
  // Fallback to Chrome i18n
  try {
    return chrome.i18n.getMessage(key) || key;
  } catch (e) {
    return key;
  }
}
function getCurrentLang() {
  return _currentLang;
}

/**
 * Initialize i18n: read stored language, load translations.
 * Can be called multiple times safely — returns same promise on subsequent calls.
 */
function init() {
  if (_initPromise) return _initPromise;
  _initPromise = new Promise(function (resolve) {
    chrome.storage.sync.get(STORAGE_KEY, function (items) {
      var stored = items[STORAGE_KEY];
      var browserLang = navigator.language || 'en';
      var mapped = browserLang.replace('-', '_');
      var bestLang = stored || (SUPPORTED_LANGS.includes(mapped) ? mapped : 'en');
      loadLang(bestLang).then(function () {
        return resolve();
      });
    });
  });
  return _initPromise;
}

/**
 * Reload translations for a different language (called when storage changes).
 */
function reloadFromStorage() {
  return new Promise(function (resolve) {
    chrome.storage.sync.get(STORAGE_KEY, function (items) {
      var lang = items[STORAGE_KEY] || _currentLang || 'en';
      if (lang !== _currentLang) {
        loadLang(lang).then(function () {
          return resolve(true);
        });
      } else {
        // Invalidate any older in-flight load, even when the requested
        // language is already the current one.
        _loadToken += 1;
        resolve(false);
      }
    });
  });
}

/**
 * Load translations for a given language from _locales/{lang}/messages.json.
 */
function loadLang(lang) {
  // Bump before the cache check so even a cached no-op invalidates any older
  // in-flight request.
  _loadToken += 1;
  var token = _loadToken;
  if (lang === _currentLang && Object.keys(_translations).length > 0) {
    return Promise.resolve();
  }

  // Slow initial loads must not overwrite a newer language request.
  var url = chrome.runtime.getURL("_locales/".concat(lang, "/messages.json"));
  return fetch(url).then(function (resp) {
    if (!resp.ok) throw new Error("Failed to load ".concat(url));
    return resp.json();
  }).then(function (data) {
    if (token !== _loadToken) return;
    _translations = data;
    _currentLang = lang;
  })["catch"](function () {
    if (token !== _loadToken) return;
    if (lang !== 'en') return loadLang('en');
    _translations = {};
    _currentLang = 'en';
  });
}

/***/ }),

/***/ "./src/shortcutKeys.js":
/*!*****************************!*\
  !*** ./src/shortcutKeys.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_KEY_TOGGLE_LAYOUT: () => (/* binding */ DEFAULT_KEY_TOGGLE_LAYOUT),
/* harmony export */   DEFAULT_KEY_TOGGLE_VISIBILITY: () => (/* binding */ DEFAULT_KEY_TOGGLE_VISIBILITY),
/* harmony export */   buildKeyString: () => (/* binding */ buildKeyString),
/* harmony export */   isEditableTarget: () => (/* binding */ isEditableTarget)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Canonical shortcut-key handling shared by the content script.
 *
 * Storage format (must match the settings recorder):
 *   Parts in order: Ctrl, Alt, Shift, Meta, then the normalized key.
 *   Joined with "+". Example: "Ctrl+Shift+ArrowUp".
 */

var DEFAULT_KEY_TOGGLE_LAYOUT = 'F9';
var DEFAULT_KEY_TOGGLE_VISIBILITY = 'F10';
var MODIFIER_ONLY_KEYS = ['Control', 'Alt', 'Shift', 'Meta', 'AltGraph', 'OS'];
function normalizeKeyName(key) {
  if (key === ' ') return 'Space';
  return key;
}

/**
 * Build the canonical key string for a KeyboardEvent.
 * Returns null for modifier-only presses and reserved keys (Escape).
 */
function buildKeyString(event) {
  if (!event || MODIFIER_ONLY_KEYS.includes(event.key)) return null;
  if (event.key === 'Escape') return null;
  var parts = [];
  if (event.ctrlKey) parts.push('Ctrl');
  if (event.altKey) parts.push('Alt');
  if (event.shiftKey) parts.push('Shift');
  if (event.metaKey) parts.push('Meta');
  parts.push(normalizeKeyName(event.key));
  return parts.join('+');
}

/**
 * Returns true when keyboard shortcuts must not fire because the user is
 * typing into a form control or editable element.
 */
function isEditableTarget(target) {
  if (!target || _typeof(target) !== 'object') return false;
  var tagName = typeof target.tagName === 'string' ? target.tagName.toUpperCase() : '';
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }
  return target.isContentEditable === true;
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkIsBrowserFullscreen: () => (/* binding */ checkIsBrowserFullscreen),
/* harmony export */   formatTime: () => (/* binding */ formatTime)
/* harmony export */ });
// format time in seconds to mm:ss
function formatTime(seconds) {
  var value = Number(seconds);
  // Live streams / not-yet-loaded media report Infinity or NaN — never render
  // "Infinity:NaN". Use a placeholder instead.
  if (!Number.isFinite(value) || value < 0) return '--:--';
  var total = Math.floor(value);
  var mins = Math.floor(total / 60);
  var secs = total % 60;
  return "".concat(String(mins).padStart(2, '0'), ":").concat(String(secs).padStart(2, '0'));
}

// check if fullscreen for browser (F11 / browser-level fullscreen)
function checkIsBrowserFullscreen() {
  // Element/native fullscreen is handled separately; don't report browser
  // fullscreen while an element is fullscreen.
  var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (fsEl) return false;

  // Small tolerance avoids zoom/DPI/taskbar rounding false negatives.
  var TOLERANCE = 2;
  return Math.abs(window.innerHeight - screen.height) <= TOLERANCE && Math.abs(window.innerWidth - screen.width) <= TOLERANCE;
}

/***/ }),

/***/ "./src/widgets.js":
/*!************************!*\
  !*** ./src/widgets.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FULLSCREEN_EVENTS: () => (/* binding */ FULLSCREEN_EVENTS),
/* harmony export */   TimeDisplay: () => (/* binding */ TimeDisplay),
/* harmony export */   WindowOverlayTimeDisplay: () => (/* binding */ WindowOverlayTimeDisplay),
/* harmony export */   getFullscreenElement: () => (/* binding */ getFullscreenElement)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./i18n */ "./src/i18n.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var FULLSCREEN_EVENTS = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
}
function isVideoElement(element) {
  return !!element && typeof HTMLVideoElement !== 'undefined' && element instanceof HTMLVideoElement;
}
var POPOVER_SUPPORTED = typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function' && typeof HTMLElement.prototype.hidePopover === 'function';
var OVERLAY_STYLE_ID = 'fs-time-overlay-styles';
var OVERLAY_STYLES = "\n  .fs-time-overlay {\n    position: fixed;\n    overflow: visible;\n    box-sizing: border-box;\n    background: rgba(0, 0, 0, 0.72);\n    color: #fff;\n    border: 1px solid rgba(255, 255, 255, 0.18);\n    border-radius: 8px;\n    padding: 6px 10px;\n    font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n    font-size: 15px;\n    font-weight: 600;\n    line-height: 1.3;\n    font-variant-numeric: tabular-nums;\n    white-space: nowrap;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);\n    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);\n    transition: opacity 180ms ease;\n  }\n\n  [popover].fs-time-overlay {\n    inset: auto;\n    margin: 0;\n    width: max-content;\n    max-width: none;\n    max-height: none;\n    overflow: visible;\n  }\n\n  .fs-time-overlay::backdrop {\n    background: transparent;\n    pointer-events: none;\n  }\n\n  .fs-time-overlay.is-faded {\n    opacity: 0;\n    pointer-events: none;\n  }\n\n  .fs-time-close {\n    position: absolute;\n    top: -9px;\n    right: -9px;\n    box-sizing: border-box;\n    display: grid;\n    place-items: center;\n    width: 24px;\n    height: 24px;\n    padding: 0;\n    border: 1px solid rgba(255, 255, 255, 0.4);\n    border-radius: 50%;\n    background: rgba(10, 12, 16, 0.92);\n    color: #fff;\n    font: 600 16px/1 system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n    cursor: pointer;\n    opacity: 0;\n    pointer-events: none;\n    transform: scale(0.92);\n    transition: opacity 140ms ease, transform 140ms ease, background-color 140ms ease;\n  }\n\n  .fs-time-overlay:hover .fs-time-close,\n  .fs-time-overlay:focus-within .fs-time-close,\n  .fs-time-overlay.is-close-forced .fs-time-close,\n  .fs-time-overlay[popover] .fs-time-close {\n    opacity: 1;\n    pointer-events: auto;\n    transform: scale(1);\n  }\n\n  .fs-time-close:hover {\n    background: rgba(40, 44, 52, 0.98);\n  }\n\n  .fs-time-close:focus-visible {\n    outline: 2px solid #fff;\n    outline-offset: 2px;\n  }\n\n  .fs-time-overlay.is-faded .fs-time-close {\n    opacity: 0;\n    pointer-events: none;\n  }\n\n  .fs-time-dismiss-hint {\n    position: fixed;\n    top: 14px;\n    left: 50%;\n    z-index: 2147483647;\n    box-sizing: border-box;\n    max-width: min(92vw, 520px);\n    padding: 8px 14px;\n    transform: translateX(-50%);\n    background: rgba(0, 0, 0, 0.82);\n    color: #fff;\n    border: 1px solid rgba(255, 255, 255, 0.18);\n    border-radius: 999px;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);\n    font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n    font-size: 13px;\n    font-weight: 600;\n    line-height: 1.35;\n    letter-spacing: 0.01em;\n    text-align: center;\n    white-space: normal;\n    pointer-events: none;\n    animation: fs-time-hint-in 180ms ease-out;\n  }\n\n  [popover].fs-time-dismiss-hint {\n    inset: auto;\n    top: 14px;\n    left: 50%;\n    margin: 0;\n    width: max-content;\n    max-width: min(92vw, 520px);\n    max-height: none;\n    overflow: visible;\n    transform: translateX(-50%);\n  }\n\n  .fs-time-dismiss-hint::backdrop {\n    background: transparent;\n    pointer-events: none;\n  }\n\n  @keyframes fs-time-hint-in {\n    from {\n      opacity: 0;\n      transform: translate(-50%, -4px);\n    }\n    to {\n      opacity: 1;\n      transform: translate(-50%, 0);\n    }\n  }\n\n  @media (pointer: coarse) {\n    .fs-time-overlay .fs-time-close {\n      opacity: 1;\n      pointer-events: auto;\n      transform: scale(1);\n    }\n  }\n\n  @media (prefers-reduced-motion: reduce) {\n    .fs-time-overlay,\n    .fs-time-close,\n    .fs-time-dismiss-hint {\n      transition: none !important;\n      animation: none !important;\n    }\n  }\n";
function injectOverlayStyles() {
  if (typeof document === 'undefined' || !document.head) return;
  if (document.getElementById(OVERLAY_STYLE_ID)) return;
  var style = document.createElement('style');
  style.id = OVERLAY_STYLE_ID;
  style.textContent = OVERLAY_STYLES;
  document.head.appendChild(style);
}
var DEFAULT_SETTINGS = {
  showWhenVideoFullscreen: true,
  showOnFullscreen: true,
  showSeconds: true,
  showProgress: true,
  autoHide: false,
  layoutMode: 'snap',
  floatPositionVideo: null,
  floatPositionWindow: null
};
function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
var TimeDisplay = /*#__PURE__*/function () {
  function TimeDisplay(media) {
    _classCallCheck(this, TimeDisplay);
    injectOverlayStyles();
    this.media = media;
    this.timeElement = this.createTimeElement();
    this._timeTextSpan = this._timeTextSpan || null;
    this._closeBtn = this._closeBtn || null;
    Object.assign(this, DEFAULT_SETTINGS);
    this.autoHideTimer = null;
    this._boundWakeHandler = null;
    this._isDragging = false;
    this._activePointerId = null;
    this._dragOffset = {
      x: 0,
      y: 0
    };
    this._positionMode = 'fixed';
    this._popoverMode = false;
    this._visible = false;
    this._forceCloseVisible = false;
    this._popoverRetryTimer = null;
    this._popoverRetryCount = 0;
    this.videoOverlayActive = false;
    this._dismissHintElement = null;
    this._dismissHintTimer = null;
    this._boundDismissHintFullscreenExit = null;
    this._boundPointerDown = null;
    this._boundPointerMove = null;
    this._boundPointerUp = null;
    this._boundPointerCancel = null;
  }

  // --- settings -----------------------------------------------------------
  return _createClass(TimeDisplay, [{
    key: "applySettings",
    value: function applySettings(settings) {
      if (!settings) return;
      if (hasOwn(settings, 'showWhenVideoFullscreen')) {
        this.showWhenVideoFullscreen = settings.showWhenVideoFullscreen !== false;
      }
      if (hasOwn(settings, 'showOnFullscreen')) {
        this.showOnFullscreen = settings.showOnFullscreen !== false;
      }
      if (hasOwn(settings, 'showSeconds')) {
        this.showSeconds = settings.showSeconds !== false;
      }
      if (hasOwn(settings, 'showProgress')) {
        this.showProgress = settings.showProgress !== false;
      }
      if (hasOwn(settings, 'autoHide')) {
        this.autoHide = settings.autoHide === true;
      }
      if (hasOwn(settings, 'layoutMode')) {
        this.layoutMode = settings.layoutMode === 'float' ? 'float' : 'snap';
      }
      if (hasOwn(settings, 'floatPositionVideo')) {
        this.floatPositionVideo = settings.floatPositionVideo || null;
      }
      if (hasOwn(settings, 'floatPositionWindow')) {
        this.floatPositionWindow = settings.floatPositionWindow || null;
      }

      // Re-translate the close button when settings/language are re-applied.
      this._refreshCloseButtonLabel();
    }
  }, {
    key: "_refreshCloseButtonLabel",
    value: function _refreshCloseButtonLabel() {
      if (!this._closeBtn) return;
      var label = (0,_i18n__WEBPACK_IMPORTED_MODULE_1__.t)('closeBtnTitle');
      this._closeBtn.title = label;
      this._closeBtn.setAttribute('aria-label', label);
    }
  }, {
    key: "displayType",
    value: function displayType() {
      return 'media';
    }
  }, {
    key: "isShowing",
    value: function isShowing() {
      return this._visible;
    }
  }, {
    key: "_floatStorageKey",
    value: function _floatStorageKey() {
      return this.displayType() === 'window-overlay' ? 'floatPositionWindow' : 'floatPositionVideo';
    }
  }, {
    key: "_getFloatPosition",
    value: function _getFloatPosition() {
      return this.displayType() === 'window-overlay' ? this.floatPositionWindow : this.floatPositionVideo;
    }
  }, {
    key: "_setFloatPosition",
    value: function _setFloatPosition(position) {
      if (this.displayType() === 'window-overlay') {
        this.floatPositionWindow = position;
      } else {
        this.floatPositionVideo = position;
      }
      chrome.storage.sync.set(_defineProperty({}, this._floatStorageKey(), position));
    }

    // --- element creation ---------------------------------------------------
  }, {
    key: "createTimeElement",
    value: function createTimeElement() {
      var timeElement = document.createElement('div');
      timeElement.className = 'fs-time-overlay';
      timeElement.style.zIndex = '999999';
      timeElement.style.pointerEvents = 'auto';
      timeElement.style.display = 'none';

      // 独立文字容器（与 × 按钮并列，避免 updateTime 误删按钮）
      var textSpan = document.createElement('span');
      textSpan.textContent = '00:00 / 00:00';
      this._timeTextSpan = textSpan;
      timeElement.appendChild(textSpan);
      var closeBtn = this._createCloseButton();
      this._closeBtn = closeBtn;
      this._refreshCloseButtonLabel();
      timeElement.appendChild(closeBtn);
      return timeElement;
    }

    // 创建右上角关闭按钮 ×（位于 timeElement 内部右上角）
  }, {
    key: "_createCloseButton",
    value: function _createCloseButton() {
      var _this = this;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fs-time-close';
      btn.textContent = '×';
      btn.addEventListener('pointerdown', function (e) {
        return e.stopPropagation();
      }); // 阻止拖拽
      btn.addEventListener('mousedown', function (e) {
        return e.stopPropagation();
      });
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        _this.handleDismiss();
      });
      return btn;
    }
  }, {
    key: "handleDismiss",
    value: function handleDismiss() {
      document.dispatchEvent(new CustomEvent('fs-time-dismiss', {
        detail: {
          displayType: this.displayType()
        }
      }));
      this._showDismissHint();
    }
  }, {
    key: "_showDismissHint",
    value: function _showDismissHint() {
      var _this2 = this;
      this._hideDismissHint();
      if (!document.body) return;
      var hint = document.createElement('div');
      hint.className = 'fs-time-dismiss-hint';
      hint.setAttribute('role', 'status');
      hint.setAttribute('aria-live', 'polite');
      hint.setAttribute('aria-atomic', 'true');
      document.body.appendChild(hint);
      if (getFullscreenElement() && POPOVER_SUPPORTED) {
        try {
          hint.setAttribute('popover', 'manual');
          hint.showPopover();
        } catch (e) {
          hint.removeAttribute('popover');
        }
      }

      // Set the text after the live region is connected so it is announced.
      hint.textContent = (0,_i18n__WEBPACK_IMPORTED_MODULE_1__.t)('dismissHint');
      this._dismissHintElement = hint;
      this._boundDismissHintFullscreenExit = function () {
        if (!getFullscreenElement()) {
          _this2._hideDismissHint();
        }
      };
      FULLSCREEN_EVENTS.forEach(function (eventName) {
        document.addEventListener(eventName, _this2._boundDismissHintFullscreenExit);
      });
      window.addEventListener('resize', this._boundDismissHintFullscreenExit);
      this._dismissHintTimer = setTimeout(function () {
        return _this2._hideDismissHint();
      }, 3000);
    }
  }, {
    key: "_hideDismissHint",
    value: function _hideDismissHint() {
      var _this3 = this;
      if (this._dismissHintTimer) {
        clearTimeout(this._dismissHintTimer);
        this._dismissHintTimer = null;
      }
      if (this._boundDismissHintFullscreenExit) {
        FULLSCREEN_EVENTS.forEach(function (eventName) {
          document.removeEventListener(eventName, _this3._boundDismissHintFullscreenExit);
        });
        window.removeEventListener('resize', this._boundDismissHintFullscreenExit);
        this._boundDismissHintFullscreenExit = null;
      }
      var hint = this._dismissHintElement;
      if (!hint) return;
      if (hint.hasAttribute('popover')) {
        try {
          hint.hidePopover();
        } catch (e) {
          // not currently open / unsupported state
        }
        hint.removeAttribute('popover');
      }
      if (hint.parentElement) {
        hint.parentElement.removeChild(hint);
      }
      this._dismissHintElement = null;
    }

    // --- visibility ---------------------------------------------------------
  }, {
    key: "checkIsToShow",
    value: function checkIsToShow() {
      if (!this.showWhenVideoFullscreen) {
        return false;
      }
      var fsEl = getFullscreenElement();
      if (!fsEl || !this.media) return false;
      return fsEl === this.media || fsEl.contains(this.media) || this.media.contains(fsEl);
    }
  }, {
    key: "updateVisibility",
    value: function updateVisibility() {
      if (this.checkIsToShow()) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: "_resetCloseButton",
    value: function _resetCloseButton() {
      if (!this._closeBtn) return;
      this._closeBtn.classList.toggle('is-close-forced', this._forceCloseVisible);
    }
  }, {
    key: "_getDomParent",
    value: function _getDomParent(fsEl) {
      return fsEl || document.body;
    }
  }, {
    key: "show",
    value: function show() {
      if (!this.timeElement) return;
      var fsEl = getFullscreenElement();
      var nativeVideoFullscreen = isVideoElement(fsEl);

      // Native <video> fullscreen renders in its own top layer. A regular DOM
      // child (even inside the video) is painted underneath the video. Use the
      // Popover API to promote the overlay into the browser top layer instead.
      if (nativeVideoFullscreen && !POPOVER_SUPPORTED) {
        // Unsupported API: no point retrying; go through shared cleanup.
        this.hide();
        return;
      }
      var usePopover = nativeVideoFullscreen && POPOVER_SUPPORTED;
      this._visible = true;
      this._popoverMode = usePopover;
      this.timeElement.style.zIndex = '999999';
      this.timeElement.style.opacity = '1';
      this.timeElement.classList.remove('is-faded');
      this._applyPointerMode(usePopover);
      this._resetCloseButton();
      if (usePopover) {
        if (document.body && this.timeElement.parentElement !== document.body) {
          document.body.appendChild(this.timeElement);
        }
        // Never force display:block before showPopover(). Let the UA
        // [popover]:not(:popover-open) rule keep a closed popover hidden.
        this.timeElement.style.display = '';
        if (!this._showPopover()) {
          // Transient failure while still in native video fullscreen: clean up
          // and retry a bounded number of times.
          this._handlePopoverFailure();
          return;
        }
        this._clearPopoverRetry();
        // Measure/position after promotion so offsetWidth/Height are real.
        this._positionElement();
      } else {
        this._clearPopoverRetry();
        this._teardownPopover();
        var parent = this._getDomParent(fsEl);
        if (parent && this.timeElement.parentElement !== parent) {
          parent.appendChild(this.timeElement);
        }
        this.timeElement.style.display = 'block';
        this._positionElement();
      }
      this.updateTime();

      // A popover container is pointer-events:none (display-only), so dragging
      // is not possible/meaningful there.
      if (this.layoutMode === 'float' && !usePopover) {
        this.setupDragging();
      } else {
        this.teardownDragging();
      }
      if (this.autoHide) {
        this.startAutoHide();
      } else {
        this.clearAutoHideTimer();
        this.teardownWakeListener();
        this._restorePointerEvents();
        this.timeElement.style.opacity = '1';
      }
    }

    // Shared visibility cleanup used by hide() and popover failure handling.
  }, {
    key: "_cleanupForHide",
    value: function _cleanupForHide() {
      this._visible = false;
      this.clearAutoHideTimer();
      this.teardownWakeListener();
      this.teardownDragging();
      this._teardownPopover();
      if (this.timeElement) {
        // After hidePopover()/attribute removal, explicitly hide the node.
        this.timeElement.style.display = 'none';
        this.timeElement.style.opacity = '1';
        this.timeElement.style.pointerEvents = 'auto';
        this.timeElement.classList.remove('is-faded');
        this._forceCloseVisible = false;
        this._resetCloseButton();
        if (this.timeElement.parentElement) {
          this.timeElement.parentElement.removeChild(this.timeElement);
        }
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this._cleanupForHide();
      this._clearPopoverRetry();
    }
  }, {
    key: "_clearPopoverRetryTimer",
    value: function _clearPopoverRetryTimer() {
      if (this._popoverRetryTimer) {
        clearTimeout(this._popoverRetryTimer);
        this._popoverRetryTimer = null;
      }
    }
  }, {
    key: "_clearPopoverRetry",
    value: function _clearPopoverRetry() {
      this._clearPopoverRetryTimer();
      this._popoverRetryCount = 0;
    }
  }, {
    key: "_handlePopoverFailure",
    value: function _handlePopoverFailure() {
      var canRetry = isVideoElement(getFullscreenElement());
      this._cleanupForHide();
      if (canRetry) {
        this._schedulePopoverRetry();
      } else {
        this._clearPopoverRetryTimer();
        this._popoverRetryCount = 0;
      }
    }
  }, {
    key: "_schedulePopoverRetry",
    value: function _schedulePopoverRetry() {
      var _this4 = this;
      if (this._popoverRetryCount >= 3) return;
      this._popoverRetryCount += 1;
      this._clearPopoverRetryTimer();
      this._popoverRetryTimer = setTimeout(function () {
        _this4._popoverRetryTimer = null;
        if (!isVideoElement(getFullscreenElement())) {
          _this4._popoverRetryCount = 0;
          return;
        }
        if (!_this4.checkIsToShow()) {
          _this4._popoverRetryCount = 0;
          return;
        }
        _this4.updateVisibility();
      }, 100);
    }

    // --- placement ----------------------------------------------------------
  }, {
    key: "_positionElement",
    value: function _positionElement() {
      if (!this.timeElement) return;
      var fsEl = getFullscreenElement();
      // A fullscreen element covers the viewport, so viewport-fixed coordinates
      // work for container-append, popover, browser and window modes alike.
      // Using fixed everywhere also makes drag-end getBoundingClientRect()
      // coordinates reusable on the next show.
      this._positionMode = 'fixed';
      var style = this.timeElement.style;
      style.position = this._positionMode;
      style.margin = '0';
      style.right = 'auto';
      style.bottom = 'auto';
      style.transform = 'none';
      if (this.layoutMode === 'float') {
        var saved = this._getFloatPosition();
        if (saved) {
          this._applyFloatPosition(saved);
          return;
        }
        style.left = '50%';
        style.top = '20px';
        style.transform = 'translateX(-50%)';
      } else {
        style.left = '50%';
        style.top = '10px';
        style.transform = 'translateX(-50%)';
      }
    }
  }, {
    key: "_clampPosition",
    value: function _clampPosition(position) {
      var element = this.timeElement;
      var width = element ? element.offsetWidth || 0 : 0;
      var height = element ? element.offsetHeight || 0 : 0;
      var inset = 12;

      // Leave room for the close button and a visible margin. If the viewport
      // is too small for the inset, fall back to the edge instead of inverting.
      var canInsetX = window.innerWidth >= width + inset * 2;
      var canInsetY = window.innerHeight >= height + inset * 2;
      var minX = canInsetX ? inset : 0;
      var minY = canInsetY ? inset : 0;
      var maxX = canInsetX ? window.innerWidth - width - inset : Math.max(0, window.innerWidth - width);
      var maxY = canInsetY ? window.innerHeight - height - inset : Math.max(0, window.innerHeight - height);
      var rawX = Number(position && position.x);
      var rawY = Number(position && position.y);
      return {
        x: Math.round(Math.min(Math.max(minX, Number.isFinite(rawX) ? rawX : 0), maxX)),
        y: Math.round(Math.min(Math.max(minY, Number.isFinite(rawY) ? rawY : 0), maxY))
      };
    }
  }, {
    key: "_applyFloatPosition",
    value: function _applyFloatPosition(position) {
      if (!this.timeElement) return;
      var clamped = this._clampPosition(position);
      this.timeElement.style.position = this._positionMode;
      this.timeElement.style.transform = 'none';
      this.timeElement.style.left = "".concat(clamped.x, "px");
      this.timeElement.style.top = "".concat(clamped.y, "px");
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      if (!this._visible || this.layoutMode !== 'float' || this._isDragging) return;
      var saved = this._getFloatPosition();
      if (saved) this._applyFloatPosition(saved);
    }

    // --- popover ------------------------------------------------------------
  }, {
    key: "_showPopover",
    value: function _showPopover() {
      if (!POPOVER_SUPPORTED || !this.timeElement) return false;
      try {
        this.timeElement.setAttribute('popover', 'manual');
        // Re-showing promotes the overlay above the fullscreen backdrop on
        // every fullscreenchange.
        try {
          this.timeElement.hidePopover();
        } catch (e) {
          // not currently open
        }
        this.timeElement.showPopover();
        return true;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "_hidePopover",
    value: function _hidePopover() {
      if (!this.timeElement || !POPOVER_SUPPORTED) return;
      try {
        this.timeElement.hidePopover();
      } catch (e) {
        // not currently open / unsupported state
      }
    }
  }, {
    key: "_teardownPopover",
    value: function _teardownPopover() {
      if (!this.timeElement) return;
      if (POPOVER_SUPPORTED && this.timeElement.hasAttribute('popover')) {
        this._hidePopover();
      }
      if (this.timeElement.hasAttribute('popover')) {
        this.timeElement.removeAttribute('popover');
      }
    }

    // --- pointer / drag -----------------------------------------------------
  }, {
    key: "_applyPointerMode",
    value: function _applyPointerMode(usePopover) {
      if (!this.timeElement) return;
      // Popover overlays sit above a native fullscreen video and are
      // display-only; the close button is best-effort interactive.
      this._forceCloseVisible = usePopover;
      this.timeElement.style.pointerEvents = usePopover ? 'none' : 'auto';
      this._resetCloseButton();
    }
  }, {
    key: "_restorePointerEvents",
    value: function _restorePointerEvents() {
      if (!this.timeElement) return;
      this.timeElement.classList.remove('is-faded');
      this.timeElement.style.pointerEvents = this._popoverMode ? 'none' : 'auto';
    }
  }, {
    key: "setupDragging",
    value: function setupDragging() {
      var _this5 = this;
      this.teardownDragging();
      if (!this.timeElement) return;
      // Popover containers are pointer-events:none; no drag there.
      if (this._popoverMode) return;
      this._isDragging = false;
      this.timeElement.style.cursor = 'move';
      this.timeElement.style.userSelect = 'none';
      this.timeElement.style.touchAction = 'none';
      this._boundPointerDown = function (e) {
        return _this5._onDragStart(e);
      };
      this._boundPointerMove = function (e) {
        return _this5._onDragMove(e);
      };
      this._boundPointerUp = function (e) {
        return _this5._onDragEnd(e);
      };
      this._boundPointerCancel = function (e) {
        return _this5._onDragEnd(e);
      };
      this.timeElement.addEventListener('pointerdown', this._boundPointerDown);
      this.timeElement.addEventListener('pointermove', this._boundPointerMove);
      this.timeElement.addEventListener('pointerup', this._boundPointerUp);
      this.timeElement.addEventListener('pointercancel', this._boundPointerCancel);
    }
  }, {
    key: "teardownDragging",
    value: function teardownDragging() {
      if (!this.timeElement) return;
      this.timeElement.style.cursor = '';
      this.timeElement.style.userSelect = '';
      this.timeElement.style.touchAction = '';
      if (this._boundPointerDown) {
        this.timeElement.removeEventListener('pointerdown', this._boundPointerDown);
        this._boundPointerDown = null;
      }
      if (this._boundPointerMove) {
        this.timeElement.removeEventListener('pointermove', this._boundPointerMove);
        this._boundPointerMove = null;
      }
      if (this._boundPointerUp) {
        this.timeElement.removeEventListener('pointerup', this._boundPointerUp);
        this._boundPointerUp = null;
      }
      if (this._boundPointerCancel) {
        this.timeElement.removeEventListener('pointercancel', this._boundPointerCancel);
        this._boundPointerCancel = null;
      }
      this._isDragging = false;
      this._activePointerId = null;
    }
  }, {
    key: "_onDragStart",
    value: function _onDragStart(e) {
      if (!this.timeElement) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // Clicking the close button must not start a drag.
      if (e.target === this._closeBtn || this._closeBtn && this._closeBtn.contains(e.target)) {
        return;
      }
      this._isDragging = true;
      this._activePointerId = e.pointerId;
      var rect = this.timeElement.getBoundingClientRect();
      this._dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      try {
        this.timeElement.setPointerCapture(e.pointerId);
      } catch (err) {
        // pointer capture is best-effort
      }
      this._wake();
      e.preventDefault();
    }
  }, {
    key: "_onDragMove",
    value: function _onDragMove(e) {
      if (!this._isDragging || !this.timeElement) return;
      if (this._activePointerId !== null && e.pointerId !== this._activePointerId) return;
      var position = this._clampPosition({
        x: e.clientX - this._dragOffset.x,
        y: e.clientY - this._dragOffset.y
      });
      this.timeElement.style.position = this._positionMode;
      this.timeElement.style.transform = 'none';
      this.timeElement.style.left = "".concat(position.x, "px");
      this.timeElement.style.top = "".concat(position.y, "px");
      this._wake();
    }
  }, {
    key: "_onDragEnd",
    value: function _onDragEnd(e) {
      if (!this._isDragging || !this.timeElement) return;
      this._isDragging = false;
      if (this._activePointerId !== null) {
        try {
          if (this.timeElement.hasPointerCapture && this.timeElement.hasPointerCapture(this._activePointerId)) {
            this.timeElement.releasePointerCapture(this._activePointerId);
          }
        } catch (err) {
          // ignore
        }
      }
      this._activePointerId = null;
      var rect = this.timeElement.getBoundingClientRect();
      var position = this._clampPosition({
        x: rect.left,
        y: rect.top
      });
      this._setFloatPosition(position);
      if (this.autoHide) this._wake();
    }

    // --- auto hide ----------------------------------------------------------
  }, {
    key: "startAutoHide",
    value: function startAutoHide() {
      var _this6 = this;
      if (!this.timeElement) return;
      this.timeElement.style.opacity = '1';
      this._restorePointerEvents();
      this.clearAutoHideTimer();
      this._setupWakeListener();
      this.autoHideTimer = setTimeout(function () {
        return _this6.fadeOut();
      }, 3000);
    }
  }, {
    key: "clearAutoHideTimer",
    value: function clearAutoHideTimer() {
      if (this.autoHideTimer) {
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = null;
      }
    }
  }, {
    key: "_setupWakeListener",
    value: function _setupWakeListener() {
      var _this7 = this;
      this.teardownWakeListener();
      this._boundWakeHandler = function () {
        return _this7._wake();
      };

      // Wake on activity anywhere in the fullscreen container/document, not
      // only over the <video> element.
      document.addEventListener('mousemove', this._boundWakeHandler, {
        passive: true
      });
      document.addEventListener('pointermove', this._boundWakeHandler, {
        passive: true
      });
      if (this.timeElement) {
        this.timeElement.addEventListener('pointerdown', this._boundWakeHandler);
        this.timeElement.addEventListener('mousemove', this._boundWakeHandler);
      }
    }
  }, {
    key: "teardownWakeListener",
    value: function teardownWakeListener() {
      if (this._boundWakeHandler) {
        document.removeEventListener('mousemove', this._boundWakeHandler);
        document.removeEventListener('pointermove', this._boundWakeHandler);
        if (this.timeElement) {
          this.timeElement.removeEventListener('pointerdown', this._boundWakeHandler);
          this.timeElement.removeEventListener('mousemove', this._boundWakeHandler);
        }
        this._boundWakeHandler = null;
      }
    }
  }, {
    key: "_wake",
    value: function _wake() {
      var _this8 = this;
      if (!this.autoHide || !this._visible || !this.timeElement) return;
      this.timeElement.style.opacity = '1';
      this._restorePointerEvents();
      this.clearAutoHideTimer();
      this.autoHideTimer = setTimeout(function () {
        return _this8.fadeOut();
      }, 3000);
    }
  }, {
    key: "fadeOut",
    value: function fadeOut() {
      if (!this.timeElement) return;
      this.timeElement.classList.add('is-faded');
      this.timeElement.style.opacity = '0';
      this.timeElement.style.pointerEvents = 'none';
      this.autoHideTimer = null;
    }

    // --- time ---------------------------------------------------------------
  }, {
    key: "_systemTime",
    value: function _systemTime() {
      var now = new Date();
      var hours = String(now.getHours()).padStart(2, '0');
      var minutes = String(now.getMinutes()).padStart(2, '0');
      return this.showSeconds ? "".concat(hours, ":").concat(minutes, ":").concat(String(now.getSeconds()).padStart(2, '0')) : "".concat(hours, ":").concat(minutes);
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      if (!this._timeTextSpan) return;
      var systemTime = this._systemTime();
      if (this.showProgress && this.media) {
        var currentTime = Number(this.media.currentTime);
        var duration = Number(this.media.duration);
        this._timeTextSpan.textContent = "".concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(currentTime), " / ").concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration), " | ").concat(systemTime);
      } else {
        this._timeTextSpan.textContent = systemTime;
      }
    }

    // --- teardown -----------------------------------------------------------
  }, {
    key: "destroy",
    value: function destroy() {
      this._visible = false;
      this._clearPopoverRetry();
      this.clearAutoHideTimer();
      this.teardownWakeListener();
      this.teardownDragging();
      this._teardownPopover();
      this._hideDismissHint();
      if (this.timeElement && this.timeElement.parentElement) {
        this.timeElement.parentElement.removeChild(this.timeElement);
      }
      this.timeElement = null;
      this._timeTextSpan = null;
      this._closeBtn = null;
      this.media = null;
    }
  }]);
}();
var WindowOverlayTimeDisplay = /*#__PURE__*/function (_TimeDisplay) {
  function WindowOverlayTimeDisplay() {
    _classCallCheck(this, WindowOverlayTimeDisplay);
    return _callSuper(this, WindowOverlayTimeDisplay, arguments);
  }
  _inherits(WindowOverlayTimeDisplay, _TimeDisplay);
  return _createClass(WindowOverlayTimeDisplay, [{
    key: "displayType",
    value: function displayType() {
      return 'window-overlay';
    }
  }, {
    key: "checkIsToShow",
    value: function checkIsToShow() {
      if (!this.showOnFullscreen) {
        return false;
      }
      var fsEl = getFullscreenElement();
      if (!fsEl) {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
      }

      // Native video fullscreen is handled by the video widget's top-layer
      // popover; the window overlay must not duplicate it.
      if (isVideoElement(fsEl)) {
        return false;
      }
      return !this.videoOverlayActive;
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      if (!this._timeTextSpan) return;
      this._timeTextSpan.textContent = this._systemTime();
    }
  }]);
}(TimeDisplay);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./widgets */ "./src/widgets.js");
/* harmony import */ var _i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./i18n */ "./src/i18n.js");
/* harmony import */ var _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shortcutKeys */ "./src/shortcutKeys.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }




var IS_TOP_FRAME = window.top === window;
var MAX_SCAN_RETRIES = 5;

// 初始化自定义 i18n（异步加载翻译）
(0,_i18n__WEBPACK_IMPORTED_MODULE_2__.init)().then(function () {
  // Widgets may have been created with fallback labels before translations
  // resolved. Re-apply settings so localized labels are refreshed.
  distributeSettings();
});
function logTop() {
  var _console;
  if (IS_TOP_FRAME) (_console = console).log.apply(_console, arguments);
}
logTop((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgLoaded'));

// --- centralized settings ------------------------------------------------

var DEFAULT_SETTINGS = {
  showWhenVideoFullscreen: true,
  showOnFullscreen: true,
  showSeconds: true,
  showProgress: true,
  autoHide: false,
  layoutMode: 'snap',
  floatPositionVideo: null,
  floatPositionWindow: null
};
var settings = Object.assign({}, DEFAULT_SETTINGS);

// Shortcut bindings are cached so the keydown path stays synchronous.
var shortcutKeys = {
  keyToggleLayout: _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_LAYOUT,
  keyToggleVisibility: _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_VISIBILITY
};
function normalizeStoredShortcut(value) {
  // Normalize legacy Space bindings to the canonical "Space" name.
  // Bare " " => "Space"; "Ctrl+ " => "Ctrl+Space".
  if (value === ' ') return 'Space';
  if (value.endsWith('+ ')) return "".concat(value.slice(0, -1), "Space");
  return value;
}
function readStoredShortcut(value, fallback) {
  // Missing/non-string => default; empty string => explicitly disabled;
  // any other string => binding (normalized if needed).
  if (typeof value !== 'string') return fallback;
  if (value === '') return '';
  return normalizeStoredShortcut(value);
}
var SETTING_KEYS = ['showWhenVideoFullscreen', 'showOnFullscreen', 'showSeconds', 'showProgress', 'autoHide', 'layoutMode', 'floatPositionVideo', 'floatPositionWindow'];

// video -> widget (prevents duplicate binding)
var videoWidgets = new WeakMap();
// iterable companion to the WeakMap (WeakMap is not iterable)
var trackedVideos = new Set();
var overlayTimeDisp = IS_TOP_FRAME ? new _widgets__WEBPACK_IMPORTED_MODULE_1__.WindowOverlayTimeDisplay(document.body || document.documentElement) : null;

// All timers created by index are tracked so teardown can clear them.
var pendingTimeouts = new Set();
function scheduleTimeout(callback, delay) {
  var id = setTimeout(function () {
    pendingTimeouts["delete"](id);
    callback();
  }, delay);
  pendingTimeouts.add(id);
  return id;
}
function clearPendingTimeouts() {
  pendingTimeouts.forEach(function (id) {
    return clearTimeout(id);
  });
  pendingTimeouts.clear();
}
function distributeSettings() {
  trackedVideos.forEach(function (video) {
    var widget = videoWidgets.get(video);
    if (widget) widget.applySettings(settings);
  });
  if (overlayTimeDisp) overlayTimeDisp.applySettings(settings);
  // applySettings is pure; visibility (and single-widget selection) is
  // centralized so multiple matching videos never stack clocks.
  updateAllVisibility();
}
function loadSettings() {
  chrome.storage.sync.get(Object.assign({
    floatPosition: null,
    keyToggleLayout: _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_LAYOUT,
    keyToggleVisibility: _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_VISIBILITY
  }, DEFAULT_SETTINGS), function (items) {
    var legacy = items.floatPosition;
    var normalizedLayout = readStoredShortcut(items.keyToggleLayout, _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_LAYOUT);
    var normalizedVisibility = readStoredShortcut(items.keyToggleVisibility, _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_VISIBILITY);
    shortcutKeys.keyToggleLayout = normalizedLayout;
    shortcutKeys.keyToggleVisibility = normalizedVisibility;

    // One-time normalization migration for legacy Space bindings (or other
    // corrected values). Normalization is idempotent, so this cannot loop.
    var shortcutUpdates = {};
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
    var migrated = false;
    if (legacy && _typeof(legacy) === 'object') {
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
  });
}
loadSettings();

// Single storage listener for the whole page / frame.
function handleStorageChanged(changes, namespace) {
  if (namespace !== 'sync') return;
  var changed = false;
  SETTING_KEYS.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      settings[key] = changes[key].newValue;
      changed = true;
    }
  });
  if (Object.prototype.hasOwnProperty.call(changes, 'keyToggleLayout')) {
    shortcutKeys.keyToggleLayout = readStoredShortcut(changes.keyToggleLayout.newValue, _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_LAYOUT);
  }
  if (Object.prototype.hasOwnProperty.call(changes, 'keyToggleVisibility')) {
    shortcutKeys.keyToggleVisibility = readStoredShortcut(changes.keyToggleVisibility.newValue, _shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_KEY_TOGGLE_VISIBILITY);
  }
  var languageChanged = Object.prototype.hasOwnProperty.call(changes, 'language');

  // Language change must not swallow co-changed settings.
  if (languageChanged) {
    (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.reloadFromStorage)().then(function () {
      return distributeSettings();
    });
  }
  if (changed) distributeSettings();
}
chrome.storage.onChanged.addListener(handleStorageChanged);

// --- media discovery / binding ------------------------------------------

function bindVideo(video) {
  if (!video || video.tagName !== 'VIDEO') return;
  if (videoWidgets.has(video)) return;
  var widget = new _widgets__WEBPACK_IMPORTED_MODULE_1__.TimeDisplay(video);
  videoWidgets.set(video, widget);
  trackedVideos.add(video);
  widget.applySettings(settings);
  updateAllVisibility();
}
function destroyVideo(video) {
  var widget = videoWidgets.get(video);
  if (widget) widget.destroy();
  videoWidgets["delete"](video);
  trackedVideos["delete"](video);
}
function scanForMedia(root) {
  var videos = (root || document).querySelectorAll('video');
  var found = 0;
  videos.forEach(function (video) {
    if (!videoWidgets.has(video)) {
      bindVideo(video);
      found++;
    }
  });
  return found;
}

// Scan immediately; if no videos exist yet, retry a bounded number of times
// (5 x 1s) rather than polling forever.
var scanRetries = 0;
function initialScan() {
  var found = scanForMedia(document);
  if (found > 0) {
    logTop((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgFoundMedia'), found);
    return;
  }
  if (scanRetries < MAX_SCAN_RETRIES) {
    scanRetries++;
    scheduleTimeout(initialScan, 1000);
    return;
  }
  logTop((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgNoMedia'));
}
initialScan();

// Dynamic videos: bind newly added videos and destroy widgets for removed ones.
var mediaObserver = new MutationObserver(function (mutations) {
  var sawRemoval = false;
  mutations.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (node) {
      if (!node || node.nodeType !== 1) return;
      if (node.tagName === 'VIDEO') {
        bindVideo(node);
      }
      if (node.querySelectorAll) {
        node.querySelectorAll('video').forEach(function (video) {
          return bindVideo(video);
        });
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
  trackedVideos.forEach(function (video) {
    if (!video.isConnected) destroyVideo(video);
  });
}

// --- centralized scheduling / visibility --------------------------------

var ticker = setInterval(function () {
  trackedVideos.forEach(function (video) {
    var widget = videoWidgets.get(video);
    if (widget && widget.isShowing()) widget.updateTime();
  });
  if (overlayTimeDisp && overlayTimeDisp.isShowing()) {
    overlayTimeDisp.updateTime();
  }
}, 1000);
function updateAllVisibility() {
  var fsEl = (0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)();
  var winnerWidget = null;
  if (fsEl) {
    // Only one clock may win inside a fullscreen container. Prefer the video
    // that is actually playing, then the exact fullscreen element, then the
    // first matching widget.
    var candidates = [];
    trackedVideos.forEach(function (video) {
      var widget = videoWidgets.get(video);
      if (widget && widget.checkIsToShow()) {
        candidates.push({
          video: video,
          widget: widget
        });
      }
    });
    var winner = null;
    if (candidates.length > 0) {
      winner = candidates.find(function (c) {
        return !c.video.paused && !c.video.ended;
      }) || candidates.find(function (c) {
        return c.video === fsEl;
      }) || candidates[0];
    }
    winnerWidget = winner ? winner.widget : null;
    trackedVideos.forEach(function (video) {
      var widget = videoWidgets.get(video);
      if (widget && widget !== winnerWidget && widget.isShowing()) {
        widget.hide();
      }
    });
    if (winnerWidget) winnerWidget.updateVisibility();
  } else {
    trackedVideos.forEach(function (video) {
      var widget = videoWidgets.get(video);
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
  trackedVideos.forEach(function (video) {
    var widget = videoWidgets.get(video);
    if (widget) widget.handleResize();
  });
  if (overlayTimeDisp) overlayTimeDisp.handleResize();
}
function handleFullscreenChange() {
  if (!(0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)() && !(0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)()) {
    restoreTempValues();
  }
  updateAllVisibility();
}

// Single set of global fullscreen/resize listeners.
_widgets__WEBPACK_IMPORTED_MODULE_1__.FULLSCREEN_EVENTS.forEach(function (eventName) {
  document.addEventListener(eventName, handleFullscreenChange);
});
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

// --- 快捷键处理（均为临时切换，不写 storage） ---

// 被快捷键临时改动的设置，退出全屏时恢复原值
var _tempOverrides = {};

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
  for (var _i = 0, _Object$entries = Object.entries(_tempOverrides); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      originalValue = _Object$entries$_i[1];
    applySettingToWidgets(key, originalValue);
  }
  for (var _key in _tempOverrides) {
    delete _tempOverrides[_key];
  }
}

// 检测退出全屏（含 F11）
function checkFullscreenExit() {
  var isFs = (0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)() || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
  if (!isFs) {
    restoreTempValues();
  }
}
window.addEventListener('resize', checkFullscreenExit);

// 关闭按钮 × → 临时隐藏（同快捷键 hide 行为）
function handleDismiss(e) {
  var settingKey = e.detail && e.detail.displayType === 'window-overlay' ? 'showOnFullscreen' : 'showWhenVideoFullscreen';
  var currentVal = settings[settingKey];
  if (currentVal === false) return; // 已经隐藏
  tempToggle(settingKey, false, currentVal);
  logTop("[".concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgDismissLabel'), "] ").concat(settingKey, " ").concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgDismissed')));
}
document.addEventListener('fs-time-dismiss', handleDismiss);
function isVideoContentFullscreen() {
  var fsEl = (0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)();
  if (!fsEl) return false;

  // Native video fullscreen.
  if (typeof HTMLVideoElement !== 'undefined' && fsEl instanceof HTMLVideoElement) {
    return true;
  }

  // Embedded content owns the fullscreen view; the child frame handles its own
  // video clock, so the top frame must not also render one.
  var embeddedConstructors = [typeof HTMLIFrameElement !== 'undefined' ? HTMLIFrameElement : null, typeof HTMLFrameElement !== 'undefined' ? HTMLFrameElement : null, typeof HTMLEmbedElement !== 'undefined' ? HTMLEmbedElement : null, typeof HTMLObjectElement !== 'undefined' ? HTMLObjectElement : null];
  for (var i = 0; i < embeddedConstructors.length; i += 1) {
    var Constructor = embeddedConstructors[i];
    if (Constructor && fsEl instanceof Constructor) return true;
  }

  // Player-container fullscreen containing a tracked video.
  var containsTrackedVideo = false;
  trackedVideos.forEach(function (video) {
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
  if ((0,_shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.isEditableTarget)(e.target)) return;
  var isFs = (0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)() || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
  if (!isFs) return;
  var pressed = (0,_shortcutKeys__WEBPACK_IMPORTED_MODULE_3__.buildKeyString)(e);
  if (!pressed) return;

  // Synchronous cache check: no async storage read in the keydown path.
  if (pressed === shortcutKeys.keyToggleLayout) {
    e.preventDefault();
    e.stopPropagation();
    // 从集中设置读取当前布局模式（storage 未被 shortcut 写过）
    var currentMode = settings.layoutMode;
    var newMode = currentMode === 'float' ? 'snap' : 'float';
    tempToggle('layoutMode', newMode, currentMode);
    logTop("[".concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgLayoutToggle'), "] ").concat(newMode === 'float' ? (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgFloat') : (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgSnap')));
    return;
  }
  if (pressed === shortcutKeys.keyToggleVisibility) {
    e.preventDefault();
    e.stopPropagation();

    // Video context is based on the fullscreen element itself, not on whether
    // the video clock is currently visible. This lets F10 restore a hidden
    // video overlay and prevents it from turning the window overlay on.
    var settingKey = isVideoContentFullscreen() ? 'showWhenVideoFullscreen' : 'showOnFullscreen';

    // 从集中设置读取当前状态（storage 从未被 shortcut 写过）
    var currentVal = settings[settingKey];
    tempToggle(settingKey, !currentVal, currentVal);
    logTop((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)(!currentVal ? 'msgVisibilityOn' : 'msgVisibilityOff'));
  }
}

// Capture phase so page handlers cannot swallow the shortcut first.
document.addEventListener('keydown', handleKeydown, true);

// --- teardown ------------------------------------------------------------

function teardown() {
  clearInterval(ticker);
  clearPendingTimeouts();
  mediaObserver.disconnect();
  _widgets__WEBPACK_IMPORTED_MODULE_1__.FULLSCREEN_EVENTS.forEach(function (eventName) {
    document.removeEventListener(eventName, handleFullscreenChange);
  });
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('orientationchange', handleResize);
  window.removeEventListener('resize', checkFullscreenExit);
  chrome.storage.onChanged.removeListener(handleStorageChanged);
  document.removeEventListener('keydown', handleKeydown, true);
  document.removeEventListener('fs-time-dismiss', handleDismiss);
  trackedVideos.forEach(function (video) {
    var widget = videoWidgets.get(video);
    if (widget) widget.destroy();
    videoWidgets["delete"](video);
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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RlYsYUFBYSxDQUFDUyxLQUFLLENBQUMsQ0FBQztFQUVyQixJQUFJUCxlQUFlLEVBQUU7SUFDbkJBLGVBQWUsQ0FBQzNCLE9BQU8sQ0FBQyxDQUFDO0lBQ3pCMkIsZUFBZSxHQUFHLElBQUk7RUFDeEI7QUFDRjs7QUFFQTtBQUNBO0FBQ0EsU0FBUytGLGNBQWNBLENBQUMvVyxLQUFLLEVBQUU7RUFDN0IsSUFBSUEsS0FBSyxDQUFDZ1gsU0FBUyxFQUFFO0VBQ3JCTCxRQUFRLENBQUMsQ0FBQztBQUNaO0FBRUF4VSxNQUFNLENBQUM2RixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUrTyxjQUFjLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy9pMThuLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy9zaG9ydGN1dEtleXMuanMiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy93aWRnZXRzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEN1c3RvbSBpMThuIG1vZHVsZSBmb3IgY29udGVudCBzY3JpcHQgKHdlYnBhY2stYnVuZGxlZCkuXG4gKiBMb2FkcyB0cmFuc2xhdGlvbnMgZnJvbSBfbG9jYWxlcy97bGFuZ30vbWVzc2FnZXMuanNvbiBhdCBydW50aW1lLlxuICovXG5cbmNvbnN0IFNVUFBPUlRFRF9MQU5HUyA9IFsnZW4nLCAnemhfQ04nXTtcbmNvbnN0IFNUT1JBR0VfS0VZID0gJ2xhbmd1YWdlJztcblxubGV0IF9jdXJyZW50TGFuZyA9IG51bGw7XG5sZXQgX3RyYW5zbGF0aW9ucyA9IHt9O1xubGV0IF9pbml0UHJvbWlzZSA9IG51bGw7XG5sZXQgX2xvYWRUb2tlbiA9IDA7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWVzc2FnZSBrZXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0KGtleSkge1xuICBpZiAoX3RyYW5zbGF0aW9uc1trZXldICYmIF90cmFuc2xhdGlvbnNba2V5XS5tZXNzYWdlKSB7XG4gICAgcmV0dXJuIF90cmFuc2xhdGlvbnNba2V5XS5tZXNzYWdlO1xuICB9XG4gIC8vIEZhbGxiYWNrIHRvIENocm9tZSBpMThuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGNocm9tZS5pMThuLmdldE1lc3NhZ2Uoa2V5KSB8fCBrZXk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJldHVybiBrZXk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRMYW5nKCkge1xuICByZXR1cm4gX2N1cnJlbnRMYW5nO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgaTE4bjogcmVhZCBzdG9yZWQgbGFuZ3VhZ2UsIGxvYWQgdHJhbnNsYXRpb25zLlxuICogQ2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBzYWZlbHkg4oCUIHJldHVybnMgc2FtZSBwcm9taXNlIG9uIHN1YnNlcXVlbnQgY2FsbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoX2luaXRQcm9taXNlKSByZXR1cm4gX2luaXRQcm9taXNlO1xuICBfaW5pdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNUT1JBR0VfS0VZLCAoaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlZCA9IGl0ZW1zW1NUT1JBR0VfS0VZXTtcbiAgICAgIGNvbnN0IGJyb3dzZXJMYW5nID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgICBjb25zdCBtYXBwZWQgPSBicm93c2VyTGFuZy5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgIGNvbnN0IGJlc3RMYW5nID0gc3RvcmVkIHx8IChTVVBQT1JURURfTEFOR1MuaW5jbHVkZXMobWFwcGVkKSA/IG1hcHBlZCA6ICdlbicpO1xuICAgICAgbG9hZExhbmcoYmVzdExhbmcpLnRoZW4oKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBfaW5pdFByb21pc2U7XG59XG5cbi8qKlxuICogUmVsb2FkIHRyYW5zbGF0aW9ucyBmb3IgYSBkaWZmZXJlbnQgbGFuZ3VhZ2UgKGNhbGxlZCB3aGVuIHN0b3JhZ2UgY2hhbmdlcykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWxvYWRGcm9tU3RvcmFnZSgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1RPUkFHRV9LRVksIChpdGVtcykgPT4ge1xuICAgICAgY29uc3QgbGFuZyA9IGl0ZW1zW1NUT1JBR0VfS0VZXSB8fCBfY3VycmVudExhbmcgfHwgJ2VuJztcbiAgICAgIGlmIChsYW5nICE9PSBfY3VycmVudExhbmcpIHtcbiAgICAgICAgbG9hZExhbmcobGFuZykudGhlbigoKSA9PiByZXNvbHZlKHRydWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEludmFsaWRhdGUgYW55IG9sZGVyIGluLWZsaWdodCBsb2FkLCBldmVuIHdoZW4gdGhlIHJlcXVlc3RlZFxuICAgICAgICAvLyBsYW5ndWFnZSBpcyBhbHJlYWR5IHRoZSBjdXJyZW50IG9uZS5cbiAgICAgICAgX2xvYWRUb2tlbiArPSAxO1xuICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogTG9hZCB0cmFuc2xhdGlvbnMgZm9yIGEgZ2l2ZW4gbGFuZ3VhZ2UgZnJvbSBfbG9jYWxlcy97bGFuZ30vbWVzc2FnZXMuanNvbi5cbiAqL1xuZnVuY3Rpb24gbG9hZExhbmcobGFuZykge1xuICAvLyBCdW1wIGJlZm9yZSB0aGUgY2FjaGUgY2hlY2sgc28gZXZlbiBhIGNhY2hlZCBuby1vcCBpbnZhbGlkYXRlcyBhbnkgb2xkZXJcbiAgLy8gaW4tZmxpZ2h0IHJlcXVlc3QuXG4gIF9sb2FkVG9rZW4gKz0gMTtcbiAgY29uc3QgdG9rZW4gPSBfbG9hZFRva2VuO1xuXG4gIGlmIChsYW5nID09PSBfY3VycmVudExhbmcgJiYgT2JqZWN0LmtleXMoX3RyYW5zbGF0aW9ucykubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuXG4gIC8vIFNsb3cgaW5pdGlhbCBsb2FkcyBtdXN0IG5vdCBvdmVyd3JpdGUgYSBuZXdlciBsYW5ndWFnZSByZXF1ZXN0LlxuICBjb25zdCB1cmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoYF9sb2NhbGVzLyR7bGFuZ30vbWVzc2FnZXMuanNvbmApO1xuICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKHJlc3AgPT4ge1xuICAgICAgaWYgKCFyZXNwLm9rKSB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkICR7dXJsfWApO1xuICAgICAgcmV0dXJuIHJlc3AuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICBpZiAodG9rZW4gIT09IF9sb2FkVG9rZW4pIHJldHVybjtcbiAgICAgIF90cmFuc2xhdGlvbnMgPSBkYXRhO1xuICAgICAgX2N1cnJlbnRMYW5nID0gbGFuZztcbiAgICB9KVxuICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICBpZiAodG9rZW4gIT09IF9sb2FkVG9rZW4pIHJldHVybjtcbiAgICAgIGlmIChsYW5nICE9PSAnZW4nKSByZXR1cm4gbG9hZExhbmcoJ2VuJyk7XG4gICAgICBfdHJhbnNsYXRpb25zID0ge307XG4gICAgICBfY3VycmVudExhbmcgPSAnZW4nO1xuICAgIH0pO1xufVxuIiwiLyoqXG4gKiBDYW5vbmljYWwgc2hvcnRjdXQta2V5IGhhbmRsaW5nIHNoYXJlZCBieSB0aGUgY29udGVudCBzY3JpcHQuXG4gKlxuICogU3RvcmFnZSBmb3JtYXQgKG11c3QgbWF0Y2ggdGhlIHNldHRpbmdzIHJlY29yZGVyKTpcbiAqICAgUGFydHMgaW4gb3JkZXI6IEN0cmwsIEFsdCwgU2hpZnQsIE1ldGEsIHRoZW4gdGhlIG5vcm1hbGl6ZWQga2V5LlxuICogICBKb2luZWQgd2l0aCBcIitcIi4gRXhhbXBsZTogXCJDdHJsK1NoaWZ0K0Fycm93VXBcIi5cbiAqL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVCA9ICdGOSc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9LRVlfVE9HR0xFX1ZJU0lCSUxJVFkgPSAnRjEwJztcblxuY29uc3QgTU9ESUZJRVJfT05MWV9LRVlTID0gW1xuICAnQ29udHJvbCcsXG4gICdBbHQnLFxuICAnU2hpZnQnLFxuICAnTWV0YScsXG4gICdBbHRHcmFwaCcsXG4gICdPUydcbl07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUtleU5hbWUoa2V5KSB7XG4gIGlmIChrZXkgPT09ICcgJykgcmV0dXJuICdTcGFjZSc7XG4gIHJldHVybiBrZXk7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGNhbm9uaWNhbCBrZXkgc3RyaW5nIGZvciBhIEtleWJvYXJkRXZlbnQuXG4gKiBSZXR1cm5zIG51bGwgZm9yIG1vZGlmaWVyLW9ubHkgcHJlc3NlcyBhbmQgcmVzZXJ2ZWQga2V5cyAoRXNjYXBlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkS2V5U3RyaW5nKGV2ZW50KSB7XG4gIGlmICghZXZlbnQgfHwgTU9ESUZJRVJfT05MWV9LRVlTLmluY2x1ZGVzKGV2ZW50LmtleSkpIHJldHVybiBudWxsO1xuICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgcGFydHMgPSBbXTtcbiAgaWYgKGV2ZW50LmN0cmxLZXkpIHBhcnRzLnB1c2goJ0N0cmwnKTtcbiAgaWYgKGV2ZW50LmFsdEtleSkgcGFydHMucHVzaCgnQWx0Jyk7XG4gIGlmIChldmVudC5zaGlmdEtleSkgcGFydHMucHVzaCgnU2hpZnQnKTtcbiAgaWYgKGV2ZW50Lm1ldGFLZXkpIHBhcnRzLnB1c2goJ01ldGEnKTtcbiAgcGFydHMucHVzaChub3JtYWxpemVLZXlOYW1lKGV2ZW50LmtleSkpO1xuICByZXR1cm4gcGFydHMuam9pbignKycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSB3aGVuIGtleWJvYXJkIHNob3J0Y3V0cyBtdXN0IG5vdCBmaXJlIGJlY2F1c2UgdGhlIHVzZXIgaXNcbiAqIHR5cGluZyBpbnRvIGEgZm9ybSBjb250cm9sIG9yIGVkaXRhYmxlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VkaXRhYmxlVGFyZ2V0KHRhcmdldCkge1xuICBpZiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHRhZ05hbWUgPSB0eXBlb2YgdGFyZ2V0LnRhZ05hbWUgPT09ICdzdHJpbmcnXG4gICAgPyB0YXJnZXQudGFnTmFtZS50b1VwcGVyQ2FzZSgpXG4gICAgOiAnJztcblxuICBpZiAodGFnTmFtZSA9PT0gJ0lOUFVUJyB8fCB0YWdOYW1lID09PSAnVEVYVEFSRUEnIHx8IHRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlID09PSB0cnVlO1xufVxuIiwiLy8gZm9ybWF0IHRpbWUgaW4gc2Vjb25kcyB0byBtbTpzc1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xuICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKHNlY29uZHMpO1xuICAgIC8vIExpdmUgc3RyZWFtcyAvIG5vdC15ZXQtbG9hZGVkIG1lZGlhIHJlcG9ydCBJbmZpbml0eSBvciBOYU4g4oCUIG5ldmVyIHJlbmRlclxuICAgIC8vIFwiSW5maW5pdHk6TmFOXCIuIFVzZSBhIHBsYWNlaG9sZGVyIGluc3RlYWQuXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgcmV0dXJuICctLTotLSc7XG4gICAgY29uc3QgdG90YWwgPSBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcih0b3RhbCAvIDYwKTtcbiAgICBjb25zdCBzZWNzID0gdG90YWwgJSA2MDtcbiAgICByZXR1cm4gYCR7U3RyaW5nKG1pbnMpLnBhZFN0YXJ0KDIsICcwJyl9OiR7U3RyaW5nKHNlY3MpLnBhZFN0YXJ0KDIsICcwJyl9YDtcbn1cblxuLy8gY2hlY2sgaWYgZnVsbHNjcmVlbiBmb3IgYnJvd3NlciAoRjExIC8gYnJvd3Nlci1sZXZlbCBmdWxsc2NyZWVuKVxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpIHtcbiAgICAvLyBFbGVtZW50L25hdGl2ZSBmdWxsc2NyZWVuIGlzIGhhbmRsZWQgc2VwYXJhdGVseTsgZG9uJ3QgcmVwb3J0IGJyb3dzZXJcbiAgICAvLyBmdWxsc2NyZWVuIHdoaWxlIGFuIGVsZW1lbnQgaXMgZnVsbHNjcmVlbi5cbiAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcbiAgICBpZiAoZnNFbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gU21hbGwgdG9sZXJhbmNlIGF2b2lkcyB6b29tL0RQSS90YXNrYmFyIHJvdW5kaW5nIGZhbHNlIG5lZ2F0aXZlcy5cbiAgICBjb25zdCBUT0xFUkFOQ0UgPSAyO1xuICAgIHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJIZWlnaHQgLSBzY3JlZW4uaGVpZ2h0KSA8PSBUT0xFUkFOQ0UgJiZcbiAgICAgICAgICAgTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBzY3JlZW4ud2lkdGgpIDw9IFRPTEVSQU5DRTtcbn1cbiIsImltcG9ydCB7IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiwgZm9ybWF0VGltZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgdCB9IGZyb20gJy4vaTE4bic7XG5cbmV4cG9ydCBjb25zdCBGVUxMU0NSRUVOX0VWRU5UUyA9IFtcbiAgJ2Z1bGxzY3JlZW5jaGFuZ2UnLFxuICAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG4gICdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgJ01TRnVsbHNjcmVlbkNoYW5nZSdcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxsc2NyZWVuRWxlbWVudCgpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XG4gICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVmlkZW9FbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuICEhZWxlbWVudCAmJlxuICAgIHR5cGVvZiBIVE1MVmlkZW9FbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50O1xufVxuXG5jb25zdCBQT1BPVkVSX1NVUFBPUlRFRCA9IHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5zaG93UG9wb3ZlciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICB0eXBlb2YgSFRNTEVsZW1lbnQucHJvdG90eXBlLmhpZGVQb3BvdmVyID09PSAnZnVuY3Rpb24nO1xuXG5jb25zdCBPVkVSTEFZX1NUWUxFX0lEID0gJ2ZzLXRpbWUtb3ZlcmxheS1zdHlsZXMnO1xuXG5jb25zdCBPVkVSTEFZX1NUWUxFUyA9IGBcbiAgLmZzLXRpbWUtb3ZlcmxheSB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjcyKTtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTgpO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBwYWRkaW5nOiA2cHggMTBweDtcbiAgICBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBcIlNlZ29lIFVJXCIsIFJvYm90bywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDE1cHg7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBsaW5lLWhlaWdodDogMS4zO1xuICAgIGZvbnQtdmFyaWFudC1udW1lcmljOiB0YWJ1bGFyLW51bXM7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIDAuMzUpO1xuICAgIHRleHQtc2hhZG93OiAwIDFweCAycHggcmdiYSgwLCAwLCAwLCAwLjY1KTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDE4MG1zIGVhc2U7XG4gIH1cblxuICBbcG9wb3Zlcl0uZnMtdGltZS1vdmVybGF5IHtcbiAgICBpbnNldDogYXV0bztcbiAgICBtYXJnaW46IDA7XG4gICAgd2lkdGg6IG1heC1jb250ZW50O1xuICAgIG1heC13aWR0aDogbm9uZTtcbiAgICBtYXgtaGVpZ2h0OiBub25lO1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICB9XG5cbiAgLmZzLXRpbWUtb3ZlcmxheTo6YmFja2Ryb3Age1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5cbiAgLmZzLXRpbWUtb3ZlcmxheS5pcy1mYWRlZCB7XG4gICAgb3BhY2l0eTogMDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxuXG4gIC5mcy10aW1lLWNsb3NlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAtOXB4O1xuICAgIHJpZ2h0OiAtOXB4O1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBwbGFjZS1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAyNHB4O1xuICAgIGhlaWdodDogMjRweDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40KTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYmFja2dyb3VuZDogcmdiYSgxMCwgMTIsIDE2LCAwLjkyKTtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBmb250OiA2MDAgMTZweC8xIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIHNhbnMtc2VyaWY7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG9wYWNpdHk6IDA7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDE0MG1zIGVhc2UsIHRyYW5zZm9ybSAxNDBtcyBlYXNlLCBiYWNrZ3JvdW5kLWNvbG9yIDE0MG1zIGVhc2U7XG4gIH1cblxuICAuZnMtdGltZS1vdmVybGF5OmhvdmVyIC5mcy10aW1lLWNsb3NlLFxuICAuZnMtdGltZS1vdmVybGF5OmZvY3VzLXdpdGhpbiAuZnMtdGltZS1jbG9zZSxcbiAgLmZzLXRpbWUtb3ZlcmxheS5pcy1jbG9zZS1mb3JjZWQgLmZzLXRpbWUtY2xvc2UsXG4gIC5mcy10aW1lLW92ZXJsYXlbcG9wb3Zlcl0gLmZzLXRpbWUtY2xvc2Uge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuXG4gIC5mcy10aW1lLWNsb3NlOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDQwLCA0NCwgNTIsIDAuOTgpO1xuICB9XG5cbiAgLmZzLXRpbWUtY2xvc2U6Zm9jdXMtdmlzaWJsZSB7XG4gICAgb3V0bGluZTogMnB4IHNvbGlkICNmZmY7XG4gICAgb3V0bGluZS1vZmZzZXQ6IDJweDtcbiAgfVxuXG4gIC5mcy10aW1lLW92ZXJsYXkuaXMtZmFkZWQgLmZzLXRpbWUtY2xvc2Uge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cblxuICAuZnMtdGltZS1kaXNtaXNzLWhpbnQge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB0b3A6IDE0cHg7XG4gICAgbGVmdDogNTAlO1xuICAgIHotaW5kZXg6IDIxNDc0ODM2NDc7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBtYXgtd2lkdGg6IG1pbig5MnZ3LCA1MjBweCk7XG4gICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC44Mik7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE4KTtcbiAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIDAuNCk7XG4gICAgZm9udC1mYW1pbHk6IHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgbGluZS1oZWlnaHQ6IDEuMzU7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMDFlbTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBhbmltYXRpb246IGZzLXRpbWUtaGludC1pbiAxODBtcyBlYXNlLW91dDtcbiAgfVxuXG4gIFtwb3BvdmVyXS5mcy10aW1lLWRpc21pc3MtaGludCB7XG4gICAgaW5zZXQ6IGF1dG87XG4gICAgdG9wOiAxNHB4O1xuICAgIGxlZnQ6IDUwJTtcbiAgICBtYXJnaW46IDA7XG4gICAgd2lkdGg6IG1heC1jb250ZW50O1xuICAgIG1heC13aWR0aDogbWluKDkydncsIDUyMHB4KTtcbiAgICBtYXgtaGVpZ2h0OiBub25lO1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgfVxuXG4gIC5mcy10aW1lLWRpc21pc3MtaGludDo6YmFja2Ryb3Age1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5cbiAgQGtleWZyYW1lcyBmcy10aW1lLWhpbnQtaW4ge1xuICAgIGZyb20ge1xuICAgICAgb3BhY2l0eTogMDtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC00cHgpO1xuICAgIH1cbiAgICB0byB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCk7XG4gICAgfVxuICB9XG5cbiAgQG1lZGlhIChwb2ludGVyOiBjb2Fyc2UpIHtcbiAgICAuZnMtdGltZS1vdmVybGF5IC5mcy10aW1lLWNsb3NlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgfVxuICB9XG5cbiAgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHtcbiAgICAuZnMtdGltZS1vdmVybGF5LFxuICAgIC5mcy10aW1lLWNsb3NlLFxuICAgIC5mcy10aW1lLWRpc21pc3MtaGludCB7XG4gICAgICB0cmFuc2l0aW9uOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICBhbmltYXRpb246IG5vbmUgIWltcG9ydGFudDtcbiAgICB9XG4gIH1cbmA7XG5cbmZ1bmN0aW9uIGluamVjdE92ZXJsYXlTdHlsZXMoKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8ICFkb2N1bWVudC5oZWFkKSByZXR1cm47XG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChPVkVSTEFZX1NUWUxFX0lEKSkgcmV0dXJuO1xuXG4gIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUuaWQgPSBPVkVSTEFZX1NUWUxFX0lEO1xuICBzdHlsZS50ZXh0Q29udGVudCA9IE9WRVJMQVlfU1RZTEVTO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUyA9IHtcbiAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXG4gIHNob3dPbkZ1bGxzY3JlZW46IHRydWUsXG4gIHNob3dTZWNvbmRzOiB0cnVlLFxuICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gIGF1dG9IaWRlOiBmYWxzZSxcbiAgbGF5b3V0TW9kZTogJ3NuYXAnLFxuICBmbG9hdFBvc2l0aW9uVmlkZW86IG51bGwsXG4gIGZsb2F0UG9zaXRpb25XaW5kb3c6IG51bGxcbn07XG5cbmZ1bmN0aW9uIGhhc093bihvYmplY3QsIGtleSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxuZXhwb3J0IGNsYXNzIFRpbWVEaXNwbGF5IHtcbiAgY29uc3RydWN0b3IobWVkaWEpIHtcbiAgICBpbmplY3RPdmVybGF5U3R5bGVzKCk7XG5cbiAgICB0aGlzLm1lZGlhID0gbWVkaWE7XG4gICAgdGhpcy50aW1lRWxlbWVudCA9IHRoaXMuY3JlYXRlVGltZUVsZW1lbnQoKTtcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4gPSB0aGlzLl90aW1lVGV4dFNwYW4gfHwgbnVsbDtcbiAgICB0aGlzLl9jbG9zZUJ0biA9IHRoaXMuX2Nsb3NlQnRuIHx8IG51bGw7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIERFRkFVTFRfU0VUVElOR1MpO1xuXG4gICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9ib3VuZFdha2VIYW5kbGVyID0gbnVsbDtcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fYWN0aXZlUG9pbnRlcklkID0gbnVsbDtcbiAgICB0aGlzLl9kcmFnT2Zmc2V0ID0geyB4OiAwLCB5OiAwIH07XG4gICAgdGhpcy5fcG9zaXRpb25Nb2RlID0gJ2ZpeGVkJztcbiAgICB0aGlzLl9wb3BvdmVyTW9kZSA9IGZhbHNlO1xuICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLl9mb3JjZUNsb3NlVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fcG9wb3ZlclJldHJ5VGltZXIgPSBudWxsO1xuICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID0gMDtcblxuICAgIHRoaXMudmlkZW9PdmVybGF5QWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5fZGlzbWlzc0hpbnRFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLl9kaXNtaXNzSGludFRpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9ib3VuZERpc21pc3NIaW50RnVsbHNjcmVlbkV4aXQgPSBudWxsO1xuXG4gICAgdGhpcy5fYm91bmRQb2ludGVyRG93biA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyTW92ZSA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyVXAgPSBudWxsO1xuICAgIHRoaXMuX2JvdW5kUG9pbnRlckNhbmNlbCA9IG51bGw7XG4gIH1cblxuICAvLyAtLS0gc2V0dGluZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBhcHBseVNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncykgcmV0dXJuO1xuXG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJykpIHtcbiAgICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBzZXR0aW5ncy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdzaG93T25GdWxsc2NyZWVuJykpIHtcbiAgICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IHNldHRpbmdzLnNob3dPbkZ1bGxzY3JlZW4gIT09IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaGFzT3duKHNldHRpbmdzLCAnc2hvd1NlY29uZHMnKSkge1xuICAgICAgdGhpcy5zaG93U2Vjb25kcyA9IHNldHRpbmdzLnNob3dTZWNvbmRzICE9PSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ3Nob3dQcm9ncmVzcycpKSB7XG4gICAgICB0aGlzLnNob3dQcm9ncmVzcyA9IHNldHRpbmdzLnNob3dQcm9ncmVzcyAhPT0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdhdXRvSGlkZScpKSB7XG4gICAgICB0aGlzLmF1dG9IaWRlID0gc2V0dGluZ3MuYXV0b0hpZGUgPT09IHRydWU7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdsYXlvdXRNb2RlJykpIHtcbiAgICAgIHRoaXMubGF5b3V0TW9kZSA9IHNldHRpbmdzLmxheW91dE1vZGUgPT09ICdmbG9hdCcgPyAnZmxvYXQnIDogJ3NuYXAnO1xuICAgIH1cbiAgICBpZiAoaGFzT3duKHNldHRpbmdzLCAnZmxvYXRQb3NpdGlvblZpZGVvJykpIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvblZpZGVvID0gc2V0dGluZ3MuZmxvYXRQb3NpdGlvblZpZGVvIHx8IG51bGw7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdmbG9hdFBvc2l0aW9uV2luZG93JykpIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvbldpbmRvdyA9IHNldHRpbmdzLmZsb2F0UG9zaXRpb25XaW5kb3cgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvLyBSZS10cmFuc2xhdGUgdGhlIGNsb3NlIGJ1dHRvbiB3aGVuIHNldHRpbmdzL2xhbmd1YWdlIGFyZSByZS1hcHBsaWVkLlxuICAgIHRoaXMuX3JlZnJlc2hDbG9zZUJ1dHRvbkxhYmVsKCk7XG4gIH1cblxuICBfcmVmcmVzaENsb3NlQnV0dG9uTGFiZWwoKSB7XG4gICAgaWYgKCF0aGlzLl9jbG9zZUJ0bikgcmV0dXJuO1xuXG4gICAgY29uc3QgbGFiZWwgPSB0KCdjbG9zZUJ0blRpdGxlJyk7XG4gICAgdGhpcy5fY2xvc2VCdG4udGl0bGUgPSBsYWJlbDtcbiAgICB0aGlzLl9jbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBsYWJlbCk7XG4gIH1cblxuICBkaXNwbGF5VHlwZSgpIHtcbiAgICByZXR1cm4gJ21lZGlhJztcbiAgfVxuXG4gIGlzU2hvd2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcbiAgfVxuXG4gIF9mbG9hdFN0b3JhZ2VLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheVR5cGUoKSA9PT0gJ3dpbmRvdy1vdmVybGF5J1xuICAgICAgPyAnZmxvYXRQb3NpdGlvbldpbmRvdydcbiAgICAgIDogJ2Zsb2F0UG9zaXRpb25WaWRlbyc7XG4gIH1cblxuICBfZ2V0RmxvYXRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwbGF5VHlwZSgpID09PSAnd2luZG93LW92ZXJsYXknXG4gICAgICA/IHRoaXMuZmxvYXRQb3NpdGlvbldpbmRvd1xuICAgICAgOiB0aGlzLmZsb2F0UG9zaXRpb25WaWRlbztcbiAgfVxuXG4gIF9zZXRGbG9hdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMuZGlzcGxheVR5cGUoKSA9PT0gJ3dpbmRvdy1vdmVybGF5Jykge1xuICAgICAgdGhpcy5mbG9hdFBvc2l0aW9uV2luZG93ID0gcG9zaXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvblZpZGVvID0gcG9zaXRpb247XG4gICAgfVxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgW3RoaXMuX2Zsb2F0U3RvcmFnZUtleSgpXTogcG9zaXRpb24gfSk7XG4gIH1cblxuICAvLyAtLS0gZWxlbWVudCBjcmVhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBjcmVhdGVUaW1lRWxlbWVudCgpIHtcbiAgICBjb25zdCB0aW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVFbGVtZW50LmNsYXNzTmFtZSA9ICdmcy10aW1lLW92ZXJsYXknO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIC8vIOeLrOeri+aWh+Wtl+WuueWZqO+8iOS4jiDDlyDmjInpkq7lubbliJfvvIzpgb/lhY0gdXBkYXRlVGltZSDor6/liKDmjInpkq7vvIlcbiAgICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0ZXh0U3Bhbi50ZXh0Q29udGVudCA9ICcwMDowMCAvIDAwOjAwJztcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4gPSB0ZXh0U3BhbjtcbiAgICB0aW1lRWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0U3Bhbik7XG5cbiAgICBjb25zdCBjbG9zZUJ0biA9IHRoaXMuX2NyZWF0ZUNsb3NlQnV0dG9uKCk7XG4gICAgdGhpcy5fY2xvc2VCdG4gPSBjbG9zZUJ0bjtcbiAgICB0aGlzLl9yZWZyZXNoQ2xvc2VCdXR0b25MYWJlbCgpO1xuXG4gICAgdGltZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xuICAgIHJldHVybiB0aW1lRWxlbWVudDtcbiAgfVxuXG4gIC8vIOWIm+W7uuWPs+S4iuinkuWFs+mXreaMiemSriDDl++8iOS9jeS6jiB0aW1lRWxlbWVudCDlhoXpg6jlj7PkuIrop5LvvIlcbiAgX2NyZWF0ZUNsb3NlQnV0dG9uKCkge1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ0bi50eXBlID0gJ2J1dHRvbic7XG4gICAgYnRuLmNsYXNzTmFtZSA9ICdmcy10aW1lLWNsb3NlJztcbiAgICBidG4udGV4dENvbnRlbnQgPSAnw5cnO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpOyAvLyDpmLvmraLmi5bmi71cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5oYW5kbGVEaXNtaXNzKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYnRuO1xuICB9XG5cbiAgaGFuZGxlRGlzbWlzcygpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZnMtdGltZS1kaXNtaXNzJywge1xuICAgICAgZGV0YWlsOiB7IGRpc3BsYXlUeXBlOiB0aGlzLmRpc3BsYXlUeXBlKCkgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuX3Nob3dEaXNtaXNzSGludCgpO1xuICB9XG5cbiAgX3Nob3dEaXNtaXNzSGludCgpIHtcbiAgICB0aGlzLl9oaWRlRGlzbWlzc0hpbnQoKTtcblxuICAgIGlmICghZG9jdW1lbnQuYm9keSkgcmV0dXJuO1xuXG4gICAgY29uc3QgaGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhpbnQuY2xhc3NOYW1lID0gJ2ZzLXRpbWUtZGlzbWlzcy1oaW50JztcbiAgICBoaW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdzdGF0dXMnKTtcbiAgICBoaW50LnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgIGhpbnQuc2V0QXR0cmlidXRlKCdhcmlhLWF0b21pYycsICd0cnVlJyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChoaW50KTtcblxuICAgIGlmIChnZXRGdWxsc2NyZWVuRWxlbWVudCgpICYmIFBPUE9WRVJfU1VQUE9SVEVEKSB7XG4gICAgICB0cnkge1xuICAgICAgICBoaW50LnNldEF0dHJpYnV0ZSgncG9wb3ZlcicsICdtYW51YWwnKTtcbiAgICAgICAgaGludC5zaG93UG9wb3ZlcigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBoaW50LnJlbW92ZUF0dHJpYnV0ZSgncG9wb3ZlcicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNldCB0aGUgdGV4dCBhZnRlciB0aGUgbGl2ZSByZWdpb24gaXMgY29ubmVjdGVkIHNvIGl0IGlzIGFubm91bmNlZC5cbiAgICBoaW50LnRleHRDb250ZW50ID0gdCgnZGlzbWlzc0hpbnQnKTtcbiAgICB0aGlzLl9kaXNtaXNzSGludEVsZW1lbnQgPSBoaW50O1xuXG4gICAgdGhpcy5fYm91bmREaXNtaXNzSGludEZ1bGxzY3JlZW5FeGl0ID0gKCkgPT4ge1xuICAgICAgaWYgKCFnZXRGdWxsc2NyZWVuRWxlbWVudCgpKSB7XG4gICAgICAgIHRoaXMuX2hpZGVEaXNtaXNzSGludCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBGVUxMU0NSRUVOX0VWRU5UUy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9ib3VuZERpc21pc3NIaW50RnVsbHNjcmVlbkV4aXQpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9ib3VuZERpc21pc3NIaW50RnVsbHNjcmVlbkV4aXQpO1xuXG4gICAgdGhpcy5fZGlzbWlzc0hpbnRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5faGlkZURpc21pc3NIaW50KCksIDMwMDApO1xuICB9XG5cbiAgX2hpZGVEaXNtaXNzSGludCgpIHtcbiAgICBpZiAodGhpcy5fZGlzbWlzc0hpbnRUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Rpc21pc3NIaW50VGltZXIpO1xuICAgICAgdGhpcy5fZGlzbWlzc0hpbnRUaW1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JvdW5kRGlzbWlzc0hpbnRGdWxsc2NyZWVuRXhpdCkge1xuICAgICAgRlVMTFNDUkVFTl9FVkVOVFMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9ib3VuZERpc21pc3NIaW50RnVsbHNjcmVlbkV4aXQpO1xuICAgICAgfSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fYm91bmREaXNtaXNzSGludEZ1bGxzY3JlZW5FeGl0KTtcbiAgICAgIHRoaXMuX2JvdW5kRGlzbWlzc0hpbnRGdWxsc2NyZWVuRXhpdCA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaGludCA9IHRoaXMuX2Rpc21pc3NIaW50RWxlbWVudDtcbiAgICBpZiAoIWhpbnQpIHJldHVybjtcblxuICAgIGlmIChoaW50Lmhhc0F0dHJpYnV0ZSgncG9wb3ZlcicpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBoaW50LmhpZGVQb3BvdmVyKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIG5vdCBjdXJyZW50bHkgb3BlbiAvIHVuc3VwcG9ydGVkIHN0YXRlXG4gICAgICB9XG4gICAgICBoaW50LnJlbW92ZUF0dHJpYnV0ZSgncG9wb3ZlcicpO1xuICAgIH1cblxuICAgIGlmIChoaW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIGhpbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChoaW50KTtcbiAgICB9XG5cbiAgICB0aGlzLl9kaXNtaXNzSGludEVsZW1lbnQgPSBudWxsO1xuICB9XG5cbiAgLy8gLS0tIHZpc2liaWxpdHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY2hlY2tJc1RvU2hvdygpIHtcbiAgICBpZiAoIXRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmc0VsID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKTtcbiAgICBpZiAoIWZzRWwgfHwgIXRoaXMubWVkaWEpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBmc0VsID09PSB0aGlzLm1lZGlhIHx8XG4gICAgICAgICAgIGZzRWwuY29udGFpbnModGhpcy5tZWRpYSkgfHxcbiAgICAgICAgICAgdGhpcy5tZWRpYS5jb250YWlucyhmc0VsKTtcbiAgfVxuXG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tJc1RvU2hvdygpKSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgX3Jlc2V0Q2xvc2VCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLl9jbG9zZUJ0bikgcmV0dXJuO1xuICAgIHRoaXMuX2Nsb3NlQnRuLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWNsb3NlLWZvcmNlZCcsIHRoaXMuX2ZvcmNlQ2xvc2VWaXNpYmxlKTtcbiAgfVxuXG4gIF9nZXREb21QYXJlbnQoZnNFbCkge1xuICAgIHJldHVybiBmc0VsIHx8IGRvY3VtZW50LmJvZHk7XG4gIH1cblxuICBzaG93KCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gICAgY29uc3QgbmF0aXZlVmlkZW9GdWxsc2NyZWVuID0gaXNWaWRlb0VsZW1lbnQoZnNFbCk7XG5cbiAgICAvLyBOYXRpdmUgPHZpZGVvPiBmdWxsc2NyZWVuIHJlbmRlcnMgaW4gaXRzIG93biB0b3AgbGF5ZXIuIEEgcmVndWxhciBET01cbiAgICAvLyBjaGlsZCAoZXZlbiBpbnNpZGUgdGhlIHZpZGVvKSBpcyBwYWludGVkIHVuZGVybmVhdGggdGhlIHZpZGVvLiBVc2UgdGhlXG4gICAgLy8gUG9wb3ZlciBBUEkgdG8gcHJvbW90ZSB0aGUgb3ZlcmxheSBpbnRvIHRoZSBicm93c2VyIHRvcCBsYXllciBpbnN0ZWFkLlxuICAgIGlmIChuYXRpdmVWaWRlb0Z1bGxzY3JlZW4gJiYgIVBPUE9WRVJfU1VQUE9SVEVEKSB7XG4gICAgICAvLyBVbnN1cHBvcnRlZCBBUEk6IG5vIHBvaW50IHJldHJ5aW5nOyBnbyB0aHJvdWdoIHNoYXJlZCBjbGVhbnVwLlxuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXNlUG9wb3ZlciA9IG5hdGl2ZVZpZGVvRnVsbHNjcmVlbiAmJiBQT1BPVkVSX1NVUFBPUlRFRDtcbiAgICB0aGlzLl92aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLl9wb3BvdmVyTW9kZSA9IHVzZVBvcG92ZXI7XG5cbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICB0aGlzLnRpbWVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZhZGVkJyk7XG4gICAgdGhpcy5fYXBwbHlQb2ludGVyTW9kZSh1c2VQb3BvdmVyKTtcbiAgICB0aGlzLl9yZXNldENsb3NlQnV0dG9uKCk7XG5cbiAgICBpZiAodXNlUG9wb3Zlcikge1xuICAgICAgaWYgKGRvY3VtZW50LmJvZHkgJiYgdGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XG4gICAgICB9XG4gICAgICAvLyBOZXZlciBmb3JjZSBkaXNwbGF5OmJsb2NrIGJlZm9yZSBzaG93UG9wb3ZlcigpLiBMZXQgdGhlIFVBXG4gICAgICAvLyBbcG9wb3Zlcl06bm90KDpwb3BvdmVyLW9wZW4pIHJ1bGUga2VlcCBhIGNsb3NlZCBwb3BvdmVyIGhpZGRlbi5cbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgaWYgKCF0aGlzLl9zaG93UG9wb3ZlcigpKSB7XG4gICAgICAgIC8vIFRyYW5zaWVudCBmYWlsdXJlIHdoaWxlIHN0aWxsIGluIG5hdGl2ZSB2aWRlbyBmdWxsc2NyZWVuOiBjbGVhbiB1cFxuICAgICAgICAvLyBhbmQgcmV0cnkgYSBib3VuZGVkIG51bWJlciBvZiB0aW1lcy5cbiAgICAgICAgdGhpcy5faGFuZGxlUG9wb3ZlckZhaWx1cmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnkoKTtcbiAgICAgIC8vIE1lYXN1cmUvcG9zaXRpb24gYWZ0ZXIgcHJvbW90aW9uIHNvIG9mZnNldFdpZHRoL0hlaWdodCBhcmUgcmVhbC5cbiAgICAgIHRoaXMuX3Bvc2l0aW9uRWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeSgpO1xuICAgICAgdGhpcy5fdGVhcmRvd25Qb3BvdmVyKCk7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXREb21QYXJlbnQoZnNFbCk7XG4gICAgICBpZiAocGFyZW50ICYmIHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLl9wb3NpdGlvbkVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcblxuICAgIC8vIEEgcG9wb3ZlciBjb250YWluZXIgaXMgcG9pbnRlci1ldmVudHM6bm9uZSAoZGlzcGxheS1vbmx5KSwgc28gZHJhZ2dpbmdcbiAgICAvLyBpcyBub3QgcG9zc2libGUvbWVhbmluZ2Z1bCB0aGVyZS5cbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnZmxvYXQnICYmICF1c2VQb3BvdmVyKSB7XG4gICAgICB0aGlzLnNldHVwRHJhZ2dpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcbiAgICAgIHRoaXMuc3RhcnRBdXRvSGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xuICAgICAgdGhpcy50ZWFyZG93bldha2VMaXN0ZW5lcigpO1xuICAgICAgdGhpcy5fcmVzdG9yZVBvaW50ZXJFdmVudHMoKTtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICB9XG4gIH1cblxuICAvLyBTaGFyZWQgdmlzaWJpbGl0eSBjbGVhbnVwIHVzZWQgYnkgaGlkZSgpIGFuZCBwb3BvdmVyIGZhaWx1cmUgaGFuZGxpbmcuXG4gIF9jbGVhbnVwRm9ySGlkZSgpIHtcbiAgICB0aGlzLl92aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLnRlYXJkb3duV2FrZUxpc3RlbmVyKCk7XG4gICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XG4gICAgdGhpcy5fdGVhcmRvd25Qb3BvdmVyKCk7XG5cbiAgICBpZiAodGhpcy50aW1lRWxlbWVudCkge1xuICAgICAgLy8gQWZ0ZXIgaGlkZVBvcG92ZXIoKS9hdHRyaWJ1dGUgcmVtb3ZhbCwgZXhwbGljaXRseSBoaWRlIHRoZSBub2RlLlxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1mYWRlZCcpO1xuICAgICAgdGhpcy5fZm9yY2VDbG9zZVZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3Jlc2V0Q2xvc2VCdXR0b24oKTtcbiAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5fY2xlYW51cEZvckhpZGUoKTtcbiAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeSgpO1xuICB9XG5cbiAgX2NsZWFyUG9wb3ZlclJldHJ5VGltZXIoKSB7XG4gICAgaWYgKHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fcG9wb3ZlclJldHJ5VGltZXIpO1xuICAgICAgdGhpcy5fcG9wb3ZlclJldHJ5VGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF9jbGVhclBvcG92ZXJSZXRyeSgpIHtcbiAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeVRpbWVyKCk7XG4gICAgdGhpcy5fcG9wb3ZlclJldHJ5Q291bnQgPSAwO1xuICB9XG5cbiAgX2hhbmRsZVBvcG92ZXJGYWlsdXJlKCkge1xuICAgIGNvbnN0IGNhblJldHJ5ID0gaXNWaWRlb0VsZW1lbnQoZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKSk7XG4gICAgdGhpcy5fY2xlYW51cEZvckhpZGUoKTtcbiAgICBpZiAoY2FuUmV0cnkpIHtcbiAgICAgIHRoaXMuX3NjaGVkdWxlUG9wb3ZlclJldHJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsZWFyUG9wb3ZlclJldHJ5VGltZXIoKTtcbiAgICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID0gMDtcbiAgICB9XG4gIH1cblxuICBfc2NoZWR1bGVQb3BvdmVyUmV0cnkoKSB7XG4gICAgaWYgKHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID49IDMpIHJldHVybjtcblxuICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ICs9IDE7XG4gICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnlUaW1lcigpO1xuICAgIHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9wb3BvdmVyUmV0cnlUaW1lciA9IG51bGw7XG4gICAgICBpZiAoIWlzVmlkZW9FbGVtZW50KGdldEZ1bGxzY3JlZW5FbGVtZW50KCkpKSB7XG4gICAgICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmNoZWNrSXNUb1Nob3coKSkge1xuICAgICAgICB0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xuICAgIH0sIDEwMCk7XG4gIH1cblxuICAvLyAtLS0gcGxhY2VtZW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBfcG9zaXRpb25FbGVtZW50KCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gICAgLy8gQSBmdWxsc2NyZWVuIGVsZW1lbnQgY292ZXJzIHRoZSB2aWV3cG9ydCwgc28gdmlld3BvcnQtZml4ZWQgY29vcmRpbmF0ZXNcbiAgICAvLyB3b3JrIGZvciBjb250YWluZXItYXBwZW5kLCBwb3BvdmVyLCBicm93c2VyIGFuZCB3aW5kb3cgbW9kZXMgYWxpa2UuXG4gICAgLy8gVXNpbmcgZml4ZWQgZXZlcnl3aGVyZSBhbHNvIG1ha2VzIGRyYWctZW5kIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgLy8gY29vcmRpbmF0ZXMgcmV1c2FibGUgb24gdGhlIG5leHQgc2hvdy5cbiAgICB0aGlzLl9wb3NpdGlvbk1vZGUgPSAnZml4ZWQnO1xuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnRpbWVFbGVtZW50LnN0eWxlO1xuICAgIHN0eWxlLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb25Nb2RlO1xuICAgIHN0eWxlLm1hcmdpbiA9ICcwJztcbiAgICBzdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICBzdHlsZS5ib3R0b20gPSAnYXV0byc7XG4gICAgc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xuXG4gICAgaWYgKHRoaXMubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0Jykge1xuICAgICAgY29uc3Qgc2F2ZWQgPSB0aGlzLl9nZXRGbG9hdFBvc2l0aW9uKCk7XG4gICAgICBpZiAoc2F2ZWQpIHtcbiAgICAgICAgdGhpcy5fYXBwbHlGbG9hdFBvc2l0aW9uKHNhdmVkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgc3R5bGUubGVmdCA9ICc1MCUnO1xuICAgICAgc3R5bGUudG9wID0gJzIwcHgnO1xuICAgICAgc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5sZWZ0ID0gJzUwJSc7XG4gICAgICBzdHlsZS50b3AgPSAnMTBweCc7XG4gICAgICBzdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XG4gICAgfVxuICB9XG5cbiAgX2NsYW1wUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy50aW1lRWxlbWVudDtcbiAgICBjb25zdCB3aWR0aCA9IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwKSA6IDA7XG4gICAgY29uc3QgaGVpZ2h0ID0gZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldEhlaWdodCB8fCAwKSA6IDA7XG4gICAgY29uc3QgaW5zZXQgPSAxMjtcblxuICAgIC8vIExlYXZlIHJvb20gZm9yIHRoZSBjbG9zZSBidXR0b24gYW5kIGEgdmlzaWJsZSBtYXJnaW4uIElmIHRoZSB2aWV3cG9ydFxuICAgIC8vIGlzIHRvbyBzbWFsbCBmb3IgdGhlIGluc2V0LCBmYWxsIGJhY2sgdG8gdGhlIGVkZ2UgaW5zdGVhZCBvZiBpbnZlcnRpbmcuXG4gICAgY29uc3QgY2FuSW5zZXRYID0gd2luZG93LmlubmVyV2lkdGggPj0gd2lkdGggKyBpbnNldCAqIDI7XG4gICAgY29uc3QgY2FuSW5zZXRZID0gd2luZG93LmlubmVySGVpZ2h0ID49IGhlaWdodCArIGluc2V0ICogMjtcbiAgICBjb25zdCBtaW5YID0gY2FuSW5zZXRYID8gaW5zZXQgOiAwO1xuICAgIGNvbnN0IG1pblkgPSBjYW5JbnNldFkgPyBpbnNldCA6IDA7XG4gICAgY29uc3QgbWF4WCA9IGNhbkluc2V0WFxuICAgICAgPyB3aW5kb3cuaW5uZXJXaWR0aCAtIHdpZHRoIC0gaW5zZXRcbiAgICAgIDogTWF0aC5tYXgoMCwgd2luZG93LmlubmVyV2lkdGggLSB3aWR0aCk7XG4gICAgY29uc3QgbWF4WSA9IGNhbkluc2V0WVxuICAgICAgPyB3aW5kb3cuaW5uZXJIZWlnaHQgLSBoZWlnaHQgLSBpbnNldFxuICAgICAgOiBNYXRoLm1heCgwLCB3aW5kb3cuaW5uZXJIZWlnaHQgLSBoZWlnaHQpO1xuICAgIGNvbnN0IHJhd1ggPSBOdW1iZXIocG9zaXRpb24gJiYgcG9zaXRpb24ueCk7XG4gICAgY29uc3QgcmF3WSA9IE51bWJlcihwb3NpdGlvbiAmJiBwb3NpdGlvbi55KTtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KG1pblgsIE51bWJlci5pc0Zpbml0ZShyYXdYKSA/IHJhd1ggOiAwKSwgbWF4WCkpLFxuICAgICAgeTogTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heChtaW5ZLCBOdW1iZXIuaXNGaW5pdGUocmF3WSkgPyByYXdZIDogMCksIG1heFkpKVxuICAgIH07XG4gIH1cblxuICBfYXBwbHlGbG9hdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgY29uc3QgY2xhbXBlZCA9IHRoaXMuX2NsYW1wUG9zaXRpb24ocG9zaXRpb24pO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbk1vZGU7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7Y2xhbXBlZC54fXB4YDtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9IGAke2NsYW1wZWQueX1weGA7XG4gIH1cblxuICBoYW5kbGVSZXNpemUoKSB7XG4gICAgaWYgKCF0aGlzLl92aXNpYmxlIHx8IHRoaXMubGF5b3V0TW9kZSAhPT0gJ2Zsb2F0JyB8fCB0aGlzLl9pc0RyYWdnaW5nKSByZXR1cm47XG4gICAgY29uc3Qgc2F2ZWQgPSB0aGlzLl9nZXRGbG9hdFBvc2l0aW9uKCk7XG4gICAgaWYgKHNhdmVkKSB0aGlzLl9hcHBseUZsb2F0UG9zaXRpb24oc2F2ZWQpO1xuICB9XG5cbiAgLy8gLS0tIHBvcG92ZXIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgX3Nob3dQb3BvdmVyKCkge1xuICAgIGlmICghUE9QT1ZFUl9TVVBQT1JURUQgfHwgIXRoaXMudGltZUVsZW1lbnQpIHJldHVybiBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3BvcG92ZXInLCAnbWFudWFsJyk7XG4gICAgICAvLyBSZS1zaG93aW5nIHByb21vdGVzIHRoZSBvdmVybGF5IGFib3ZlIHRoZSBmdWxsc2NyZWVuIGJhY2tkcm9wIG9uXG4gICAgICAvLyBldmVyeSBmdWxsc2NyZWVuY2hhbmdlLlxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5oaWRlUG9wb3ZlcigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBub3QgY3VycmVudGx5IG9wZW5cbiAgICAgIH1cbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc2hvd1BvcG92ZXIoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBfaGlkZVBvcG92ZXIoKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50IHx8ICFQT1BPVkVSX1NVUFBPUlRFRCkgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmhpZGVQb3BvdmVyKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm90IGN1cnJlbnRseSBvcGVuIC8gdW5zdXBwb3J0ZWQgc3RhdGVcbiAgICB9XG4gIH1cblxuICBfdGVhcmRvd25Qb3BvdmVyKCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIGlmIChQT1BPVkVSX1NVUFBPUlRFRCAmJiB0aGlzLnRpbWVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncG9wb3ZlcicpKSB7XG4gICAgICB0aGlzLl9oaWRlUG9wb3ZlcigpO1xuICAgIH1cbiAgICBpZiAodGhpcy50aW1lRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3BvcG92ZXInKSkge1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3BvcG92ZXInKTtcbiAgICB9XG4gIH1cblxuICAvLyAtLS0gcG9pbnRlciAvIGRyYWcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBfYXBwbHlQb2ludGVyTW9kZSh1c2VQb3BvdmVyKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgLy8gUG9wb3ZlciBvdmVybGF5cyBzaXQgYWJvdmUgYSBuYXRpdmUgZnVsbHNjcmVlbiB2aWRlbyBhbmQgYXJlXG4gICAgLy8gZGlzcGxheS1vbmx5OyB0aGUgY2xvc2UgYnV0dG9uIGlzIGJlc3QtZWZmb3J0IGludGVyYWN0aXZlLlxuICAgIHRoaXMuX2ZvcmNlQ2xvc2VWaXNpYmxlID0gdXNlUG9wb3ZlcjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSB1c2VQb3BvdmVyID8gJ25vbmUnIDogJ2F1dG8nO1xuICAgIHRoaXMuX3Jlc2V0Q2xvc2VCdXR0b24oKTtcbiAgfVxuXG4gIF9yZXN0b3JlUG9pbnRlckV2ZW50cygpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWZhZGVkJyk7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gdGhpcy5fcG9wb3Zlck1vZGUgPyAnbm9uZScgOiAnYXV0byc7XG4gIH1cblxuICBzZXR1cERyYWdnaW5nKCkge1xuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIC8vIFBvcG92ZXIgY29udGFpbmVycyBhcmUgcG9pbnRlci1ldmVudHM6bm9uZTsgbm8gZHJhZyB0aGVyZS5cbiAgICBpZiAodGhpcy5fcG9wb3Zlck1vZGUpIHJldHVybjtcblxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcblxuICAgIHRoaXMuX2JvdW5kUG9pbnRlckRvd24gPSAoZSkgPT4gdGhpcy5fb25EcmFnU3RhcnQoZSk7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyTW92ZSA9IChlKSA9PiB0aGlzLl9vbkRyYWdNb3ZlKGUpO1xuICAgIHRoaXMuX2JvdW5kUG9pbnRlclVwID0gKGUpID0+IHRoaXMuX29uRHJhZ0VuZChlKTtcbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJDYW5jZWwgPSAoZSkgPT4gdGhpcy5fb25EcmFnRW5kKGUpO1xuXG4gICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX2JvdW5kUG9pbnRlckRvd24pO1xuICAgIHRoaXMudGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlKTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX2JvdW5kUG9pbnRlclVwKTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLl9ib3VuZFBvaW50ZXJDYW5jZWwpO1xuICB9XG5cbiAgdGVhcmRvd25EcmFnZ2luZygpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICcnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudXNlclNlbGVjdCA9ICcnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG91Y2hBY3Rpb24gPSAnJztcblxuICAgIGlmICh0aGlzLl9ib3VuZFBvaW50ZXJEb3duKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fYm91bmRQb2ludGVyRG93bik7XG4gICAgICB0aGlzLl9ib3VuZFBvaW50ZXJEb3duID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2JvdW5kUG9pbnRlck1vdmUpIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlKTtcbiAgICAgIHRoaXMuX2JvdW5kUG9pbnRlck1vdmUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5fYm91bmRQb2ludGVyVXApIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5fYm91bmRQb2ludGVyVXApO1xuICAgICAgdGhpcy5fYm91bmRQb2ludGVyVXAgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLl9ib3VuZFBvaW50ZXJDYW5jZWwpO1xuICAgICAgdGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IG51bGw7XG4gIH1cblxuICBfb25EcmFnU3RhcnQoZSkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIGlmIChlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnICYmIGUuYnV0dG9uICE9PSAwKSByZXR1cm47XG4gICAgLy8gQ2xpY2tpbmcgdGhlIGNsb3NlIGJ1dHRvbiBtdXN0IG5vdCBzdGFydCBhIGRyYWcuXG4gICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLl9jbG9zZUJ0biB8fFxuICAgICAgICAodGhpcy5fY2xvc2VCdG4gJiYgdGhpcy5fY2xvc2VCdG4uY29udGFpbnMoZS50YXJnZXQpKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IGUucG9pbnRlcklkO1xuXG4gICAgY29uc3QgcmVjdCA9IHRoaXMudGltZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5fZHJhZ09mZnNldCA9IHsgeDogZS5jbGllbnRYIC0gcmVjdC5sZWZ0LCB5OiBlLmNsaWVudFkgLSByZWN0LnRvcCB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc2V0UG9pbnRlckNhcHR1cmUoZS5wb2ludGVySWQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gcG9pbnRlciBjYXB0dXJlIGlzIGJlc3QtZWZmb3J0XG4gICAgfVxuXG4gICAgdGhpcy5fd2FrZSgpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIF9vbkRyYWdNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMuX2lzRHJhZ2dpbmcgfHwgIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICBpZiAodGhpcy5fYWN0aXZlUG9pbnRlcklkICE9PSBudWxsICYmIGUucG9pbnRlcklkICE9PSB0aGlzLl9hY3RpdmVQb2ludGVySWQpIHJldHVybjtcblxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fY2xhbXBQb3NpdGlvbih7XG4gICAgICB4OiBlLmNsaWVudFggLSB0aGlzLl9kcmFnT2Zmc2V0LngsXG4gICAgICB5OiBlLmNsaWVudFkgLSB0aGlzLl9kcmFnT2Zmc2V0LnlcbiAgICB9KTtcblxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbk1vZGU7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24ueH1weGA7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHtwb3NpdGlvbi55fXB4YDtcblxuICAgIHRoaXMuX3dha2UoKTtcbiAgfVxuXG4gIF9vbkRyYWdFbmQoZSkge1xuICAgIGlmICghdGhpcy5faXNEcmFnZ2luZyB8fCAhdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9hY3RpdmVQb2ludGVySWQgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50Lmhhc1BvaW50ZXJDYXB0dXJlICYmXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50Lmhhc1BvaW50ZXJDYXB0dXJlKHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCkpIHtcbiAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbGVhc2VQb2ludGVyQ2FwdHVyZSh0aGlzLl9hY3RpdmVQb2ludGVySWQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gaWdub3JlXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IG51bGw7XG5cbiAgICBjb25zdCByZWN0ID0gdGhpcy50aW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2NsYW1wUG9zaXRpb24oeyB4OiByZWN0LmxlZnQsIHk6IHJlY3QudG9wIH0pO1xuICAgIHRoaXMuX3NldEZsb2F0UG9zaXRpb24ocG9zaXRpb24pO1xuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHRoaXMuX3dha2UoKTtcbiAgfVxuXG4gIC8vIC0tLSBhdXRvIGhpZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHN0YXJ0QXV0b0hpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIHRoaXMuX3Jlc3RvcmVQb2ludGVyRXZlbnRzKCk7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLl9zZXR1cFdha2VMaXN0ZW5lcigpO1xuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xuICB9XG5cbiAgY2xlYXJBdXRvSGlkZVRpbWVyKCkge1xuICAgIGlmICh0aGlzLmF1dG9IaWRlVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmF1dG9IaWRlVGltZXIpO1xuICAgICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfc2V0dXBXYWtlTGlzdGVuZXIoKSB7XG4gICAgdGhpcy50ZWFyZG93bldha2VMaXN0ZW5lcigpO1xuICAgIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIgPSAoKSA9PiB0aGlzLl93YWtlKCk7XG5cbiAgICAvLyBXYWtlIG9uIGFjdGl2aXR5IGFueXdoZXJlIGluIHRoZSBmdWxsc2NyZWVuIGNvbnRhaW5lci9kb2N1bWVudCwgbm90XG4gICAgLy8gb25seSBvdmVyIHRoZSA8dmlkZW8+IGVsZW1lbnQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50KSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRlYXJkb3duV2FrZUxpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLl9ib3VuZFdha2VIYW5kbGVyKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZFdha2VIYW5kbGVyKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICBpZiAodGhpcy50aW1lRWxlbWVudCkge1xuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICB9XG4gICAgICB0aGlzLl9ib3VuZFdha2VIYW5kbGVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfd2FrZSgpIHtcbiAgICBpZiAoIXRoaXMuYXV0b0hpZGUgfHwgIXRoaXMuX3Zpc2libGUgfHwgIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgdGhpcy5fcmVzdG9yZVBvaW50ZXJFdmVudHMoKTtcbiAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xuICB9XG5cbiAgZmFkZU91dCgpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWZhZGVkJyk7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBudWxsO1xuICB9XG5cbiAgLy8gLS0tIHRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgX3N5c3RlbVRpbWUoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd1NlY29uZHNcbiAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXG4gICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgfVxuXG4gIHVwZGF0ZVRpbWUoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVGV4dFNwYW4pIHJldHVybjtcbiAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5fc3lzdGVtVGltZSgpO1xuXG4gICAgaWYgKHRoaXMuc2hvd1Byb2dyZXNzICYmIHRoaXMubWVkaWEpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gTnVtYmVyKHRoaXMubWVkaWEuY3VycmVudFRpbWUpO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBOdW1iZXIodGhpcy5tZWRpYS5kdXJhdGlvbik7XG4gICAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPVxuICAgICAgICBgJHtmb3JtYXRUaW1lKGN1cnJlbnRUaW1lKX0gLyAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSB8ICR7c3lzdGVtVGltZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPSBzeXN0ZW1UaW1lO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLSB0ZWFyZG93biAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2NsZWFyUG9wb3ZlclJldHJ5KCk7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLnRlYXJkb3duV2FrZUxpc3RlbmVyKCk7XG4gICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XG4gICAgdGhpcy5fdGVhcmRvd25Qb3BvdmVyKCk7XG4gICAgdGhpcy5faGlkZURpc21pc3NIaW50KCk7XG5cbiAgICBpZiAodGhpcy50aW1lRWxlbWVudCAmJiB0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4gPSBudWxsO1xuICAgIHRoaXMuX2Nsb3NlQnRuID0gbnVsbDtcbiAgICB0aGlzLm1lZGlhID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IGV4dGVuZHMgVGltZURpc3BsYXkge1xuICBkaXNwbGF5VHlwZSgpIHtcbiAgICByZXR1cm4gJ3dpbmRvdy1vdmVybGF5JztcbiAgfVxuXG4gIGNoZWNrSXNUb1Nob3coKSB7XG4gICAgaWYgKCF0aGlzLnNob3dPbkZ1bGxzY3JlZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmc0VsID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKTtcblxuICAgIGlmICghZnNFbCkge1xuICAgICAgcmV0dXJuIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xuICAgIH1cblxuICAgIC8vIE5hdGl2ZSB2aWRlbyBmdWxsc2NyZWVuIGlzIGhhbmRsZWQgYnkgdGhlIHZpZGVvIHdpZGdldCdzIHRvcC1sYXllclxuICAgIC8vIHBvcG92ZXI7IHRoZSB3aW5kb3cgb3ZlcmxheSBtdXN0IG5vdCBkdXBsaWNhdGUgaXQuXG4gICAgaWYgKGlzVmlkZW9FbGVtZW50KGZzRWwpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0aGlzLnZpZGVvT3ZlcmxheUFjdGl2ZTtcbiAgfVxuXG4gIHVwZGF0ZVRpbWUoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVGV4dFNwYW4pIHJldHVybjtcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPSB0aGlzLl9zeXN0ZW1UaW1lKCk7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuICBUaW1lRGlzcGxheSxcbiAgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5LFxuICBnZXRGdWxsc2NyZWVuRWxlbWVudCxcbiAgRlVMTFNDUkVFTl9FVkVOVFNcbn0gZnJvbSAnLi93aWRnZXRzJztcbmltcG9ydCB7IHQsIGluaXQsIHJlbG9hZEZyb21TdG9yYWdlIH0gZnJvbSAnLi9pMThuJztcbmltcG9ydCB7XG4gIERFRkFVTFRfS0VZX1RPR0dMRV9MQVlPVVQsXG4gIERFRkFVTFRfS0VZX1RPR0dMRV9WSVNJQklMSVRZLFxuICBidWlsZEtleVN0cmluZyxcbiAgaXNFZGl0YWJsZVRhcmdldFxufSBmcm9tICcuL3Nob3J0Y3V0S2V5cyc7XG5cbmNvbnN0IElTX1RPUF9GUkFNRSA9IHdpbmRvdy50b3AgPT09IHdpbmRvdztcbmNvbnN0IE1BWF9TQ0FOX1JFVFJJRVMgPSA1O1xuXG4vLyDliJ3lp4vljJboh6rlrprkuYkgaTE4bu+8iOW8guatpeWKoOi9vee/u+ivke+8iVxuaW5pdCgpLnRoZW4oKCkgPT4ge1xuICAvLyBXaWRnZXRzIG1heSBoYXZlIGJlZW4gY3JlYXRlZCB3aXRoIGZhbGxiYWNrIGxhYmVscyBiZWZvcmUgdHJhbnNsYXRpb25zXG4gIC8vIHJlc29sdmVkLiBSZS1hcHBseSBzZXR0aW5ncyBzbyBsb2NhbGl6ZWQgbGFiZWxzIGFyZSByZWZyZXNoZWQuXG4gIGRpc3RyaWJ1dGVTZXR0aW5ncygpO1xufSk7XG5cbmZ1bmN0aW9uIGxvZ1RvcCguLi5hcmdzKSB7XG4gIGlmIChJU19UT1BfRlJBTUUpIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xufVxuXG5sb2dUb3AodCgnbXNnTG9hZGVkJykpO1xuXG4vLyAtLS0gY2VudHJhbGl6ZWQgc2V0dGluZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1MgPSB7XG4gIHNob3dXaGVuVmlkZW9GdWxsc2NyZWVuOiB0cnVlLFxuICBzaG93T25GdWxsc2NyZWVuOiB0cnVlLFxuICBzaG93U2Vjb25kczogdHJ1ZSxcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBhdXRvSGlkZTogZmFsc2UsXG4gIGxheW91dE1vZGU6ICdzbmFwJyxcbiAgZmxvYXRQb3NpdGlvblZpZGVvOiBudWxsLFxuICBmbG9hdFBvc2l0aW9uV2luZG93OiBudWxsXG59O1xuXG5jb25zdCBzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MpO1xuXG4vLyBTaG9ydGN1dCBiaW5kaW5ncyBhcmUgY2FjaGVkIHNvIHRoZSBrZXlkb3duIHBhdGggc3RheXMgc3luY2hyb25vdXMuXG5jb25zdCBzaG9ydGN1dEtleXMgPSB7XG4gIGtleVRvZ2dsZUxheW91dDogREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVCxcbiAga2V5VG9nZ2xlVmlzaWJpbGl0eTogREVGQVVMVF9LRVlfVE9HR0xFX1ZJU0lCSUxJVFlcbn07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0b3JlZFNob3J0Y3V0KHZhbHVlKSB7XG4gIC8vIE5vcm1hbGl6ZSBsZWdhY3kgU3BhY2UgYmluZGluZ3MgdG8gdGhlIGNhbm9uaWNhbCBcIlNwYWNlXCIgbmFtZS5cbiAgLy8gQmFyZSBcIiBcIiA9PiBcIlNwYWNlXCI7IFwiQ3RybCsgXCIgPT4gXCJDdHJsK1NwYWNlXCIuXG4gIGlmICh2YWx1ZSA9PT0gJyAnKSByZXR1cm4gJ1NwYWNlJztcbiAgaWYgKHZhbHVlLmVuZHNXaXRoKCcrICcpKSByZXR1cm4gYCR7dmFsdWUuc2xpY2UoMCwgLTEpfVNwYWNlYDtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiByZWFkU3RvcmVkU2hvcnRjdXQodmFsdWUsIGZhbGxiYWNrKSB7XG4gIC8vIE1pc3Npbmcvbm9uLXN0cmluZyA9PiBkZWZhdWx0OyBlbXB0eSBzdHJpbmcgPT4gZXhwbGljaXRseSBkaXNhYmxlZDtcbiAgLy8gYW55IG90aGVyIHN0cmluZyA9PiBiaW5kaW5nIChub3JtYWxpemVkIGlmIG5lZWRlZCkuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSByZXR1cm4gZmFsbGJhY2s7XG4gIGlmICh2YWx1ZSA9PT0gJycpIHJldHVybiAnJztcbiAgcmV0dXJuIG5vcm1hbGl6ZVN0b3JlZFNob3J0Y3V0KHZhbHVlKTtcbn1cblxuY29uc3QgU0VUVElOR19LRVlTID0gW1xuICAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nLFxuICAnc2hvd09uRnVsbHNjcmVlbicsXG4gICdzaG93U2Vjb25kcycsXG4gICdzaG93UHJvZ3Jlc3MnLFxuICAnYXV0b0hpZGUnLFxuICAnbGF5b3V0TW9kZScsXG4gICdmbG9hdFBvc2l0aW9uVmlkZW8nLFxuICAnZmxvYXRQb3NpdGlvbldpbmRvdydcbl07XG5cbi8vIHZpZGVvIC0+IHdpZGdldCAocHJldmVudHMgZHVwbGljYXRlIGJpbmRpbmcpXG5jb25zdCB2aWRlb1dpZGdldHMgPSBuZXcgV2Vha01hcCgpO1xuLy8gaXRlcmFibGUgY29tcGFuaW9uIHRvIHRoZSBXZWFrTWFwIChXZWFrTWFwIGlzIG5vdCBpdGVyYWJsZSlcbmNvbnN0IHRyYWNrZWRWaWRlb3MgPSBuZXcgU2V0KCk7XG5cbmxldCBvdmVybGF5VGltZURpc3AgPSBJU19UT1BfRlJBTUVcbiAgPyBuZXcgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5KGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxuICA6IG51bGw7XG5cbi8vIEFsbCB0aW1lcnMgY3JlYXRlZCBieSBpbmRleCBhcmUgdHJhY2tlZCBzbyB0ZWFyZG93biBjYW4gY2xlYXIgdGhlbS5cbmNvbnN0IHBlbmRpbmdUaW1lb3V0cyA9IG5ldyBTZXQoKTtcblxuZnVuY3Rpb24gc2NoZWR1bGVUaW1lb3V0KGNhbGxiYWNrLCBkZWxheSkge1xuICBjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHBlbmRpbmdUaW1lb3V0cy5kZWxldGUoaWQpO1xuICAgIGNhbGxiYWNrKCk7XG4gIH0sIGRlbGF5KTtcbiAgcGVuZGluZ1RpbWVvdXRzLmFkZChpZCk7XG4gIHJldHVybiBpZDtcbn1cblxuZnVuY3Rpb24gY2xlYXJQZW5kaW5nVGltZW91dHMoKSB7XG4gIHBlbmRpbmdUaW1lb3V0cy5mb3JFYWNoKChpZCkgPT4gY2xlYXJUaW1lb3V0KGlkKSk7XG4gIHBlbmRpbmdUaW1lb3V0cy5jbGVhcigpO1xufVxuXG5mdW5jdGlvbiBkaXN0cmlidXRlU2V0dGluZ3MoKSB7XG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICBpZiAod2lkZ2V0KSB3aWRnZXQuYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XG4gIH0pO1xuICBpZiAob3ZlcmxheVRpbWVEaXNwKSBvdmVybGF5VGltZURpc3AuYXBwbHlTZXR0aW5ncyhzZXR0aW5ncyk7XG4gIC8vIGFwcGx5U2V0dGluZ3MgaXMgcHVyZTsgdmlzaWJpbGl0eSAoYW5kIHNpbmdsZS13aWRnZXQgc2VsZWN0aW9uKSBpc1xuICAvLyBjZW50cmFsaXplZCBzbyBtdWx0aXBsZSBtYXRjaGluZyB2aWRlb3MgbmV2ZXIgc3RhY2sgY2xvY2tzLlxuICB1cGRhdGVBbGxWaXNpYmlsaXR5KCk7XG59XG5cbmZ1bmN0aW9uIGxvYWRTZXR0aW5ncygpIHtcbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXG4gICAgT2JqZWN0LmFzc2lnbih7XG4gICAgICBmbG9hdFBvc2l0aW9uOiBudWxsLFxuICAgICAga2V5VG9nZ2xlTGF5b3V0OiBERUZBVUxUX0tFWV9UT0dHTEVfTEFZT1VULFxuICAgICAga2V5VG9nZ2xlVmlzaWJpbGl0eTogREVGQVVMVF9LRVlfVE9HR0xFX1ZJU0lCSUxJVFlcbiAgICB9LCBERUZBVUxUX1NFVFRJTkdTKSxcbiAgICAoaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IGxlZ2FjeSA9IGl0ZW1zLmZsb2F0UG9zaXRpb247XG5cbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRMYXlvdXQgPSByZWFkU3RvcmVkU2hvcnRjdXQoXG4gICAgICAgIGl0ZW1zLmtleVRvZ2dsZUxheW91dCxcbiAgICAgICAgREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVFxuICAgICAgKTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRWaXNpYmlsaXR5ID0gcmVhZFN0b3JlZFNob3J0Y3V0KFxuICAgICAgICBpdGVtcy5rZXlUb2dnbGVWaXNpYmlsaXR5LFxuICAgICAgICBERUZBVUxUX0tFWV9UT0dHTEVfVklTSUJJTElUWVxuICAgICAgKTtcblxuICAgICAgc2hvcnRjdXRLZXlzLmtleVRvZ2dsZUxheW91dCA9IG5vcm1hbGl6ZWRMYXlvdXQ7XG4gICAgICBzaG9ydGN1dEtleXMua2V5VG9nZ2xlVmlzaWJpbGl0eSA9IG5vcm1hbGl6ZWRWaXNpYmlsaXR5O1xuXG4gICAgICAvLyBPbmUtdGltZSBub3JtYWxpemF0aW9uIG1pZ3JhdGlvbiBmb3IgbGVnYWN5IFNwYWNlIGJpbmRpbmdzIChvciBvdGhlclxuICAgICAgLy8gY29ycmVjdGVkIHZhbHVlcykuIE5vcm1hbGl6YXRpb24gaXMgaWRlbXBvdGVudCwgc28gdGhpcyBjYW5ub3QgbG9vcC5cbiAgICAgIGNvbnN0IHNob3J0Y3V0VXBkYXRlcyA9IHt9O1xuICAgICAgaWYgKG5vcm1hbGl6ZWRMYXlvdXQgIT09IGl0ZW1zLmtleVRvZ2dsZUxheW91dCkge1xuICAgICAgICBzaG9ydGN1dFVwZGF0ZXMua2V5VG9nZ2xlTGF5b3V0ID0gbm9ybWFsaXplZExheW91dDtcbiAgICAgIH1cbiAgICAgIGlmIChub3JtYWxpemVkVmlzaWJpbGl0eSAhPT0gaXRlbXMua2V5VG9nZ2xlVmlzaWJpbGl0eSkge1xuICAgICAgICBzaG9ydGN1dFVwZGF0ZXMua2V5VG9nZ2xlVmlzaWJpbGl0eSA9IG5vcm1hbGl6ZWRWaXNpYmlsaXR5O1xuICAgICAgfVxuICAgICAgaWYgKE9iamVjdC5rZXlzKHNob3J0Y3V0VXBkYXRlcykubGVuZ3RoID4gMCkge1xuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldChzaG9ydGN1dFVwZGF0ZXMpO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuICE9PSBmYWxzZTtcbiAgICAgIHNldHRpbmdzLnNob3dPbkZ1bGxzY3JlZW4gPSBpdGVtcy5zaG93T25GdWxsc2NyZWVuICE9PSBmYWxzZTtcbiAgICAgIHNldHRpbmdzLnNob3dTZWNvbmRzID0gaXRlbXMuc2hvd1NlY29uZHMgIT09IGZhbHNlO1xuICAgICAgc2V0dGluZ3Muc2hvd1Byb2dyZXNzID0gaXRlbXMuc2hvd1Byb2dyZXNzICE9PSBmYWxzZTtcbiAgICAgIHNldHRpbmdzLmF1dG9IaWRlID0gaXRlbXMuYXV0b0hpZGUgPT09IHRydWU7XG4gICAgICBzZXR0aW5ncy5sYXlvdXRNb2RlID0gaXRlbXMubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0JyA/ICdmbG9hdCcgOiAnc25hcCc7XG4gICAgICBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uVmlkZW8gPSBpdGVtcy5mbG9hdFBvc2l0aW9uVmlkZW8gfHwgbnVsbDtcbiAgICAgIHNldHRpbmdzLmZsb2F0UG9zaXRpb25XaW5kb3cgPSBpdGVtcy5mbG9hdFBvc2l0aW9uV2luZG93IHx8IG51bGw7XG5cbiAgICAgIC8vIE9uZS10aW1lIG1pZ3JhdGlvbiBvZiB0aGUgbGVnYWN5IHNoYXJlZCBmbG9hdCBwb3NpdGlvbi4gVXNlIGl0IGZvclxuICAgICAgLy8gYm90aCB3aWRnZXQgdHlwZXMsIHRoZW4gcmVtb3ZlIHRoZSBvbGQga2V5LlxuICAgICAgbGV0IG1pZ3JhdGVkID0gZmFsc2U7XG4gICAgICBpZiAobGVnYWN5ICYmIHR5cGVvZiBsZWdhY3kgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmICghc2V0dGluZ3MuZmxvYXRQb3NpdGlvblZpZGVvKSB7XG4gICAgICAgICAgc2V0dGluZ3MuZmxvYXRQb3NpdGlvblZpZGVvID0gbGVnYWN5O1xuICAgICAgICAgIG1pZ3JhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNldHRpbmdzLmZsb2F0UG9zaXRpb25XaW5kb3cpIHtcbiAgICAgICAgICBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93ID0gbGVnYWN5O1xuICAgICAgICAgIG1pZ3JhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBkaXN0cmlidXRlU2V0dGluZ3MoKTtcblxuICAgICAgaWYgKGxlZ2FjeSAhPT0gbnVsbCAmJiBsZWdhY3kgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobWlncmF0ZWQpIHtcbiAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7XG4gICAgICAgICAgICBmbG9hdFBvc2l0aW9uVmlkZW86IHNldHRpbmdzLmZsb2F0UG9zaXRpb25WaWRlbyxcbiAgICAgICAgICAgIGZsb2F0UG9zaXRpb25XaW5kb3c6IHNldHRpbmdzLmZsb2F0UG9zaXRpb25XaW5kb3dcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnJlbW92ZSgnZmxvYXRQb3NpdGlvbicpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcbn1cblxubG9hZFNldHRpbmdzKCk7XG5cbi8vIFNpbmdsZSBzdG9yYWdlIGxpc3RlbmVyIGZvciB0aGUgd2hvbGUgcGFnZSAvIGZyYW1lLlxuZnVuY3Rpb24gaGFuZGxlU3RvcmFnZUNoYW5nZWQoY2hhbmdlcywgbmFtZXNwYWNlKSB7XG4gIGlmIChuYW1lc3BhY2UgIT09ICdzeW5jJykgcmV0dXJuO1xuXG4gIGxldCBjaGFuZ2VkID0gZmFsc2U7XG4gIFNFVFRJTkdfS0VZUy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNoYW5nZXMsIGtleSkpIHtcbiAgICAgIHNldHRpbmdzW2tleV0gPSBjaGFuZ2VzW2tleV0ubmV3VmFsdWU7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlcywgJ2tleVRvZ2dsZUxheW91dCcpKSB7XG4gICAgc2hvcnRjdXRLZXlzLmtleVRvZ2dsZUxheW91dCA9IHJlYWRTdG9yZWRTaG9ydGN1dChcbiAgICAgIGNoYW5nZXMua2V5VG9nZ2xlTGF5b3V0Lm5ld1ZhbHVlLFxuICAgICAgREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVFxuICAgICk7XG4gIH1cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2VzLCAna2V5VG9nZ2xlVmlzaWJpbGl0eScpKSB7XG4gICAgc2hvcnRjdXRLZXlzLmtleVRvZ2dsZVZpc2liaWxpdHkgPSByZWFkU3RvcmVkU2hvcnRjdXQoXG4gICAgICBjaGFuZ2VzLmtleVRvZ2dsZVZpc2liaWxpdHkubmV3VmFsdWUsXG4gICAgICBERUZBVUxUX0tFWV9UT0dHTEVfVklTSUJJTElUWVxuICAgICk7XG4gIH1cblxuICBjb25zdCBsYW5ndWFnZUNoYW5nZWQgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlcywgJ2xhbmd1YWdlJyk7XG5cbiAgLy8gTGFuZ3VhZ2UgY2hhbmdlIG11c3Qgbm90IHN3YWxsb3cgY28tY2hhbmdlZCBzZXR0aW5ncy5cbiAgaWYgKGxhbmd1YWdlQ2hhbmdlZCkge1xuICAgIHJlbG9hZEZyb21TdG9yYWdlKCkudGhlbigoKSA9PiBkaXN0cmlidXRlU2V0dGluZ3MoKSk7XG4gIH1cbiAgaWYgKGNoYW5nZWQpIGRpc3RyaWJ1dGVTZXR0aW5ncygpO1xufVxuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoaGFuZGxlU3RvcmFnZUNoYW5nZWQpO1xuXG4vLyAtLS0gbWVkaWEgZGlzY292ZXJ5IC8gYmluZGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gYmluZFZpZGVvKHZpZGVvKSB7XG4gIGlmICghdmlkZW8gfHwgdmlkZW8udGFnTmFtZSAhPT0gJ1ZJREVPJykgcmV0dXJuO1xuICBpZiAodmlkZW9XaWRnZXRzLmhhcyh2aWRlbykpIHJldHVybjtcblxuICBjb25zdCB3aWRnZXQgPSBuZXcgVGltZURpc3BsYXkodmlkZW8pO1xuICB2aWRlb1dpZGdldHMuc2V0KHZpZGVvLCB3aWRnZXQpO1xuICB0cmFja2VkVmlkZW9zLmFkZCh2aWRlbyk7XG5cbiAgd2lkZ2V0LmFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICB1cGRhdGVBbGxWaXNpYmlsaXR5KCk7XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lWaWRlbyh2aWRlbykge1xuICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgaWYgKHdpZGdldCkgd2lkZ2V0LmRlc3Ryb3koKTtcbiAgdmlkZW9XaWRnZXRzLmRlbGV0ZSh2aWRlbyk7XG4gIHRyYWNrZWRWaWRlb3MuZGVsZXRlKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKHJvb3QpIHtcbiAgY29uc3QgdmlkZW9zID0gKHJvb3QgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoJ3ZpZGVvJyk7XG4gIGxldCBmb3VuZCA9IDA7XG4gIHZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgIGlmICghdmlkZW9XaWRnZXRzLmhhcyh2aWRlbykpIHtcbiAgICAgIGJpbmRWaWRlbyh2aWRlbyk7XG4gICAgICBmb3VuZCsrO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmb3VuZDtcbn1cblxuLy8gU2NhbiBpbW1lZGlhdGVseTsgaWYgbm8gdmlkZW9zIGV4aXN0IHlldCwgcmV0cnkgYSBib3VuZGVkIG51bWJlciBvZiB0aW1lc1xuLy8gKDUgeCAxcykgcmF0aGVyIHRoYW4gcG9sbGluZyBmb3JldmVyLlxubGV0IHNjYW5SZXRyaWVzID0gMDtcblxuZnVuY3Rpb24gaW5pdGlhbFNjYW4oKSB7XG4gIGNvbnN0IGZvdW5kID0gc2NhbkZvck1lZGlhKGRvY3VtZW50KTtcbiAgaWYgKGZvdW5kID4gMCkge1xuICAgIGxvZ1RvcCh0KCdtc2dGb3VuZE1lZGlhJyksIGZvdW5kKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoc2NhblJldHJpZXMgPCBNQVhfU0NBTl9SRVRSSUVTKSB7XG4gICAgc2NhblJldHJpZXMrKztcbiAgICBzY2hlZHVsZVRpbWVvdXQoaW5pdGlhbFNjYW4sIDEwMDApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ1RvcCh0KCdtc2dOb01lZGlhJykpO1xufVxuXG5pbml0aWFsU2NhbigpO1xuXG4vLyBEeW5hbWljIHZpZGVvczogYmluZCBuZXdseSBhZGRlZCB2aWRlb3MgYW5kIGRlc3Ryb3kgd2lkZ2V0cyBmb3IgcmVtb3ZlZCBvbmVzLlxuY29uc3QgbWVkaWFPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgbGV0IHNhd1JlbW92YWwgPSBmYWxzZTtcblxuICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGlmICghbm9kZSB8fCBub2RlLm5vZGVUeXBlICE9PSAxKSByZXR1cm47XG4gICAgICBpZiAobm9kZS50YWdOYW1lID09PSAnVklERU8nKSB7XG4gICAgICAgIGJpbmRWaWRlbyhub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgICAgbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd2aWRlbycpLmZvckVhY2goKHZpZGVvKSA9PiBiaW5kVmlkZW8odmlkZW8pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtdXRhdGlvbi5yZW1vdmVkTm9kZXMgJiYgbXV0YXRpb24ucmVtb3ZlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNhd1JlbW92YWwgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHNhd1JlbW92YWwpIHtcbiAgICAvLyBEZWZlciBzbyBhIG1vdmVkIHZpZGVvIChyZW1vdmVkICsgcmUtYWRkZWQpIGlzIG5vdCBkZXN0cm95ZWQuXG4gICAgc2NoZWR1bGVUaW1lb3V0KGNsZWFudXBSZW1vdmVkVmlkZW9zLCAwKTtcbiAgfVxufSk7XG5cbm1lZGlhT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgY2hpbGRMaXN0OiB0cnVlLFxuICBzdWJ0cmVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gY2xlYW51cFJlbW92ZWRWaWRlb3MoKSB7XG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBpZiAoIXZpZGVvLmlzQ29ubmVjdGVkKSBkZXN0cm95VmlkZW8odmlkZW8pO1xuICB9KTtcbn1cblxuLy8gLS0tIGNlbnRyYWxpemVkIHNjaGVkdWxpbmcgLyB2aXNpYmlsaXR5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IHRpY2tlciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgdHJhY2tlZFZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgIGNvbnN0IHdpZGdldCA9IHZpZGVvV2lkZ2V0cy5nZXQodmlkZW8pO1xuICAgIGlmICh3aWRnZXQgJiYgd2lkZ2V0LmlzU2hvd2luZygpKSB3aWRnZXQudXBkYXRlVGltZSgpO1xuICB9KTtcbiAgaWYgKG92ZXJsYXlUaW1lRGlzcCAmJiBvdmVybGF5VGltZURpc3AuaXNTaG93aW5nKCkpIHtcbiAgICBvdmVybGF5VGltZURpc3AudXBkYXRlVGltZSgpO1xuICB9XG59LCAxMDAwKTtcblxuZnVuY3Rpb24gdXBkYXRlQWxsVmlzaWJpbGl0eSgpIHtcbiAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gIGxldCB3aW5uZXJXaWRnZXQgPSBudWxsO1xuXG4gIGlmIChmc0VsKSB7XG4gICAgLy8gT25seSBvbmUgY2xvY2sgbWF5IHdpbiBpbnNpZGUgYSBmdWxsc2NyZWVuIGNvbnRhaW5lci4gUHJlZmVyIHRoZSB2aWRlb1xuICAgIC8vIHRoYXQgaXMgYWN0dWFsbHkgcGxheWluZywgdGhlbiB0aGUgZXhhY3QgZnVsbHNjcmVlbiBlbGVtZW50LCB0aGVuIHRoZVxuICAgIC8vIGZpcnN0IG1hdGNoaW5nIHdpZGdldC5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gW107XG4gICAgdHJhY2tlZFZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgICAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gICAgICBpZiAod2lkZ2V0ICYmIHdpZGdldC5jaGVja0lzVG9TaG93KCkpIHtcbiAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHsgdmlkZW8sIHdpZGdldCB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCB3aW5uZXIgPSBudWxsO1xuICAgIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbm5lciA9IGNhbmRpZGF0ZXMuZmluZCgoYykgPT4gIWMudmlkZW8ucGF1c2VkICYmICFjLnZpZGVvLmVuZGVkKSB8fFxuICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5maW5kKChjKSA9PiBjLnZpZGVvID09PSBmc0VsKSB8fFxuICAgICAgICAgICAgICAgY2FuZGlkYXRlc1swXTtcbiAgICB9XG5cbiAgICB3aW5uZXJXaWRnZXQgPSB3aW5uZXIgPyB3aW5uZXIud2lkZ2V0IDogbnVsbDtcbiAgICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICAgIGlmICh3aWRnZXQgJiYgd2lkZ2V0ICE9PSB3aW5uZXJXaWRnZXQgJiYgd2lkZ2V0LmlzU2hvd2luZygpKSB7XG4gICAgICAgIHdpZGdldC5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHdpbm5lcldpZGdldCkgd2lubmVyV2lkZ2V0LnVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgfSBlbHNlIHtcbiAgICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICAgIGlmICh3aWRnZXQpIHdpZGdldC51cGRhdGVWaXNpYmlsaXR5KCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAob3ZlcmxheVRpbWVEaXNwKSB7XG4gICAgLy8gQ29udHJhY3Qgd2l0aCB0aGUgb3ZlcmxheTogYSB2aWRlby9lbWJlZGRlZCBmdWxsc2NyZWVuIG93bnMgdGhlIHZpZXcsXG4gICAgLy8gcmVnYXJkbGVzcyBvZiB3aGV0aGVyIGl0cyBjbG9jayBpcyBjdXJyZW50bHkgdmlzaWJsZS5cbiAgICBvdmVybGF5VGltZURpc3AudmlkZW9PdmVybGF5QWN0aXZlID0gaXNWaWRlb0NvbnRlbnRGdWxsc2NyZWVuKCk7XG4gICAgb3ZlcmxheVRpbWVEaXNwLnVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXNpemUoKSB7XG4gIHVwZGF0ZUFsbFZpc2liaWxpdHkoKTtcbiAgdHJhY2tlZFZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgIGNvbnN0IHdpZGdldCA9IHZpZGVvV2lkZ2V0cy5nZXQodmlkZW8pO1xuICAgIGlmICh3aWRnZXQpIHdpZGdldC5oYW5kbGVSZXNpemUoKTtcbiAgfSk7XG4gIGlmIChvdmVybGF5VGltZURpc3ApIG92ZXJsYXlUaW1lRGlzcC5oYW5kbGVSZXNpemUoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRnVsbHNjcmVlbkNoYW5nZSgpIHtcbiAgaWYgKCFnZXRGdWxsc2NyZWVuRWxlbWVudCgpICYmICFjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSkge1xuICAgIHJlc3RvcmVUZW1wVmFsdWVzKCk7XG4gIH1cbiAgdXBkYXRlQWxsVmlzaWJpbGl0eSgpO1xufVxuXG4vLyBTaW5nbGUgc2V0IG9mIGdsb2JhbCBmdWxsc2NyZWVuL3Jlc2l6ZSBsaXN0ZW5lcnMuXG5GVUxMU0NSRUVOX0VWRU5UUy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZUZ1bGxzY3JlZW5DaGFuZ2UpO1xufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVJlc2l6ZSk7XG5cbi8vIC0tLSDlv6vmjbfplK7lpITnkIbvvIjlnYfkuLrkuLTml7bliIfmjaLvvIzkuI3lhpkgc3RvcmFnZe+8iSAtLS1cblxuLy8g6KKr5b+r5o236ZSu5Li05pe25pS55Yqo55qE6K6+572u77yM6YCA5Ye65YWo5bGP5pe25oGi5aSN5Y6f5YC8XG5jb25zdCBfdGVtcE92ZXJyaWRlcyA9IHt9O1xuXG4vLyDlsIbmn5DkuKrorr7nva7lgLzlupTnlKjliLDmiYDmnIkgd2lkZ2V0IOWunuS+i++8iOS4jeWGmSBzdG9yYWdl77yJXG5mdW5jdGlvbiBhcHBseVNldHRpbmdUb1dpZGdldHMoc2V0dGluZ0tleSwgdmFsdWUpIHtcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc2V0dGluZ3MsIHNldHRpbmdLZXkpKSByZXR1cm47XG4gIHNldHRpbmdzW3NldHRpbmdLZXldID0gdmFsdWU7XG4gIGRpc3RyaWJ1dGVTZXR0aW5ncygpO1xufVxuXG4vLyDlv6vmjbfplK7kuLTml7bliIfmjaLvvJrorrDlvZXljp/lp4vlgLwg4oaSIOWGmeWFpSB3aWRnZXRcbmZ1bmN0aW9uIHRlbXBUb2dnbGUoc2V0dGluZ0tleSwgbmV3VmFsdWUsIGN1cnJlbnRWYWx1ZSkge1xuICBpZiAoIShzZXR0aW5nS2V5IGluIF90ZW1wT3ZlcnJpZGVzKSkge1xuICAgIF90ZW1wT3ZlcnJpZGVzW3NldHRpbmdLZXldID0gY3VycmVudFZhbHVlO1xuICB9XG4gIGFwcGx5U2V0dGluZ1RvV2lkZ2V0cyhzZXR0aW5nS2V5LCBuZXdWYWx1ZSk7XG59XG5cbi8vIOmAgOWHuuWFqOWxj+aXtuaBouWkjeaJgOacieS4tOaXtuaUueWKqFxuZnVuY3Rpb24gcmVzdG9yZVRlbXBWYWx1ZXMoKSB7XG4gIGZvciAoY29uc3QgW2tleSwgb3JpZ2luYWxWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoX3RlbXBPdmVycmlkZXMpKSB7XG4gICAgYXBwbHlTZXR0aW5nVG9XaWRnZXRzKGtleSwgb3JpZ2luYWxWYWx1ZSk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gX3RlbXBPdmVycmlkZXMpIHtcbiAgICBkZWxldGUgX3RlbXBPdmVycmlkZXNba2V5XTtcbiAgfVxufVxuXG4vLyDmo4DmtYvpgIDlh7rlhajlsY/vvIjlkKsgRjEx77yJXG5mdW5jdGlvbiBjaGVja0Z1bGxzY3JlZW5FeGl0KCkge1xuICBjb25zdCBpc0ZzID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKSB8fCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcbiAgaWYgKCFpc0ZzKSB7XG4gICAgcmVzdG9yZVRlbXBWYWx1ZXMoKTtcbiAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2hlY2tGdWxsc2NyZWVuRXhpdCk7XG5cbi8vIOWFs+mXreaMiemSriDDlyDihpIg5Li05pe26ZqQ6JeP77yI5ZCM5b+r5o236ZSuIGhpZGUg6KGM5Li677yJXG5mdW5jdGlvbiBoYW5kbGVEaXNtaXNzKGUpIHtcbiAgY29uc3Qgc2V0dGluZ0tleSA9IGUuZGV0YWlsICYmIGUuZGV0YWlsLmRpc3BsYXlUeXBlID09PSAnd2luZG93LW92ZXJsYXknXG4gICAgPyAnc2hvd09uRnVsbHNjcmVlbidcbiAgICA6ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbic7XG4gIGNvbnN0IGN1cnJlbnRWYWwgPSBzZXR0aW5nc1tzZXR0aW5nS2V5XTtcbiAgaWYgKGN1cnJlbnRWYWwgPT09IGZhbHNlKSByZXR1cm47IC8vIOW3sue7j+makOiXj1xuICB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksIGZhbHNlLCBjdXJyZW50VmFsKTtcbiAgbG9nVG9wKGBbJHt0KCdtc2dEaXNtaXNzTGFiZWwnKX1dICR7c2V0dGluZ0tleX0gJHt0KCdtc2dEaXNtaXNzZWQnKX1gKTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnMtdGltZS1kaXNtaXNzJywgaGFuZGxlRGlzbWlzcyk7XG5cbmZ1bmN0aW9uIGlzVmlkZW9Db250ZW50RnVsbHNjcmVlbigpIHtcbiAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gIGlmICghZnNFbCkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIE5hdGl2ZSB2aWRlbyBmdWxsc2NyZWVuLlxuICBpZiAodHlwZW9mIEhUTUxWaWRlb0VsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmIGZzRWwgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBFbWJlZGRlZCBjb250ZW50IG93bnMgdGhlIGZ1bGxzY3JlZW4gdmlldzsgdGhlIGNoaWxkIGZyYW1lIGhhbmRsZXMgaXRzIG93blxuICAvLyB2aWRlbyBjbG9jaywgc28gdGhlIHRvcCBmcmFtZSBtdXN0IG5vdCBhbHNvIHJlbmRlciBvbmUuXG4gIGNvbnN0IGVtYmVkZGVkQ29uc3RydWN0b3JzID0gW1xuICAgIHR5cGVvZiBIVE1MSUZyYW1lRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBIVE1MSUZyYW1lRWxlbWVudCA6IG51bGwsXG4gICAgdHlwZW9mIEhUTUxGcmFtZUVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gSFRNTEZyYW1lRWxlbWVudCA6IG51bGwsXG4gICAgdHlwZW9mIEhUTUxFbWJlZEVsZW1lbnQgIT09ICd1bmRlZmluZWQnID8gSFRNTEVtYmVkRWxlbWVudCA6IG51bGwsXG4gICAgdHlwZW9mIEhUTUxPYmplY3RFbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/IEhUTUxPYmplY3RFbGVtZW50IDogbnVsbFxuICBdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGVtYmVkZGVkQ29uc3RydWN0b3JzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgQ29uc3RydWN0b3IgPSBlbWJlZGRlZENvbnN0cnVjdG9yc1tpXTtcbiAgICBpZiAoQ29uc3RydWN0b3IgJiYgZnNFbCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFBsYXllci1jb250YWluZXIgZnVsbHNjcmVlbiBjb250YWluaW5nIGEgdHJhY2tlZCB2aWRlby5cbiAgbGV0IGNvbnRhaW5zVHJhY2tlZFZpZGVvID0gZmFsc2U7XG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBpZiAoIWNvbnRhaW5zVHJhY2tlZFZpZGVvICYmIGZzRWwuY29udGFpbnModmlkZW8pKSB7XG4gICAgICBjb250YWluc1RyYWNrZWRWaWRlbyA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNvbnRhaW5zVHJhY2tlZFZpZGVvO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVLZXlkb3duKGUpIHtcbiAgLy8gUmVzZXJ2ZWQgYnJvd3NlciBrZXkgLyBrZXktcmVwZWF0IC8gSU1FIGNvbXBvc2l0aW9uLlxuICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnIHx8IGUucmVwZWF0IHx8IGUuaXNDb21wb3NpbmcpIHJldHVybjtcblxuICAvLyBOZXZlciBzdGVhbCBrZXlzIHdoaWxlIHRoZSB1c2VyIGlzIHR5cGluZy5cbiAgaWYgKGlzRWRpdGFibGVUYXJnZXQoZS50YXJnZXQpKSByZXR1cm47XG5cbiAgY29uc3QgaXNGcyA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCkgfHwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XG4gIGlmICghaXNGcykgcmV0dXJuO1xuXG4gIGNvbnN0IHByZXNzZWQgPSBidWlsZEtleVN0cmluZyhlKTtcbiAgaWYgKCFwcmVzc2VkKSByZXR1cm47XG5cbiAgLy8gU3luY2hyb25vdXMgY2FjaGUgY2hlY2s6IG5vIGFzeW5jIHN0b3JhZ2UgcmVhZCBpbiB0aGUga2V5ZG93biBwYXRoLlxuICBpZiAocHJlc3NlZCA9PT0gc2hvcnRjdXRLZXlzLmtleVRvZ2dsZUxheW91dCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vIOS7jumbhuS4reiuvue9ruivu+WPluW9k+WJjeW4g+WxgOaooeW8j++8iHN0b3JhZ2Ug5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxuICAgIGNvbnN0IGN1cnJlbnRNb2RlID0gc2V0dGluZ3MubGF5b3V0TW9kZTtcbiAgICBjb25zdCBuZXdNb2RlID0gY3VycmVudE1vZGUgPT09ICdmbG9hdCcgPyAnc25hcCcgOiAnZmxvYXQnO1xuICAgIHRlbXBUb2dnbGUoJ2xheW91dE1vZGUnLCBuZXdNb2RlLCBjdXJyZW50TW9kZSk7XG4gICAgbG9nVG9wKGBbJHt0KCdtc2dMYXlvdXRUb2dnbGUnKX1dICR7bmV3TW9kZSA9PT0gJ2Zsb2F0JyA/IHQoJ21zZ0Zsb2F0JykgOiB0KCdtc2dTbmFwJyl9YCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHByZXNzZWQgPT09IHNob3J0Y3V0S2V5cy5rZXlUb2dnbGVWaXNpYmlsaXR5KSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAvLyBWaWRlbyBjb250ZXh0IGlzIGJhc2VkIG9uIHRoZSBmdWxsc2NyZWVuIGVsZW1lbnQgaXRzZWxmLCBub3Qgb24gd2hldGhlclxuICAgIC8vIHRoZSB2aWRlbyBjbG9jayBpcyBjdXJyZW50bHkgdmlzaWJsZS4gVGhpcyBsZXRzIEYxMCByZXN0b3JlIGEgaGlkZGVuXG4gICAgLy8gdmlkZW8gb3ZlcmxheSBhbmQgcHJldmVudHMgaXQgZnJvbSB0dXJuaW5nIHRoZSB3aW5kb3cgb3ZlcmxheSBvbi5cbiAgICBjb25zdCBzZXR0aW5nS2V5ID0gaXNWaWRlb0NvbnRlbnRGdWxsc2NyZWVuKClcbiAgICAgID8gJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJ1xuICAgICAgOiAnc2hvd09uRnVsbHNjcmVlbic7XG5cbiAgICAvLyDku47pm4bkuK3orr7nva7or7vlj5blvZPliY3nirbmgIHvvIhzdG9yYWdlIOS7juacquiiqyBzaG9ydGN1dCDlhpnov4fvvIlcbiAgICBjb25zdCBjdXJyZW50VmFsID0gc2V0dGluZ3Nbc2V0dGluZ0tleV07XG4gICAgdGVtcFRvZ2dsZShzZXR0aW5nS2V5LCAhY3VycmVudFZhbCwgY3VycmVudFZhbCk7XG4gICAgbG9nVG9wKHQoIWN1cnJlbnRWYWwgPyAnbXNnVmlzaWJpbGl0eU9uJyA6ICdtc2dWaXNpYmlsaXR5T2ZmJykpO1xuICB9XG59XG5cbi8vIENhcHR1cmUgcGhhc2Ugc28gcGFnZSBoYW5kbGVycyBjYW5ub3Qgc3dhbGxvdyB0aGUgc2hvcnRjdXQgZmlyc3QuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93biwgdHJ1ZSk7XG5cbi8vIC0tLSB0ZWFyZG93biAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gdGVhcmRvd24oKSB7XG4gIGNsZWFySW50ZXJ2YWwodGlja2VyKTtcbiAgY2xlYXJQZW5kaW5nVGltZW91dHMoKTtcbiAgbWVkaWFPYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgRlVMTFNDUkVFTl9FVkVOVFMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZUZ1bGxzY3JlZW5DaGFuZ2UpO1xuICB9KTtcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZSk7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVJlc2l6ZSk7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja0Z1bGxzY3JlZW5FeGl0KTtcblxuICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIoaGFuZGxlU3RvcmFnZUNoYW5nZWQpO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93biwgdHJ1ZSk7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZzLXRpbWUtZGlzbWlzcycsIGhhbmRsZURpc21pc3MpO1xuXG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICBpZiAod2lkZ2V0KSB3aWRnZXQuZGVzdHJveSgpO1xuICAgIHZpZGVvV2lkZ2V0cy5kZWxldGUodmlkZW8pO1xuICB9KTtcbiAgdHJhY2tlZFZpZGVvcy5jbGVhcigpO1xuXG4gIGlmIChvdmVybGF5VGltZURpc3ApIHtcbiAgICBvdmVybGF5VGltZURpc3AuZGVzdHJveSgpO1xuICAgIG92ZXJsYXlUaW1lRGlzcCA9IG51bGw7XG4gIH1cbn1cblxuLy8gYmZjYWNoZTogcGFnZWhpZGUgZmlyZXMgd2hlbiBlbnRlcmluZyB0aGUgYmFjay9mb3J3YXJkIGNhY2hlIHRvbzsgb25seSB0ZWFyXG4vLyBkb3duIG9uIGEgcmVhbCB1bmxvYWQuXG5mdW5jdGlvbiBoYW5kbGVQYWdlSGlkZShldmVudCkge1xuICBpZiAoZXZlbnQucGVyc2lzdGVkKSByZXR1cm47XG4gIHRlYXJkb3duKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIGhhbmRsZVBhZ2VIaWRlKTtcbiJdLCJuYW1lcyI6WyJTVVBQT1JURURfTEFOR1MiLCJTVE9SQUdFX0tFWSIsIl9jdXJyZW50TGFuZyIsIl90cmFuc2xhdGlvbnMiLCJfaW5pdFByb21pc2UiLCJfbG9hZFRva2VuIiwidCIsImtleSIsIm1lc3NhZ2UiLCJjaHJvbWUiLCJpMThuIiwiZ2V0TWVzc2FnZSIsImUiLCJnZXRDdXJyZW50TGFuZyIsImluaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiaXRlbXMiLCJzdG9yZWQiLCJicm93c2VyTGFuZyIsIm5hdmlnYXRvciIsImxhbmd1YWdlIiwibWFwcGVkIiwicmVwbGFjZSIsImJlc3RMYW5nIiwiaW5jbHVkZXMiLCJsb2FkTGFuZyIsInRoZW4iLCJyZWxvYWRGcm9tU3RvcmFnZSIsImxhbmciLCJ0b2tlbiIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ1cmwiLCJydW50aW1lIiwiZ2V0VVJMIiwiY29uY2F0IiwiZmV0Y2giLCJyZXNwIiwib2siLCJFcnJvciIsImpzb24iLCJkYXRhIiwiREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVCIsIkRFRkFVTFRfS0VZX1RPR0dMRV9WSVNJQklMSVRZIiwiTU9ESUZJRVJfT05MWV9LRVlTIiwibm9ybWFsaXplS2V5TmFtZSIsImJ1aWxkS2V5U3RyaW5nIiwiZXZlbnQiLCJwYXJ0cyIsImN0cmxLZXkiLCJwdXNoIiwiYWx0S2V5Iiwic2hpZnRLZXkiLCJtZXRhS2V5Iiwiam9pbiIsImlzRWRpdGFibGVUYXJnZXQiLCJ0YXJnZXQiLCJfdHlwZW9mIiwidGFnTmFtZSIsInRvVXBwZXJDYXNlIiwiaXNDb250ZW50RWRpdGFibGUiLCJmb3JtYXRUaW1lIiwic2Vjb25kcyIsInZhbHVlIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJ0b3RhbCIsIk1hdGgiLCJmbG9vciIsIm1pbnMiLCJzZWNzIiwiU3RyaW5nIiwicGFkU3RhcnQiLCJjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4iLCJmc0VsIiwiZG9jdW1lbnQiLCJmdWxsc2NyZWVuRWxlbWVudCIsIndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IiwibW96RnVsbFNjcmVlbkVsZW1lbnQiLCJtc0Z1bGxzY3JlZW5FbGVtZW50IiwiVE9MRVJBTkNFIiwiYWJzIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJzY3JlZW4iLCJoZWlnaHQiLCJpbm5lcldpZHRoIiwid2lkdGgiLCJGVUxMU0NSRUVOX0VWRU5UUyIsImdldEZ1bGxzY3JlZW5FbGVtZW50IiwiaXNWaWRlb0VsZW1lbnQiLCJlbGVtZW50IiwiSFRNTFZpZGVvRWxlbWVudCIsIlBPUE9WRVJfU1VQUE9SVEVEIiwiSFRNTEVsZW1lbnQiLCJwcm90b3R5cGUiLCJzaG93UG9wb3ZlciIsImhpZGVQb3BvdmVyIiwiT1ZFUkxBWV9TVFlMRV9JRCIsIk9WRVJMQVlfU1RZTEVTIiwiaW5qZWN0T3ZlcmxheVN0eWxlcyIsImhlYWQiLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiY3JlYXRlRWxlbWVudCIsImlkIiwidGV4dENvbnRlbnQiLCJhcHBlbmRDaGlsZCIsIkRFRkFVTFRfU0VUVElOR1MiLCJzaG93V2hlblZpZGVvRnVsbHNjcmVlbiIsInNob3dPbkZ1bGxzY3JlZW4iLCJzaG93U2Vjb25kcyIsInNob3dQcm9ncmVzcyIsImF1dG9IaWRlIiwibGF5b3V0TW9kZSIsImZsb2F0UG9zaXRpb25WaWRlbyIsImZsb2F0UG9zaXRpb25XaW5kb3ciLCJoYXNPd24iLCJvYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJUaW1lRGlzcGxheSIsIm1lZGlhIiwiX2NsYXNzQ2FsbENoZWNrIiwidGltZUVsZW1lbnQiLCJjcmVhdGVUaW1lRWxlbWVudCIsIl90aW1lVGV4dFNwYW4iLCJfY2xvc2VCdG4iLCJhc3NpZ24iLCJhdXRvSGlkZVRpbWVyIiwiX2JvdW5kV2FrZUhhbmRsZXIiLCJfaXNEcmFnZ2luZyIsIl9hY3RpdmVQb2ludGVySWQiLCJfZHJhZ09mZnNldCIsIngiLCJ5IiwiX3Bvc2l0aW9uTW9kZSIsIl9wb3BvdmVyTW9kZSIsIl92aXNpYmxlIiwiX2ZvcmNlQ2xvc2VWaXNpYmxlIiwiX3BvcG92ZXJSZXRyeVRpbWVyIiwiX3BvcG92ZXJSZXRyeUNvdW50IiwidmlkZW9PdmVybGF5QWN0aXZlIiwiX2Rpc21pc3NIaW50RWxlbWVudCIsIl9kaXNtaXNzSGludFRpbWVyIiwiX2JvdW5kRGlzbWlzc0hpbnRGdWxsc2NyZWVuRXhpdCIsIl9ib3VuZFBvaW50ZXJEb3duIiwiX2JvdW5kUG9pbnRlck1vdmUiLCJfYm91bmRQb2ludGVyVXAiLCJfYm91bmRQb2ludGVyQ2FuY2VsIiwiX2NyZWF0ZUNsYXNzIiwiYXBwbHlTZXR0aW5ncyIsInNldHRpbmdzIiwiX3JlZnJlc2hDbG9zZUJ1dHRvbkxhYmVsIiwibGFiZWwiLCJ0aXRsZSIsInNldEF0dHJpYnV0ZSIsImRpc3BsYXlUeXBlIiwiaXNTaG93aW5nIiwiX2Zsb2F0U3RvcmFnZUtleSIsIl9nZXRGbG9hdFBvc2l0aW9uIiwiX3NldEZsb2F0UG9zaXRpb24iLCJwb3NpdGlvbiIsInNldCIsIl9kZWZpbmVQcm9wZXJ0eSIsImNsYXNzTmFtZSIsInpJbmRleCIsInBvaW50ZXJFdmVudHMiLCJkaXNwbGF5IiwidGV4dFNwYW4iLCJjbG9zZUJ0biIsIl9jcmVhdGVDbG9zZUJ1dHRvbiIsIl90aGlzIiwiYnRuIiwidHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJzdG9wUHJvcGFnYXRpb24iLCJoYW5kbGVEaXNtaXNzIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiX3Nob3dEaXNtaXNzSGludCIsIl90aGlzMiIsIl9oaWRlRGlzbWlzc0hpbnQiLCJib2R5IiwiaGludCIsInJlbW92ZUF0dHJpYnV0ZSIsImZvckVhY2giLCJldmVudE5hbWUiLCJzZXRUaW1lb3V0IiwiX3RoaXMzIiwiY2xlYXJUaW1lb3V0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhhc0F0dHJpYnV0ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImNoZWNrSXNUb1Nob3ciLCJjb250YWlucyIsInVwZGF0ZVZpc2liaWxpdHkiLCJzaG93IiwiaGlkZSIsIl9yZXNldENsb3NlQnV0dG9uIiwiY2xhc3NMaXN0IiwidG9nZ2xlIiwiX2dldERvbVBhcmVudCIsIm5hdGl2ZVZpZGVvRnVsbHNjcmVlbiIsInVzZVBvcG92ZXIiLCJvcGFjaXR5IiwicmVtb3ZlIiwiX2FwcGx5UG9pbnRlck1vZGUiLCJfc2hvd1BvcG92ZXIiLCJfaGFuZGxlUG9wb3ZlckZhaWx1cmUiLCJfY2xlYXJQb3BvdmVyUmV0cnkiLCJfcG9zaXRpb25FbGVtZW50IiwiX3RlYXJkb3duUG9wb3ZlciIsInBhcmVudCIsInVwZGF0ZVRpbWUiLCJzZXR1cERyYWdnaW5nIiwidGVhcmRvd25EcmFnZ2luZyIsInN0YXJ0QXV0b0hpZGUiLCJjbGVhckF1dG9IaWRlVGltZXIiLCJ0ZWFyZG93bldha2VMaXN0ZW5lciIsIl9yZXN0b3JlUG9pbnRlckV2ZW50cyIsIl9jbGVhbnVwRm9ySGlkZSIsIl9jbGVhclBvcG92ZXJSZXRyeVRpbWVyIiwiY2FuUmV0cnkiLCJfc2NoZWR1bGVQb3BvdmVyUmV0cnkiLCJfdGhpczQiLCJtYXJnaW4iLCJyaWdodCIsImJvdHRvbSIsInRyYW5zZm9ybSIsInNhdmVkIiwiX2FwcGx5RmxvYXRQb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJfY2xhbXBQb3NpdGlvbiIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiaW5zZXQiLCJjYW5JbnNldFgiLCJjYW5JbnNldFkiLCJtaW5YIiwibWluWSIsIm1heFgiLCJtYXgiLCJtYXhZIiwicmF3WCIsInJhd1kiLCJyb3VuZCIsIm1pbiIsImNsYW1wZWQiLCJoYW5kbGVSZXNpemUiLCJfaGlkZVBvcG92ZXIiLCJfdGhpczUiLCJjdXJzb3IiLCJ1c2VyU2VsZWN0IiwidG91Y2hBY3Rpb24iLCJfb25EcmFnU3RhcnQiLCJfb25EcmFnTW92ZSIsIl9vbkRyYWdFbmQiLCJwb2ludGVyVHlwZSIsImJ1dHRvbiIsInBvaW50ZXJJZCIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsInNldFBvaW50ZXJDYXB0dXJlIiwiZXJyIiwiX3dha2UiLCJwcmV2ZW50RGVmYXVsdCIsImhhc1BvaW50ZXJDYXB0dXJlIiwicmVsZWFzZVBvaW50ZXJDYXB0dXJlIiwiX3RoaXM2IiwiX3NldHVwV2FrZUxpc3RlbmVyIiwiZmFkZU91dCIsIl90aGlzNyIsInBhc3NpdmUiLCJfdGhpczgiLCJhZGQiLCJfc3lzdGVtVGltZSIsIm5vdyIsIkRhdGUiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwic3lzdGVtVGltZSIsImN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJkZXN0cm95IiwiV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IiwiX1RpbWVEaXNwbGF5IiwiX2NhbGxTdXBlciIsImFyZ3VtZW50cyIsIl9pbmhlcml0cyIsIklTX1RPUF9GUkFNRSIsIk1BWF9TQ0FOX1JFVFJJRVMiLCJkaXN0cmlidXRlU2V0dGluZ3MiLCJsb2dUb3AiLCJfY29uc29sZSIsImNvbnNvbGUiLCJsb2ciLCJhcHBseSIsInNob3J0Y3V0S2V5cyIsImtleVRvZ2dsZUxheW91dCIsImtleVRvZ2dsZVZpc2liaWxpdHkiLCJub3JtYWxpemVTdG9yZWRTaG9ydGN1dCIsImVuZHNXaXRoIiwic2xpY2UiLCJyZWFkU3RvcmVkU2hvcnRjdXQiLCJmYWxsYmFjayIsIlNFVFRJTkdfS0VZUyIsInZpZGVvV2lkZ2V0cyIsIldlYWtNYXAiLCJ0cmFja2VkVmlkZW9zIiwiU2V0Iiwib3ZlcmxheVRpbWVEaXNwIiwiZG9jdW1lbnRFbGVtZW50IiwicGVuZGluZ1RpbWVvdXRzIiwic2NoZWR1bGVUaW1lb3V0IiwiY2FsbGJhY2siLCJkZWxheSIsImNsZWFyUGVuZGluZ1RpbWVvdXRzIiwiY2xlYXIiLCJ2aWRlbyIsIndpZGdldCIsInVwZGF0ZUFsbFZpc2liaWxpdHkiLCJsb2FkU2V0dGluZ3MiLCJmbG9hdFBvc2l0aW9uIiwibGVnYWN5Iiwibm9ybWFsaXplZExheW91dCIsIm5vcm1hbGl6ZWRWaXNpYmlsaXR5Iiwic2hvcnRjdXRVcGRhdGVzIiwibWlncmF0ZWQiLCJ1bmRlZmluZWQiLCJoYW5kbGVTdG9yYWdlQ2hhbmdlZCIsImNoYW5nZXMiLCJuYW1lc3BhY2UiLCJjaGFuZ2VkIiwibmV3VmFsdWUiLCJsYW5ndWFnZUNoYW5nZWQiLCJvbkNoYW5nZWQiLCJhZGRMaXN0ZW5lciIsImJpbmRWaWRlbyIsImhhcyIsImRlc3Ryb3lWaWRlbyIsInNjYW5Gb3JNZWRpYSIsInJvb3QiLCJ2aWRlb3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm91bmQiLCJzY2FuUmV0cmllcyIsImluaXRpYWxTY2FuIiwibWVkaWFPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJzYXdSZW1vdmFsIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwibm9kZSIsIm5vZGVUeXBlIiwicmVtb3ZlZE5vZGVzIiwiY2xlYW51cFJlbW92ZWRWaWRlb3MiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImlzQ29ubmVjdGVkIiwidGlja2VyIiwic2V0SW50ZXJ2YWwiLCJ3aW5uZXJXaWRnZXQiLCJjYW5kaWRhdGVzIiwid2lubmVyIiwiZmluZCIsImMiLCJwYXVzZWQiLCJlbmRlZCIsImlzVmlkZW9Db250ZW50RnVsbHNjcmVlbiIsImhhbmRsZUZ1bGxzY3JlZW5DaGFuZ2UiLCJyZXN0b3JlVGVtcFZhbHVlcyIsIl90ZW1wT3ZlcnJpZGVzIiwiYXBwbHlTZXR0aW5nVG9XaWRnZXRzIiwic2V0dGluZ0tleSIsInRlbXBUb2dnbGUiLCJjdXJyZW50VmFsdWUiLCJfaSIsIl9PYmplY3QkZW50cmllcyIsImVudHJpZXMiLCJfT2JqZWN0JGVudHJpZXMkX2kiLCJfc2xpY2VkVG9BcnJheSIsIm9yaWdpbmFsVmFsdWUiLCJjaGVja0Z1bGxzY3JlZW5FeGl0IiwiaXNGcyIsImN1cnJlbnRWYWwiLCJlbWJlZGRlZENvbnN0cnVjdG9ycyIsIkhUTUxJRnJhbWVFbGVtZW50IiwiSFRNTEZyYW1lRWxlbWVudCIsIkhUTUxFbWJlZEVsZW1lbnQiLCJIVE1MT2JqZWN0RWxlbWVudCIsImkiLCJDb25zdHJ1Y3RvciIsImNvbnRhaW5zVHJhY2tlZFZpZGVvIiwiaGFuZGxlS2V5ZG93biIsInJlcGVhdCIsImlzQ29tcG9zaW5nIiwicHJlc3NlZCIsImN1cnJlbnRNb2RlIiwibmV3TW9kZSIsInRlYXJkb3duIiwiY2xlYXJJbnRlcnZhbCIsImRpc2Nvbm5lY3QiLCJyZW1vdmVMaXN0ZW5lciIsImhhbmRsZVBhZ2VIaWRlIiwicGVyc2lzdGVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=