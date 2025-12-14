import { formatTime } from './utils';

console.log("hello world!");

function scanForMedia(document) {
  const mediaTagSelector = 'video';
  
  // ① 查找普通DOM中的video/audio标签
  const regularMedia = document.querySelectorAll(mediaTagSelector);
  
//   // ② 递归查找Shadow DOM中的video标签
//   const shadowMedia = findShadowMedia(document, mediaTagSelector);
  
//   // ③ 查找网站特定的视频元素
//   const siteSpecificMedia = this.siteHandler.detectSpecialVideos(document);
  
//   // ④ 过滤掉需要忽略的视频
//   return filteredMedia;
    return regularMedia;
}

function inject() {
  const medias = scanForMedia(document);
  if (medias === undefined || medias.length === 0) {
    console.warn("No media elements found.");
    setTimeout(inject, 2000); // retry after 2 seconds
    return;
  }
  // 输出找到的媒体元素
  console.log("Found media elements:", medias);

  // create a time element at the middle of top the media element
  // only show the time element when the media is fullscreen
  medias.forEach(media => {
  const timeElement = document.createElement('div');
  timeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  timeElement.style.color = 'white';
  timeElement.style.padding = '5px';
  timeElement.style.borderRadius = '5px';
  timeElement.style.zIndex = '999999';
  timeElement.innerText = '00:00 / 00:00'; // Placeholder text

  // hidden by default — will only be shown when this media is fullscreen
  timeElement.style.display = 'none';

  function showFullscreen() {
    timeElement.style.position = 'absolute';
    timeElement.style.top = '10px';
    timeElement.style.left = '50%';
    timeElement.style.transform = 'translateX(-50%)';
    if (timeElement.parentElement !== media.parentElement) media.parentElement.appendChild(timeElement);
    timeElement.style.display = 'block';
    timeElement.style.zIndex = '999999';
  }

  function hide() {
    timeElement.style.display = 'none';
    if (timeElement.parentElement === media.parentElement) media.parentElement.removeChild(timeElement);
  }

  function updateVisibility() {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    const isFull = fsEl && (fsEl === media || fsEl.contains(media) || media.contains(fsEl));
    if (isFull) showFullscreen();
    else hide();
  }



  // add a function to update the time element
  function updateTime() {
    const currentTime = media.currentTime;
    const duration = media.duration;
    timeElement.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    // obtain the current system time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const systemTime = `${hours}:${minutes}:${seconds}`;
    timeElement.innerText += ` | ${systemTime}`;
  }

  // update time every second if the media is fullscreen
  setInterval(() => {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    const isFull = fsEl && (fsEl === media || fsEl.contains(media) || media.contains(fsEl));
    if (isFull) updateTime();
  }, 1000);

  // initial check in case the media is already fullscreen
  updateVisibility();
//   showFullscreen();
  // standard and vendor-prefixed fullscreen change events
  document.addEventListener('fullscreenchange', updateVisibility);
  document.addEventListener('webkitfullscreenchange', updateVisibility);
  document.addEventListener('mozfullscreenchange', updateVisibility);
  document.addEventListener('MSFullscreenChange', updateVisibility);
  });
}

// // 等待DOM加载完成后执行
// document.addEventListener('DOMContentLoaded', () => {
//   console.log("DOM fully loaded and parsed");
//   // 执行注入函数
//   indject();
// });

inject();