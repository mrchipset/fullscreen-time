// 获取checkbox元素
const showWhenVideoFullscreenCheckbox = document.getElementById('showWhenVideoFullscreen');
const showOnFullscreenCheckbox = document.getElementById('showOnFullscreen');
const showSecondsCheckbox = document.getElementById('showSeconds');
const showProgressCheckbox = document.getElementById('showProgress');
const autoHideCheckbox = document.getElementById('autoHide');

// 页面加载时，从存储中读取设置
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      showWhenVideoFullscreen: true,
      showOnFullscreen: true,
      showSeconds: true,
      showProgress: true,
      autoHide: false
    },
    (items) => {
      showWhenVideoFullscreenCheckbox.checked = items.showWhenVideoFullscreen;
      showOnFullscreenCheckbox.checked = items.showOnFullscreen;
      showSecondsCheckbox.checked = items.showSeconds;
      showProgressCheckbox.checked = items.showProgress;
      autoHideCheckbox.checked = items.autoHide;
    }
  );
});

// 监听checkbox变化
showWhenVideoFullscreenCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showWhenVideoFullscreen: event.target.checked });
  console.log('Show when video fullscreen:', event.target.checked);
});

showOnFullscreenCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showOnFullscreen: event.target.checked });
  console.log('Show on fullscreen:', event.target.checked);
});

showSecondsCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showSeconds: event.target.checked });
  console.log('Show seconds:', event.target.checked);
});

showProgressCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showProgress: event.target.checked });
  console.log('Show progress:', event.target.checked);
});

autoHideCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ autoHide: event.target.checked });
  console.log('Auto hide:', event.target.checked);
});

// 打开文档按钮
document.getElementById('openDocButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('doc.html') });
});
