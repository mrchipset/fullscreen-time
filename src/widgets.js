import { checkIsBrowserFullscreen, formatTime } from './utils';
import { t } from './i18n';

export const FULLSCREEN_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange'
];

export function getFullscreenElement() {
  return document.fullscreenElement ||
         document.webkitFullscreenElement ||
         document.mozFullScreenElement ||
         document.msFullscreenElement ||
         null;
}

function isVideoElement(element) {
  return !!element &&
    typeof HTMLVideoElement !== 'undefined' &&
    element instanceof HTMLVideoElement;
}

const POPOVER_SUPPORTED = typeof HTMLElement !== 'undefined' &&
  typeof HTMLElement.prototype.showPopover === 'function' &&
  typeof HTMLElement.prototype.hidePopover === 'function';

const DEFAULT_SETTINGS = {
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

export class TimeDisplay {
  constructor(media) {
    this.media = media;
    this.timeElement = this.createTimeElement();
    this._timeTextSpan = this._timeTextSpan || null;
    this._closeBtn = this._closeBtn || null;

    Object.assign(this, DEFAULT_SETTINGS);

    this.autoHideTimer = null;
    this._boundWakeHandler = null;
    this._isDragging = false;
    this._activePointerId = null;
    this._dragOffset = { x: 0, y: 0 };
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

  applySettings(settings) {
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
      this._closeBtn.title = t('closeBtnTitle');
    }
  }

  displayType() {
    return 'media';
  }

  isShowing() {
    return this._visible;
  }

  _floatStorageKey() {
    return this.displayType() === 'window-overlay'
      ? 'floatPositionWindow'
      : 'floatPositionVideo';
  }

  _getFloatPosition() {
    return this.displayType() === 'window-overlay'
      ? this.floatPositionWindow
      : this.floatPositionVideo;
  }

  _setFloatPosition(position) {
    if (this.displayType() === 'window-overlay') {
      this.floatPositionWindow = position;
    } else {
      this.floatPositionVideo = position;
    }
    chrome.storage.sync.set({ [this._floatStorageKey()]: position });
  }

  // --- element creation ---------------------------------------------------

  createTimeElement() {
    const timeElement = document.createElement('div');
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
    const textSpan = document.createElement('span');
    textSpan.textContent = '00:00 / 00:00';
    this._timeTextSpan = textSpan;
    timeElement.appendChild(textSpan);

    const closeBtn = this._createCloseButton();
    this._closeBtn = closeBtn;

    // 使用 mouseover/mouseout + relatedTarget 处理 hover，避免绝对定位子元素导致的事件问题
    timeElement.addEventListener('mouseenter', () => { closeBtn.style.display = 'block'; });
    timeElement.addEventListener('mouseleave', () => {
      // 当鼠标离开 timeElement 且未进入 closeBtn 时才隐藏
      // 延迟让 mouseenter closeBtn 有机会触发
      setTimeout(() => {
        if (this._forceCloseVisible) return;
        if (closeBtn.style.display !== 'none' && !closeBtn.matches(':hover')) {
          closeBtn.style.display = 'none';
        }
      }, 50);
    });
    closeBtn.addEventListener('mouseleave', () => {
      if (!this._forceCloseVisible) closeBtn.style.display = 'none';
    });

    timeElement.appendChild(closeBtn);
    return timeElement;
  }

  // 创建右上角关闭按钮 ×（位于 timeElement 内部右上角）
  _createCloseButton() {
    const btn = document.createElement('span');
    btn.textContent = '×';
    btn.title = t('closeBtnTitle');
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

    btn.addEventListener('pointerdown', (e) => e.stopPropagation()); // 阻止拖拽
    btn.addEventListener('mousedown', (e) => e.stopPropagation());
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleDismiss();
    });

    return btn;
  }

  handleDismiss() {
    document.dispatchEvent(new CustomEvent('fs-time-dismiss', {
      detail: { displayType: this.displayType() }
    }));
  }

  // --- visibility ---------------------------------------------------------

  checkIsToShow() {
    if (!this.showWhenVideoFullscreen) {
      return false;
    }

    const fsEl = getFullscreenElement();
    if (!fsEl || !this.media) return false;

    return fsEl === this.media ||
           fsEl.contains(this.media) ||
           this.media.contains(fsEl);
  }

  updateVisibility() {
    if (this.checkIsToShow()) {
      this.show();
    } else {
      this.hide();
    }
  }

  _resetCloseButton() {
    if (!this._closeBtn) return;
    this._closeBtn.style.display = this._forceCloseVisible ? 'block' : 'none';
  }

  _getDomParent(fsEl) {
    return fsEl || document.body;
  }

  show() {
    if (!this.timeElement) return;

    const fsEl = getFullscreenElement();
    const nativeVideoFullscreen = isVideoElement(fsEl);

    // Native <video> fullscreen renders in its own top layer. A regular DOM
    // child (even inside the video) is painted underneath the video. Use the
    // Popover API to promote the overlay into the browser top layer instead.
    if (nativeVideoFullscreen && !POPOVER_SUPPORTED) {
      // Unsupported API: no point retrying; go through shared cleanup.
      this.hide();
      return;
    }

    const usePopover = nativeVideoFullscreen && POPOVER_SUPPORTED;
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
      const parent = this._getDomParent(fsEl);
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
  _cleanupForHide() {
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

  hide() {
    this._cleanupForHide();
    this._clearPopoverRetry();
  }

  _clearPopoverRetryTimer() {
    if (this._popoverRetryTimer) {
      clearTimeout(this._popoverRetryTimer);
      this._popoverRetryTimer = null;
    }
  }

  _clearPopoverRetry() {
    this._clearPopoverRetryTimer();
    this._popoverRetryCount = 0;
  }

  _handlePopoverFailure() {
    const canRetry = isVideoElement(getFullscreenElement());
    this._cleanupForHide();
    if (canRetry) {
      this._schedulePopoverRetry();
    } else {
      this._clearPopoverRetryTimer();
      this._popoverRetryCount = 0;
    }
  }

  _schedulePopoverRetry() {
    if (this._popoverRetryCount >= 3) return;

    this._popoverRetryCount += 1;
    this._clearPopoverRetryTimer();
    this._popoverRetryTimer = setTimeout(() => {
      this._popoverRetryTimer = null;
      if (!isVideoElement(getFullscreenElement())) {
        this._popoverRetryCount = 0;
        return;
      }
      if (!this.checkIsToShow()) {
        this._popoverRetryCount = 0;
        return;
      }
      this.updateVisibility();
    }, 100);
  }

  // --- placement ----------------------------------------------------------

  _positionElement() {
    if (!this.timeElement) return;

    const fsEl = getFullscreenElement();
    // A fullscreen element covers the viewport, so viewport-fixed coordinates
    // work for container-append, popover, browser and window modes alike.
    // Using fixed everywhere also makes drag-end getBoundingClientRect()
    // coordinates reusable on the next show.
    this._positionMode = 'fixed';

    const style = this.timeElement.style;
    style.position = this._positionMode;
    style.margin = '0';
    style.right = 'auto';
    style.bottom = 'auto';
    style.border = 'none';
    style.transform = 'none';

    if (this.layoutMode === 'float') {
      const saved = this._getFloatPosition();
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

  _clampPosition(position) {
    const element = this.timeElement;
    const width = element ? (element.offsetWidth || 0) : 0;
    const height = element ? (element.offsetHeight || 0) : 0;
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    const rawX = Number(position && position.x);
    const rawY = Number(position && position.y);

    return {
      x: Math.round(Math.min(Math.max(0, Number.isFinite(rawX) ? rawX : 0), maxX)),
      y: Math.round(Math.min(Math.max(0, Number.isFinite(rawY) ? rawY : 0), maxY))
    };
  }

  _applyFloatPosition(position) {
    if (!this.timeElement) return;
    const clamped = this._clampPosition(position);
    this.timeElement.style.position = this._positionMode;
    this.timeElement.style.transform = 'none';
    this.timeElement.style.left = `${clamped.x}px`;
    this.timeElement.style.top = `${clamped.y}px`;
  }

  handleResize() {
    if (!this._visible || this.layoutMode !== 'float' || this._isDragging) return;
    const saved = this._getFloatPosition();
    if (saved) this._applyFloatPosition(saved);
  }

  // --- popover ------------------------------------------------------------

  _showPopover() {
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

  _hidePopover() {
    if (!this.timeElement || !POPOVER_SUPPORTED) return;
    try {
      this.timeElement.hidePopover();
    } catch (e) {
      // not currently open / unsupported state
    }
  }

  _teardownPopover() {
    if (!this.timeElement) return;
    if (POPOVER_SUPPORTED && this.timeElement.hasAttribute('popover')) {
      this._hidePopover();
    }
    if (this.timeElement.hasAttribute('popover')) {
      this.timeElement.removeAttribute('popover');
    }
  }

  // --- pointer / drag -----------------------------------------------------

  _applyPointerMode(usePopover) {
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

  _restorePointerEvents() {
    if (!this.timeElement) return;
    this.timeElement.style.pointerEvents = this._popoverMode ? 'none' : 'auto';
    if (this._closeBtn) {
      this._closeBtn.style.pointerEvents = 'auto';
    }
  }

  setupDragging() {
    this.teardownDragging();
    if (!this.timeElement) return;
    // Popover containers are pointer-events:none; no drag there.
    if (this._popoverMode) return;

    this._isDragging = false;
    this.timeElement.style.cursor = 'move';
    this.timeElement.style.userSelect = 'none';
    this.timeElement.style.touchAction = 'none';

    this._boundPointerDown = (e) => this._onDragStart(e);
    this._boundPointerMove = (e) => this._onDragMove(e);
    this._boundPointerUp = (e) => this._onDragEnd(e);
    this._boundPointerCancel = (e) => this._onDragEnd(e);

    this.timeElement.addEventListener('pointerdown', this._boundPointerDown);
    this.timeElement.addEventListener('pointermove', this._boundPointerMove);
    this.timeElement.addEventListener('pointerup', this._boundPointerUp);
    this.timeElement.addEventListener('pointercancel', this._boundPointerCancel);
  }

  teardownDragging() {
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

  _onDragStart(e) {
    if (!this.timeElement) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Clicking the close button must not start a drag.
    if (e.target === this._closeBtn ||
        (this._closeBtn && this._closeBtn.contains(e.target))) {
      return;
    }

    this._isDragging = true;
    this._activePointerId = e.pointerId;

    const rect = this.timeElement.getBoundingClientRect();
    this._dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    try {
      this.timeElement.setPointerCapture(e.pointerId);
    } catch (err) {
      // pointer capture is best-effort
    }

    this._wake();
    e.preventDefault();
  }

  _onDragMove(e) {
    if (!this._isDragging || !this.timeElement) return;
    if (this._activePointerId !== null && e.pointerId !== this._activePointerId) return;

    const position = this._clampPosition({
      x: e.clientX - this._dragOffset.x,
      y: e.clientY - this._dragOffset.y
    });

    this.timeElement.style.position = this._positionMode;
    this.timeElement.style.transform = 'none';
    this.timeElement.style.left = `${position.x}px`;
    this.timeElement.style.top = `${position.y}px`;

    this._wake();
  }

  _onDragEnd(e) {
    if (!this._isDragging || !this.timeElement) return;
    this._isDragging = false;

    if (this._activePointerId !== null) {
      try {
        if (this.timeElement.hasPointerCapture &&
            this.timeElement.hasPointerCapture(this._activePointerId)) {
          this.timeElement.releasePointerCapture(this._activePointerId);
        }
      } catch (err) {
        // ignore
      }
    }
    this._activePointerId = null;

    const rect = this.timeElement.getBoundingClientRect();
    const position = this._clampPosition({ x: rect.left, y: rect.top });
    this._setFloatPosition(position);

    if (this.autoHide) this._wake();
  }

  // --- auto hide ----------------------------------------------------------

  startAutoHide() {
    if (!this.timeElement) return;
    this.timeElement.style.opacity = '1';
    this._restorePointerEvents();
    this.clearAutoHideTimer();
    this._setupWakeListener();
    this.autoHideTimer = setTimeout(() => this.fadeOut(), 3000);
  }

  clearAutoHideTimer() {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = null;
    }
  }

  _setupWakeListener() {
    this.teardownWakeListener();
    this._boundWakeHandler = () => this._wake();

    // Wake on activity anywhere in the fullscreen container/document, not
    // only over the <video> element.
    document.addEventListener('mousemove', this._boundWakeHandler, { passive: true });
    document.addEventListener('pointermove', this._boundWakeHandler, { passive: true });
    if (this.timeElement) {
      this.timeElement.addEventListener('pointerdown', this._boundWakeHandler);
      this.timeElement.addEventListener('mousemove', this._boundWakeHandler);
    }
  }

  teardownWakeListener() {
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

  _wake() {
    if (!this.autoHide || !this._visible || !this.timeElement) return;
    this.timeElement.style.opacity = '1';
    this._restorePointerEvents();
    this.clearAutoHideTimer();
    this.autoHideTimer = setTimeout(() => this.fadeOut(), 3000);
  }

  fadeOut() {
    if (!this.timeElement) return;
    this.timeElement.style.opacity = '0';
    this.timeElement.style.pointerEvents = 'none';
    if (this._closeBtn) this._closeBtn.style.pointerEvents = 'none';
    this.autoHideTimer = null;
  }

  // --- time ---------------------------------------------------------------

  _systemTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return this.showSeconds
      ? `${hours}:${minutes}:${String(now.getSeconds()).padStart(2, '0')}`
      : `${hours}:${minutes}`;
  }

  updateTime() {
    if (!this._timeTextSpan) return;
    const systemTime = this._systemTime();

    if (this.showProgress && this.media) {
      const currentTime = Number(this.media.currentTime);
      const duration = Number(this.media.duration);
      this._timeTextSpan.textContent =
        `${formatTime(currentTime)} / ${formatTime(duration)} | ${systemTime}`;
    } else {
      this._timeTextSpan.textContent = systemTime;
    }
  }

  // --- teardown -----------------------------------------------------------

  destroy() {
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
}

export class WindowOverlayTimeDisplay extends TimeDisplay {
  displayType() {
    return 'window-overlay';
  }

  checkIsToShow() {
    if (!this.showOnFullscreen) {
      return false;
    }

    const fsEl = getFullscreenElement();

    // 元素全屏（视频全屏）时：如果视频专用显示已开启，不再重复显示
    if (fsEl !== null) {
      return !this.showWhenVideoFullscreen;
    }

    // 浏览器全屏（F11）时显示
    return checkIsBrowserFullscreen();
  }

  updateTime() {
    if (!this._timeTextSpan) return;
    this._timeTextSpan.textContent = this._systemTime();
  }
}
