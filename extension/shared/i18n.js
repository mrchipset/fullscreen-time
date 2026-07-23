/**
 * Custom i18n module for standalone pages (popup, settings).
 * Loads translations from _locales/{lang}/messages.json at runtime.
 * Falls back to chrome.i18n.getMessage() if locale fetch fails.
 */

(function() {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'zh_CN'];
  const STORAGE_KEY = 'language';

  let _currentLang = null;
  let _translations = {};

  // Public API
  window.i18n = {
    t: t,
    getCurrentLang: getCurrentLang,
    switchLang: switchLang,
    init: init,
    SUPPORTED_LANGS: SUPPORTED_LANGS
  };

  /**
   * Translate a message key.
   * Falls back to chrome.i18n.getMessage() if custom translation not loaded.
   */
  function t(key) {
    if (_translations[key] && _translations[key].message) {
      return _translations[key].message;
    }
    // Fallback to Chrome i18n
    try {
      return chrome.i18n.getMessage(key) || key;
    } catch(e) {
      return key;
    }
  }

  function getCurrentLang() {
    return _currentLang;
  }

  /**
   * Initialize i18n: read stored language, load translations, translate UI.
   * Returns a promise that resolves when translations are loaded.
   */
  function init() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(STORAGE_KEY, (items) => {
        const stored = items[STORAGE_KEY];
        const browserLang = navigator.language || 'en';
        // Map browser locale to our format: zh-CN → zh_CN, en-US → en
        const mapped = browserLang.replace('-', '_');
        const bestLang = stored || (SUPPORTED_LANGS.includes(mapped) ? mapped : 'en');
        
        loadLang(bestLang).then(() => {
          translateUI();
          resolve();
        });
      });
    });
  }

  /**
   * Switch to a different language, save to storage, re-translate UI.
   */
  function switchLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return Promise.resolve();
    return loadLang(lang).then(() => {
      chrome.storage.sync.set({ [STORAGE_KEY]: lang });
      translateUI();
      // Dispatch event so other scripts (e.g., settings page) can react
      document.dispatchEvent(new CustomEvent('fs-time-lang-change', { detail: { lang } }));
    });
  }

  /**
   * Load translations for a given language from _locales/{lang}/messages.json.
   */
  function loadLang(lang) {
    if (lang === _currentLang && Object.keys(_translations).length > 0) {
      return Promise.resolve();
    }
    const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
    return fetch(url)
      .then(resp => {
        if (!resp.ok) throw new Error(`Failed to load ${url}`);
        return resp.json();
      })
      .then(data => {
        _translations = data;
        _currentLang = lang;
      })
      .catch(() => {
        // Fallback: try English
        if (lang !== 'en') {
          return loadLang('en');
        }
        _translations = {};
        _currentLang = 'en';
      });
  }

  /**
   * Translate all elements with data-i18n attribute.
   */
  function translateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
  }
})();
