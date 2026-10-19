// format time in seconds to mm:ss
export function formatTime(seconds) {
    const value = Number(seconds);
    // Live streams / not-yet-loaded media report Infinity or NaN — never render
    // "Infinity:NaN". Use a placeholder instead.
    if (!Number.isFinite(value) || value < 0) return '--:--';
    const total = Math.floor(value);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// check if fullscreen for browser (F11 / browser-level fullscreen)
export function checkIsBrowserFullscreen() {
    // Element/native fullscreen is handled separately; don't report browser
    // fullscreen while an element is fullscreen.
    const fsEl = document.fullscreenElement ||
                 document.webkitFullscreenElement ||
                 document.mozFullScreenElement ||
                 document.msFullscreenElement;
    if (fsEl) return false;

    // Small tolerance avoids zoom/DPI/taskbar rounding false negatives.
    const TOLERANCE = 2;
    return Math.abs(window.innerHeight - screen.height) <= TOLERANCE &&
           Math.abs(window.innerWidth - screen.width) <= TOLERANCE;
}
