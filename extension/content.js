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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsUUFBUSxFQUFFLFlBQU07RUFDdEM7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTJCLGVBQWUsQ0FBQ3ZFLGdCQUFnQixDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0Ly4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL2VtcHR5LXByb2plY3QvLi9zcmMvd2lkZ2V0cy5qcyIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmb3JtYXQgdGltZSBpbiBzZWNvbmRzIHRvIG1tOnNzXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcclxuICAgIGlmIChpc05hTihzZWNvbmRzKSkgcmV0dXJuICcwMDowMCc7XHJcbiAgICBjb25zdCBtaW5zID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xyXG4gICAgY29uc3Qgc2VjcyA9IE1hdGguZmxvb3Ioc2Vjb25kcyAlIDYwKTtcclxuICAgIHJldHVybiBgJHtTdHJpbmcobWlucykucGFkU3RhcnQoMiwgJzAnKX06JHtTdHJpbmcoc2VjcykucGFkU3RhcnQoMiwgJzAnKX1gO1xyXG59XHJcblxyXG4vLyBjaGVjayBpZiBmdWxsc2NyZWVuIGZvciBicm93c2VyXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4oKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ID09PSBzY3JlZW4uaGVpZ2h0ICYmIHdpbmRvdy5pbm5lcldpZHRoID09PSBzY3JlZW4ud2lkdGg7XHJcbn0iLCJpbXBvcnQgeyBjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4sIGZvcm1hdFRpbWUgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUaW1lRGlzcGxheSB7XHJcbiAgY29uc3RydWN0b3IobWVkaWEpIHtcclxuICAgIHRoaXMubWVkaWEgPSBtZWRpYTtcclxuICAgIHRoaXMudGltZUVsZW1lbnQgPSB0aGlzLmNyZWF0ZVRpbWVFbGVtZW50KCk7XHJcbiAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IHRydWU7XHJcbiAgICB0aGlzLnNob3dTZWNvbmRzID0gdHJ1ZTtcclxuICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gdHJ1ZTtcclxuICAgIHRoaXMubG9hZFNldHRpbmdzKCk7XHJcbiAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIHRoaXMuc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCk7XHJcbiAgfVxyXG5cclxuICBsb2FkU2V0dGluZ3MoKSB7XHJcbiAgICAvLyDku45DaHJvbWXlrZjlgqjkuK3or7vlj5borr7nva5cclxuICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFxyXG4gICAgICB7XHJcbiAgICAgICAgc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW46IHRydWUsXHJcbiAgICAgICAgc2hvd09uRnVsbHNjcmVlbjogdHJ1ZSxcclxuICAgICAgICBzaG93U2Vjb25kczogdHJ1ZSxcclxuICAgICAgICBzaG93UHJvZ3Jlc3M6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgKGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuO1xyXG4gICAgICAgIHRoaXMuc2hvd09uRnVsbHNjcmVlbiA9IGl0ZW1zLnNob3dPbkZ1bGxzY3JlZW47XHJcbiAgICAgICAgdGhpcy5zaG93U2Vjb25kcyA9IGl0ZW1zLnNob3dTZWNvbmRzO1xyXG4gICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzID0gaXRlbXMuc2hvd1Byb2dyZXNzO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICByZXR1cm4gJ21lZGlhJztcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpbWVFbGVtZW50KCkge1xyXG4gICAgY29uc3QgdGltZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICc1cHgnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIHRpbWVFbGVtZW50LmlubmVyVGV4dCA9ICcwMDowMCAvIDAwOjAwJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICByZXR1cm4gdGltZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgaWYgKCF0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgIGNvbnN0IGlzRnVsbCA9IGZzRWwgJiYgKGZzRWwgPT09IHRoaXMubWVkaWEgfHwgZnNFbC5jb250YWlucyh0aGlzLm1lZGlhKSB8fCB0aGlzLm1lZGlhLmNvbnRhaW5zKGZzRWwpKTtcclxuICAgIHJldHVybiBpc0Z1bGw7XHJcbiAgfVxyXG5cclxuICBzaG93KCkge1xyXG4gICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudG9wID0gJzEwcHgnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVYKC01MCUpJztcclxuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IHRoaXMubWVkaWEucGFyZW50RWxlbWVudCkge1xyXG4gICAgICB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICB9XHJcblxyXG4gIGhpZGUoKSB7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICBpZiAodGhpcy50aW1lRWxlbWVudC5wYXJlbnRFbGVtZW50ID09PSB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlVmlzaWJpbGl0eSgpIHtcclxuICAgIC8vIOajgOafpeaYr+WQpuWcqOWFqOWxj+S4lOiuvue9ruS4reWQr+eUqOS6huWFqOWxj+aYvuekulxyXG4gICAgaWYgKHRoaXMuY2hlY2tJc1RvU2hvdygpKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUaW1lKCkge1xyXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgbWludXRlcyA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3Qgc3lzdGVtVGltZSA9IHRoaXMuc2hvd1NlY29uZHNcclxuICAgICAgPyBgJHtob3Vyc306JHttaW51dGVzfToke1N0cmluZyhub3cuZ2V0U2Vjb25kcygpKS5wYWRTdGFydCgyLCAnMCcpfWBcclxuICAgICAgOiBgJHtob3Vyc306JHttaW51dGVzfWA7XHJcblxyXG4gICAgaWYgKHRoaXMuc2hvd1Byb2dyZXNzKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gdGhpcy5tZWRpYS5jdXJyZW50VGltZTtcclxuICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLm1lZGlhLmR1cmF0aW9uO1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmlubmVyVGV4dCA9IGAke2Zvcm1hdFRpbWUoY3VycmVudFRpbWUpfSAvICR7Zm9ybWF0VGltZShkdXJhdGlvbil9IHwgJHtzeXN0ZW1UaW1lfWA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRpbWVFbGVtZW50LmlubmVyVGV4dCA9IHN5c3RlbVRpbWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xyXG5cclxuXHJcbiAgICAvLyBVcGRhdGUgdGltZSBldmVyeSBzZWNvbmQgaWYgbWVkaWEgaXMgZnVsbHNjcmVlblxyXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBjb25zdCBmc0VsID0gZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudDtcclxuICAgICAgY29uc3QgaXNGdWxsID0gZnNFbCAmJiAoZnNFbCA9PT0gdGhpcy5tZWRpYSB8fCBmc0VsLmNvbnRhaW5zKHRoaXMubWVkaWEpIHx8IHRoaXMubWVkaWEuY29udGFpbnMoZnNFbCkpO1xyXG4gICAgICBpZiAoaXNGdWxsICYmIHRoaXMuc2hvd1doZW5WaWRlb0Z1bGxzY3JlZW4pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgLy8gTGlzdGVuIHRvIGZ1bGxzY3JlZW4gY2hhbmdlIGV2ZW50c1xyXG4gICAgY29uc3QgdXBkYXRlVmlzaWJpbGl0eUJvdW5kID0gdGhpcy51cGRhdGVWaXNpYmlsaXR5LmJpbmQodGhpcyk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96ZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdNU0Z1bGxzY3JlZW5DaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gIH1cclxuXHJcbiAgc2V0dXBTZXR0aW5nc0xpc3RlbmVyKCkge1xyXG4gICAgLy8gTGlzdGVuIHRvIHN0b3JhZ2UgY2hhbmdlcyB0byB1cGRhdGUgc2V0dGluZ3MgaW4gcmVhbC10aW1lXHJcbiAgICBjaHJvbWUuc3RvcmFnZS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoKGNoYW5nZXMsIG5hbWVzcGFjZSkgPT4ge1xyXG4gICAgICBpZiAobmFtZXNwYWNlID09PSAnc3luYycpIHtcclxuICAgICAgICBpZiAoJ3Nob3dXaGVuVmlkZW9GdWxsc2NyZWVuJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dXaGVuVmlkZW9GdWxsc2NyZWVuID0gY2hhbmdlcy5zaG93V2hlblZpZGVvRnVsbHNjcmVlbi5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdzaG93T25GdWxsc2NyZWVuJyBpbiBjaGFuZ2VzKSB7XHJcbiAgICAgICAgICB0aGlzLnNob3dPbkZ1bGxzY3JlZW4gPSBjaGFuZ2VzLnNob3dPbkZ1bGxzY3JlZW4ubmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgnc2hvd1NlY29uZHMnIGluIGNoYW5nZXMpIHtcclxuICAgICAgICAgIHRoaXMuc2hvd1NlY29uZHMgPSBjaGFuZ2VzLnNob3dTZWNvbmRzLm5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ3Nob3dQcm9ncmVzcycgaW4gY2hhbmdlcykge1xyXG4gICAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MgPSBjaGFuZ2VzLnNob3dQcm9ncmVzcy5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheSBleHRlbmRzIFRpbWVEaXNwbGF5IHtcclxuICAgIGRpc3BsYXlUeXBlKCkge1xyXG4gICAgICAgIHJldHVybiAnd2luZG93LW92ZXJsYXknO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUaW1lKCkge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3QgaG91cnMgPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgY29uc3QgbWludXRlcyA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgIGNvbnN0IHN5c3RlbVRpbWUgPSB0aGlzLnNob3dTZWNvbmRzXHJcbiAgICAgICAgICA/IGAke2hvdXJzfToke21pbnV0ZXN9OiR7U3RyaW5nKG5vdy5nZXRTZWNvbmRzKCkpLnBhZFN0YXJ0KDIsICcwJyl9YFxyXG4gICAgICAgICAgOiBgJHtob3Vyc306JHttaW51dGVzfWA7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBzeXN0ZW1UaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrSXNUb1Nob3coKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNob3dPbkZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ICE9PSBudWxsIHx8IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIHZpc2liaWxpdHkgaW5pdGlhbGx5XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZvcm1hdFRpbWUsIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBUaW1lRGlzcGxheSwgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IH0gZnJvbSAnLi93aWRnZXRzJztcclxuXHJcbmNvbnNvbGUubG9nKFwiaGVsbG8gd29ybGQhXCIpO1xyXG5cclxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKGRvY3VtZW50KSB7XHJcbiAgY29uc3QgbWVkaWFUYWdTZWxlY3RvciA9ICd2aWRlbyc7XHJcbiAgXHJcbiAgLy8g4pGgIOafpeaJvuaZrumAmkRPTeS4reeahHZpZGVvL2F1ZGlv5qCH562+XHJcbiAgY29uc3QgcmVndWxhck1lZGlhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChtZWRpYVRhZ1NlbGVjdG9yKTtcclxuICBcclxuLy8gICAvLyDikaEg6YCS5b2S5p+l5om+U2hhZG93IERPTeS4reeahHZpZGVv5qCH562+XHJcbi8vICAgY29uc3Qgc2hhZG93TWVkaWEgPSBmaW5kU2hhZG93TWVkaWEoZG9jdW1lbnQsIG1lZGlhVGFnU2VsZWN0b3IpO1xyXG4gIFxyXG4vLyAgIC8vIOKRoiDmn6Xmib7nvZHnq5nnibnlrprnmoTop4bpopHlhYPntKBcclxuLy8gICBjb25zdCBzaXRlU3BlY2lmaWNNZWRpYSA9IHRoaXMuc2l0ZUhhbmRsZXIuZGV0ZWN0U3BlY2lhbFZpZGVvcyhkb2N1bWVudCk7XHJcbiAgXHJcbi8vICAgLy8g4pGjIOi/h+a7pOaOiemcgOimgeW/veeVpeeahOinhumikVxyXG4vLyAgIHJldHVybiBmaWx0ZXJlZE1lZGlhO1xyXG4gICAgcmV0dXJuIHJlZ3VsYXJNZWRpYTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5qZWN0Rm9yTWVkaWFzKCkge1xyXG4gIGNvbnN0IG1lZGlhcyA9IHNjYW5Gb3JNZWRpYShkb2N1bWVudCk7XHJcbiAgaWYgKG1lZGlhcyA9PT0gdW5kZWZpbmVkIHx8IG1lZGlhcy5sZW5ndGggPT09IDApIHtcclxuICAgIGNvbnNvbGUud2FybihcIk5vIG1lZGlhIGVsZW1lbnRzIGZvdW5kLlwiKTtcclxuICAgIHNldFRpbWVvdXQoaW5qZWN0Rm9yTWVkaWFzLCAyMDAwKTsgLy8gcmV0cnkgYWZ0ZXIgMiBzZWNvbmRzXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIOi+k+WHuuaJvuWIsOeahOWqkuS9k+WFg+e0oFxyXG4gIGNvbnNvbGUubG9nKFwiRm91bmQgbWVkaWEgZWxlbWVudHM6XCIsIG1lZGlhcyk7XHJcblxyXG4gIC8vIOS4uuavj+S4quWqkuS9k+WFg+e0oOWIm+W7uuaXtumXtOaYvuekulxyXG4gIG1lZGlhcy5mb3JFYWNoKG1lZGlhID0+IHtcclxuICAgIG5ldyBUaW1lRGlzcGxheShtZWRpYSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5pbmplY3RGb3JNZWRpYXMoKTtcclxuY29uc3Qgb3ZlcmxheVRpbWVEaXNwID0gbmV3IFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheShkb2N1bWVudC5ib2R5KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgLy8gaWYgKGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpKSB7XHJcbiAgLy8gICBvdmVybGF5VGltZURpc3Auc2hvdygpO1xyXG4gIC8vICAgY29uc29sZS5sb2coJ0Jyb3dzZXIgaXMgaW4gZnVsbHNjcmVlbiBtb2RlJyk7XHJcbiAgLy8gfSBlbHNlIHtcclxuICAvLyAgIG92ZXJsYXlUaW1lRGlzcC5oaWRlKCk7XHJcbiAgLy8gICBjb25zb2xlLmxvZygnQnJvd3NlciBpcyBub3QgaW4gZnVsbHNjcmVlbiBtb2RlJyk7XHJcbiAgLy8gfVxyXG4gIG92ZXJsYXlUaW1lRGlzcC51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbn0pO1xyXG5cclxuXHJcbiJdLCJuYW1lcyI6WyJmb3JtYXRUaW1lIiwic2Vjb25kcyIsImlzTmFOIiwibWlucyIsIk1hdGgiLCJmbG9vciIsInNlY3MiLCJjb25jYXQiLCJTdHJpbmciLCJwYWRTdGFydCIsImNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiIsIndpbmRvdyIsImlubmVySGVpZ2h0Iiwic2NyZWVuIiwiaGVpZ2h0IiwiaW5uZXJXaWR0aCIsIndpZHRoIiwiVGltZURpc3BsYXkiLCJtZWRpYSIsIl9jbGFzc0NhbGxDaGVjayIsInRpbWVFbGVtZW50IiwiY3JlYXRlVGltZUVsZW1lbnQiLCJzaG93V2hlblZpZGVvRnVsbHNjcmVlbiIsInNob3dPbkZ1bGxzY3JlZW4iLCJzaG93U2Vjb25kcyIsInNob3dQcm9ncmVzcyIsImxvYWRTZXR0aW5ncyIsInNldHVwRXZlbnRMaXN0ZW5lcnMiLCJzZXR1cFNldHRpbmdzTGlzdGVuZXIiLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsIl90aGlzIiwiY2hyb21lIiwic3RvcmFnZSIsInN5bmMiLCJnZXQiLCJpdGVtcyIsInVwZGF0ZVZpc2liaWxpdHkiLCJkaXNwbGF5VHlwZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwiekluZGV4IiwiaW5uZXJUZXh0IiwiZGlzcGxheSIsImNoZWNrSXNUb1Nob3ciLCJmc0VsIiwiZnVsbHNjcmVlbkVsZW1lbnQiLCJ3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCIsIm1vekZ1bGxTY3JlZW5FbGVtZW50IiwibXNGdWxsc2NyZWVuRWxlbWVudCIsImlzRnVsbCIsImNvbnRhaW5zIiwic2hvdyIsInVwZGF0ZVRpbWUiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJwYXJlbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJoaWRlIiwicmVtb3ZlQ2hpbGQiLCJub3ciLCJEYXRlIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwic3lzdGVtVGltZSIsImdldFNlY29uZHMiLCJjdXJyZW50VGltZSIsImR1cmF0aW9uIiwiX3RoaXMyIiwic2V0SW50ZXJ2YWwiLCJ1cGRhdGVWaXNpYmlsaXR5Qm91bmQiLCJiaW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl90aGlzMyIsIm9uQ2hhbmdlZCIsImFkZExpc3RlbmVyIiwiY2hhbmdlcyIsIm5hbWVzcGFjZSIsIm5ld1ZhbHVlIiwiV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IiwiX1RpbWVEaXNwbGF5IiwiX2NhbGxTdXBlciIsImFyZ3VtZW50cyIsIl9pbmhlcml0cyIsImJvZHkiLCJfdGhpczQiLCJjb25zb2xlIiwibG9nIiwic2NhbkZvck1lZGlhIiwibWVkaWFUYWdTZWxlY3RvciIsInJlZ3VsYXJNZWRpYSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbmplY3RGb3JNZWRpYXMiLCJtZWRpYXMiLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJ3YXJuIiwic2V0VGltZW91dCIsImZvckVhY2giLCJvdmVybGF5VGltZURpc3AiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==