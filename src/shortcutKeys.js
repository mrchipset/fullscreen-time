/**
 * Canonical shortcut-key handling shared by the content script.
 *
 * Storage format (must match the settings recorder):
 *   Parts in order: Ctrl, Alt, Shift, Meta, then the normalized key.
 *   Joined with "+". Example: "Ctrl+Shift+ArrowUp".
 */

export const DEFAULT_KEY_TOGGLE_LAYOUT = 'F9';
export const DEFAULT_KEY_TOGGLE_VISIBILITY = 'F10';

const MODIFIER_ONLY_KEYS = [
  'Control',
  'Alt',
  'Shift',
  'Meta',
  'AltGraph',
  'OS'
];

function normalizeKeyName(key) {
  if (key === ' ') return 'Space';
  return key;
}

/**
 * Build the canonical key string for a KeyboardEvent.
 * Returns null for modifier-only presses and reserved keys (Escape).
 */
export function buildKeyString(event) {
  if (!event || MODIFIER_ONLY_KEYS.includes(event.key)) return null;
  if (event.key === 'Escape') return null;

  const parts = [];
  if (event.ctrlKey) parts.push('Ctrl');
  if (event.altKey) parts.push('Alt');
  if (event.shiftKey) parts.push('Shift');
  if (event.metaKey) parts.push('Meta');
  parts.push(normalizeKeyName(event.key));
  return parts.join('+');
}

/**
 * Returns true when keyboard shortcuts must not fire because the user is
 * typing into a form control or editable element.
 */
export function isEditableTarget(target) {
  if (!target || typeof target !== 'object') return false;

  const tagName = typeof target.tagName === 'string'
    ? target.tagName.toUpperCase()
    : '';

  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }

  return target.isContentEditable === true;
}
