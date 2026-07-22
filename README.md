# Fullscreen Time

Chrome 扩展（Manifest V3），在视频全屏或浏览器全屏时叠加显示系统时间浮层，支持快捷键操作。

## 功能

- 视频全屏时显示：`当前播放时间 / 总时长 | HH:MM:SS`
- 浏览器全屏（F11）时显示：`HH:MM:SS`
- 磁吸 / 浮动两种布局模式，浮动模式支持拖拽
- 可配置快捷键：切换布局模式、切换显示/隐藏
- 自定义显示：秒数、播放进度、闲置自动隐藏

## 安装

1. 打开 `chrome://extensions`
2. 开启右上角的「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `extension/` 目录

## 构建

```bash
pnpm run build-dev    # 开发构建（未压缩，含 sourcemap）
pnpm run build-prod   # 生产构建（压缩）
pnpm run watch        # 开发 + 监听模式
pnpm run clean        # 清理构建产物
```

> 使用 `pnpm`，不要用 `npm` 或 `yarn`。

## 项目结构

```
extension/
├── manifest.json       # MV3 清单
├── content.js          # 构建产物（Git 跟踪）
├── background.js       # Service Worker（预留）
├── popup/
│   ├── popup.html      # 弹出设置面板
│   └── popup.js        # 设置读写逻辑
├── settings/
│   ├── settings.html   # 快捷键设置页
│   └── settings.js     # 快捷键录制逻辑
└── icons/              # 图标资源

src/
├── index.js            # Webpack 入口 — 内容脚本
├── utils.js            # 工具函数
└── widgets.js          # 时间浮层组件
```

## 快捷键

默认快捷键可通过扩展图标 → 快捷键设置页面自定义。

| 功能 | 默认键 | 说明 |
|------|--------|------|
| 切换布局模式 | Alt+F4 | snap ↔ float |
| 切换显示/隐藏 | F5 | 临时切换，退出全屏自动恢复 |

## 调试

VSCode 中按 F5 启动「Debug Chrome Extension」配置，自动加载插件并打开 `https://www.baidu.com`，支持 source map 调试。
