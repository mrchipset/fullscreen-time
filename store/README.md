# Chrome Web Store 发布手册

本目录只用于**发布准备**，不会被打进扩展 ZIP。扩展本体仍在 `extension/`。

## 1. 构建与打包

```bash
pnpm install
pnpm run build-prod
```

确认：

- `extension/content.js` 为生产压缩版本；
- 不存在 `extension/content.js.map`；
- `manifest.json` 的 version 为 `1.0.0`；
- 图标 `icon16.png` / `icon32.png` / `icon48.png` / `icon128.png` 均为正方形。

打包（ZIP 根目录必须直接是 `manifest.json`）：

```powershell
Compress-Archive -Path "extension\*" -DestinationPath "store\fullscreen-time-1.0.0.zip" -Force
```

不要把 `store/`、`docs/`、`copyright/`、`testpage/`、`node_modules/` 或截图打进 ZIP。

## 2. 注册开发者账号

1. 打开 https://chrome.google.com/webstore/devconsole
2. 使用 Google 账号登录并支付一次性开发者注册费（当前 $5，以页面为准）。
3. 验证邮箱并开启两步验证（2FA）。
4. 接受开发者协议。

## 3. 创建条目并上传

1. 点击 **New item**，上传 `store/fullscreen-time-1.0.0.zip`。
2. 商店名称建议：`Fullscreen Time — 全屏时间显示`。
3. 摘要与详细描述可直接使用：
   - `store/listing-zh.md`
   - `store/listing-en.md`
4. 分类：Productivity。
5. 语言：中文（简体）、English。
6. 支持 URL：https://github.com/mrchipset/fullscreen-time/issues
7. 主页 URL：https://github.com/mrchipset/fullscreen-time

## 4. 商店素材

- 商店图标：`extension/icons/icon128.png`（128×128）。
- 截图：`store/screenshots/01-overlay.png`、`02-popup.png`、`03-settings.png`（1280×800）。
- 宣传图：
  - `store/promo/small-440x280.png`（440×280）。
  - `store/promo/marquee-1400x560.png`（1400×560）。
- 宣传图源文件：`store/promo/small-440x280.html`、`store/promo/marquee-1400x560.html`（以 2× 渲染后导出，便于复现）。
- `store/source/` 只用于生成截图，不随扩展上传。

## 5. 隐私政策 URL 与 Pages workflow

商店的 Privacy policy URL 必须是公开可访问的网页。仓库已准备：

- `site/privacy-policy.html` — 实际发布的静态页面
- `docs/privacy-policy.md` — 内容源稿（修改政策时请同步更新 HTML）
- `.github/workflows/pages.yml` — GitHub Actions 发布 workflow

启用步骤：

1. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
2. 将 workflow 与 `site/` 合并到 `main`，或在 Actions 页面手动运行 `Deploy privacy policy to GitHub Pages`。
3. workflow 会部署 `site/` 目录，页面地址为：

```text
https://mrchipset.github.io/fullscreen-time/privacy-policy.html
```

workflow 只发布 `site/`，不会发布 `docs/` 下的内部测试/评审文档。

提交前请先在浏览器中打开该 URL，确认无需登录即可访问。若使用自定义域名，替换为实际地址，并同步更新两份 listing 文案。

## 6. Privacy practices 填写要点

- 单一用途：在视频或浏览器全屏时显示播放进度和系统时钟。
- 数据收集：不收集、不出售、不向开发者或第三方传输数据。
- 远程代码：不使用远程代码。
- 分析统计：无。
- 权限说明：
  - `storage`：保存设置与快捷键。
  - 所有网站内容脚本：检测视频与全屏状态；不上传页面内容。
  - `all_frames` / `match_about_blank` / `match_origin_as_fallback`：支持 iframe/嵌入播放器。
  - `_locales/*` WAR：本地语言包。
  - `file:///*`：本地视频文件；用户需手动允许文件网址访问。
- 如审核问询全站访问权限，说明扩展需要在任意站点识别 `<video>` 与 Fullscreen API 状态，且数据仅在本地使用。

## 7. `file:///*` 的处理

当前 manifest 保留 `file:///*`，用于本地视频文件全屏。它需要用户在扩展详情中手动开启“允许访问文件网址”。

如果审核要求收紧权限，且你不打算支持本地文件：

1. 从 `manifest.json` 的 `content_scripts.matches` 移除 `"file:///*"`；
2. 重新 `pnpm run build-prod`（若未改 src 可只改 manifest）；
3. 重新打 ZIP；
4. 同步更新 listing 与隐私政策中的 `file:///*` 说明。

## 8. 提交审核

1. 确认 Privacy practices、权限、截图、隐私政策 URL 全部填写。
2. 选择 Public / Unlisted / Private 与发布地区。
3. 点击 **Submit for review**。
4. 审核期间关注开发者邮箱；被拒时按政策条款修改后重新提交。

## 9. 更新发布

1. 修改 `manifest.json` 的 `version`（例如 `1.0.1`）。
2. `pnpm run build-prod`。
3. 重新打 ZIP 并上传；不能复用旧版本号。
4. 可使用 staged rollout。

## 10. 当前版本检查清单

- [x] `manifest.json` version = `1.0.0`
- [x] `minimum_chrome_version` = `114`
- [x] `homepage_url` = GitHub 仓库
- [x] 16/32/48/128 正方形图标
- [x] 隐私政策源稿（`docs/privacy-policy.md`）+ 发布页（`site/privacy-policy.html`）
- [x] 中英文 listing 草稿
- [x] 1280×800 商店截图（`store/screenshots/01-overlay.png`、`02-popup.png`、`03-settings.png`）
- [x] ZIP 已生成：`store/fullscreen-time-1.0.0.zip`（根目录含 `manifest.json`）
- [x] GitHub Pages workflow（`.github/workflows/pages.yml`，发布 `site/`）
- [ ] GitHub Pages 隐私政策 URL 可访问
- [ ] 干净 Chrome 配置中加载 ZIP 测试
