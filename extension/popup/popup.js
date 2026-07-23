// 获取checkbox元素
const showWhenVideoFullscreenCheckbox = document.getElementById('showWhenVideoFullscreen');
const showOnFullscreenCheckbox = document.getElementById('showOnFullscreen');
const showSecondsCheckbox = document.getElementById('showSeconds');
const showProgressCheckbox = document.getElementById('showProgress');
const autoHideCheckbox = document.getElementById('autoHide');
const layoutSnapRadio = document.getElementById('layoutSnap');
const layoutFloatRadio = document.getElementById('layoutFloat');
const langSelector = document.getElementById('langSelector');

// 页面加载时
document.addEventListener('DOMContentLoaded', () => {
  // 初始化自定义 i18n（异步加载翻译）
  i18n.init().then(() => {
    // 设置语言选择器的值为当前语言
    langSelector.value = i18n.getCurrentLang();
  });

  chrome.storage.sync.get(
    {
      showWhenVideoFullscreen: true,
      showOnFullscreen: true,
      showSeconds: true,
      showProgress: true,
      autoHide: false,
      layoutMode: 'snap'
    },
    (items) => {
      showWhenVideoFullscreenCheckbox.checked = items.showWhenVideoFullscreen;
      showOnFullscreenCheckbox.checked = items.showOnFullscreen;
      showSecondsCheckbox.checked = items.showSeconds;
      showProgressCheckbox.checked = items.showProgress;
      autoHideCheckbox.checked = items.autoHide;
      if (items.layoutMode === 'float') {
        layoutFloatRadio.checked = true;
      } else {
        layoutSnapRadio.checked = true;
      }
    }
  );
});

// 语言切换
langSelector.addEventListener('change', (e) => {
  i18n.switchLang(e.target.value);
});

// 监听checkbox变化
showWhenVideoFullscreenCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showWhenVideoFullscreen: event.target.checked });
  console.log(i18n.t('msgVideoFullscreenChanged'), event.target.checked);
});

showOnFullscreenCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showOnFullscreen: event.target.checked });
  console.log(i18n.t('msgFullscreenChanged'), event.target.checked);
});

showSecondsCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showSeconds: event.target.checked });
  console.log(i18n.t('msgSecondsChanged'), event.target.checked);
});

showProgressCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showProgress: event.target.checked });
  console.log(i18n.t('msgProgressChanged'), event.target.checked);
});

autoHideCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ autoHide: event.target.checked });
  console.log(i18n.t('msgAutoHideChanged'), event.target.checked);
});

layoutSnapRadio.addEventListener('change', () => {
  if (layoutSnapRadio.checked) {
    chrome.storage.sync.set({ layoutMode: 'snap' });
    console.log(i18n.t('msgLayoutSnapped'));
  }
});

layoutFloatRadio.addEventListener('change', () => {
  if (layoutFloatRadio.checked) {
    chrome.storage.sync.set({ layoutMode: 'float' });
    console.log(i18n.t('msgLayoutFloated'));
  }
});

// 打开设置页面
document.getElementById('openSettingsButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings/settings.html') });
});

// 打开文档按钮
document.getElementById('openDocButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('doc.html') });
});

// 打开隐私政策
document.getElementById('openPrivacyButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('doc.html#privacy') });
});
