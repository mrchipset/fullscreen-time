/**
 * Custom i18n module for content script (webpack-bundled).
 * Loads translations from _locales/{lang}/messages.json at runtime.
 */

const SUPPORTED_LANGS = ['en', 'zh_CN'];
const STORAGE_KEY = 'language';

let _currentLang = null;
let _translations = {};
let _initPromise = null;
let _loadToken = 0;

/**
 * Translate a message key.
 */
export function t(key) {
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

export function getCurrentLang() {
  return _currentLang;
}

/**
 * Initialize i18n: read stored language, load translations.
 * Can be called multiple times safely — returns same promise on subsequent calls.
 */
export function init() {
  if (_initPromise) return _initPromise;
  _initPromise = new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEY, (items) => {
      const stored = items[STORAGE_KEY];
      const browserLang = navigator.language || 'en';
      const mapped = browserLang.replace('-', '_');
      const bestLang = stored || (SUPPORTED_LANGS.includes(mapped) ? mapped : 'en');
      loadLang(bestLang).then(() => resolve());
    });
  });
  return _initPromise;
}

/**
 * Reload translations for a different language (called when storage changes).
 */
export function reloadFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(STORAGE_KEY, (items) => {
      const lang = items[STORAGE_KEY] || _currentLang || 'en';
      if (lang !== _currentLang) {
        loadLang(lang).then(() => resolve(true));
      } else {
        // Invalidate any older in-flight load, even when the requested
        // language is already the current one.
        _loadToken += 1;
        resolve(false);
      }
    });
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
      if (lang !== 'en') return loadLang('en');
      _translations = {};
      _currentLang = 'en';
    });
}
