import { formatTime, checkIsBrowserFullscreen } from './utils';
import { TimeDisplay, WindowOverlayTimeDisplay } from './widgets';

console.log("Fullscreen Time 已加载");

function scanForMedia(document) {
  const mediaTagSelector = 'video';
  
  const regularMedia = document.querySelectorAll(mediaTagSelector);
    return regularMedia;
}

// 收集所有 TimeDisplay 实例，供非持久快捷键直接操作
const _timeDisplays = [];

function injectForMedias() {
  const medias = scanForMedia(document);
  if (medias === undefined || medias.length === 0) {
    console.warn("No media elements found.");
    setTimeout(injectForMedias, 2000);
    return;
  }
  console.log("Found media elements:", medias);

  medias.forEach(media => {
    _timeDisplays.push(new TimeDisplay(media));
  });
}


injectForMedias();
const overlayTimeDisp = new WindowOverlayTimeDisplay(document.body);

window.addEventListener('resize', () => {
  overlayTimeDisp.updateVisibility();
});

// --- 快捷键处理（均为临时切换，不写 storage） ---

// 被快捷键临时改动的设置，退出全屏时恢复原值
const _tempOverrides = {};

function buildKeyString(e) {
  const parts = [];
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
    _timeDisplays.forEach(d => { d.showWhenVideoFullscreen = value; d.updateVisibility(); });
    overlayTimeDisp.showWhenVideoFullscreen = value;
    overlayTimeDisp.updateVisibility();
  } else if (settingKey === 'showOnFullscreen') {
    overlayTimeDisp.showOnFullscreen = value;
    overlayTimeDisp.updateVisibility();
  } else if (settingKey === 'layoutMode') {
    _timeDisplays.forEach(d => { d.layoutMode = value; d.updateVisibility(); });
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
  for (const [key, originalValue] of Object.entries(_tempOverrides)) {
    applySettingToWidgets(key, originalValue);
  }
  for (const key in _tempOverrides) {
    delete _tempOverrides[key];
  }
}

// 检测退出全屏（含 F11）
function checkFullscreenExit() {
  const isFs = document.fullscreenElement || checkIsBrowserFullscreen();
  if (!isFs) {
    restoreTempValues();
  }
}
document.addEventListener('fullscreenchange', checkFullscreenExit);
window.addEventListener('resize', checkFullscreenExit);

document.addEventListener('keydown', (e) => {
  const isFs = document.fullscreenElement || checkIsBrowserFullscreen();
  if (!isFs) return;

  // ESC 有浏览器退出全屏的默认行为，不应进入快捷键逻辑
  if (e.key === 'Escape') return;

  const pressed = buildKeyString(e);
  if (!pressed) return;

  chrome.storage.sync.get(
    ['keyToggleLayout', 'keyToggleVisibility'],
    (items) => {
      if (pressed === items.keyToggleLayout) {
        e.preventDefault();
        e.stopPropagation();
        // 从 widget 实例读取当前布局模式（storage 未被 shortcut 写过）
        const currentMode = overlayTimeDisp.layoutMode;
        const newMode = currentMode === 'float' ? 'snap' : 'float';
        tempToggle('layoutMode', newMode, currentMode);
        console.log(`[快捷键] 布局模式切换为: ${newMode === 'float' ? '浮动' : '磁吸'}`);
      }

      if (pressed === items.keyToggleVisibility) {
        e.preventDefault();
        e.stopPropagation();
        const inVideoFs = !!document.fullscreenElement;
        const settingKey = inVideoFs ? 'showWhenVideoFullscreen' : 'showOnFullscreen';
        // 从 widget 实例读取当前状态（storage 从未被 shortcut 写过）
        const currentVal = settingKey === 'showWhenVideoFullscreen'
          ? overlayTimeDisp.showWhenVideoFullscreen
          : overlayTimeDisp.showOnFullscreen;
        tempToggle(settingKey, !currentVal, currentVal);
        console.log(`[快捷键] 显示${!currentVal ? '开启' : '关闭'}`);
      }
    }
  );
});


