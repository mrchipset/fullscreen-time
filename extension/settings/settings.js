'use strict';

const STORAGE_DEFAULTS = Object.freeze({
  keyToggleLayout: 'F9',
  keyToggleVisibility: 'F10'
});

const ACTIONS = Object.freeze({
  keyToggleLayout: {
    inputId: 'keyToggleLayoutInput',
    badgeId: 'keyToggleLayoutBadge',
    defaultId: 'keyToggleLayoutDefault',
    labelKey: 'labelToggleLayout'
  },
  keyToggleVisibility: {
    inputId: 'keyToggleVisibilityInput',
    badgeId: 'keyToggleVisibilityBadge',
    defaultId: 'keyToggleVisibilityDefault',
    labelKey: 'labelToggleVisibility'
  }
});

const RESERVED_SHORTCUTS = new Set([
  'f5',
  'f11',
  'f12',
  'ctrl+r',
  'ctrl+w',
  'ctrl+t',
  'ctrl+n',
  'ctrl+shift+i',
  'ctrl+shift+j',
  'ctrl+shift+c',
  'ctrl+shift+t',
  'ctrl+shift+n',
  'ctrl+tab',
  'alt+arrowleft',
  'alt+arrowright',
  'ctrl+l',
  'ctrl+f',
  'ctrl+p',
  'ctrl+s',
  'ctrl+o',
  'f1',
  'f3',
  'f6'
]);

const MODIFIER_KEYS = new Set(['Control', 'Alt', 'Shift', 'Meta', 'AltGraph', 'OS']);

const MODIFIER_ORDER = ['Ctrl', 'Alt', 'Shift', 'Meta'];

const DISPLAY_KEY_NAMES = Object.freeze({
  ' ': 'Space',
  Space: 'Space',
  Escape: 'Esc',
  Backspace: 'Backspace',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→'
});

const bindings = {
  keyToggleLayout: STORAGE_DEFAULTS.keyToggleLayout,
  keyToggleVisibility: STORAGE_DEFAULTS.keyToggleVisibility
};

const controls = {};
let activeRecorder = null;
let statusElement = null;
let resetButton = null;
let closeButton = null;

function formatMessage(key, values) {
  return i18n.t(key).replace(/\{(\w+)\}/g, (match, name) => {
    return Object.prototype.hasOwnProperty.call(values || {}, name)
      ? String(values[name])
      : match;
  });
}

function getActionLabel(key) {
  return i18n.t(ACTIONS[key].labelKey);
}

function normalizeLegacyShortcut(value) {
  if (typeof value !== 'string') return value;
  if (value === ' ' || value === '+ ') return 'Space';
  if (value.endsWith('+ ')) return `${value.slice(0, -2)}+Space`;
  return value;
}

function formatShortcutForDisplay(shortcut) {
  if (!shortcut) return '';

  let remainder = shortcut;
  const parts = [];

  MODIFIER_ORDER.forEach((modifier) => {
    const prefix = `${modifier}+`;

    if (remainder.startsWith(prefix)) {
      parts.push(modifier);
      remainder = remainder.slice(prefix.length);
    }
  });

  parts.push(DISPLAY_KEY_NAMES[remainder] || remainder);
  return parts.join('+');
}

function setStatus(key, values, tone) {
  statusElement.textContent = formatMessage(key, values);
  statusElement.dataset.tone = tone || 'neutral';
}

function setBadge(key, state) {
  const badge = controls[key].badge;

  if (!state) {
    badge.hidden = true;
    badge.textContent = '';
    badge.removeAttribute('data-state');
    return;
  }

  badge.hidden = false;
  badge.dataset.state = state;
  badge.textContent = state === 'recording'
    ? i18n.t('stateRecording')
    : i18n.t('shortcutUnbound');
}

function renderRow(key) {
  const control = controls[key];
  const value = bindings[key];
  const isRecording = activeRecorder === key;
  const isUnbound = !isRecording && !value;

  control.input.classList.toggle('is-recording', isRecording);
  control.input.classList.toggle('is-unbound', isUnbound);
  control.input.dataset.state = isRecording ? 'recording' : (value ? 'bound' : 'unbound');
  control.defaultElement.textContent = STORAGE_DEFAULTS[key];

  if (isRecording) {
    control.input.value = i18n.t('placeholderRecording');
  } else if (isUnbound) {
    control.input.value = i18n.t('shortcutUnbound');
  } else {
    control.input.value = formatShortcutForDisplay(value);
  }

  setBadge(key, isRecording ? 'recording' : (isUnbound ? 'unbound' : null));
}

function startRecording(key) {
  if (activeRecorder === key) return;

  if (activeRecorder) {
    cancelRecording(activeRecorder, true);
  }

  activeRecorder = key;
  renderRow(key);
  setStatus('statusRecording', { label: getActionLabel(key) }, 'neutral');
}

function cancelRecording(key, announce) {
  if (activeRecorder !== key) return;

  activeRecorder = null;
  renderRow(key);

  if (announce) {
    setStatus('statusCanceled', { label: getActionLabel(key) }, 'neutral');
  }
}

function normalizeKey(event) {
  if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Space') {
    return 'Space';
  }

  return event.key;
}

function buildShortcut(event) {
  const key = normalizeKey(event);

  if (MODIFIER_KEYS.has(key)) {
    return null;
  }

  const parts = [];

  if (event.ctrlKey) parts.push('Ctrl');
  if (event.altKey) parts.push('Alt');
  if (event.shiftKey) parts.push('Shift');
  if (event.metaKey) parts.push('Meta');

  parts.push(key);
  return parts.join('+');
}

function isReservedShortcut(shortcut) {
  return RESERVED_SHORTCUTS.has(shortcut.toLowerCase());
}

function findConflict(key, shortcut) {
  const otherKey = key === 'keyToggleLayout'
    ? 'keyToggleVisibility'
    : 'keyToggleLayout';

  return bindings[otherKey] === shortcut ? otherKey : null;
}

function saveBinding(key, shortcut) {
  bindings[key] = shortcut;
  activeRecorder = null;
  renderRow(key);
  setStatus('statusSaved', {
    label: getActionLabel(key),
    binding: formatShortcutForDisplay(shortcut)
  }, 'success');

  chrome.storage.sync.set({ [key]: shortcut });
}

function clearBinding(key) {
  bindings[key] = '';
  activeRecorder = null;
  renderRow(key);
  setStatus('statusUnbound', { label: getActionLabel(key) }, 'success');

  chrome.storage.sync.set({ [key]: '' });
}

function handleKeydown(event, key) {
  if (activeRecorder !== key) return;

  // Never store a key that belongs to an active IME composition.
  if (
    event.isComposing === true ||
    event.keyCode === 229 ||
    event.key === 'Process' ||
    event.key === 'Unidentified'
  ) {
    return;
  }

  // Let Tab move focus out of the field; blur restores the stored binding.
  if (event.key === 'Tab') return;

  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    cancelRecording(key, true);
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (event.repeat) return;

  if (event.key === 'Delete' || event.key === 'Backspace') {
    clearBinding(key);
    return;
  }

  const shortcut = buildShortcut(event);

  // Modifier-only presses are not shortcuts.
  if (!shortcut) return;

  if (isReservedShortcut(shortcut)) {
    setStatus('statusReserved', {
      binding: formatShortcutForDisplay(shortcut)
    }, 'error');
    return;
  }

  const conflictKey = findConflict(key, shortcut);

  if (conflictKey) {
    setStatus('statusConflict', {
      binding: formatShortcutForDisplay(shortcut),
      label: getActionLabel(conflictKey)
    }, 'error');
    return;
  }

  saveBinding(key, shortcut);
}

function resetBindings() {
  if (activeRecorder) {
    const recordingKey = activeRecorder;
    activeRecorder = null;
    renderRow(recordingKey);
  }

  Object.keys(STORAGE_DEFAULTS).forEach((key) => {
    bindings[key] = STORAGE_DEFAULTS[key];
    renderRow(key);
  });

  chrome.storage.sync.set({ ...STORAGE_DEFAULTS });
  setStatus('statusDefaultsRestored', {}, 'success');
}

function closePage() {
  window.close();

  window.setTimeout(() => {
    if (!window.closed) {
      history.back();
    }
  }, 80);
}

function loadBindings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(Object.keys(STORAGE_DEFAULTS), (items) => {
      const stored = items || {};
      const updates = {};

      Object.keys(STORAGE_DEFAULTS).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(stored, key)) {
          bindings[key] = STORAGE_DEFAULTS[key];
          updates[key] = STORAGE_DEFAULTS[key];
          return;
        }

        if (typeof stored[key] !== 'string') {
          bindings[key] = STORAGE_DEFAULTS[key];
          return;
        }

        bindings[key] = normalizeLegacyShortcut(stored[key]);

        if (bindings[key] !== stored[key]) {
          updates[key] = bindings[key];
        }
      });

      if (Object.keys(updates).length > 0) {
        chrome.storage.sync.set(updates);
      }

      Object.keys(ACTIONS).forEach(renderRow);
      resolve();
    });
  });
}

function setupStorageListener() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;

    Object.keys(STORAGE_DEFAULTS).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(changes, key)) return;

      const newValue = changes[key].newValue;

      bindings[key] = typeof newValue === 'string'
        ? normalizeLegacyShortcut(newValue)
        : STORAGE_DEFAULTS[key];

      // Keep an in-progress recording on this row untouched.
      if (activeRecorder !== key) {
        renderRow(key);
      }
    });
  });
}

function cacheElements() {
  Object.keys(ACTIONS).forEach((key) => {
    const action = ACTIONS[key];

    controls[key] = {
      input: document.getElementById(action.inputId),
      badge: document.getElementById(action.badgeId),
      defaultElement: document.getElementById(action.defaultId)
    };
  });

  statusElement = document.getElementById('shortcutStatus');
  resetButton = document.getElementById('resetDefaultsButton');
  closeButton = document.getElementById('closeButton');
}

function bindEvents() {
  Object.keys(ACTIONS).forEach((key) => {
    const input = controls[key].input;

    input.addEventListener('focus', () => startRecording(key));
    input.addEventListener('click', () => startRecording(key));

    input.addEventListener('blur', () => {
      if (activeRecorder === key) {
        cancelRecording(key, true);
      }
    });

    input.addEventListener('keydown', (event) => handleKeydown(event, key));
  });

  resetButton.addEventListener('click', resetBindings);
  closeButton.addEventListener('click', closePage);
}

async function init() {
  cacheElements();
  await i18n.init();

  document.documentElement.lang = i18n.getCurrentLang() === 'zh_CN' ? 'zh-CN' : 'en';

  await loadBindings();
  bindEvents();
  setupStorageListener();
  setStatus('statusReady');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
