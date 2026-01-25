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
    this.setupEventListeners();
  }
  return _createClass(TimeDisplay, [{
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
      if (this.checkIsToShow()) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: "updateTime",
    value: function updateTime() {
      var currentTime = this.media.currentTime;
      var duration = this.media.duration;
      this.timeElement.innerText = "".concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(currentTime), " / ").concat((0,_utils__WEBPACK_IMPORTED_MODULE_0__.formatTime)(duration));
      var now = new Date();
      var hours = String(now.getHours()).padStart(2, '0');
      var minutes = String(now.getMinutes()).padStart(2, '0');
      var seconds = String(now.getSeconds()).padStart(2, '0');
      var systemTime = "".concat(hours, ":").concat(minutes, ":").concat(seconds);
      this.timeElement.innerText += " | ".concat(systemTime);
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this = this;
      // Update visibility initially
      this.updateVisibility();

      // Update time every second if media is fullscreen
      setInterval(function () {
        var fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        var isFull = fsEl && (fsEl === _this.media || fsEl.contains(_this.media) || _this.media.contains(fsEl));
        if (isFull) {
          _this.updateTime();
        }
      }, 1000);

      // Listen to fullscreen change events
      var updateVisibilityBound = this.updateVisibility.bind(this);
      document.addEventListener('fullscreenchange', updateVisibilityBound);
      document.addEventListener('webkitfullscreenchange', updateVisibilityBound);
      document.addEventListener('mozfullscreenchange', updateVisibilityBound);
      document.addEventListener('MSFullscreenChange', updateVisibilityBound);
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
      var seconds = String(now.getSeconds()).padStart(2, '0');
      var systemTime = "".concat(hours, ":").concat(minutes, ":").concat(seconds);
      this.timeElement.innerText = systemTime;
    }
  }, {
    key: "checkIsToShow",
    value: function checkIsToShow() {
      return document.fullscreenElement !== null || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)();
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;
      // Update visibility initially
      this.updateVisibility();
      // Update time every second
      setInterval(function () {
        _this2.updateTime();
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
  if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkIsBrowserFullscreen)()) {
    overlayTimeDisp.show();
    console.log('Browser is in fullscreen mode');
  } else {
    overlayTimeDisp.hide();
    console.log('Browser is not in fullscreen mode');
  }
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNqQixJQUFNTyxlQUFlLEdBQUcsSUFBSXBCLDhEQUF3QixDQUFDNUMsUUFBUSxDQUFDaUQsSUFBSSxDQUFDO0FBRW5FakUsTUFBTSxDQUFDMkQsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07RUFDdEMsSUFBSTVELGdFQUF3QixDQUFDLENBQUMsRUFBRTtJQUM5QmlGLGVBQWUsQ0FBQzlDLElBQUksQ0FBQyxDQUFDO0lBQ3RCaUMsT0FBTyxDQUFDQyxHQUFHLENBQUMsK0JBQStCLENBQUM7RUFDOUMsQ0FBQyxNQUFNO0lBQ0xZLGVBQWUsQ0FBQ3ZDLElBQUksQ0FBQyxDQUFDO0lBQ3RCMEIsT0FBTyxDQUFDQyxHQUFHLENBQUMsbUNBQW1DLENBQUM7RUFDbEQ7QUFDRixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2VtcHR5LXByb2plY3QvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC8uL3NyYy93aWRnZXRzLmpzIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZW1wdHktcHJvamVjdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2VtcHR5LXByb2plY3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9lbXB0eS1wcm9qZWN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGZvcm1hdCB0aW1lIGluIHNlY29uZHMgdG8gbW06c3NcclxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xyXG4gICAgaWYgKGlzTmFOKHNlY29uZHMpKSByZXR1cm4gJzAwOjAwJztcclxuICAgIGNvbnN0IG1pbnMgPSBNYXRoLmZsb29yKHNlY29uZHMgLyA2MCk7XHJcbiAgICBjb25zdCBzZWNzID0gTWF0aC5mbG9vcihzZWNvbmRzICUgNjApO1xyXG4gICAgcmV0dXJuIGAke1N0cmluZyhtaW5zKS5wYWRTdGFydCgyLCAnMCcpfToke1N0cmluZyhzZWNzKS5wYWRTdGFydCgyLCAnMCcpfWA7XHJcbn1cclxuXHJcbi8vIGNoZWNrIGlmIGZ1bGxzY3JlZW4gZm9yIGJyb3dzZXJcclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpIHtcclxuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgPT09IHNjcmVlbi5oZWlnaHQgJiYgd2luZG93LmlubmVyV2lkdGggPT09IHNjcmVlbi53aWR0aDtcclxufSIsImltcG9ydCB7IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiwgZm9ybWF0VGltZSB9IGZyb20gJy4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRpbWVEaXNwbGF5IHtcclxuICBjb25zdHJ1Y3RvcihtZWRpYSkge1xyXG4gICAgdGhpcy5tZWRpYSA9IG1lZGlhO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudCA9IHRoaXMuY3JlYXRlVGltZUVsZW1lbnQoKTtcclxuICAgIHRoaXMuc2V0dXBFdmVudExpc3RlbmVycygpO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVR5cGUoKSB7XHJcbiAgICByZXR1cm4gJ21lZGlhJztcclxuICB9XHJcblxyXG4gIGNyZWF0ZVRpbWVFbGVtZW50KCkge1xyXG4gICAgY29uc3QgdGltZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuNSknO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICc1cHgnO1xyXG4gICAgdGltZUVsZW1lbnQuc3R5bGUuYm9yZGVyUmFkaXVzID0gJzVweCc7XHJcbiAgICB0aW1lRWxlbWVudC5zdHlsZS56SW5kZXggPSAnOTk5OTk5JztcclxuICAgIHRpbWVFbGVtZW50LmlubmVyVGV4dCA9ICcwMDowMCAvIDAwOjAwJztcclxuICAgIHRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICByZXR1cm4gdGltZUVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBjaGVja0lzVG9TaG93KCkge1xyXG4gICAgY29uc3QgZnNFbCA9IGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1zRnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBpc0Z1bGwgPSBmc0VsICYmIChmc0VsID09PSB0aGlzLm1lZGlhIHx8IGZzRWwuY29udGFpbnModGhpcy5tZWRpYSkgfHwgdGhpcy5tZWRpYS5jb250YWlucyhmc0VsKSk7XHJcbiAgICByZXR1cm4gaXNGdWxsO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpIHtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoLTUwJSknO1xyXG4gICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gdGhpcy5tZWRpYS5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMubWVkaWEucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRpbWVFbGVtZW50KTtcclxuICAgIH1cclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLnpJbmRleCA9ICc5OTk5OTknO1xyXG4gIH1cclxuXHJcbiAgaGlkZSgpIHtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIGlmICh0aGlzLnRpbWVFbGVtZW50LnBhcmVudEVsZW1lbnQgPT09IHRoaXMubWVkaWEucGFyZW50RWxlbWVudCkge1xyXG4gICAgICB0aGlzLm1lZGlhLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50aW1lRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVWaXNpYmlsaXR5KCkge1xyXG4gICAgaWYgKHRoaXMuY2hlY2tJc1RvU2hvdygpKSB7XHJcbiAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUaW1lKCkge1xyXG4gICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLm1lZGlhLmN1cnJlbnRUaW1lO1xyXG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLm1lZGlhLmR1cmF0aW9uO1xyXG4gICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBgJHtmb3JtYXRUaW1lKGN1cnJlbnRUaW1lKX0gLyAke2Zvcm1hdFRpbWUoZHVyYXRpb24pfWA7XHJcbiAgICBcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhub3cuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IHNlY29uZHMgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IHN5c3RlbVRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzfToke3NlY29uZHN9YDtcclxuICAgIHRoaXMudGltZUVsZW1lbnQuaW5uZXJUZXh0ICs9IGAgfCAke3N5c3RlbVRpbWV9YDtcclxuICB9XHJcblxyXG4gIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAvLyBVcGRhdGUgdmlzaWJpbGl0eSBpbml0aWFsbHlcclxuICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0aW1lIGV2ZXJ5IHNlY29uZCBpZiBtZWRpYSBpcyBmdWxsc2NyZWVuXHJcbiAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGZzRWwgPSBkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQgfHxcclxuICAgICAgICAgICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5tc0Z1bGxzY3JlZW5FbGVtZW50O1xyXG4gICAgICBjb25zdCBpc0Z1bGwgPSBmc0VsICYmIChmc0VsID09PSB0aGlzLm1lZGlhIHx8IGZzRWwuY29udGFpbnModGhpcy5tZWRpYSkgfHwgdGhpcy5tZWRpYS5jb250YWlucyhmc0VsKSk7XHJcbiAgICAgIGlmIChpc0Z1bGwpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgLy8gTGlzdGVuIHRvIGZ1bGxzY3JlZW4gY2hhbmdlIGV2ZW50c1xyXG4gICAgY29uc3QgdXBkYXRlVmlzaWJpbGl0eUJvdW5kID0gdGhpcy51cGRhdGVWaXNpYmlsaXR5LmJpbmQodGhpcyk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgdXBkYXRlVmlzaWJpbGl0eUJvdW5kKTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96ZnVsbHNjcmVlbmNoYW5nZScsIHVwZGF0ZVZpc2liaWxpdHlCb3VuZCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdNU0Z1bGxzY3JlZW5DaGFuZ2UnLCB1cGRhdGVWaXNpYmlsaXR5Qm91bmQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheSBleHRlbmRzIFRpbWVEaXNwbGF5IHtcclxuICAgIGRpc3BsYXlUeXBlKCkge1xyXG4gICAgICAgIHJldHVybiAnd2luZG93LW92ZXJsYXknO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50b3AgPSAnMTBweCc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgIHRoaXMudGltZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gJzk5OTk5OSc7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLnRpbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZUVsZW1lbnQucGFyZW50RWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMudGltZUVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUaW1lKCkge1xyXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3QgaG91cnMgPSBTdHJpbmcobm93LmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgY29uc3QgbWludXRlcyA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBTdHJpbmcobm93LmdldFNlY29uZHMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgICAgICBjb25zdCBzeXN0ZW1UaW1lID0gYCR7aG91cnN9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XHJcbiAgICAgICAgdGhpcy50aW1lRWxlbWVudC5pbm5lclRleHQgPSBzeXN0ZW1UaW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrSXNUb1Nob3coKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50ICE9PSBudWxsIHx8IGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XHJcbiAgICAgICAgLy8gVXBkYXRlIHZpc2liaWxpdHkgaW5pdGlhbGx5XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KCk7XHJcbiAgICAgICAgLy8gVXBkYXRlIHRpbWUgZXZlcnkgc2Vjb25kXHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGZvcm1hdFRpbWUsIGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbiB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBUaW1lRGlzcGxheSwgV2luZG93T3ZlcmxheVRpbWVEaXNwbGF5IH0gZnJvbSAnLi93aWRnZXRzJztcclxuXHJcbmNvbnNvbGUubG9nKFwiaGVsbG8gd29ybGQhXCIpO1xyXG5cclxuZnVuY3Rpb24gc2NhbkZvck1lZGlhKGRvY3VtZW50KSB7XHJcbiAgY29uc3QgbWVkaWFUYWdTZWxlY3RvciA9ICd2aWRlbyc7XHJcbiAgXHJcbiAgLy8g4pGgIOafpeaJvuaZrumAmkRPTeS4reeahHZpZGVvL2F1ZGlv5qCH562+XHJcbiAgY29uc3QgcmVndWxhck1lZGlhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChtZWRpYVRhZ1NlbGVjdG9yKTtcclxuICBcclxuLy8gICAvLyDikaEg6YCS5b2S5p+l5om+U2hhZG93IERPTeS4reeahHZpZGVv5qCH562+XHJcbi8vICAgY29uc3Qgc2hhZG93TWVkaWEgPSBmaW5kU2hhZG93TWVkaWEoZG9jdW1lbnQsIG1lZGlhVGFnU2VsZWN0b3IpO1xyXG4gIFxyXG4vLyAgIC8vIOKRoiDmn6Xmib7nvZHnq5nnibnlrprnmoTop4bpopHlhYPntKBcclxuLy8gICBjb25zdCBzaXRlU3BlY2lmaWNNZWRpYSA9IHRoaXMuc2l0ZUhhbmRsZXIuZGV0ZWN0U3BlY2lhbFZpZGVvcyhkb2N1bWVudCk7XHJcbiAgXHJcbi8vICAgLy8g4pGjIOi/h+a7pOaOiemcgOimgeW/veeVpeeahOinhumikVxyXG4vLyAgIHJldHVybiBmaWx0ZXJlZE1lZGlhO1xyXG4gICAgcmV0dXJuIHJlZ3VsYXJNZWRpYTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5qZWN0Rm9yTWVkaWFzKCkge1xyXG4gIGNvbnN0IG1lZGlhcyA9IHNjYW5Gb3JNZWRpYShkb2N1bWVudCk7XHJcbiAgaWYgKG1lZGlhcyA9PT0gdW5kZWZpbmVkIHx8IG1lZGlhcy5sZW5ndGggPT09IDApIHtcclxuICAgIGNvbnNvbGUud2FybihcIk5vIG1lZGlhIGVsZW1lbnRzIGZvdW5kLlwiKTtcclxuICAgIHNldFRpbWVvdXQoaW5qZWN0Rm9yTWVkaWFzLCAyMDAwKTsgLy8gcmV0cnkgYWZ0ZXIgMiBzZWNvbmRzXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIOi+k+WHuuaJvuWIsOeahOWqkuS9k+WFg+e0oFxyXG4gIGNvbnNvbGUubG9nKFwiRm91bmQgbWVkaWEgZWxlbWVudHM6XCIsIG1lZGlhcyk7XHJcblxyXG4gIC8vIOS4uuavj+S4quWqkuS9k+WFg+e0oOWIm+W7uuaXtumXtOaYvuekulxyXG4gIG1lZGlhcy5mb3JFYWNoKG1lZGlhID0+IHtcclxuICAgIG5ldyBUaW1lRGlzcGxheShtZWRpYSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5pbmplY3RGb3JNZWRpYXMoKTtcclxuY29uc3Qgb3ZlcmxheVRpbWVEaXNwID0gbmV3IFdpbmRvd092ZXJsYXlUaW1lRGlzcGxheShkb2N1bWVudC5ib2R5KTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgaWYgKGNoZWNrSXNCcm93c2VyRnVsbHNjcmVlbigpKSB7XHJcbiAgICBvdmVybGF5VGltZURpc3Auc2hvdygpO1xyXG4gICAgY29uc29sZS5sb2coJ0Jyb3dzZXIgaXMgaW4gZnVsbHNjcmVlbiBtb2RlJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG92ZXJsYXlUaW1lRGlzcC5oaWRlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnQnJvd3NlciBpcyBub3QgaW4gZnVsbHNjcmVlbiBtb2RlJyk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG4iXSwibmFtZXMiOlsiZm9ybWF0VGltZSIsInNlY29uZHMiLCJpc05hTiIsIm1pbnMiLCJNYXRoIiwiZmxvb3IiLCJzZWNzIiwiY29uY2F0IiwiU3RyaW5nIiwicGFkU3RhcnQiLCJjaGVja0lzQnJvd3NlckZ1bGxzY3JlZW4iLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInNjcmVlbiIsImhlaWdodCIsImlubmVyV2lkdGgiLCJ3aWR0aCIsIlRpbWVEaXNwbGF5IiwibWVkaWEiLCJfY2xhc3NDYWxsQ2hlY2siLCJ0aW1lRWxlbWVudCIsImNyZWF0ZVRpbWVFbGVtZW50Iiwic2V0dXBFdmVudExpc3RlbmVycyIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiZGlzcGxheVR5cGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwicGFkZGluZyIsImJvcmRlclJhZGl1cyIsInpJbmRleCIsImlubmVyVGV4dCIsImRpc3BsYXkiLCJjaGVja0lzVG9TaG93IiwiZnNFbCIsImZ1bGxzY3JlZW5FbGVtZW50Iiwid2Via2l0RnVsbHNjcmVlbkVsZW1lbnQiLCJtb3pGdWxsU2NyZWVuRWxlbWVudCIsIm1zRnVsbHNjcmVlbkVsZW1lbnQiLCJpc0Z1bGwiLCJjb250YWlucyIsInNob3ciLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJwYXJlbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJoaWRlIiwicmVtb3ZlQ2hpbGQiLCJ1cGRhdGVWaXNpYmlsaXR5IiwidXBkYXRlVGltZSIsImN1cnJlbnRUaW1lIiwiZHVyYXRpb24iLCJub3ciLCJEYXRlIiwiaG91cnMiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsInN5c3RlbVRpbWUiLCJfdGhpcyIsInNldEludGVydmFsIiwidXBkYXRlVmlzaWJpbGl0eUJvdW5kIiwiYmluZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJXaW5kb3dPdmVybGF5VGltZURpc3BsYXkiLCJfVGltZURpc3BsYXkiLCJfY2FsbFN1cGVyIiwiYXJndW1lbnRzIiwiX2luaGVyaXRzIiwiYm9keSIsIl90aGlzMiIsImNvbnNvbGUiLCJsb2ciLCJzY2FuRm9yTWVkaWEiLCJtZWRpYVRhZ1NlbGVjdG9yIiwicmVndWxhck1lZGlhIiwicXVlcnlTZWxlY3RvckFsbCIsImluamVjdEZvck1lZGlhcyIsIm1lZGlhcyIsInVuZGVmaW5lZCIsImxlbmd0aCIsIndhcm4iLCJzZXRUaW1lb3V0IiwiZm9yRWFjaCIsIm92ZXJsYXlUaW1lRGlzcCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9