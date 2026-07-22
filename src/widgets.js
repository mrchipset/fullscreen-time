import { checkIsBrowserFullscreen, formatTime } from './utils';

export class TimeDisplay {
  constructor(media) {
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
    this._dragOffset = { x: 0, y: 0 };
    this._boundMouseDownStart = null;
    this._boundMouseMoveDuring = null;
    this._boundMouseUpEnd = null;
    this.loadSettings();
    this.setupEventListeners();
    this.setupSettingsListener();
  }

  loadSettings() {
    // 从Chrome存储中读取设置
    chrome.storage.sync.get(
      {
        showWhenVideoFullscreen: true,
        showOnFullscreen: true,
        showSeconds: true,
        showProgress: true,
        autoHide: false,
        layoutMode: 'snap',
        floatPosition: null
      },
      (items) => {
        this.showWhenVideoFullscreen = items.showWhenVideoFullscreen;
        this.showOnFullscreen = items.showOnFullscreen;
        this.showSeconds = items.showSeconds;
        this.showProgress = items.showProgress;
        this.autoHide = items.autoHide;
        this.layoutMode = items.layoutMode || 'snap';
        this.floatPosition = items.floatPosition || null;
        this.updateVisibility();
      }
    );
  }

  displayType() {
    return 'media';
  }

  createTimeElement() {
    const timeElement = document.createElement('div');
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

  checkIsToShow() {
    if (!this.showWhenVideoFullscreen) {
      return false;
    }

    const fsEl = document.fullscreenElement ||
                 document.webkitFullscreenElement ||
                 document.mozFullScreenElement ||
                 document.msFullscreenElement;
    const isFull = fsEl && (fsEl === this.media || fsEl.contains(this.media) || this.media.contains(fsEl));
    return isFull;
  }

  show() {
    this.updateTime();
    this.timeElement.style.display = 'block';
    this.timeElement.style.zIndex = '999999';
    this.timeElement.style.opacity = '1';

    if (this.layoutMode === 'float') {
      this.teardownDragging();
      const floatParent = document.fullscreenElement || document.body;
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

  hide() {
    this.clearAutoHideTimer();
    this.teardownMouseListener();
    this.teardownDragging();
    this.timeElement.style.display = 'none';
    if (this.timeElement.parentElement === this.media.parentElement) {
      this.media.parentElement.removeChild(this.timeElement);
    }
  }

  updateVisibility() {
    // 检查是否在全屏且设置中启用了全屏显示
    if (this.checkIsToShow()) {
      this.show();
    } else {
      this.hide();
    }
  }

  startAutoHide() {
    this.timeElement.style.opacity = '1';
    this.clearAutoHideTimer();
    this.setupMouseListener();
    this.autoHideTimer = setTimeout(() => this.fadeOut(), 3000);
  }

  clearAutoHideTimer() {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
      this.autoHideTimer = null;
    }
  }

  setupMouseListener() {
    this.teardownMouseListener();
    this._boundMouseMoveHandler = () => {
      if (this.autoHide) {
        this.timeElement.style.opacity = '1';
        this.clearAutoHideTimer();
        this.autoHideTimer = setTimeout(() => this.fadeOut(), 3000);
      }
    };
    this.media.addEventListener('mousemove', this._boundMouseMoveHandler);
  }

  teardownMouseListener() {
    if (this._boundMouseMoveHandler) {
      this.media.removeEventListener('mousemove', this._boundMouseMoveHandler);
      this._boundMouseMoveHandler = null;
    }
  }

  fadeOut() {
    this.timeElement.style.opacity = '0';
  }

  applyFloatPosition() {
    // 视频全屏时用 absolute（挂在全屏元素下），否则用 fixed（挂在 body 下）
    this.timeElement.style.position = document.fullscreenElement ? 'absolute' : 'fixed';
    this.timeElement.style.transform = 'none';
    if (this.floatPosition) {
      this.timeElement.style.left = `${this.floatPosition.x}px`;
      this.timeElement.style.top = `${this.floatPosition.y}px`;
    } else {
      this.timeElement.style.left = '50%';
      this.timeElement.style.top = '20px';
      this.timeElement.style.transform = 'translateX(-50%)';
    }
  }

  setupDragging() {
    this.teardownDragging();
    this._isDragging = false;
    this.timeElement.style.cursor = 'move';
    this.timeElement.style.userSelect = 'none';

    this._boundMouseDownStart = (e) => this._onDragStart(e);
    this._boundMouseUpEnd = () => this._onDragEnd();

    this.timeElement.addEventListener('mousedown', this._boundMouseDownStart);
    document.addEventListener('mouseup', this._boundMouseUpEnd);
  }

  teardownDragging() {
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

  _onDragStart(e) {
    this._isDragging = true;
    const rect = this.timeElement.getBoundingClientRect();
    this._dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this._boundMouseMoveDuring = (e) => this._onDragMove(e);
    document.addEventListener('mousemove', this._boundMouseMoveDuring);
  }

  _onDragMove(e) {
    if (!this._isDragging) return;
    this.timeElement.style.position = 'fixed';
    this.timeElement.style.transform = 'none';
    this.timeElement.style.left = `${e.clientX - this._dragOffset.x}px`;
    this.timeElement.style.top = `${e.clientY - this._dragOffset.y}px`;
  }

  _onDragEnd() {
    if (!this._isDragging) return;
    this._isDragging = false;
    document.removeEventListener('mousemove', this._boundMouseMoveDuring);
    this._boundMouseMoveDuring = null;

    const rect = this.timeElement.getBoundingClientRect();
    this.floatPosition = { x: Math.round(rect.left), y: Math.round(rect.top) };
    chrome.storage.sync.set({ floatPosition: this.floatPosition });
  }

  updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const systemTime = this.showSeconds
      ? `${hours}:${minutes}:${String(now.getSeconds()).padStart(2, '0')}`
      : `${hours}:${minutes}`;

    if (this.showProgress) {
      const currentTime = this.media.currentTime;
      const duration = this.media.duration;
      this.timeElement.innerText = `${formatTime(currentTime)} / ${formatTime(duration)} | ${systemTime}`;
    } else {
      this.timeElement.innerText = systemTime;
    }
  }

  setupEventListeners() {


    // Update time every second if media is fullscreen
    setInterval(() => {
      const fsEl = document.fullscreenElement ||
                   document.webkitFullscreenElement ||
                   document.mozFullScreenElement ||
                   document.msFullscreenElement;
      const isFull = fsEl && (fsEl === this.media || fsEl.contains(this.media) || this.media.contains(fsEl));
      if (isFull && this.showWhenVideoFullscreen) {
        this.updateTime();
      }
    }, 1000);

    // Listen to fullscreen change events
    const updateVisibilityBound = this.updateVisibility.bind(this);
    document.addEventListener('fullscreenchange', updateVisibilityBound);
    document.addEventListener('webkitfullscreenchange', updateVisibilityBound);
    document.addEventListener('mozfullscreenchange', updateVisibilityBound);
    document.addEventListener('MSFullscreenChange', updateVisibilityBound);
  }

  setupSettingsListener() {
    // Listen to storage changes to update settings in real-time
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        if ('showWhenVideoFullscreen' in changes) {
          this.showWhenVideoFullscreen = changes.showWhenVideoFullscreen.newValue;
        }
        if ('showOnFullscreen' in changes) {
          this.showOnFullscreen = changes.showOnFullscreen.newValue;
        }
        if ('showSeconds' in changes) {
          this.showSeconds = changes.showSeconds.newValue;
        }
        if ('showProgress' in changes) {
          this.showProgress = changes.showProgress.newValue;
        }
        if ('autoHide' in changes) {
          this.autoHide = changes.autoHide.newValue;
        }
        if ('layoutMode' in changes) {
          this.layoutMode = changes.layoutMode.newValue;
        }
        this.updateVisibility();
      }
    });
  }
}

export class WindowOverlayTimeDisplay extends TimeDisplay {
    displayType() {
        return 'window-overlay';
    }

    show() {
        this.updateTime();
        this.timeElement.style.display = 'block';
        this.timeElement.style.zIndex = '999999';

        if (this.layoutMode === 'float') {
            this.teardownDragging();
            const floatParent = document.fullscreenElement || document.body;
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

    hide() {
        this.teardownDragging();
        this.timeElement.style.display = 'none';
        if (this.timeElement.parentElement === document.body) {
            document.body.removeChild(this.timeElement);
        }
    }

    updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const systemTime = this.showSeconds
          ? `${hours}:${minutes}:${String(now.getSeconds()).padStart(2, '0')}`
          : `${hours}:${minutes}`;
        this.timeElement.innerText = systemTime;
    }

    checkIsToShow() {
        if (!this.showOnFullscreen) {
            return false;
        }

        // 元素全屏（视频全屏）时：如果视频专用显示已开启，不再重复显示
        if (document.fullscreenElement !== null) {
            return !this.showWhenVideoFullscreen;
        }

        // 浏览器全屏（F11）时显示
        return checkIsBrowserFullscreen();
    }

    setupEventListeners() {
        // Update visibility initially
        this.updateVisibility();
        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);

    }
}