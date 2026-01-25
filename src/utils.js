// format time in seconds to mm:ss
export function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// check if fullscreen for browser
export function checkIsBrowserFullscreen() {
    return window.innerHeight === screen.height && window.innerWidth === screen.width;
}