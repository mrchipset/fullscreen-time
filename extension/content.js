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


console.log("hello world!");
function scanForMedia(document) {
  var mediaTagSelector = 'video';

  // ① 查找普通DOM中的video/audio标签
  var regularMedia = document.querySelectorAll(mediaTagSelector);

  //   // ② 递归查找Shadow DOM中的video标签
  //   const shadowMedia = findShadowMedia(document, mediaTagSelector);

  //   // ③ 查找网站特定的视频元素
  //   const siteSpecificMedia = this.siteHandler.detectSpecialVideos(document);

  //   // ④ 过滤掉需要忽略的视频
  //   return filteredMedia;
  return regularMedia;
}
function injectForMedias() {
  var medias = scanForMedia(document);
  if (medias === undefined || medias.length === 0) {
    console.warn("No media elements found.");
    setTimeout(injectForMedias, 2000); // retry after 2 seconds
    return;
  }
  // 输出找到的媒体元素
  console.log("Found media elements:", medias);

  // 为每个媒体元素创建时间显示
  medias.forEach(function (media) {
    new _widgets__WEBPACK_IMPORTED_MODULE_1__.TimeDisplay(media);
  });
}
injectForMedias();
var overlayTimeDisp = new _widgets__WEBPACK_IMPORTED_MODULE_1__.WindowOverlayTimeDisplay(document.body);
window.addEventListener('resize', function () {
  // if (checkIsBrowserFullscreen()) {
  //   overlayTimeDisp.show();
  //   console.log('Browser is in fullscreen mode');
  // } else {
  //   overlayTimeDisp.hide();
  //   console.log('Browser is not in fullscreen mode');
  // }
  overlayTimeDisp.updateVisibility();
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFDbkM7RUFDRjtFQUNBO0VBQ0FOLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLHVCQUF1QixFQUFFTSxNQUFNLENBQUM7O0VBRTVDO0VBQ0FBLE1BQU0sQ0FBQ0ksT0FBTyxDQUFDLFVBQUFwSSxLQUFLLEVBQUk7SUFDdEIsSUFBSUQsaURBQVcsQ0FBQ0MsS0FBSyxDQUFDO0VBQ3hCLENBQUMsQ0FBQztBQUNKO0FBR0ErSCxlQUFlLENBQUMsQ0FBQztBQUNqQixJQUFNTSxlQUFlLEdBQUcsSUFBSWxCLDhEQUF3QixDQUFDakYsUUFBUSxDQUFDeUIsSUFBSSxDQUFDO0FBRW5FbEUsTUFBTSxDQUFDc0YsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07RUFDdEM7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQXNELGVBQWUsQ0FBQ3JHLGdCQUFnQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0Ly4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2VtcHR5LXByb2plY3QvLi9zcmMvd2lkZ2V0cy5qcyIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmb3JtYXQgdGltZSBpbiBzZWNvbmRzIHRvIG1tOnNzXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcclxuICAgIGlmIChpc05hTihzZWNvbmRzKSkgcmV0dXJuICcwMDowMCc7XHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgY29uc3Qgc2VjcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcclxuICAgIHJldHVybiBgJHtTdHJpbmcobWlucykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcoc2VjcykucGFkU3RhcnQoMiwgJzAnKX1gO1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBmdWxsc2NyZWVuIGZvciBicm93c2VyXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ID09PSBzY3JlZW4uaGVpZ2h0ICYmIHdpbmRvdy5pbm5lcldpZHRoID09PSBzY3JlZW4ud2lkdGg7XHJcbn0iLCJpbXBvcnQgeyBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4sIGZvcm1hdFRpbWUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaW1lRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IobWVkaWEpIHtcclxuICAgIHRoaXMubWVkaWEgPSBtZWRpYTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRpbWVFbGVtZW50KCk7XHJcbiAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dTZWNvbmRzID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gdHJ1ZTtcclxuICAgIHRoaXMuYXV0b0hpZGUgPSBmYWxzZTtcclxuICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IG51bGw7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIgPSBudWxsO1xyXG4gICAgdGhpcy5sYXlvdXRNb2RlID0gJ3NuYXAnO1xyXG4gICAgdGhpcy5mbG9hdFBvc2l0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuX2RyYWdPZmZzZXQgPSB7IHg6IDAsIHk6IDAgfTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQgPSBudWxsO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcgPSBudWxsO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZVVwRW5kID0gbnVsbDtcclxuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAvLyDku45DaHJvbWXlrZjlgqjkuK3or7vlj5borr7nva5cclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgICB7XHJcbiAgICAgICAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXHJcbiAgICAgICAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcclxuICAgICAgICBzaG93U2Vjb25kczogdHJ1ZSxcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXHJcbiAgICAgICAgYXV0b0hpZGU6IGZhbHNlLFxyXG4gICAgICAgIGxheW91dE1vZGU6ICdzbmFwJyxcclxuICAgICAgICBmbG9hdFBvc2l0aW9uOiBudWxsXHJcbiAgICAgIH0sXHJcbiAgICAgIChpdGVtcykgPT4ge1xyXG4gICAgICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBpdGVtcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbjtcclxuICAgICAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSBpdGVtcy5zaG93T25GdWxsc2NyZWVuO1xyXG4gICAgICAgIHRoaXMuc2hvd1NlY29uZHMgPSBpdGVtcy5zaG93U2Vjb25kcztcclxuICAgICAgICB0aGlzLnNob3dQcm9ncmVzcyA9IGl0ZW1zLnNob3dQcm9ncmVzcztcclxuICAgICAgICB0aGlzLmF1dG9IaWRlID0gaXRlbXMuYXV0b0hpZGU7XHJcbiAgICAgICAgdGhpcy5sYXlvdXRNb2RlID0gaXRlbXMubGF5b3V0TW9kZSB8fCAnc25hcCc7XHJcbiAgICAgICAgdGhpcy5mbG9hdFBvc2l0aW9uID0gaXRlbXMuZmxvYXRQb3NpdGlvbiB8fCBudWxsO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICByZXR1cm4gJ21lZGlhJztcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpbWVFbGVtZW50KCkge1xyXG4gICAgY29uc3QgdGltZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICc1cHgnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjNzIGVhc2UnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcclxuICAgIHRpbWVFbGVtZW50LmlubmVyVGV4dCA9ICcwMDowMCAvIDAwOjAwJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICByZXR1cm4gdGltZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgaWYgKCF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgIHJldHVybiBpc0Z1bGw7XHJcbiAgfVxyXG5cclxuICBzaG93KCkge1xyXG4gICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuXHJcbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnZmxvYXQnKSB7XHJcbiAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICBjb25zdCBmbG9hdFBhcmVudCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IGZsb2F0UGFyZW50KSB7XHJcbiAgICAgICAgZmxvYXRQYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5hcHBseUZsb2F0UG9zaXRpb24oKTtcclxuICAgICAgdGhpcy5zZXR1cERyYWdnaW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gJzEwcHgnO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IHRoaXMubWVkaWEucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMubWVkaWEucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmF1dG9IaWRlKSB7XHJcbiAgICAgIHRoaXMuc3RhcnRBdXRvSGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGlkZSgpIHtcclxuICAgIHRoaXMuY2xlYXJBdXRvSGlkZVRpbWVyKCk7XHJcbiAgICB0aGlzLnRlYXJkb3duTW91c2VMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlVmlzaWJpbGl0eSgpIHtcclxuICAgIC8vIOajgOafpeaYr+WQpuWcqOWFqOWxj+S4lOiuvue9ruS4reWQr+eUqOS6huWFqOWxj+aYvuekulxyXG4gICAgaWYgKHRoaXMuY2hlY2tJc1RvU2hvdygpKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGFydEF1dG9IaWRlKCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcclxuICAgIHRoaXMuc2V0dXBNb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmFkZU91dCgpLCAzMDAwKTtcclxuICB9XHJcblxyXG4gIGNsZWFyQXV0b0hpZGVUaW1lcigpIHtcclxuICAgIGlmICh0aGlzLmF1dG9IaWRlVGltZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYXV0b0hpZGVUaW1lcik7XHJcbiAgICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXR1cE1vdXNlTGlzdGVuZXIoKSB7XHJcbiAgICB0aGlzLnRlYXJkb3duTW91c2VMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgICAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xyXG4gICAgICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgdGVhcmRvd25Nb3VzZUxpc3RlbmVyKCkge1xyXG4gICAgaWYgKHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlcikge1xyXG4gICAgICB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlcik7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmYWRlT3V0KCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gIH1cclxuXHJcbiAgYXBwbHlGbG9hdFBvc2l0aW9uKCkge1xyXG4gICAgLy8g6KeG6aKR5YWo5bGP5pe255SoIGFic29sdXRl77yI5oyC5Zyo5YWo5bGP5YWD57Sg5LiL77yJ77yM5ZCm5YiZ55SoIGZpeGVk77yI5oyC5ZyoIGJvZHkg5LiL77yJXHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgPyAnYWJzb2x1dGUnIDogJ2ZpeGVkJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xyXG4gICAgaWYgKHRoaXMuZmxvYXRQb3NpdGlvbikge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSBgJHt0aGlzLmZsb2F0UG9zaXRpb24ueH1weGA7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7dGhpcy5mbG9hdFBvc2l0aW9uLnl9cHhgO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gJzIwcHgnO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldHVwRHJhZ2dpbmcoKSB7XHJcbiAgICB0aGlzLnRlYXJkb3duRHJhZ2dpbmcoKTtcclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xyXG5cclxuICAgIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQgPSAoZSkgPT4gdGhpcy5fb25EcmFnU3RhcnQoZSk7XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlVXBFbmQgPSAoKSA9PiB0aGlzLl9vbkRyYWdFbmQoKTtcclxuXHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX2JvdW5kTW91c2VVcEVuZCk7XHJcbiAgfVxyXG5cclxuICB0ZWFyZG93bkRyYWdnaW5nKCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudXNlclNlbGVjdCA9ICcnO1xyXG4gICAgaWYgKHRoaXMuX2JvdW5kTW91c2VEb3duU3RhcnQpIHtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9ib3VuZE1vdXNlRG93blN0YXJ0KTtcclxuICAgICAgdGhpcy5fYm91bmRNb3VzZURvd25TdGFydCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcpIHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcpO1xyXG4gICAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fYm91bmRNb3VzZVVwRW5kKSB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9ib3VuZE1vdXNlVXBFbmQpO1xyXG4gICAgICB0aGlzLl9ib3VuZE1vdXNlVXBFbmQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgX29uRHJhZ1N0YXJ0KGUpIHtcclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMudGltZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLl9kcmFnT2Zmc2V0ID0geyB4OiBlLmNsaWVudFggLSByZWN0LmxlZnQsIHk6IGUuY2xpZW50WSAtIHJlY3QudG9wIH07XHJcbiAgICB0aGlzLl9ib3VuZE1vdXNlTW92ZUR1cmluZyA9IChlKSA9PiB0aGlzLl9vbkRyYWdNb3ZlKGUpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fYm91bmRNb3VzZU1vdmVEdXJpbmcpO1xyXG4gIH1cclxuXHJcbiAgX29uRHJhZ01vdmUoZSkge1xyXG4gICAgaWYgKCF0aGlzLl9pc0RyYWdnaW5nKSByZXR1cm47XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ25vbmUnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7ZS5jbGllbnRYIC0gdGhpcy5fZHJhZ09mZnNldC54fXB4YDtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gYCR7ZS5jbGllbnRZIC0gdGhpcy5fZHJhZ09mZnNldC55fXB4YDtcclxuICB9XHJcblxyXG4gIF9vbkRyYWdFbmQoKSB7XHJcbiAgICBpZiAoIXRoaXMuX2lzRHJhZ2dpbmcpIHJldHVybjtcclxuICAgIHRoaXMuX2lzRHJhZ2dpbmcgPSBmYWxzZTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nKTtcclxuICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlRHVyaW5nID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCByZWN0ID0gdGhpcy50aW1lRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuZmxvYXRQb3NpdGlvbiA9IHsgeDogTWF0aC5yb3VuZChyZWN0LmxlZnQpLCB5OiBNYXRoLnJvdW5kKHJlY3QudG9wKSB9O1xyXG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBmbG9hdFBvc2l0aW9uOiB0aGlzLmZsb2F0UG9zaXRpb24gfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUaW1lKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgbWludXRlcyA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3Qgc3lzdGVtVGltZSA9IHRoaXMuc2hvd1NlY29uZHNcclxuICAgICAgPyBgJHtob3Vyc306JHttaW51dGVzfToke1N0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCAnMCcpfWBcclxuICAgICAgOiBgJHtob3Vyc306JHttaW51dGVzfWA7XHJcblxyXG4gICAgaWYgKHRoaXMuc2hvd1Byb2dyZXNzKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcclxuICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLm1lZGlhLmR1cmF0aW9uO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmlubmVyVGV4dCA9IGAke2Zvcm1hdFRpbWUoY3VycmVudFRpbWUpfSAvICR7Zm9ybWF0VGltZShkdXJhdGlvbil9IHwgJHtzeXN0ZW1UaW1lfWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmlubmVyVGV4dCA9IHN5c3RlbVRpbWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cclxuXHJcbiAgICAvLyBVcGRhdGUgdGltZSBldmVyeSBzZWNvbmQgaWYgbWVkaWEgaXMgZnVsbHNjcmVlblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgICAgY29uc3QgaXNGdWxsID0gZnNFbCAmJiAoZnNFbCA9PT0gdGhpcy5tZWRpYSB8fCBmc0VsLmNvbnRhaW5zKHRoaXMubWVkaWEpIHx8IHRoaXMubWVkaWEuY29udGFpbnMoZnNFbCkpO1xyXG4gICAgICBpZiAoaXNGdWxsICYmIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgLy8gTGlzdGVuIHRvIGZ1bGxzY3JlZW4gY2hhbmdlIGV2ZW50c1xyXG4gICAgY29uc3QgdXBkYXRlVmlzaWJpbGl0eUJvdW5kID0gdGhpcy51cGRhdGVWaXNpYmlsaXR5LmJpbmQodGhpcyk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96ZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdNU0Z1bGxzY3JlZW5DaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gIH1cclxuXHJcbiAgc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCkge1xyXG4gICAgLy8gTGlzdGVuIHRvIHN0b3JhZ2UgY2hhbmdlcyB0byB1cGRhdGUgc2V0dGluZ3MgaW4gcmVhbC10aW1lXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIG5hbWVzcGFjZSkgPT4ge1xyXG4gICAgICBpZiAobmFtZXNwYWNlID09PSAnc3luYycpIHtcclxuICAgICAgICBpZiAoJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gY2hhbmdlcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbi5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93T25GdWxsc2NyZWVuJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSBjaGFuZ2VzLnNob3dPbkZ1bGxzY3JlZW4ubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd1NlY29uZHMnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1NlY29uZHMgPSBjaGFuZ2VzLnNob3dTZWNvbmRzLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dQcm9ncmVzcycgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSBjaGFuZ2VzLnNob3dQcm9ncmVzcy5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdhdXRvSGlkZScgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGNoYW5nZXMuYXV0b0hpZGUubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnbGF5b3V0TW9kZScgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5sYXlvdXRNb2RlID0gY2hhbmdlcy5sYXlvdXRNb2RlLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IGV4dGVuZHMgVGltZURpc3BsYXkge1xyXG4gICAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICd3aW5kb3ctb3ZlcmxheSc7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdmbG9hdCcpIHtcclxuICAgICAgICAgICAgdGhpcy50ZWFyZG93bkRyYWdnaW5nKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZsb2F0UGFyZW50ID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZmxvYXRQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGZsb2F0UGFyZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbHlGbG9hdFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0dXBEcmFnZ2luZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICAgICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMudGVhcmRvd25EcmFnZ2luZygpO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtVGltZSA9IHRoaXMuc2hvd1NlY29uZHNcclxuICAgICAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LmlubmVyVGV4dCA9IHN5c3RlbVRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tJc1RvU2hvdygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2hvd09uRnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDlhYPntKDlhajlsY/vvIjop4bpopHlhajlsY/vvInml7bvvJrlpoLmnpzop4bpopHkuJPnlKjmmL7npLrlt7LlvIDlkK/vvIzkuI3lho3ph43lpI3mmL7npLpcclxuICAgICAgICBpZiAoZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g5rWP6KeI5Zmo5YWo5bGP77yIRjEx77yJ5pe25pi+56S6XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIHZpc2liaWxpdHkgaW5pdGlhbGx5XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZvcm1hdFRpbWUsIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBUaW1lRGlzcGxheSwgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IH0gZnJvbSAnLi93aWRnZXRzJztcclxuXHJcbmNvbnNvbGUubG9nKFwiaGVsbG8gd29ybGQhXCIpO1xyXG5cclxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKGRvY3VtZW50KSB7XHJcbiAgY29uc3QgbWVkaWFUYWdTZWxlY3RvciA9ICd2aWRlbyc7XHJcbiAgXHJcbiAgLy8g4pGgIOafpeaJvuaZrumAmkRPTeS4reeahHZpZGVvL2F1ZGlv5qCH562+XHJcbiAgY29uc3QgcmVndWxhck1lZGlhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChtZWRpYVRhZ1NlbGVjdG9yKTtcclxuICBcclxuLy8gICAvLyDikaEg6YCS5b2S5p+l5om+U2hhZG93IERPTeS4reeahHZpZGVv5qCH562+XHJcbi8vICAgY29uc3Qgc2hhZG93TWVkaWEgPSBmaW5kU2hhZG93TWVkaWEoZG9jdW1lbnQsIG1lZGlhVGFnU2VsZWN0b3IpO1xyXG4gIFxyXG4vLyAgIC8vIOKRoiDmn6Xmib7nvZHnq5nnibnlrprnmoTop4bpopHlhYPntKBcclxuLy8gICBjb25zdCBzaXRlU3BlY2lmaWNNZWRpYSA9IHRoaXMuc2l0ZUhhbmRsZXIuZGV0ZWN0U3BlY2lhbFZpZGVvcyhkb2N1bWVudCk7XHJcbiAgXHJcbi8vICAgLy8g4pGjIOi/h+a7pOaOiemcgOimgeW/veeVpeeahOinhumikVxyXG4vLyAgIHJldHVybiBmaWx0ZXJlZE1lZGlhO1xyXG4gICAgcmV0dXJuIHJlZ3VsYXJNZWRpYTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5qZWN0Rm9yTWVkaWFzKCkge1xyXG4gIGNvbnN0IG1lZGlhcyA9IHNjYW5Gb3JNZWRpYShkb2N1bWVudCk7XHJcbiAgaWYgKG1lZGlhcyA9PT0gdW5kZWZpbmVkIHx8IG1lZGlhcy5sZW5ndGggPT09IDApIHtcclxuICAgIGNvbnNvbGUud2FybihcIk5vIG1lZGlhIGVsZW1lbnRzIGZvdW5kLlwiKTtcclxuICAgIHNldFRpbWVvdXQoaW5qZWN0Rm9yTWVkaWFzLCAyMDAwKTsgLy8gcmV0cnkgYWZ0ZXIgMiBzZWNvbmRzXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIOi+k+WHuuaJvuWIsOeahOWqkuS9k+WFg+e0oFxyXG4gIGNvbnNvbGUubG9nKFwiRm91bmQgbWVkaWEgZWxlbWVudHM6XCIsIG1lZGlhcyk7XHJcblxyXG4gIC8vIOS4uuavj+S4quWqkuS9k+WFg+e0oOWIm+W7uuaXtumXtOaYvuekulxyXG4gIG1lZGlhcy5mb3JFYWNoKG1lZGlhID0+IHtcclxuICAgIG5ldyBUaW1lRGlzcGxheShtZWRpYSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5pbmplY3RGb3JNZWRpYXMoKTtcclxuY29uc3Qgb3ZlcmxheVRpbWVEaXNwID0gbmV3IFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheShkb2N1bWVudC5ib2R5KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgLy8gaWYgKGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpKSB7XHJcbiAgLy8gICBvdmVybGF5VGltZURpc3Auc2hvdygpO1xyXG4gIC8vICAgY29uc29sZS5sb2coJ0Jyb3dzZXIgaXMgaW4gZnVsbHNjcmVlbiBtb2RlJyk7XHJcbiAgLy8gfSBlbHNlIHtcclxuICAvLyAgIG92ZXJsYXlUaW1lRGlzcC5oaWRlKCk7XHJcbiAgLy8gICBjb25zb2xlLmxvZygnQnJvd3NlciBpcyBub3QgaW4gZnVsbHNjcmVlbiBtb2RlJyk7XHJcbiAgLy8gfVxyXG4gIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbn0pO1xyXG5cclxuXHJcbiJdLCJuYW1lcyI6WyJmb3JtYXRUaW1lIiwic2Vjb25kcyIsImlzTmFOIiwibWlucyIsIk1hdGgiLCJmbG9vciIsInNlY3MiLCJjb25jYXQiLCJTdHJpbmciLCJwYWRTdGFydCIsImNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiIsIndpbmRvdyIsImlubmVySGVpZ2h0Iiwic2NyZWVuIiwiaGVpZ2h0IiwiaW5uZXJXaWR0aCIsIndpZHRoIiwiVGltZURpc3BsYXkiLCJtZWRpYSIsIl9jbGFzc0NhbGxDaGVjayIsInRpbWVFbGVtZW50IiwiY3JlYXRlVGltZUVsZW1lbnQiLCJzaG93V2hlblZpZGVvRnVsbHNjcmVlbiIsInNob3dPbkZ1bGxzY3JlZW4iLCJzaG93U2Vjb25kcyIsInNob3dQcm9ncmVzcyIsImF1dG9IaWRlIiwiYXV0b0hpZGVUaW1lciIsIl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIiLCJsYXlvdXRNb2RlIiwiZmxvYXRQb3NpdGlvbiIsIl9pc0RyYWdnaW5nIiwiX2RyYWdPZmZzZXQiLCJ4IiwieSIsIl9ib3VuZE1vdXNlRG93blN0YXJ0IiwiX2JvdW5kTW91c2VNb3ZlRHVyaW5nIiwiX2JvdW5kTW91c2VVcEVuZCIsImxvYWRTZXR0aW5ncyIsInNldHVwRXZlbnRMaXN0ZW5lcnMiLCJzZXR1cFNldHRpbmdzTGlzdGVuZXIiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsIl90aGlzIiwiY2hyb21lIiwic3RvcmFnZSIsInN5bmMiLCJnZXQiLCJpdGVtcyIsInVwZGF0ZVZpc2liaWxpdHkiLCJkaXNwbGF5VHlwZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwiekluZGV4IiwidHJhbnNpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJpbm5lclRleHQiLCJkaXNwbGF5IiwiY2hlY2tJc1RvU2hvdyIsImZzRWwiLCJmdWxsc2NyZWVuRWxlbWVudCIsIndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IiwibW96RnVsbFNjcmVlbkVsZW1lbnQiLCJtc0Z1bGxzY3JlZW5FbGVtZW50IiwiaXNGdWxsIiwiY29udGFpbnMiLCJzaG93IiwidXBkYXRlVGltZSIsIm9wYWNpdHkiLCJ0ZWFyZG93bkRyYWdnaW5nIiwiZmxvYXRQYXJlbnQiLCJib2R5IiwicGFyZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwiYXBwbHlGbG9hdFBvc2l0aW9uIiwic2V0dXBEcmFnZ2luZyIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsInRyYW5zZm9ybSIsInN0YXJ0QXV0b0hpZGUiLCJoaWRlIiwiY2xlYXJBdXRvSGlkZVRpbWVyIiwidGVhcmRvd25Nb3VzZUxpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJfdGhpczIiLCJzZXR1cE1vdXNlTGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwiZmFkZU91dCIsImNsZWFyVGltZW91dCIsIl90aGlzMyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX3RoaXM0IiwiY3Vyc29yIiwidXNlclNlbGVjdCIsImUiLCJfb25EcmFnU3RhcnQiLCJfb25EcmFnRW5kIiwiX3RoaXM1IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwiX29uRHJhZ01vdmUiLCJyb3VuZCIsInNldCIsIm5vdyIsIkRhdGUiLCJob3VycyIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJzeXN0ZW1UaW1lIiwiZ2V0U2Vjb25kcyIsImN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJfdGhpczYiLCJzZXRJbnRlcnZhbCIsInVwZGF0ZVZpc2liaWxpdHlCb3VuZCIsImJpbmQiLCJfdGhpczciLCJvbkNoYW5nZWQiLCJhZGRMaXN0ZW5lciIsImNoYW5nZXMiLCJuYW1lc3BhY2UiLCJuZXdWYWx1ZSIsIldpbmRvd092ZXJsYXlUaW1lRGlzcGxheSIsIl9UaW1lRGlzcGxheSIsIl9jYWxsU3VwZXIiLCJhcmd1bWVudHMiLCJfaW5oZXJpdHMiLCJfdGhpczgiLCJjb25zb2xlIiwibG9nIiwic2NhbkZvck1lZGlhIiwibWVkaWFUYWdTZWxlY3RvciIsInJlZ3VsYXJNZWRpYSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbmplY3RGb3JNZWRpYXMiLCJtZWRpYXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJ3YXJuIiwiZm9yRWFjaCIsIm92ZXJsYXlUaW1lRGlzcCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9