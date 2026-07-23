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
  if (isNaN(seconds)) return '00:00';
  var mins = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  return "".concat(String(mins).padStart(2, '0'), ":").concat(String(secs).padStart(2, '0'));
}

// check if fullscreen for browser
function checkIsBrowserFullscreen() {
  return window.innerHeight === screen.height && window.innerWidth === screen.width;
}

/***/ }),

/***/ "./src/widgets.js":
/*!************************!*\
  !*** ./src/widgets.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeDisplay: () => (/* binding */ TimeDisplay),
/* harmony export */   WindowOverlayTimeDisplay: () => (/* binding */ WindowOverlayTimeDisplay)
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
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var TimeDisplay = /*#__PURE__*/function () {
  function TimeDisplay(media) {
    _classCallCheck(this, TimeDisplay);
    this.media = media;
    this.timeElement = this.createTimeElement();
    this.showWhenVideoFullscreen = true;
    this.showOnFullscreen = true;
    this.showSeconds = true;
    this.showProgress = true;
    this.autoHide = false;
    this.autoHideTimer = null;
    this._boundMouseMoveHandler = null;
    this.layoutMode = 'snap';
    this.floatPosition = null;
    this._isDragging = false;
    this._dragOffset = {
      x: 0,
      y: 0
    };
    this._boundMouseDownStart = null;
    this._boundMouseMoveDuring = null;
    this._boundMouseUpEnd = null;
    this.loadSettings();
    this.setupEventListeners();
    this.setupSettingsListener();
  }
  return _createClass(TimeDisplay, [{
    key: "loadSettings",
    value: function loadSettings() {
      var _this = this;
      // 从Chrome存储中读取设置
      chrome.storage.sync.get({
        showWhenVideoFullscreen: true,
        showOnFullscreen: true,
        showSeconds: true,
        showProgress: true,
        autoHide: false,
        layoutMode: 'snap',
        floatPosition: null
      }, function (items) {
        _this.showWhenVideoFullscreen = items.showWhenVideoFullscreen;
        _this.showOnFullscreen = items.showOnFullscreen;
        _this.showSeconds = items.showSeconds;
        _this.showProgress = items.showProgress;
        _this.autoHide = items.autoHide;
        _this.layoutMode = items.layoutMode || 'snap';
        _this.floatPosition = items.floatPosition || null;
        _this.updateVisibility();
      });
    }
  }, {
    key: "displayType",
    value: function displayType() {
      return 'media';
    }
  }, {
    key: "createTimeElement",
    value: function createTimeElement() {
      var timeElement = document.createElement('div');
      timeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      timeElement.style.color = 'white';
      timeElement.style.padding = '5px';
      timeElement.style.borderRadius = '5px';
      timeElement.style.zIndex = '999999';
      timeElement.style.transition = 'opacity 0.3s ease';
      timeElement.style.pointerEvents = 'auto';
      timeElement.style.display = 'none';

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
          if (closeBtn.style.display !== 'none' && !closeBtn.matches(':hover')) {
            closeBtn.style.display = 'none';
          }
        }, 50);
      });
      closeBtn.addEventListener('mouseleave', function () {
        closeBtn.style.display = 'none';
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
        userSelect: 'none'
      });
      btn.addEventListener('mousedown', function (e) {
        return e.stopPropagation();
      }); // 阻止拖拽
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
  }, {
    key: "checkIsToShow",
    value: function checkIsToShow() {
      if (!this.showWhenVideoFullscreen) {
        return false;
      }
      var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      var isFull = fsEl && (fsEl === this.media || fsEl.contains(this.media) || this.media.contains(fsEl));
      return isFull;
    }
  }, {
    key: "_resetCloseButton",
    value: function _resetCloseButton() {
      if (this._closeBtn) this._closeBtn.style.display = 'none';
    }
  }, {
    key: "show",
    value: function show() {
      this.updateTime();
      this.timeElement.style.display = 'block';
      this.timeElement.style.zIndex = '999999';
      this.timeElement.style.opacity = '1';
      this._resetCloseButton();
      if (this.layoutMode === 'float') {
        this.teardownDragging();
        var floatParent = document.fullscreenElement || document.body;
        if (this.timeElement.parentElement !== floatParent) {
          floatParent.appendChild(this.timeElement);
        }
        this.applyFloatPosition();
        this.setupDragging();
      } else {
        this.teardownDragging();
        this.timeElement.style.position = 'absolute';
        this.timeElement.style.top = '10px';
        this.timeElement.style.left = '50%';
        this.timeElement.style.transform = 'translateX(-50%)';
        if (this.timeElement.parentElement !== this.media.parentElement) {
          this.media.parentElement.appendChild(this.timeElement);
        }
      }
      if (this.autoHide) {
        this.startAutoHide();
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.clearAutoHideTimer();
      this.teardownMouseListener();
      this.teardownDragging();
      this.timeElement.style.display = 'none';
      if (this.timeElement.parentElement === this.media.parentElement) {
        this.media.parentElement.removeChild(this.timeElement);
      }
    }
  }, {
    key: "updateVisibility",
    value: function updateVisibility() {
      // 检查是否在全屏且设置中启用了全屏显示
      if (this.checkIsToShow()) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: "startAutoHide",
    value: function startAutoHide() {
      var _this3 = this;
      this.timeElement.style.opacity = '1';
      this.clearAutoHideTimer();
      this.setupMouseListener();
      this.autoHideTimer = setTimeout(function () {
        return _this3.fadeOut();
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
    key: "setupMouseListener",
    value: function setupMouseListener() {
      var _this4 = this;
      this.teardownMouseListener();
      this._boundMouseMoveHandler = function () {
        if (_this4.autoHide) {
          _this4.timeElement.style.opacity = '1';
          _this4.clearAutoHideTimer();
          _this4.autoHideTimer = setTimeout(function () {
            return _this4.fadeOut();
          }, 3000);
        }
      };
      this.media.addEventListener('mousemove', this._boundMouseMoveHandler);
    }
  }, {
    key: "teardownMouseListener",
    value: function teardownMouseListener() {
      if (this._boundMouseMoveHandler) {
        this.media.removeEventListener('mousemove', this._boundMouseMoveHandler);
        this._boundMouseMoveHandler = null;
      }
    }
  }, {
    key: "fadeOut",
    value: function fadeOut() {
      this.timeElement.style.opacity = '0';
    }
  }, {
    key: "applyFloatPosition",
    value: function applyFloatPosition() {
      // 视频全屏时用 absolute（挂在全屏元素下），否则用 fixed（挂在 body 下）
      this.timeElement.style.position = document.fullscreenElement ? 'absolute' : 'fixed';
      this.timeElement.style.transform = 'none';
      if (this.floatPosition) {
        this.timeElement.style.left = "".concat(this.floatPosition.x, "px");
        this.timeElement.style.top = "".concat(this.floatPosition.y, "px");
      } else {
        this.timeElement.style.left = '50%';
        this.timeElement.style.top = '20px';
        this.timeElement.style.transform = 'translateX(-50%)';
      }
    }
  }, {
    key: "setupDragging",
    value: function setupDragging() {
      var _this5 = this;
      this.teardownDragging();
      this._isDragging = false;
      this.timeElement.style.cursor = 'move';
      this.timeElement.style.userSelect = 'none';
      this._boundMouseDownStart = function (e) {
        return _this5._onDragStart(e);
      };
      this._boundMouseUpEnd = function () {
        return _this5._onDragEnd();
      };
      this.timeElement.addEventListener('mousedown', this._boundMouseDownStart);
      document.addEventListener('mouseup', this._boundMouseUpEnd);
    }
  }, {
    key: "teardownDragging",
    value: function teardownDragging() {
      this.timeElement.style.cursor = '';
      this.timeElement.style.userSelect = '';
      if (this._boundMouseDownStart) {
        this.timeElement.removeEventListener('mousedown', this._boundMouseDownStart);
        this._boundMouseDownStart = null;
      }
      if (this._boundMouseMoveDuring) {
        document.removeEventListener('mousemove', this._boundMouseMoveDuring);
        this._boundMouseMoveDuring = null;
      }
      if (this._boundMouseUpEnd) {
        document.removeEventListener('mouseup', this._boundMouseUpEnd);
        this._boundMouseUpEnd = null;
      }
      this._isDragging = false;
    }
  }, {
    key: "_onDragStart",
    value: function _onDragStart(e) {
      var _this6 = this;
      this._isDragging = true;
      var rect = this.timeElement.getBoundingClientRect();
      this._dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this._boundMouseMoveDuring = function (e) {
        return _this6._onDragMove(e);
      };
      document.addEventListener('mousemove', this._boundMouseMoveDuring);
    }
  }, {
    key: "_onDragMove",
    value: function _onDragMove(e) {
      if (!this._isDragging) return;
      this.timeElement.style.position = 'fixed';
      this.timeElement.style.transform = 'none';
      this.timeElement.style.left = "".concat(e.clientX - this._dragOffset.x, "px");
      this.timeElement.style.top = "".concat(e.clientY - this._dragOffset.y, "px");
    }
  }, {
    key: "_onDragEnd",
    value: function _onDragEnd() {
      if (!this._isDragging) return;
      this._isDragging = false;
      document.removeEventListener('mousemove', this._boundMouseMoveDuring);
      this._boundMouseMoveDuring = null;
      var rect = this.timeElement.getBoundingClientRect();
      this.floatPosition = {
        x: Math.round(rect.left),
        y: Math.round(rect.top)
      };
      chrome.storage.sync.set({
        floatPosition: this.floatPosition
      });
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      var now = new Date();
      var hours = String(now.getHours()).padStart(2, '0');
      var minutes = String(now.getMinutes()).padStart(2, '0');
      var systemTime = this.showSeconds ? "".concat(hours, ":").concat(minutes, ":").concat(String(now.getSeconds()).padStart(2, '0')) : "".concat(hours, ":").concat(minutes);
      if (this.showProgress) {
        var currentTime = this.media.currentTime;
        var duration = this.media.duration;
        this._timeTextSpan.textContent = "".concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(currentTime), " / ").concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration), " | ").concat(systemTime);
      } else {
        this._timeTextSpan.textContent = systemTime;
      }
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this7 = this;
      // Update time every second if media is fullscreen
      setInterval(function () {
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        var isFull = fsEl && (fsEl === _this7.media || fsEl.contains(_this7.media) || _this7.media.contains(fsEl));
        if (isFull && _this7.showWhenVideoFullscreen) {
          _this7.updateTime();
        }
      }, 1000);

      // Listen to fullscreen change events
      var updateVisibilityBound = this.updateVisibility.bind(this);
      document.addEventListener('fullscreenchange', updateVisibilityBound);
      document.addEventListener('webkitfullscreenchange', updateVisibilityBound);
      document.addEventListener('mozfullscreenchange', updateVisibilityBound);
      document.addEventListener('MSFullscreenChange', updateVisibilityBound);
    }
  }, {
    key: "setupSettingsListener",
    value: function setupSettingsListener() {
      var _this8 = this;
      // Listen to storage changes to update settings in real-time
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync') {
          if ('showWhenVideoFullscreen' in changes) {
            _this8.showWhenVideoFullscreen = changes.showWhenVideoFullscreen.newValue;
          }
          if ('showOnFullscreen' in changes) {
            _this8.showOnFullscreen = changes.showOnFullscreen.newValue;
          }
          if ('showSeconds' in changes) {
            _this8.showSeconds = changes.showSeconds.newValue;
          }
          if ('showProgress' in changes) {
            _this8.showProgress = changes.showProgress.newValue;
          }
          if ('autoHide' in changes) {
            _this8.autoHide = changes.autoHide.newValue;
          }
          if ('layoutMode' in changes) {
            _this8.layoutMode = changes.layoutMode.newValue;
          }
          if ('language' in changes) {
            // Re-translate close button title
            if (_this8._closeBtn) {
              _this8._closeBtn.title = (0,_i18n__WEBPACK_IMPORTED_MODULE_1__.t)('closeBtnTitle');
            }
          }
          _this8.updateVisibility();
        }
      });
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
    key: "show",
    value: function show() {
      this.updateTime();
      this.timeElement.style.display = 'block';
      this.timeElement.style.zIndex = '999999';
      this._resetCloseButton();
      if (this.layoutMode === 'float') {
        this.teardownDragging();
        var floatParent = document.fullscreenElement || document.body;
        if (this.timeElement.parentElement !== floatParent) {
          floatParent.appendChild(this.timeElement);
        }
        this.applyFloatPosition();
        this.setupDragging();
      } else {
        this.teardownDragging();
        this.timeElement.style.position = 'fixed';
        this.timeElement.style.top = '10px';
        this.timeElement.style.left = '50%';
        this.timeElement.style.transform = 'translateX(-50%)';
        if (this.timeElement.parentElement !== document.body) {
          document.body.appendChild(this.timeElement);
        }
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.teardownDragging();
      this.timeElement.style.display = 'none';
      if (this.timeElement.parentElement === document.body) {
        document.body.removeChild(this.timeElement);
      }
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      var now = new Date();
      var hours = String(now.getHours()).padStart(2, '0');
      var minutes = String(now.getMinutes()).padStart(2, '0');
      var systemTime = this.showSeconds ? "".concat(hours, ":").concat(minutes, ":").concat(String(now.getSeconds()).padStart(2, '0')) : "".concat(hours, ":").concat(minutes);
      this._timeTextSpan.textContent = systemTime;
    }
  }, {
    key: "checkIsToShow",
    value: function checkIsToShow() {
      if (!this.showOnFullscreen) {
        return false;
      }

      // 元素全屏（视频全屏）时：如果视频专用显示已开启，不再重复显示
      if (document.fullscreenElement !== null) {
        return !this.showWhenVideoFullscreen;
      }

      // 浏览器全屏（F11）时显示
      return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this9 = this;
      // Update visibility initially
      this.updateVisibility();
      // Update time every second
      setInterval(function () {
        _this9.updateTime();
      }, 1000);
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




// 初始化自定义 i18n（异步加载翻译）
(0,_i18n__WEBPACK_IMPORTED_MODULE_2__.init)();
console.log((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgLoaded'));
function scanForMedia(document) {
  var mediaTagSelector = 'video';
  var regularMedia = document.querySelectorAll(mediaTagSelector);
  return regularMedia;
}

// 收集所有 TimeDisplay 实例，供非持久快捷键直接操作
var _timeDisplays = [];
function injectForMedias() {
  var medias = scanForMedia(document);
  if (medias === undefined || medias.length === 0) {
    console.warn((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgNoMedia'));
    setTimeout(injectForMedias, 2000);
    return;
  }
  console.log((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgFoundMedia'), medias);
  medias.forEach(function (media) {
    _timeDisplays.push(new _widgets__WEBPACK_IMPORTED_MODULE_1__.TimeDisplay(media));
  });
}
injectForMedias();
var overlayTimeDisp = new _widgets__WEBPACK_IMPORTED_MODULE_1__.WindowOverlayTimeDisplay(document.body);
window.addEventListener('resize', function () {
  overlayTimeDisp.updateVisibility();
});

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
  if (settingKey === 'showWhenVideoFullscreen') {
    _timeDisplays.forEach(function (d) {
      d.showWhenVideoFullscreen = value;
      d.updateVisibility();
    });
    overlayTimeDisp.showWhenVideoFullscreen = value;
    overlayTimeDisp.updateVisibility();
  } else if (settingKey === 'showOnFullscreen') {
    overlayTimeDisp.showOnFullscreen = value;
    overlayTimeDisp.updateVisibility();
  } else if (settingKey === 'layoutMode') {
    _timeDisplays.forEach(function (d) {
      d.layoutMode = value;
      d.updateVisibility();
    });
    overlayTimeDisp.layoutMode = value;
    overlayTimeDisp.updateVisibility();
  }
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
  var isFs = document.fullscreenElement || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
  if (!isFs) {
    restoreTempValues();
  }
}
document.addEventListener('fullscreenchange', checkFullscreenExit);
window.addEventListener('resize', checkFullscreenExit);

// 关闭按钮 × → 临时隐藏（同快捷键 hide 行为）
document.addEventListener('fs-time-dismiss', function (e) {
  var settingKey = e.detail.displayType === 'window-overlay' ? 'showOnFullscreen' : 'showWhenVideoFullscreen';
  var currentVal = settingKey === 'showWhenVideoFullscreen' ? overlayTimeDisp.showWhenVideoFullscreen : overlayTimeDisp.showOnFullscreen;
  if (currentVal === false) return; // 已经隐藏
  tempToggle(settingKey, false, currentVal);
  console.log("[".concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgDismissLabel'), "] ").concat(settingKey, " ").concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgDismissed')));
});
document.addEventListener('keydown', function (e) {
  var isFs = document.fullscreenElement || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
  if (!isFs) return;

  // ESC 有浏览器退出全屏的默认行为，不应进入快捷键逻辑
  if (e.key === 'Escape') return;
  var pressed = buildKeyString(e);
  if (!pressed) return;
  chrome.storage.sync.get(['keyToggleLayout', 'keyToggleVisibility'], function (items) {
    if (pressed === items.keyToggleLayout) {
      e.preventDefault();
      e.stopPropagation();
      // 从 widget 实例读取当前布局模式（storage 未被 shortcut 写过）
      var currentMode = overlayTimeDisp.layoutMode;
      var newMode = currentMode === 'float' ? 'snap' : 'float';
      tempToggle('layoutMode', newMode, currentMode);
      console.log("[".concat((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgLayoutToggle'), "] ").concat(newMode === 'float' ? (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgFloat') : (0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)('msgSnap')));
    }
    if (pressed === items.keyToggleVisibility) {
      e.preventDefault();
      e.stopPropagation();
      var inVideoFs = !!document.fullscreenElement;
      var settingKey = inVideoFs ? 'showWhenVideoFullscreen' : 'showOnFullscreen';
      // 从 widget 实例读取当前状态（storage 从未被 shortcut 写过）
      var currentVal = settingKey === 'showWhenVideoFullscreen' ? overlayTimeDisp.showWhenVideoFullscreen : overlayTimeDisp.showOnFullscreen;
      tempToggle(settingKey, !currentVal, currentVal);
      console.log((0,_i18n__WEBPACK_IMPORTED_MODULE_2__.t)(!currentVal ? 'msgVisibilityOn' : 'msgVisibilityOff'));
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL2kxOG4uanMiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy93aWRnZXRzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEN1c3RvbSBpMThuIG1vZHVsZSBmb3IgY29udGVudCBzY3JpcHQgKHdlYnBhY2stYnVuZGxlZCkuXG4gKiBMb2FkcyB0cmFuc2xhdGlvbnMgZnJvbSBfbG9jYWxlcy97bGFuZ30vbWVzc2FnZXMuanNvbiBhdCBydW50aW1lLlxuICovXG5cbmNvbnN0IFNVUFBPUlRFRF9MQU5HUyA9IFsnZW4nLCAnemhfQ04nXTtcbmNvbnN0IFNUT1JBR0VfS0VZID0gJ2xhbmd1YWdlJztcblxubGV0IF9jdXJyZW50TGFuZyA9IG51bGw7XG5sZXQgX3RyYW5zbGF0aW9ucyA9IHt9O1xubGV0IF9pbml0UHJvbWlzZSA9IG51bGw7XG5cbi8qKlxuICogVHJhbnNsYXRlIGEgbWVzc2FnZSBrZXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0KGtleSkge1xuICBpZiAoX3RyYW5zbGF0aW9uc1trZXldICYmIF90cmFuc2xhdGlvbnNba2V5XS5tZXNzYWdlKSB7XG4gICAgcmV0dXJuIF90cmFuc2xhdGlvbnNba2V5XS5tZXNzYWdlO1xuICB9XG4gIC8vIEZhbGxiYWNrIHRvIENocm9tZSBpMThuXG4gIHRyeSB7XG4gICAgcmV0dXJuIGNocm9tZS5pMThuLmdldE1lc3NhZ2Uoa2V5KSB8fCBrZXk7XG4gIH0gY2F0Y2goZSkge1xuICAgIHJldHVybiBrZXk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRMYW5nKCkge1xuICByZXR1cm4gX2N1cnJlbnRMYW5nO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgaTE4bjogcmVhZCBzdG9yZWQgbGFuZ3VhZ2UsIGxvYWQgdHJhbnNsYXRpb25zLlxuICogQ2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcyBzYWZlbHkg4oCUIHJldHVybnMgc2FtZSBwcm9taXNlIG9uIHN1YnNlcXVlbnQgY2FsbHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBpZiAoX2luaXRQcm9taXNlKSByZXR1cm4gX2luaXRQcm9taXNlO1xuICBfaW5pdFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFNUT1JBR0VfS0VZLCAoaXRlbXMpID0+IHtcbiAgICAgIGNvbnN0IHN0b3JlZCA9IGl0ZW1zW1NUT1JBR0VfS0VZXTtcbiAgICAgIGNvbnN0IGJyb3dzZXJMYW5nID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgICBjb25zdCBtYXBwZWQgPSBicm93c2VyTGFuZy5yZXBsYWNlKCctJywgJ18nKTtcbiAgICAgIGNvbnN0IGJlc3RMYW5nID0gc3RvcmVkIHx8IChTVVBQT1JURURfTEFOR1MuaW5jbHVkZXMobWFwcGVkKSA/IG1hcHBlZCA6ICdlbicpO1xuICAgICAgbG9hZExhbmcoYmVzdExhbmcpLnRoZW4oKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBfaW5pdFByb21pc2U7XG59XG5cbi8qKlxuICogUmVsb2FkIHRyYW5zbGF0aW9ucyBmb3IgYSBkaWZmZXJlbnQgbGFuZ3VhZ2UgKGNhbGxlZCB3aGVuIHN0b3JhZ2UgY2hhbmdlcykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWxvYWRGcm9tU3RvcmFnZSgpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU1RPUkFHRV9LRVksIChpdGVtcykgPT4ge1xuICAgICAgY29uc3QgbGFuZyA9IGl0ZW1zW1NUT1JBR0VfS0VZXSB8fCBfY3VycmVudExhbmcgfHwgJ2VuJztcbiAgICAgIGlmIChsYW5nICE9PSBfY3VycmVudExhbmcpIHtcbiAgICAgICAgbG9hZExhbmcobGFuZykudGhlbigoKSA9PiByZXNvbHZlKHRydWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBMb2FkIHRyYW5zbGF0aW9ucyBmb3IgYSBnaXZlbiBsYW5ndWFnZSBmcm9tIF9sb2NhbGVzL3tsYW5nfS9tZXNzYWdlcy5qc29uLlxuICovXG5mdW5jdGlvbiBsb2FkTGFuZyhsYW5nKSB7XG4gIGlmIChsYW5nID09PSBfY3VycmVudExhbmcgJiYgT2JqZWN0LmtleXMoX3RyYW5zbGF0aW9ucykubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfVxuICBjb25zdCB1cmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoYF9sb2NhbGVzLyR7bGFuZ30vbWVzc2FnZXMuanNvbmApO1xuICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKHJlc3AgPT4ge1xuICAgICAgaWYgKCFyZXNwLm9rKSB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkICR7dXJsfWApO1xuICAgICAgcmV0dXJuIHJlc3AuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICBfdHJhbnNsYXRpb25zID0gZGF0YTtcbiAgICAgIF9jdXJyZW50TGFuZyA9IGxhbmc7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgaWYgKGxhbmcgIT09ICdlbicpIHJldHVybiBsb2FkTGFuZygnZW4nKTtcbiAgICAgIF90cmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgIF9jdXJyZW50TGFuZyA9ICdlbic7XG4gICAgfSk7XG59XG4iLCIvLyBmb3JtYXQgdGltZSBpbiBzZWNvbmRzIHRvIG1tOnNzXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcclxuICAgIGlmIChpc05hTihzZWNvbmRzKSkgcmV0dXJuICcwMDowMCc7XHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgY29uc3Qgc2VjcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcclxuICAgIHJldHVybiBgJHtTdHJpbmcobWlucykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcoc2VjcykucGFkU3RhcnQoMiwgJzAnKX1gO1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBmdWxsc2NyZWVuIGZvciBicm93c2VyXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ID09PSBzY3JlZW4uaGVpZ2h0ICYmIHdpbmRvdy5pbm5lcldpZHRoID09PSBzY3JlZW4ud2lkdGg7XHJcbn0iLCJpbXBvcnQgeyBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4sIGZvcm1hdFRpbWUgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgdCwgaW5pdCB9IGZyb20gJy4vaTE4bic7XHJcblxyXG5leHBvcnQgY2xhc3MgVGltZURpc3BsYXkge1xyXG4gIGNvbnN0cnVjdG9yKG1lZGlhKSB7XHJcbiAgICB0aGlzLm1lZGlhID0gbWVkaWE7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gdGhpcy5jcmVhdGVUaW1lRWxlbWVudCgpO1xyXG4gICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgdGhpcy5zaG93U2Vjb25kcyA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dQcm9ncmVzcyA9IHRydWU7XHJcbiAgICB0aGlzLmF1dG9IaWRlID0gZmFsc2U7XHJcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBudWxsO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyID0gbnVsbDtcclxuICAgIHRoaXMubGF5b3V0TW9kZSA9ICdzbmFwJztcclxuICAgIHRoaXMuZmxvYXRQb3NpdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLl9kcmFnT2Zmc2V0ID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0ID0gbnVsbDtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nID0gbnVsbDtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VVcEVuZCA9IG51bGw7XHJcbiAgICB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG4gICAgdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgICB0aGlzLnNldHVwU2V0dGluZ3NMaXN0ZW5lcigpO1xyXG4gIH1cclxuXHJcbiAgbG9hZFNldHRpbmdzKCkge1xyXG4gICAgLy8g5LuOQ2hyb21l5a2Y5YKo5Lit6K+75Y+W6K6+572uXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcclxuICAgICAge1xyXG4gICAgICAgIHNob3dXaGVuVmlkZW9GdWxsc2NyZWVuOiB0cnVlLFxyXG4gICAgICAgIHNob3dPbkZ1bGxzY3JlZW46IHRydWUsXHJcbiAgICAgICAgc2hvd1NlY29uZHM6IHRydWUsXHJcbiAgICAgICAgc2hvd1Byb2dyZXNzOiB0cnVlLFxyXG4gICAgICAgIGF1dG9IaWRlOiBmYWxzZSxcclxuICAgICAgICBsYXlvdXRNb2RlOiAnc25hcCcsXHJcbiAgICAgICAgZmxvYXRQb3NpdGlvbjogbnVsbFxyXG4gICAgICB9LFxyXG4gICAgICAoaXRlbXMpID0+IHtcclxuICAgICAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gaXRlbXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW47XHJcbiAgICAgICAgdGhpcy5zaG93T25GdWxsc2NyZWVuID0gaXRlbXMuc2hvd09uRnVsbHNjcmVlbjtcclxuICAgICAgICB0aGlzLnNob3dTZWNvbmRzID0gaXRlbXMuc2hvd1NlY29uZHM7XHJcbiAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSBpdGVtcy5zaG93UHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGl0ZW1zLmF1dG9IaWRlO1xyXG4gICAgICAgIHRoaXMubGF5b3V0TW9kZSA9IGl0ZW1zLmxheW91dE1vZGUgfHwgJ3NuYXAnO1xyXG4gICAgICAgIHRoaXMuZmxvYXRQb3NpdGlvbiA9IGl0ZW1zLmZsb2F0UG9zaXRpb24gfHwgbnVsbDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGRpc3BsYXlUeXBlKCkge1xyXG4gICAgcmV0dXJuICdtZWRpYSc7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVUaW1lRWxlbWVudCgpIHtcclxuICAgIGNvbnN0IHRpbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLCAwLCAwLCAwLjUpJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmNvbG9yID0gJ3doaXRlJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLnBhZGRpbmcgPSAnNXB4JztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC4zcyBlYXNlJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cclxuICAgIC8vIOeLrOeri+aWh+Wtl+WuueWZqO+8iOS4jiDDlyDmjInpkq7lubbliJfvvIzpgb/lhY0gdXBkYXRlVGltZSDor6/liKDmjInpkq7vvIlcclxuICAgIGNvbnN0IHRleHRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgdGV4dFNwYW4udGV4dENvbnRlbnQgPSAnMDA6MDAgLyAwMDowMCc7XHJcbiAgICB0aGlzLl90aW1lVGV4dFNwYW4gPSB0ZXh0U3BhbjtcclxuICAgIHRpbWVFbGVtZW50LmFwcGVuZENoaWxkKHRleHRTcGFuKTtcclxuXHJcbiAgICBjb25zdCBjbG9zZUJ0biA9IHRoaXMuX2NyZWF0ZUNsb3NlQnV0dG9uKCk7XHJcbiAgICB0aGlzLl9jbG9zZUJ0biA9IGNsb3NlQnRuO1xyXG5cclxuICAgIC8vIOS9v+eUqCBtb3VzZW92ZXIvbW91c2VvdXQgKyByZWxhdGVkVGFyZ2V0IOWkhOeQhiBob3Zlcu+8jOmBv+WFjee7neWvueWumuS9jeWtkOWFg+e0oOWvvOiHtOeahOS6i+S7tumXrumimFxyXG4gICAgdGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsICgpID0+IHsgY2xvc2VCdG4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7IH0pO1xyXG4gICAgdGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcclxuICAgICAgLy8g5b2T6byg5qCH56a75byAIHRpbWVFbGVtZW50IOS4lOacqui/m+WFpSBjbG9zZUJ0biDml7bmiY3pmpDol49cclxuICAgICAgLy8g5bu26L+f6K6pIG1vdXNlZW50ZXIgY2xvc2VCdG4g5pyJ5py65Lya6Kem5Y+RXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGlmIChjbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScgJiYgIWNsb3NlQnRuLm1hdGNoZXMoJzpob3ZlcicpKSB7XHJcbiAgICAgICAgICBjbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgNTApO1xyXG4gICAgfSk7XHJcbiAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4geyBjbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyB9KTtcclxuXHJcbiAgICB0aW1lRWxlbWVudC5hcHBlbmRDaGlsZChjbG9zZUJ0bik7XHJcbiAgICByZXR1cm4gdGltZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICAvLyDliJvlu7rlj7PkuIrop5LlhbPpl63mjInpkq4gw5fvvIjkvY3kuo4gdGltZUVsZW1lbnQg5YaF6YOo5Y+z5LiK6KeS77yJXHJcbiAgX2NyZWF0ZUNsb3NlQnV0dG9uKCkge1xyXG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgYnRuLnRleHRDb250ZW50ID0gJ8OXJztcclxuICAgIGJ0bi50aXRsZSA9IHQoJ2Nsb3NlQnRuVGl0bGUnKTtcclxuICAgIE9iamVjdC5hc3NpZ24oYnRuLnN0eWxlLCB7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB0b3A6ICcxcHgnLFxyXG4gICAgICByaWdodDogJzFweCcsXHJcbiAgICAgIHdpZHRoOiAnMThweCcsXHJcbiAgICAgIGhlaWdodDogJzE4cHgnLFxyXG4gICAgICBsaW5lSGVpZ2h0OiAnMThweCcsXHJcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwLjcpJyxcclxuICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcclxuICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgIGRpc3BsYXk6ICdub25lJyxcclxuICAgICAgekluZGV4OiAnMTAwMDAwMCcsXHJcbiAgICAgIGJveFNoYWRvdzogJzAgMXB4IDNweCByZ2JhKDAsMCwwLDAuMyknLFxyXG4gICAgICB1c2VyU2VsZWN0OiAnbm9uZSdcclxuICAgIH0pO1xyXG5cclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSk7IC8vIOmYu+atouaLluaLvVxyXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5oYW5kbGVEaXNtaXNzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gYnRuO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRGlzbWlzcygpIHtcclxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdmcy10aW1lLWRpc21pc3MnLCB7XHJcbiAgICAgIGRldGFpbDogeyBkaXNwbGF5VHlwZTogdGhpcy5kaXNwbGF5VHlwZSgpIH1cclxuICAgIH0pKTtcclxuICB9XHJcblxyXG4gIGNoZWNrSXNUb1Nob3coKSB7XHJcbiAgICBpZiAoIXRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZzRWwgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50O1xyXG4gICAgY29uc3QgaXNGdWxsID0gZnNFbCAmJiAoZnNFbCA9PT0gdGhpcy5tZWRpYSB8fCBmc0VsLmNvbnRhaW5zKHRoaXMubWVkaWEpIHx8IHRoaXMubWVkaWEuY29udGFpbnMoZnNFbCkpO1xyXG4gICAgcmV0dXJuIGlzRnVsbDtcclxuICB9XHJcblxyXG4gIF9yZXNldENsb3NlQnV0dG9uKCkge1xyXG4gICAgaWYgKHRoaXMuX2Nsb3NlQnRuKSB0aGlzLl9jbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcbiAgICB0aGlzLl9yZXNldENsb3NlQnV0dG9uKCk7XHJcblxyXG4gICAgaWYgKHRoaXMubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0Jykge1xyXG4gICAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgICAgY29uc3QgZmxvYXRQYXJlbnQgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG4gICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBmbG9hdFBhcmVudCkge1xyXG4gICAgICAgIGZsb2F0UGFyZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYXBwbHlGbG9hdFBvc2l0aW9uKCk7XHJcbiAgICAgIHRoaXMuc2V0dXBEcmFnZ2luZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcxMHB4JztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xyXG4gICAgICB0aGlzLnN0YXJ0QXV0b0hpZGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xyXG4gICAgdGhpcy50ZWFyZG93bk1vdXNlTGlzdGVuZXIoKTtcclxuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCA9PT0gdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMubWVkaWEucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XHJcbiAgICAvLyDmo4Dmn6XmmK/lkKblnKjlhajlsY/kuJTorr7nva7kuK3lkK/nlKjkuoblhajlsY/mmL7npLpcclxuICAgIGlmICh0aGlzLmNoZWNrSXNUb1Nob3coKSkge1xyXG4gICAgICB0aGlzLnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhcnRBdXRvSGlkZSgpIHtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICB0aGlzLnNldHVwTW91c2VMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmZhZGVPdXQoKSwgMzAwMCk7XHJcbiAgfVxyXG5cclxuICBjbGVhckF1dG9IaWRlVGltZXIoKSB7XHJcbiAgICBpZiAodGhpcy5hdXRvSGlkZVRpbWVyKSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmF1dG9IaWRlVGltZXIpO1xyXG4gICAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0dXBNb3VzZUxpc3RlbmVyKCkge1xyXG4gICAgdGhpcy50ZWFyZG93bk1vdXNlTGlzdGVuZXIoKTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcbiAgICAgICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcclxuICAgICAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmFkZU91dCgpLCAzMDAwKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHRoaXMubWVkaWEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIHRlYXJkb3duTW91c2VMaXN0ZW5lcigpIHtcclxuICAgIGlmICh0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIpIHtcclxuICAgICAgdGhpcy5tZWRpYS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIpO1xyXG4gICAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZmFkZU91dCgpIHtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICB9XHJcblxyXG4gIGFwcGx5RmxvYXRQb3NpdGlvbigpIHtcclxuICAgIC8vIOinhumikeWFqOWxj+aXtueUqCBhYnNvbHV0Ze+8iOaMguWcqOWFqOWxj+WFg+e0oOS4i++8ie+8jOWQpuWImeeUqCBmaXhlZO+8iOaMguWcqCBib2R5IOS4i++8iVxyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ID8gJ2Fic29sdXRlJyA6ICdmaXhlZCc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICdub25lJztcclxuICAgIGlmICh0aGlzLmZsb2F0UG9zaXRpb24pIHtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5mbG9hdFBvc2l0aW9uLnh9cHhgO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9IGAke3RoaXMuZmxvYXRQb3NpdGlvbi55fXB4YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcyMHB4JztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXR1cERyYWdnaW5nKCkge1xyXG4gICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudXNlclNlbGVjdCA9ICdub25lJztcclxuXHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0ID0gKGUpID0+IHRoaXMuX29uRHJhZ1N0YXJ0KGUpO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZVVwRW5kID0gKCkgPT4gdGhpcy5fb25EcmFnRW5kKCk7XHJcblxyXG4gICAgdGhpcy50aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0KTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9ib3VuZE1vdXNlVXBFbmQpO1xyXG4gIH1cclxuXHJcbiAgdGVhcmRvd25EcmFnZ2luZygpIHtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJyc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSAnJztcclxuICAgIGlmICh0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0KSB7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCk7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nKTtcclxuICAgICAgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuX2JvdW5kTW91c2VVcEVuZCkge1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fYm91bmRNb3VzZVVwRW5kKTtcclxuICAgICAgdGhpcy5fYm91bmRNb3VzZVVwRW5kID0gbnVsbDtcclxuICAgIH1cclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIF9vbkRyYWdTdGFydChlKSB7XHJcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gdHJ1ZTtcclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnRpbWVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5fZHJhZ09mZnNldCA9IHsgeDogZS5jbGllbnRYIC0gcmVjdC5sZWZ0LCB5OiBlLmNsaWVudFkgLSByZWN0LnRvcCB9O1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcgPSAoZSkgPT4gdGhpcy5fb25EcmFnTW92ZShlKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nKTtcclxuICB9XHJcblxyXG4gIF9vbkRyYWdNb3ZlKGUpIHtcclxuICAgIGlmICghdGhpcy5faXNEcmFnZ2luZykgcmV0dXJuO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICdub25lJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2UuY2xpZW50WCAtIHRoaXMuX2RyYWdPZmZzZXQueH1weGA7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9IGAke2UuY2xpZW50WSAtIHRoaXMuX2RyYWdPZmZzZXQueX1weGA7XHJcbiAgfVxyXG5cclxuICBfb25EcmFnRW5kKCkge1xyXG4gICAgaWYgKCF0aGlzLl9pc0RyYWdnaW5nKSByZXR1cm47XHJcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyk7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyA9IG51bGw7XHJcblxyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMudGltZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLmZsb2F0UG9zaXRpb24gPSB7IHg6IE1hdGgucm91bmQocmVjdC5sZWZ0KSwgeTogTWF0aC5yb3VuZChyZWN0LnRvcCkgfTtcclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgZmxvYXRQb3NpdGlvbjogdGhpcy5mbG9hdFBvc2l0aW9uIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlVGltZSgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IHN5c3RlbVRpbWUgPSB0aGlzLnNob3dTZWNvbmRzXHJcbiAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgIDogYCR7aG91cnN9OiR7bWludXRlc31gO1xyXG5cclxuICAgIGlmICh0aGlzLnNob3dQcm9ncmVzcykge1xyXG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMubWVkaWEuY3VycmVudFRpbWU7XHJcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcclxuICAgICAgdGhpcy5fdGltZVRleHRTcGFuLnRleHRDb250ZW50ID0gYCR7Zm9ybWF0VGltZShjdXJyZW50VGltZSl9IC8gJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gfCAke3N5c3RlbVRpbWV9YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3RpbWVUZXh0U3Bhbi50ZXh0Q29udGVudCA9IHN5c3RlbVRpbWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cclxuXHJcbiAgICAvLyBVcGRhdGUgdGltZSBldmVyeSBzZWNvbmQgaWYgbWVkaWEgaXMgZnVsbHNjcmVlblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgICAgY29uc3QgaXNGdWxsID0gZnNFbCAmJiAoZnNFbCA9PT0gdGhpcy5tZWRpYSB8fCBmc0VsLmNvbnRhaW5zKHRoaXMubWVkaWEpIHx8IHRoaXMubWVkaWEuY29udGFpbnMoZnNFbCkpO1xyXG4gICAgICBpZiAoaXNGdWxsICYmIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgLy8gTGlzdGVuIHRvIGZ1bGxzY3JlZW4gY2hhbmdlIGV2ZW50c1xyXG4gICAgY29uc3QgdXBkYXRlVmlzaWJpbGl0eUJvdW5kID0gdGhpcy51cGRhdGVWaXNpYmlsaXR5LmJpbmQodGhpcyk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96ZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdNU0Z1bGxzY3JlZW5DaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gIH1cclxuXHJcbiAgc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCkge1xyXG4gICAgLy8gTGlzdGVuIHRvIHN0b3JhZ2UgY2hhbmdlcyB0byB1cGRhdGUgc2V0dGluZ3MgaW4gcmVhbC10aW1lXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIG5hbWVzcGFjZSkgPT4ge1xyXG4gICAgICBpZiAobmFtZXNwYWNlID09PSAnc3luYycpIHtcclxuICAgICAgICBpZiAoJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gY2hhbmdlcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbi5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93T25GdWxsc2NyZWVuJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSBjaGFuZ2VzLnNob3dPbkZ1bGxzY3JlZW4ubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd1NlY29uZHMnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1NlY29uZHMgPSBjaGFuZ2VzLnNob3dTZWNvbmRzLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dQcm9ncmVzcycgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSBjaGFuZ2VzLnNob3dQcm9ncmVzcy5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdhdXRvSGlkZScgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGNoYW5nZXMuYXV0b0hpZGUubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnbGF5b3V0TW9kZScgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5sYXlvdXRNb2RlID0gY2hhbmdlcy5sYXlvdXRNb2RlLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ2xhbmd1YWdlJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICAvLyBSZS10cmFuc2xhdGUgY2xvc2UgYnV0dG9uIHRpdGxlXHJcbiAgICAgICAgICBpZiAodGhpcy5fY2xvc2VCdG4pIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xvc2VCdG4udGl0bGUgPSB0KCdjbG9zZUJ0blRpdGxlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkgZXh0ZW5kcyBUaW1lRGlzcGxheSB7XHJcbiAgICBkaXNwbGF5VHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gJ3dpbmRvdy1vdmVybGF5JztcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgICAgICB0aGlzLl9yZXNldENsb3NlQnV0dG9uKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdmbG9hdCcpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZsb2F0UGFyZW50ID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZmxvYXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0UGFyZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlGbG9hdFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBEcmFnZ2luZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtVGltZSA9IHRoaXMuc2hvd1NlY29uZHNcclxuICAgICAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcclxuICAgICAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPSBzeXN0ZW1UaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrSXNUb1Nob3coKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNob3dPbkZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5YWD57Sg5YWo5bGP77yI6KeG6aKR5YWo5bGP77yJ5pe277ya5aaC5p6c6KeG6aKR5LiT55So5pi+56S65bey5byA5ZCv77yM5LiN5YaN6YeN5aSN5pi+56S6XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOa1j+iniOWZqOWFqOWxj++8iEYxMe+8ieaXtuaYvuekulxyXG4gICAgICAgIHJldHVybiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSB2aXNpYmlsaXR5IGluaXRpYWxseVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICAgIC8vIFVwZGF0ZSB0aW1lIGV2ZXJ5IHNlY29uZFxyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBmb3JtYXRUaW1lLCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgVGltZURpc3BsYXksIFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheSB9IGZyb20gJy4vd2lkZ2V0cyc7XHJcbmltcG9ydCB7IHQsIGluaXQgfSBmcm9tICcuL2kxOG4nO1xyXG5cclxuLy8g5Yid5aeL5YyW6Ieq5a6a5LmJIGkxOG7vvIjlvILmraXliqDovb3nv7vor5HvvIlcclxuaW5pdCgpO1xyXG5cclxuY29uc29sZS5sb2codCgnbXNnTG9hZGVkJykpO1xyXG5cclxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKGRvY3VtZW50KSB7XHJcbiAgY29uc3QgbWVkaWFUYWdTZWxlY3RvciA9ICd2aWRlbyc7XHJcbiAgXHJcbiAgY29uc3QgcmVndWxhck1lZGlhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChtZWRpYVRhZ1NlbGVjdG9yKTtcclxuICAgIHJldHVybiByZWd1bGFyTWVkaWE7XHJcbn1cclxuXHJcbi8vIOaUtumbhuaJgOaciSBUaW1lRGlzcGxheSDlrp7kvovvvIzkvpvpnZ7mjIHkuYXlv6vmjbfplK7nm7TmjqXmk43kvZxcclxuY29uc3QgX3RpbWVEaXNwbGF5cyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gaW5qZWN0Rm9yTWVkaWFzKCkge1xyXG4gIGNvbnN0IG1lZGlhcyA9IHNjYW5Gb3JNZWRpYShkb2N1bWVudCk7XHJcbiAgaWYgKG1lZGlhcyA9PT0gdW5kZWZpbmVkIHx8IG1lZGlhcy5sZW5ndGggPT09IDApIHtcclxuICAgIGNvbnNvbGUud2Fybih0KCdtc2dOb01lZGlhJykpO1xyXG4gICAgc2V0VGltZW91dChpbmplY3RGb3JNZWRpYXMsIDIwMDApO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBjb25zb2xlLmxvZyh0KCdtc2dGb3VuZE1lZGlhJyksIG1lZGlhcyk7XHJcblxyXG4gIG1lZGlhcy5mb3JFYWNoKG1lZGlhID0+IHtcclxuICAgIF90aW1lRGlzcGxheXMucHVzaChuZXcgVGltZURpc3BsYXkobWVkaWEpKTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmluamVjdEZvck1lZGlhcygpO1xyXG5jb25zdCBvdmVybGF5VGltZURpc3AgPSBuZXcgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5KGRvY3VtZW50LmJvZHkpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG59KTtcclxuXHJcbi8vIC0tLSDlv6vmjbfplK7lpITnkIbvvIjlnYfkuLrkuLTml7bliIfmjaLvvIzkuI3lhpkgc3RvcmFnZe+8iSAtLS1cclxuXHJcbi8vIOiiq+W/q+aNt+mUruS4tOaXtuaUueWKqOeahOiuvue9ru+8jOmAgOWHuuWFqOWxj+aXtuaBouWkjeWOn+WAvFxyXG5jb25zdCBfdGVtcE92ZXJyaWRlcyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gYnVpbGRLZXlTdHJpbmcoZSkge1xyXG4gIGNvbnN0IHBhcnRzID0gW107XHJcbiAgaWYgKGUuY3RybEtleSkgcGFydHMucHVzaCgnQ3RybCcpO1xyXG4gIGlmIChlLmFsdEtleSkgcGFydHMucHVzaCgnQWx0Jyk7XHJcbiAgaWYgKGUuc2hpZnRLZXkpIHBhcnRzLnB1c2goJ1NoaWZ0Jyk7XHJcbiAgaWYgKGUua2V5ID09PSAnQ29udHJvbCcgfHwgZS5rZXkgPT09ICdBbHQnIHx8IGUua2V5ID09PSAnU2hpZnQnIHx8IGUua2V5ID09PSAnTWV0YScpIHJldHVybiBudWxsO1xyXG4gIHBhcnRzLnB1c2goZS5rZXkpO1xyXG4gIHJldHVybiBwYXJ0cy5qb2luKCcrJyk7XHJcbn1cclxuXHJcbi8vIOWwhuafkOS4quiuvue9ruWAvOW6lOeUqOWIsOaJgOaciSB3aWRnZXQg5a6e5L6L77yI5LiN5YaZIHN0b3JhZ2XvvIlcclxuZnVuY3Rpb24gYXBwbHlTZXR0aW5nVG9XaWRnZXRzKHNldHRpbmdLZXksIHZhbHVlKSB7XHJcbiAgaWYgKHNldHRpbmdLZXkgPT09ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicpIHtcclxuICAgIF90aW1lRGlzcGxheXMuZm9yRWFjaChkID0+IHsgZC5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IHZhbHVlOyBkLnVwZGF0ZVZpc2liaWxpdHkoKTsgfSk7XHJcbiAgICBvdmVybGF5VGltZURpc3Auc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSB2YWx1ZTtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgfSBlbHNlIGlmIChzZXR0aW5nS2V5ID09PSAnc2hvd09uRnVsbHNjcmVlbicpIHtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC5zaG93T25GdWxsc2NyZWVuID0gdmFsdWU7XHJcbiAgICBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gIH0gZWxzZSBpZiAoc2V0dGluZ0tleSA9PT0gJ2xheW91dE1vZGUnKSB7XHJcbiAgICBfdGltZURpc3BsYXlzLmZvckVhY2goZCA9PiB7IGQubGF5b3V0TW9kZSA9IHZhbHVlOyBkLnVwZGF0ZVZpc2liaWxpdHkoKTsgfSk7XHJcbiAgICBvdmVybGF5VGltZURpc3AubGF5b3V0TW9kZSA9IHZhbHVlO1xyXG4gICAgb3ZlcmxheVRpbWVEaXNwLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIOW/q+aNt+mUruS4tOaXtuWIh+aNou+8muiusOW9leWOn+Wni+WAvCDihpIg5YaZ5YWlIHdpZGdldFxyXG5mdW5jdGlvbiB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksIG5ld1ZhbHVlLCBjdXJyZW50VmFsdWUpIHtcclxuICBpZiAoIShzZXR0aW5nS2V5IGluIF90ZW1wT3ZlcnJpZGVzKSkge1xyXG4gICAgX3RlbXBPdmVycmlkZXNbc2V0dGluZ0tleV0gPSBjdXJyZW50VmFsdWU7XHJcbiAgfVxyXG4gIGFwcGx5U2V0dGluZ1RvV2lkZ2V0cyhzZXR0aW5nS2V5LCBuZXdWYWx1ZSk7XHJcbn1cclxuXHJcbi8vIOmAgOWHuuWFqOWxj+aXtuaBouWkjeaJgOacieS4tOaXtuaUueWKqFxyXG5mdW5jdGlvbiByZXN0b3JlVGVtcFZhbHVlcygpIHtcclxuICBmb3IgKGNvbnN0IFtrZXksIG9yaWdpbmFsVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKF90ZW1wT3ZlcnJpZGVzKSkge1xyXG4gICAgYXBwbHlTZXR0aW5nVG9XaWRnZXRzKGtleSwgb3JpZ2luYWxWYWx1ZSk7XHJcbiAgfVxyXG4gIGZvciAoY29uc3Qga2V5IGluIF90ZW1wT3ZlcnJpZGVzKSB7XHJcbiAgICBkZWxldGUgX3RlbXBPdmVycmlkZXNba2V5XTtcclxuICB9XHJcbn1cclxuXHJcbi8vIOajgOa1i+mAgOWHuuWFqOWxj++8iOWQqyBGMTHvvIlcclxuZnVuY3Rpb24gY2hlY2tGdWxsc2NyZWVuRXhpdCgpIHtcclxuICBjb25zdCBpc0ZzID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XHJcbiAgaWYgKCFpc0ZzKSB7XHJcbiAgICByZXN0b3JlVGVtcFZhbHVlcygpO1xyXG4gIH1cclxufVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgY2hlY2tGdWxsc2NyZWVuRXhpdCk7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja0Z1bGxzY3JlZW5FeGl0KTtcclxuXHJcbi8vIOWFs+mXreaMiemSriDDlyDihpIg5Li05pe26ZqQ6JeP77yI5ZCM5b+r5o236ZSuIGhpZGUg6KGM5Li677yJXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZzLXRpbWUtZGlzbWlzcycsIChlKSA9PiB7XHJcbiAgY29uc3Qgc2V0dGluZ0tleSA9IGUuZGV0YWlsLmRpc3BsYXlUeXBlID09PSAnd2luZG93LW92ZXJsYXknXHJcbiAgICA/ICdzaG93T25GdWxsc2NyZWVuJ1xyXG4gICAgOiAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWwgPSBzZXR0aW5nS2V5ID09PSAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nXHJcbiAgICA/IG92ZXJsYXlUaW1lRGlzcC5zaG93V2hlblZpZGVvRnVsbHNjcmVlblxyXG4gICAgOiBvdmVybGF5VGltZURpc3Auc2hvd09uRnVsbHNjcmVlbjtcclxuICBpZiAoY3VycmVudFZhbCA9PT0gZmFsc2UpIHJldHVybjsgLy8g5bey57uP6ZqQ6JePXHJcbiAgdGVtcFRvZ2dsZShzZXR0aW5nS2V5LCBmYWxzZSwgY3VycmVudFZhbCk7XHJcbiAgY29uc29sZS5sb2coYFske3QoJ21zZ0Rpc21pc3NMYWJlbCcpfV0gJHtzZXR0aW5nS2V5fSAke3QoJ21zZ0Rpc21pc3NlZCcpfWApO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xyXG4gIGNvbnN0IGlzRnMgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcclxuICBpZiAoIWlzRnMpIHJldHVybjtcclxuXHJcbiAgLy8gRVNDIOaciea1j+iniOWZqOmAgOWHuuWFqOWxj+eahOm7mOiupOihjOS4uu+8jOS4jeW6lOi/m+WFpeW/q+aNt+mUrumAu+i+kVxyXG4gIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHJldHVybjtcclxuXHJcbiAgY29uc3QgcHJlc3NlZCA9IGJ1aWxkS2V5U3RyaW5nKGUpO1xyXG4gIGlmICghcHJlc3NlZCkgcmV0dXJuO1xyXG5cclxuICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChcclxuICAgIFsna2V5VG9nZ2xlTGF5b3V0JywgJ2tleVRvZ2dsZVZpc2liaWxpdHknXSxcclxuICAgIChpdGVtcykgPT4ge1xyXG4gICAgICBpZiAocHJlc3NlZCA9PT0gaXRlbXMua2V5VG9nZ2xlTGF5b3V0KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgLy8g5LuOIHdpZGdldCDlrp7kvovor7vlj5blvZPliY3luIPlsYDmqKHlvI/vvIhzdG9yYWdlIOacquiiqyBzaG9ydGN1dCDlhpnov4fvvIlcclxuICAgICAgICBjb25zdCBjdXJyZW50TW9kZSA9IG92ZXJsYXlUaW1lRGlzcC5sYXlvdXRNb2RlO1xyXG4gICAgICAgIGNvbnN0IG5ld01vZGUgPSBjdXJyZW50TW9kZSA9PT0gJ2Zsb2F0JyA/ICdzbmFwJyA6ICdmbG9hdCc7XHJcbiAgICAgICAgdGVtcFRvZ2dsZSgnbGF5b3V0TW9kZScsIG5ld01vZGUsIGN1cnJlbnRNb2RlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgWyR7dCgnbXNnTGF5b3V0VG9nZ2xlJyl9XSAke25ld01vZGUgPT09ICdmbG9hdCcgPyB0KCdtc2dGbG9hdCcpIDogdCgnbXNnU25hcCcpfWApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocHJlc3NlZCA9PT0gaXRlbXMua2V5VG9nZ2xlVmlzaWJpbGl0eSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IGluVmlkZW9GcyA9ICEhZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICAgICAgY29uc3Qgc2V0dGluZ0tleSA9IGluVmlkZW9GcyA/ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicgOiAnc2hvd09uRnVsbHNjcmVlbic7XHJcbiAgICAgICAgLy8g5LuOIHdpZGdldCDlrp7kvovor7vlj5blvZPliY3nirbmgIHvvIhzdG9yYWdlIOS7juacquiiqyBzaG9ydGN1dCDlhpnov4fvvIlcclxuICAgICAgICBjb25zdCBjdXJyZW50VmFsID0gc2V0dGluZ0tleSA9PT0gJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJ1xyXG4gICAgICAgICAgPyBvdmVybGF5VGltZURpc3Auc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW5cclxuICAgICAgICAgIDogb3ZlcmxheVRpbWVEaXNwLnNob3dPbkZ1bGxzY3JlZW47XHJcbiAgICAgICAgdGVtcFRvZ2dsZShzZXR0aW5nS2V5LCAhY3VycmVudFZhbCwgY3VycmVudFZhbCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codCghY3VycmVudFZhbCA/ICdtc2dWaXNpYmlsaXR5T24nIDogJ21zZ1Zpc2liaWxpdHlPZmYnKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG59KTtcclxuXHJcblxyXG4iXSwibmFtZXMiOlsiU1VQUE9SVEVEX0xBTkdTIiwiU1RPUkFHRV9LRVkiLCJfY3VycmVudExhbmciLCJfdHJhbnNsYXRpb25zIiwiX2luaXRQcm9taXNlIiwidCIsImtleSIsIm1lc3NhZ2UiLCJjaHJvbWUiLCJpMThuIiwiZ2V0TWVzc2FnZSIsImUiLCJnZXRDdXJyZW50TGFuZyIsImluaXQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiaXRlbXMiLCJzdG9yZWQiLCJicm93c2VyTGFuZyIsIm5hdmlnYXRvciIsImxhbmd1YWdlIiwibWFwcGVkIiwicmVwbGFjZSIsImJlc3RMYW5nIiwiaW5jbHVkZXMiLCJsb2FkTGFuZyIsInRoZW4iLCJyZWxvYWRGcm9tU3RvcmFnZSIsImxhbmciLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwidXJsIiwicnVudGltZSIsImdldFVSTCIsImNvbmNhdCIsImZldGNoIiwicmVzcCIsIm9rIiwiRXJyb3IiLCJqc29uIiwiZGF0YSIsImZvcm1hdFRpbWUiLCJzZWNvbmRzIiwiaXNOYU4iLCJtaW5zIiwiTWF0aCIsImZsb29yIiwic2VjcyIsIlN0cmluZyIsInBhZFN0YXJ0IiwiY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJzY3JlZW4iLCJoZWlnaHQiLCJpbm5lcldpZHRoIiwid2lkdGgiLCJUaW1lRGlzcGxheSIsIm1lZGlhIiwiX2NsYXNzQ2FsbENoZWNrIiwidGltZUVsZW1lbnQiLCJjcmVhdGVUaW1lRWxlbWVudCIsInNob3dXaGVuVmlkZW9GdWxsc2NyZWVuIiwic2hvd09uRnVsbHNjcmVlbiIsInNob3dTZWNvbmRzIiwic2hvd1Byb2dyZXNzIiwiYXV0b0hpZGUiLCJhdXRvSGlkZVRpbWVyIiwiX2JvdW5kTW91c2VNb3ZlSGFuZGxlciIsImxheW91dE1vZGUiLCJmbG9hdFBvc2l0aW9uIiwiX2lzRHJhZ2dpbmciLCJfZHJhZ09mZnNldCIsIngiLCJ5IiwiX2JvdW5kTW91c2VEb3duU3RhcnQiLCJfYm91bmRNb3VzZU1vdmVEdXJpbmciLCJfYm91bmRNb3VzZVVwRW5kIiwibG9hZFNldHRpbmdzIiwic2V0dXBFdmVudExpc3RlbmVycyIsInNldHVwU2V0dGluZ3NMaXN0ZW5lciIsIl9jcmVhdGVDbGFzcyIsInZhbHVlIiwiX3RoaXMiLCJ1cGRhdGVWaXNpYmlsaXR5IiwiZGlzcGxheVR5cGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInpJbmRleCIsInRyYW5zaXRpb24iLCJwb2ludGVyRXZlbnRzIiwiZGlzcGxheSIsInRleHRTcGFuIiwidGV4dENvbnRlbnQiLCJfdGltZVRleHRTcGFuIiwiYXBwZW5kQ2hpbGQiLCJjbG9zZUJ0biIsIl9jcmVhdGVDbG9zZUJ1dHRvbiIsIl9jbG9zZUJ0biIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwibWF0Y2hlcyIsIl90aGlzMiIsImJ0biIsInRpdGxlIiwiYXNzaWduIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsImxpbmVIZWlnaHQiLCJ0ZXh0QWxpZ24iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJjdXJzb3IiLCJib3hTaGFkb3ciLCJ1c2VyU2VsZWN0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGFuZGxlRGlzbWlzcyIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImRldGFpbCIsImNoZWNrSXNUb1Nob3ciLCJmc0VsIiwiZnVsbHNjcmVlbkVsZW1lbnQiLCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCIsIm1vekZ1bGxTY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsImlzRnVsbCIsImNvbnRhaW5zIiwiX3Jlc2V0Q2xvc2VCdXR0b24iLCJzaG93IiwidXBkYXRlVGltZSIsIm9wYWNpdHkiLCJ0ZWFyZG93bkRyYWdnaW5nIiwiZmxvYXRQYXJlbnQiLCJib2R5IiwicGFyZW50RWxlbWVudCIsImFwcGx5RmxvYXRQb3NpdGlvbiIsInNldHVwRHJhZ2dpbmciLCJsZWZ0IiwidHJhbnNmb3JtIiwic3RhcnRBdXRvSGlkZSIsImhpZGUiLCJjbGVhckF1dG9IaWRlVGltZXIiLCJ0ZWFyZG93bk1vdXNlTGlzdGVuZXIiLCJyZW1vdmVDaGlsZCIsIl90aGlzMyIsInNldHVwTW91c2VMaXN0ZW5lciIsImZhZGVPdXQiLCJjbGVhclRpbWVvdXQiLCJfdGhpczQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3RoaXM1IiwiX29uRHJhZ1N0YXJ0IiwiX29uRHJhZ0VuZCIsIl90aGlzNiIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsIl9vbkRyYWdNb3ZlIiwicm91bmQiLCJzZXQiLCJub3ciLCJEYXRlIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwic3lzdGVtVGltZSIsImdldFNlY29uZHMiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwiX3RoaXM3Iiwic2V0SW50ZXJ2YWwiLCJ1cGRhdGVWaXNpYmlsaXR5Qm91bmQiLCJiaW5kIiwiX3RoaXM4Iiwib25DaGFuZ2VkIiwiYWRkTGlzdGVuZXIiLCJjaGFuZ2VzIiwibmFtZXNwYWNlIiwibmV3VmFsdWUiLCJXaW5kb3dPdmVybGF5VGltZURpc3BsYXkiLCJfVGltZURpc3BsYXkiLCJfY2FsbFN1cGVyIiwiYXJndW1lbnRzIiwiX2luaGVyaXRzIiwiX3RoaXM5IiwiY29uc29sZSIsImxvZyIsInNjYW5Gb3JNZWRpYSIsIm1lZGlhVGFnU2VsZWN0b3IiLCJyZWd1bGFyTWVkaWEiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3RpbWVEaXNwbGF5cyIsImluamVjdEZvck1lZGlhcyIsIm1lZGlhcyIsInVuZGVmaW5lZCIsIndhcm4iLCJmb3JFYWNoIiwicHVzaCIsIm92ZXJsYXlUaW1lRGlzcCIsIl90ZW1wT3ZlcnJpZGVzIiwiYnVpbGRLZXlTdHJpbmciLCJwYXJ0cyIsImN0cmxLZXkiLCJhbHRLZXkiLCJzaGlmdEtleSIsImpvaW4iLCJhcHBseVNldHRpbmdUb1dpZGdldHMiLCJzZXR0aW5nS2V5IiwiZCIsInRlbXBUb2dnbGUiLCJjdXJyZW50VmFsdWUiLCJyZXN0b3JlVGVtcFZhbHVlcyIsIl9pIiwiX09iamVjdCRlbnRyaWVzIiwiZW50cmllcyIsIl9PYmplY3QkZW50cmllcyRfaSIsIl9zbGljZWRUb0FycmF5Iiwib3JpZ2luYWxWYWx1ZSIsImNoZWNrRnVsbHNjcmVlbkV4aXQiLCJpc0ZzIiwiY3VycmVudFZhbCIsInByZXNzZWQiLCJrZXlUb2dnbGVMYXlvdXQiLCJwcmV2ZW50RGVmYXVsdCIsImN1cnJlbnRNb2RlIiwibmV3TW9kZSIsImtleVRvZ2dsZVZpc2liaWxpdHkiLCJpblZpZGVvRnMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==