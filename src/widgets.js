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

const OVERLAY_STYLE_ID = 'fs-time-overlay-styles';

const OVERLAY_STYLES = `
  .fs-time-overlay {
    position: fixed;
    overflow: visible;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.72);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    padding: 6px 10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
    transition: opacity 180ms ease;
  }

  [popover].fs-time-overlay {
    inset: auto;
    margin: 0;
    width: max-content;
    max-width: none;
    max-height: none;
    overflow: visible;
  }

  .fs-time-overlay::backdrop {
    background: transparent;
    pointer-events: none;
  }

  .fs-time-overlay.is-faded {
    opacity: 0;
    pointer-events: none;
  }

  .fs-time-close {
    position: absolute;
    top: -9px;
    right: -9px;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    background: rgba(10, 12, 16, 0.92);
    color: #fff;
    font: 600 16px/1 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.92);
    transition: opacity 140ms ease, transform 140ms ease, background-color 140ms ease;
  }

  .fs-time-overlay:hover .fs-time-close,
  .fs-time-overlay:focus-within .fs-time-close,
  .fs-time-overlay.is-close-forced .fs-time-close,
  .fs-time-overlay[popover] .fs-time-close {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1);
  }

  .fs-time-close:hover {
    background: rgba(40, 44, 52, 0.98);
  }

  .fs-time-close:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .fs-time-overlay.is-faded .fs-time-close {
    opacity: 0;
    pointer-events: none;
  }

  .fs-time-dismiss-hint {
    position: fixed;
    top: 14px;
    left: 50%;
    z-index: 2147483647;
    box-sizing: border-box;
    max-width: min(92vw, 520px);
    padding: 8px 14px;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.82);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0.01em;
    text-align: center;
    white-space: normal;
    pointer-events: none;
    animation: fs-time-hint-in 180ms ease-out;
  }

  [popover].fs-time-dismiss-hint {
    inset: auto;
    top: 14px;
    left: 50%;
    margin: 0;
    width: max-content;
    max-width: min(92vw, 520px);
    max-height: none;
    overflow: visible;
    transform: translateX(-50%);
  }

  .fs-time-dismiss-hint::backdrop {
    background: transparent;
    pointer-events: none;
  }

  @keyframes fs-time-hint-in {
    from {
      opacity: 0;
      transform: translate(-50%, -4px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  @media (pointer: coarse) {
    .fs-time-overlay .fs-time-close {
      opacity: 1;
      pointer-events: auto;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fs-time-overlay,
    .fs-time-close,
    .fs-time-dismiss-hint {
      transition: none !important;
      animation: none !important;
    }
  }
`;

function injectOverlayStyles() {
  if (typeof document === 'undefined' || !document.head) return;
  if (document.getElementById(OVERLAY_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = OVERLAY_STYLE_ID;
  style.textContent = OVERLAY_STYLES;
  document.head.appendChild(style);
}

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
    injectOverlayStyles();

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

    this.videoOverlayActive = false;
    this._dismissHintElement = null;
    this._dismissHintTimer = null;
    this._boundDismissHintFullscreenExit = null;

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

    // Re-translate the close button when settings/language are re-applied.
    this._refreshCloseButtonLabel();
  }

  _refreshCloseButtonLabel() {
    if (!this._closeBtn) return;

    const label = t('closeBtnTitle');
    this._closeBtn.title = label;
    this._closeBtn.setAttribute('aria-label', label);
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
    timeElement.className = 'fs-time-overlay';
    timeElement.style.zIndex = '999999';
    timeElement.style.pointerEvents = 'auto';
    timeElement.style.display = 'none';

    // 独立文字容器（与 × 按钮并列，避免 updateTime 误删按钮）
    const textSpan = document.createElement('span');
    textSpan.textContent = '00:00 / 00:00';
    this._timeTextSpan = textSpan;
    timeElement.appendChild(textSpan);

    const closeBtn = this._createCloseButton();
    this._closeBtn = closeBtn;
    this._refreshCloseButtonLabel();

    timeElement.appendChild(closeBtn);
    return timeElement;
  }

  // 创建右上角关闭按钮 ×（位于 timeElement 内部右上角）
  _createCloseButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fs-time-close';
    btn.textContent = '×';

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

    this._showDismissHint();
  }

  _showDismissHint() {
    this._hideDismissHint();

    if (!document.body) return;

    const hint = document.createElement('div');
    hint.className = 'fs-time-dismiss-hint';
    hint.setAttribute('role', 'status');
    hint.setAttribute('aria-live', 'polite');
    hint.setAttribute('aria-atomic', 'true');
    document.body.appendChild(hint);

    if (getFullscreenElement() && POPOVER_SUPPORTED) {
      try {
        hint.setAttribute('popover', 'manual');
        hint.showPopover();
      } catch (e) {
        hint.removeAttribute('popover');
      }
    }

    // Set the text after the live region is connected so it is announced.
    hint.textContent = t('dismissHint');
    this._dismissHintElement = hint;

    this._boundDismissHintFullscreenExit = () => {
      if (!getFullscreenElement()) {
        this._hideDismissHint();
      }
    };

    FULLSCREEN_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, this._boundDismissHintFullscreenExit);
    });
    window.addEventListener('resize', this._boundDismissHintFullscreenExit);

    this._dismissHintTimer = setTimeout(() => this._hideDismissHint(), 3000);
  }

  _hideDismissHint() {
    if (this._dismissHintTimer) {
      clearTimeout(this._dismissHintTimer);
      this._dismissHintTimer = null;
    }

    if (this._boundDismissHintFullscreenExit) {
      FULLSCREEN_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, this._boundDismissHintFullscreenExit);
      });
      window.removeEventListener('resize', this._boundDismissHintFullscreenExit);
      this._boundDismissHintFullscreenExit = null;
    }

    const hint = this._dismissHintElement;
    if (!hint) return;

    if (hint.hasAttribute('popover')) {
      try {
        hint.hidePopover();
      } catch (e) {
        // not currently open / unsupported state
      }
      hint.removeAttribute('popover');
    }

    if (hint.parentElement) {
      hint.parentElement.removeChild(hint);
    }

    this._dismissHintElement = null;
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
    this._closeBtn.classList.toggle('is-close-forced', this._forceCloseVisible);
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
    this.timeElement.classList.remove('is-faded');
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
      this.timeElement.classList.remove('is-faded');
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
    const inset = 12;

    // Leave room for the close button and a visible margin. If the viewport
    // is too small for the inset, fall back to the edge instead of inverting.
    const canInsetX = window.innerWidth >= width + inset * 2;
    const canInsetY = window.innerHeight >= height + inset * 2;
    const minX = canInsetX ? inset : 0;
    const minY = canInsetY ? inset : 0;
    const maxX = canInsetX
      ? window.innerWidth - width - inset
      : Math.max(0, window.innerWidth - width);
    const maxY = canInsetY
      ? window.innerHeight - height - inset
      : Math.max(0, window.innerHeight - height);
    const rawX = Number(position && position.x);
    const rawY = Number(position && position.y);

    return {
      x: Math.round(Math.min(Math.max(minX, Number.isFinite(rawX) ? rawX : 0), maxX)),
      y: Math.round(Math.min(Math.max(minY, Number.isFinite(rawY) ? rawY : 0), maxY))
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
    this._resetCloseButton();
  }

  _restorePointerEvents() {
    if (!this.timeElement) return;
    this.timeElement.classList.remove('is-faded');
    this.timeElement.style.pointerEvents = this._popoverMode ? 'none' : 'auto';
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
    this.timeElement.classList.add('is-faded');
    this.timeElement.style.opacity = '0';
    this.timeElement.style.pointerEvents = 'none';
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
    this._hideDismissHint();

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

    if (!fsEl) {
      return checkIsBrowserFullscreen();
    }

    // Native video fullscreen is handled by the video widget's top-layer
    // popover; the window overlay must not duplicate it.
    if (isVideoElement(fsEl)) {
      return false;
    }

    return !this.videoOverlayActive;
  }

  updateTime() {
    if (!this._timeTextSpan) return;
    this._timeTextSpan.textContent = this._systemTime();
  }
}
