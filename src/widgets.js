import { checkIsBrowserFullscreen, formatTime } from './utils';

export class TimeDisplay {
  constructor(media) {
    this.media = media;
    this.timeElement = this.createTimeElement();
    this.showWhenVideoFullscreen = true;
    this.showOnFullscreen = true;
    this.showSeconds = true;
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
        showSeconds: true
      },
      (items) => {
        this.showWhenVideoFullscreen = items.showWhenVideoFullscreen;
        this.showOnFullscreen = items.showOnFullscreen;
        this.showSeconds = items.showSeconds;
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

  hide() {
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

  updateTime() {
    const currentTime = this.media.currentTime;
    const duration = this.media.duration;
    this.timeElement.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const systemTime = this.showSeconds
      ? `${hours}:${minutes}:${String(now.getSeconds()).padStart(2, '0')}`
      : `${hours}:${minutes}`;
    this.timeElement.innerText += ` | ${systemTime}`;
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

    hide() {
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

        return document.fullscreenElement !== null || checkIsBrowserFullscreen();
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