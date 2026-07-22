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
        autoHide: false
      }, function (items) {
        _this.showWhenVideoFullscreen = items.showWhenVideoFullscreen;
        _this.showOnFullscreen = items.showOnFullscreen;
        _this.showSeconds = items.showSeconds;
        _this.showProgress = items.showProgress;
        _this.autoHide = items.autoHide;
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
      this.timeElement.style.position = 'absolute';
      this.timeElement.style.top = '10px';
      this.timeElement.style.left = '50%';
      this.timeElement.style.transform = 'translateX(-50%)';
      if (this.timeElement.parentElement !== this.media.parentElement) {
        this.media.parentElement.appendChild(this.timeElement);
      }
      this.timeElement.style.display = 'block';
      this.timeElement.style.zIndex = '999999';
      this.timeElement.style.opacity = '1';
      if (this.autoHide) {
        this.startAutoHide();
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      this.clearAutoHideTimer();
      this.teardownMouseListener();
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
      var _this4 = this;
      // Update time every second if media is fullscreen
      setInterval(function () {
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        var isFull = fsEl && (fsEl === _this4.media || fsEl.contains(_this4.media) || _this4.media.contains(fsEl));
        if (isFull && _this4.showWhenVideoFullscreen) {
          _this4.updateTime();
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
      var _this5 = this;
      // Listen to storage changes to update settings in real-time
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync') {
          if ('showWhenVideoFullscreen' in changes) {
            _this5.showWhenVideoFullscreen = changes.showWhenVideoFullscreen.newValue;
          }
          if ('showOnFullscreen' in changes) {
            _this5.showOnFullscreen = changes.showOnFullscreen.newValue;
          }
          if ('showSeconds' in changes) {
            _this5.showSeconds = changes.showSeconds.newValue;
          }
          if ('showProgress' in changes) {
            _this5.showProgress = changes.showProgress.newValue;
          }
          if ('autoHide' in changes) {
            _this5.autoHide = changes.autoHide.newValue;
          }
          _this5.updateVisibility();
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
      this.timeElement.style.position = 'fixed';
      this.timeElement.style.top = '10px';
      this.timeElement.style.left = '50%';
      this.timeElement.style.transform = 'translateX(-50%)';
      if (this.timeElement.parentElement !== document.body) {
        document.body.appendChild(this.timeElement);
      }
      this.timeElement.style.display = 'block';
      this.timeElement.style.zIndex = '999999';
    }
  }, {
    key: "hide",
    value: function hide() {
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
      return document.fullscreenElement !== null || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this6 = this;
      // Update visibility initially
      this.updateVisibility();
      // Update time every second
      setInterval(function () {
        _this6.updateTime();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNO0VBQ3RDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0F5QyxlQUFlLENBQUNsRixnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0Ly4vc3JjL3dpZGdldHMuanMiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2VtcHR5LXByb2plY3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZm9ybWF0IHRpbWUgaW4gc2Vjb25kcyB0byBtbTpzc1xyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZShzZWNvbmRzKSB7XHJcbiAgICBpZiAoaXNOYU4oc2Vjb25kcykpIHJldHVybiAnMDA6MDAnO1xyXG4gICAgY29uc3QgbWlucyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKTtcclxuICAgIGNvbnN0IHNlY3MgPSBNYXRoLmZsb29yKHNlY29uZHMgJSA2MCk7XHJcbiAgICByZXR1cm4gYCR7U3RyaW5nKG1pbnMpLnBhZFN0YXJ0KDIsICcwJyl9OiR7U3RyaW5nKHNlY3MpLnBhZFN0YXJ0KDIsICcwJyl9YDtcclxufVxyXG5cclxuLy8gY2hlY2sgaWYgZnVsbHNjcmVlbiBmb3IgYnJvd3NlclxyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCA9PT0gc2NyZWVuLmhlaWdodCAmJiB3aW5kb3cuaW5uZXJXaWR0aCA9PT0gc2NyZWVuLndpZHRoO1xyXG59IiwiaW1wb3J0IHsgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuLCBmb3JtYXRUaW1lIH0gZnJvbSAnLi91dGlscyc7XHJcblxyXG5leHBvcnQgY2xhc3MgVGltZURpc3BsYXkge1xyXG4gIGNvbnN0cnVjdG9yKG1lZGlhKSB7XHJcbiAgICB0aGlzLm1lZGlhID0gbWVkaWE7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gdGhpcy5jcmVhdGVUaW1lRWxlbWVudCgpO1xyXG4gICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSB0cnVlO1xyXG4gICAgdGhpcy5zaG93U2Vjb25kcyA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dQcm9ncmVzcyA9IHRydWU7XHJcbiAgICB0aGlzLmF1dG9IaWRlID0gZmFsc2U7XHJcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBudWxsO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyID0gbnVsbDtcclxuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAvLyDku45DaHJvbWXlrZjlgqjkuK3or7vlj5borr7nva5cclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgICB7XHJcbiAgICAgICAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXHJcbiAgICAgICAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcclxuICAgICAgICBzaG93U2Vjb25kczogdHJ1ZSxcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6IHRydWUsXHJcbiAgICAgICAgYXV0b0hpZGU6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIChpdGVtcykgPT4ge1xyXG4gICAgICAgIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4gPSBpdGVtcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbjtcclxuICAgICAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSBpdGVtcy5zaG93T25GdWxsc2NyZWVuO1xyXG4gICAgICAgIHRoaXMuc2hvd1NlY29uZHMgPSBpdGVtcy5zaG93U2Vjb25kcztcclxuICAgICAgICB0aGlzLnNob3dQcm9ncmVzcyA9IGl0ZW1zLnNob3dQcm9ncmVzcztcclxuICAgICAgICB0aGlzLmF1dG9IaWRlID0gaXRlbXMuYXV0b0hpZGU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5VHlwZSgpIHtcclxuICAgIHJldHVybiAnbWVkaWEnO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlVGltZUVsZW1lbnQoKSB7XHJcbiAgICBjb25zdCB0aW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMC41KSc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNXB4JztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuM3MgZWFzZSc7XHJcbiAgICB0aW1lRWxlbWVudC5pbm5lclRleHQgPSAnMDA6MDAgLyAwMDowMCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgcmV0dXJuIHRpbWVFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgY2hlY2tJc1RvU2hvdygpIHtcclxuICAgIGlmICghdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZnNFbCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBpc0Z1bGwgPSBmc0VsICYmIChmc0VsID09PSB0aGlzLm1lZGlhIHx8IGZzRWwuY29udGFpbnModGhpcy5tZWRpYSkgfHwgdGhpcy5tZWRpYS5jb250YWlucyhmc0VsKSk7XHJcbiAgICByZXR1cm4gaXNGdWxsO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcxMHB4JztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XHJcbiAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSc7XHJcblxyXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcclxuICAgICAgdGhpcy5zdGFydEF1dG9IaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcclxuICAgIHRoaXMudGVhcmRvd25Nb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlVmlzaWJpbGl0eSgpIHtcclxuICAgIC8vIOajgOafpeaYr+WQpuWcqOWFqOWxj+S4lOiuvue9ruS4reWQr+eUqOS6huWFqOWxj+aYvuekulxyXG4gICAgaWYgKHRoaXMuY2hlY2tJc1RvU2hvdygpKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGFydEF1dG9IaWRlKCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gICAgdGhpcy5jbGVhckF1dG9IaWRlVGltZXIoKTtcclxuICAgIHRoaXMuc2V0dXBNb3VzZUxpc3RlbmVyKCk7XHJcbiAgICB0aGlzLmF1dG9IaWRlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZmFkZU91dCgpLCAzMDAwKTtcclxuICB9XHJcblxyXG4gIGNsZWFyQXV0b0hpZGVUaW1lcigpIHtcclxuICAgIGlmICh0aGlzLmF1dG9IaWRlVGltZXIpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYXV0b0hpZGVUaW1lcik7XHJcbiAgICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXR1cE1vdXNlTGlzdGVuZXIoKSB7XHJcbiAgICB0aGlzLnRlYXJkb3duTW91c2VMaXN0ZW5lcigpO1xyXG4gICAgdGhpcy5fYm91bmRNb3VzZU1vdmVIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcclxuICAgICAgICB0aGlzLmNsZWFyQXV0b0hpZGVUaW1lcigpO1xyXG4gICAgICAgIHRoaXMuYXV0b0hpZGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5mYWRlT3V0KCksIDMwMDApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhpcy5tZWRpYS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9ib3VuZE1vdXNlTW92ZUhhbmRsZXIpO1xyXG4gIH1cclxuXHJcbiAgdGVhcmRvd25Nb3VzZUxpc3RlbmVyKCkge1xyXG4gICAgaWYgKHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlcikge1xyXG4gICAgICB0aGlzLm1lZGlhLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlcik7XHJcbiAgICAgIHRoaXMuX2JvdW5kTW91c2VNb3ZlSGFuZGxlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmYWRlT3V0KCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlVGltZSgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IHN5c3RlbVRpbWUgPSB0aGlzLnNob3dTZWNvbmRzXHJcbiAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgIDogYCR7aG91cnN9OiR7bWludXRlc31gO1xyXG5cclxuICAgIGlmICh0aGlzLnNob3dQcm9ncmVzcykge1xyXG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMubWVkaWEuY3VycmVudFRpbWU7XHJcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBgJHtmb3JtYXRUaW1lKGN1cnJlbnRUaW1lKX0gLyAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSB8ICR7c3lzdGVtVGltZX1gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBzeXN0ZW1UaW1lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcclxuXHJcblxyXG4gICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kIGlmIG1lZGlhIGlzIGZ1bGxzY3JlZW5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgY29uc3QgZnNFbCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgICAgaWYgKGlzRnVsbCAmJiB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG5cclxuICAgIC8vIExpc3RlbiB0byBmdWxsc2NyZWVuIGNoYW5nZSBldmVudHNcclxuICAgIGNvbnN0IHVwZGF0ZVZpc2liaWxpdHlCb3VuZCA9IHRoaXMudXBkYXRlVmlzaWJpbGl0eS5iaW5kKHRoaXMpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignTVNGdWxsc2NyZWVuQ2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICB9XHJcblxyXG4gIHNldHVwU2V0dGluZ3NMaXN0ZW5lcigpIHtcclxuICAgIC8vIExpc3RlbiB0byBzdG9yYWdlIGNoYW5nZXMgdG8gdXBkYXRlIHNldHRpbmdzIGluIHJlYWwtdGltZVxyXG4gICAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBuYW1lc3BhY2UpID0+IHtcclxuICAgICAgaWYgKG5hbWVzcGFjZSA9PT0gJ3N5bmMnKSB7XHJcbiAgICAgICAgaWYgKCdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGNoYW5nZXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4ubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd09uRnVsbHNjcmVlbicgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93T25GdWxsc2NyZWVuID0gY2hhbmdlcy5zaG93T25GdWxsc2NyZWVuLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dTZWNvbmRzJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dTZWNvbmRzID0gY2hhbmdlcy5zaG93U2Vjb25kcy5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93UHJvZ3Jlc3MnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gY2hhbmdlcy5zaG93UHJvZ3Jlc3MubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnYXV0b0hpZGUnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuYXV0b0hpZGUgPSBjaGFuZ2VzLmF1dG9IaWRlLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IGV4dGVuZHMgVGltZURpc3BsYXkge1xyXG4gICAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICd3aW5kb3ctb3ZlcmxheSc7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcxMHB4JztcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIH1cclxuXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKG5vdy5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgY29uc3Qgc3lzdGVtVGltZSA9IHRoaXMuc2hvd1NlY29uZHNcclxuICAgICAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgICAgICA6IGAke2hvdXJzfToke21pbnV0ZXN9YDtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LmlubmVyVGV4dCA9IHN5c3RlbVRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tJc1RvU2hvdygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2hvd09uRnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgIT09IG51bGwgfHwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICAvLyBVcGRhdGUgdmlzaWJpbGl0eSBpbml0aWFsbHlcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxuICAgICAgICAvLyBVcGRhdGUgdGltZSBldmVyeSBzZWNvbmRcclxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xyXG4gICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZm9ybWF0VGltZSwgY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IFRpbWVEaXNwbGF5LCBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkgfSBmcm9tICcuL3dpZGdldHMnO1xyXG5cclxuY29uc29sZS5sb2coXCJoZWxsbyB3b3JsZCFcIik7XHJcblxyXG5mdW5jdGlvbiBzY2FuRm9yTWVkaWEoZG9jdW1lbnQpIHtcclxuICBjb25zdCBtZWRpYVRhZ1NlbGVjdG9yID0gJ3ZpZGVvJztcclxuICBcclxuICAvLyDikaAg5p+l5om+5pmu6YCaRE9N5Lit55qEdmlkZW8vYXVkaW/moIfnrb5cclxuICBjb25zdCByZWd1bGFyTWVkaWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG1lZGlhVGFnU2VsZWN0b3IpO1xyXG4gIFxyXG4vLyAgIC8vIOKRoSDpgJLlvZLmn6Xmib5TaGFkb3cgRE9N5Lit55qEdmlkZW/moIfnrb5cclxuLy8gICBjb25zdCBzaGFkb3dNZWRpYSA9IGZpbmRTaGFkb3dNZWRpYShkb2N1bWVudCwgbWVkaWFUYWdTZWxlY3Rvcik7XHJcbiAgXHJcbi8vICAgLy8g4pGiIOafpeaJvue9keermeeJueWumueahOinhumikeWFg+e0oFxyXG4vLyAgIGNvbnN0IHNpdGVTcGVjaWZpY01lZGlhID0gdGhpcy5zaXRlSGFuZGxlci5kZXRlY3RTcGVjaWFsVmlkZW9zKGRvY3VtZW50KTtcclxuICBcclxuLy8gICAvLyDikaMg6L+H5ruk5o6J6ZyA6KaB5b+955Wl55qE6KeG6aKRXHJcbi8vICAgcmV0dXJuIGZpbHRlcmVkTWVkaWE7XHJcbiAgICByZXR1cm4gcmVndWxhck1lZGlhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbmplY3RGb3JNZWRpYXMoKSB7XHJcbiAgY29uc3QgbWVkaWFzID0gc2NhbkZvck1lZGlhKGRvY3VtZW50KTtcclxuICBpZiAobWVkaWFzID09PSB1bmRlZmluZWQgfHwgbWVkaWFzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgY29uc29sZS53YXJuKFwiTm8gbWVkaWEgZWxlbWVudHMgZm91bmQuXCIpO1xyXG4gICAgc2V0VGltZW91dChpbmplY3RGb3JNZWRpYXMsIDIwMDApOyAvLyByZXRyeSBhZnRlciAyIHNlY29uZHNcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8g6L6T5Ye65om+5Yiw55qE5aqS5L2T5YWD57SgXHJcbiAgY29uc29sZS5sb2coXCJGb3VuZCBtZWRpYSBlbGVtZW50czpcIiwgbWVkaWFzKTtcclxuXHJcbiAgLy8g5Li65q+P5Liq5aqS5L2T5YWD57Sg5Yib5bu65pe26Ze05pi+56S6XHJcbiAgbWVkaWFzLmZvckVhY2gobWVkaWEgPT4ge1xyXG4gICAgbmV3IFRpbWVEaXNwbGF5KG1lZGlhKTtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmluamVjdEZvck1lZGlhcygpO1xyXG5jb25zdCBvdmVybGF5VGltZURpc3AgPSBuZXcgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5KGRvY3VtZW50LmJvZHkpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAvLyBpZiAoY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuKCkpIHtcclxuICAvLyAgIG92ZXJsYXlUaW1lRGlzcC5zaG93KCk7XHJcbiAgLy8gICBjb25zb2xlLmxvZygnQnJvd3NlciBpcyBpbiBmdWxsc2NyZWVuIG1vZGUnKTtcclxuICAvLyB9IGVsc2Uge1xyXG4gIC8vICAgb3ZlcmxheVRpbWVEaXNwLmhpZGUoKTtcclxuICAvLyAgIGNvbnNvbGUubG9nKCdCcm93c2VyIGlzIG5vdCBpbiBmdWxsc2NyZWVuIG1vZGUnKTtcclxuICAvLyB9XHJcbiAgb3ZlcmxheVRpbWVEaXNwLnVwZGF0ZVZpc2liaWxpdHkoKTtcclxufSk7XHJcblxyXG5cclxuIl0sIm5hbWVzIjpbImZvcm1hdFRpbWUiLCJzZWNvbmRzIiwiaXNOYU4iLCJtaW5zIiwiTWF0aCIsImZsb29yIiwic2VjcyIsImNvbmNhdCIsIlN0cmluZyIsInBhZFN0YXJ0IiwiY2hlY2tJc0Jyb3dzZXJGdWxsc2NyZWVuIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJzY3JlZW4iLCJoZWlnaHQiLCJpbm5lcldpZHRoIiwid2lkdGgiLCJUaW1lRGlzcGxheSIsIm1lZGlhIiwiX2NsYXNzQ2FsbENoZWNrIiwidGltZUVsZW1lbnQiLCJjcmVhdGVUaW1lRWxlbWVudCIsInNob3dXaGVuVmlkZW9GdWxsc2NyZWVuIiwic2hvd09uRnVsbHNjcmVlbiIsInNob3dTZWNvbmRzIiwic2hvd1Byb2dyZXNzIiwiYXV0b0hpZGUiLCJhdXRvSGlkZVRpbWVyIiwiX2JvdW5kTW91c2VNb3ZlSGFuZGxlciIsImxvYWRTZXR0aW5ncyIsInNldHVwRXZlbnRMaXN0ZW5lcnMiLCJzZXR1cFNldHRpbmdzTGlzdGVuZXIiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsIl90aGlzIiwiY2hyb21lIiwic3RvcmFnZSIsInN5bmMiLCJnZXQiLCJpdGVtcyIsInVwZGF0ZVZpc2liaWxpdHkiLCJkaXNwbGF5VHlwZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwiekluZGV4IiwidHJhbnNpdGlvbiIsImlubmVyVGV4dCIsImRpc3BsYXkiLCJjaGVja0lzVG9TaG93IiwiZnNFbCIsImZ1bGxzY3JlZW5FbGVtZW50Iiwid2Via2l0RnVsbHNjcmVlbkVsZW1lbnQiLCJtb3pGdWxsU2NyZWVuRWxlbWVudCIsIm1zRnVsbHNjcmVlbkVsZW1lbnQiLCJpc0Z1bGwiLCJjb250YWlucyIsInNob3ciLCJ1cGRhdGVUaW1lIiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwidHJhbnNmb3JtIiwicGFyZW50RWxlbWVudCIsImFwcGVuZENoaWxkIiwib3BhY2l0eSIsInN0YXJ0QXV0b0hpZGUiLCJoaWRlIiwiY2xlYXJBdXRvSGlkZVRpbWVyIiwidGVhcmRvd25Nb3VzZUxpc3RlbmVyIiwicmVtb3ZlQ2hpbGQiLCJfdGhpczIiLCJzZXR1cE1vdXNlTGlzdGVuZXIiLCJzZXRUaW1lb3V0IiwiZmFkZU91dCIsImNsZWFyVGltZW91dCIsIl90aGlzMyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibm93IiwiRGF0ZSIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsInN5c3RlbVRpbWUiLCJnZXRTZWNvbmRzIiwiY3VycmVudFRpbWUiLCJkdXJhdGlvbiIsIl90aGlzNCIsInNldEludGVydmFsIiwidXBkYXRlVmlzaWJpbGl0eUJvdW5kIiwiYmluZCIsIl90aGlzNSIsIm9uQ2hhbmdlZCIsImFkZExpc3RlbmVyIiwiY2hhbmdlcyIsIm5hbWVzcGFjZSIsIm5ld1ZhbHVlIiwiV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IiwiX1RpbWVEaXNwbGF5IiwiX2NhbGxTdXBlciIsImFyZ3VtZW50cyIsIl9pbmhlcml0cyIsImJvZHkiLCJfdGhpczYiLCJjb25zb2xlIiwibG9nIiwic2NhbkZvck1lZGlhIiwibWVkaWFUYWdTZWxlY3RvciIsInJlZ3VsYXJNZWRpYSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbmplY3RGb3JNZWRpYXMiLCJtZWRpYXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJ3YXJuIiwiZm9yRWFjaCIsIm92ZXJsYXlUaW1lRGlzcCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9