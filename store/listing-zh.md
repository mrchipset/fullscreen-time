# Chrome Web Store 列表文案（中文）

## 名称

全屏时间显示 — Fullscreen Time

## 摘要（≤132 字符）

视频或浏览器全屏时，在屏幕顶部显示播放进度和系统时钟；支持自定义布局、快捷键与中英文界面。

## 详细描述

全屏时间显示（Fullscreen Time）是一款轻量的 Chrome / Edge 扩展。它会在视频全屏或浏览器全屏时，把当前播放进度和系统时钟叠加在屏幕顶部，让你不必退出全屏就能查看时间。

主要功能：

- 视频浮层：显示“当前播放时间 / 总时长 | 系统时间”，每秒更新。
- 浏览器或其他无视频全屏浮层：仅显示系统时钟。
- 显示秒数、显示播放进度、空闲自动隐藏均可独立开关。
- 固定顶部居中或浮动可拖动两种布局；浮动位置按视频/窗口分别记忆，可一键重置。
- 默认快捷键 F9 切换布局、F10 切换显示/隐藏；支持在设置页录制自定义组合键，并校验冲突与浏览器保留键。
- 中文 / English 双语界面，切换后弹窗、设置页、文档页与浮层同步更新。
- 支持 iframe 播放器、多视频页面、SPA 动态视频与直播流（直播进度显示为 `--:--`）。
- 深色模式、减少动态效果与键盘可访问性支持。

运行环境：

- Chrome 或 Edge（Chromium）114 及以上。
- 运行时不需要开发者服务器，不加载远程代码，不包含分析统计。
- 设置保存在 Chrome Sync 中，可能随登录同一 Chrome 账户的设备同步；开发者无法访问这些数据。

权限说明：

- `storage`：保存显示开关、布局、语言和快捷键绑定。
- 所有网站的内容脚本：检测页面视频和全屏状态，以显示浮层；不读取或上传网页正文、表单、浏览历史或视频内容。
- `all_frames` / `match_about_blank` / `match_origin_as_fallback`：支持 iframe、frame、embed、object 中的播放器。
- `_locales/*` 的 `web_accessible_resources`：内容脚本加载本地语言包。
- `file:///*`：支持本地视频文件全屏；需要在扩展详情中手动允许访问文件网址。

隐私与数据：

- 不收集、不出售、不向开发者或第三方发送数据。
- 不使用 Cookie、广告、跟踪脚本或远程分析。
- 仅在全屏显示期间读取当前视频的播放时间、总时长和系统时间。

开源与反馈：

- 源代码：https://github.com/mrchipset/fullscreen-time
- 问题反馈：https://github.com/mrchipset/fullscreen-time/issues
- 隐私政策：https://mrchipset.github.io/fullscreen-time/privacy-policy.html

## 分类

Productivity（生产力工具）

## 语言

中文（简体）、English

## 商店截图（1280×800）

1. `store/screenshots/01-overlay.png` — 视频全屏浮层
2. `store/screenshots/02-popup.png` — 弹窗设置
3. `store/screenshots/03-settings.png` — 快捷键设置

## 支持 URL

https://github.com/mrchipset/fullscreen-time/issues

## 主页 URL

https://github.com/mrchipset/fullscreen-time
