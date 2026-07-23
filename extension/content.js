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
      btn.title = '关闭';
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

// 关闭按钮 × → 临时隐藏（同快捷键 hide 行为）
document.addEventListener('fs-time-dismiss', function (e) {
  var settingKey = e.detail.displayType === 'window-overlay' ? 'showOnFullscreen' : 'showWhenVideoFullscreen';
  var currentVal = settingKey === 'showWhenVideoFullscreen' ? overlayTimeDisp.showWhenVideoFullscreen : overlayTimeDisp.showOnFullscreen;
  if (currentVal === false) return; // 已经隐藏
  tempToggle(settingKey, false, currentVal);
  console.log("[\u5173\u95ED] ".concat(settingKey, " \u4E34\u65F6\u5173\u95ED"));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bGxzY3JlZW4tdGltZS8uL3NyYy93aWRnZXRzLmpzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mdWxsc2NyZWVuLXRpbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Z1bGxzY3JlZW4tdGltZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmb3JtYXQgdGltZSBpbiBzZWNvbmRzIHRvIG1tOnNzXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcclxuICAgIGlmIChpc05hTihzZWNvbmRzKSkgcmV0dXJuICcwMDowMCc7XHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgY29uc3Qgc2VjcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcclxuICAgIHJldHVybiBgJHtTdHJpbmcobWlucykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcoc2VjcykucGFkU3RhcnQoMiwgJzAnKX1gO1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBmdWxsc2NyZWVuIGZvciBicm93c2VyXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ID09PSBzY3JlZW4uaGVpZ2h0ICYmIHdpbmRvdy5pbm5lcldpZHRoID09PSBzY3JlZW4ud2lkdGg7XHJcbn0iLCJpbXBvcnQgeyBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4sIGZvcm1hdFRpbWUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaW1lRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IobWVkaWEpIHtcclxuICAgIHRoaXMubWVkaWEgPSBtZWRpYTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRpbWVFbGVtZW50KCk7XHJcbiAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dTZWNvbmRzID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gdHJ1ZTtcclxuICAgIHRoaXMuYXV0b0hpZGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IG51bGw7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIgPSBudWxsO1xyXG4gICAgdGhpcy5sYXlvdXRNb2RlID0gJ3NuYXAnO1xyXG4gICAgdGhpcy5mbG9hdFBvc2l0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuX2RyYWdPZmZzZXQgPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQgPSBudWxsO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcgPSBudWxsO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZVVwRW5kID0gbnVsbDtcclxuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAvLyDku45DaHJvbWXlrZjlgqjkuK3or7vlj5borr7nva5cclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgICB7XHJcbiAgICAgICAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXHJcbiAgICAgICAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcclxuICAgICAgICBzaG93U2Vjb25kczogdHJ1ZSxcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXHJcbiAgICAgICAgYXV0b0hpZGU6IGZhbHNlLFxyXG4gICAgICAgIGxheW91dE1vZGU6ICdzbmFwJyxcclxuICAgICAgICBmbG9hdFBvc2l0aW9uOiBudWxsXHJcbiAgICAgIH0sXHJcbiAgICAgIChpdGVtcykgPT4ge1xyXG4gICAgICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBpdGVtcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbjtcclxuICAgICAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSBpdGVtcy5zaG93T25GdWxsc2NyZWVuO1xyXG4gICAgICAgIHRoaXMuc2hvd1NlY29uZHMgPSBpdGVtcy5zaG93U2Vjb25kcztcclxuICAgICAgICB0aGlzLnNob3dQcm9ncmVzcyA9IGl0ZW1zLnNob3dQcm9ncmVzcztcclxuICAgICAgICB0aGlzLmF1dG9IaWRlID0gaXRlbXMuYXV0b0hpZGU7XHJcbiAgICAgICAgdGhpcy5sYXlvdXRNb2RlID0gaXRlbXMubGF5b3V0TW9kZSB8fCAnc25hcCc7XHJcbiAgICAgICAgdGhpcy5mbG9hdFBvc2l0aW9uID0gaXRlbXMuZmxvYXRQb3NpdGlvbiB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICByZXR1cm4gJ21lZGlhJztcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpbWVFbGVtZW50KCkge1xyXG4gICAgY29uc3QgdGltZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICc1cHgnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjNzIGVhc2UnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG4gICAgLy8g54us56uL5paH5a2X5a655Zmo77yI5LiOIMOXIOaMiemSruW5tuWIl++8jOmBv+WFjSB1cGRhdGVUaW1lIOivr+WIoOaMiemSru+8iVxyXG4gICAgY29uc3QgdGV4dFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICB0ZXh0U3Bhbi50ZXh0Q29udGVudCA9ICcwMDowMCAvIDAwOjAwJztcclxuICAgIHRoaXMuX3RpbWVUZXh0U3BhbiA9IHRleHRTcGFuO1xyXG4gICAgdGltZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dFNwYW4pO1xyXG5cclxuICAgIGNvbnN0IGNsb3NlQnRuID0gdGhpcy5fY3JlYXRlQ2xvc2VCdXR0b24oKTtcclxuICAgIHRoaXMuX2Nsb3NlQnRuID0gY2xvc2VCdG47XHJcblxyXG4gICAgLy8g5L2/55SoIG1vdXNlb3Zlci9tb3VzZW91dCArIHJlbGF0ZWRUYXJnZXQg5aSE55CGIGhvdmVy77yM6YG/5YWN57ud5a+55a6a5L2N5a2Q5YWD57Sg5a+86Ie055qE5LqL5Lu26Zeu6aKYXHJcbiAgICB0aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgKCkgPT4geyBjbG9zZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJzsgfSk7XHJcbiAgICB0aW1lRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xyXG4gICAgICAvLyDlvZPpvKDmoIfnprvlvIAgdGltZUVsZW1lbnQg5LiU5pyq6L+b5YWlIGNsb3NlQnRuIOaXtuaJjemakOiXj1xyXG4gICAgICAvLyDlu7bov5/orqkgbW91c2VlbnRlciBjbG9zZUJ0biDmnInmnLrkvJrop6blj5FcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJyAmJiAhY2xvc2VCdG4ubWF0Y2hlcygnOmhvdmVyJykpIHtcclxuICAgICAgICAgIGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCA1MCk7XHJcbiAgICB9KTtcclxuICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7IGNsb3NlQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7IH0pO1xyXG5cclxuICAgIHRpbWVFbGVtZW50LmFwcGVuZENoaWxkKGNsb3NlQnRuKTtcclxuICAgIHJldHVybiB0aW1lRWxlbWVudDtcclxuICB9XHJcblxyXG4gIC8vIOWIm+W7uuWPs+S4iuinkuWFs+mXreaMiemSriDDl++8iOS9jeS6jiB0aW1lRWxlbWVudCDlhoXpg6jlj7PkuIrop5LvvIlcclxuICBfY3JlYXRlQ2xvc2VCdXR0b24oKSB7XHJcbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBidG4udGV4dENvbnRlbnQgPSAnw5cnO1xyXG4gICAgYnRuLnRpdGxlID0gJ+WFs+mXrSc7XHJcbiAgICBPYmplY3QuYXNzaWduKGJ0bi5zdHlsZSwge1xyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgdG9wOiAnMXB4JyxcclxuICAgICAgcmlnaHQ6ICcxcHgnLFxyXG4gICAgICB3aWR0aDogJzE4cHgnLFxyXG4gICAgICBoZWlnaHQ6ICcxOHB4JyxcclxuICAgICAgbGluZUhlaWdodDogJzE4cHgnLFxyXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICBmb250U2l6ZTogJzE0cHgnLFxyXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXHJcbiAgICAgIGNvbG9yOiAnI2ZmZicsXHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMC43KScsXHJcbiAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICBkaXNwbGF5OiAnbm9uZScsXHJcbiAgICAgIHpJbmRleDogJzEwMDAwMDAnLFxyXG4gICAgICBib3hTaGFkb3c6ICcwIDFweCAzcHggcmdiYSgwLDAsMCwwLjMpJyxcclxuICAgICAgdXNlclNlbGVjdDogJ25vbmUnXHJcbiAgICB9KTtcclxuXHJcbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpOyAvLyDpmLvmraLmi5bmi71cclxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuaGFuZGxlRGlzbWlzcygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGJ0bjtcclxuICB9XHJcblxyXG4gIGhhbmRsZURpc21pc3MoKSB7XHJcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZnMtdGltZS1kaXNtaXNzJywge1xyXG4gICAgICBkZXRhaWw6IHsgZGlzcGxheVR5cGU6IHRoaXMuZGlzcGxheVR5cGUoKSB9XHJcbiAgICB9KSk7XHJcbiAgfVxyXG5cclxuICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgaWYgKCF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgIHJldHVybiBpc0Z1bGw7XHJcbiAgfVxyXG5cclxuICBfcmVzZXRDbG9zZUJ1dHRvbigpIHtcclxuICAgIGlmICh0aGlzLl9jbG9zZUJ0bikgdGhpcy5fY2xvc2VCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICB9XHJcblxyXG4gIHNob3coKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgdGhpcy5fcmVzZXRDbG9zZUJ1dHRvbigpO1xyXG5cclxuICAgIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdmbG9hdCcpIHtcclxuICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgIGNvbnN0IGZsb2F0UGFyZW50ID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZmxvYXRQYXJlbnQpIHtcclxuICAgICAgICBmbG9hdFBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFwcGx5RmxvYXRQb3NpdGlvbigpO1xyXG4gICAgICB0aGlzLnNldHVwRHJhZ2dpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcclxuICAgICAgdGhpcy5zdGFydEF1dG9IaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcclxuICAgIHRoaXMudGVhcmRvd25Nb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IHRoaXMubWVkaWEucGFyZW50RWxlbWVudCkge1xyXG4gICAgICB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVWaXNpYmlsaXR5KCkge1xyXG4gICAgLy8g5qOA5p+l5piv5ZCm5Zyo5YWo5bGP5LiU6K6+572u5Lit5ZCv55So5LqG5YWo5bGP5pi+56S6XHJcbiAgICBpZiAodGhpcy5jaGVja0lzVG9TaG93KCkpIHtcclxuICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXJ0QXV0b0hpZGUoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcbiAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xyXG4gICAgdGhpcy5zZXR1cE1vdXNlTGlzdGVuZXIoKTtcclxuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xyXG4gIH1cclxuXHJcbiAgY2xlYXJBdXRvSGlkZVRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuYXV0b0hpZGVUaW1lcikge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5hdXRvSGlkZVRpbWVyKTtcclxuICAgICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldHVwTW91c2VMaXN0ZW5lcigpIHtcclxuICAgIHRoaXMudGVhcmRvd25Nb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmF1dG9IaWRlKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICAgICAgdGhpcy5hdXRvSGlkZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmZhZGVPdXQoKSwgMzAwMCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aGlzLm1lZGlhLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICB0ZWFyZG93bk1vdXNlTGlzdGVuZXIoKSB7XHJcbiAgICBpZiAodGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyKSB7XHJcbiAgICAgIHRoaXMubWVkaWEucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyKTtcclxuICAgICAgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZhZGVPdXQoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCc7XHJcbiAgfVxyXG5cclxuICBhcHBseUZsb2F0UG9zaXRpb24oKSB7XHJcbiAgICAvLyDop4bpopHlhajlsY/ml7bnlKggYWJzb2x1dGXvvIjmjILlnKjlhajlsY/lhYPntKDkuIvvvInvvIzlkKbliJnnlKggZml4ZWTvvIjmjILlnKggYm9keSDkuIvvvIlcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA/ICdhYnNvbHV0ZScgOiAnZml4ZWQnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XHJcbiAgICBpZiAodGhpcy5mbG9hdFBvc2l0aW9uKSB7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMuZmxvYXRQb3NpdGlvbi54fXB4YDtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLmZsb2F0UG9zaXRpb24ueX1weGA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMjBweCc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0dXBEcmFnZ2luZygpIHtcclxuICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSAnbm9uZSc7XHJcblxyXG4gICAgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCA9IChlKSA9PiB0aGlzLl9vbkRyYWdTdGFydChlKTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VVcEVuZCA9ICgpID0+IHRoaXMuX29uRHJhZ0VuZCgpO1xyXG5cclxuICAgIHRoaXMudGltZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5fYm91bmRNb3VzZVVwRW5kKTtcclxuICB9XHJcblxyXG4gIHRlYXJkb3duRHJhZ2dpbmcoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmN1cnNvciA9ICcnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS51c2VyU2VsZWN0ID0gJyc7XHJcbiAgICBpZiAodGhpcy5fYm91bmRNb3VzZURvd25TdGFydCkge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQpO1xyXG4gICAgICB0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0ID0gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZykge1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyk7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nID0gbnVsbDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl9ib3VuZE1vdXNlVXBFbmQpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX2JvdW5kTW91c2VVcEVuZCk7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VVcEVuZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICB0aGlzLl9pc0RyYWdnaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBfb25EcmFnU3RhcnQoZSkge1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy50aW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuX2RyYWdPZmZzZXQgPSB7IHg6IGUuY2xpZW50WCAtIHJlY3QubGVmdCwgeTogZS5jbGllbnRZIC0gcmVjdC50b3AgfTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nID0gKGUpID0+IHRoaXMuX29uRHJhZ01vdmUoZSk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyk7XHJcbiAgfVxyXG5cclxuICBfb25EcmFnTW92ZShlKSB7XHJcbiAgICBpZiAoIXRoaXMuX2lzRHJhZ2dpbmcpIHJldHVybjtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbm9uZSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtlLmNsaWVudFggLSB0aGlzLl9kcmFnT2Zmc2V0Lnh9cHhgO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSBgJHtlLmNsaWVudFkgLSB0aGlzLl9kcmFnT2Zmc2V0Lnl9cHhgO1xyXG4gIH1cclxuXHJcbiAgX29uRHJhZ0VuZCgpIHtcclxuICAgIGlmICghdGhpcy5faXNEcmFnZ2luZykgcmV0dXJuO1xyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcpO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLnRpbWVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5mbG9hdFBvc2l0aW9uID0geyB4OiBNYXRoLnJvdW5kKHJlY3QubGVmdCksIHk6IE1hdGgucm91bmQocmVjdC50b3ApIH07XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGZsb2F0UG9zaXRpb246IHRoaXMuZmxvYXRQb3NpdGlvbiB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaG91cnMgPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5zaG93U2Vjb25kc1xyXG4gICAgICA/IGAke2hvdXJzfToke21pbnV0ZXN9OiR7U3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJyl9YFxyXG4gICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcclxuXHJcbiAgICBpZiAodGhpcy5zaG93UHJvZ3Jlc3MpIHtcclxuICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xyXG4gICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMubWVkaWEuZHVyYXRpb247XHJcbiAgICAgIHRoaXMuX3RpbWVUZXh0U3Bhbi50ZXh0Q29udGVudCA9IGAke2Zvcm1hdFRpbWUoY3VycmVudFRpbWUpfSAvICR7Zm9ybWF0VGltZShkdXJhdGlvbil9IHwgJHtzeXN0ZW1UaW1lfWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl90aW1lVGV4dFNwYW4udGV4dENvbnRlbnQgPSBzeXN0ZW1UaW1lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcclxuXHJcblxyXG4gICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kIGlmIG1lZGlhIGlzIGZ1bGxzY3JlZW5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgY29uc3QgZnNFbCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgICAgaWYgKGlzRnVsbCAmJiB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG5cclxuICAgIC8vIExpc3RlbiB0byBmdWxsc2NyZWVuIGNoYW5nZSBldmVudHNcclxuICAgIGNvbnN0IHVwZGF0ZVZpc2liaWxpdHlCb3VuZCA9IHRoaXMudXBkYXRlVmlzaWJpbGl0eS5iaW5kKHRoaXMpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignTVNGdWxsc2NyZWVuQ2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICB9XHJcblxyXG4gIHNldHVwU2V0dGluZ3NMaXN0ZW5lcigpIHtcclxuICAgIC8vIExpc3RlbiB0byBzdG9yYWdlIGNoYW5nZXMgdG8gdXBkYXRlIHNldHRpbmdzIGluIHJlYWwtdGltZVxyXG4gICAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBuYW1lc3BhY2UpID0+IHtcclxuICAgICAgaWYgKG5hbWVzcGFjZSA9PT0gJ3N5bmMnKSB7XHJcbiAgICAgICAgaWYgKCdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGNoYW5nZXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4ubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd09uRnVsbHNjcmVlbicgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93T25GdWxsc2NyZWVuID0gY2hhbmdlcy5zaG93T25GdWxsc2NyZWVuLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dTZWNvbmRzJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dTZWNvbmRzID0gY2hhbmdlcy5zaG93U2Vjb25kcy5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93UHJvZ3Jlc3MnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gY2hhbmdlcy5zaG93UHJvZ3Jlc3MubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnYXV0b0hpZGUnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuYXV0b0hpZGUgPSBjaGFuZ2VzLmF1dG9IaWRlLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ2xheW91dE1vZGUnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMubGF5b3V0TW9kZSA9IGNoYW5nZXMubGF5b3V0TW9kZS5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheSBleHRlbmRzIFRpbWVEaXNwbGF5IHtcclxuICAgIGRpc3BsYXlUeXBlKCkge1xyXG4gICAgICAgIHJldHVybiAnd2luZG93LW92ZXJsYXknO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgICAgIHRoaXMuX3Jlc2V0Q2xvc2VCdXR0b24oKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubGF5b3V0TW9kZSA9PT0gJ2Zsb2F0Jykge1xyXG4gICAgICAgICAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgICAgICAgICAgY29uc3QgZmxvYXRQYXJlbnQgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBmbG9hdFBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgZmxvYXRQYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hcHBseUZsb2F0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5zZXR1cERyYWdnaW5nKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcxMHB4JztcclxuICAgICAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGltZSgpIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5zaG93U2Vjb25kc1xyXG4gICAgICAgICAgPyBgJHtob3Vyc306JHttaW51dGVzfToke1N0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCAnMCcpfWBcclxuICAgICAgICAgIDogYCR7aG91cnN9OiR7bWludXRlc31gO1xyXG4gICAgICAgIHRoaXMuX3RpbWVUZXh0U3Bhbi50ZXh0Q29udGVudCA9IHN5c3RlbVRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tJc1RvU2hvdygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2hvd09uRnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlhYPntKDlhajlsY/vvIjop4bpopHlhajlsY/vvInml7bvvJrlpoLmnpzop4bpopHkuJPnlKjmmL7npLrlt7LlvIDlkK/vvIzkuI3lho3ph43lpI3mmL7npLpcclxuICAgICAgICBpZiAoZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5rWP6KeI5Zmo5YWo5bGP77yIRjEx77yJ5pe25pi+56S6XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIHZpc2liaWxpdHkgaW5pdGlhbGx5XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZvcm1hdFRpbWUsIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBUaW1lRGlzcGxheSwgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IH0gZnJvbSAnLi93aWRnZXRzJztcclxuXHJcbmNvbnNvbGUubG9nKFwiRnVsbHNjcmVlbiBUaW1lIOW3suWKoOi9vVwiKTtcclxuXHJcbmZ1bmN0aW9uIHNjYW5Gb3JNZWRpYShkb2N1bWVudCkge1xyXG4gIGNvbnN0IG1lZGlhVGFnU2VsZWN0b3IgPSAndmlkZW8nO1xyXG4gIFxyXG4gIGNvbnN0IHJlZ3VsYXJNZWRpYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwobWVkaWFUYWdTZWxlY3Rvcik7XHJcbiAgICByZXR1cm4gcmVndWxhck1lZGlhO1xyXG59XHJcblxyXG4vLyDmlLbpm4bmiYDmnIkgVGltZURpc3BsYXkg5a6e5L6L77yM5L6b6Z2e5oyB5LmF5b+r5o236ZSu55u05o6l5pON5L2cXHJcbmNvbnN0IF90aW1lRGlzcGxheXMgPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGluamVjdEZvck1lZGlhcygpIHtcclxuICBjb25zdCBtZWRpYXMgPSBzY2FuRm9yTWVkaWEoZG9jdW1lbnQpO1xyXG4gIGlmIChtZWRpYXMgPT09IHVuZGVmaW5lZCB8fCBtZWRpYXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCJObyBtZWRpYSBlbGVtZW50cyBmb3VuZC5cIik7XHJcbiAgICBzZXRUaW1lb3V0KGluamVjdEZvck1lZGlhcywgMjAwMCk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGNvbnNvbGUubG9nKFwiRm91bmQgbWVkaWEgZWxlbWVudHM6XCIsIG1lZGlhcyk7XHJcblxyXG4gIG1lZGlhcy5mb3JFYWNoKG1lZGlhID0+IHtcclxuICAgIF90aW1lRGlzcGxheXMucHVzaChuZXcgVGltZURpc3BsYXkobWVkaWEpKTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmluamVjdEZvck1lZGlhcygpO1xyXG5jb25zdCBvdmVybGF5VGltZURpc3AgPSBuZXcgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5KGRvY3VtZW50LmJvZHkpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG59KTtcclxuXHJcbi8vIC0tLSDlv6vmjbfplK7lpITnkIbvvIjlnYfkuLrkuLTml7bliIfmjaLvvIzkuI3lhpkgc3RvcmFnZe+8iSAtLS1cclxuXHJcbi8vIOiiq+W/q+aNt+mUruS4tOaXtuaUueWKqOeahOiuvue9ru+8jOmAgOWHuuWFqOWxj+aXtuaBouWkjeWOn+WAvFxyXG5jb25zdCBfdGVtcE92ZXJyaWRlcyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gYnVpbGRLZXlTdHJpbmcoZSkge1xyXG4gIGNvbnN0IHBhcnRzID0gW107XHJcbiAgaWYgKGUuY3RybEtleSkgcGFydHMucHVzaCgnQ3RybCcpO1xyXG4gIGlmIChlLmFsdEtleSkgcGFydHMucHVzaCgnQWx0Jyk7XHJcbiAgaWYgKGUuc2hpZnRLZXkpIHBhcnRzLnB1c2goJ1NoaWZ0Jyk7XHJcbiAgaWYgKGUua2V5ID09PSAnQ29udHJvbCcgfHwgZS5rZXkgPT09ICdBbHQnIHx8IGUua2V5ID09PSAnU2hpZnQnIHx8IGUua2V5ID09PSAnTWV0YScpIHJldHVybiBudWxsO1xyXG4gIHBhcnRzLnB1c2goZS5rZXkpO1xyXG4gIHJldHVybiBwYXJ0cy5qb2luKCcrJyk7XHJcbn1cclxuXHJcbi8vIOWwhuafkOS4quiuvue9ruWAvOW6lOeUqOWIsOaJgOaciSB3aWRnZXQg5a6e5L6L77yI5LiN5YaZIHN0b3JhZ2XvvIlcclxuZnVuY3Rpb24gYXBwbHlTZXR0aW5nVG9XaWRnZXRzKHNldHRpbmdLZXksIHZhbHVlKSB7XHJcbiAgaWYgKHNldHRpbmdLZXkgPT09ICdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicpIHtcclxuICAgIF90aW1lRGlzcGxheXMuZm9yRWFjaChkID0+IHsgZC5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IHZhbHVlOyBkLnVwZGF0ZVZpc2liaWxpdHkoKTsgfSk7XHJcbiAgICBvdmVybGF5VGltZURpc3Auc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSB2YWx1ZTtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgfSBlbHNlIGlmIChzZXR0aW5nS2V5ID09PSAnc2hvd09uRnVsbHNjcmVlbicpIHtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC5zaG93T25GdWxsc2NyZWVuID0gdmFsdWU7XHJcbiAgICBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gIH0gZWxzZSBpZiAoc2V0dGluZ0tleSA9PT0gJ2xheW91dE1vZGUnKSB7XHJcbiAgICBfdGltZURpc3BsYXlzLmZvckVhY2goZCA9PiB7IGQubGF5b3V0TW9kZSA9IHZhbHVlOyBkLnVwZGF0ZVZpc2liaWxpdHkoKTsgfSk7XHJcbiAgICBvdmVybGF5VGltZURpc3AubGF5b3V0TW9kZSA9IHZhbHVlO1xyXG4gICAgb3ZlcmxheVRpbWVEaXNwLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIOW/q+aNt+mUruS4tOaXtuWIh+aNou+8muiusOW9leWOn+Wni+WAvCDihpIg5YaZ5YWlIHdpZGdldFxyXG5mdW5jdGlvbiB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksIG5ld1ZhbHVlLCBjdXJyZW50VmFsdWUpIHtcclxuICBpZiAoIShzZXR0aW5nS2V5IGluIF90ZW1wT3ZlcnJpZGVzKSkge1xyXG4gICAgX3RlbXBPdmVycmlkZXNbc2V0dGluZ0tleV0gPSBjdXJyZW50VmFsdWU7XHJcbiAgfVxyXG4gIGFwcGx5U2V0dGluZ1RvV2lkZ2V0cyhzZXR0aW5nS2V5LCBuZXdWYWx1ZSk7XHJcbn1cclxuXHJcbi8vIOmAgOWHuuWFqOWxj+aXtuaBouWkjeaJgOacieS4tOaXtuaUueWKqFxyXG5mdW5jdGlvbiByZXN0b3JlVGVtcFZhbHVlcygpIHtcclxuICBmb3IgKGNvbnN0IFtrZXksIG9yaWdpbmFsVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKF90ZW1wT3ZlcnJpZGVzKSkge1xyXG4gICAgYXBwbHlTZXR0aW5nVG9XaWRnZXRzKGtleSwgb3JpZ2luYWxWYWx1ZSk7XHJcbiAgfVxyXG4gIGZvciAoY29uc3Qga2V5IGluIF90ZW1wT3ZlcnJpZGVzKSB7XHJcbiAgICBkZWxldGUgX3RlbXBPdmVycmlkZXNba2V5XTtcclxuICB9XHJcbn1cclxuXHJcbi8vIOajgOa1i+mAgOWHuuWFqOWxj++8iOWQqyBGMTHvvIlcclxuZnVuY3Rpb24gY2hlY2tGdWxsc2NyZWVuRXhpdCgpIHtcclxuICBjb25zdCBpc0ZzID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XHJcbiAgaWYgKCFpc0ZzKSB7XHJcbiAgICByZXN0b3JlVGVtcFZhbHVlcygpO1xyXG4gIH1cclxufVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgY2hlY2tGdWxsc2NyZWVuRXhpdCk7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja0Z1bGxzY3JlZW5FeGl0KTtcclxuXHJcbi8vIOWFs+mXreaMiemSriDDlyDihpIg5Li05pe26ZqQ6JeP77yI5ZCM5b+r5o236ZSuIGhpZGUg6KGM5Li677yJXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2ZzLXRpbWUtZGlzbWlzcycsIChlKSA9PiB7XHJcbiAgY29uc3Qgc2V0dGluZ0tleSA9IGUuZGV0YWlsLmRpc3BsYXlUeXBlID09PSAnd2luZG93LW92ZXJsYXknXHJcbiAgICA/ICdzaG93T25GdWxsc2NyZWVuJ1xyXG4gICAgOiAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nO1xyXG4gIGNvbnN0IGN1cnJlbnRWYWwgPSBzZXR0aW5nS2V5ID09PSAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nXHJcbiAgICA/IG92ZXJsYXlUaW1lRGlzcC5zaG93V2hlblZpZGVvRnVsbHNjcmVlblxyXG4gICAgOiBvdmVybGF5VGltZURpc3Auc2hvd09uRnVsbHNjcmVlbjtcclxuICBpZiAoY3VycmVudFZhbCA9PT0gZmFsc2UpIHJldHVybjsgLy8g5bey57uP6ZqQ6JePXHJcbiAgdGVtcFRvZ2dsZShzZXR0aW5nS2V5LCBmYWxzZSwgY3VycmVudFZhbCk7XHJcbiAgY29uc29sZS5sb2coYFvlhbPpl61dICR7c2V0dGluZ0tleX0g5Li05pe25YWz6ZetYCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgY29uc3QgaXNGcyA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xyXG4gIGlmICghaXNGcykgcmV0dXJuO1xyXG5cclxuICAvLyBFU0Mg5pyJ5rWP6KeI5Zmo6YCA5Ye65YWo5bGP55qE6buY6K6k6KGM5Li677yM5LiN5bqU6L+b5YWl5b+r5o236ZSu6YC76L6RXHJcbiAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgcmV0dXJuO1xyXG5cclxuICBjb25zdCBwcmVzc2VkID0gYnVpbGRLZXlTdHJpbmcoZSk7XHJcbiAgaWYgKCFwcmVzc2VkKSByZXR1cm47XHJcblxyXG4gIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgWydrZXlUb2dnbGVMYXlvdXQnLCAna2V5VG9nZ2xlVmlzaWJpbGl0eSddLFxyXG4gICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgIGlmIChwcmVzc2VkID09PSBpdGVtcy5rZXlUb2dnbGVMYXlvdXQpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAvLyDku44gd2lkZ2V0IOWunuS+i+ivu+WPluW9k+WJjeW4g+WxgOaooeW8j++8iHN0b3JhZ2Ug5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb2RlID0gb3ZlcmxheVRpbWVEaXNwLmxheW91dE1vZGU7XHJcbiAgICAgICAgY29uc3QgbmV3TW9kZSA9IGN1cnJlbnRNb2RlID09PSAnZmxvYXQnID8gJ3NuYXAnIDogJ2Zsb2F0JztcclxuICAgICAgICB0ZW1wVG9nZ2xlKCdsYXlvdXRNb2RlJywgbmV3TW9kZSwgY3VycmVudE1vZGUpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBb5b+r5o236ZSuXSDluIPlsYDmqKHlvI/liIfmjaLkuLo6ICR7bmV3TW9kZSA9PT0gJ2Zsb2F0JyA/ICfmta7liqgnIDogJ+ejgeWQuCd9YCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwcmVzc2VkID09PSBpdGVtcy5rZXlUb2dnbGVWaXNpYmlsaXR5KSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgaW5WaWRlb0ZzID0gISFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudDtcclxuICAgICAgICBjb25zdCBzZXR0aW5nS2V5ID0gaW5WaWRlb0ZzID8gJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyA6ICdzaG93T25GdWxsc2NyZWVuJztcclxuICAgICAgICAvLyDku44gd2lkZ2V0IOWunuS+i+ivu+WPluW9k+WJjeeKtuaAge+8iHN0b3JhZ2Ug5LuO5pyq6KKrIHNob3J0Y3V0IOWGmei/h++8iVxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWwgPSBzZXR0aW5nS2V5ID09PSAnc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4nXHJcbiAgICAgICAgICA/IG92ZXJsYXlUaW1lRGlzcC5zaG93V2hlblZpZGVvRnVsbHNjcmVlblxyXG4gICAgICAgICAgOiBvdmVybGF5VGltZURpc3Auc2hvd09uRnVsbHNjcmVlbjtcclxuICAgICAgICB0ZW1wVG9nZ2xlKHNldHRpbmdLZXksICFjdXJyZW50VmFsLCBjdXJyZW50VmFsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW+W/q+aNt+mUrl0g5pi+56S6JHshY3VycmVudFZhbCA/ICflvIDlkK8nIDogJ+WFs+mXrSd9YCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICApO1xyXG59KTtcclxuXHJcblxyXG4iXSwibmFtZXMiOlsiZm9ybWF0VGltZSIsInNlY29uZHMiLCJpc05hTiIsIm1pbnMiLCJNYXRoIiwiZmxvb3IiLCJzZWNzIiwiY29uY2F0IiwiU3RyaW5nIiwicGFkU3RhcnQiLCJjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInNjcmVlbiIsImhlaWdodCIsImlubmVyV2lkdGgiLCJ3aWR0aCIsIlRpbWVEaXNwbGF5IiwibWVkaWEiLCJfY2xhc3NDYWxsQ2hlY2siLCJ0aW1lRWxlbWVudCIsImNyZWF0ZVRpbWVFbGVtZW50Iiwic2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4iLCJzaG93T25GdWxsc2NyZWVuIiwic2hvd1NlY29uZHMiLCJzaG93UHJvZ3Jlc3MiLCJhdXRvSGlkZSIsImF1dG9IaWRlVGltZXIiLCJfYm91bmRNb3VzZU1vdmVIYW5kbGVyIiwibGF5b3V0TW9kZSIsImZsb2F0UG9zaXRpb24iLCJfaXNEcmFnZ2luZyIsIl9kcmFnT2Zmc2V0IiwieCIsInkiLCJfYm91bmRNb3VzZURvd25TdGFydCIsIl9ib3VuZE1vdXNlTW92ZUR1cmluZyIsIl9ib3VuZE1vdXNlVXBFbmQiLCJsb2FkU2V0dGluZ3MiLCJzZXR1cEV2ZW50TGlzdGVuZXJzIiwic2V0dXBTZXR0aW5nc0xpc3RlbmVyIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJfdGhpcyIsImNocm9tZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiaXRlbXMiLCJ1cGRhdGVWaXNpYmlsaXR5IiwiZGlzcGxheVR5cGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInpJbmRleCIsInRyYW5zaXRpb24iLCJwb2ludGVyRXZlbnRzIiwiZGlzcGxheSIsInRleHRTcGFuIiwidGV4dENvbnRlbnQiLCJfdGltZVRleHRTcGFuIiwiYXBwZW5kQ2hpbGQiLCJjbG9zZUJ0biIsIl9jcmVhdGVDbG9zZUJ1dHRvbiIsIl9jbG9zZUJ0biIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwibWF0Y2hlcyIsIl90aGlzMiIsImJ0biIsInRpdGxlIiwiT2JqZWN0IiwiYXNzaWduIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsImxpbmVIZWlnaHQiLCJ0ZXh0QWxpZ24iLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJjdXJzb3IiLCJib3hTaGFkb3ciLCJ1c2VyU2VsZWN0IiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsImhhbmRsZURpc21pc3MiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJkZXRhaWwiLCJjaGVja0lzVG9TaG93IiwiZnNFbCIsImZ1bGxzY3JlZW5FbGVtZW50Iiwid2Via2l0RnVsbHNjcmVlbkVsZW1lbnQiLCJtb3pGdWxsU2NyZWVuRWxlbWVudCIsIm1zRnVsbHNjcmVlbkVsZW1lbnQiLCJpc0Z1bGwiLCJjb250YWlucyIsIl9yZXNldENsb3NlQnV0dG9uIiwic2hvdyIsInVwZGF0ZVRpbWUiLCJvcGFjaXR5IiwidGVhcmRvd25EcmFnZ2luZyIsImZsb2F0UGFyZW50IiwiYm9keSIsInBhcmVudEVsZW1lbnQiLCJhcHBseUZsb2F0UG9zaXRpb24iLCJzZXR1cERyYWdnaW5nIiwibGVmdCIsInRyYW5zZm9ybSIsInN0YXJ0QXV0b0hpZGUiLCJoaWRlIiwiY2xlYXJBdXRvSGlkZVRpbWVyIiwidGVhcmRvd25Nb3VzZUxpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJfdGhpczMiLCJzZXR1cE1vdXNlTGlzdGVuZXIiLCJmYWRlT3V0IiwiY2xlYXJUaW1lb3V0IiwiX3RoaXM0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIl90aGlzNSIsIl9vbkRyYWdTdGFydCIsIl9vbkRyYWdFbmQiLCJfdGhpczYiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2xpZW50WCIsImNsaWVudFkiLCJfb25EcmFnTW92ZSIsInJvdW5kIiwic2V0Iiwibm93IiwiRGF0ZSIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsInN5c3RlbVRpbWUiLCJnZXRTZWNvbmRzIiwiY3VycmVudFRpbWUiLCJkdXJhdGlvbiIsIl90aGlzNyIsInNldEludGVydmFsIiwidXBkYXRlVmlzaWJpbGl0eUJvdW5kIiwiYmluZCIsIl90aGlzOCIsIm9uQ2hhbmdlZCIsImFkZExpc3RlbmVyIiwiY2hhbmdlcyIsIm5hbWVzcGFjZSIsIm5ld1ZhbHVlIiwiV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IiwiX1RpbWVEaXNwbGF5IiwiX2NhbGxTdXBlciIsImFyZ3VtZW50cyIsIl9pbmhlcml0cyIsIl90aGlzOSIsImNvbnNvbGUiLCJsb2ciLCJzY2FuRm9yTWVkaWEiLCJtZWRpYVRhZ1NlbGVjdG9yIiwicmVndWxhck1lZGlhIiwicXVlcnlTZWxlY3RvckFsbCIsIl90aW1lRGlzcGxheXMiLCJpbmplY3RGb3JNZWRpYXMiLCJtZWRpYXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJ3YXJuIiwiZm9yRWFjaCIsInB1c2giLCJvdmVybGF5VGltZURpc3AiLCJfdGVtcE92ZXJyaWRlcyIsImJ1aWxkS2V5U3RyaW5nIiwicGFydHMiLCJjdHJsS2V5IiwiYWx0S2V5Iiwic2hpZnRLZXkiLCJqb2luIiwiYXBwbHlTZXR0aW5nVG9XaWRnZXRzIiwic2V0dGluZ0tleSIsImQiLCJ0ZW1wVG9nZ2xlIiwiY3VycmVudFZhbHVlIiwicmVzdG9yZVRlbXBWYWx1ZXMiLCJfaSIsIl9PYmplY3QkZW50cmllcyIsImVudHJpZXMiLCJfT2JqZWN0JGVudHJpZXMkX2kiLCJfc2xpY2VkVG9BcnJheSIsIm9yaWdpbmFsVmFsdWUiLCJjaGVja0Z1bGxzY3JlZW5FeGl0IiwiaXNGcyIsImN1cnJlbnRWYWwiLCJwcmVzc2VkIiwia2V5VG9nZ2xlTGF5b3V0IiwicHJldmVudERlZmF1bHQiLCJjdXJyZW50TW9kZSIsIm5ld01vZGUiLCJrZXlUb2dnbGVWaXNpYmlsaXR5IiwiaW5WaWRlb0ZzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=