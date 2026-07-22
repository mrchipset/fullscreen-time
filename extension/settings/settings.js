const keyToggleLayoutInput = document.getElementById('keyToggleLayoutInput');
const keyToggleVisibilityInput = document.getElementById('keyToggleVisibilityInput');

// 将 KeyboardEvent 转为可读按键名
function keyEventToString(e) {
  const parts = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  // e.key 可能为 'Control', 'Alt', 'Shift' 单独按下时忽略修饰键本身
  const key = e.key;
  if (key === 'Control' || key === 'Alt' || key === 'Shift' || key === 'Meta') {
    return null;
  }
  parts.push(key);
  return parts.join('+');
}

// 快捷键录制逻辑
function setupShortcutRecorder(input, storageKey) {
  let recording = false;

  input.addEventListener('click', () => {
    recording = true;
    input.value = '请按快捷键...';
    input.classList.add('recording');
  });

  input.addEventListener('blur', () => {
    if (recording) {
      recording = false;
      input.classList.remove('recording');
      // 失去焦点时重新显示当前值
      chrome.storage.sync.get(storageKey, (items) => {
        input.value = items[storageKey] || '';
      });
    }
  });

  input.addEventListener('keydown', (e) => {
    if (!recording) return;
    e.preventDefault();
    e.stopPropagation();

    const keyStr = keyEventToString(e);
    if (!keyStr) return; // 忽略单独的修饰键

    recording = false;
    input.classList.remove('recording');
    input.value = keyStr;
    chrome.storage.sync.set({ [storageKey]: keyStr });
  });
}

// 加载存储值
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    {
      keyToggleLayout: 'F9',
      keyToggleVisibility: 'F10'
    },
    (items) => {
      keyToggleLayoutInput.value = items.keyToggleLayout;
      keyToggleVisibilityInput.value = items.keyToggleVisibility;
    }
  );
});

// 绑定快捷键录制
setupShortcutRecorder(keyToggleLayoutInput, 'keyToggleLayout');
setupShortcutRecorder(keyToggleVisibilityInput, 'keyToggleVisibility');
