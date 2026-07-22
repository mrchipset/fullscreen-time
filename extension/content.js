/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
      timeElement.innerText = '00:00 / 00:00';
      timeElement.style.display = 'none';
      return timeElement;
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
    key: "show",
    value: function show() {
      this.updateTime();
      this.timeElement.style.display = 'block';
      this.timeElement.style.zIndex = '999999';
      this.timeElement.style.opacity = '1';
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
      var _this2 = this;
      this.timeElement.style.opacity = '1';
      this.clearAutoHideTimer();
      this.setupMouseListener();
      this.autoHideTimer = setTimeout(function () {
        return _this2.fadeOut();
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
      var _this3 = this;
      this.teardownMouseListener();
      this._boundMouseMoveHandler = function () {
        if (_this3.autoHide) {
          _this3.timeElement.style.opacity = '1';
          _this3.clearAutoHideTimer();
          _this3.autoHideTimer = setTimeout(function () {
            return _this3.fadeOut();
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
      var _this4 = this;
      this.teardownDragging();
      this._isDragging = false;
      this.timeElement.style.cursor = 'move';
      this.timeElement.style.userSelect = 'none';
      this._boundMouseDownStart = function (e) {
        return _this4._onDragStart(e);
      };
      this._boundMouseUpEnd = function () {
        return _this4._onDragEnd();
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
      var _this5 = this;
      this._isDragging = true;
      var rect = this.timeElement.getBoundingClientRect();
      this._dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      this._boundMouseMoveDuring = function (e) {
        return _this5._onDragMove(e);
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
        this.timeElement.innerText = "".concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(currentTime), " / ").concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration), " | ").concat(systemTime);
      } else {
        this.timeElement.innerText = systemTime;
      }
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this6 = this;
      // Update time every second if media is fullscreen
      setInterval(function () {
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        var isFull = fsEl && (fsEl === _this6.media || fsEl.contains(_this6.media) || _this6.media.contains(fsEl));
        if (isFull && _this6.showWhenVideoFullscreen) {
          _this6.updateTime();
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
      var _this7 = this;
      // Listen to storage changes to update settings in real-time
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync') {
          if ('showWhenVideoFullscreen' in changes) {
            _this7.showWhenVideoFullscreen = changes.showWhenVideoFullscreen.newValue;
          }
          if ('showOnFullscreen' in changes) {
            _this7.showOnFullscreen = changes.showOnFullscreen.newValue;
          }
          if ('showSeconds' in changes) {
            _this7.showSeconds = changes.showSeconds.newValue;
          }
          if ('showProgress' in changes) {
            _this7.showProgress = changes.showProgress.newValue;
          }
          if ('autoHide' in changes) {
            _this7.autoHide = changes.autoHide.newValue;
          }
          if ('layoutMode' in changes) {
            _this7.layoutMode = changes.layoutMode.newValue;
          }
          _this7.updateVisibility();
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
      this.timeElement.innerText = systemTime;
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
      var _this8 = this;
      // Update visibility initially
      this.updateVisibility();
      // Update time every second
      setInterval(function () {
        _this8.updateTime();
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
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }


console.log("Fullscreen Time 已加载");
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
    console.warn("No media elements found.");
    setTimeout(injectForMedias, 2000);
    return;
  }
  console.log("Found media elements:", medias);
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
      console.log("[\u5FEB\u6377\u952E] \u5E03\u5C40\u6A21\u5F0F\u5207\u6362\u4E3A: ".concat(newMode === 'float' ? '浮动' : '磁吸'));
    }
    if (pressed === items.keyToggleVisibility) {
      e.preventDefault();
      e.stopPropagation();
      var inVideoFs = !!document.fullscreenElement;
      var settingKey = inVideoFs ? 'showWhenVideoFullscreen' : 'showOnFullscreen';
      // 从 widget 实例读取当前状态（storage 从未被 shortcut 写过）
      var currentVal = settingKey === 'showWhenVideoFullscreen' ? overlayTimeDisp.showWhenVideoFullscreen : overlayTimeDisp.showOnFullscreen;
      tempToggle(settingKey, !currentVal, currentVal);
      console.log("[\u5FEB\u6377\u952E] \u663E\u793A".concat(!currentVal ? '开启' : '关闭'));
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O01BQy9DN0MsT0FBTyxDQUFDQyxHQUFHLHFDQUFBckksTUFBQSxDQUFZLENBQUNpTCxVQUFVLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBRSxDQUFDO0lBQ3JEO0VBQ0YsQ0FDRixDQUFDO0FBQ0gsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL3dpZGdldHMuanMiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnVsbHNjcmVlbi10aW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGZvcm1hdCB0aW1lIGluIHNlY29uZHMgdG8gbW06c3NcclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xyXG4gICAgaWYgKGlzTmFOKHNlY29uZHMpKSByZXR1cm4gJzAwOjAwJztcclxuICAgIGNvbnN0IG1pbnMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICBjb25zdCBzZWNzID0gTWF0aC5mbG9vcihzZWNvbmRzICUgNjApO1xyXG4gICAgcmV0dXJuIGAke1N0cmluZyhtaW5zKS5wYWRTdGFydCgyLCAnMCcpfToke1N0cmluZyhzZWNzKS5wYWRTdGFydCgyLCAnMCcpfWA7XHJcbn1cclxuXHJcbi8vIGNoZWNrIGlmIGZ1bGxzY3JlZW4gZm9yIGJyb3dzZXJcclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpIHtcclxuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgPT09IHNjcmVlbi5oZWlnaHQgJiYgd2luZG93LmlubmVyV2lkdGggPT09IHNjcmVlbi53aWR0aDtcclxufSIsImltcG9ydCB7IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiwgZm9ybWF0VGltZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRpbWVEaXNwbGF5IHtcclxuICBjb25zdHJ1Y3RvcihtZWRpYSkge1xyXG4gICAgdGhpcy5tZWRpYSA9IG1lZGlhO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudCA9IHRoaXMuY3JlYXRlVGltZUVsZW1lbnQoKTtcclxuICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgdGhpcy5zaG93T25GdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd1NlY29uZHMgPSB0cnVlO1xyXG4gICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSB0cnVlO1xyXG4gICAgdGhpcy5hdXRvSGlkZSA9IGZhbHNlO1xyXG4gICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlciA9IG51bGw7XHJcbiAgICB0aGlzLmxheW91dE1vZGUgPSAnc25hcCc7XHJcbiAgICB0aGlzLmZsb2F0UG9zaXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5fZHJhZ09mZnNldCA9IHsgeDogMCwgeTogMCB9O1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCA9IG51bGw7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyA9IG51bGw7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlVXBFbmQgPSBudWxsO1xyXG4gICAgdGhpcy5sb2FkU2V0dGluZ3MoKTtcclxuICAgIHRoaXMuc2V0dXBFdmVudExpc3RlbmVycygpO1xyXG4gICAgdGhpcy5zZXR1cFNldHRpbmdzTGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIGxvYWRTZXR0aW5ncygpIHtcclxuICAgIC8vIOS7jkNocm9tZeWtmOWCqOS4reivu+WPluiuvue9rlxyXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoXHJcbiAgICAgIHtcclxuICAgICAgICBzaG93V2hlblZpZGVvRnVsbHNjcmVlbjogdHJ1ZSxcclxuICAgICAgICBzaG93T25GdWxsc2NyZWVuOiB0cnVlLFxyXG4gICAgICAgIHNob3dTZWNvbmRzOiB0cnVlLFxyXG4gICAgICAgIHNob3dQcm9ncmVzczogdHJ1ZSxcclxuICAgICAgICBhdXRvSGlkZTogZmFsc2UsXHJcbiAgICAgICAgbGF5b3V0TW9kZTogJ3NuYXAnLFxyXG4gICAgICAgIGZsb2F0UG9zaXRpb246IG51bGxcclxuICAgICAgfSxcclxuICAgICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuO1xyXG4gICAgICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dPbkZ1bGxzY3JlZW47XHJcbiAgICAgICAgdGhpcy5zaG93U2Vjb25kcyA9IGl0ZW1zLnNob3dTZWNvbmRzO1xyXG4gICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gaXRlbXMuc2hvd1Byb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuYXV0b0hpZGUgPSBpdGVtcy5hdXRvSGlkZTtcclxuICAgICAgICB0aGlzLmxheW91dE1vZGUgPSBpdGVtcy5sYXlvdXRNb2RlIHx8ICdzbmFwJztcclxuICAgICAgICB0aGlzLmZsb2F0UG9zaXRpb24gPSBpdGVtcy5mbG9hdFBvc2l0aW9uIHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5VHlwZSgpIHtcclxuICAgIHJldHVybiAnbWVkaWEnO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlVGltZUVsZW1lbnQoKSB7XHJcbiAgICBjb25zdCB0aW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xyXG4gICAgdGltZUVsZW1lbnQuaW5uZXJUZXh0ID0gJzAwOjAwIC8gMDA6MDAnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHJldHVybiB0aW1lRWxlbWVudDtcclxuICB9XHJcblxyXG4gIGNoZWNrSXNUb1Nob3coKSB7XHJcbiAgICBpZiAoIXRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGZzRWwgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50O1xyXG4gICAgY29uc3QgaXNGdWxsID0gZnNFbCAmJiAoZnNFbCA9PT0gdGhpcy5tZWRpYSB8fCBmc0VsLmNvbnRhaW5zKHRoaXMubWVkaWEpIHx8IHRoaXMubWVkaWEuY29udGFpbnMoZnNFbCkpO1xyXG4gICAgcmV0dXJuIGlzRnVsbDtcclxuICB9XHJcblxyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG5cclxuICAgIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdmbG9hdCcpIHtcclxuICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgIGNvbnN0IGZsb2F0UGFyZW50ID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZmxvYXRQYXJlbnQpIHtcclxuICAgICAgICBmbG9hdFBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFwcGx5RmxvYXRQb3NpdGlvbigpO1xyXG4gICAgICB0aGlzLnNldHVwRHJhZ2dpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcclxuICAgICAgdGhpcy5zdGFydEF1dG9IaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcclxuICAgIHRoaXMudGVhcmRvd25Nb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IHRoaXMubWVkaWEucGFyZW50RWxlbWVudCkge1xyXG4gICAgICB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVWaXNpYmlsaXR5KCkge1xyXG4gICAgLy8g5qOA5p+l5piv5ZCm5Zyo5YWo5bGP5LiU6K6+572u5Lit5ZCv55So5LqG5YWo5bGP5pi+56S6XHJcbiAgICBpZiAodGhpcy5jaGVja0lzVG9TaG93KCkpIHtcclxuICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXJ0QXV0b0hpZGUoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcbiAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xyXG4gICAgdGhpcy5zZXR1cE1vdXNlTGlzdGVuZXIoKTtcclxuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJBdXRvSGlkZVRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuYXV0b0hpZGVUaW1lcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5hdXRvSGlkZVRpbWVyKTtcclxuICAgICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldHVwTW91c2VMaXN0ZW5lcigpIHtcclxuICAgIHRoaXMudGVhcmRvd25Nb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmF1dG9IaWRlKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICAgICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmZhZGVPdXQoKSwgMzAwMCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICB0ZWFyZG93bk1vdXNlTGlzdGVuZXIoKSB7XHJcbiAgICBpZiAodGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyKSB7XHJcbiAgICAgIHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyKTtcclxuICAgICAgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZhZGVPdXQoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgfVxyXG5cclxuICBhcHBseUZsb2F0UG9zaXRpb24oKSB7XHJcbiAgICAvLyDop4bpopHlhajlsY/ml7bnlKggYWJzb2x1dGXvvIjmjILlnKjlhajlsY/lhYPntKDkuIvvvInvvIzlkKbliJnnlKggZml4ZWTvvIjmjILlnKggYm9keSDkuIvvvIlcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XHJcbiAgICBpZiAodGhpcy5mbG9hdFBvc2l0aW9uKSB7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMuZmxvYXRQb3NpdGlvbi54fXB4YDtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLmZsb2F0UG9zaXRpb24ueX1weGA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMjBweCc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0dXBEcmFnZ2luZygpIHtcclxuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XHJcblxyXG4gICAgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCA9IChlKSA9PiB0aGlzLl9vbkRyYWdTdGFydChlKTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VVcEVuZCA9ICgpID0+IHRoaXMuX29uRHJhZ0VuZCgpO1xyXG5cclxuICAgIHRoaXMudGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fYm91bmRNb3VzZVVwRW5kKTtcclxuICB9XHJcblxyXG4gIHRlYXJkb3duRHJhZ2dpbmcoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICcnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS51c2VyU2VsZWN0ID0gJyc7XHJcbiAgICBpZiAodGhpcy5fYm91bmRNb3VzZURvd25TdGFydCkge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQpO1xyXG4gICAgICB0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0ID0gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZykge1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyk7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nID0gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9ib3VuZE1vdXNlVXBFbmQpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX2JvdW5kTW91c2VVcEVuZCk7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VVcEVuZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBfb25EcmFnU3RhcnQoZSkge1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy50aW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuX2RyYWdPZmZzZXQgPSB7IHg6IGUuY2xpZW50WCAtIHJlY3QubGVmdCwgeTogZS5jbGllbnRZIC0gcmVjdC50b3AgfTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nID0gKGUpID0+IHRoaXMuX29uRHJhZ01vdmUoZSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyk7XHJcbiAgfVxyXG5cclxuICBfb25EcmFnTW92ZShlKSB7XHJcbiAgICBpZiAoIXRoaXMuX2lzRHJhZ2dpbmcpIHJldHVybjtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtlLmNsaWVudFggLSB0aGlzLl9kcmFnT2Zmc2V0Lnh9cHhgO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHtlLmNsaWVudFkgLSB0aGlzLl9kcmFnT2Zmc2V0Lnl9cHhgO1xyXG4gIH1cclxuXHJcbiAgX29uRHJhZ0VuZCgpIHtcclxuICAgIGlmICghdGhpcy5faXNEcmFnZ2luZykgcmV0dXJuO1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcpO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnRpbWVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5mbG9hdFBvc2l0aW9uID0geyB4OiBNYXRoLnJvdW5kKHJlY3QubGVmdCksIHk6IE1hdGgucm91bmQocmVjdC50b3ApIH07XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGZsb2F0UG9zaXRpb246IHRoaXMuZmxvYXRQb3NpdGlvbiB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaG91cnMgPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5zaG93U2Vjb25kc1xyXG4gICAgICA/IGAke2hvdXJzfToke21pbnV0ZXN9OiR7U3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJyl9YFxyXG4gICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcclxuXHJcbiAgICBpZiAodGhpcy5zaG93UHJvZ3Jlc3MpIHtcclxuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xyXG4gICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMubWVkaWEuZHVyYXRpb247XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuaW5uZXJUZXh0ID0gYCR7Zm9ybWF0VGltZShjdXJyZW50VGltZSl9IC8gJHtmb3JtYXRUaW1lKGR1cmF0aW9uKX0gfCAke3N5c3RlbVRpbWV9YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuaW5uZXJUZXh0ID0gc3lzdGVtVGltZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcblxyXG5cclxuICAgIC8vIFVwZGF0ZSB0aW1lIGV2ZXJ5IHNlY29uZCBpZiBtZWRpYSBpcyBmdWxsc2NyZWVuXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZzRWwgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50O1xyXG4gICAgICBjb25zdCBpc0Z1bGwgPSBmc0VsICYmIChmc0VsID09PSB0aGlzLm1lZGlhIHx8IGZzRWwuY29udGFpbnModGhpcy5tZWRpYSkgfHwgdGhpcy5tZWRpYS5jb250YWlucyhmc0VsKSk7XHJcbiAgICAgIGlmIChpc0Z1bGwgJiYgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuXHJcbiAgICAvLyBMaXN0ZW4gdG8gZnVsbHNjcmVlbiBjaGFuZ2UgZXZlbnRzXHJcbiAgICBjb25zdCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQgPSB0aGlzLnVwZGF0ZVZpc2liaWxpdHkuYmluZCh0aGlzKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ01TRnVsbHNjcmVlbkNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgfVxyXG5cclxuICBzZXR1cFNldHRpbmdzTGlzdGVuZXIoKSB7XHJcbiAgICAvLyBMaXN0ZW4gdG8gc3RvcmFnZSBjaGFuZ2VzIHRvIHVwZGF0ZSBzZXR0aW5ncyBpbiByZWFsLXRpbWVcclxuICAgIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgbmFtZXNwYWNlKSA9PiB7XHJcbiAgICAgIGlmIChuYW1lc3BhY2UgPT09ICdzeW5jJykge1xyXG4gICAgICAgIGlmICgnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBjaGFuZ2VzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dPbkZ1bGxzY3JlZW4nIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IGNoYW5nZXMuc2hvd09uRnVsbHNjcmVlbi5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93U2Vjb25kcycgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93U2Vjb25kcyA9IGNoYW5nZXMuc2hvd1NlY29uZHMubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd1Byb2dyZXNzJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dQcm9ncmVzcyA9IGNoYW5nZXMuc2hvd1Byb2dyZXNzLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ2F1dG9IaWRlJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLmF1dG9IaWRlID0gY2hhbmdlcy5hdXRvSGlkZS5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdsYXlvdXRNb2RlJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLmxheW91dE1vZGUgPSBjaGFuZ2VzLmxheW91dE1vZGUubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkgZXh0ZW5kcyBUaW1lRGlzcGxheSB7XHJcbiAgICBkaXNwbGF5VHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gJ3dpbmRvdy1vdmVybGF5JztcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0Jykge1xyXG4gICAgICAgICAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgICAgICAgICAgY29uc3QgZmxvYXRQYXJlbnQgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBmbG9hdFBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgZmxvYXRQYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hcHBseUZsb2F0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5zZXR1cERyYWdnaW5nKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcxMHB4JztcclxuICAgICAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGltZSgpIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5zaG93U2Vjb25kc1xyXG4gICAgICAgICAgPyBgJHtob3Vyc306JHttaW51dGVzfToke1N0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCAnMCcpfWBcclxuICAgICAgICAgIDogYCR7aG91cnN9OiR7bWludXRlc31gO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuaW5uZXJUZXh0ID0gc3lzdGVtVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zaG93T25GdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOWFg+e0oOWFqOWxj++8iOinhumikeWFqOWxj++8ieaXtu+8muWmguaenOinhumikeS4k+eUqOaYvuekuuW3suW8gOWQr++8jOS4jeWGjemHjeWkjeaYvuekulxyXG4gICAgICAgIGlmIChkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmtY/op4jlmajlhajlsY/vvIhGMTHvvInml7bmmL7npLpcclxuICAgICAgICByZXR1cm4gY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICAvLyBVcGRhdGUgdmlzaWJpbGl0eSBpbml0aWFsbHlcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICAgICAgICAvLyBVcGRhdGUgdGltZSBldmVyeSBzZWNvbmRcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZm9ybWF0VGltZSwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IFRpbWVEaXNwbGF5LCBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkgfSBmcm9tICcuL3dpZGdldHMnO1xyXG5cclxuY29uc29sZS5sb2coXCJGdWxsc2NyZWVuIFRpbWUg5bey5Yqg6L29XCIpO1xyXG5cclxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKGRvY3VtZW50KSB7XHJcbiAgY29uc3QgbWVkaWFUYWdTZWxlY3RvciA9ICd2aWRlbyc7XHJcbiAgXHJcbiAgY29uc3QgcmVndWxhck1lZGlhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChtZWRpYVRhZ1NlbGVjdG9yKTtcclxuICAgIHJldHVybiByZWd1bGFyTWVkaWE7XHJcbn1cclxuXHJcbi8vIOaUtumbhuaJgOaciSBUaW1lRGlzcGxheSDlrp7kvovvvIzkvpvpnZ7mjIHkuYXlv6vmjbfplK7nm7TmjqXmk43kvZxcclxuY29uc3QgX3RpbWVEaXNwbGF5cyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gaW5qZWN0Rm9yTWVkaWFzKCkge1xyXG4gIGNvbnN0IG1lZGlhcyA9IHNjYW5Gb3JNZWRpYShkb2N1bWVudCk7XHJcbiAgaWYgKG1lZGlhcyA9PT0gdW5kZWZpbmVkIHx8IG1lZGlhcy5sZW5ndGggPT09IDApIHtcclxuICAgIGNvbnNvbGUud2FybihcIk5vIG1lZGlhIGVsZW1lbnRzIGZvdW5kLlwiKTtcclxuICAgIHNldFRpbWVvdXQoaW5qZWN0Rm9yTWVkaWFzLCAyMDAwKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc29sZS5sb2coXCJGb3VuZCBtZWRpYSBlbGVtZW50czpcIiwgbWVkaWFzKTtcclxuXHJcbiAgbWVkaWFzLmZvckVhY2gobWVkaWEgPT4ge1xyXG4gICAgX3RpbWVEaXNwbGF5cy5wdXNoKG5ldyBUaW1lRGlzcGxheShtZWRpYSkpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuaW5qZWN0Rm9yTWVkaWFzKCk7XHJcbmNvbnN0IG92ZXJsYXlUaW1lRGlzcCA9IG5ldyBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkoZG9jdW1lbnQuYm9keSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbn0pO1xyXG5cclxuLy8gLS0tIOW/q+aNt+mUruWkhOeQhu+8iOWdh+S4uuS4tOaXtuWIh+aNou+8jOS4jeWGmSBzdG9yYWdl77yJIC0tLVxyXG5cclxuLy8g6KKr5b+r5o236ZSu5Li05pe25pS55Yqo55qE6K6+572u77yM6YCA5Ye65YWo5bGP5pe25oGi5aSN5Y6f5YC8XHJcbmNvbnN0IF90ZW1wT3ZlcnJpZGVzID0ge307XHJcblxyXG5mdW5jdGlvbiBidWlsZEtleVN0cmluZyhlKSB7XHJcbiAgY29uc3QgcGFydHMgPSBbXTtcclxuICBpZiAoZS5jdHJsS2V5KSBwYXJ0cy5wdXNoKCdDdHJsJyk7XHJcbiAgaWYgKGUuYWx0S2V5KSBwYXJ0cy5wdXNoKCdBbHQnKTtcclxuICBpZiAoZS5zaGlmdEtleSkgcGFydHMucHVzaCgnU2hpZnQnKTtcclxuICBpZiAoZS5rZXkgPT09ICdDb250cm9sJyB8fCBlLmtleSA9PT0gJ0FsdCcgfHwgZS5rZXkgPT09ICdTaGlmdCcgfHwgZS5rZXkgPT09ICdNZXRhJykgcmV0dXJuIG51bGw7XHJcbiAgcGFydHMucHVzaChlLmtleSk7XHJcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJysnKTtcclxufVxyXG5cclxuLy8g5bCG5p+Q5Liq6K6+572u5YC85bqU55So5Yiw5omA5pyJIHdpZGdldCDlrp7kvovvvIjkuI3lhpkgc3RvcmFnZe+8iVxyXG5mdW5jdGlvbiBhcHBseVNldHRpbmdUb1dpZGdldHMoc2V0dGluZ0tleSwgdmFsdWUpIHtcclxuICBpZiAoc2V0dGluZ0tleSA9PT0gJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJykge1xyXG4gICAgX3RpbWVEaXNwbGF5cy5mb3JFYWNoKGQgPT4geyBkLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gdmFsdWU7IGQudXBkYXRlVmlzaWJpbGl0eSgpOyB9KTtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IHZhbHVlO1xyXG4gICAgb3ZlcmxheVRpbWVEaXNwLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICB9IGVsc2UgaWYgKHNldHRpbmdLZXkgPT09ICdzaG93T25GdWxsc2NyZWVuJykge1xyXG4gICAgb3ZlcmxheVRpbWVEaXNwLnNob3dPbkZ1bGxzY3JlZW4gPSB2YWx1ZTtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgfSBlbHNlIGlmIChzZXR0aW5nS2V5ID09PSAnbGF5b3V0TW9kZScpIHtcclxuICAgIF90aW1lRGlzcGxheXMuZm9yRWFjaChkID0+IHsgZC5sYXlvdXRNb2RlID0gdmFsdWU7IGQudXBkYXRlVmlzaWJpbGl0eSgpOyB9KTtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC5sYXlvdXRNb2RlID0gdmFsdWU7XHJcbiAgICBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gIH1cclxufVxyXG5cclxuLy8g5b+r5o236ZSu5Li05pe25YiH5o2i77ya6K6w5b2V5Y6f5aeL5YC8IOKGkiDlhpnlhaUgd2lkZ2V0XHJcbmZ1bmN0aW9uIHRlbXBUb2dnbGUoc2V0dGluZ0tleSwgbmV3VmFsdWUsIGN1cnJlbnRWYWx1ZSkge1xyXG4gIGlmICghKHNldHRpbmdLZXkgaW4gX3RlbXBPdmVycmlkZXMpKSB7XHJcbiAgICBfdGVtcE92ZXJyaWRlc1tzZXR0aW5nS2V5XSA9IGN1cnJlbnRWYWx1ZTtcclxuICB9XHJcbiAgYXBwbHlTZXR0aW5nVG9XaWRnZXRzKHNldHRpbmdLZXksIG5ld1ZhbHVlKTtcclxufVxyXG5cclxuLy8g6YCA5Ye65YWo5bGP5pe25oGi5aSN5omA5pyJ5Li05pe25pS55YqoXHJcbmZ1bmN0aW9uIHJlc3RvcmVUZW1wVmFsdWVzKCkge1xyXG4gIGZvciAoY29uc3QgW2tleSwgb3JpZ2luYWxWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoX3RlbXBPdmVycmlkZXMpKSB7XHJcbiAgICBhcHBseVNldHRpbmdUb1dpZGdldHMoa2V5LCBvcmlnaW5hbFZhbHVlKTtcclxuICB9XHJcbiAgZm9yIChjb25zdCBrZXkgaW4gX3RlbXBPdmVycmlkZXMpIHtcclxuICAgIGRlbGV0ZSBfdGVtcE92ZXJyaWRlc1trZXldO1xyXG4gIH1cclxufVxyXG5cclxuLy8g5qOA5rWL6YCA5Ye65YWo5bGP77yI5ZCrIEYxMe+8iVxyXG5mdW5jdGlvbiBjaGVja0Z1bGxzY3JlZW5FeGl0KCkge1xyXG4gIGNvbnN0IGlzRnMgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcclxuICBpZiAoIWlzRnMpIHtcclxuICAgIHJlc3RvcmVUZW1wVmFsdWVzKCk7XHJcbiAgfVxyXG59XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBjaGVja0Z1bGxzY3JlZW5FeGl0KTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGNoZWNrRnVsbHNjcmVlbkV4aXQpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgY29uc3QgaXNGcyA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xyXG4gIGlmICghaXNGcykgcmV0dXJuO1xyXG5cclxuICAvLyBFU0Mg5pyJ5rWP6KeI5Zmo6YCA5Ye65YWo5bGP55qE6buY6K6k6KGM5Li677yM5LiN5bqU6L+b5YWl5b+r5o236ZSu6YC76L6RXHJcbiAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgcmV0dXJuO1xyXG5cclxuICBjb25zdCBwcmVzc2VkID0gYnVpbGRLZXlTdHJpbmcoZSk7XHJcbiAgaWYgKCFwcmVzc2VkKSByZXR1cm47XHJcblxyXG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgWydrZXlUb2dnbGVMYXlvdXQnLCAna2V5VG9nZ2xlVmlzaWJpbGl0eSddLFxyXG4gICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgIGlmIChwcmVzc2VkID09PSBpdGVtcy5rZXlUb2dnbGVMYXlvdXQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAvLyDku44gd2lkZ2V0IOWunuS+i+ivu+WPluW9k+WJjeW4g+WxgOaooeW8j++8iHN0b3JhZ2Ug5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb2RlID0gb3ZlcmxheVRpbWVEaXNwLmxheW91dE1vZGU7XHJcbiAgICAgICAgY29uc3QgbmV3TW9kZSA9IGN1cnJlbnRNb2RlID09PSAnZmxvYXQnID8gJ3NuYXAnIDogJ2Zsb2F0JztcclxuICAgICAgICB0ZW1wVG9nZ2xlKCdsYXlvdXRNb2RlJywgbmV3TW9kZSwgY3VycmVudE1vZGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBb5b+r5o236ZSuXSDluIPlsYDmqKHlvI/liIfmjaLkuLo6ICR7bmV3TW9kZSA9PT0gJ2Zsb2F0JyA/ICfmta7liqgnIDogJ+ejgeWQuCd9YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcmVzc2VkID09PSBpdGVtcy5rZXlUb2dnbGVWaXNpYmlsaXR5KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgaW5WaWRlb0ZzID0gISFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudDtcclxuICAgICAgICBjb25zdCBzZXR0aW5nS2V5ID0gaW5WaWRlb0ZzID8gJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyA6ICdzaG93T25GdWxsc2NyZWVuJztcclxuICAgICAgICAvLyDku44gd2lkZ2V0IOWunuS+i+ivu+WPluW9k+WJjeeKtuaAge+8iHN0b3JhZ2Ug5LuO5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWwgPSBzZXR0aW5nS2V5ID09PSAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nXHJcbiAgICAgICAgICA/IG92ZXJsYXlUaW1lRGlzcC5zaG93V2hlblZpZGVvRnVsbHNjcmVlblxyXG4gICAgICAgICAgOiBvdmVybGF5VGltZURpc3Auc2hvd09uRnVsbHNjcmVlbjtcclxuICAgICAgICB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksICFjdXJyZW50VmFsLCBjdXJyZW50VmFsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW+W/q+aNt+mUrl0g5pi+56S6JHshY3VycmVudFZhbCA/ICflvIDlkK8nIDogJ+WFs+mXrSd9YCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG59KTtcclxuXHJcblxyXG4iXSwibmFtZXMiOlsiZm9ybWF0VGltZSIsInNlY29uZHMiLCJpc05hTiIsIm1pbnMiLCJNYXRoIiwiZmxvb3IiLCJzZWNzIiwiY29uY2F0IiwiU3RyaW5nIiwicGFkU3RhcnQiLCJjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInNjcmVlbiIsImhlaWdodCIsImlubmVyV2lkdGgiLCJ3aWR0aCIsIlRpbWVEaXNwbGF5IiwibWVkaWEiLCJfY2xhc3NDYWxsQ2hlY2siLCJ0aW1lRWxlbWVudCIsImNyZWF0ZVRpbWVFbGVtZW50Iiwic2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4iLCJzaG93T25GdWxsc2NyZWVuIiwic2hvd1NlY29uZHMiLCJzaG93UHJvZ3Jlc3MiLCJhdXRvSGlkZSIsImF1dG9IaWRlVGltZXIiLCJfYm91bmRNb3VzZU1vdmVIYW5kbGVyIiwibGF5b3V0TW9kZSIsImZsb2F0UG9zaXRpb24iLCJfaXNEcmFnZ2luZyIsIl9kcmFnT2Zmc2V0IiwieCIsInkiLCJfYm91bmRNb3VzZURvd25TdGFydCIsIl9ib3VuZE1vdXNlTW92ZUR1cmluZyIsIl9ib3VuZE1vdXNlVXBFbmQiLCJsb2FkU2V0dGluZ3MiLCJzZXR1cEV2ZW50TGlzdGVuZXJzIiwic2V0dXBTZXR0aW5nc0xpc3RlbmVyIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJfdGhpcyIsImNocm9tZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiaXRlbXMiLCJ1cGRhdGVWaXNpYmlsaXR5IiwiZGlzcGxheVR5cGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInpJbmRleCIsInRyYW5zaXRpb24iLCJwb2ludGVyRXZlbnRzIiwiaW5uZXJUZXh0IiwiZGlzcGxheSIsImNoZWNrSXNUb1Nob3ciLCJmc0VsIiwiZnVsbHNjcmVlbkVsZW1lbnQiLCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCIsIm1vekZ1bGxTY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsImlzRnVsbCIsImNvbnRhaW5zIiwic2hvdyIsInVwZGF0ZVRpbWUiLCJvcGFjaXR5IiwidGVhcmRvd25EcmFnZ2luZyIsImZsb2F0UGFyZW50IiwiYm9keSIsInBhcmVudEVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImFwcGx5RmxvYXRQb3NpdGlvbiIsInNldHVwRHJhZ2dpbmciLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJzdGFydEF1dG9IaWRlIiwiaGlkZSIsImNsZWFyQXV0b0hpZGVUaW1lciIsInRlYXJkb3duTW91c2VMaXN0ZW5lciIsInJlbW92ZUNoaWxkIiwiX3RoaXMyIiwic2V0dXBNb3VzZUxpc3RlbmVyIiwic2V0VGltZW91dCIsImZhZGVPdXQiLCJjbGVhclRpbWVvdXQiLCJfdGhpczMiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl90aGlzNCIsImN1cnNvciIsInVzZXJTZWxlY3QiLCJlIiwiX29uRHJhZ1N0YXJ0IiwiX29uRHJhZ0VuZCIsIl90aGlzNSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJjbGllbnRYIiwiY2xpZW50WSIsIl9vbkRyYWdNb3ZlIiwicm91bmQiLCJzZXQiLCJub3ciLCJEYXRlIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwic3lzdGVtVGltZSIsImdldFNlY29uZHMiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwiX3RoaXM2Iiwic2V0SW50ZXJ2YWwiLCJ1cGRhdGVWaXNpYmlsaXR5Qm91bmQiLCJiaW5kIiwiX3RoaXM3Iiwib25DaGFuZ2VkIiwiYWRkTGlzdGVuZXIiLCJjaGFuZ2VzIiwibmFtZXNwYWNlIiwibmV3VmFsdWUiLCJXaW5kb3dPdmVybGF5VGltZURpc3BsYXkiLCJfVGltZURpc3BsYXkiLCJfY2FsbFN1cGVyIiwiYXJndW1lbnRzIiwiX2luaGVyaXRzIiwiX3RoaXM4IiwiY29uc29sZSIsImxvZyIsInNjYW5Gb3JNZWRpYSIsIm1lZGlhVGFnU2VsZWN0b3IiLCJyZWd1bGFyTWVkaWEiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3RpbWVEaXNwbGF5cyIsImluamVjdEZvck1lZGlhcyIsIm1lZGlhcyIsInVuZGVmaW5lZCIsImxlbmd0aCIsIndhcm4iLCJmb3JFYWNoIiwicHVzaCIsIm92ZXJsYXlUaW1lRGlzcCIsIl90ZW1wT3ZlcnJpZGVzIiwiYnVpbGRLZXlTdHJpbmciLCJwYXJ0cyIsImN0cmxLZXkiLCJhbHRLZXkiLCJzaGlmdEtleSIsImpvaW4iLCJhcHBseVNldHRpbmdUb1dpZGdldHMiLCJzZXR0aW5nS2V5IiwiZCIsInRlbXBUb2dnbGUiLCJjdXJyZW50VmFsdWUiLCJyZXN0b3JlVGVtcFZhbHVlcyIsIl9pIiwiX09iamVjdCRlbnRyaWVzIiwiT2JqZWN0IiwiZW50cmllcyIsIl9PYmplY3QkZW50cmllcyRfaSIsIl9zbGljZWRUb0FycmF5Iiwib3JpZ2luYWxWYWx1ZSIsImNoZWNrRnVsbHNjcmVlbkV4aXQiLCJpc0ZzIiwicHJlc3NlZCIsImtleVRvZ2dsZUxheW91dCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiY3VycmVudE1vZGUiLCJuZXdNb2RlIiwia2V5VG9nZ2xlVmlzaWJpbGl0eSIsImluVmlkZW9GcyIsImN1cnJlbnRWYWwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==