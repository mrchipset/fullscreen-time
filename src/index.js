import { formatTime, checkIsBrowserFullscreen } from './utils';
import { TimeDisplay, WindowOverlayTimeDisplay } from './widgets';

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

function injectForMedias() {
  const medias = scanForMedia(document);
  if (medias === undefined || medias.length === 0) {
    console.warn("No media elements found.");
    setTimeout(injectForMedias, 2000); // retry after 2 seconds
    return;
  }
  // 输出找到的媒体元素
  console.log("Found media elements:", medias);

  // 为每个媒体元素创建时间显示
  medias.forEach(media => {
    new TimeDisplay(media);
  });
}


injectForMedias();
const overlayTimeDisp = new WindowOverlayTimeDisplay(document.body);

window.addEventListener('resize', () => {
  if (checkIsBrowserFullscreen()) {
    overlayTimeDisp.show();
    console.log('Browser is in fullscreen mode');
  } else {
    overlayTimeDisp.hide();
    console.log('Browser is not in fullscreen mode');
  }
});


