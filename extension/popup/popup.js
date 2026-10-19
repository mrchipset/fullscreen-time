// 获取checkbox元素
const showWhenVideoFullscreenCheckbox = document.getElementById('showWhenVideoFullscreen');
const showOnFullscreenCheckbox = document.getElementById('showOnFullscreen');
const showSecondsCheckbox = document.getElementById('showSeconds');
const showProgressCheckbox = document.getElementById('showProgress');
const autoHideCheckbox = document.getElementById('autoHide');
const layoutSnapRadio = document.getElementById('layoutSnap');
const layoutFloatRadio = document.getElementById('layoutFloat');
const langSelector = document.getElementById('langSelector');
const resetFloatButton = document.getElementById('resetFloatButton');
const resetFloatStatus = document.getElementById('resetFloatStatus');
const PRIVACY_POLICY_URL = 'https://mrchipset.github.io/fullscreen-time/privacy-policy.html';

let resetStatusTimer = null;

function clearResetStatusTimer() {
  if (resetStatusTimer) {
    clearTimeout(resetStatusTimer);
    resetStatusTimer = null;
  }
}

function showResetStatus(messageKey) {
  clearResetStatusTimer();
  resetFloatStatus.textContent = i18n.t(messageKey);
  resetStatusTimer = setTimeout(() => {
    resetFloatStatus.textContent = '';
    resetStatusTimer = null;
  }, 3000);
}

// 页面加载时
document.addEventListener('DOMContentLoaded', () => {
  // 初始化自定义 i18n（异步加载翻译）
  i18n.init()
    .then(() => {
      langSelector.value = i18n.getCurrentLang();
      document.documentElement.lang = i18n.getCurrentLang() === 'zh_CN' ? 'zh-CN' : 'en';
    })
    .finally(() => {
      document.documentElement.classList.remove('i18n-pending');
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
  i18n.switchLang(e.target.value).then(() => {
    document.documentElement.lang = e.target.value === 'zh_CN' ? 'zh-CN' : 'en';
  });
  clearResetStatusTimer();
  resetFloatStatus.textContent = '';
});

// 监听checkbox变化
showWhenVideoFullscreenCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showWhenVideoFullscreen: event.target.checked });
});

showOnFullscreenCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showOnFullscreen: event.target.checked });
});

showSecondsCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showSeconds: event.target.checked });
});

showProgressCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ showProgress: event.target.checked });
});

autoHideCheckbox.addEventListener('change', (event) => {
  chrome.storage.sync.set({ autoHide: event.target.checked });
});

layoutSnapRadio.addEventListener('change', () => {
  if (layoutSnapRadio.checked) {
    chrome.storage.sync.set({ layoutMode: 'snap' });
  }
});

layoutFloatRadio.addEventListener('change', () => {
  if (layoutFloatRadio.checked) {
    chrome.storage.sync.set({ layoutMode: 'float' });
  }
});

// 重置浮动位置
resetFloatButton.addEventListener('click', () => {
  chrome.storage.sync.remove(
    ['floatPositionVideo', 'floatPositionWindow', 'floatPosition'],
    () => {
      showResetStatus('statusFloatPositionReset');
    }
  );
});

// 打开设置页面
document.getElementById('openSettingsButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings/settings.html') });
});

// 打开文档按钮
document.getElementById('openDocButton').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('doc.html') });
});

// 打开隐私政策（公开页面，供商店审核与安装前查看）
document.getElementById('openPrivacyButton').addEventListener('click', () => {
  chrome.tabs.create({ url: PRIVACY_POLICY_URL });
});
