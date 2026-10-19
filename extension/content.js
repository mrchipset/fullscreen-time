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
    floatPosition: null
  }, DEFAULT_SETTINGS), function (items) {
    var legacy = items.floatPosition;
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
function buildKeyString(e) {
  var parts = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift' || e.key === 'Meta') return null;
  parts.push(e.key);
  return parts.join('+');
}

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
  var isFs = (0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)() || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
  if (!isFs) return;

  // ESC 有浏览器退出全屏的默认行为，不应进入快捷键逻辑
  if (e.key === 'Escape') return;
  var pressed = buildKeyString(e);
  if (!pressed) return;
  chrome.storage.sync.get(['keyToggleLayout', 'keyToggleVisibility'], function (items) {
    if (pressed === items.keyToggleLayout) {
      e.preventDefault();
      e.stopPropagation();
      // 从集中设置读取当前布局模式（storage 未被 shortcut 写过）
      var currentMode = settings.layoutMode;
      var newMode = currentMode === 'float' ? 'snap' : 'float';
      tempToggle('layoutMode', newMode, currentMode);
      logTop("[".concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgLayoutToggle'), "] ").concat(newMode === 'float' ? (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgFloat') : (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgSnap')));
    }
    if (pressed === items.keyToggleVisibility) {
      e.preventDefault();
      e.stopPropagation();
      var inVideoFs = !!(0,_widgets__WEBPACK_IMPORTED_MODULE_1__.getFullscreenElement)();
      var settingKey = inVideoFs ? 'showWhenVideoFullscreen' : 'showOnFullscreen';
      // 从集中设置读取当前状态（storage 从未被 shortcut 写过）
      var currentVal = settings[settingKey];
      tempToggle(settingKey, !currentVal, currentVal);
      logTop((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)(!currentVal ? 'msgVisibilityOn' : 'msgVisibilityOff'));
    }
  });
}
document.addEventListener('keydown', handleKeydown);

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
  document.removeEventListener('keydown', handleKeydown);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUU7RUFDN0IsSUFBSUEsS0FBSyxDQUFDQyxTQUFTLEVBQUU7RUFDckJOLFFBQVEsQ0FBQyxDQUFDO0FBQ1o7QUFFQXBULE1BQU0sQ0FBQ21GLGdCQUFnQixDQUFDLFVBQVUsRUFBRXFPLGNBQWMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL2kxOG4uanMiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy93aWRnZXRzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEN1c3RvbSBpMThuIG1vZHVsZSBmb3IgY29udGVudCBzY3JpcHQgKHdlYnBhY2stYnVuZGxlZCkuXG4gKiBMb2FkcyB0cmFuc2xhdGlvbnMgZnJvbSBfbG9jYWxlcy97bGFuZ30vbWVzc2FnZXMuanNvbiBhdCBydW50aW1lLlxuICovXG5cbmNvbnN0IFNVUFBPUlRFRF9MQU5HUyA9IFsnZW4nLCAnemhfQ04nXTtcbmNvbnN0IFNUT1JBR0VfS0VZID0gJ2xhbmd1YWdlJztcblxubGV0IF9jdXJyZW50TGFuZyA9IG51bGw7XG5sZXQgX3RyYW5zbGF0aW9ucyA9IHt9O1xubGV0IF9pbml0UHJvbWlzZSA9IG51bGw7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWVzc2FnZSBrZXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0KGtleSkge1xuICBpZiAoX3RyYW5zbGF0aW9uc1trZXldICYmIF90cmFuc2xhdGlvbnNba2V5XS5tZXNzYWdlKSB7XG4gICAgcmV0dXJuIF90cmFuc2xhdGlvbnNba2V5XS5tZXNzYWdlO1xuICB9XG4gIC8vIEZhbGxiYWNrIHRvIENocm9tZSBpMThuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGNocm9tZS5pMThuLmdldE1lc3NhZ2Uoa2V5KSB8fCBrZXk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJldHVybiBrZXk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRMYW5nKCkge1xuICByZXR1cm4gX2N1cnJlbnRMYW5nO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgaTE4bjogcmVhZCBzdG9yZWQgbGFuZ3VhZ2UsIGxvYWQgdHJhbnNsYXRpb25zLlxuICogQ2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBzYWZlbHkg4oCUIHJldHVybnMgc2FtZSBwcm9taXNlIG9uIHN1YnNlcXVlbnQgY2FsbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoX2luaXRQcm9taXNlKSByZXR1cm4gX2luaXRQcm9taXNlO1xuICBfaW5pdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNUT1JBR0VfS0VZLCAoaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlZCA9IGl0ZW1zW1NUT1JBR0VfS0VZXTtcbiAgICAgIGNvbnN0IGJyb3dzZXJMYW5nID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgICBjb25zdCBtYXBwZWQgPSBicm93c2VyTGFuZy5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgIGNvbnN0IGJlc3RMYW5nID0gc3RvcmVkIHx8IChTVVBQT1JURURfTEFOR1MuaW5jbHVkZXMobWFwcGVkKSA/IG1hcHBlZCA6ICdlbicpO1xuICAgICAgbG9hZExhbmcoYmVzdExhbmcpLnRoZW4oKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBfaW5pdFByb21pc2U7XG59XG5cbi8qKlxuICogUmVsb2FkIHRyYW5zbGF0aW9ucyBmb3IgYSBkaWZmZXJlbnQgbGFuZ3VhZ2UgKGNhbGxlZCB3aGVuIHN0b3JhZ2UgY2hhbmdlcykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWxvYWRGcm9tU3RvcmFnZSgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1RPUkFHRV9LRVksIChpdGVtcykgPT4ge1xuICAgICAgY29uc3QgbGFuZyA9IGl0ZW1zW1NUT1JBR0VfS0VZXSB8fCBfY3VycmVudExhbmcgfHwgJ2VuJztcbiAgICAgIGlmIChsYW5nICE9PSBfY3VycmVudExhbmcpIHtcbiAgICAgICAgbG9hZExhbmcobGFuZykudGhlbigoKSA9PiByZXNvbHZlKHRydWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBMb2FkIHRyYW5zbGF0aW9ucyBmb3IgYSBnaXZlbiBsYW5ndWFnZSBmcm9tIF9sb2NhbGVzL3tsYW5nfS9tZXNzYWdlcy5qc29uLlxuICovXG5mdW5jdGlvbiBsb2FkTGFuZyhsYW5nKSB7XG4gIGlmIChsYW5nID09PSBfY3VycmVudExhbmcgJiYgT2JqZWN0LmtleXMoX3RyYW5zbGF0aW9ucykubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBjb25zdCB1cmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoYF9sb2NhbGVzLyR7bGFuZ30vbWVzc2FnZXMuanNvbmApO1xuICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKHJlc3AgPT4ge1xuICAgICAgaWYgKCFyZXNwLm9rKSB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkICR7dXJsfWApO1xuICAgICAgcmV0dXJuIHJlc3AuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICBfdHJhbnNsYXRpb25zID0gZGF0YTtcbiAgICAgIF9jdXJyZW50TGFuZyA9IGxhbmc7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgaWYgKGxhbmcgIT09ICdlbicpIHJldHVybiBsb2FkTGFuZygnZW4nKTtcbiAgICAgIF90cmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgIF9jdXJyZW50TGFuZyA9ICdlbic7XG4gICAgfSk7XG59XG4iLCIvLyBmb3JtYXQgdGltZSBpbiBzZWNvbmRzIHRvIG1tOnNzXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZShzZWNvbmRzKSB7XG4gICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoc2Vjb25kcyk7XG4gICAgLy8gTGl2ZSBzdHJlYW1zIC8gbm90LXlldC1sb2FkZWQgbWVkaWEgcmVwb3J0IEluZmluaXR5IG9yIE5hTiDigJQgbmV2ZXIgcmVuZGVyXG4gICAgLy8gXCJJbmZpbml0eTpOYU5cIi4gVXNlIGEgcGxhY2Vob2xkZXIgaW5zdGVhZC5cbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgfHwgdmFsdWUgPCAwKSByZXR1cm4gJy0tOi0tJztcbiAgICBjb25zdCB0b3RhbCA9IE1hdGguZmxvb3IodmFsdWUpO1xuICAgIGNvbnN0IG1pbnMgPSBNYXRoLmZsb29yKHRvdGFsIC8gNjApO1xuICAgIGNvbnN0IHNlY3MgPSB0b3RhbCAlIDYwO1xuICAgIHJldHVybiBgJHtTdHJpbmcobWlucykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcoc2VjcykucGFkU3RhcnQoMiwgJzAnKX1gO1xufVxuXG4vLyBjaGVjayBpZiBmdWxsc2NyZWVuIGZvciBicm93c2VyIChGMTEgLyBicm93c2VyLWxldmVsIGZ1bGxzY3JlZW4pXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCkge1xuICAgIC8vIEVsZW1lbnQvbmF0aXZlIGZ1bGxzY3JlZW4gaXMgaGFuZGxlZCBzZXBhcmF0ZWx5OyBkb24ndCByZXBvcnQgYnJvd3NlclxuICAgIC8vIGZ1bGxzY3JlZW4gd2hpbGUgYW4gZWxlbWVudCBpcyBmdWxsc2NyZWVuLlxuICAgIGNvbnN0IGZzRWwgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50O1xuICAgIGlmIChmc0VsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBTbWFsbCB0b2xlcmFuY2UgYXZvaWRzIHpvb20vRFBJL3Rhc2tiYXIgcm91bmRpbmcgZmFsc2UgbmVnYXRpdmVzLlxuICAgIGNvbnN0IFRPTEVSQU5DRSA9IDI7XG4gICAgcmV0dXJuIE1hdGguYWJzKHdpbmRvdy5pbm5lckhlaWdodCAtIHNjcmVlbi5oZWlnaHQpIDw9IFRPTEVSQU5DRSAmJlxuICAgICAgICAgICBNYXRoLmFicyh3aW5kb3cuaW5uZXJXaWR0aCAtIHNjcmVlbi53aWR0aCkgPD0gVE9MRVJBTkNFO1xufVxuIiwiaW1wb3J0IHsgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuLCBmb3JtYXRUaW1lIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyB0IH0gZnJvbSAnLi9pMThuJztcblxuZXhwb3J0IGNvbnN0IEZVTExTQ1JFRU5fRVZFTlRTID0gW1xuICAnZnVsbHNjcmVlbmNoYW5nZScsXG4gICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJyxcbiAgJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLFxuICAnTVNGdWxsc2NyZWVuQ2hhbmdlJ1xuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bGxzY3JlZW5FbGVtZW50KCkge1xuICByZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcbiAgICAgICAgIGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IHx8XG4gICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudCB8fFxuICAgICAgICAgbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNWaWRlb0VsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gISFlbGVtZW50ICYmXG4gICAgdHlwZW9mIEhUTUxWaWRlb0VsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQ7XG59XG5cbmNvbnN0IFBPUE9WRVJfU1VQUE9SVEVEID0gdHlwZW9mIEhUTUxFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICB0eXBlb2YgSFRNTEVsZW1lbnQucHJvdG90eXBlLnNob3dQb3BvdmVyID09PSAnZnVuY3Rpb24nICYmXG4gIHR5cGVvZiBIVE1MRWxlbWVudC5wcm90b3R5cGUuaGlkZVBvcG92ZXIgPT09ICdmdW5jdGlvbic7XG5cbmNvbnN0IERFRkFVTFRfU0VUVElOR1MgPSB7XG4gIHNob3dXaGVuVmlkZW9GdWxsc2NyZWVuOiB0cnVlLFxuICBzaG93T25GdWxsc2NyZWVuOiB0cnVlLFxuICBzaG93U2Vjb25kczogdHJ1ZSxcbiAgc2hvd1Byb2dyZXNzOiB0cnVlLFxuICBhdXRvSGlkZTogZmFsc2UsXG4gIGxheW91dE1vZGU6ICdzbmFwJyxcbiAgZmxvYXRQb3NpdGlvblZpZGVvOiBudWxsLFxuICBmbG9hdFBvc2l0aW9uV2luZG93OiBudWxsXG59O1xuXG5mdW5jdGlvbiBoYXNPd24ob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKG1lZGlhKSB7XG4gICAgdGhpcy5tZWRpYSA9IG1lZGlhO1xuICAgIHRoaXMudGltZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRpbWVFbGVtZW50KCk7XG4gICAgdGhpcy5fdGltZVRleHRTcGFuID0gdGhpcy5fdGltZVRleHRTcGFuIHx8IG51bGw7XG4gICAgdGhpcy5fY2xvc2VCdG4gPSB0aGlzLl9jbG9zZUJ0biB8fCBudWxsO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBERUZBVUxUX1NFVFRJTkdTKTtcblxuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRXYWtlSGFuZGxlciA9IG51bGw7XG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IG51bGw7XG4gICAgdGhpcy5fZHJhZ09mZnNldCA9IHsgeDogMCwgeTogMCB9O1xuICAgIHRoaXMuX3Bvc2l0aW9uTW9kZSA9ICdmaXhlZCc7XG4gICAgdGhpcy5fcG9wb3Zlck1vZGUgPSBmYWxzZTtcbiAgICB0aGlzLl92aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5fZm9yY2VDbG9zZVZpc2libGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCA9IDA7XG5cbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJEb3duID0gbnVsbDtcbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlID0gbnVsbDtcbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJVcCA9IG51bGw7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsID0gbnVsbDtcbiAgfVxuXG4gIC8vIC0tLSBzZXR0aW5ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzKSByZXR1cm47XG5cbiAgICBpZiAoaGFzT3duKHNldHRpbmdzLCAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nKSkge1xuICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IHNldHRpbmdzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuICE9PSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ3Nob3dPbkZ1bGxzY3JlZW4nKSkge1xuICAgICAgdGhpcy5zaG93T25GdWxsc2NyZWVuID0gc2V0dGluZ3Muc2hvd09uRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdzaG93U2Vjb25kcycpKSB7XG4gICAgICB0aGlzLnNob3dTZWNvbmRzID0gc2V0dGluZ3Muc2hvd1NlY29uZHMgIT09IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaGFzT3duKHNldHRpbmdzLCAnc2hvd1Byb2dyZXNzJykpIHtcbiAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gc2V0dGluZ3Muc2hvd1Byb2dyZXNzICE9PSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ2F1dG9IaWRlJykpIHtcbiAgICAgIHRoaXMuYXV0b0hpZGUgPSBzZXR0aW5ncy5hdXRvSGlkZSA9PT0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ2xheW91dE1vZGUnKSkge1xuICAgICAgdGhpcy5sYXlvdXRNb2RlID0gc2V0dGluZ3MubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0JyA/ICdmbG9hdCcgOiAnc25hcCc7XG4gICAgfVxuICAgIGlmIChoYXNPd24oc2V0dGluZ3MsICdmbG9hdFBvc2l0aW9uVmlkZW8nKSkge1xuICAgICAgdGhpcy5mbG9hdFBvc2l0aW9uVmlkZW8gPSBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uVmlkZW8gfHwgbnVsbDtcbiAgICB9XG4gICAgaWYgKGhhc093bihzZXR0aW5ncywgJ2Zsb2F0UG9zaXRpb25XaW5kb3cnKSkge1xuICAgICAgdGhpcy5mbG9hdFBvc2l0aW9uV2luZG93ID0gc2V0dGluZ3MuZmxvYXRQb3NpdGlvbldpbmRvdyB8fCBudWxsO1xuICAgIH1cblxuICAgIC8vIFJlLXRyYW5zbGF0ZSB0aGUgY2xvc2UgYnV0dG9uIHRpdGxlIHdoZW4gc2V0dGluZ3MvbGFuZ3VhZ2UgYXJlIHJlLWFwcGxpZWQuXG4gICAgaWYgKHRoaXMuX2Nsb3NlQnRuKSB7XG4gICAgICB0aGlzLl9jbG9zZUJ0bi50aXRsZSA9IHQoJ2Nsb3NlQnRuVGl0bGUnKTtcbiAgICB9XG4gIH1cblxuICBkaXNwbGF5VHlwZSgpIHtcbiAgICByZXR1cm4gJ21lZGlhJztcbiAgfVxuXG4gIGlzU2hvd2luZygpIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcbiAgfVxuXG4gIF9mbG9hdFN0b3JhZ2VLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheVR5cGUoKSA9PT0gJ3dpbmRvdy1vdmVybGF5J1xuICAgICAgPyAnZmxvYXRQb3NpdGlvbldpbmRvdydcbiAgICAgIDogJ2Zsb2F0UG9zaXRpb25WaWRlbyc7XG4gIH1cblxuICBfZ2V0RmxvYXRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwbGF5VHlwZSgpID09PSAnd2luZG93LW92ZXJsYXknXG4gICAgICA/IHRoaXMuZmxvYXRQb3NpdGlvbldpbmRvd1xuICAgICAgOiB0aGlzLmZsb2F0UG9zaXRpb25WaWRlbztcbiAgfVxuXG4gIF9zZXRGbG9hdFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMuZGlzcGxheVR5cGUoKSA9PT0gJ3dpbmRvdy1vdmVybGF5Jykge1xuICAgICAgdGhpcy5mbG9hdFBvc2l0aW9uV2luZG93ID0gcG9zaXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmxvYXRQb3NpdGlvblZpZGVvID0gcG9zaXRpb247XG4gICAgfVxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgW3RoaXMuX2Zsb2F0U3RvcmFnZUtleSgpXTogcG9zaXRpb24gfSk7XG4gIH1cblxuICAvLyAtLS0gZWxlbWVudCBjcmVhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBjcmVhdGVUaW1lRWxlbWVudCgpIHtcbiAgICBjb25zdCB0aW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLmNvbG9yID0gJ3doaXRlJztcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzVweCc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSc7XG4gICAgdGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94JztcblxuICAgIC8vIOeLrOeri+aWh+Wtl+WuueWZqO+8iOS4jiDDlyDmjInpkq7lubbliJfvvIzpgb/lhY0gdXBkYXRlVGltZSDor6/liKDmjInpkq7vvIlcbiAgICBjb25zdCB0ZXh0U3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB0ZXh0U3Bhbi50ZXh0Q29udGVudCA9ICcwMDowMCAvIDAwOjAwJztcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4gPSB0ZXh0U3BhbjtcbiAgICB0aW1lRWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0U3Bhbik7XG5cbiAgICBjb25zdCBjbG9zZUJ0biA9IHRoaXMuX2NyZWF0ZUNsb3NlQnV0dG9uKCk7XG4gICAgdGhpcy5fY2xvc2VCdG4gPSBjbG9zZUJ0bjtcblxuICAgIC8vIOS9v+eUqCBtb3VzZW92ZXIvbW91c2VvdXQgKyByZWxhdGVkVGFyZ2V0IOWkhOeQhiBob3Zlcu+8jOmBv+WFjee7neWvueWumuS9jeWtkOWFg+e0oOWvvOiHtOeahOS6i+S7tumXrumimFxuICAgIHRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCAoKSA9PiB7IGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snOyB9KTtcbiAgICB0aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8g5b2T6byg5qCH56a75byAIHRpbWVFbGVtZW50IOS4lOacqui/m+WFpSBjbG9zZUJ0biDml7bmiY3pmpDol49cbiAgICAgIC8vIOW7tui/n+iuqSBtb3VzZWVudGVyIGNsb3NlQnRuIOacieacuuS8muinpuWPkVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9mb3JjZUNsb3NlVmlzaWJsZSkgcmV0dXJuO1xuICAgICAgICBpZiAoY2xvc2VCdG4uc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnICYmICFjbG9zZUJ0bi5tYXRjaGVzKCc6aG92ZXInKSkge1xuICAgICAgICAgIGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgIH0sIDUwKTtcbiAgICB9KTtcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9mb3JjZUNsb3NlVmlzaWJsZSkgY2xvc2VCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9KTtcblxuICAgIHRpbWVFbGVtZW50LmFwcGVuZENoaWxkKGNsb3NlQnRuKTtcbiAgICByZXR1cm4gdGltZUVsZW1lbnQ7XG4gIH1cblxuICAvLyDliJvlu7rlj7PkuIrop5LlhbPpl63mjInpkq4gw5fvvIjkvY3kuo4gdGltZUVsZW1lbnQg5YaF6YOo5Y+z5LiK6KeS77yJXG4gIF9jcmVhdGVDbG9zZUJ1dHRvbigpIHtcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYnRuLnRleHRDb250ZW50ID0gJ8OXJztcbiAgICBidG4udGl0bGUgPSB0KCdjbG9zZUJ0blRpdGxlJyk7XG4gICAgT2JqZWN0LmFzc2lnbihidG4uc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAnMXB4JyxcbiAgICAgIHJpZ2h0OiAnMXB4JyxcbiAgICAgIHdpZHRoOiAnMThweCcsXG4gICAgICBoZWlnaHQ6ICcxOHB4JyxcbiAgICAgIGxpbmVIZWlnaHQ6ICcxOHB4JyxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMC43KScsXG4gICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICB6SW5kZXg6ICcxMDAwMDAwJyxcbiAgICAgIGJveFNoYWRvdzogJzAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMyknLFxuICAgICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgcG9pbnRlckV2ZW50czogJ2F1dG8nXG4gICAgfSk7XG5cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmRvd24nLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7IC8vIOmYu+atouaLluaLvVxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7XG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB0aGlzLmhhbmRsZURpc21pc3MoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBidG47XG4gIH1cblxuICBoYW5kbGVEaXNtaXNzKCkge1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmcy10aW1lLWRpc21pc3MnLCB7XG4gICAgICBkZXRhaWw6IHsgZGlzcGxheVR5cGU6IHRoaXMuZGlzcGxheVR5cGUoKSB9XG4gICAgfSkpO1xuICB9XG5cbiAgLy8gLS0tIHZpc2liaWxpdHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgY2hlY2tJc1RvU2hvdygpIHtcbiAgICBpZiAoIXRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmc0VsID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKTtcbiAgICBpZiAoIWZzRWwgfHwgIXRoaXMubWVkaWEpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiBmc0VsID09PSB0aGlzLm1lZGlhIHx8XG4gICAgICAgICAgIGZzRWwuY29udGFpbnModGhpcy5tZWRpYSkgfHxcbiAgICAgICAgICAgdGhpcy5tZWRpYS5jb250YWlucyhmc0VsKTtcbiAgfVxuXG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tJc1RvU2hvdygpKSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgX3Jlc2V0Q2xvc2VCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLl9jbG9zZUJ0bikgcmV0dXJuO1xuICAgIHRoaXMuX2Nsb3NlQnRuLnN0eWxlLmRpc3BsYXkgPSB0aGlzLl9mb3JjZUNsb3NlVmlzaWJsZSA/ICdibG9jaycgOiAnbm9uZSc7XG4gIH1cblxuICBfZ2V0RG9tUGFyZW50KGZzRWwpIHtcbiAgICByZXR1cm4gZnNFbCB8fCBkb2N1bWVudC5ib2R5O1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcblxuICAgIGNvbnN0IGZzRWwgPSBnZXRGdWxsc2NyZWVuRWxlbWVudCgpO1xuICAgIGNvbnN0IG5hdGl2ZVZpZGVvRnVsbHNjcmVlbiA9IGlzVmlkZW9FbGVtZW50KGZzRWwpO1xuXG4gICAgLy8gTmF0aXZlIDx2aWRlbz4gZnVsbHNjcmVlbiByZW5kZXJzIGluIGl0cyBvd24gdG9wIGxheWVyLiBBIHJlZ3VsYXIgRE9NXG4gICAgLy8gY2hpbGQgKGV2ZW4gaW5zaWRlIHRoZSB2aWRlbykgaXMgcGFpbnRlZCB1bmRlcm5lYXRoIHRoZSB2aWRlby4gVXNlIHRoZVxuICAgIC8vIFBvcG92ZXIgQVBJIHRvIHByb21vdGUgdGhlIG92ZXJsYXkgaW50byB0aGUgYnJvd3NlciB0b3AgbGF5ZXIgaW5zdGVhZC5cbiAgICBpZiAobmF0aXZlVmlkZW9GdWxsc2NyZWVuICYmICFQT1BPVkVSX1NVUFBPUlRFRCkge1xuICAgICAgLy8gVW5zdXBwb3J0ZWQgQVBJOiBubyBwb2ludCByZXRyeWluZzsgZ28gdGhyb3VnaCBzaGFyZWQgY2xlYW51cC5cbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVzZVBvcG92ZXIgPSBuYXRpdmVWaWRlb0Z1bGxzY3JlZW4gJiYgUE9QT1ZFUl9TVVBQT1JURUQ7XG4gICAgdGhpcy5fdmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5fcG9wb3Zlck1vZGUgPSB1c2VQb3BvdmVyO1xuXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgdGhpcy5fYXBwbHlQb2ludGVyTW9kZSh1c2VQb3BvdmVyKTtcbiAgICB0aGlzLl9yZXNldENsb3NlQnV0dG9uKCk7XG5cbiAgICBpZiAodXNlUG9wb3Zlcikge1xuICAgICAgaWYgKGRvY3VtZW50LmJvZHkgJiYgdGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XG4gICAgICB9XG4gICAgICAvLyBOZXZlciBmb3JjZSBkaXNwbGF5OmJsb2NrIGJlZm9yZSBzaG93UG9wb3ZlcigpLiBMZXQgdGhlIFVBXG4gICAgICAvLyBbcG9wb3Zlcl06bm90KDpwb3BvdmVyLW9wZW4pIHJ1bGUga2VlcCBhIGNsb3NlZCBwb3BvdmVyIGhpZGRlbi5cbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgaWYgKCF0aGlzLl9zaG93UG9wb3ZlcigpKSB7XG4gICAgICAgIC8vIFRyYW5zaWVudCBmYWlsdXJlIHdoaWxlIHN0aWxsIGluIG5hdGl2ZSB2aWRlbyBmdWxsc2NyZWVuOiBjbGVhbiB1cFxuICAgICAgICAvLyBhbmQgcmV0cnkgYSBib3VuZGVkIG51bWJlciBvZiB0aW1lcy5cbiAgICAgICAgdGhpcy5faGFuZGxlUG9wb3ZlckZhaWx1cmUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnkoKTtcbiAgICAgIC8vIE1lYXN1cmUvcG9zaXRpb24gYWZ0ZXIgcHJvbW90aW9uIHNvIG9mZnNldFdpZHRoL0hlaWdodCBhcmUgcmVhbC5cbiAgICAgIHRoaXMuX3Bvc2l0aW9uRWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeSgpO1xuICAgICAgdGhpcy5fdGVhcmRvd25Qb3BvdmVyKCk7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXREb21QYXJlbnQoZnNFbCk7XG4gICAgICBpZiAocGFyZW50ICYmIHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gcGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLl9wb3NpdGlvbkVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcblxuICAgIC8vIEEgcG9wb3ZlciBjb250YWluZXIgaXMgcG9pbnRlci1ldmVudHM6bm9uZSAoZGlzcGxheS1vbmx5KSwgc28gZHJhZ2dpbmdcbiAgICAvLyBpcyBub3QgcG9zc2libGUvbWVhbmluZ2Z1bCB0aGVyZS5cbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnZmxvYXQnICYmICF1c2VQb3BvdmVyKSB7XG4gICAgICB0aGlzLnNldHVwRHJhZ2dpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcbiAgICAgIHRoaXMuc3RhcnRBdXRvSGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xuICAgICAgdGhpcy50ZWFyZG93bldha2VMaXN0ZW5lcigpO1xuICAgICAgdGhpcy5fcmVzdG9yZVBvaW50ZXJFdmVudHMoKTtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICB9XG4gIH1cblxuICAvLyBTaGFyZWQgdmlzaWJpbGl0eSBjbGVhbnVwIHVzZWQgYnkgaGlkZSgpIGFuZCBwb3BvdmVyIGZhaWx1cmUgaGFuZGxpbmcuXG4gIF9jbGVhbnVwRm9ySGlkZSgpIHtcbiAgICB0aGlzLl92aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLnRlYXJkb3duV2FrZUxpc3RlbmVyKCk7XG4gICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XG4gICAgdGhpcy5fdGVhcmRvd25Qb3BvdmVyKCk7XG5cbiAgICBpZiAodGhpcy50aW1lRWxlbWVudCkge1xuICAgICAgLy8gQWZ0ZXIgaGlkZVBvcG92ZXIoKS9hdHRyaWJ1dGUgcmVtb3ZhbCwgZXhwbGljaXRseSBoaWRlIHRoZSBub2RlLlxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgICAgaWYgKHRoaXMuX2Nsb3NlQnRuKSB0aGlzLl9jbG9zZUJ0bi5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgICAgdGhpcy5fZm9yY2VDbG9zZVZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3Jlc2V0Q2xvc2VCdXR0b24oKTtcbiAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5fY2xlYW51cEZvckhpZGUoKTtcbiAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeSgpO1xuICB9XG5cbiAgX2NsZWFyUG9wb3ZlclJldHJ5VGltZXIoKSB7XG4gICAgaWYgKHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fcG9wb3ZlclJldHJ5VGltZXIpO1xuICAgICAgdGhpcy5fcG9wb3ZlclJldHJ5VGltZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF9jbGVhclBvcG92ZXJSZXRyeSgpIHtcbiAgICB0aGlzLl9jbGVhclBvcG92ZXJSZXRyeVRpbWVyKCk7XG4gICAgdGhpcy5fcG9wb3ZlclJldHJ5Q291bnQgPSAwO1xuICB9XG5cbiAgX2hhbmRsZVBvcG92ZXJGYWlsdXJlKCkge1xuICAgIGNvbnN0IGNhblJldHJ5ID0gaXNWaWRlb0VsZW1lbnQoZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKSk7XG4gICAgdGhpcy5fY2xlYW51cEZvckhpZGUoKTtcbiAgICBpZiAoY2FuUmV0cnkpIHtcbiAgICAgIHRoaXMuX3NjaGVkdWxlUG9wb3ZlclJldHJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsZWFyUG9wb3ZlclJldHJ5VGltZXIoKTtcbiAgICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID0gMDtcbiAgICB9XG4gIH1cblxuICBfc2NoZWR1bGVQb3BvdmVyUmV0cnkoKSB7XG4gICAgaWYgKHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID49IDMpIHJldHVybjtcblxuICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ICs9IDE7XG4gICAgdGhpcy5fY2xlYXJQb3BvdmVyUmV0cnlUaW1lcigpO1xuICAgIHRoaXMuX3BvcG92ZXJSZXRyeVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9wb3BvdmVyUmV0cnlUaW1lciA9IG51bGw7XG4gICAgICBpZiAoIWlzVmlkZW9FbGVtZW50KGdldEZ1bGxzY3JlZW5FbGVtZW50KCkpKSB7XG4gICAgICAgIHRoaXMuX3BvcG92ZXJSZXRyeUNvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmNoZWNrSXNUb1Nob3coKSkge1xuICAgICAgICB0aGlzLl9wb3BvdmVyUmV0cnlDb3VudCA9IDA7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xuICAgIH0sIDEwMCk7XG4gIH1cblxuICAvLyAtLS0gcGxhY2VtZW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBfcG9zaXRpb25FbGVtZW50KCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG4gICAgLy8gQSBmdWxsc2NyZWVuIGVsZW1lbnQgY292ZXJzIHRoZSB2aWV3cG9ydCwgc28gdmlld3BvcnQtZml4ZWQgY29vcmRpbmF0ZXNcbiAgICAvLyB3b3JrIGZvciBjb250YWluZXItYXBwZW5kLCBwb3BvdmVyLCBicm93c2VyIGFuZCB3aW5kb3cgbW9kZXMgYWxpa2UuXG4gICAgLy8gVXNpbmcgZml4ZWQgZXZlcnl3aGVyZSBhbHNvIG1ha2VzIGRyYWctZW5kIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgLy8gY29vcmRpbmF0ZXMgcmV1c2FibGUgb24gdGhlIG5leHQgc2hvdy5cbiAgICB0aGlzLl9wb3NpdGlvbk1vZGUgPSAnZml4ZWQnO1xuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnRpbWVFbGVtZW50LnN0eWxlO1xuICAgIHN0eWxlLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb25Nb2RlO1xuICAgIHN0eWxlLm1hcmdpbiA9ICcwJztcbiAgICBzdHlsZS5yaWdodCA9ICdhdXRvJztcbiAgICBzdHlsZS5ib3R0b20gPSAnYXV0byc7XG4gICAgc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xuICAgIHN0eWxlLnRyYW5zZm9ybSA9ICdub25lJztcblxuICAgIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdmbG9hdCcpIHtcbiAgICAgIGNvbnN0IHNhdmVkID0gdGhpcy5fZ2V0RmxvYXRQb3NpdGlvbigpO1xuICAgICAgaWYgKHNhdmVkKSB7XG4gICAgICAgIHRoaXMuX2FwcGx5RmxvYXRQb3NpdGlvbihzYXZlZCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN0eWxlLmxlZnQgPSAnNTAlJztcbiAgICAgIHN0eWxlLnRvcCA9ICcyMHB4JztcbiAgICAgIHN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUubGVmdCA9ICc1MCUnO1xuICAgICAgc3R5bGUudG9wID0gJzEwcHgnO1xuICAgICAgc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xuICAgIH1cbiAgfVxuXG4gIF9jbGFtcFBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMudGltZUVsZW1lbnQ7XG4gICAgY29uc3Qgd2lkdGggPSBlbGVtZW50ID8gKGVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMCkgOiAwO1xuICAgIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMCkgOiAwO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCgwLCB3aW5kb3cuaW5uZXJXaWR0aCAtIHdpZHRoKTtcbiAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoMCwgd2luZG93LmlubmVySGVpZ2h0IC0gaGVpZ2h0KTtcbiAgICBjb25zdCByYXdYID0gTnVtYmVyKHBvc2l0aW9uICYmIHBvc2l0aW9uLngpO1xuICAgIGNvbnN0IHJhd1kgPSBOdW1iZXIocG9zaXRpb24gJiYgcG9zaXRpb24ueSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBOdW1iZXIuaXNGaW5pdGUocmF3WCkgPyByYXdYIDogMCksIG1heFgpKSxcbiAgICAgIHk6IE1hdGgucm91bmQoTWF0aC5taW4oTWF0aC5tYXgoMCwgTnVtYmVyLmlzRmluaXRlKHJhd1kpID8gcmF3WSA6IDApLCBtYXhZKSlcbiAgICB9O1xuICB9XG5cbiAgX2FwcGx5RmxvYXRQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIGNvbnN0IGNsYW1wZWQgPSB0aGlzLl9jbGFtcFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gdGhpcy5fcG9zaXRpb25Nb2RlO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2NsYW1wZWQueH1weGA7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHtjbGFtcGVkLnl9cHhgO1xuICB9XG5cbiAgaGFuZGxlUmVzaXplKCkge1xuICAgIGlmICghdGhpcy5fdmlzaWJsZSB8fCB0aGlzLmxheW91dE1vZGUgIT09ICdmbG9hdCcgfHwgdGhpcy5faXNEcmFnZ2luZykgcmV0dXJuO1xuICAgIGNvbnN0IHNhdmVkID0gdGhpcy5fZ2V0RmxvYXRQb3NpdGlvbigpO1xuICAgIGlmIChzYXZlZCkgdGhpcy5fYXBwbHlGbG9hdFBvc2l0aW9uKHNhdmVkKTtcbiAgfVxuXG4gIC8vIC0tLSBwb3BvdmVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIF9zaG93UG9wb3ZlcigpIHtcbiAgICBpZiAoIVBPUE9WRVJfU1VQUE9SVEVEIHx8ICF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm4gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdwb3BvdmVyJywgJ21hbnVhbCcpO1xuICAgICAgLy8gUmUtc2hvd2luZyBwcm9tb3RlcyB0aGUgb3ZlcmxheSBhYm92ZSB0aGUgZnVsbHNjcmVlbiBiYWNrZHJvcCBvblxuICAgICAgLy8gZXZlcnkgZnVsbHNjcmVlbmNoYW5nZS5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuaGlkZVBvcG92ZXIoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gbm90IGN1cnJlbnRseSBvcGVuXG4gICAgICB9XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnNob3dQb3BvdmVyKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgX2hpZGVQb3BvdmVyKCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCB8fCAhUE9QT1ZFUl9TVVBQT1JURUQpIHJldHVybjtcbiAgICB0cnkge1xuICAgICAgdGhpcy50aW1lRWxlbWVudC5oaWRlUG9wb3ZlcigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIG5vdCBjdXJyZW50bHkgb3BlbiAvIHVuc3VwcG9ydGVkIHN0YXRlXG4gICAgfVxuICB9XG5cbiAgX3RlYXJkb3duUG9wb3ZlcigpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICBpZiAoUE9QT1ZFUl9TVVBQT1JURUQgJiYgdGhpcy50aW1lRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3BvcG92ZXInKSkge1xuICAgICAgdGhpcy5faGlkZVBvcG92ZXIoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGltZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdwb3BvdmVyJykpIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdwb3BvdmVyJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tIHBvaW50ZXIgLyBkcmFnIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgX2FwcGx5UG9pbnRlck1vZGUodXNlUG9wb3Zlcikge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIC8vIFBvcG92ZXIgb3ZlcmxheXMgc2l0IGFib3ZlIGEgbmF0aXZlIGZ1bGxzY3JlZW4gdmlkZW8gYW5kIGFyZVxuICAgIC8vIGRpc3BsYXktb25seTsgdGhlIGNsb3NlIGJ1dHRvbiBpcyBiZXN0LWVmZm9ydCBpbnRlcmFjdGl2ZS5cbiAgICB0aGlzLl9mb3JjZUNsb3NlVmlzaWJsZSA9IHVzZVBvcG92ZXI7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gdXNlUG9wb3ZlciA/ICdub25lJyA6ICdhdXRvJztcbiAgICBpZiAodGhpcy5fY2xvc2VCdG4pIHtcbiAgICAgIHRoaXMuX2Nsb3NlQnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgICB0aGlzLl9yZXNldENsb3NlQnV0dG9uKCk7XG4gICAgfVxuICB9XG5cbiAgX3Jlc3RvcmVQb2ludGVyRXZlbnRzKCkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9IHRoaXMuX3BvcG92ZXJNb2RlID8gJ25vbmUnIDogJ2F1dG8nO1xuICAgIGlmICh0aGlzLl9jbG9zZUJ0bikge1xuICAgICAgdGhpcy5fY2xvc2VCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcbiAgICB9XG4gIH1cblxuICBzZXR1cERyYWdnaW5nKCkge1xuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIC8vIFBvcG92ZXIgY29udGFpbmVycyBhcmUgcG9pbnRlci1ldmVudHM6bm9uZTsgbm8gZHJhZyB0aGVyZS5cbiAgICBpZiAodGhpcy5fcG9wb3Zlck1vZGUpIHJldHVybjtcblxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3VjaEFjdGlvbiA9ICdub25lJztcblxuICAgIHRoaXMuX2JvdW5kUG9pbnRlckRvd24gPSAoZSkgPT4gdGhpcy5fb25EcmFnU3RhcnQoZSk7XG4gICAgdGhpcy5fYm91bmRQb2ludGVyTW92ZSA9IChlKSA9PiB0aGlzLl9vbkRyYWdNb3ZlKGUpO1xuICAgIHRoaXMuX2JvdW5kUG9pbnRlclVwID0gKGUpID0+IHRoaXMuX29uRHJhZ0VuZChlKTtcbiAgICB0aGlzLl9ib3VuZFBvaW50ZXJDYW5jZWwgPSAoZSkgPT4gdGhpcy5fb25EcmFnRW5kKGUpO1xuXG4gICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyZG93bicsIHRoaXMuX2JvdW5kUG9pbnRlckRvd24pO1xuICAgIHRoaXMudGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlKTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJ1cCcsIHRoaXMuX2JvdW5kUG9pbnRlclVwKTtcbiAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLl9ib3VuZFBvaW50ZXJDYW5jZWwpO1xuICB9XG5cbiAgdGVhcmRvd25EcmFnZ2luZygpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICcnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudXNlclNlbGVjdCA9ICcnO1xuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG91Y2hBY3Rpb24gPSAnJztcblxuICAgIGlmICh0aGlzLl9ib3VuZFBvaW50ZXJEb3duKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fYm91bmRQb2ludGVyRG93bik7XG4gICAgICB0aGlzLl9ib3VuZFBvaW50ZXJEb3duID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2JvdW5kUG9pbnRlck1vdmUpIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcm1vdmUnLCB0aGlzLl9ib3VuZFBvaW50ZXJNb3ZlKTtcbiAgICAgIHRoaXMuX2JvdW5kUG9pbnRlck1vdmUgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5fYm91bmRQb2ludGVyVXApIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncG9pbnRlcnVwJywgdGhpcy5fYm91bmRQb2ludGVyVXApO1xuICAgICAgdGhpcy5fYm91bmRQb2ludGVyVXAgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsKSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJjYW5jZWwnLCB0aGlzLl9ib3VuZFBvaW50ZXJDYW5jZWwpO1xuICAgICAgdGhpcy5fYm91bmRQb2ludGVyQ2FuY2VsID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IG51bGw7XG4gIH1cblxuICBfb25EcmFnU3RhcnQoZSkge1xuICAgIGlmICghdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIGlmIChlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnICYmIGUuYnV0dG9uICE9PSAwKSByZXR1cm47XG4gICAgLy8gQ2xpY2tpbmcgdGhlIGNsb3NlIGJ1dHRvbiBtdXN0IG5vdCBzdGFydCBhIGRyYWcuXG4gICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLl9jbG9zZUJ0biB8fFxuICAgICAgICAodGhpcy5fY2xvc2VCdG4gJiYgdGhpcy5fY2xvc2VCdG4uY29udGFpbnMoZS50YXJnZXQpKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSB0cnVlO1xuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IGUucG9pbnRlcklkO1xuXG4gICAgY29uc3QgcmVjdCA9IHRoaXMudGltZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5fZHJhZ09mZnNldCA9IHsgeDogZS5jbGllbnRYIC0gcmVjdC5sZWZ0LCB5OiBlLmNsaWVudFkgLSByZWN0LnRvcCB9O1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc2V0UG9pbnRlckNhcHR1cmUoZS5wb2ludGVySWQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gcG9pbnRlciBjYXB0dXJlIGlzIGJlc3QtZWZmb3J0XG4gICAgfVxuXG4gICAgdGhpcy5fd2FrZSgpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfVxuXG4gIF9vbkRyYWdNb3ZlKGUpIHtcbiAgICBpZiAoIXRoaXMuX2lzRHJhZ2dpbmcgfHwgIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICBpZiAodGhpcy5fYWN0aXZlUG9pbnRlcklkICE9PSBudWxsICYmIGUucG9pbnRlcklkICE9PSB0aGlzLl9hY3RpdmVQb2ludGVySWQpIHJldHVybjtcblxuICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fY2xhbXBQb3NpdGlvbih7XG4gICAgICB4OiBlLmNsaWVudFggLSB0aGlzLl9kcmFnT2Zmc2V0LngsXG4gICAgICB5OiBlLmNsaWVudFkgLSB0aGlzLl9kcmFnT2Zmc2V0LnlcbiAgICB9KTtcblxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB0aGlzLl9wb3NpdGlvbk1vZGU7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24ueH1weGA7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHtwb3NpdGlvbi55fXB4YDtcblxuICAgIHRoaXMuX3dha2UoKTtcbiAgfVxuXG4gIF9vbkRyYWdFbmQoZSkge1xuICAgIGlmICghdGhpcy5faXNEcmFnZ2luZyB8fCAhdGhpcy50aW1lRWxlbWVudCkgcmV0dXJuO1xuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9hY3RpdmVQb2ludGVySWQgIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50Lmhhc1BvaW50ZXJDYXB0dXJlICYmXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50Lmhhc1BvaW50ZXJDYXB0dXJlKHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCkpIHtcbiAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbGVhc2VQb2ludGVyQ2FwdHVyZSh0aGlzLl9hY3RpdmVQb2ludGVySWQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gaWdub3JlXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2ZVBvaW50ZXJJZCA9IG51bGw7XG5cbiAgICBjb25zdCByZWN0ID0gdGhpcy50aW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX2NsYW1wUG9zaXRpb24oeyB4OiByZWN0LmxlZnQsIHk6IHJlY3QudG9wIH0pO1xuICAgIHRoaXMuX3NldEZsb2F0UG9zaXRpb24ocG9zaXRpb24pO1xuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHRoaXMuX3dha2UoKTtcbiAgfVxuXG4gIC8vIC0tLSBhdXRvIGhpZGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHN0YXJ0QXV0b0hpZGUoKSB7XG4gICAgaWYgKCF0aGlzLnRpbWVFbGVtZW50KSByZXR1cm47XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgIHRoaXMuX3Jlc3RvcmVQb2ludGVyRXZlbnRzKCk7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLl9zZXR1cFdha2VMaXN0ZW5lcigpO1xuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xuICB9XG5cbiAgY2xlYXJBdXRvSGlkZVRpbWVyKCkge1xuICAgIGlmICh0aGlzLmF1dG9IaWRlVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmF1dG9IaWRlVGltZXIpO1xuICAgICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfc2V0dXBXYWtlTGlzdGVuZXIoKSB7XG4gICAgdGhpcy50ZWFyZG93bldha2VMaXN0ZW5lcigpO1xuICAgIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIgPSAoKSA9PiB0aGlzLl93YWtlKCk7XG5cbiAgICAvLyBXYWtlIG9uIGFjdGl2aXR5IGFueXdoZXJlIGluIHRoZSBmdWxsc2NyZWVuIGNvbnRhaW5lci9kb2N1bWVudCwgbm90XG4gICAgLy8gb25seSBvdmVyIHRoZSA8dmlkZW8+IGVsZW1lbnQuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50KSB7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kV2FrZUhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRlYXJkb3duV2FrZUxpc3RlbmVyKCkge1xuICAgIGlmICh0aGlzLl9ib3VuZFdha2VIYW5kbGVyKSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZFdha2VIYW5kbGVyKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICBpZiAodGhpcy50aW1lRWxlbWVudCkge1xuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJkb3duJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRXYWtlSGFuZGxlcik7XG4gICAgICB9XG4gICAgICB0aGlzLl9ib3VuZFdha2VIYW5kbGVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfd2FrZSgpIHtcbiAgICBpZiAoIXRoaXMuYXV0b0hpZGUgfHwgIXRoaXMuX3Zpc2libGUgfHwgIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgdGhpcy5fcmVzdG9yZVBvaW50ZXJFdmVudHMoKTtcbiAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xuICB9XG5cbiAgZmFkZU91dCgpIHtcbiAgICBpZiAoIXRoaXMudGltZUVsZW1lbnQpIHJldHVybjtcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIGlmICh0aGlzLl9jbG9zZUJ0bikgdGhpcy5fY2xvc2VCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBudWxsO1xuICB9XG5cbiAgLy8gLS0tIHRpbWUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgX3N5c3RlbVRpbWUoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd1NlY29uZHNcbiAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXG4gICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgfVxuXG4gIHVwZGF0ZVRpbWUoKSB7XG4gICAgaWYgKCF0aGlzLl90aW1lVGV4dFNwYW4pIHJldHVybjtcbiAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5fc3lzdGVtVGltZSgpO1xuXG4gICAgaWYgKHRoaXMuc2hvd1Byb2dyZXNzICYmIHRoaXMubWVkaWEpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gTnVtYmVyKHRoaXMubWVkaWEuY3VycmVudFRpbWUpO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBOdW1iZXIodGhpcy5tZWRpYS5kdXJhdGlvbik7XG4gICAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPVxuICAgICAgICBgJHtmb3JtYXRUaW1lKGN1cnJlbnRUaW1lKX0gLyAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSB8ICR7c3lzdGVtVGltZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPSBzeXN0ZW1UaW1lO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLSB0ZWFyZG93biAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2NsZWFyUG9wb3ZlclJldHJ5KCk7XG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcbiAgICB0aGlzLnRlYXJkb3duV2FrZUxpc3RlbmVyKCk7XG4gICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XG4gICAgdGhpcy5fdGVhcmRvd25Qb3BvdmVyKCk7XG5cbiAgICBpZiAodGhpcy50aW1lRWxlbWVudCAmJiB0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4gPSBudWxsO1xuICAgIHRoaXMuX2Nsb3NlQnRuID0gbnVsbDtcbiAgICB0aGlzLm1lZGlhID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IGV4dGVuZHMgVGltZURpc3BsYXkge1xuICBkaXNwbGF5VHlwZSgpIHtcbiAgICByZXR1cm4gJ3dpbmRvdy1vdmVybGF5JztcbiAgfVxuXG4gIGNoZWNrSXNUb1Nob3coKSB7XG4gICAgaWYgKCF0aGlzLnNob3dPbkZ1bGxzY3JlZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBmc0VsID0gZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKTtcblxuICAgIC8vIOWFg+e0oOWFqOWxj++8iOinhumikeWFqOWxj++8ieaXtu+8muWmguaenOinhumikeS4k+eUqOaYvuekuuW3suW8gOWQr++8jOS4jeWGjemHjeWkjeaYvuekulxuICAgIGlmIChmc0VsICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gIXRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW47XG4gICAgfVxuXG4gICAgLy8g5rWP6KeI5Zmo5YWo5bGP77yIRjEx77yJ5pe25pi+56S6XG4gICAgcmV0dXJuIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xuICB9XG5cbiAgdXBkYXRlVGltZSgpIHtcbiAgICBpZiAoIXRoaXMuX3RpbWVUZXh0U3BhbikgcmV0dXJuO1xuICAgIHRoaXMuX3RpbWVUZXh0U3Bhbi50ZXh0Q29udGVudCA9IHRoaXMuX3N5c3RlbVRpbWUoKTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7XG4gIFRpbWVEaXNwbGF5LFxuICBXaW5kb3dPdmVybGF5VGltZURpc3BsYXksXG4gIGdldEZ1bGxzY3JlZW5FbGVtZW50LFxuICBGVUxMU0NSRUVOX0VWRU5UU1xufSBmcm9tICcuL3dpZGdldHMnO1xuaW1wb3J0IHsgdCwgaW5pdCwgcmVsb2FkRnJvbVN0b3JhZ2UgfSBmcm9tICcuL2kxOG4nO1xuXG5jb25zdCBJU19UT1BfRlJBTUUgPSB3aW5kb3cudG9wID09PSB3aW5kb3c7XG5jb25zdCBNQVhfU0NBTl9SRVRSSUVTID0gNTtcblxuLy8g5Yid5aeL5YyW6Ieq5a6a5LmJIGkxOG7vvIjlvILmraXliqDovb3nv7vor5HvvIlcbmluaXQoKTtcblxuZnVuY3Rpb24gbG9nVG9wKC4uLmFyZ3MpIHtcbiAgaWYgKElTX1RPUF9GUkFNRSkgY29uc29sZS5sb2coLi4uYXJncyk7XG59XG5cbmxvZ1RvcCh0KCdtc2dMb2FkZWQnKSk7XG5cbi8vIC0tLSBjZW50cmFsaXplZCBzZXR0aW5ncyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUyA9IHtcbiAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXG4gIHNob3dPbkZ1bGxzY3JlZW46IHRydWUsXG4gIHNob3dTZWNvbmRzOiB0cnVlLFxuICBzaG93UHJvZ3Jlc3M6IHRydWUsXG4gIGF1dG9IaWRlOiBmYWxzZSxcbiAgbGF5b3V0TW9kZTogJ3NuYXAnLFxuICBmbG9hdFBvc2l0aW9uVmlkZW86IG51bGwsXG4gIGZsb2F0UG9zaXRpb25XaW5kb3c6IG51bGxcbn07XG5cbmNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUyk7XG5cbmNvbnN0IFNFVFRJTkdfS0VZUyA9IFtcbiAgJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyxcbiAgJ3Nob3dPbkZ1bGxzY3JlZW4nLFxuICAnc2hvd1NlY29uZHMnLFxuICAnc2hvd1Byb2dyZXNzJyxcbiAgJ2F1dG9IaWRlJyxcbiAgJ2xheW91dE1vZGUnLFxuICAnZmxvYXRQb3NpdGlvblZpZGVvJyxcbiAgJ2Zsb2F0UG9zaXRpb25XaW5kb3cnXG5dO1xuXG4vLyB2aWRlbyAtPiB3aWRnZXQgKHByZXZlbnRzIGR1cGxpY2F0ZSBiaW5kaW5nKVxuY29uc3QgdmlkZW9XaWRnZXRzID0gbmV3IFdlYWtNYXAoKTtcbi8vIGl0ZXJhYmxlIGNvbXBhbmlvbiB0byB0aGUgV2Vha01hcCAoV2Vha01hcCBpcyBub3QgaXRlcmFibGUpXG5jb25zdCB0cmFja2VkVmlkZW9zID0gbmV3IFNldCgpO1xuXG5sZXQgb3ZlcmxheVRpbWVEaXNwID0gSVNfVE9QX0ZSQU1FXG4gID8gbmV3IFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheShkb2N1bWVudC5ib2R5IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcbiAgOiBudWxsO1xuXG4vLyBBbGwgdGltZXJzIGNyZWF0ZWQgYnkgaW5kZXggYXJlIHRyYWNrZWQgc28gdGVhcmRvd24gY2FuIGNsZWFyIHRoZW0uXG5jb25zdCBwZW5kaW5nVGltZW91dHMgPSBuZXcgU2V0KCk7XG5cbmZ1bmN0aW9uIHNjaGVkdWxlVGltZW91dChjYWxsYmFjaywgZGVsYXkpIHtcbiAgY29uc3QgaWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBwZW5kaW5nVGltZW91dHMuZGVsZXRlKGlkKTtcbiAgICBjYWxsYmFjaygpO1xuICB9LCBkZWxheSk7XG4gIHBlbmRpbmdUaW1lb3V0cy5hZGQoaWQpO1xuICByZXR1cm4gaWQ7XG59XG5cbmZ1bmN0aW9uIGNsZWFyUGVuZGluZ1RpbWVvdXRzKCkge1xuICBwZW5kaW5nVGltZW91dHMuZm9yRWFjaCgoaWQpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICBwZW5kaW5nVGltZW91dHMuY2xlYXIoKTtcbn1cblxuZnVuY3Rpb24gZGlzdHJpYnV0ZVNldHRpbmdzKCkge1xuICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gICAgaWYgKHdpZGdldCkgd2lkZ2V0LmFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICB9KTtcbiAgaWYgKG92ZXJsYXlUaW1lRGlzcCkgb3ZlcmxheVRpbWVEaXNwLmFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAvLyBhcHBseVNldHRpbmdzIGlzIHB1cmU7IHZpc2liaWxpdHkgKGFuZCBzaW5nbGUtd2lkZ2V0IHNlbGVjdGlvbikgaXNcbiAgLy8gY2VudHJhbGl6ZWQgc28gbXVsdGlwbGUgbWF0Y2hpbmcgdmlkZW9zIG5ldmVyIHN0YWNrIGNsb2Nrcy5cbiAgdXBkYXRlQWxsVmlzaWJpbGl0eSgpO1xufVxuXG5mdW5jdGlvbiBsb2FkU2V0dGluZ3MoKSB7XG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxuICAgIE9iamVjdC5hc3NpZ24oeyBmbG9hdFBvc2l0aW9uOiBudWxsIH0sIERFRkFVTFRfU0VUVElOR1MpLFxuICAgIChpdGVtcykgPT4ge1xuICAgICAgY29uc3QgbGVnYWN5ID0gaXRlbXMuZmxvYXRQb3NpdGlvbjtcblxuICAgICAgc2V0dGluZ3Muc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBpdGVtcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgICBzZXR0aW5ncy5zaG93T25GdWxsc2NyZWVuID0gaXRlbXMuc2hvd09uRnVsbHNjcmVlbiAhPT0gZmFsc2U7XG4gICAgICBzZXR0aW5ncy5zaG93U2Vjb25kcyA9IGl0ZW1zLnNob3dTZWNvbmRzICE9PSBmYWxzZTtcbiAgICAgIHNldHRpbmdzLnNob3dQcm9ncmVzcyA9IGl0ZW1zLnNob3dQcm9ncmVzcyAhPT0gZmFsc2U7XG4gICAgICBzZXR0aW5ncy5hdXRvSGlkZSA9IGl0ZW1zLmF1dG9IaWRlID09PSB0cnVlO1xuICAgICAgc2V0dGluZ3MubGF5b3V0TW9kZSA9IGl0ZW1zLmxheW91dE1vZGUgPT09ICdmbG9hdCcgPyAnZmxvYXQnIDogJ3NuYXAnO1xuICAgICAgc2V0dGluZ3MuZmxvYXRQb3NpdGlvblZpZGVvID0gaXRlbXMuZmxvYXRQb3NpdGlvblZpZGVvIHx8IG51bGw7XG4gICAgICBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93ID0gaXRlbXMuZmxvYXRQb3NpdGlvbldpbmRvdyB8fCBudWxsO1xuXG4gICAgICAvLyBPbmUtdGltZSBtaWdyYXRpb24gb2YgdGhlIGxlZ2FjeSBzaGFyZWQgZmxvYXQgcG9zaXRpb24uIFVzZSBpdCBmb3JcbiAgICAgIC8vIGJvdGggd2lkZ2V0IHR5cGVzLCB0aGVuIHJlbW92ZSB0aGUgb2xkIGtleS5cbiAgICAgIGxldCBtaWdyYXRlZCA9IGZhbHNlO1xuICAgICAgaWYgKGxlZ2FjeSAmJiB0eXBlb2YgbGVnYWN5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoIXNldHRpbmdzLmZsb2F0UG9zaXRpb25WaWRlbykge1xuICAgICAgICAgIHNldHRpbmdzLmZsb2F0UG9zaXRpb25WaWRlbyA9IGxlZ2FjeTtcbiAgICAgICAgICBtaWdyYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93KSB7XG4gICAgICAgICAgc2V0dGluZ3MuZmxvYXRQb3NpdGlvbldpbmRvdyA9IGxlZ2FjeTtcbiAgICAgICAgICBtaWdyYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGlzdHJpYnV0ZVNldHRpbmdzKCk7XG5cbiAgICAgIGlmIChsZWdhY3kgIT09IG51bGwgJiYgbGVnYWN5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG1pZ3JhdGVkKSB7XG4gICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe1xuICAgICAgICAgICAgZmxvYXRQb3NpdGlvblZpZGVvOiBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uVmlkZW8sXG4gICAgICAgICAgICBmbG9hdFBvc2l0aW9uV2luZG93OiBzZXR0aW5ncy5mbG9hdFBvc2l0aW9uV2luZG93XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoJ2Zsb2F0UG9zaXRpb24nKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG59XG5cbmxvYWRTZXR0aW5ncygpO1xuXG4vLyBTaW5nbGUgc3RvcmFnZSBsaXN0ZW5lciBmb3IgdGhlIHdob2xlIHBhZ2UgLyBmcmFtZS5cbmZ1bmN0aW9uIGhhbmRsZVN0b3JhZ2VDaGFuZ2VkKGNoYW5nZXMsIG5hbWVzcGFjZSkge1xuICBpZiAobmFtZXNwYWNlICE9PSAnc3luYycpIHJldHVybjtcblxuICBsZXQgY2hhbmdlZCA9IGZhbHNlO1xuICBTRVRUSU5HX0tFWVMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjaGFuZ2VzLCBrZXkpKSB7XG4gICAgICBzZXR0aW5nc1trZXldID0gY2hhbmdlc1trZXldLm5ld1ZhbHVlO1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBsYW5ndWFnZUNoYW5nZWQgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY2hhbmdlcywgJ2xhbmd1YWdlJyk7XG5cbiAgLy8gTGFuZ3VhZ2UgY2hhbmdlIG11c3Qgbm90IHN3YWxsb3cgY28tY2hhbmdlZCBzZXR0aW5ncy5cbiAgaWYgKGxhbmd1YWdlQ2hhbmdlZCkge1xuICAgIHJlbG9hZEZyb21TdG9yYWdlKCkudGhlbigoKSA9PiBkaXN0cmlidXRlU2V0dGluZ3MoKSk7XG4gIH1cbiAgaWYgKGNoYW5nZWQpIGRpc3RyaWJ1dGVTZXR0aW5ncygpO1xufVxuXG5jaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoaGFuZGxlU3RvcmFnZUNoYW5nZWQpO1xuXG4vLyAtLS0gbWVkaWEgZGlzY292ZXJ5IC8gYmluZGluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gYmluZFZpZGVvKHZpZGVvKSB7XG4gIGlmICghdmlkZW8gfHwgdmlkZW8udGFnTmFtZSAhPT0gJ1ZJREVPJykgcmV0dXJuO1xuICBpZiAodmlkZW9XaWRnZXRzLmhhcyh2aWRlbykpIHJldHVybjtcblxuICBjb25zdCB3aWRnZXQgPSBuZXcgVGltZURpc3BsYXkodmlkZW8pO1xuICB2aWRlb1dpZGdldHMuc2V0KHZpZGVvLCB3aWRnZXQpO1xuICB0cmFja2VkVmlkZW9zLmFkZCh2aWRlbyk7XG5cbiAgd2lkZ2V0LmFwcGx5U2V0dGluZ3Moc2V0dGluZ3MpO1xuICB1cGRhdGVBbGxWaXNpYmlsaXR5KCk7XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lWaWRlbyh2aWRlbykge1xuICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgaWYgKHdpZGdldCkgd2lkZ2V0LmRlc3Ryb3koKTtcbiAgdmlkZW9XaWRnZXRzLmRlbGV0ZSh2aWRlbyk7XG4gIHRyYWNrZWRWaWRlb3MuZGVsZXRlKHZpZGVvKTtcbn1cblxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKHJvb3QpIHtcbiAgY29uc3QgdmlkZW9zID0gKHJvb3QgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoJ3ZpZGVvJyk7XG4gIGxldCBmb3VuZCA9IDA7XG4gIHZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgIGlmICghdmlkZW9XaWRnZXRzLmhhcyh2aWRlbykpIHtcbiAgICAgIGJpbmRWaWRlbyh2aWRlbyk7XG4gICAgICBmb3VuZCsrO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmb3VuZDtcbn1cblxuLy8gU2NhbiBpbW1lZGlhdGVseTsgaWYgbm8gdmlkZW9zIGV4aXN0IHlldCwgcmV0cnkgYSBib3VuZGVkIG51bWJlciBvZiB0aW1lc1xuLy8gKDUgeCAxcykgcmF0aGVyIHRoYW4gcG9sbGluZyBmb3JldmVyLlxubGV0IHNjYW5SZXRyaWVzID0gMDtcblxuZnVuY3Rpb24gaW5pdGlhbFNjYW4oKSB7XG4gIGNvbnN0IGZvdW5kID0gc2NhbkZvck1lZGlhKGRvY3VtZW50KTtcbiAgaWYgKGZvdW5kID4gMCkge1xuICAgIGxvZ1RvcCh0KCdtc2dGb3VuZE1lZGlhJyksIGZvdW5kKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoc2NhblJldHJpZXMgPCBNQVhfU0NBTl9SRVRSSUVTKSB7XG4gICAgc2NhblJldHJpZXMrKztcbiAgICBzY2hlZHVsZVRpbWVvdXQoaW5pdGlhbFNjYW4sIDEwMDApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxvZ1RvcCh0KCdtc2dOb01lZGlhJykpO1xufVxuXG5pbml0aWFsU2NhbigpO1xuXG4vLyBEeW5hbWljIHZpZGVvczogYmluZCBuZXdseSBhZGRlZCB2aWRlb3MgYW5kIGRlc3Ryb3kgd2lkZ2V0cyBmb3IgcmVtb3ZlZCBvbmVzLlxuY29uc3QgbWVkaWFPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgbGV0IHNhd1JlbW92YWwgPSBmYWxzZTtcblxuICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGlmICghbm9kZSB8fCBub2RlLm5vZGVUeXBlICE9PSAxKSByZXR1cm47XG4gICAgICBpZiAobm9kZS50YWdOYW1lID09PSAnVklERU8nKSB7XG4gICAgICAgIGJpbmRWaWRlbyhub2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAgICAgbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd2aWRlbycpLmZvckVhY2goKHZpZGVvKSA9PiBiaW5kVmlkZW8odmlkZW8pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtdXRhdGlvbi5yZW1vdmVkTm9kZXMgJiYgbXV0YXRpb24ucmVtb3ZlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHNhd1JlbW92YWwgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKHNhd1JlbW92YWwpIHtcbiAgICAvLyBEZWZlciBzbyBhIG1vdmVkIHZpZGVvIChyZW1vdmVkICsgcmUtYWRkZWQpIGlzIG5vdCBkZXN0cm95ZWQuXG4gICAgc2NoZWR1bGVUaW1lb3V0KGNsZWFudXBSZW1vdmVkVmlkZW9zLCAwKTtcbiAgfVxufSk7XG5cbm1lZGlhT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHtcbiAgY2hpbGRMaXN0OiB0cnVlLFxuICBzdWJ0cmVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gY2xlYW51cFJlbW92ZWRWaWRlb3MoKSB7XG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBpZiAoIXZpZGVvLmlzQ29ubmVjdGVkKSBkZXN0cm95VmlkZW8odmlkZW8pO1xuICB9KTtcbn1cblxuLy8gLS0tIGNlbnRyYWxpemVkIHNjaGVkdWxpbmcgLyB2aXNpYmlsaXR5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IHRpY2tlciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgdHJhY2tlZFZpZGVvcy5mb3JFYWNoKCh2aWRlbykgPT4ge1xuICAgIGNvbnN0IHdpZGdldCA9IHZpZGVvV2lkZ2V0cy5nZXQodmlkZW8pO1xuICAgIGlmICh3aWRnZXQgJiYgd2lkZ2V0LmlzU2hvd2luZygpKSB3aWRnZXQudXBkYXRlVGltZSgpO1xuICB9KTtcbiAgaWYgKG92ZXJsYXlUaW1lRGlzcCAmJiBvdmVybGF5VGltZURpc3AuaXNTaG93aW5nKCkpIHtcbiAgICBvdmVybGF5VGltZURpc3AudXBkYXRlVGltZSgpO1xuICB9XG59LCAxMDAwKTtcblxuZnVuY3Rpb24gdXBkYXRlQWxsVmlzaWJpbGl0eSgpIHtcbiAgY29uc3QgZnNFbCA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCk7XG5cbiAgaWYgKGZzRWwpIHtcbiAgICAvLyBPbmx5IG9uZSBjbG9jayBtYXkgd2luIGluc2lkZSBhIGZ1bGxzY3JlZW4gY29udGFpbmVyLiBQcmVmZXIgdGhlIHZpZGVvXG4gICAgLy8gdGhhdCBpcyBhY3R1YWxseSBwbGF5aW5nLCB0aGVuIHRoZSBleGFjdCBmdWxsc2NyZWVuIGVsZW1lbnQsIHRoZW4gdGhlXG4gICAgLy8gZmlyc3QgbWF0Y2hpbmcgd2lkZ2V0LlxuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBbXTtcbiAgICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICAgIGlmICh3aWRnZXQgJiYgd2lkZ2V0LmNoZWNrSXNUb1Nob3coKSkge1xuICAgICAgICBjYW5kaWRhdGVzLnB1c2goeyB2aWRlbywgd2lkZ2V0IH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHdpbm5lciA9IG51bGw7XG4gICAgaWYgKGNhbmRpZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgd2lubmVyID0gY2FuZGlkYXRlcy5maW5kKChjKSA9PiAhYy52aWRlby5wYXVzZWQgJiYgIWMudmlkZW8uZW5kZWQpIHx8XG4gICAgICAgICAgICAgICBjYW5kaWRhdGVzLmZpbmQoKGMpID0+IGMudmlkZW8gPT09IGZzRWwpIHx8XG4gICAgICAgICAgICAgICBjYW5kaWRhdGVzWzBdO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbm5lcldpZGdldCA9IHdpbm5lciA/IHdpbm5lci53aWRnZXQgOiBudWxsO1xuICAgIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICAgIGNvbnN0IHdpZGdldCA9IHZpZGVvV2lkZ2V0cy5nZXQodmlkZW8pO1xuICAgICAgaWYgKHdpZGdldCAmJiB3aWRnZXQgIT09IHdpbm5lcldpZGdldCAmJiB3aWRnZXQuaXNTaG93aW5nKCkpIHtcbiAgICAgICAgd2lkZ2V0LmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAod2lubmVyV2lkZ2V0KSB3aW5uZXJXaWRnZXQudXBkYXRlVmlzaWJpbGl0eSgpO1xuICB9IGVsc2Uge1xuICAgIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICAgIGNvbnN0IHdpZGdldCA9IHZpZGVvV2lkZ2V0cy5nZXQodmlkZW8pO1xuICAgICAgaWYgKHdpZGdldCkgd2lkZ2V0LnVwZGF0ZVZpc2liaWxpdHkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChvdmVybGF5VGltZURpc3ApIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVJlc2l6ZSgpIHtcbiAgdXBkYXRlQWxsVmlzaWJpbGl0eSgpO1xuICB0cmFja2VkVmlkZW9zLmZvckVhY2goKHZpZGVvKSA9PiB7XG4gICAgY29uc3Qgd2lkZ2V0ID0gdmlkZW9XaWRnZXRzLmdldCh2aWRlbyk7XG4gICAgaWYgKHdpZGdldCkgd2lkZ2V0LmhhbmRsZVJlc2l6ZSgpO1xuICB9KTtcbiAgaWYgKG92ZXJsYXlUaW1lRGlzcCkgb3ZlcmxheVRpbWVEaXNwLmhhbmRsZVJlc2l6ZSgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVGdWxsc2NyZWVuQ2hhbmdlKCkge1xuICBpZiAoIWdldEZ1bGxzY3JlZW5FbGVtZW50KCkgJiYgIWNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpKSB7XG4gICAgcmVzdG9yZVRlbXBWYWx1ZXMoKTtcbiAgfVxuICB1cGRhdGVBbGxWaXNpYmlsaXR5KCk7XG59XG5cbi8vIFNpbmdsZSBzZXQgb2YgZ2xvYmFsIGZ1bGxzY3JlZW4vcmVzaXplIGxpc3RlbmVycy5cbkZVTExTQ1JFRU5fRVZFTlRTLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlRnVsbHNjcmVlbkNoYW5nZSk7XG59KTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgaGFuZGxlUmVzaXplKTtcblxuLy8gLS0tIOW/q+aNt+mUruWkhOeQhu+8iOWdh+S4uuS4tOaXtuWIh+aNou+8jOS4jeWGmSBzdG9yYWdl77yJIC0tLVxuXG4vLyDooqvlv6vmjbfplK7kuLTml7bmlLnliqjnmoTorr7nva7vvIzpgIDlh7rlhajlsY/ml7bmgaLlpI3ljp/lgLxcbmNvbnN0IF90ZW1wT3ZlcnJpZGVzID0ge307XG5cbmZ1bmN0aW9uIGJ1aWxkS2V5U3RyaW5nKGUpIHtcbiAgY29uc3QgcGFydHMgPSBbXTtcbiAgaWYgKGUuY3RybEtleSkgcGFydHMucHVzaCgnQ3RybCcpO1xuICBpZiAoZS5hbHRLZXkpIHBhcnRzLnB1c2goJ0FsdCcpO1xuICBpZiAoZS5zaGlmdEtleSkgcGFydHMucHVzaCgnU2hpZnQnKTtcbiAgaWYgKGUua2V5ID09PSAnQ29udHJvbCcgfHwgZS5rZXkgPT09ICdBbHQnIHx8IGUua2V5ID09PSAnU2hpZnQnIHx8IGUua2V5ID09PSAnTWV0YScpIHJldHVybiBudWxsO1xuICBwYXJ0cy5wdXNoKGUua2V5KTtcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJysnKTtcbn1cblxuLy8g5bCG5p+Q5Liq6K6+572u5YC85bqU55So5Yiw5omA5pyJIHdpZGdldCDlrp7kvovvvIjkuI3lhpkgc3RvcmFnZe+8iVxuZnVuY3Rpb24gYXBwbHlTZXR0aW5nVG9XaWRnZXRzKHNldHRpbmdLZXksIHZhbHVlKSB7XG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNldHRpbmdzLCBzZXR0aW5nS2V5KSkgcmV0dXJuO1xuICBzZXR0aW5nc1tzZXR0aW5nS2V5XSA9IHZhbHVlO1xuICBkaXN0cmlidXRlU2V0dGluZ3MoKTtcbn1cblxuLy8g5b+r5o236ZSu5Li05pe25YiH5o2i77ya6K6w5b2V5Y6f5aeL5YC8IOKGkiDlhpnlhaUgd2lkZ2V0XG5mdW5jdGlvbiB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksIG5ld1ZhbHVlLCBjdXJyZW50VmFsdWUpIHtcbiAgaWYgKCEoc2V0dGluZ0tleSBpbiBfdGVtcE92ZXJyaWRlcykpIHtcbiAgICBfdGVtcE92ZXJyaWRlc1tzZXR0aW5nS2V5XSA9IGN1cnJlbnRWYWx1ZTtcbiAgfVxuICBhcHBseVNldHRpbmdUb1dpZGdldHMoc2V0dGluZ0tleSwgbmV3VmFsdWUpO1xufVxuXG4vLyDpgIDlh7rlhajlsY/ml7bmgaLlpI3miYDmnInkuLTml7bmlLnliqhcbmZ1bmN0aW9uIHJlc3RvcmVUZW1wVmFsdWVzKCkge1xuICBmb3IgKGNvbnN0IFtrZXksIG9yaWdpbmFsVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKF90ZW1wT3ZlcnJpZGVzKSkge1xuICAgIGFwcGx5U2V0dGluZ1RvV2lkZ2V0cyhrZXksIG9yaWdpbmFsVmFsdWUpO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIF90ZW1wT3ZlcnJpZGVzKSB7XG4gICAgZGVsZXRlIF90ZW1wT3ZlcnJpZGVzW2tleV07XG4gIH1cbn1cblxuLy8g5qOA5rWL6YCA5Ye65YWo5bGP77yI5ZCrIEYxMe+8iVxuZnVuY3Rpb24gY2hlY2tGdWxsc2NyZWVuRXhpdCgpIHtcbiAgY29uc3QgaXNGcyA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCkgfHwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XG4gIGlmICghaXNGcykge1xuICAgIHJlc3RvcmVUZW1wVmFsdWVzKCk7XG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNoZWNrRnVsbHNjcmVlbkV4aXQpO1xuXG4vLyDlhbPpl63mjInpkq4gw5cg4oaSIOS4tOaXtumakOiXj++8iOWQjOW/q+aNt+mUriBoaWRlIOihjOS4uu+8iVxuZnVuY3Rpb24gaGFuZGxlRGlzbWlzcyhlKSB7XG4gIGNvbnN0IHNldHRpbmdLZXkgPSBlLmRldGFpbCAmJiBlLmRldGFpbC5kaXNwbGF5VHlwZSA9PT0gJ3dpbmRvdy1vdmVybGF5J1xuICAgID8gJ3Nob3dPbkZ1bGxzY3JlZW4nXG4gICAgOiAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nO1xuICBjb25zdCBjdXJyZW50VmFsID0gc2V0dGluZ3Nbc2V0dGluZ0tleV07XG4gIGlmIChjdXJyZW50VmFsID09PSBmYWxzZSkgcmV0dXJuOyAvLyDlt7Lnu4/pmpDol49cbiAgdGVtcFRvZ2dsZShzZXR0aW5nS2V5LCBmYWxzZSwgY3VycmVudFZhbCk7XG4gIGxvZ1RvcChgWyR7dCgnbXNnRGlzbWlzc0xhYmVsJyl9XSAke3NldHRpbmdLZXl9ICR7dCgnbXNnRGlzbWlzc2VkJyl9YCk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZzLXRpbWUtZGlzbWlzcycsIGhhbmRsZURpc21pc3MpO1xuXG5mdW5jdGlvbiBoYW5kbGVLZXlkb3duKGUpIHtcbiAgY29uc3QgaXNGcyA9IGdldEZ1bGxzY3JlZW5FbGVtZW50KCkgfHwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XG4gIGlmICghaXNGcykgcmV0dXJuO1xuXG4gIC8vIEVTQyDmnInmtY/op4jlmajpgIDlh7rlhajlsY/nmoTpu5jorqTooYzkuLrvvIzkuI3lupTov5vlhaXlv6vmjbfplK7pgLvovpFcbiAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgcmV0dXJuO1xuXG4gIGNvbnN0IHByZXNzZWQgPSBidWlsZEtleVN0cmluZyhlKTtcbiAgaWYgKCFwcmVzc2VkKSByZXR1cm47XG5cbiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXG4gICAgWydrZXlUb2dnbGVMYXlvdXQnLCAna2V5VG9nZ2xlVmlzaWJpbGl0eSddLFxuICAgIChpdGVtcykgPT4ge1xuICAgICAgaWYgKHByZXNzZWQgPT09IGl0ZW1zLmtleVRvZ2dsZUxheW91dCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vIOS7jumbhuS4reiuvue9ruivu+WPluW9k+WJjeW4g+WxgOaooeW8j++8iHN0b3JhZ2Ug5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxuICAgICAgICBjb25zdCBjdXJyZW50TW9kZSA9IHNldHRpbmdzLmxheW91dE1vZGU7XG4gICAgICAgIGNvbnN0IG5ld01vZGUgPSBjdXJyZW50TW9kZSA9PT0gJ2Zsb2F0JyA/ICdzbmFwJyA6ICdmbG9hdCc7XG4gICAgICAgIHRlbXBUb2dnbGUoJ2xheW91dE1vZGUnLCBuZXdNb2RlLCBjdXJyZW50TW9kZSk7XG4gICAgICAgIGxvZ1RvcChgWyR7dCgnbXNnTGF5b3V0VG9nZ2xlJyl9XSAke25ld01vZGUgPT09ICdmbG9hdCcgPyB0KCdtc2dGbG9hdCcpIDogdCgnbXNnU25hcCcpfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJlc3NlZCA9PT0gaXRlbXMua2V5VG9nZ2xlVmlzaWJpbGl0eSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnN0IGluVmlkZW9GcyA9ICEhZ2V0RnVsbHNjcmVlbkVsZW1lbnQoKTtcbiAgICAgICAgY29uc3Qgc2V0dGluZ0tleSA9IGluVmlkZW9GcyA/ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicgOiAnc2hvd09uRnVsbHNjcmVlbic7XG4gICAgICAgIC8vIOS7jumbhuS4reiuvue9ruivu+WPluW9k+WJjeeKtuaAge+8iHN0b3JhZ2Ug5LuO5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxuICAgICAgICBjb25zdCBjdXJyZW50VmFsID0gc2V0dGluZ3Nbc2V0dGluZ0tleV07XG4gICAgICAgIHRlbXBUb2dnbGUoc2V0dGluZ0tleSwgIWN1cnJlbnRWYWwsIGN1cnJlbnRWYWwpO1xuICAgICAgICBsb2dUb3AodCghY3VycmVudFZhbCA/ICdtc2dWaXNpYmlsaXR5T24nIDogJ21zZ1Zpc2liaWxpdHlPZmYnKSk7XG4gICAgICB9XG4gICAgfVxuICApO1xufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93bik7XG5cbi8vIC0tLSB0ZWFyZG93biAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gdGVhcmRvd24oKSB7XG4gIGNsZWFySW50ZXJ2YWwodGlja2VyKTtcbiAgY2xlYXJQZW5kaW5nVGltZW91dHMoKTtcbiAgbWVkaWFPYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgRlVMTFNDUkVFTl9FVkVOVFMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZUZ1bGxzY3JlZW5DaGFuZ2UpO1xuICB9KTtcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGhhbmRsZVJlc2l6ZSk7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGhhbmRsZVJlc2l6ZSk7XG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja0Z1bGxzY3JlZW5FeGl0KTtcblxuICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIoaGFuZGxlU3RvcmFnZUNoYW5nZWQpO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5ZG93bik7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2ZzLXRpbWUtZGlzbWlzcycsIGhhbmRsZURpc21pc3MpO1xuXG4gIHRyYWNrZWRWaWRlb3MuZm9yRWFjaCgodmlkZW8pID0+IHtcbiAgICBjb25zdCB3aWRnZXQgPSB2aWRlb1dpZGdldHMuZ2V0KHZpZGVvKTtcbiAgICBpZiAod2lkZ2V0KSB3aWRnZXQuZGVzdHJveSgpO1xuICAgIHZpZGVvV2lkZ2V0cy5kZWxldGUodmlkZW8pO1xuICB9KTtcbiAgdHJhY2tlZFZpZGVvcy5jbGVhcigpO1xuXG4gIGlmIChvdmVybGF5VGltZURpc3ApIHtcbiAgICBvdmVybGF5VGltZURpc3AuZGVzdHJveSgpO1xuICAgIG92ZXJsYXlUaW1lRGlzcCA9IG51bGw7XG4gIH1cbn1cblxuLy8gYmZjYWNoZTogcGFnZWhpZGUgZmlyZXMgd2hlbiBlbnRlcmluZyB0aGUgYmFjay9mb3J3YXJkIGNhY2hlIHRvbzsgb25seSB0ZWFyXG4vLyBkb3duIG9uIGEgcmVhbCB1bmxvYWQuXG5mdW5jdGlvbiBoYW5kbGVQYWdlSGlkZShldmVudCkge1xuICBpZiAoZXZlbnQucGVyc2lzdGVkKSByZXR1cm47XG4gIHRlYXJkb3duKCk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIGhhbmRsZVBhZ2VIaWRlKTtcbiJdLCJuYW1lcyI6WyJTVVBQT1JURURfTEFOR1MiLCJTVE9SQUdFX0tFWSIsIl9jdXJyZW50TGFuZyIsIl90cmFuc2xhdGlvbnMiLCJfaW5pdFByb21pc2UiLCJ0Iiwia2V5IiwibWVzc2FnZSIsImNocm9tZSIsImkxOG4iLCJnZXRNZXNzYWdlIiwiZSIsImdldEN1cnJlbnRMYW5nIiwiaW5pdCIsIlByb21pc2UiLCJyZXNvbHZlIiwic3RvcmFnZSIsInN5bmMiLCJnZXQiLCJpdGVtcyIsInN0b3JlZCIsImJyb3dzZXJMYW5nIiwibmF2aWdhdG9yIiwibGFuZ3VhZ2UiLCJtYXBwZWQiLCJyZXBsYWNlIiwiYmVzdExhbmciLCJpbmNsdWRlcyIsImxvYWRMYW5nIiwidGhlbiIsInJlbG9hZEZyb21TdG9yYWdlIiwibGFuZyIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ1cmwiLCJydW50aW1lIiwiZ2V0VVJMIiwiY29uY2F0IiwiZmV0Y2giLCJyZXNwIiwib2siLCJFcnJvciIsImpzb24iLCJkYXRhIiwiZm9ybWF0VGltZSIsInNlY29uZHMiLCJ2YWx1ZSIsIk51bWJlciIsImlzRmluaXRlIiwidG90YWwiLCJNYXRoIiwiZmxvb3IiLCJtaW5zIiwic2VjcyIsIlN0cmluZyIsInBhZFN0YXJ0IiwiY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIiwiZnNFbCIsImRvY3VtZW50IiwiZnVsbHNjcmVlbkVsZW1lbnQiLCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCIsIm1vekZ1bGxTY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsIlRPTEVSQU5DRSIsImFicyIsIndpbmRvdyIsImlubmVySGVpZ2h0Iiwic2NyZWVuIiwiaGVpZ2h0IiwiaW5uZXJXaWR0aCIsIndpZHRoIiwiRlVMTFNDUkVFTl9FVkVOVFMiLCJnZXRGdWxsc2NyZWVuRWxlbWVudCIsImlzVmlkZW9FbGVtZW50IiwiZWxlbWVudCIsIkhUTUxWaWRlb0VsZW1lbnQiLCJQT1BPVkVSX1NVUFBPUlRFRCIsIkhUTUxFbGVtZW50IiwicHJvdG90eXBlIiwic2hvd1BvcG92ZXIiLCJoaWRlUG9wb3ZlciIsIkRFRkFVTFRfU0VUVElOR1MiLCJzaG93V2hlblZpZGVvRnVsbHNjcmVlbiIsInNob3dPbkZ1bGxzY3JlZW4iLCJzaG93U2Vjb25kcyIsInNob3dQcm9ncmVzcyIsImF1dG9IaWRlIiwibGF5b3V0TW9kZSIsImZsb2F0UG9zaXRpb25WaWRlbyIsImZsb2F0UG9zaXRpb25XaW5kb3ciLCJoYXNPd24iLCJvYmplY3QiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJUaW1lRGlzcGxheSIsIm1lZGlhIiwiX2NsYXNzQ2FsbENoZWNrIiwidGltZUVsZW1lbnQiLCJjcmVhdGVUaW1lRWxlbWVudCIsIl90aW1lVGV4dFNwYW4iLCJfY2xvc2VCdG4iLCJhc3NpZ24iLCJhdXRvSGlkZVRpbWVyIiwiX2JvdW5kV2FrZUhhbmRsZXIiLCJfaXNEcmFnZ2luZyIsIl9hY3RpdmVQb2ludGVySWQiLCJfZHJhZ09mZnNldCIsIngiLCJ5IiwiX3Bvc2l0aW9uTW9kZSIsIl9wb3BvdmVyTW9kZSIsIl92aXNpYmxlIiwiX2ZvcmNlQ2xvc2VWaXNpYmxlIiwiX3BvcG92ZXJSZXRyeVRpbWVyIiwiX3BvcG92ZXJSZXRyeUNvdW50IiwiX2JvdW5kUG9pbnRlckRvd24iLCJfYm91bmRQb2ludGVyTW92ZSIsIl9ib3VuZFBvaW50ZXJVcCIsIl9ib3VuZFBvaW50ZXJDYW5jZWwiLCJfY3JlYXRlQ2xhc3MiLCJhcHBseVNldHRpbmdzIiwic2V0dGluZ3MiLCJ0aXRsZSIsImRpc3BsYXlUeXBlIiwiaXNTaG93aW5nIiwiX2Zsb2F0U3RvcmFnZUtleSIsIl9nZXRGbG9hdFBvc2l0aW9uIiwiX3NldEZsb2F0UG9zaXRpb24iLCJwb3NpdGlvbiIsInNldCIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90aGlzIiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwiekluZGV4IiwidHJhbnNpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJkaXNwbGF5IiwiYm94U2l6aW5nIiwidGV4dFNwYW4iLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwiY2xvc2VCdG4iLCJfY3JlYXRlQ2xvc2VCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsIm1hdGNoZXMiLCJfdGhpczIiLCJidG4iLCJ0b3AiLCJyaWdodCIsImxpbmVIZWlnaHQiLCJ0ZXh0QWxpZ24iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJjdXJzb3IiLCJib3hTaGFkb3ciLCJ1c2VyU2VsZWN0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGFuZGxlRGlzbWlzcyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImNoZWNrSXNUb1Nob3ciLCJjb250YWlucyIsInVwZGF0ZVZpc2liaWxpdHkiLCJzaG93IiwiaGlkZSIsIl9yZXNldENsb3NlQnV0dG9uIiwiX2dldERvbVBhcmVudCIsImJvZHkiLCJuYXRpdmVWaWRlb0Z1bGxzY3JlZW4iLCJ1c2VQb3BvdmVyIiwib3BhY2l0eSIsIl9hcHBseVBvaW50ZXJNb2RlIiwicGFyZW50RWxlbWVudCIsIl9zaG93UG9wb3ZlciIsIl9oYW5kbGVQb3BvdmVyRmFpbHVyZSIsIl9jbGVhclBvcG92ZXJSZXRyeSIsIl9wb3NpdGlvbkVsZW1lbnQiLCJfdGVhcmRvd25Qb3BvdmVyIiwicGFyZW50IiwidXBkYXRlVGltZSIsInNldHVwRHJhZ2dpbmciLCJ0ZWFyZG93bkRyYWdnaW5nIiwic3RhcnRBdXRvSGlkZSIsImNsZWFyQXV0b0hpZGVUaW1lciIsInRlYXJkb3duV2FrZUxpc3RlbmVyIiwiX3Jlc3RvcmVQb2ludGVyRXZlbnRzIiwiX2NsZWFudXBGb3JIaWRlIiwicmVtb3ZlQ2hpbGQiLCJfY2xlYXJQb3BvdmVyUmV0cnlUaW1lciIsImNsZWFyVGltZW91dCIsImNhblJldHJ5IiwiX3NjaGVkdWxlUG9wb3ZlclJldHJ5IiwiX3RoaXMzIiwibWFyZ2luIiwiYm90dG9tIiwiYm9yZGVyIiwidHJhbnNmb3JtIiwic2F2ZWQiLCJfYXBwbHlGbG9hdFBvc2l0aW9uIiwibGVmdCIsIl9jbGFtcFBvc2l0aW9uIiwib2Zmc2V0V2lkdGgiLCJvZmZzZXRIZWlnaHQiLCJtYXhYIiwibWF4IiwibWF4WSIsInJhd1giLCJyYXdZIiwicm91bmQiLCJtaW4iLCJjbGFtcGVkIiwiaGFuZGxlUmVzaXplIiwic2V0QXR0cmlidXRlIiwiX2hpZGVQb3BvdmVyIiwiaGFzQXR0cmlidXRlIiwicmVtb3ZlQXR0cmlidXRlIiwiX3RoaXM0IiwidG91Y2hBY3Rpb24iLCJfb25EcmFnU3RhcnQiLCJfb25EcmFnTW92ZSIsIl9vbkRyYWdFbmQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwicG9pbnRlclR5cGUiLCJidXR0b24iLCJ0YXJnZXQiLCJwb2ludGVySWQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJzZXRQb2ludGVyQ2FwdHVyZSIsImVyciIsIl93YWtlIiwicHJldmVudERlZmF1bHQiLCJoYXNQb2ludGVyQ2FwdHVyZSIsInJlbGVhc2VQb2ludGVyQ2FwdHVyZSIsIl90aGlzNSIsIl9zZXR1cFdha2VMaXN0ZW5lciIsImZhZGVPdXQiLCJfdGhpczYiLCJwYXNzaXZlIiwiX3RoaXM3IiwiX3N5c3RlbVRpbWUiLCJub3ciLCJEYXRlIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsInN5c3RlbVRpbWUiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwiZGVzdHJveSIsIldpbmRvd092ZXJsYXlUaW1lRGlzcGxheSIsIl9UaW1lRGlzcGxheSIsIl9jYWxsU3VwZXIiLCJhcmd1bWVudHMiLCJfaW5oZXJpdHMiLCJJU19UT1BfRlJBTUUiLCJNQVhfU0NBTl9SRVRSSUVTIiwibG9nVG9wIiwiX2NvbnNvbGUiLCJjb25zb2xlIiwibG9nIiwiYXBwbHkiLCJTRVRUSU5HX0tFWVMiLCJ2aWRlb1dpZGdldHMiLCJXZWFrTWFwIiwidHJhY2tlZFZpZGVvcyIsIlNldCIsIm92ZXJsYXlUaW1lRGlzcCIsImRvY3VtZW50RWxlbWVudCIsInBlbmRpbmdUaW1lb3V0cyIsInNjaGVkdWxlVGltZW91dCIsImNhbGxiYWNrIiwiZGVsYXkiLCJpZCIsImFkZCIsImNsZWFyUGVuZGluZ1RpbWVvdXRzIiwiZm9yRWFjaCIsImNsZWFyIiwiZGlzdHJpYnV0ZVNldHRpbmdzIiwidmlkZW8iLCJ3aWRnZXQiLCJ1cGRhdGVBbGxWaXNpYmlsaXR5IiwibG9hZFNldHRpbmdzIiwiZmxvYXRQb3NpdGlvbiIsImxlZ2FjeSIsIm1pZ3JhdGVkIiwiX3R5cGVvZiIsInVuZGVmaW5lZCIsInJlbW92ZSIsImhhbmRsZVN0b3JhZ2VDaGFuZ2VkIiwiY2hhbmdlcyIsIm5hbWVzcGFjZSIsImNoYW5nZWQiLCJuZXdWYWx1ZSIsImxhbmd1YWdlQ2hhbmdlZCIsIm9uQ2hhbmdlZCIsImFkZExpc3RlbmVyIiwiYmluZFZpZGVvIiwidGFnTmFtZSIsImhhcyIsImRlc3Ryb3lWaWRlbyIsInNjYW5Gb3JNZWRpYSIsInJvb3QiLCJ2aWRlb3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm91bmQiLCJzY2FuUmV0cmllcyIsImluaXRpYWxTY2FuIiwibWVkaWFPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJzYXdSZW1vdmFsIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwibm9kZSIsIm5vZGVUeXBlIiwicmVtb3ZlZE5vZGVzIiwiY2xlYW51cFJlbW92ZWRWaWRlb3MiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImlzQ29ubmVjdGVkIiwidGlja2VyIiwic2V0SW50ZXJ2YWwiLCJjYW5kaWRhdGVzIiwicHVzaCIsIndpbm5lciIsImZpbmQiLCJjIiwicGF1c2VkIiwiZW5kZWQiLCJ3aW5uZXJXaWRnZXQiLCJoYW5kbGVGdWxsc2NyZWVuQ2hhbmdlIiwicmVzdG9yZVRlbXBWYWx1ZXMiLCJldmVudE5hbWUiLCJfdGVtcE92ZXJyaWRlcyIsImJ1aWxkS2V5U3RyaW5nIiwicGFydHMiLCJjdHJsS2V5IiwiYWx0S2V5Iiwic2hpZnRLZXkiLCJqb2luIiwiYXBwbHlTZXR0aW5nVG9XaWRnZXRzIiwic2V0dGluZ0tleSIsInRlbXBUb2dnbGUiLCJjdXJyZW50VmFsdWUiLCJfaSIsIl9PYmplY3QkZW50cmllcyIsImVudHJpZXMiLCJfT2JqZWN0JGVudHJpZXMkX2kiLCJfc2xpY2VkVG9BcnJheSIsIm9yaWdpbmFsVmFsdWUiLCJjaGVja0Z1bGxzY3JlZW5FeGl0IiwiaXNGcyIsImN1cnJlbnRWYWwiLCJoYW5kbGVLZXlkb3duIiwicHJlc3NlZCIsImtleVRvZ2dsZUxheW91dCIsImN1cnJlbnRNb2RlIiwibmV3TW9kZSIsImtleVRvZ2dsZVZpc2liaWxpdHkiLCJpblZpZGVvRnMiLCJ0ZWFyZG93biIsImNsZWFySW50ZXJ2YWwiLCJkaXNjb25uZWN0IiwicmVtb3ZlTGlzdGVuZXIiLCJoYW5kbGVQYWdlSGlkZSIsImV2ZW50IiwicGVyc2lzdGVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=