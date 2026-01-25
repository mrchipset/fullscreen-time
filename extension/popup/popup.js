// 获取checkbox元素
const showWhenVideoFullscreenCheckbox = document.getElementById('showWhenVideoFullscreen');
const showOnFullscreenCheckbox = document.getElementById('showOnFullscreen');

// 页面加载时，从存储中读取设置
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      showWhenVideoFullscreen: true,
      showOnFullscreen: true
    },
    (items) => {
      showWhenVideoFullscreenCheckbox.checked = items.showWhenVideoFullscreen;
      showOnFullscreenCheckbox.checked = items.showOnFullscreen;
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
