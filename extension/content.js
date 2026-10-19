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
        resolve(false);
      }
    });
  });
}

/**
 * Load translations for a given language from _locales/{lang}/messages.json.
 */
function loadLang(lang) {
  if (lang === _currentLang && Object.keys(_translations).length > 0) {
    return Promise.resolve();
  }
  var url = chrome.runtime.getURL("_locales/".concat(lang, "/messages.json"));
  return fetch(url).then(function (resp) {
    if (!resp.ok) throw new Error("Failed to load ".concat(url));
    return resp.json();
  }).then(function (data) {
    _translations = data;
    _currentLang = lang;
  })["catch"](function () {
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

      // Re-translate the close button title when settings/language are re-applied.
      if (this._closeBtn) {
        this._closeBtn.title = (0,_i18n__WEBPACK_IMPORTED_MODULE_1__.t)('closeBtnTitle');
      }
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
      var _this = this;
      var timeElement = document.createElement('div');
      timeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      timeElement.style.color = 'white';
      timeElement.style.padding = '5px';
      timeElement.style.borderRadius = '5px';
      timeElement.style.zIndex = '999999';
      timeElement.style.transition = 'opacity 0.3s ease';
      timeElement.style.pointerEvents = 'auto';
      timeElement.style.display = 'none';
      timeElement.style.boxSizing = 'border-box';

      // 独立文字容器（与 × 按钮并列，避免 updateTime 误删按钮）
      var textSpan = document.createElement('span');
      textSpan.textContent = '00:00 / 00:00';
      this._timeTextSpan = textSpan;
      timeElement.appendChild(textSpan);
      var closeBtn = this._createCloseButton();
      this._closeBtn = closeBtn;

      // 使用 mouseover/mouseout + relatedTarget 处理 hover，避免绝对定位子元素导致的事件问题
      timeElement.addEventListener('mouseenter', function () {
        closeBtn.style.display = 'block';
      });
      timeElement.addEventListener('mouseleave', function () {
        // 当鼠标离开 timeElement 且未进入 closeBtn 时才隐藏
        // 延迟让 mouseenter closeBtn 有机会触发
        setTimeout(function () {
          if (_this._forceCloseVisible) return;
          if (closeBtn.style.display !== 'none' && !closeBtn.matches(':hover')) {
            closeBtn.style.display = 'none';
          }
        }, 50);
      });
      closeBtn.addEventListener('mouseleave', function () {
        if (!_this._forceCloseVisible) closeBtn.style.display = 'none';
      });
      timeElement.appendChild(closeBtn);
      return timeElement;
    }

    // 创建右上角关闭按钮 ×（位于 timeElement 内部右上角）
  }, {
    key: "_createCloseButton",
    value: function _createCloseButton() {
      var _this2 = this;
      var btn = document.createElement('span');
      btn.textContent = '×';
      btn.title = (0,_i18n__WEBPACK_IMPORTED_MODULE_1__.t)('closeBtnTitle');
      Object.assign(btn.style, {
        position: 'absolute',
        top: '1px',
        right: '1px',
        width: '18px',
        height: '18px',
        lineHeight: '18px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'none',
        zIndex: '1000000',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        userSelect: 'none',
        pointerEvents: 'auto'
      });
      btn.addEventListener('pointerdown', function (e) {
        return e.stopPropagation();
      }); // 阻止拖拽
      btn.addEventListener('mousedown', function (e) {
        return e.stopPropagation();
      });
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        _this2.handleDismiss();
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
      this._closeBtn.style.display = this._forceCloseVisible ? 'block' : 'none';
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
        if (this._closeBtn) this._closeBtn.style.pointerEvents = 'auto';
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
      var _this3 = this;
      if (this._popoverRetryCount >= 3) return;
      this._popoverRetryCount += 1;
      this._clearPopoverRetryTimer();
      this._popoverRetryTimer = setTimeout(function () {
        _this3._popoverRetryTimer = null;
        if (!isVideoElement(getFullscreenElement())) {
          _this3._popoverRetryCount = 0;
          return;
        }
        if (!_this3.checkIsToShow()) {
          _this3._popoverRetryCount = 0;
          return;
        }
        _this3.updateVisibility();
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
      style.border = 'none';
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
      var maxX = Math.max(0, window.innerWidth - width);
      var maxY = Math.max(0, window.innerHeight - height);
      var rawX = Number(position && position.x);
      var rawY = Number(position && position.y);
      return {
        x: Math.round(Math.min(Math.max(0, Number.isFinite(rawX) ? rawX : 0), maxX)),
        y: Math.round(Math.min(Math.max(0, Number.isFinite(rawY) ? rawY : 0), maxY))
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
      if (this._closeBtn) {
        this._closeBtn.style.pointerEvents = 'auto';
        this._resetCloseButton();
      }
    }
  }, {
    key: "_restorePointerEvents",
    value: function _restorePointerEvents() {
      if (!this.timeElement) return;
      this.timeElement.style.pointerEvents = this._popoverMode ? 'none' : 'auto';
      if (this._closeBtn) {
        this._closeBtn.style.pointerEvents = 'auto';
      }
    }
  }, {
    key: "setupDragging",
    value: function setupDragging() {
      var _this4 = this;
      this.teardownDragging();
      if (!this.timeElement) return;
      // Popover containers are pointer-events:none; no drag there.
      if (this._popoverMode) return;
      this._isDragging = false;
      this.timeElement.style.cursor = 'move';
      this.timeElement.style.userSelect = 'none';
      this.timeElement.style.touchAction = 'none';
      this._boundPointerDown = function (e) {
        return _this4._onDragStart(e);
      };
      this._boundPointerMove = function (e) {
        return _this4._onDragMove(e);
      };
      this._boundPointerUp = function (e) {
        return _this4._onDragEnd(e);
      };
      this._boundPointerCancel = function (e) {
        return _this4._onDragEnd(e);
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
      var _this5 = this;
      if (!this.timeElement) return;
      this.timeElement.style.opacity = '1';
      this._restorePointerEvents();
      this.clearAutoHideTimer();
      this._setupWakeListener();
      this.autoHideTimer = setTimeout(function () {
        return _this5.fadeOut();
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
      var _this6 = this;
      this.teardownWakeListener();
      this._boundWakeHandler = function () {
        return _this6._wake();
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
      var _this7 = this;
      if (!this.autoHide || !this._visible || !this.timeElement) return;
      this.timeElement.style.opacity = '1';
      this._restorePointerEvents();
      this.clearAutoHideTimer();
      this.autoHideTimer = setTimeout(function () {
        return _this7.fadeOut();
      }, 3000);
    }
  }, {
    key: "fadeOut",
    value: function fadeOut() {
      if (!this.timeElement) return;
      this.timeElement.style.opacity = '0';
      this.timeElement.style.pointerEvents = 'none';
      if (this._closeBtn) this._closeBtn.style.pointerEvents = 'none';
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

      // 元素全屏（视频全屏）时：如果视频专用显示已开启，不再重复显示
      if (fsEl !== null) {
        return !this.showWhenVideoFullscreen;
      }

      // 浏览器全屏（F11）时显示
      return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
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
(0,_i18n__WEBPACK_IMPORTED_MODULE_2__.init)();
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
    var winnerWidget = winner ? winner.widget : null;
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
  if (overlayTimeDisp) overlayTimeDisp.updateVisibility();
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
    var inVideoFs = !!(0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)();
    var settingKey = inVideoFs ? 'showWhenVideoFullscreen' : 'showOnFullscreen';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d0ksbUJBQW1CLENBQUM7RUFFekR4WCxNQUFNLENBQUNRLE9BQU8sQ0FBQytULFNBQVMsQ0FBQzhELGNBQWMsQ0FBQ3BFLG9CQUFvQixDQUFDO0VBQzdEM1AsUUFBUSxDQUFDMEssbUJBQW1CLENBQUMsU0FBUyxFQUFFMkksYUFBYSxFQUFFLElBQUksQ0FBQztFQUM1RHJULFFBQVEsQ0FBQzBLLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFakUsYUFBYSxDQUFDO0VBRTlEd0gsYUFBYSxDQUFDVyxPQUFPLENBQUMsVUFBQ0csS0FBSyxFQUFLO0lBQy9CLElBQU1DLE1BQU0sR0FBR2pCLFlBQVksQ0FBQzNSLEdBQUcsQ0FBQzJTLEtBQUssQ0FBQztJQUN0QyxJQUFJQyxNQUFNLEVBQUVBLE1BQU0sQ0FBQ3ZDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCc0IsWUFBWSxVQUFPLENBQUNnQixLQUFLLENBQUM7RUFDNUIsQ0FBQyxDQUFDO0VBQ0ZkLGFBQWEsQ0FBQ1ksS0FBSyxDQUFDLENBQUM7RUFFckIsSUFBSVYsZUFBZSxFQUFFO0lBQ25CQSxlQUFlLENBQUMxQixPQUFPLENBQUMsQ0FBQztJQUN6QjBCLGVBQWUsR0FBRyxJQUFJO0VBQ3hCO0FBQ0Y7O0FBRUE7QUFDQTtBQUNBLFNBQVM2RixjQUFjQSxDQUFDNVYsS0FBSyxFQUFFO0VBQzdCLElBQUlBLEtBQUssQ0FBQzZWLFNBQVMsRUFBRTtFQUNyQkwsUUFBUSxDQUFDLENBQUM7QUFDWjtBQUVBclQsTUFBTSxDQUFDbUYsZ0JBQWdCLENBQUMsVUFBVSxFQUFFc08sY0FBYyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvLi9zcmMvaTE4bi5qcyIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvLi9zcmMvc2hvcnRjdXRLZXlzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvLi9zcmMvd2lkZ2V0cy5qcyIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDdXN0b20gaTE4biBtb2R1bGUgZm9yIGNvbnRlbnQgc2NyaXB0ICh3ZWJwYWNrLWJ1bmRsZWQpLlxuICogTG9hZHMgdHJhbnNsYXRpb25zIGZyb20gX2xvY2FsZXMve2xhbmd9L21lc3NhZ2VzLmpzb24gYXQgcnVudGltZS5cbiAqL1xuXG5jb25zdCBTVVBQT1JURURfTEFOR1MgPSBbJ2VuJywgJ3poX0NOJ107XG5jb25zdCBTVE9SQUdFX0tFWSA9ICdsYW5ndWFnZSc7XG5cbmxldCBfY3VycmVudExhbmcgPSBudWxsO1xubGV0IF90cmFuc2xhdGlvbnMgPSB7fTtcbmxldCBfaW5pdFByb21pc2UgPSBudWxsO1xuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIG1lc3NhZ2Uga2V5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdChrZXkpIHtcbiAgaWYgKF90cmFuc2xhdGlvbnNba2V5XSAmJiBfdHJhbnNsYXRpb25zW2tleV0ubWVzc2FnZSkge1xuICAgIHJldHVybiBfdHJhbnNsYXRpb25zW2tleV0ubWVzc2FnZTtcbiAgfVxuICAvLyBGYWxsYmFjayB0byBDaHJvbWUgaTE4blxuICB0cnkge1xuICAgIHJldHVybiBjaHJvbWUuaTE4bi5nZXRNZXNzYWdlKGtleSkgfHwga2V5O1xuICB9IGNhdGNoKGUpIHtcbiAgICByZXR1cm4ga2V5O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50TGFuZygpIHtcbiAgcmV0dXJuIF9jdXJyZW50TGFuZztcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGkxOG46IHJlYWQgc3RvcmVkIGxhbmd1YWdlLCBsb2FkIHRyYW5zbGF0aW9ucy5cbiAqIENhbiBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMgc2FmZWx5IOKAlCByZXR1cm5zIHNhbWUgcHJvbWlzZSBvbiBzdWJzZXF1ZW50IGNhbGxzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgaWYgKF9pbml0UHJvbWlzZSkgcmV0dXJuIF9pbml0UHJvbWlzZTtcbiAgX2luaXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChTVE9SQUdFX0tFWSwgKGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCBzdG9yZWQgPSBpdGVtc1tTVE9SQUdFX0tFWV07XG4gICAgICBjb25zdCBicm93c2VyTGFuZyA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nO1xuICAgICAgY29uc3QgbWFwcGVkID0gYnJvd3NlckxhbmcucmVwbGFjZSgnLScsICdfJyk7XG4gICAgICBjb25zdCBiZXN0TGFuZyA9IHN0b3JlZCB8fCAoU1VQUE9SVEVEX0xBTkdTLmluY2x1ZGVzKG1hcHBlZCkgPyBtYXBwZWQgOiAnZW4nKTtcbiAgICAgIGxvYWRMYW5nKGJlc3RMYW5nKS50aGVuKCgpID0+IHJlc29sdmUoKSk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gX2luaXRQcm9taXNlO1xufVxuXG4vKipcbiAqIFJlbG9hZCB0cmFuc2xhdGlvbnMgZm9yIGEgZGlmZmVyZW50IGxhbmd1YWdlIChjYWxsZWQgd2hlbiBzdG9yYWdlIGNoYW5nZXMpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVsb2FkRnJvbVN0b3JhZ2UoKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNUT1JBR0VfS0VZLCAoaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IGxhbmcgPSBpdGVtc1tTVE9SQUdFX0tFWV0gfHwgX2N1cnJlbnRMYW5nIHx8ICdlbic7XG4gICAgICBpZiAobGFuZyAhPT0gX2N1cnJlbnRMYW5nKSB7XG4gICAgICAgIGxvYWRMYW5nKGxhbmcpLnRoZW4oKCkgPT4gcmVzb2x2ZSh0cnVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogTG9hZCB0cmFuc2xhdGlvbnMgZm9yIGEgZ2l2ZW4gbGFuZ3VhZ2UgZnJvbSBfbG9jYWxlcy97bGFuZ30vbWVzc2FnZXMuanNvbi5cbiAqL1xuZnVuY3Rpb24gbG9hZExhbmcobGFuZykge1xuICBpZiAobGFuZyA9PT0gX2N1cnJlbnRMYW5nICYmIE9iamVjdC5rZXlzKF90cmFuc2xhdGlvbnMpLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cbiAgY29uc3QgdXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKGBfbG9jYWxlcy8ke2xhbmd9L21lc3NhZ2VzLmpzb25gKTtcbiAgcmV0dXJuIGZldGNoKHVybClcbiAgICAudGhlbihyZXNwID0+IHtcbiAgICAgIGlmICghcmVzcC5vaykgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCAke3VybH1gKTtcbiAgICAgIHJldHVybiByZXNwLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgX3RyYW5zbGF0aW9ucyA9IGRhdGE7XG4gICAgICBfY3VycmVudExhbmcgPSBsYW5nO1xuICAgIH0pXG4gICAgLmNhdGNoKCgpID0+IHtcbiAgICAgIGlmIChsYW5nICE9PSAnZW4nKSByZXR1cm4gbG9hZExhbmcoJ2VuJyk7XG4gICAgICBfdHJhbnNsYXRpb25zID0ge307XG4gICAgICBfY3VycmVudExhbmcgPSAnZW4nO1xuICAgIH0pO1xufVxuIiwiLyoqXG4gKiBDYW5vbmljYWwgc2hvcnRjdXQta2V5IGhhbmRsaW5nIHNoYXJlZCBieSB0aGUgY29udGVudCBzY3JpcHQuXG4gKlxuICogU3RvcmFnZSBmb3JtYXQgKG11c3QgbWF0Y2ggdGhlIHNldHRpbmdzIHJlY29yZGVyKTpcbiAqICAgUGFydHMgaW4gb3JkZXI6IEN0cmwsIEFsdCwgU2hpZnQsIE1ldGEsIHRoZW4gdGhlIG5vcm1hbGl6ZWQga2V5LlxuICogICBKb2luZWQgd2l0aCBcIitcIi4gRXhhbXBsZTogXCJDdHJsK1NoaWZ0K0Fycm93VXBcIi5cbiAqL1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVCA9ICdGOSc7XG5leHBvcnQgY29uc3QgREVGQVVMVF9LRVlfVE9HR0xFX1ZJU0lCSUxJVFkgPSAnRjEwJztcblxuY29uc3QgTU9ESUZJRVJfT05MWV9LRVlTID0gW1xuICAnQ29udHJvbCcsXG4gICdBbHQnLFxuICAnU2hpZnQnLFxuICAnTWV0YScsXG4gICdBbHRHcmFwaCcsXG4gICdPUydcbl07XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUtleU5hbWUoa2V5KSB7XG4gIGlmIChrZXkgPT09ICcgJykgcmV0dXJuICdTcGFjZSc7XG4gIHJldHVybiBrZXk7XG59XG5cbi8qKlxuICogQnVpbGQgdGhlIGNhbm9uaWNhbCBrZXkgc3RyaW5nIGZvciBhIEtleWJvYXJkRXZlbnQuXG4gKiBSZXR1cm5zIG51bGwgZm9yIG1vZGlmaWVyLW9ubHkgcHJlc3NlcyBhbmQgcmVzZXJ2ZWQga2V5cyAoRXNjYXBlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkS2V5U3RyaW5nKGV2ZW50KSB7XG4gIGlmICghZXZlbnQgfHwgTU9ESUZJRVJfT05MWV9LRVlTLmluY2x1ZGVzKGV2ZW50LmtleSkpIHJldHVybiBudWxsO1xuICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgcGFydHMgPSBbXTtcbiAgaWYgKGV2ZW50LmN0cmxLZXkpIHBhcnRzLnB1c2goJ0N0cmwnKTtcbiAgaWYgKGV2ZW50LmFsdEtleSkgcGFydHMucHVzaCgnQWx0Jyk7XG4gIGlmIChldmVudC5zaGlmdEtleSkgcGFydHMucHVzaCgnU2hpZnQnKTtcbiAgaWYgKGV2ZW50Lm1ldGFLZXkpIHBhcnRzLnB1c2goJ01ldGEnKTtcbiAgcGFydHMucHVzaChub3JtYWxpemVLZXlOYW1lKGV2ZW50LmtleSkpO1xuICByZXR1cm4gcGFydHMuam9pbignKycpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSB3aGVuIGtleWJvYXJkIHNob3J0Y3V0cyBtdXN0IG5vdCBmaXJlIGJlY2F1c2UgdGhlIHVzZXIgaXNcbiAqIHR5cGluZyBpbnRvIGEgZm9ybSBjb250cm9sIG9yIGVkaXRhYmxlIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VkaXRhYmxlVGFyZ2V0KHRhcmdldCkge1xuICBpZiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gIGNvbnN0IHRhZ05hbWUgPSB0eXBlb2YgdGFyZ2V0LnRhZ05hbWUgPT09ICdzdHJpbmcnXG4gICAgPyB0YXJnZXQudGFnTmFtZS50b1VwcGVyQ2FzZSgpXG4gICAgOiAnJztcblxuICBpZiAodGFnTmFtZSA9PT0gJ0lOUFVUJyB8fCB0YWdOYW1lID09PSAnVEVYVEFSRUEnIHx8IHRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0LmlzQ29udGVudEVkaXRhYmxlID09PSB0cnVlO1xufVxuIiwiLy8gZm9ybWF0IHRpbWUgaW4gc2Vjb25kcyB0byBtbTpzc1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xuICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKHNlY29uZHMpO1xuICAgIC8vIExpdmUgc3RyZWFtcyAvIG5vdC15ZXQtbG9hZGVkIG1lZGlhIHJlcG9ydCBJbmZpbml0eSBvciBOYU4g4oCUIG5ldmVyIHJlbmRlclxuICAgIC8vIFwiSW5maW5pdHk6TmFOXCIuIFVzZSBhIHBsYWNlaG9sZGVyIGluc3RlYWQuXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodmFsdWUpIHx8IHZhbHVlIDwgMCkgcmV0dXJuICctLTotLSc7XG4gICAgY29uc3QgdG90YWwgPSBNYXRoLmZsb29yKHZhbHVlKTtcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcih0b3RhbCAvIDYwKTtcbiAgICBjb25zdCBzZWNzID0gdG90YWwgJSA2MDtcbiAgICByZXR1cm4gYCR7U3RyaW5nKG1pbnMpLnBhZFN0YXJ0KDIsICcwJyl9OiR7U3RyaW5nKHNlY3MpLnBhZFN0YXJ0KDIsICcwJyl9YDtcbn1cblxuLy8gY2hlY2sgaWYgZnVsbHNjcmVlbiBmb3IgYnJvd3NlciAoRjExIC8gYnJvd3Nlci1sZXZlbCBmdWxsc2NyZWVuKVxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpIHtcbiAgICAvLyBFbGVtZW50L25hdGl2ZSBmdWxsc2NyZWVuIGlzIGhhbmRsZWQgc2VwYXJhdGVseTsgZG9uJ3QgcmVwb3J0IGJyb3dzZXJcbiAgICAvLyBmdWxsc2NyZWVuIHdoaWxlIGFuIGVsZW1lbnQgaXMgZnVsbHNjcmVlbi5cbiAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcbiAgICBpZiAoZnNFbCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gU21hbGwgdG9sZXJhbmNlIGF2b2lkcyB6b29tL0RQSS90YXNrYmFyIHJvdW5kaW5nIGZhbHNlIG5lZ2F0aXZlcy5cbiAgICBjb25zdCBUT0xFUkFOQ0UgPSAyO1xuICAgIHJldHVybiBNYXRoLmFicyh3aW5kb3cuaW5uZXJIZWlnaHQgLSBzY3JlZW4uaGVpZ2h0KSA8PSBUT0xFUkFOQ0UgJiZcbiAgICAgICAgICAgTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSBzY3JlZW4ud2lkdGgpIDw9IFRPTEVSQU5DRTtcbn1cbiIsImltcG9ydCB7IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiwgZm9ybWF0VGltZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgdCB9IGZyb20gJy4vaTE4bic7XG5cbmV4cG9ydCBjb25zdCBGVUxMU0NSRUVOX0VWRU5UUyA9IFtcbiAgJ2Z1bGxzY3JlZW5jaGFuZ2UnLFxuICAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXG4gICdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcbiAgJ01TRnVsbHNjcmVlbkNoYW5nZSdcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGdWxsc2NyZWVuRWxlbWVudCgpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XG4gICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVmlkZW9FbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuICEhZWxlbWVudCAmJlxuICAgIHR5cGVvZiBIVE1MVmlkZW9FbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50O1xufVxuXG5jb25zdCBQT1BPVkVSX1NVUFBPUlRFRCA9IHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdHlwZW9mIEhUTUxFbGVtZW50LnByb3RvdHlwZS5zaG93UG9wb3ZlciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICB0eXBlb2YgSFRNTEVsZW1lbnQucHJvdG90eXBlLmhpZGVQb3BvdmVyID09PSAnZnVuY3Rpb24nO1xuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTID0ge1xuICBzaG93V2hlblZpZGVvRnVsbHNjcmVlbjogdHJ1ZSxcbiAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcbiAgc2hvd1NlY29uZHM6IHRydWUsXG4gIHNob3dQcm9ncmVzczogdHJ1ZSxcbiAgYXV0b0hpZGU6IGZhbHNlLFxuICBsYXlvdXRNb2RlOiAnc25hcCcsXG4gIGZsb2F0UG9zaXRpb25WaWRlbzogbnVsbCxcbiAgZmxvYXRQb3NpdGlvbldpbmRvdzogbnVsbFxufTtcblxuZnVuY3Rpb24gaGFzT3duKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZURpc3BsYXkge1xuICBjb25zdHJ1Y3RvcihtZWRpYSkge1xuICAgIHRoaXMubWVkaWEgPSBtZWRpYTtcbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gdGhpcy5jcmVhdGVUaW1lRWxlbWVudCgpO1xuICAgIHRoaXMuX3RpbWVUZXh0U3BhbiA9IHRoaXMuX3RpbWVUZXh0U3BhbiB8fCBudWxsO1xuICAgIHRoaXMuX2Nsb3NlQnRuID0gdGhpcy5fY2xvc2VCdG4gfHwgbnVsbDtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgREVGQVVMVF9TRVRUSU5HUyk7XG5cbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBudWxsO1xuICAgIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIgPSBudWxsO1xuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9hY3RpdmVQb2ludGVySWQgPSBudWxsO1xuICAgIHRoaXMuX2RyYWdPZmZzZXQgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICB0aGlzLl9wb3NpdGlvbk1vZGUgPSAnZml4ZWQnO1xuICAgIHRoaXMuX3BvcG92ZXJNb2RlID0gZmFsc2U7XG4gICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2ZvcmNlQ2xvc2VWaXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl9wb3BvdmVyUmV0cnlUaW1lciA9IG51bGw7XG4gICAgdGhpcy5fcG9wb3ZlclJldHJ5Q291bnQgPSAwO1xuXG4gICAgdGhpcy5fYm91bmRQb2ludGVyRG93biA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyTW92ZSA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyVXAgPSBudWxsO1xuICAgIHRoaXMuX2JvdW5kUG9pbnRlckNhbmNlbCA9IG51bGw7XG4gIH1cblxuICAvLyAtLS0gc2V0dGluZ3MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBhcHBseVNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncykgcmV0dXJuO1xuXG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJykpIHtcbiAgICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBzZXR0aW5ncy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdzaG93T25GdWxsc2NyZWVuJykpIHtcbiAgICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IHNldHRpbmdzLnNob3dPbkZ1bGxzY3JlZW4gIT09IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaGFzT3duKHNldHRpbmdzLCAnc2hvd1NlY29uZHMnKSkge1xuICAgICAgdGhpcy5zaG93U2Vjb25kcyA9IHNldHRpbmdzLnNob3dTZWNvbmRzICE9PSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ3Nob3dQcm9ncmVzcycpKSB7XG4gICAgICB0aGlzLnNob3dQcm9ncmVzcyA9IHNldHRpbmdzLnNob3dQcm9ncmVzcyAhPT0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdhdXRvSGlkZScpKSB7XG4gICAgICB0aGlzLmF1dG9IaWRlID0gc2V0dGluZ3MuYXV0b0hpZGUgPT09IHRydWU7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdsYXlvdXRNb2RlJykpIHtcbiAgICAgIHRoaXMubGF5b3V0TW9kZSA9IHNldHRpbmdzLmxheW91dE1vZGUgPT09ICdmbG9hdCcgPyAnZmxvYXQnIDogJ3NuYXAnO1xuICAgIH1cbiAgICBpZiAoaGFzT3duKHNldHRpbmdzLCAnZmxvYXRQb3NpdGlvblZpZGVvJykpIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvblZpZGVvID0gc2V0dGluZ3MuZmxvYXRQb3NpdGlvblZpZGVvIHx8IG51bGw7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdmbG9hdFBvc2l0aW9uV2luZG93JykpIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvbldpbmRvdyA9IHNldHRpbmdzLmZsb2F0UG9zaXRpb25XaW5kb3cgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvLyBSZS10cmFuc2xhdGUgdGhlIGNsb3NlIGJ1dHRvbiB0aXRsZSB3aGVuIHNldHRpbmdzL2xhbmd1YWdlIGFyZSByZS1hcHBsaWVkLlxuICAgIGlmICh0aGlzLl9jbG9zZUJ0bikge1xuICAgICAgdGhpcy5fY2xvc2VCdG4udGl0bGUgPSB0KCdjbG9zZUJ0blRpdGxlJyk7XG4gICAgfVxuICB9XG5cbiAgZGlzcGxheVR5cGUoKSB7XG4gICAgcmV0dXJuICdtZWRpYSc7XG4gIH1cblxuICBpc1Nob3dpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gIH1cblxuICBfZmxvYXRTdG9yYWdlS2V5KCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BsYXlUeXBlKCkgPT09ICd3aW5kb3ctb3ZlcmxheSdcbiAgICAgID8gJ2Zsb2F0UG9zaXRpb25XaW5kb3cnXG4gICAgICA6ICdmbG9hdFBvc2l0aW9uVmlkZW8nO1xuICB9XG5cbiAgX2dldEZsb2F0UG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheVR5cGUoKSA9PT0gJ3dpbmRvdy1vdmVybGF5J1xuICAgICAgPyB0aGlzLmZsb2F0UG9zaXRpb25XaW5kb3dcbiAgICAgIDogdGhpcy5mbG9hdFBvc2l0aW9uVmlkZW87XG4gIH1cblxuICBfc2V0RmxvYXRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGlmICh0aGlzLmRpc3BsYXlUeXBlKCkgPT09ICd3aW5kb3ctb3ZlcmxheScpIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvbldpbmRvdyA9IHBvc2l0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZsb2F0UG9zaXRpb25WaWRlbyA9IHBvc2l0aW9uO1xuICAgIH1cbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IFt0aGlzLl9mbG9hdFN0b3JhZ2VLZXkoKV06IHBvc2l0aW9uIH0pO1xuICB9XG5cbiAgLy8gLS0tIGVsZW1lbnQgY3JlYXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY3JlYXRlVGltZUVsZW1lbnQoKSB7XG4gICAgY29uc3QgdGltZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICc1cHgnO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjNzIGVhc2UnO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5ib3hTaXppbmcgPSAnYm9yZGVyLWJveCc7XG5cbiAgICAvLyDni6znq4vmloflrZflrrnlmajvvIjkuI4gw5cg5oyJ6ZKu5bm25YiX77yM6YG/5YWNIHVwZGF0ZVRpbWUg6K+v5Yig5oyJ6ZKu77yJXG4gICAgY29uc3QgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdGV4dFNwYW4udGV4dENvbnRlbnQgPSAnMDA6MDAgLyAwMDowMCc7XG4gICAgdGhpcy5fdGltZVRleHRTcGFuID0gdGV4dFNwYW47XG4gICAgdGltZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dFNwYW4pO1xuXG4gICAgY29uc3QgY2xvc2VCdG4gPSB0aGlzLl9jcmVhdGVDbG9zZUJ1dHRvbigpO1xuICAgIHRoaXMuX2Nsb3NlQnRuID0gY2xvc2VCdG47XG5cbiAgICAvLyDkvb/nlKggbW91c2VvdmVyL21vdXNlb3V0ICsgcmVsYXRlZFRhcmdldCDlpITnkIYgaG92ZXLvvIzpgb/lhY3nu53lr7nlrprkvY3lrZDlhYPntKDlr7zoh7TnmoTkuovku7bpl67pophcbiAgICB0aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4geyBjbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsgfSk7XG4gICAgdGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIOW9k+m8oOagh+emu+W8gCB0aW1lRWxlbWVudCDkuJTmnKrov5vlhaUgY2xvc2VCdG4g5pe25omN6ZqQ6JePXG4gICAgICAvLyDlu7bov5/orqkgbW91c2VlbnRlciBjbG9zZUJ0biDmnInmnLrkvJrop6blj5FcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fZm9yY2VDbG9zZVZpc2libGUpIHJldHVybjtcbiAgICAgICAgaWYgKGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJyAmJiAhY2xvc2VCdG4ubWF0Y2hlcygnOmhvdmVyJykpIHtcbiAgICAgICAgICBjbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgICB9LCA1MCk7XG4gICAgfSk7XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5fZm9yY2VDbG9zZVZpc2libGUpIGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSk7XG5cbiAgICB0aW1lRWxlbWVudC5hcHBlbmRDaGlsZChjbG9zZUJ0bik7XG4gICAgcmV0dXJuIHRpbWVFbGVtZW50O1xuICB9XG5cbiAgLy8g5Yib5bu65Y+z5LiK6KeS5YWz6Zet5oyJ6ZKuIMOX77yI5L2N5LqOIHRpbWVFbGVtZW50IOWGhemDqOWPs+S4iuinku+8iVxuICBfY3JlYXRlQ2xvc2VCdXR0b24oKSB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGJ0bi50ZXh0Q29udGVudCA9ICfDlyc7XG4gICAgYnRuLnRpdGxlID0gdCgnY2xvc2VCdG5UaXRsZScpO1xuICAgIE9iamVjdC5hc3NpZ24oYnRuLnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogJzFweCcsXG4gICAgICByaWdodDogJzFweCcsXG4gICAgICB3aWR0aDogJzE4cHgnLFxuICAgICAgaGVpZ2h0OiAnMThweCcsXG4gICAgICBsaW5lSGVpZ2h0OiAnMThweCcsXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDAuNyknLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgekluZGV4OiAnMTAwMDAwMCcsXG4gICAgICBib3hTaGFkb3c6ICcwIDFweCAzcHggcmdiYSgwLDAsMCwwLjMpJyxcbiAgICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICAgIHBvaW50ZXJFdmVudHM6ICdhdXRvJ1xuICAgIH0pO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpOyAvLyDpmLvmraLmi5bmi71cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgdGhpcy5oYW5kbGVEaXNtaXNzKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYnRuO1xuICB9XG5cbiAgaGFuZGxlRGlzbWlzcygpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZnMtdGltZS1kaXNtaXNzJywge1xuICAgICAgZGV0YWlsOiB7IGRpc3BsYXlUeXBlOiB0aGlzLmRpc3BsYXlUeXBlKCkgfVxuICAgIH0pKTtcbiAgfVxuXG4gIC8vIC0tLSB2aXNpYmlsaXR5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNoZWNrSXNUb1Nob3coKSB7XG4gICAgaWYgKCF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gICAgaWYgKCFmc0VsIHx8ICF0aGlzLm1lZGlhKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gZnNFbCA9PT0gdGhpcy5tZWRpYSB8fFxuICAgICAgICAgICBmc0VsLmNvbnRhaW5zKHRoaXMubWVkaWEpIHx8XG4gICAgICAgICAgIHRoaXMubWVkaWEuY29udGFpbnMoZnNFbCk7XG4gIH1cblxuICB1cGRhdGVWaXNpYmlsaXR5KCkge1xuICAgIGlmICh0aGlzLmNoZWNrSXNUb1Nob3coKSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZXNldENsb3NlQnV0dG9uKCkge1xuICAgIGlmICghdGhpcy5fY2xvc2VCdG4pIHJldHVybjtcbiAgICB0aGlzLl9jbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gdGhpcy5fZm9yY2VDbG9zZVZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnO1xuICB9XG5cbiAgX2dldERvbVBhcmVudChmc0VsKSB7XG4gICAgcmV0dXJuIGZzRWwgfHwgZG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG5cbiAgICBjb25zdCBmc0VsID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKTtcbiAgICBjb25zdCBuYXRpdmVWaWRlb0Z1bGxzY3JlZW4gPSBpc1ZpZGVvRWxlbWVudChmc0VsKTtcblxuICAgIC8vIE5hdGl2ZSA8dmlkZW8+IGZ1bGxzY3JlZW4gcmVuZGVycyBpbiBpdHMgb3duIHRvcCBsYXllci4gQSByZWd1bGFyIERPTVxuICAgIC8vIGNoaWxkIChldmVuIGluc2lkZSB0aGUgdmlkZW8pIGlzIHBhaW50ZWQgdW5kZXJuZWF0aCB0aGUgdmlkZW8uIFVzZSB0aGVcbiAgICAvLyBQb3BvdmVyIEFQSSB0byBwcm9tb3RlIHRoZSBvdmVybGF5IGludG8gdGhlIGJyb3dzZXIgdG9wIGxheWVyIGluc3RlYWQuXG4gICAgaWYgKG5hdGl2ZVZpZGVvRnVsbHNjcmVlbiAmJiAhUE9QT1ZFUl9TVVBQT1JURUQpIHtcbiAgICAgIC8vIFVuc3VwcG9ydGVkIEFQSTogbm8gcG9pbnQgcmV0cnlpbmc7IGdvIHRocm91Z2ggc2hhcmVkIGNsZWFudXAuXG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VQb3BvdmVyID0gbmF0aXZlVmlkZW9GdWxsc2NyZWVuICYmIFBPUE9WRVJfU1VQUE9SVEVEO1xuICAgIHRoaXMuX3Zpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuX3BvcG92ZXJNb2RlID0gdXNlUG9wb3ZlcjtcblxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIHRoaXMuX2FwcGx5UG9pbnRlck1vZGUodXNlUG9wb3Zlcik7XG4gICAgdGhpcy5fcmVzZXRDbG9zZUJ1dHRvbigpO1xuXG4gICAgaWYgKHVzZVBvcG92ZXIpIHtcbiAgICAgIGlmIChkb2N1bWVudC5ib2R5ICYmIHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgLy8gTmV2ZXIgZm9yY2UgZGlzcGxheTpibG9jayBiZWZvcmUgc2hvd1BvcG92ZXIoKS4gTGV0IHRoZSBVQVxuICAgICAgLy8gW3BvcG92ZXJdOm5vdCg6cG9wb3Zlci1vcGVuKSBydWxlIGtlZXAgYSBjbG9zZWQgcG9wb3ZlciBoaWRkZW4uXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgIGlmICghdGhpcy5fc2hvd1BvcG92ZXIoKSkge1xuICAgICAgICAvLyBUcmFuc2llbnQgZmFpbHVyZSB3aGlsZSBzdGlsbCBpbiBuYXRpdmUgdmlkZW8gZnVsbHNjcmVlbjogY2xlYW4gdXBcbiAgICAgICAgLy8gYW5kIHJldHJ5IGEgYm91bmRlZCBudW1iZXIgb2YgdGltZXMuXG4gICAgICAgIHRoaXMuX2hhbmRsZVBvcG92ZXJGYWlsdXJlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NsZWFyUG9wb3ZlclJldHJ5KCk7XG4gICAgICAvLyBNZWFzdXJlL3Bvc2l0aW9uIGFmdGVyIHByb21vdGlvbiBzbyBvZmZzZXRXaWR0aC9IZWlnaHQgYXJlIHJlYWwuXG4gICAgICB0aGlzLl9wb3NpdGlvbkVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnkoKTtcbiAgICAgIHRoaXMuX3RlYXJkb3duUG9wb3ZlcigpO1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fZ2V0RG9tUGFyZW50KGZzRWwpO1xuICAgICAgaWYgKHBhcmVudCAmJiB0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IHBhcmVudCkge1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdGhpcy5fcG9zaXRpb25FbGVtZW50KCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVUaW1lKCk7XG5cbiAgICAvLyBBIHBvcG92ZXIgY29udGFpbmVyIGlzIHBvaW50ZXItZXZlbnRzOm5vbmUgKGRpc3BsYXktb25seSksIHNvIGRyYWdnaW5nXG4gICAgLy8gaXMgbm90IHBvc3NpYmxlL21lYW5pbmdmdWwgdGhlcmUuXG4gICAgaWYgKHRoaXMubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0JyAmJiAhdXNlUG9wb3Zlcikge1xuICAgICAgdGhpcy5zZXR1cERyYWdnaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmF1dG9IaWRlKSB7XG4gICAgICB0aGlzLnN0YXJ0QXV0b0hpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICAgIHRoaXMudGVhcmRvd25XYWtlTGlzdGVuZXIoKTtcbiAgICAgIHRoaXMuX3Jlc3RvcmVQb2ludGVyRXZlbnRzKCk7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgfVxuICB9XG5cbiAgLy8gU2hhcmVkIHZpc2liaWxpdHkgY2xlYW51cCB1c2VkIGJ5IGhpZGUoKSBhbmQgcG9wb3ZlciBmYWlsdXJlIGhhbmRsaW5nLlxuICBfY2xlYW51cEZvckhpZGUoKSB7XG4gICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XG4gICAgdGhpcy50ZWFyZG93bldha2VMaXN0ZW5lcigpO1xuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xuICAgIHRoaXMuX3RlYXJkb3duUG9wb3ZlcigpO1xuXG4gICAgaWYgKHRoaXMudGltZUVsZW1lbnQpIHtcbiAgICAgIC8vIEFmdGVyIGhpZGVQb3BvdmVyKCkvYXR0cmlidXRlIHJlbW92YWwsIGV4cGxpY2l0bHkgaGlkZSB0aGUgbm9kZS5cbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcbiAgICAgIGlmICh0aGlzLl9jbG9zZUJ0bikgdGhpcy5fY2xvc2VCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcbiAgICAgIHRoaXMuX2ZvcmNlQ2xvc2VWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLl9yZXNldENsb3NlQnV0dG9uKCk7XG4gICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuX2NsZWFudXBGb3JIaWRlKCk7XG4gICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnkoKTtcbiAgfVxuXG4gIF9jbGVhclBvcG92ZXJSZXRyeVRpbWVyKCkge1xuICAgIGlmICh0aGlzLl9wb3BvdmVyUmV0cnlUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyKTtcbiAgICAgIHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfY2xlYXJQb3BvdmVyUmV0cnkoKSB7XG4gICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnlUaW1lcigpO1xuICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID0gMDtcbiAgfVxuXG4gIF9oYW5kbGVQb3BvdmVyRmFpbHVyZSgpIHtcbiAgICBjb25zdCBjYW5SZXRyeSA9IGlzVmlkZW9FbGVtZW50KGdldEZ1bGxzY3JlZW5FbGVtZW50KCkpO1xuICAgIHRoaXMuX2NsZWFudXBGb3JIaWRlKCk7XG4gICAgaWYgKGNhblJldHJ5KSB7XG4gICAgICB0aGlzLl9zY2hlZHVsZVBvcG92ZXJSZXRyeSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeVRpbWVyKCk7XG4gICAgICB0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCA9IDA7XG4gICAgfVxuICB9XG5cbiAgX3NjaGVkdWxlUG9wb3ZlclJldHJ5KCkge1xuICAgIGlmICh0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCA+PSAzKSByZXR1cm47XG5cbiAgICB0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCArPSAxO1xuICAgIHRoaXMuX2NsZWFyUG9wb3ZlclJldHJ5VGltZXIoKTtcbiAgICB0aGlzLl9wb3BvdmVyUmV0cnlUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fcG9wb3ZlclJldHJ5VGltZXIgPSBudWxsO1xuICAgICAgaWYgKCFpc1ZpZGVvRWxlbWVudChnZXRGdWxsc2NyZWVuRWxlbWVudCgpKSkge1xuICAgICAgICB0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5jaGVja0lzVG9TaG93KCkpIHtcbiAgICAgICAgdGhpcy5fcG9wb3ZlclJldHJ5Q291bnQgPSAwO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgICB9LCAxMDApO1xuICB9XG5cbiAgLy8gLS0tIHBsYWNlbWVudCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgX3Bvc2l0aW9uRWxlbWVudCgpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcblxuICAgIGNvbnN0IGZzRWwgPSBnZXRGdWxsc2NyZWVuRWxlbWVudCgpO1xuICAgIC8vIEEgZnVsbHNjcmVlbiBlbGVtZW50IGNvdmVycyB0aGUgdmlld3BvcnQsIHNvIHZpZXdwb3J0LWZpeGVkIGNvb3JkaW5hdGVzXG4gICAgLy8gd29yayBmb3IgY29udGFpbmVyLWFwcGVuZCwgcG9wb3ZlciwgYnJvd3NlciBhbmQgd2luZG93IG1vZGVzIGFsaWtlLlxuICAgIC8vIFVzaW5nIGZpeGVkIGV2ZXJ5d2hlcmUgYWxzbyBtYWtlcyBkcmFnLWVuZCBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIC8vIGNvb3JkaW5hdGVzIHJldXNhYmxlIG9uIHRoZSBuZXh0IHNob3cuXG4gICAgdGhpcy5fcG9zaXRpb25Nb2RlID0gJ2ZpeGVkJztcblxuICAgIGNvbnN0IHN0eWxlID0gdGhpcy50aW1lRWxlbWVudC5zdHlsZTtcbiAgICBzdHlsZS5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uTW9kZTtcbiAgICBzdHlsZS5tYXJnaW4gPSAnMCc7XG4gICAgc3R5bGUucmlnaHQgPSAnYXV0byc7XG4gICAgc3R5bGUuYm90dG9tID0gJ2F1dG8nO1xuICAgIHN0eWxlLmJvcmRlciA9ICdub25lJztcbiAgICBzdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG5cbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnZmxvYXQnKSB7XG4gICAgICBjb25zdCBzYXZlZCA9IHRoaXMuX2dldEZsb2F0UG9zaXRpb24oKTtcbiAgICAgIGlmIChzYXZlZCkge1xuICAgICAgICB0aGlzLl9hcHBseUZsb2F0UG9zaXRpb24oc2F2ZWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBzdHlsZS5sZWZ0ID0gJzUwJSc7XG4gICAgICBzdHlsZS50b3AgPSAnMjBweCc7XG4gICAgICBzdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmxlZnQgPSAnNTAlJztcbiAgICAgIHN0eWxlLnRvcCA9ICcxMHB4JztcbiAgICAgIHN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcbiAgICB9XG4gIH1cblxuICBfY2xhbXBQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLnRpbWVFbGVtZW50O1xuICAgIGNvbnN0IHdpZHRoID0gZWxlbWVudCA/IChlbGVtZW50Lm9mZnNldFdpZHRoIHx8IDApIDogMDtcbiAgICBjb25zdCBoZWlnaHQgPSBlbGVtZW50ID8gKGVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IDApIDogMDtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoMCwgd2luZG93LmlubmVyV2lkdGggLSB3aWR0aCk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KDAsIHdpbmRvdy5pbm5lckhlaWdodCAtIGhlaWdodCk7XG4gICAgY29uc3QgcmF3WCA9IE51bWJlcihwb3NpdGlvbiAmJiBwb3NpdGlvbi54KTtcbiAgICBjb25zdCByYXdZID0gTnVtYmVyKHBvc2l0aW9uICYmIHBvc2l0aW9uLnkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgTnVtYmVyLmlzRmluaXRlKHJhd1gpID8gcmF3WCA6IDApLCBtYXhYKSksXG4gICAgICB5OiBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIE51bWJlci5pc0Zpbml0ZShyYXdZKSA/IHJhd1kgOiAwKSwgbWF4WSkpXG4gICAgfTtcbiAgfVxuXG4gIF9hcHBseUZsb2F0UG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICBjb25zdCBjbGFtcGVkID0gdGhpcy5fY2xhbXBQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IHRoaXMuX3Bvc2l0aW9uTW9kZTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICdub25lJztcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtjbGFtcGVkLnh9cHhgO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7Y2xhbXBlZC55fXB4YDtcbiAgfVxuXG4gIGhhbmRsZVJlc2l6ZSgpIHtcbiAgICBpZiAoIXRoaXMuX3Zpc2libGUgfHwgdGhpcy5sYXlvdXRNb2RlICE9PSAnZmxvYXQnIHx8IHRoaXMuX2lzRHJhZ2dpbmcpIHJldHVybjtcbiAgICBjb25zdCBzYXZlZCA9IHRoaXMuX2dldEZsb2F0UG9zaXRpb24oKTtcbiAgICBpZiAoc2F2ZWQpIHRoaXMuX2FwcGx5RmxvYXRQb3NpdGlvbihzYXZlZCk7XG4gIH1cblxuICAvLyAtLS0gcG9wb3ZlciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBfc2hvd1BvcG92ZXIoKSB7XG4gICAgaWYgKCFQT1BPVkVSX1NVUFBPUlRFRCB8fCAhdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnNldEF0dHJpYnV0ZSgncG9wb3ZlcicsICdtYW51YWwnKTtcbiAgICAgIC8vIFJlLXNob3dpbmcgcHJvbW90ZXMgdGhlIG92ZXJsYXkgYWJvdmUgdGhlIGZ1bGxzY3JlZW4gYmFja2Ryb3Agb25cbiAgICAgIC8vIGV2ZXJ5IGZ1bGxzY3JlZW5jaGFuZ2UuXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LmhpZGVQb3BvdmVyKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIG5vdCBjdXJyZW50bHkgb3BlblxuICAgICAgfVxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zaG93UG9wb3ZlcigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIF9oaWRlUG9wb3ZlcigpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQgfHwgIVBPUE9WRVJfU1VQUE9SVEVEKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuaGlkZVBvcG92ZXIoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBub3QgY3VycmVudGx5IG9wZW4gLyB1bnN1cHBvcnRlZCBzdGF0ZVxuICAgIH1cbiAgfVxuXG4gIF90ZWFyZG93blBvcG92ZXIoKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgaWYgKFBPUE9WRVJfU1VQUE9SVEVEICYmIHRoaXMudGltZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdwb3BvdmVyJykpIHtcbiAgICAgIHRoaXMuX2hpZGVQb3BvdmVyKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncG9wb3ZlcicpKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgncG9wb3ZlcicpO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLSBwb2ludGVyIC8gZHJhZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIF9hcHBseVBvaW50ZXJNb2RlKHVzZVBvcG92ZXIpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICAvLyBQb3BvdmVyIG92ZXJsYXlzIHNpdCBhYm92ZSBhIG5hdGl2ZSBmdWxsc2NyZWVuIHZpZGVvIGFuZCBhcmVcbiAgICAvLyBkaXNwbGF5LW9ubHk7IHRoZSBjbG9zZSBidXR0b24gaXMgYmVzdC1lZmZvcnQgaW50ZXJhY3RpdmUuXG4gICAgdGhpcy5fZm9yY2VDbG9zZVZpc2libGUgPSB1c2VQb3BvdmVyO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IHVzZVBvcG92ZXIgPyAnbm9uZScgOiAnYXV0byc7XG4gICAgaWYgKHRoaXMuX2Nsb3NlQnRuKSB7XG4gICAgICB0aGlzLl9jbG9zZUJ0bi5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgICAgdGhpcy5fcmVzZXRDbG9zZUJ1dHRvbigpO1xuICAgIH1cbiAgfVxuXG4gIF9yZXN0b3JlUG9pbnRlckV2ZW50cygpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSB0aGlzLl9wb3BvdmVyTW9kZSA/ICdub25lJyA6ICdhdXRvJztcbiAgICBpZiAodGhpcy5fY2xvc2VCdG4pIHtcbiAgICAgIHRoaXMuX2Nsb3NlQnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBEcmFnZ2luZygpIHtcbiAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICAvLyBQb3BvdmVyIGNvbnRhaW5lcnMgYXJlIHBvaW50ZXItZXZlbnRzOm5vbmU7IG5vIGRyYWcgdGhlcmUuXG4gICAgaWYgKHRoaXMuX3BvcG92ZXJNb2RlKSByZXR1cm47XG5cbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG91Y2hBY3Rpb24gPSAnbm9uZSc7XG5cbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJEb3duID0gKGUpID0+IHRoaXMuX29uRHJhZ1N0YXJ0KGUpO1xuICAgIHRoaXMuX2JvdW5kUG9pbnRlck1vdmUgPSAoZSkgPT4gdGhpcy5fb25EcmFnTW92ZShlKTtcbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJVcCA9IChlKSA9PiB0aGlzLl9vbkRyYWdFbmQoZSk7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsID0gKGUpID0+IHRoaXMuX29uRHJhZ0VuZChlKTtcblxuICAgIHRoaXMudGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCB0aGlzLl9ib3VuZFBvaW50ZXJEb3duKTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fYm91bmRQb2ludGVyTW92ZSk7XG4gICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVydXAnLCB0aGlzLl9ib3VuZFBvaW50ZXJVcCk7XG4gICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgdGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsKTtcbiAgfVxuXG4gIHRlYXJkb3duRHJhZ2dpbmcoKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSAnJztcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvdWNoQWN0aW9uID0gJyc7XG5cbiAgICBpZiAodGhpcy5fYm91bmRQb2ludGVyRG93bikge1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX2JvdW5kUG9pbnRlckRvd24pO1xuICAgICAgdGhpcy5fYm91bmRQb2ludGVyRG93biA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fYm91bmRQb2ludGVyTW92ZSk7XG4gICAgICB0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2JvdW5kUG9pbnRlclVwKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX2JvdW5kUG9pbnRlclVwKTtcbiAgICAgIHRoaXMuX2JvdW5kUG9pbnRlclVwID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2JvdW5kUG9pbnRlckNhbmNlbCkge1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgdGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsKTtcbiAgICAgIHRoaXMuX2JvdW5kUG9pbnRlckNhbmNlbCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9hY3RpdmVQb2ludGVySWQgPSBudWxsO1xuICB9XG5cbiAgX29uRHJhZ1N0YXJ0KGUpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICBpZiAoZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJyAmJiBlLmJ1dHRvbiAhPT0gMCkgcmV0dXJuO1xuICAgIC8vIENsaWNraW5nIHRoZSBjbG9zZSBidXR0b24gbXVzdCBub3Qgc3RhcnQgYSBkcmFnLlxuICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5fY2xvc2VCdG4gfHxcbiAgICAgICAgKHRoaXMuX2Nsb3NlQnRuICYmIHRoaXMuX2Nsb3NlQnRuLmNvbnRhaW5zKGUudGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9hY3RpdmVQb2ludGVySWQgPSBlLnBvaW50ZXJJZDtcblxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnRpbWVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHRoaXMuX2RyYWdPZmZzZXQgPSB7IHg6IGUuY2xpZW50WCAtIHJlY3QubGVmdCwgeTogZS5jbGllbnRZIC0gcmVjdC50b3AgfTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnNldFBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIHBvaW50ZXIgY2FwdHVyZSBpcyBiZXN0LWVmZm9ydFxuICAgIH1cblxuICAgIHRoaXMuX3dha2UoKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBfb25EcmFnTW92ZShlKSB7XG4gICAgaWYgKCF0aGlzLl9pc0RyYWdnaW5nIHx8ICF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgaWYgKHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCAhPT0gbnVsbCAmJiBlLnBvaW50ZXJJZCAhPT0gdGhpcy5fYWN0aXZlUG9pbnRlcklkKSByZXR1cm47XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2NsYW1wUG9zaXRpb24oe1xuICAgICAgeDogZS5jbGllbnRYIC0gdGhpcy5fZHJhZ09mZnNldC54LFxuICAgICAgeTogZS5jbGllbnRZIC0gdGhpcy5fZHJhZ09mZnNldC55XG4gICAgfSk7XG5cbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb25Nb2RlO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3Bvc2l0aW9uLnh9cHhgO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7cG9zaXRpb24ueX1weGA7XG5cbiAgICB0aGlzLl93YWtlKCk7XG4gIH1cblxuICBfb25EcmFnRW5kKGUpIHtcbiAgICBpZiAoIXRoaXMuX2lzRHJhZ2dpbmcgfHwgIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fYWN0aXZlUG9pbnRlcklkICE9PSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5oYXNQb2ludGVyQ2FwdHVyZSAmJlxuICAgICAgICAgICAgdGhpcy50aW1lRWxlbWVudC5oYXNQb2ludGVyQ2FwdHVyZSh0aGlzLl9hY3RpdmVQb2ludGVySWQpKSB7XG4gICAgICAgICAgdGhpcy50aW1lRWxlbWVudC5yZWxlYXNlUG9pbnRlckNhcHR1cmUodGhpcy5fYWN0aXZlUG9pbnRlcklkKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIGlnbm9yZVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9hY3RpdmVQb2ludGVySWQgPSBudWxsO1xuXG4gICAgY29uc3QgcmVjdCA9IHRoaXMudGltZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9jbGFtcFBvc2l0aW9uKHsgeDogcmVjdC5sZWZ0LCB5OiByZWN0LnRvcCB9KTtcbiAgICB0aGlzLl9zZXRGbG9hdFBvc2l0aW9uKHBvc2l0aW9uKTtcblxuICAgIGlmICh0aGlzLmF1dG9IaWRlKSB0aGlzLl93YWtlKCk7XG4gIH1cblxuICAvLyAtLS0gYXV0byBoaWRlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBzdGFydEF1dG9IaWRlKCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICB0aGlzLl9yZXN0b3JlUG9pbnRlckV2ZW50cygpO1xuICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XG4gICAgdGhpcy5fc2V0dXBXYWtlTGlzdGVuZXIoKTtcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmFkZU91dCgpLCAzMDAwKTtcbiAgfVxuXG4gIGNsZWFyQXV0b0hpZGVUaW1lcigpIHtcbiAgICBpZiAodGhpcy5hdXRvSGlkZVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5hdXRvSGlkZVRpbWVyKTtcbiAgICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgX3NldHVwV2FrZUxpc3RlbmVyKCkge1xuICAgIHRoaXMudGVhcmRvd25XYWtlTGlzdGVuZXIoKTtcbiAgICB0aGlzLl9ib3VuZFdha2VIYW5kbGVyID0gKCkgPT4gdGhpcy5fd2FrZSgpO1xuXG4gICAgLy8gV2FrZSBvbiBhY3Rpdml0eSBhbnl3aGVyZSBpbiB0aGUgZnVsbHNjcmVlbiBjb250YWluZXIvZG9jdW1lbnQsIG5vdFxuICAgIC8vIG9ubHkgb3ZlciB0aGUgPHZpZGVvPiBlbGVtZW50LlxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICBpZiAodGhpcy50aW1lRWxlbWVudCkge1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIpO1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZFdha2VIYW5kbGVyKTtcbiAgICB9XG4gIH1cblxuICB0ZWFyZG93bldha2VMaXN0ZW5lcigpIHtcbiAgICBpZiAodGhpcy5fYm91bmRXYWtlSGFuZGxlcikge1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVybW92ZScsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIpO1xuICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIpO1xuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIpO1xuICAgICAgfVxuICAgICAgdGhpcy5fYm91bmRXYWtlSGFuZGxlciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgX3dha2UoKSB7XG4gICAgaWYgKCF0aGlzLmF1dG9IaWRlIHx8ICF0aGlzLl92aXNpYmxlIHx8ICF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIHRoaXMuX3Jlc3RvcmVQb2ludGVyRXZlbnRzKCk7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmFkZU91dCgpLCAzMDAwKTtcbiAgfVxuXG4gIGZhZGVPdXQoKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICBpZiAodGhpcy5fY2xvc2VCdG4pIHRoaXMuX2Nsb3NlQnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcbiAgfVxuXG4gIC8vIC0tLSB0aW1lIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIF9zeXN0ZW1UaW1lKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgaG91cnMgPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgbWludXRlcyA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIHJldHVybiB0aGlzLnNob3dTZWNvbmRzXG4gICAgICA/IGAke2hvdXJzfToke21pbnV0ZXN9OiR7U3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJyl9YFxuICAgICAgOiBgJHtob3Vyc306JHttaW51dGVzfWA7XG4gIH1cblxuICB1cGRhdGVUaW1lKCkge1xuICAgIGlmICghdGhpcy5fdGltZVRleHRTcGFuKSByZXR1cm47XG4gICAgY29uc3Qgc3lzdGVtVGltZSA9IHRoaXMuX3N5c3RlbVRpbWUoKTtcblxuICAgIGlmICh0aGlzLnNob3dQcm9ncmVzcyAmJiB0aGlzLm1lZGlhKSB7XG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IE51bWJlcih0aGlzLm1lZGlhLmN1cnJlbnRUaW1lKTtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gTnVtYmVyKHRoaXMubWVkaWEuZHVyYXRpb24pO1xuICAgICAgdGhpcy5fdGltZVRleHRTcGFuLnRleHRDb250ZW50ID1cbiAgICAgICAgYCR7Zm9ybWF0VGltZShjdXJyZW50VGltZSl9IC8gJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gfCAke3N5c3RlbVRpbWV9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGltZVRleHRTcGFuLnRleHRDb250ZW50ID0gc3lzdGVtVGltZTtcbiAgICB9XG4gIH1cblxuICAvLyAtLS0gdGVhcmRvd24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX3Zpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeSgpO1xuICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XG4gICAgdGhpcy50ZWFyZG93bldha2VMaXN0ZW5lcigpO1xuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xuICAgIHRoaXMuX3RlYXJkb3duUG9wb3ZlcigpO1xuXG4gICAgaWYgKHRoaXMudGltZUVsZW1lbnQgJiYgdGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy50aW1lRWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5fdGltZVRleHRTcGFuID0gbnVsbDtcbiAgICB0aGlzLl9jbG9zZUJ0biA9IG51bGw7XG4gICAgdGhpcy5tZWRpYSA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheSBleHRlbmRzIFRpbWVEaXNwbGF5IHtcbiAgZGlzcGxheVR5cGUoKSB7XG4gICAgcmV0dXJuICd3aW5kb3ctb3ZlcmxheSc7XG4gIH1cblxuICBjaGVja0lzVG9TaG93KCkge1xuICAgIGlmICghdGhpcy5zaG93T25GdWxsc2NyZWVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG5cbiAgICAvLyDlhYPntKDlhajlsY/vvIjop4bpopHlhajlsY/vvInml7bvvJrlpoLmnpzop4bpopHkuJPnlKjmmL7npLrlt7LlvIDlkK/vvIzkuI3lho3ph43lpI3mmL7npLpcbiAgICBpZiAoZnNFbCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuICF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuO1xuICAgIH1cblxuICAgIC8vIOa1j+iniOWZqOWFqOWxj++8iEYxMe+8ieaXtuaYvuekulxuICAgIHJldHVybiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcbiAgfVxuXG4gIHVwZGF0ZVRpbWUoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVGV4dFNwYW4pIHJldHVybjtcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPSB0aGlzLl9zeXN0ZW1UaW1lKCk7XG4gIH1cbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1xuICBUaW1lRGlzcGxheSxcbiAgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5LFxuICBnZXRGdWxsc2NyZWVuRWxlbWVudCxcbiAgRlVMTFNDUkVFTl9FVkVOVFNcbn0gZnJvbSAnLi93aWRnZXRzJztcbmltcG9ydCB7IHQsIGluaXQsIHJlbG9hZEZyb21TdG9yYWdlIH0gZnJvbSAnLi9pMThuJztcbmltcG9ydCB7XG4gIERFRkFVTFRfS0VZX1RPR0dMRV9MQVlPVVQsXG4gIERFRkFVTFRfS0VZX1RPR0dMRV9WSVNJQklMSVRZLFxuICBidWlsZEtleVN0cmluZyxcbiAgaXNFZGl0YWJsZVRhcmdldFxufSBmcm9tICcuL3Nob3J0Y3V0S2V5cyc7XG5cbmNvbnN0IElTX1RPUF9GUkFNRSA9IHdpbmRvdy50b3AgPT09IHdpbmRvdztcbmNvbnN0IE1BWF9TQ0FOX1JFVFJJRVMgPSA1O1xuXG4vLyDliJ3lp4vljJboh6rlrprkuYkgaTE4bu+8iOW8guatpeWKoOi9vee/u+ivke+8iVxuaW5pdCgpO1xuXG5mdW5jdGlvbiBsb2dUb3AoLi4uYXJncykge1xuICBpZiAoSVNfVE9QX0ZSQU1FKSBjb25zb2xlLmxvZyguLi5hcmdzKTtcbn1cblxubG9nVG9wKHQoJ21zZ0xvYWRlZCcpKTtcblxuLy8gLS0tIGNlbnRyYWxpemVkIHNldHRpbmdzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jb25zdCBERUZBVUxUX1NFVFRJTkdTID0ge1xuICBzaG93V2hlblZpZGVvRnVsbHNjcmVlbjogdHJ1ZSxcbiAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcbiAgc2hvd1NlY29uZHM6IHRydWUsXG4gIHNob3dQcm9ncmVzczogdHJ1ZSxcbiAgYXV0b0hpZGU6IGZhbHNlLFxuICBsYXlvdXRNb2RlOiAnc25hcCcsXG4gIGZsb2F0UG9zaXRpb25WaWRlbzogbnVsbCxcbiAgZmxvYXRQb3NpdGlvbldpbmRvdzogbnVsbFxufTtcblxuY29uc3Qgc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1NFVFRJTkdTKTtcblxuLy8gU2hvcnRjdXQgYmluZGluZ3MgYXJlIGNhY2hlZCBzbyB0aGUga2V5ZG93biBwYXRoIHN0YXlzIHN5bmNocm9ub3VzLlxuY29uc3Qgc2hvcnRjdXRLZXlzID0ge1xuICBrZXlUb2dnbGVMYXlvdXQ6IERFRkFVTFRfS0VZX1RPR0dMRV9MQVlPVVQsXG4gIGtleVRvZ2dsZVZpc2liaWxpdHk6IERFRkFVTFRfS0VZX1RPR0dMRV9WSVNJQklMSVRZXG59O1xuXG5mdW5jdGlvbiBub3JtYWxpemVTdG9yZWRTaG9ydGN1dCh2YWx1ZSkge1xuICAvLyBOb3JtYWxpemUgbGVnYWN5IFNwYWNlIGJpbmRpbmdzIHRvIHRoZSBjYW5vbmljYWwgXCJTcGFjZVwiIG5hbWUuXG4gIC8vIEJhcmUgXCIgXCIgPT4gXCJTcGFjZVwiOyBcIkN0cmwrIFwiID0+IFwiQ3RybCtTcGFjZVwiLlxuICBpZiAodmFsdWUgPT09ICcgJykgcmV0dXJuICdTcGFjZSc7XG4gIGlmICh2YWx1ZS5lbmRzV2l0aCgnKyAnKSkgcmV0dXJuIGAke3ZhbHVlLnNsaWNlKDAsIC0xKX1TcGFjZWA7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gcmVhZFN0b3JlZFNob3J0Y3V0KHZhbHVlLCBmYWxsYmFjaykge1xuICAvLyBNaXNzaW5nL25vbi1zdHJpbmcgPT4gZGVmYXVsdDsgZW1wdHkgc3RyaW5nID0+IGV4cGxpY2l0bHkgZGlzYWJsZWQ7XG4gIC8vIGFueSBvdGhlciBzdHJpbmcgPT4gYmluZGluZyAobm9ybWFsaXplZCBpZiBuZWVkZWQpLlxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbGxiYWNrO1xuICBpZiAodmFsdWUgPT09ICcnKSByZXR1cm4gJyc7XG4gIHJldHVybiBub3JtYWxpemVTdG9yZWRTaG9ydGN1dCh2YWx1ZSk7XG59XG5cbmNvbnN0IFNFVFRJTkdfS0VZUyA9IFtcbiAgJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyxcbiAgJ3Nob3dPbkZ1bGxzY3JlZW4nLFxuICAnc2hvd1NlY29uZHMnLFxuICAnc2hvd1Byb2dyZXNzJyxcbiAgJ2F1dG9IaWRlJyxcbiAgJ2xheW91dE1vZGUnLFxuICAnZmxvYXRQb3NpdGlvblZpZGVvJyxcbiAgJ2Zsb2F0UG9zaXRpb25XaW5kb3cnXG5dO1xuXG4vLyB2aWRlbyAtPiB3aWRnZXQgKHByZXZlbnRzIGR1cGxpY2F0ZSBiaW5kaW5nKVxuY29uc3QgdmlkZW9XaWRnZXRzID0gbmV3IFdlYWtNYXAoKTtcbi8vIGl0ZXJhYmxlIGNvbXBhbmlvbiB0byB0aGUgV2Vha01hcCAoV2Vha01hcCBpcyBub3QgaXRlcmFibGUpXG5jb25zdCB0cmFja2VkVmlkZW9zID0gbmV3IFNldCgpO1xuXG5sZXQgb3ZlcmxheVRpbWVEaXNwID0gSVNfVE9QX0ZSQU1FXG4gID8gbmV3IFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheShkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcbiAgOiBudWxsO1xuXG4vLyBBbGwgdGltZXJzIGNyZWF0ZWQgYnkgaW5kZXggYXJlIHRyYWNrZWQgc28gdGVhcmRvd24gY2FuIGNsZWFyIHRoZW0uXG5jb25zdCBwZW5kaW5nVGltZW91dHMgPSBuZXcgU2V0KCk7XG5cbmZ1bmN0aW9uIHNjaGVkdWxlVGltZW91dChjYWxsYmFjaywgZGVsYXkpIHtcbiAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBwZW5kaW5nVGltZW91dHMuZGVsZXRlKGlkKTtcbiAgICBjYWxsYmFjaygpO1xuICB9LCBkZWxheSk7XG4gIHBlbmRpbmdUaW1lb3V0cy5hZGQoaWQpO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIGNsZWFyUGVuZGluZ1RpbWVvdXRzKCkge1xuICBwZW5kaW5nVGltZW91dHMuZm9yRWFjaCgoaWQpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICBwZW5kaW5nVGltZW91dHMuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gZGlzdHJpYnV0ZVNldHRpbmdzKCkge1xuICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gICAgaWYgKHdpZGdldCkgd2lkZ2V0LmFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICB9KTtcbiAgaWYgKG92ZXJsYXlUaW1lRGlzcCkgb3ZlcmxheVRpbWVEaXNwLmFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAvLyBhcHBseVNldHRpbmdzIGlzIHB1cmU7IHZpc2liaWxpdHkgKGFuZCBzaW5nbGUtd2lkZ2V0IHNlbGVjdGlvbikgaXNcbiAgLy8gY2VudHJhbGl6ZWQgc28gbXVsdGlwbGUgbWF0Y2hpbmcgdmlkZW9zIG5ldmVyIHN0YWNrIGNsb2Nrcy5cbiAgdXBkYXRlQWxsVmlzaWJpbGl0eSgpO1xufVxuXG5mdW5jdGlvbiBsb2FkU2V0dGluZ3MoKSB7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxuICAgIE9iamVjdC5hc3NpZ24oe1xuICAgICAgZmxvYXRQb3NpdGlvbjogbnVsbCxcbiAgICAgIGtleVRvZ2dsZUxheW91dDogREVGQVVMVF9LRVlfVE9HR0xFX0xBWU9VVCxcbiAgICAgIGtleVRvZ2dsZVZpc2liaWxpdHk6IERFRkFVTFRfS0VZX1RPR0dMRV9WSVNJQklMSVRZXG4gICAgfSwgREVGQVVMVF9TRVRUSU5HUyksXG4gICAgKGl0ZW1zKSA9PiB7XG4gICAgICBjb25zdCBsZWdhY3kgPSBpdGVtcy5mbG9hdFBvc2l0aW9uO1xuXG4gICAgICBjb25zdCBub3JtYWxpemVkTGF5b3V0ID0gcmVhZFN0b3JlZFNob3J0Y3V0KFxuICAgICAgICBpdGVtcy5rZXlUb2dnbGVMYXlvdXQsXG4gICAgICAgIERFRkFVTFRfS0VZX1RPR0dMRV9MQVlPVVRcbiAgICAgICk7XG4gICAgICBjb25zdCBub3JtYWxpemVkVmlzaWJpbGl0eSA9IHJlYWRTdG9yZWRTaG9ydGN1dChcbiAgICAgICAgaXRlbXMua2V5VG9nZ2xlVmlzaWJpbGl0eSxcbiAgICAgICAgREVGQVVMVF9LRVlfVE9HR0xFX1ZJU0lCSUxJVFlcbiAgICAgICk7XG5cbiAgICAgIHNob3J0Y3V0S2V5cy5rZXlUb2dnbGVMYXlvdXQgPSBub3JtYWxpemVkTGF5b3V0O1xuICAgICAgc2hvcnRjdXRLZXlzLmtleVRvZ2dsZVZpc2liaWxpdHkgPSBub3JtYWxpemVkVmlzaWJpbGl0eTtcblxuICAgICAgLy8gT25lLXRpbWUgbm9ybWFsaXphdGlvbiBtaWdyYXRpb24gZm9yIGxlZ2FjeSBTcGFjZSBiaW5kaW5ncyAob3Igb3RoZXJcbiAgICAgIC8vIGNvcnJlY3RlZCB2YWx1ZXMpLiBOb3JtYWxpemF0aW9uIGlzIGlkZW1wb3RlbnQsIHNvIHRoaXMgY2Fubm90IGxvb3AuXG4gICAgICBjb25zdCBzaG9ydGN1dFVwZGF0ZXMgPSB7fTtcbiAgICAgIGlmIChub3JtYWxpemVkTGF5b3V0ICE9PSBpdGVtcy5rZXlUb2dnbGVMYXlvdXQpIHtcbiAgICAgICAgc2hvcnRjdXRVcGRhdGVzLmtleVRvZ2dsZUxheW91dCA9IG5vcm1hbGl6ZWRMYXlvdXQ7XG4gICAgICB9XG4gICAgICBpZiAobm9ybWFsaXplZFZpc2liaWxpdHkgIT09IGl0ZW1zLmtleVRvZ2dsZVZpc2liaWxpdHkpIHtcbiAgICAgICAgc2hvcnRjdXRVcGRhdGVzLmtleVRvZ2dsZVZpc2liaWxpdHkgPSBub3JtYWxpemVkVmlzaWJpbGl0eTtcbiAgICAgIH1cbiAgICAgIGlmIChPYmplY3Qua2V5cyhzaG9ydGN1dFVwZGF0ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoc2hvcnRjdXRVcGRhdGVzKTtcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3Muc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBpdGVtcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgICBzZXR0aW5ncy5zaG93T25GdWxsc2NyZWVuID0gaXRlbXMuc2hvd09uRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgICBzZXR0aW5ncy5zaG93U2Vjb25kcyA9IGl0ZW1zLnNob3dTZWNvbmRzICE9PSBmYWxzZTtcbiAgICAgIHNldHRpbmdzLnNob3dQcm9ncmVzcyA9IGl0ZW1zLnNob3dQcm9ncmVzcyAhPT0gZmFsc2U7XG4gICAgICBzZXR0aW5ncy5hdXRvSGlkZSA9IGl0ZW1zLmF1dG9IaWRlID09PSB0cnVlO1xuICAgICAgc2V0dGluZ3MubGF5b3V0TW9kZSA9IGl0ZW1zLmxheW91dE1vZGUgPT09ICdmbG9hdCcgPyAnZmxvYXQnIDogJ3NuYXAnO1xuICAgICAgc2V0dGluZ3MuZmxvYXRQb3NpdGlvblZpZGVvID0gaXRlbXMuZmxvYXRQb3NpdGlvblZpZGVvIHx8IG51bGw7XG4gICAgICBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93ID0gaXRlbXMuZmxvYXRQb3NpdGlvbldpbmRvdyB8fCBudWxsO1xuXG4gICAgICAvLyBPbmUtdGltZSBtaWdyYXRpb24gb2YgdGhlIGxlZ2FjeSBzaGFyZWQgZmxvYXQgcG9zaXRpb24uIFVzZSBpdCBmb3JcbiAgICAgIC8vIGJvdGggd2lkZ2V0IHR5cGVzLCB0aGVuIHJlbW92ZSB0aGUgb2xkIGtleS5cbiAgICAgIGxldCBtaWdyYXRlZCA9IGZhbHNlO1xuICAgICAgaWYgKGxlZ2FjeSAmJiB0eXBlb2YgbGVnYWN5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoIXNldHRpbmdzLmZsb2F0UG9zaXRpb25WaWRlbykge1xuICAgICAgICAgIHNldHRpbmdzLmZsb2F0UG9zaXRpb25WaWRlbyA9IGxlZ2FjeTtcbiAgICAgICAgICBtaWdyYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93KSB7XG4gICAgICAgICAgc2V0dGluZ3MuZmxvYXRQb3NpdGlvbldpbmRvdyA9IGxlZ2FjeTtcbiAgICAgICAgICBtaWdyYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGlzdHJpYnV0ZVNldHRpbmdzKCk7XG5cbiAgICAgIGlmIChsZWdhY3kgIT09IG51bGwgJiYgbGVnYWN5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG1pZ3JhdGVkKSB7XG4gICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe1xuICAgICAgICAgICAgZmxvYXRQb3NpdGlvblZpZGVvOiBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uVmlkZW8sXG4gICAgICAgICAgICBmbG9hdFBvc2l0aW9uV2luZG93OiBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoJ2Zsb2F0UG9zaXRpb24nKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG59XG5cbmxvYWRTZXR0aW5ncygpO1xuXG4vLyBTaW5nbGUgc3RvcmFnZSBsaXN0ZW5lciBmb3IgdGhlIHdob2xlIHBhZ2UgLyBmcmFtZS5cbmZ1bmN0aW9uIGhhbmRsZVN0b3JhZ2VDaGFuZ2VkKGNoYW5nZXMsIG5hbWVzcGFjZSkge1xuICBpZiAobmFtZXNwYWNlICE9PSAnc3luYycpIHJldHVybjtcblxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICBTRVRUSU5HX0tFWVMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2VzLCBrZXkpKSB7XG4gICAgICBzZXR0aW5nc1trZXldID0gY2hhbmdlc1trZXldLm5ld1ZhbHVlO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNoYW5nZXMsICdrZXlUb2dnbGVMYXlvdXQnKSkge1xuICAgIHNob3J0Y3V0S2V5cy5rZXlUb2dnbGVMYXlvdXQgPSByZWFkU3RvcmVkU2hvcnRjdXQoXG4gICAgICBjaGFuZ2VzLmtleVRvZ2dsZUxheW91dC5uZXdWYWx1ZSxcbiAgICAgIERFRkFVTFRfS0VZX1RPR0dMRV9MQVlPVVRcbiAgICApO1xuICB9XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlcywgJ2tleVRvZ2dsZVZpc2liaWxpdHknKSkge1xuICAgIHNob3J0Y3V0S2V5cy5rZXlUb2dnbGVWaXNpYmlsaXR5ID0gcmVhZFN0b3JlZFNob3J0Y3V0KFxuICAgICAgY2hhbmdlcy5rZXlUb2dnbGVWaXNpYmlsaXR5Lm5ld1ZhbHVlLFxuICAgICAgREVGQVVMVF9LRVlfVE9HR0xFX1ZJU0lCSUxJVFlcbiAgICApO1xuICB9XG5cbiAgY29uc3QgbGFuZ3VhZ2VDaGFuZ2VkID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNoYW5nZXMsICdsYW5ndWFnZScpO1xuXG4gIC8vIExhbmd1YWdlIGNoYW5nZSBtdXN0IG5vdCBzd2FsbG93IGNvLWNoYW5nZWQgc2V0dGluZ3MuXG4gIGlmIChsYW5ndWFnZUNoYW5nZWQpIHtcbiAgICByZWxvYWRGcm9tU3RvcmFnZSgpLnRoZW4oKCkgPT4gZGlzdHJpYnV0ZVNldHRpbmdzKCkpO1xuICB9XG4gIGlmIChjaGFuZ2VkKSBkaXN0cmlidXRlU2V0dGluZ3MoKTtcbn1cblxuY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKGhhbmRsZVN0b3JhZ2VDaGFuZ2VkKTtcblxuLy8gLS0tIG1lZGlhIGRpc2NvdmVyeSAvIGJpbmRpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGJpbmRWaWRlbyh2aWRlbykge1xuICBpZiAoIXZpZGVvIHx8IHZpZGVvLnRhZ05hbWUgIT09ICdWSURFTycpIHJldHVybjtcbiAgaWYgKHZpZGVvV2lkZ2V0cy5oYXModmlkZW8pKSByZXR1cm47XG5cbiAgY29uc3Qgd2lkZ2V0ID0gbmV3IFRpbWVEaXNwbGF5KHZpZGVvKTtcbiAgdmlkZW9XaWRnZXRzLnNldCh2aWRlbywgd2lkZ2V0KTtcbiAgdHJhY2tlZFZpZGVvcy5hZGQodmlkZW8pO1xuXG4gIHdpZGdldC5hcHBseVNldHRpbmdzKHNldHRpbmdzKTtcbiAgdXBkYXRlQWxsVmlzaWJpbGl0eSgpO1xufVxuXG5mdW5jdGlvbiBkZXN0cm95VmlkZW8odmlkZW8pIHtcbiAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gIGlmICh3aWRnZXQpIHdpZGdldC5kZXN0cm95KCk7XG4gIHZpZGVvV2lkZ2V0cy5kZWxldGUodmlkZW8pO1xuICB0cmFja2VkVmlkZW9zLmRlbGV0ZSh2aWRlbyk7XG59XG5cbmZ1bmN0aW9uIHNjYW5Gb3JNZWRpYShyb290KSB7XG4gIGNvbnN0IHZpZGVvcyA9IChyb290IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKCd2aWRlbycpO1xuICBsZXQgZm91bmQgPSAwO1xuICB2aWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBpZiAoIXZpZGVvV2lkZ2V0cy5oYXModmlkZW8pKSB7XG4gICAgICBiaW5kVmlkZW8odmlkZW8pO1xuICAgICAgZm91bmQrKztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZm91bmQ7XG59XG5cbi8vIFNjYW4gaW1tZWRpYXRlbHk7IGlmIG5vIHZpZGVvcyBleGlzdCB5ZXQsIHJldHJ5IGEgYm91bmRlZCBudW1iZXIgb2YgdGltZXNcbi8vICg1IHggMXMpIHJhdGhlciB0aGFuIHBvbGxpbmcgZm9yZXZlci5cbmxldCBzY2FuUmV0cmllcyA9IDA7XG5cbmZ1bmN0aW9uIGluaXRpYWxTY2FuKCkge1xuICBjb25zdCBmb3VuZCA9IHNjYW5Gb3JNZWRpYShkb2N1bWVudCk7XG4gIGlmIChmb3VuZCA+IDApIHtcbiAgICBsb2dUb3AodCgnbXNnRm91bmRNZWRpYScpLCBmb3VuZCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHNjYW5SZXRyaWVzIDwgTUFYX1NDQU5fUkVUUklFUykge1xuICAgIHNjYW5SZXRyaWVzKys7XG4gICAgc2NoZWR1bGVUaW1lb3V0KGluaXRpYWxTY2FuLCAxMDAwKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2dUb3AodCgnbXNnTm9NZWRpYScpKTtcbn1cblxuaW5pdGlhbFNjYW4oKTtcblxuLy8gRHluYW1pYyB2aWRlb3M6IGJpbmQgbmV3bHkgYWRkZWQgdmlkZW9zIGFuZCBkZXN0cm95IHdpZGdldHMgZm9yIHJlbW92ZWQgb25lcy5cbmNvbnN0IG1lZGlhT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gIGxldCBzYXdSZW1vdmFsID0gZmFsc2U7XG5cbiAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICBpZiAoIW5vZGUgfHwgbm9kZS5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuICAgICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1ZJREVPJykge1xuICAgICAgICBiaW5kVmlkZW8obm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICAgIG5vZGUucXVlcnlTZWxlY3RvckFsbCgndmlkZW8nKS5mb3JFYWNoKCh2aWRlbykgPT4gYmluZFZpZGVvKHZpZGVvKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobXV0YXRpb24ucmVtb3ZlZE5vZGVzICYmIG11dGF0aW9uLnJlbW92ZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBzYXdSZW1vdmFsID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChzYXdSZW1vdmFsKSB7XG4gICAgLy8gRGVmZXIgc28gYSBtb3ZlZCB2aWRlbyAocmVtb3ZlZCArIHJlLWFkZGVkKSBpcyBub3QgZGVzdHJveWVkLlxuICAgIHNjaGVkdWxlVGltZW91dChjbGVhbnVwUmVtb3ZlZFZpZGVvcywgMCk7XG4gIH1cbn0pO1xuXG5tZWRpYU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG4gIGNoaWxkTGlzdDogdHJ1ZSxcbiAgc3VidHJlZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIGNsZWFudXBSZW1vdmVkVmlkZW9zKCkge1xuICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgaWYgKCF2aWRlby5pc0Nvbm5lY3RlZCkgZGVzdHJveVZpZGVvKHZpZGVvKTtcbiAgfSk7XG59XG5cbi8vIC0tLSBjZW50cmFsaXplZCBzY2hlZHVsaW5nIC8gdmlzaWJpbGl0eSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jb25zdCB0aWNrZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICBpZiAod2lkZ2V0ICYmIHdpZGdldC5pc1Nob3dpbmcoKSkgd2lkZ2V0LnVwZGF0ZVRpbWUoKTtcbiAgfSk7XG4gIGlmIChvdmVybGF5VGltZURpc3AgJiYgb3ZlcmxheVRpbWVEaXNwLmlzU2hvd2luZygpKSB7XG4gICAgb3ZlcmxheVRpbWVEaXNwLnVwZGF0ZVRpbWUoKTtcbiAgfVxufSwgMTAwMCk7XG5cbmZ1bmN0aW9uIHVwZGF0ZUFsbFZpc2liaWxpdHkoKSB7XG4gIGNvbnN0IGZzRWwgPSBnZXRGdWxsc2NyZWVuRWxlbWVudCgpO1xuXG4gIGlmIChmc0VsKSB7XG4gICAgLy8gT25seSBvbmUgY2xvY2sgbWF5IHdpbiBpbnNpZGUgYSBmdWxsc2NyZWVuIGNvbnRhaW5lci4gUHJlZmVyIHRoZSB2aWRlb1xuICAgIC8vIHRoYXQgaXMgYWN0dWFsbHkgcGxheWluZywgdGhlbiB0aGUgZXhhY3QgZnVsbHNjcmVlbiBlbGVtZW50LCB0aGVuIHRoZVxuICAgIC8vIGZpcnN0IG1hdGNoaW5nIHdpZGdldC5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gW107XG4gICAgdHJhY2tlZFZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgICAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gICAgICBpZiAod2lkZ2V0ICYmIHdpZGdldC5jaGVja0lzVG9TaG93KCkpIHtcbiAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHsgdmlkZW8sIHdpZGdldCB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCB3aW5uZXIgPSBudWxsO1xuICAgIGlmIChjYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHdpbm5lciA9IGNhbmRpZGF0ZXMuZmluZCgoYykgPT4gIWMudmlkZW8ucGF1c2VkICYmICFjLnZpZGVvLmVuZGVkKSB8fFxuICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5maW5kKChjKSA9PiBjLnZpZGVvID09PSBmc0VsKSB8fFxuICAgICAgICAgICAgICAgY2FuZGlkYXRlc1swXTtcbiAgICB9XG5cbiAgICBjb25zdCB3aW5uZXJXaWRnZXQgPSB3aW5uZXIgPyB3aW5uZXIud2lkZ2V0IDogbnVsbDtcbiAgICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICAgIGlmICh3aWRnZXQgJiYgd2lkZ2V0ICE9PSB3aW5uZXJXaWRnZXQgJiYgd2lkZ2V0LmlzU2hvd2luZygpKSB7XG4gICAgICAgIHdpZGdldC5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHdpbm5lcldpZGdldCkgd2lubmVyV2lkZ2V0LnVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgfSBlbHNlIHtcbiAgICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICAgIGlmICh3aWRnZXQpIHdpZGdldC51cGRhdGVWaXNpYmlsaXR5KCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAob3ZlcmxheVRpbWVEaXNwKSBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXNpemUoKSB7XG4gIHVwZGF0ZUFsbFZpc2liaWxpdHkoKTtcbiAgdHJhY2tlZFZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgIGNvbnN0IHdpZGdldCA9IHZpZGVvV2lkZ2V0cy5nZXQodmlkZW8pO1xuICAgIGlmICh3aWRnZXQpIHdpZGdldC5oYW5kbGVSZXNpemUoKTtcbiAgfSk7XG4gIGlmIChvdmVybGF5VGltZURpc3ApIG92ZXJsYXlUaW1lRGlzcC5oYW5kbGVSZXNpemUoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRnVsbHNjcmVlbkNoYW5nZSgpIHtcbiAgaWYgKCFnZXRGdWxsc2NyZWVuRWxlbWVudCgpICYmICFjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSkge1xuICAgIHJlc3RvcmVUZW1wVmFsdWVzKCk7XG4gIH1cbiAgdXBkYXRlQWxsVmlzaWJpbGl0eSgpO1xufVxuXG4vLyBTaW5nbGUgc2V0IG9mIGdsb2JhbCBmdWxsc2NyZWVuL3Jlc2l6ZSBsaXN0ZW5lcnMuXG5GVUxMU0NSRUVOX0VWRU5UUy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZUZ1bGxzY3JlZW5DaGFuZ2UpO1xufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVJlc2l6ZSk7XG5cbi8vIC0tLSDlv6vmjbfplK7lpITnkIbvvIjlnYfkuLrkuLTml7bliIfmjaLvvIzkuI3lhpkgc3RvcmFnZe+8iSAtLS1cblxuLy8g6KKr5b+r5o236ZSu5Li05pe25pS55Yqo55qE6K6+572u77yM6YCA5Ye65YWo5bGP5pe25oGi5aSN5Y6f5YC8XG5jb25zdCBfdGVtcE92ZXJyaWRlcyA9IHt9O1xuXG4vLyDlsIbmn5DkuKrorr7nva7lgLzlupTnlKjliLDmiYDmnIkgd2lkZ2V0IOWunuS+i++8iOS4jeWGmSBzdG9yYWdl77yJXG5mdW5jdGlvbiBhcHBseVNldHRpbmdUb1dpZGdldHMoc2V0dGluZ0tleSwgdmFsdWUpIHtcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc2V0dGluZ3MsIHNldHRpbmdLZXkpKSByZXR1cm47XG4gIHNldHRpbmdzW3NldHRpbmdLZXldID0gdmFsdWU7XG4gIGRpc3RyaWJ1dGVTZXR0aW5ncygpO1xufVxuXG4vLyDlv6vmjbfplK7kuLTml7bliIfmjaLvvJrorrDlvZXljp/lp4vlgLwg4oaSIOWGmeWFpSB3aWRnZXRcbmZ1bmN0aW9uIHRlbXBUb2dnbGUoc2V0dGluZ0tleSwgbmV3VmFsdWUsIGN1cnJlbnRWYWx1ZSkge1xuICBpZiAoIShzZXR0aW5nS2V5IGluIF90ZW1wT3ZlcnJpZGVzKSkge1xuICAgIF90ZW1wT3ZlcnJpZGVzW3NldHRpbmdLZXldID0gY3VycmVudFZhbHVlO1xuICB9XG4gIGFwcGx5U2V0dGluZ1RvV2lkZ2V0cyhzZXR0aW5nS2V5LCBuZXdWYWx1ZSk7XG59XG5cbi8vIOmAgOWHuuWFqOWxj+aXtuaBouWkjeaJgOacieS4tOaXtuaUueWKqFxuZnVuY3Rpb24gcmVzdG9yZVRlbXBWYWx1ZXMoKSB7XG4gIGZvciAoY29uc3QgW2tleSwgb3JpZ2luYWxWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoX3RlbXBPdmVycmlkZXMpKSB7XG4gICAgYXBwbHlTZXR0aW5nVG9XaWRnZXRzKGtleSwgb3JpZ2luYWxWYWx1ZSk7XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gX3RlbXBPdmVycmlkZXMpIHtcbiAgICBkZWxldGUgX3RlbXBPdmVycmlkZXNba2V5XTtcbiAgfVxufVxuXG4vLyDmo4DmtYvpgIDlh7rlhajlsY/vvIjlkKsgRjEx77yJXG5mdW5jdGlvbiBjaGVja0Z1bGxzY3JlZW5FeGl0KCkge1xuICBjb25zdCBpc0ZzID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKSB8fCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcbiAgaWYgKCFpc0ZzKSB7XG4gICAgcmVzdG9yZVRlbXBWYWx1ZXMoKTtcbiAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2hlY2tGdWxsc2NyZWVuRXhpdCk7XG5cbi8vIOWFs+mXreaMiemSriDDlyDihpIg5Li05pe26ZqQ6JeP77yI5ZCM5b+r5o236ZSuIGhpZGUg6KGM5Li677yJXG5mdW5jdGlvbiBoYW5kbGVEaXNtaXNzKGUpIHtcbiAgY29uc3Qgc2V0dGluZ0tleSA9IGUuZGV0YWlsICYmIGUuZGV0YWlsLmRpc3BsYXlUeXBlID09PSAnd2luZG93LW92ZXJsYXknXG4gICAgPyAnc2hvd09uRnVsbHNjcmVlbidcbiAgICA6ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbic7XG4gIGNvbnN0IGN1cnJlbnRWYWwgPSBzZXR0aW5nc1tzZXR0aW5nS2V5XTtcbiAgaWYgKGN1cnJlbnRWYWwgPT09IGZhbHNlKSByZXR1cm47IC8vIOW3sue7j+makOiXj1xuICB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksIGZhbHNlLCBjdXJyZW50VmFsKTtcbiAgbG9nVG9wKGBbJHt0KCdtc2dEaXNtaXNzTGFiZWwnKX1dICR7c2V0dGluZ0tleX0gJHt0KCdtc2dEaXNtaXNzZWQnKX1gKTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnMtdGltZS1kaXNtaXNzJywgaGFuZGxlRGlzbWlzcyk7XG5cbmZ1bmN0aW9uIGhhbmRsZUtleWRvd24oZSkge1xuICAvLyBSZXNlcnZlZCBicm93c2VyIGtleSAvIGtleS1yZXBlYXQgLyBJTUUgY29tcG9zaXRpb24uXG4gIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgfHwgZS5yZXBlYXQgfHwgZS5pc0NvbXBvc2luZykgcmV0dXJuO1xuXG4gIC8vIE5ldmVyIHN0ZWFsIGtleXMgd2hpbGUgdGhlIHVzZXIgaXMgdHlwaW5nLlxuICBpZiAoaXNFZGl0YWJsZVRhcmdldChlLnRhcmdldCkpIHJldHVybjtcblxuICBjb25zdCBpc0ZzID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKSB8fCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcbiAgaWYgKCFpc0ZzKSByZXR1cm47XG5cbiAgY29uc3QgcHJlc3NlZCA9IGJ1aWxkS2V5U3RyaW5nKGUpO1xuICBpZiAoIXByZXNzZWQpIHJldHVybjtcblxuICAvLyBTeW5jaHJvbm91cyBjYWNoZSBjaGVjazogbm8gYXN5bmMgc3RvcmFnZSByZWFkIGluIHRoZSBrZXlkb3duIHBhdGguXG4gIGlmIChwcmVzc2VkID09PSBzaG9ydGN1dEtleXMua2V5VG9nZ2xlTGF5b3V0KSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgLy8g5LuO6ZuG5Lit6K6+572u6K+75Y+W5b2T5YmN5biD5bGA5qih5byP77yIc3RvcmFnZSDmnKrooqsgc2hvcnRjdXQg5YaZ6L+H77yJXG4gICAgY29uc3QgY3VycmVudE1vZGUgPSBzZXR0aW5ncy5sYXlvdXRNb2RlO1xuICAgIGNvbnN0IG5ld01vZGUgPSBjdXJyZW50TW9kZSA9PT0gJ2Zsb2F0JyA/ICdzbmFwJyA6ICdmbG9hdCc7XG4gICAgdGVtcFRvZ2dsZSgnbGF5b3V0TW9kZScsIG5ld01vZGUsIGN1cnJlbnRNb2RlKTtcbiAgICBsb2dUb3AoYFske3QoJ21zZ0xheW91dFRvZ2dsZScpfV0gJHtuZXdNb2RlID09PSAnZmxvYXQnID8gdCgnbXNnRmxvYXQnKSA6IHQoJ21zZ1NuYXAnKX1gKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocHJlc3NlZCA9PT0gc2hvcnRjdXRLZXlzLmtleVRvZ2dsZVZpc2liaWxpdHkpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBjb25zdCBpblZpZGVvRnMgPSAhIWdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gICAgY29uc3Qgc2V0dGluZ0tleSA9IGluVmlkZW9GcyA/ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicgOiAnc2hvd09uRnVsbHNjcmVlbic7XG4gICAgLy8g5LuO6ZuG5Lit6K6+572u6K+75Y+W5b2T5YmN54q25oCB77yIc3RvcmFnZSDku47mnKrooqsgc2hvcnRjdXQg5YaZ6L+H77yJXG4gICAgY29uc3QgY3VycmVudFZhbCA9IHNldHRpbmdzW3NldHRpbmdLZXldO1xuICAgIHRlbXBUb2dnbGUoc2V0dGluZ0tleSwgIWN1cnJlbnRWYWwsIGN1cnJlbnRWYWwpO1xuICAgIGxvZ1RvcCh0KCFjdXJyZW50VmFsID8gJ21zZ1Zpc2liaWxpdHlPbicgOiAnbXNnVmlzaWJpbGl0eU9mZicpKTtcbiAgfVxufVxuXG4vLyBDYXB0dXJlIHBoYXNlIHNvIHBhZ2UgaGFuZGxlcnMgY2Fubm90IHN3YWxsb3cgdGhlIHNob3J0Y3V0IGZpcnN0LlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleWRvd24sIHRydWUpO1xuXG4vLyAtLS0gdGVhcmRvd24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHRlYXJkb3duKCkge1xuICBjbGVhckludGVydmFsKHRpY2tlcik7XG4gIGNsZWFyUGVuZGluZ1RpbWVvdXRzKCk7XG4gIG1lZGlhT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuXG4gIEZVTExTQ1JFRU5fRVZFTlRTLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVGdWxsc2NyZWVuQ2hhbmdlKTtcbiAgfSk7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignb3JpZW50YXRpb25jaGFuZ2UnLCBoYW5kbGVSZXNpemUpO1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2hlY2tGdWxsc2NyZWVuRXhpdCk7XG5cbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGhhbmRsZVN0b3JhZ2VDaGFuZ2VkKTtcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleWRvd24sIHRydWUpO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmcy10aW1lLWRpc21pc3MnLCBoYW5kbGVEaXNtaXNzKTtcblxuICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gICAgaWYgKHdpZGdldCkgd2lkZ2V0LmRlc3Ryb3koKTtcbiAgICB2aWRlb1dpZGdldHMuZGVsZXRlKHZpZGVvKTtcbiAgfSk7XG4gIHRyYWNrZWRWaWRlb3MuY2xlYXIoKTtcblxuICBpZiAob3ZlcmxheVRpbWVEaXNwKSB7XG4gICAgb3ZlcmxheVRpbWVEaXNwLmRlc3Ryb3koKTtcbiAgICBvdmVybGF5VGltZURpc3AgPSBudWxsO1xuICB9XG59XG5cbi8vIGJmY2FjaGU6IHBhZ2VoaWRlIGZpcmVzIHdoZW4gZW50ZXJpbmcgdGhlIGJhY2svZm9yd2FyZCBjYWNoZSB0b287IG9ubHkgdGVhclxuLy8gZG93biBvbiBhIHJlYWwgdW5sb2FkLlxuZnVuY3Rpb24gaGFuZGxlUGFnZUhpZGUoZXZlbnQpIHtcbiAgaWYgKGV2ZW50LnBlcnNpc3RlZCkgcmV0dXJuO1xuICB0ZWFyZG93bigpO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncGFnZWhpZGUnLCBoYW5kbGVQYWdlSGlkZSk7XG4iXSwibmFtZXMiOlsiU1VQUE9SVEVEX0xBTkdTIiwiU1RPUkFHRV9LRVkiLCJfY3VycmVudExhbmciLCJfdHJhbnNsYXRpb25zIiwiX2luaXRQcm9taXNlIiwidCIsImtleSIsIm1lc3NhZ2UiLCJjaHJvbWUiLCJpMThuIiwiZ2V0TWVzc2FnZSIsImUiLCJnZXRDdXJyZW50TGFuZyIsImluaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiaXRlbXMiLCJzdG9yZWQiLCJicm93c2VyTGFuZyIsIm5hdmlnYXRvciIsImxhbmd1YWdlIiwibWFwcGVkIiwicmVwbGFjZSIsImJlc3RMYW5nIiwiaW5jbHVkZXMiLCJsb2FkTGFuZyIsInRoZW4iLCJyZWxvYWRGcm9tU3RvcmFnZSIsImxhbmciLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwidXJsIiwicnVudGltZSIsImdldFVSTCIsImNvbmNhdCIsImZldGNoIiwicmVzcCIsIm9rIiwiRXJyb3IiLCJqc29uIiwiZGF0YSIsIkRFRkFVTFRfS0VZX1RPR0dMRV9MQVlPVVQiLCJERUZBVUxUX0tFWV9UT0dHTEVfVklTSUJJTElUWSIsIk1PRElGSUVSX09OTFlfS0VZUyIsIm5vcm1hbGl6ZUtleU5hbWUiLCJidWlsZEtleVN0cmluZyIsImV2ZW50IiwicGFydHMiLCJjdHJsS2V5IiwicHVzaCIsImFsdEtleSIsInNoaWZ0S2V5IiwibWV0YUtleSIsImpvaW4iLCJpc0VkaXRhYmxlVGFyZ2V0IiwidGFyZ2V0IiwiX3R5cGVvZiIsInRhZ05hbWUiLCJ0b1VwcGVyQ2FzZSIsImlzQ29udGVudEVkaXRhYmxlIiwiZm9ybWF0VGltZSIsInNlY29uZHMiLCJ2YWx1ZSIsIk51bWJlciIsImlzRmluaXRlIiwidG90YWwiLCJNYXRoIiwiZmxvb3IiLCJtaW5zIiwic2VjcyIsIlN0cmluZyIsInBhZFN0YXJ0IiwiY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIiwiZnNFbCIsImRvY3VtZW50IiwiZnVsbHNjcmVlbkVsZW1lbnQiLCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCIsIm1vekZ1bGxTY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsIlRPTEVSQU5DRSIsImFicyIsIndpbmRvdyIsImlubmVySGVpZ2h0Iiwic2NyZWVuIiwiaGVpZ2h0IiwiaW5uZXJXaWR0aCIsIndpZHRoIiwiRlVMTFNDUkVFTl9FVkVOVFMiLCJnZXRGdWxsc2NyZWVuRWxlbWVudCIsImlzVmlkZW9FbGVtZW50IiwiZWxlbWVudCIsIkhUTUxWaWRlb0VsZW1lbnQiLCJQT1BPVkVSX1NVUFBPUlRFRCIsIkhUTUxFbGVtZW50IiwicHJvdG90eXBlIiwic2hvd1BvcG92ZXIiLCJoaWRlUG9wb3ZlciIsIkRFRkFVTFRfU0VUVElOR1MiLCJzaG93V2hlblZpZGVvRnVsbHNjcmVlbiIsInNob3dPbkZ1bGxzY3JlZW4iLCJzaG93U2Vjb25kcyIsInNob3dQcm9ncmVzcyIsImF1dG9IaWRlIiwibGF5b3V0TW9kZSIsImZsb2F0UG9zaXRpb25WaWRlbyIsImZsb2F0UG9zaXRpb25XaW5kb3ciLCJoYXNPd24iLCJvYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJUaW1lRGlzcGxheSIsIm1lZGlhIiwiX2NsYXNzQ2FsbENoZWNrIiwidGltZUVsZW1lbnQiLCJjcmVhdGVUaW1lRWxlbWVudCIsIl90aW1lVGV4dFNwYW4iLCJfY2xvc2VCdG4iLCJhc3NpZ24iLCJhdXRvSGlkZVRpbWVyIiwiX2JvdW5kV2FrZUhhbmRsZXIiLCJfaXNEcmFnZ2luZyIsIl9hY3RpdmVQb2ludGVySWQiLCJfZHJhZ09mZnNldCIsIngiLCJ5IiwiX3Bvc2l0aW9uTW9kZSIsIl9wb3BvdmVyTW9kZSIsIl92aXNpYmxlIiwiX2ZvcmNlQ2xvc2VWaXNpYmxlIiwiX3BvcG92ZXJSZXRyeVRpbWVyIiwiX3BvcG92ZXJSZXRyeUNvdW50IiwiX2JvdW5kUG9pbnRlckRvd24iLCJfYm91bmRQb2ludGVyTW92ZSIsIl9ib3VuZFBvaW50ZXJVcCIsIl9ib3VuZFBvaW50ZXJDYW5jZWwiLCJfY3JlYXRlQ2xhc3MiLCJhcHBseVNldHRpbmdzIiwic2V0dGluZ3MiLCJ0aXRsZSIsImRpc3BsYXlUeXBlIiwiaXNTaG93aW5nIiwiX2Zsb2F0U3RvcmFnZUtleSIsIl9nZXRGbG9hdFBvc2l0aW9uIiwiX3NldEZsb2F0UG9zaXRpb24iLCJwb3NpdGlvbiIsInNldCIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90aGlzIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwiekluZGV4IiwidHJhbnNpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJkaXNwbGF5IiwiYm94U2l6aW5nIiwidGV4dFNwYW4iLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwiY2xvc2VCdG4iLCJfY3JlYXRlQ2xvc2VCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsIm1hdGNoZXMiLCJfdGhpczIiLCJidG4iLCJ0b3AiLCJyaWdodCIsImxpbmVIZWlnaHQiLCJ0ZXh0QWxpZ24iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJjdXJzb3IiLCJib3hTaGFkb3ciLCJ1c2VyU2VsZWN0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGFuZGxlRGlzbWlzcyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImNoZWNrSXNUb1Nob3ciLCJjb250YWlucyIsInVwZGF0ZVZpc2liaWxpdHkiLCJzaG93IiwiaGlkZSIsIl9yZXNldENsb3NlQnV0dG9uIiwiX2dldERvbVBhcmVudCIsImJvZHkiLCJuYXRpdmVWaWRlb0Z1bGxzY3JlZW4iLCJ1c2VQb3BvdmVyIiwib3BhY2l0eSIsIl9hcHBseVBvaW50ZXJNb2RlIiwicGFyZW50RWxlbWVudCIsIl9zaG93UG9wb3ZlciIsIl9oYW5kbGVQb3BvdmVyRmFpbHVyZSIsIl9jbGVhclBvcG92ZXJSZXRyeSIsIl9wb3NpdGlvbkVsZW1lbnQiLCJfdGVhcmRvd25Qb3BvdmVyIiwicGFyZW50IiwidXBkYXRlVGltZSIsInNldHVwRHJhZ2dpbmciLCJ0ZWFyZG93bkRyYWdnaW5nIiwic3RhcnRBdXRvSGlkZSIsImNsZWFyQXV0b0hpZGVUaW1lciIsInRlYXJkb3duV2FrZUxpc3RlbmVyIiwiX3Jlc3RvcmVQb2ludGVyRXZlbnRzIiwiX2NsZWFudXBGb3JIaWRlIiwicmVtb3ZlQ2hpbGQiLCJfY2xlYXJQb3BvdmVyUmV0cnlUaW1lciIsImNsZWFyVGltZW91dCIsImNhblJldHJ5IiwiX3NjaGVkdWxlUG9wb3ZlclJldHJ5IiwiX3RoaXMzIiwibWFyZ2luIiwiYm90dG9tIiwiYm9yZGVyIiwidHJhbnNmb3JtIiwic2F2ZWQiLCJfYXBwbHlGbG9hdFBvc2l0aW9uIiwibGVmdCIsIl9jbGFtcFBvc2l0aW9uIiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJtYXhYIiwibWF4IiwibWF4WSIsInJhd1giLCJyYXdZIiwicm91bmQiLCJtaW4iLCJjbGFtcGVkIiwiaGFuZGxlUmVzaXplIiwic2V0QXR0cmlidXRlIiwiX2hpZGVQb3BvdmVyIiwiaGFzQXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiX3RoaXM0IiwidG91Y2hBY3Rpb24iLCJfb25EcmFnU3RhcnQiLCJfb25EcmFnTW92ZSIsIl9vbkRyYWdFbmQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicG9pbnRlclR5cGUiLCJidXR0b24iLCJwb2ludGVySWQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJzZXRQb2ludGVyQ2FwdHVyZSIsImVyciIsIl93YWtlIiwicHJldmVudERlZmF1bHQiLCJoYXNQb2ludGVyQ2FwdHVyZSIsInJlbGVhc2VQb2ludGVyQ2FwdHVyZSIsIl90aGlzNSIsIl9zZXR1cFdha2VMaXN0ZW5lciIsImZhZGVPdXQiLCJfdGhpczYiLCJwYXNzaXZlIiwiX3RoaXM3IiwiX3N5c3RlbVRpbWUiLCJub3ciLCJEYXRlIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsInN5c3RlbVRpbWUiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwiZGVzdHJveSIsIldpbmRvd092ZXJsYXlUaW1lRGlzcGxheSIsIl9UaW1lRGlzcGxheSIsIl9jYWxsU3VwZXIiLCJhcmd1bWVudHMiLCJfaW5oZXJpdHMiLCJJU19UT1BfRlJBTUUiLCJNQVhfU0NBTl9SRVRSSUVTIiwibG9nVG9wIiwiX2NvbnNvbGUiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJzaG9ydGN1dEtleXMiLCJrZXlUb2dnbGVMYXlvdXQiLCJrZXlUb2dnbGVWaXNpYmlsaXR5Iiwibm9ybWFsaXplU3RvcmVkU2hvcnRjdXQiLCJlbmRzV2l0aCIsInNsaWNlIiwicmVhZFN0b3JlZFNob3J0Y3V0IiwiZmFsbGJhY2siLCJTRVRUSU5HX0tFWVMiLCJ2aWRlb1dpZGdldHMiLCJXZWFrTWFwIiwidHJhY2tlZFZpZGVvcyIsIlNldCIsIm92ZXJsYXlUaW1lRGlzcCIsImRvY3VtZW50RWxlbWVudCIsInBlbmRpbmdUaW1lb3V0cyIsInNjaGVkdWxlVGltZW91dCIsImNhbGxiYWNrIiwiZGVsYXkiLCJpZCIsImFkZCIsImNsZWFyUGVuZGluZ1RpbWVvdXRzIiwiZm9yRWFjaCIsImNsZWFyIiwiZGlzdHJpYnV0ZVNldHRpbmdzIiwidmlkZW8iLCJ3aWRnZXQiLCJ1cGRhdGVBbGxWaXNpYmlsaXR5IiwibG9hZFNldHRpbmdzIiwiZmxvYXRQb3NpdGlvbiIsImxlZ2FjeSIsIm5vcm1hbGl6ZWRMYXlvdXQiLCJub3JtYWxpemVkVmlzaWJpbGl0eSIsInNob3J0Y3V0VXBkYXRlcyIsIm1pZ3JhdGVkIiwidW5kZWZpbmVkIiwicmVtb3ZlIiwiaGFuZGxlU3RvcmFnZUNoYW5nZWQiLCJjaGFuZ2VzIiwibmFtZXNwYWNlIiwiY2hhbmdlZCIsIm5ld1ZhbHVlIiwibGFuZ3VhZ2VDaGFuZ2VkIiwib25DaGFuZ2VkIiwiYWRkTGlzdGVuZXIiLCJiaW5kVmlkZW8iLCJoYXMiLCJkZXN0cm95VmlkZW8iLCJzY2FuRm9yTWVkaWEiLCJyb290IiwidmlkZW9zIiwicXVlcnlTZWxlY3RvckFsbCIsImZvdW5kIiwic2NhblJldHJpZXMiLCJpbml0aWFsU2NhbiIsIm1lZGlhT2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwic2F3UmVtb3ZhbCIsIm11dGF0aW9uIiwiYWRkZWROb2RlcyIsIm5vZGUiLCJub2RlVHlwZSIsInJlbW92ZWROb2RlcyIsImNsZWFudXBSZW1vdmVkVmlkZW9zIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJpc0Nvbm5lY3RlZCIsInRpY2tlciIsInNldEludGVydmFsIiwiY2FuZGlkYXRlcyIsIndpbm5lciIsImZpbmQiLCJjIiwicGF1c2VkIiwiZW5kZWQiLCJ3aW5uZXJXaWRnZXQiLCJoYW5kbGVGdWxsc2NyZWVuQ2hhbmdlIiwicmVzdG9yZVRlbXBWYWx1ZXMiLCJldmVudE5hbWUiLCJfdGVtcE92ZXJyaWRlcyIsImFwcGx5U2V0dGluZ1RvV2lkZ2V0cyIsInNldHRpbmdLZXkiLCJ0ZW1wVG9nZ2xlIiwiY3VycmVudFZhbHVlIiwiX2kiLCJfT2JqZWN0JGVudHJpZXMiLCJlbnRyaWVzIiwiX09iamVjdCRlbnRyaWVzJF9pIiwiX3NsaWNlZFRvQXJyYXkiLCJvcmlnaW5hbFZhbHVlIiwiY2hlY2tGdWxsc2NyZWVuRXhpdCIsImlzRnMiLCJjdXJyZW50VmFsIiwiaGFuZGxlS2V5ZG93biIsInJlcGVhdCIsImlzQ29tcG9zaW5nIiwicHJlc3NlZCIsImN1cnJlbnRNb2RlIiwibmV3TW9kZSIsImluVmlkZW9GcyIsInRlYXJkb3duIiwiY2xlYXJJbnRlcnZhbCIsImRpc2Nvbm5lY3QiLCJyZW1vdmVMaXN0ZW5lciIsImhhbmRsZVBhZ2VIaWRlIiwicGVyc2lzdGVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=