/**
 * Custom i18n module for standalone pages (popup, settings, doc).
 * Loads translations from _locales/{lang}/messages.json at runtime.
 * Falls back to chrome.i18n.getMessage() if locale fetch fails.
 */

(function() {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'zh_CN'];
  const STORAGE_KEY = 'language';
  const STORAGE_LISTENER_FLAG = '__fsI18nStorageListenerBound__';

  let _currentLang = null;
  let _translations = {};
  let _loadToken = 0;

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
    bindStorageListener();

    return new Promise((resolve) => {
      chrome.storage.sync.get(STORAGE_KEY, (items) => {
        const stored = items[STORAGE_KEY];
        const browserLang = navigator.language || 'en';
        // Map browser locale to our format: zh-CN → zh_CN, en-US → en
        const mapped = browserLang.replace('-', '_');
        const bestLang = stored || (SUPPORTED_LANGS.includes(mapped) ? mapped : 'en');

        loadLang(bestLang)
          .then(() => translateUI())
          .catch(() => {
            // translateUI still removes i18n-pending and applies fallbacks.
            translateUI();
          })
          .then(() => {
            // Make sure the pending style is gone even if translation setup
            // failed in an unexpected way.
            document.documentElement.classList.remove('i18n-pending');
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
      // Skip side effects if a newer request superseded this one.
      if (_currentLang !== lang) return;

      chrome.storage.sync.set({ [STORAGE_KEY]: lang });
      translateUI();
      // Dispatch event so other scripts (e.g., settings page) can react
      document.dispatchEvent(new CustomEvent('fs-time-lang-change', { detail: { lang } }));
    });
  }

  /**
   * React to language changes made by another page (popup ↔ settings ↔ doc).
   * Bound at most once per page even if this script is evaluated twice.
   */
  function bindStorageListener() {
    if (window[STORAGE_LISTENER_FLAG]) return;
    window[STORAGE_LISTENER_FLAG] = true;

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace !== 'sync' || !changes[STORAGE_KEY]) return;

      const lang = changes[STORAGE_KEY].newValue || 'en';

      // Already showing this language (e.g. switchLang's own storage write):
      // invalidate older in-flight loads but avoid a redundant translation.
      if (lang === _currentLang && Object.keys(_translations).length > 0) {
        _loadToken += 1;
        return;
      }

      loadLang(lang)
        .then(() => {
          translateUI();
          // Let pages re-render dynamic strings that are not data-i18n nodes.
          document.dispatchEvent(new CustomEvent('fs-time-lang-change', {
            detail: { lang: _currentLang || lang }
          }));
        })
        .catch(() => translateUI());
    });
  }

  /**
   * Load translations for a given language from _locales/{lang}/messages.json.
   */
  function loadLang(lang) {
    // Bump before the cache check so even a cached no-op invalidates any older
    // in-flight request.
    _loadToken += 1;
    const token = _loadToken;

    if (lang === _currentLang && Object.keys(_translations).length > 0) {
      return Promise.resolve();
    }

    // Slow initial loads must not overwrite a newer language request.
    const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
    return fetch(url)
      .then(resp => {
        if (!resp.ok) throw new Error(`Failed to load ${url}`);
        return resp.json();
      })
      .then(data => {
        if (token !== _loadToken) return;
        _translations = data;
        _currentLang = lang;
      })
      .catch(() => {
        if (token !== _loadToken) return;
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
    const lang = _currentLang || 'en';
    document.documentElement.lang = lang === 'zh_CN' ? 'zh-CN' : lang;

    // <title data-i18n="..."> needs document.title updated explicitly.
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const titleText = t(titleEl.dataset.i18n);
      titleEl.textContent = titleText;
      document.title = titleText;
    }

    // Keep the existing innerHTML translation for non-title elements.
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.tagName === 'TITLE') return;
      el.innerHTML = t(el.dataset.i18n);
    });

    document.documentElement.classList.remove('i18n-pending');
  }
})();
