// 获取checkbox元素
const showWhenVideoFullscreenCheckbox = document.getElementById('showWhenVideoFullscreen');
const showOnFullscreenCheckbox = document.getElementById('showOnFullscreen');
const showSecondsCheckbox = document.getElementById('showSeconds');

// 页面加载时，从存储中读取设置
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      showWhenVideoFullscreen: true,
      showOnFullscreen: true,
      showSeconds: true
    },
    (items) => {
      showWhenVideoFullscreenCheckbox.checked = items.showWhenVideoFullscreen;
      showOnFullscreenCheckbox.checked = items.showOnFullscreen;
      showSecondsCheckbox.checked = items.showSeconds;
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

// 打开文档按钮
document.getElementById('openDocButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('doc.html') });
});
