# 隐私政策 / Privacy Policy

**软件名称：** 全屏时间显示（Fullscreen Time）
**版本：** V1.0.0
**生效日期：** 2026-10-19

## 1. 适用范围

本隐私政策适用于“全屏时间显示”（Fullscreen Time）Chrome / Edge 扩展（以下简称“本软件”）。本软件在视频全屏、浏览器全屏或非视频元素全屏时显示播放进度和系统时间。

## 2. 我们不收集的数据

本软件不收集、不出售、不向开发者或第三方传输以下数据：

- 个人身份信息、联系方式、账号信息；
- 网页正文、表单内容、搜索记录、浏览历史；
- Cookie、广告标识符、设备标识符、IP 地址或位置信息；
- 视频文件、视频画面、音频或视频内容；
- 使用统计、崩溃日志或分析数据。

本软件不包含开发者服务器、广告 SDK、跟踪脚本或远程分析服务。

## 3. 本地读取的数据

为了在全屏时显示播放进度，本软件会在用户进入全屏播放期间读取当前页面中 `<video>` 元素的以下信息：

- 当前播放时间；
- 视频总时长（直播或未加载完成时可能不可用）；
- 当前系统时间。

这些信息仅在浏览器本地用于计算浮层显示内容，不会被上传、保存到开发者服务器或与第三方共享。

## 4. 设置的保存与同步

本软件使用 `chrome.storage.sync` 保存以下设置：

- 显示开关（视频浮层、浏览器/无视频全屏浮层、秒数、播放进度、空闲自动隐藏）；
- 布局模式与浮动位置；
- 界面语言；
- 快捷键绑定。

如果用户登录 Chrome 并启用同步，这些设置可能通过 Google Chrome Sync 在登录同一账户的设备之间同步。Chrome Sync 由用户账户与 Google 管理，开发者无法访问其中的数据。用户可以在 Chrome 同步设置中管理或清除这些数据；卸载扩展或清除扩展数据也会删除本地设置。

## 5. 权限说明

- `storage`：保存上述设置。
- 所有网站的内容脚本：检测页面视频与全屏状态，以显示浮层；不读取或上传网页正文、表单、浏览历史或视频内容。
- `all_frames` / `match_about_blank` / `match_origin_as_fallback`：支持 iframe、frame、embed、object 中的播放器。
- `web_accessible_resources` 的 `_locales/*`：内容脚本读取扩展本地语言包。
- `file:///*`：支持本地视频文件全屏；用户需在扩展详情中手动允许访问文件网址，未允许时本软件不会访问本地文件。

## 6. 第三方服务

本软件运行时不调用开发者服务器，不加载远程脚本，不集成第三方统计、广告或数据分析服务。Chrome Sync 属于浏览器提供的可选同步功能，受 Google 的隐私政策约束。

## 7. 儿童隐私

本软件不面向儿童收集任何个人信息，也不包含广告或社交功能。

## 8. 数据保留与删除

本软件不保留开发者侧数据。设置保存在用户浏览器的 `chrome.storage.sync` 中；用户可通过 Chrome 同步设置清除，或通过卸载扩展删除本地数据。

## 9. 政策变更

如果未来版本增加网络请求、数据处理或新的权限，我们会在扩展页面和本政策中明确说明，并在必要时更新版本号与生效日期。

## 10. 联系方式

如有隐私相关问题，请通过以下地址提交：

https://github.com/mrchipset/fullscreen-time/issues

---

# Privacy Policy (English)

**Software:** Fullscreen Time
**Version:** V1.0.0
**Effective date:** 2026-10-19

Fullscreen Time is a Chrome/Edge extension that shows playback progress and the system clock while a video, the browser, or a non-video element is fullscreen.

We do not collect, sell, or transmit personal data, page content, forms, browsing history, cookies, device identifiers, IP addresses, location data, video content, analytics, or crash logs. There is no developer server, advertising SDK, tracking script, or remote analytics.

While a video is fullscreen, the extension reads the current playback time, duration (when available), and system time locally to render the overlay. These values are not uploaded or shared.

Settings (display toggles, layout, float positions, language, shortcut bindings) are stored in `chrome.storage.sync`. If Chrome Sync is enabled, settings may sync across devices signed into the same Chrome account; the developer cannot access them. Users can clear them in Chrome Sync settings or by uninstalling the extension.

Permissions: `storage` saves settings; the content script on all sites detects videos and fullscreen state; `all_frames`, `match_about_blank`, and `match_origin_as_fallback` support embedded players; `_locales/*` web-accessible resources provide local language files; `file:///*` supports local video files only when the user explicitly allows file URL access.

No third-party analytics or remote code is used. Chrome Sync is an optional browser feature governed by Google's privacy policy.

Contact: https://github.com/mrchipset/fullscreen-time/issues
