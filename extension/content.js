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
        showProgress: true
      }, function (items) {
        _this.showWhenVideoFullscreen = items.showWhenVideoFullscreen;
        _this.showOnFullscreen = items.showOnFullscreen;
        _this.showSeconds = items.showSeconds;
        _this.showProgress = items.showProgress;
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
      this.timeElement.style.position = 'absolute';
      this.timeElement.style.top = '10px';
      this.timeElement.style.left = '50%';
      this.timeElement.style.transform = 'translateX(-50%)';
      if (this.timeElement.parentElement !== this.media.parentElement) {
        this.media.parentElement.appendChild(this.timeElement);
      }
      this.timeElement.style.display = 'block';
      this.timeElement.style.zIndex = '999999';
    }
  }, {
    key: "hide",
    value: function hide() {
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
      var _this2 = this;
      // Update time every second if media is fullscreen
      setInterval(function () {
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        var isFull = fsEl && (fsEl === _this2.media || fsEl.contains(_this2.media) || _this2.media.contains(fsEl));
        if (isFull && _this2.showWhenVideoFullscreen) {
          _this2.updateTime();
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
      var _this3 = this;
      // Listen to storage changes to update settings in real-time
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'sync') {
          if ('showWhenVideoFullscreen' in changes) {
            _this3.showWhenVideoFullscreen = changes.showWhenVideoFullscreen.newValue;
          }
          if ('showOnFullscreen' in changes) {
            _this3.showOnFullscreen = changes.showOnFullscreen.newValue;
          }
          if ('showSeconds' in changes) {
            _this3.showSeconds = changes.showSeconds.newValue;
          }
          if ('showProgress' in changes) {
            _this3.showProgress = changes.showProgress.newValue;
          }
          _this3.updateVisibility();
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
      var _this4 = this;
      // Update visibility initially
      this.updateVisibility();
      // Update time every second
      setInterval(function () {
        _this4.updateTime();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQ3ZFLGdCQUFnQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0Ly4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2VtcHR5LXByb2plY3QvLi9zcmMvd2lkZ2V0cy5qcyIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmb3JtYXQgdGltZSBpbiBzZWNvbmRzIHRvIG1tOnNzXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcclxuICAgIGlmIChpc05hTihzZWNvbmRzKSkgcmV0dXJuICcwMDowMCc7XHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgY29uc3Qgc2VjcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcclxuICAgIHJldHVybiBgJHtTdHJpbmcobWlucykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcoc2VjcykucGFkU3RhcnQoMiwgJzAnKX1gO1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBmdWxsc2NyZWVuIGZvciBicm93c2VyXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ID09PSBzY3JlZW4uaGVpZ2h0ICYmIHdpbmRvdy5pbm5lcldpZHRoID09PSBzY3JlZW4ud2lkdGg7XHJcbn0iLCJpbXBvcnQgeyBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4sIGZvcm1hdFRpbWUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaW1lRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IobWVkaWEpIHtcclxuICAgIHRoaXMubWVkaWEgPSBtZWRpYTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRpbWVFbGVtZW50KCk7XHJcbiAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dTZWNvbmRzID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gdHJ1ZTtcclxuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAvLyDku45DaHJvbWXlrZjlgqjkuK3or7vlj5borr7nva5cclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgICB7XHJcbiAgICAgICAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXHJcbiAgICAgICAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcclxuICAgICAgICBzaG93U2Vjb25kczogdHJ1ZSxcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuO1xyXG4gICAgICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dPbkZ1bGxzY3JlZW47XHJcbiAgICAgICAgdGhpcy5zaG93U2Vjb25kcyA9IGl0ZW1zLnNob3dTZWNvbmRzO1xyXG4gICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gaXRlbXMuc2hvd1Byb2dyZXNzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICByZXR1cm4gJ21lZGlhJztcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpbWVFbGVtZW50KCkge1xyXG4gICAgY29uc3QgdGltZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICc1cHgnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIHRpbWVFbGVtZW50LmlubmVyVGV4dCA9ICcwMDowMCAvIDAwOjAwJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICByZXR1cm4gdGltZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgaWYgKCF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgIHJldHVybiBpc0Z1bGw7XHJcbiAgfVxyXG5cclxuICBzaG93KCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRvcCA9ICcxMHB4JztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XHJcbiAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcbiAgfVxyXG5cclxuICBoaWRlKCkge1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCA9PT0gdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMubWVkaWEucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XHJcbiAgICAvLyDmo4Dmn6XmmK/lkKblnKjlhajlsY/kuJTorr7nva7kuK3lkK/nlKjkuoblhajlsY/mmL7npLpcclxuICAgIGlmICh0aGlzLmNoZWNrSXNUb1Nob3coKSkge1xyXG4gICAgICB0aGlzLnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlVGltZSgpIHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IHN5c3RlbVRpbWUgPSB0aGlzLnNob3dTZWNvbmRzXHJcbiAgICAgID8gYCR7aG91cnN9OiR7bWludXRlc306JHtTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgIDogYCR7aG91cnN9OiR7bWludXRlc31gO1xyXG5cclxuICAgIGlmICh0aGlzLnNob3dQcm9ncmVzcykge1xyXG4gICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRoaXMubWVkaWEuY3VycmVudFRpbWU7XHJcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5tZWRpYS5kdXJhdGlvbjtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBgJHtmb3JtYXRUaW1lKGN1cnJlbnRUaW1lKX0gLyAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfSB8ICR7c3lzdGVtVGltZX1gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBzeXN0ZW1UaW1lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0dXBFdmVudExpc3RlbmVycygpIHtcclxuXHJcblxyXG4gICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kIGlmIG1lZGlhIGlzIGZ1bGxzY3JlZW5cclxuICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgY29uc3QgZnNFbCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgICAgaWYgKGlzRnVsbCAmJiB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG5cclxuICAgIC8vIExpc3RlbiB0byBmdWxsc2NyZWVuIGNoYW5nZSBldmVudHNcclxuICAgIGNvbnN0IHVwZGF0ZVZpc2liaWxpdHlCb3VuZCA9IHRoaXMudXBkYXRlVmlzaWJpbGl0eS5iaW5kKHRoaXMpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignTVNGdWxsc2NyZWVuQ2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICB9XHJcblxyXG4gIHNldHVwU2V0dGluZ3NMaXN0ZW5lcigpIHtcclxuICAgIC8vIExpc3RlbiB0byBzdG9yYWdlIGNoYW5nZXMgdG8gdXBkYXRlIHNldHRpbmdzIGluIHJlYWwtdGltZVxyXG4gICAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBuYW1lc3BhY2UpID0+IHtcclxuICAgICAgaWYgKG5hbWVzcGFjZSA9PT0gJ3N5bmMnKSB7XHJcbiAgICAgICAgaWYgKCdzaG93V2hlblZpZGVvRnVsbHNjcmVlbicgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGNoYW5nZXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4ubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd09uRnVsbHNjcmVlbicgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93T25GdWxsc2NyZWVuID0gY2hhbmdlcy5zaG93T25GdWxsc2NyZWVuLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dTZWNvbmRzJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dTZWNvbmRzID0gY2hhbmdlcy5zaG93U2Vjb25kcy5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93UHJvZ3Jlc3MnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gY2hhbmdlcy5zaG93UHJvZ3Jlc3MubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkgZXh0ZW5kcyBUaW1lRGlzcGxheSB7XHJcbiAgICBkaXNwbGF5VHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gJ3dpbmRvdy1vdmVybGF5JztcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gJzEwcHgnO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IGRvY3VtZW50LmJvZHkpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGltZSgpIHtcclxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBzeXN0ZW1UaW1lID0gdGhpcy5zaG93U2Vjb25kc1xyXG4gICAgICAgICAgPyBgJHtob3Vyc306JHttaW51dGVzfToke1N0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCAnMCcpfWBcclxuICAgICAgICAgIDogYCR7aG91cnN9OiR7bWludXRlc31gO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuaW5uZXJUZXh0ID0gc3lzdGVtVGltZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zaG93T25GdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCAhPT0gbnVsbCB8fCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIC8vIFVwZGF0ZSB2aXNpYmlsaXR5IGluaXRpYWxseVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICAgIC8vIFVwZGF0ZSB0aW1lIGV2ZXJ5IHNlY29uZFxyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBmb3JtYXRUaW1lLCBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgVGltZURpc3BsYXksIFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheSB9IGZyb20gJy4vd2lkZ2V0cyc7XHJcblxyXG5jb25zb2xlLmxvZyhcImhlbGxvIHdvcmxkIVwiKTtcclxuXHJcbmZ1bmN0aW9uIHNjYW5Gb3JNZWRpYShkb2N1bWVudCkge1xyXG4gIGNvbnN0IG1lZGlhVGFnU2VsZWN0b3IgPSAndmlkZW8nO1xyXG4gIFxyXG4gIC8vIOKRoCDmn6Xmib7mma7pgJpET03kuK3nmoR2aWRlby9hdWRpb+agh+etvlxyXG4gIGNvbnN0IHJlZ3VsYXJNZWRpYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwobWVkaWFUYWdTZWxlY3Rvcik7XHJcbiAgXHJcbi8vICAgLy8g4pGhIOmAkuW9kuafpeaJvlNoYWRvdyBET03kuK3nmoR2aWRlb+agh+etvlxyXG4vLyAgIGNvbnN0IHNoYWRvd01lZGlhID0gZmluZFNoYWRvd01lZGlhKGRvY3VtZW50LCBtZWRpYVRhZ1NlbGVjdG9yKTtcclxuICBcclxuLy8gICAvLyDikaIg5p+l5om+572R56uZ54m55a6a55qE6KeG6aKR5YWD57SgXHJcbi8vICAgY29uc3Qgc2l0ZVNwZWNpZmljTWVkaWEgPSB0aGlzLnNpdGVIYW5kbGVyLmRldGVjdFNwZWNpYWxWaWRlb3MoZG9jdW1lbnQpO1xyXG4gIFxyXG4vLyAgIC8vIOKRoyDov4fmu6TmjonpnIDopoHlv73nlaXnmoTop4bpopFcclxuLy8gICByZXR1cm4gZmlsdGVyZWRNZWRpYTtcclxuICAgIHJldHVybiByZWd1bGFyTWVkaWE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluamVjdEZvck1lZGlhcygpIHtcclxuICBjb25zdCBtZWRpYXMgPSBzY2FuRm9yTWVkaWEoZG9jdW1lbnQpO1xyXG4gIGlmIChtZWRpYXMgPT09IHVuZGVmaW5lZCB8fCBtZWRpYXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICBjb25zb2xlLndhcm4oXCJObyBtZWRpYSBlbGVtZW50cyBmb3VuZC5cIik7XHJcbiAgICBzZXRUaW1lb3V0KGluamVjdEZvck1lZGlhcywgMjAwMCk7IC8vIHJldHJ5IGFmdGVyIDIgc2Vjb25kc1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyDovpPlh7rmib7liLDnmoTlqpLkvZPlhYPntKBcclxuICBjb25zb2xlLmxvZyhcIkZvdW5kIG1lZGlhIGVsZW1lbnRzOlwiLCBtZWRpYXMpO1xyXG5cclxuICAvLyDkuLrmr4/kuKrlqpLkvZPlhYPntKDliJvlu7rml7bpl7TmmL7npLpcclxuICBtZWRpYXMuZm9yRWFjaChtZWRpYSA9PiB7XHJcbiAgICBuZXcgVGltZURpc3BsYXkobWVkaWEpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuaW5qZWN0Rm9yTWVkaWFzKCk7XHJcbmNvbnN0IG92ZXJsYXlUaW1lRGlzcCA9IG5ldyBXaW5kb3dPdmVybGF5VGltZURpc3BsYXkoZG9jdW1lbnQuYm9keSk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gIC8vIGlmIChjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSkge1xyXG4gIC8vICAgb3ZlcmxheVRpbWVEaXNwLnNob3coKTtcclxuICAvLyAgIGNvbnNvbGUubG9nKCdCcm93c2VyIGlzIGluIGZ1bGxzY3JlZW4gbW9kZScpO1xyXG4gIC8vIH0gZWxzZSB7XHJcbiAgLy8gICBvdmVybGF5VGltZURpc3AuaGlkZSgpO1xyXG4gIC8vICAgY29uc29sZS5sb2coJ0Jyb3dzZXIgaXMgbm90IGluIGZ1bGxzY3JlZW4gbW9kZScpO1xyXG4gIC8vIH1cclxuICBvdmVybGF5VGltZURpc3AudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG59KTtcclxuXHJcblxyXG4iXSwibmFtZXMiOlsiZm9ybWF0VGltZSIsInNlY29uZHMiLCJpc05hTiIsIm1pbnMiLCJNYXRoIiwiZmxvb3IiLCJzZWNzIiwiY29uY2F0IiwiU3RyaW5nIiwicGFkU3RhcnQiLCJjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInNjcmVlbiIsImhlaWdodCIsImlubmVyV2lkdGgiLCJ3aWR0aCIsIlRpbWVEaXNwbGF5IiwibWVkaWEiLCJfY2xhc3NDYWxsQ2hlY2siLCJ0aW1lRWxlbWVudCIsImNyZWF0ZVRpbWVFbGVtZW50Iiwic2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4iLCJzaG93T25GdWxsc2NyZWVuIiwic2hvd1NlY29uZHMiLCJzaG93UHJvZ3Jlc3MiLCJsb2FkU2V0dGluZ3MiLCJzZXR1cEV2ZW50TGlzdGVuZXJzIiwic2V0dXBTZXR0aW5nc0xpc3RlbmVyIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJfdGhpcyIsImNocm9tZSIsInN0b3JhZ2UiLCJzeW5jIiwiZ2V0IiwiaXRlbXMiLCJ1cGRhdGVWaXNpYmlsaXR5IiwiZGlzcGxheVR5cGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInpJbmRleCIsImlubmVyVGV4dCIsImRpc3BsYXkiLCJjaGVja0lzVG9TaG93IiwiZnNFbCIsImZ1bGxzY3JlZW5FbGVtZW50Iiwid2Via2l0RnVsbHNjcmVlbkVsZW1lbnQiLCJtb3pGdWxsU2NyZWVuRWxlbWVudCIsIm1zRnVsbHNjcmVlbkVsZW1lbnQiLCJpc0Z1bGwiLCJjb250YWlucyIsInNob3ciLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJwYXJlbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJoaWRlIiwicmVtb3ZlQ2hpbGQiLCJ1cGRhdGVUaW1lIiwibm93IiwiRGF0ZSIsImhvdXJzIiwiZ2V0SG91cnMiLCJtaW51dGVzIiwiZ2V0TWludXRlcyIsInN5c3RlbVRpbWUiLCJnZXRTZWNvbmRzIiwiY3VycmVudFRpbWUiLCJkdXJhdGlvbiIsIl90aGlzMiIsInNldEludGVydmFsIiwidXBkYXRlVmlzaWJpbGl0eUJvdW5kIiwiYmluZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfdGhpczMiLCJvbkNoYW5nZWQiLCJhZGRMaXN0ZW5lciIsImNoYW5nZXMiLCJuYW1lc3BhY2UiLCJuZXdWYWx1ZSIsIldpbmRvd092ZXJsYXlUaW1lRGlzcGxheSIsIl9UaW1lRGlzcGxheSIsIl9jYWxsU3VwZXIiLCJhcmd1bWVudHMiLCJfaW5oZXJpdHMiLCJib2R5IiwiX3RoaXM0IiwiY29uc29sZSIsImxvZyIsInNjYW5Gb3JNZWRpYSIsIm1lZGlhVGFnU2VsZWN0b3IiLCJyZWd1bGFyTWVkaWEiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5qZWN0Rm9yTWVkaWFzIiwibWVkaWFzIiwidW5kZWZpbmVkIiwibGVuZ3RoIiwid2FybiIsInNldFRpbWVvdXQiLCJmb3JFYWNoIiwib3ZlcmxheVRpbWVEaXNwIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=