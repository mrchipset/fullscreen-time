document.addEventListener('DOMContentLoaded', () => {
  i18n.init()
    .then(() => {
      document.documentElement.lang = i18n.getCurrentLang() === 'zh_CN' ? 'zh-CN' : 'en';
    })
    .finally(() => {
      document.documentElement.classList.remove('i18n-pending');
    });
});
