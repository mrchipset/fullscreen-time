# Fullscreen Time — 代码与 UI/UX 评审

> 评审日期：2026-10-18
> 评审方式：只读静态评审（未运行扩展、未修改任何源码）
> 评审范围：全屏时间浮层、popup、settings、doc 页、i18n 与存储流

## 1. 总体结论

这个扩展的核心思路清晰：用 `TimeDisplay` 与 `WindowOverlayTimeDisplay` 两个浮层覆盖「视频全屏」和「窗口全屏」两种场景，设置实时写入 `chrome.storage.sync`，无需保存按钮；中英双语、快捷键、贴边/浮动两种布局也已具备。方向是对的，代码量不大，结构可读。

但目前有三类问题会明显拉低真实体验：

1. **原生 `<video>` 元素全屏时，两种布局都不会渲染浮层。** snap 把节点挂到 `media.parentElement`，float 把节点挂进 `<video>`；前者在全屏时位于 top layer 之外、不会被绘制，后者属于 video 的 fallback content、也不会绘制。top layer 没有 API 能把任意元素放到全屏元素之外，因此这不是简单改 `appendChild` 能解决的，需要 POC 验证。这是最优先的视觉/功能缺陷。
2. **快捷键在全新安装时是失效的。** 设置页只把 `F9`/`F10` 当展示默认值，从未写入存储；内容脚本读取时也没有默认值。
3. **设置界面看起来「统一」，但信息架构扁平、录键器基本只支持鼠标，且存在键盘陷阱与不可恢复的隐藏操作。** 设置页是本次评审的重点，下面单列。

整体评价：**可用性骨架合格，交付质量尚未收敛。** 视觉语言统一（浅灰底、白卡片、蓝色主色、8px 圆角），但没有形成设计系统；关键交互（录键、隐藏、自动淡出、语言切换）都停在「能用」而非「可靠」。

---

## 2. 优先级总览

| 级别 | 问题 | 位置 |
|---|---|---|
| P0 | 原生 `<video>` 全屏时浮层不渲染（snap/float 都中招） | `src/widgets.js:159-173, 394-401` |
| P0 | `F9`/`F10` 默认值从未持久化，新装快捷键失效 | `extension/settings/settings.js:58-67`, `src/index.js:124-127` |
| P0 | 快捷键 `preventDefault` 在异步回调里执行，无法阻止浏览器/页面默认行为 | `src/index.js:124-139` |
| P0 | 录键器只能用鼠标启动；可录 `Escape`/`Tab`，无清除/重置 | `extension/settings/settings.js:22-50` |
| P0 | 只注入顶层 frame，iframe 播放器完全无覆盖 | `extension/manifest.json:26-32` |
| P1 | 隐藏浮层后没有恢复提示；默认 snap 下通常是「彻底没有时钟」 | `src/widgets.js:73-124`, `src/index.js:101-112` |
| P1 | 开启自动隐藏后，透明浮层仍拦截点击 | `src/widgets.js:64, 214-235` |
| P1 | 两个全屏开关语义互相纠缠，用户会读成「开关坏了」 | `extension/popup/popup.html:94-102`, `src/widgets.js:432-443` |
| P1 | 设置页/弹窗首屏标签全空，等异步 i18n 才出现 | `extension/popup/popup.html:92-142`, `extension/shared/i18n.js:49-64` |
| P1 | 语言切换不传播到已打开页面与内容脚本 | `extension/shared/i18n.js:69-77`, `src/widgets.js:371-376` |
| P1 | 浮层对比度约 3.9:1，字体/行高继承宿主页，可能小到看不清或换行 | `src/widgets.js:56-65` |
| P1 | 浮动位置未做视口约束，且两类浮层共用同一位置 | `src/widgets.js:37, 241-248, 304-306` |
| P1 | 窗口浮层不监听 `fullscreenchange`，只靠 resize | `src/widgets.js:446-454`, `src/index.js:38-40` |
| P1 | 隐私文案与 `chrome.storage.sync` 事实不符 | `extension/_locales/*/messages.json:259` |
| P1 | 新装取消录制会回填空串，界面上的 F9/F10 消失 | `extension/settings/settings.js:32-34` |
| P2 | 设置页仍是 360px 卡片开在整页标签中，且无 `<title>` | `extension/settings/settings.html:6-11` |
| P2 | 三个同权重主按钮、字体 token 不一致、未使用的 hint 样式对比度不足 | `extension/popup/popup.html:140-142`, `extension/settings/settings.html:74-78` |
| P2 | 构建产物未压缩、残留 console、无深色/减少动效支持 | `webpack.config.js:13, 30-39` |

---

## 3. 设置界面专项（重点）

### 3.1 视觉与信息架构

**优点**：360px 宽的白色卡片、8px 圆角、统一蓝色强调色、行距和控件尺寸基本一致，视觉上比 popup 更「像设置页」。

**问题**：

- **信息架构过平。** 页面只有「标题 + 两行快捷键」，没有分组、没有说明、没有操作区。快捷键是低频高风险操作，却没有任何解释「这些键在什么时候生效」「如何取消/恢复默认」。
- **在标签页里显得失衡。** `body { width: 360px; padding: 15px; }`（`extension/settings/settings.html:6-11`）原本是 popup 尺寸，却通过 `chrome.tabs.create` 打开（`extension/popup/popup.js:89-91`）。结果是一张窄卡片贴在浏览器左上角，右侧和下方大片空白，缺少页面级容器、居中、最大宽度和返回入口。
- **没有页面标题。** `<title>` 缺失，标签页显示 `settings.html`；`<h1 data-i18n="settingsTitle">` 在翻译加载前是空的。
- **`.setting-hint` 定义了却从未使用**（`settings.html:74-78`），说明「操作说明」这一层在设计里存在过，但没有落地。

**建议**：改为居中卡片（`max-width: 420px; margin: 48px auto;`），补 `<title>`、页面级说明与「返回」入口；把快捷键区、行为说明区、重置区明确分组。

### 3.2 快捷键录键器：一个需要重做的控件

当前实现（`extension/settings/settings.js:19-51`）是「点击输入框 → 进入录制 → 按下任意键 → 写入 storage」。问题集中在**入口、退出、约束和反馈**四件事：

| 行为 | 现状 | 风险 |
|---|---|---|
| 开始录制 | 只有 `click` 会设置 `recording = true`（`:22-26`） | 键盘用户 Tab 聚焦后按键没有任何反应，完全无法配置 |
| 取消录制 | `blur` 取消录制并按存储值回填（`:28-36`）；但新装无存储值时 `items[storageKey] || ''`（`:32-34`）会回填空串 | 取消后 F9/F10 从界面消失；没有文案告知；`Escape` 不是取消 |
| 记录按键 | 接受 `Escape`、`Tab`、`Backspace`、字母、空格（`:38-50`） | `Escape` 会被内容脚本显式忽略（`src/index.js:118-119`），绑定后是死键；`Tab` 被 `preventDefault` 后焦点被困在输入框里 |
| 清除/重置 | 无 | 用户无法恢复默认，也无法解除绑定 |
| 冲突检测 | 无 | 两个动作可以绑同一个键，内容脚本会依次触发两个分支 |
| 焦点可见性 | `.shortcut-input { outline: none; }`（`settings.html:45`） | 键盘焦点完全不可见 |
| 标签关联 | 使用 `<span class="shortcut-label">`（`settings.html:90-98`） | 屏幕阅读器无法把标签和输入框关联 |
| 按键可读性 | 直接显示 `e.key` | 空格显示为空白，方向键显示 `ArrowUp`，组合键显示 `Ctrl+Shift+K`，不统一 |
| 修饰键完整性 | `keyEventToString()` 未包含 `e.metaKey`（`:5-16`） | Mac 的 Cmd+K 会被存成 `K`，之后在普通 K 上误触发；内容脚本的 `buildKeyString()` 同样遗漏（`src/index.js:47-55`） |

**建议**：`Escape` = 取消，`Delete/Backspace` = 清除，拒绝导航/保留键；录制状态提供明确文案（「按下组合键，Esc 取消」）；键盘可启动录制；显示友好键名；增加 `:focus-visible`；检测重复绑定并提示；提供「恢复默认」。

### 3.3 可访问性

- 两个快捷键标签是 `<span>`，没有 `for`/`aria-labelledby`。
- 输入框 `user-select:none` + `outline:none`，没有替代焦点样式。
- 录键器没有 `role`/状态播报（例如 `aria-live` 提示「正在录制」）。
- 页面没有 `<title>`，语言元数据缺失。
- 文字色 `#333` / `#555` 的层级合理。`.setting-hint` 目前从未被使用；若启用，`#888` 在白卡片上约 3.5:1，仍低于正文 AA。

### 3.4 文案与语义

设置页本身文案很少，真正的问题在 popup 的两个全屏开关：

- 中文文案是「在视频中显示时间」与「在全屏时显示」（`extension/_locales/zh_CN/messages.json`）。前者完全没提「全屏」，后者没说明是浏览器/窗口全屏；两者都缺作用域词（视频浮层 / 浏览器全屏浮层），用户无法从字面判断后者只控制窗口浮层，且两者显示逻辑互斥（`src/widgets.js:432-443`）。
- 关掉「视频全屏显示」后，窗口浮层会变得「有资格显示」，但在默认 snap + 元素全屏下又不会被绘制。用户看到的是「关了反而更怪」。
- 建议改为「视频浮层」「浏览器全屏浮层」，各加一行说明，并明确二者不会叠加。

### 3.5 状态与反馈

- 保存没有任何成功/失败反馈：`settings.js:49` 仅写入，`popup.js:49-86` 仅 `console.log`。
- 录入成功只改输入框的值，没有「已保存」提示。
- 没有「恢复默认」和「当前是否生效」的状态展示。
- 打开设置页后，用户不知道快捷键在哪些场景生效，也不知道退出全屏会恢复临时状态。

---

## 4. 弹窗专项

### 4.1 布局与层级

- 五个 checkbox 完全等权排列（`extension/popup/popup.html:94-117`），「显示秒数」「显示进度」「自动隐藏」和两个全屏开关混在一起；布局模式单独占一块，但缺少「显示内容 / 行为」的层级。
- 三个 footer 按钮使用同一个 `.doc-button` 主按钮样式（`:140-142`），「快捷键设置」「帮助」「隐私政策」视觉权重完全相同，主操作不突出。
- 语言选择器是唯一的 `<select>`，样式内联、与 checkbox 行高不一致；`<label>` 没有 `for`（`:132-138`），点击「语言」文字不会聚焦控件。
- 首屏所有 `data-i18n` 节点为空，异步 `fetch` 完成前是一张空白卡片（`popup.html:92-142`、`shared/i18n.js:49-64`）。

### 4.2 建议

- 分为「显示内容」（秒数、进度、两个浮层）与「行为」（自动隐藏、布局、语言）两组。
- 主按钮只保留一个；帮助/隐私改为次级文字链接。
- 给 `langSelector` 加 `for`、统一控件高度与边框。
- 在 HTML 里写英文兜底文案，或在 i18n 完成前隐藏容器并淡入，避免「空白闪屏」。

---

## 5. 全屏浮层专项

### 5.1 渲染位置（最严重）

- **snap**：`timeElement` 挂到 `media.parentElement`，并设 `position:absolute`（`src/widgets.js:167-173`）。当 `document.fullscreenElement === media` 时，只有 `<video>` 位于 top layer，父元素不会被绘制，浮层不可见。
- **float**：挂到 `document.fullscreenElement`（`:159-162`、`:394-401`）。当全屏元素就是 `<video>` 时，子节点属于 fallback content，同样不会绘制。
- 结论：**原生 video 元素全屏（浏览器自带控件最常见路径）下，两种布局都不会渲染浮层。** 站点把播放器容器整体全屏时（如 YouTube 的 player div）才正常。
- 建议：先做 POC，不要直接改成简单的 `appendChild`。top layer 没有 API 允许把任意元素放到全屏元素之外，所以 (i) 需验证「全屏前把浮层重挂到播放器容器并对该容器调用 `requestFullscreen()`」是否可行（需要用户手势；`fullscreenchange` 回调没有 transient activation）；(ii) 若不可行，则明确接受该路径不覆盖，或在产品文案中声明仅支持容器全屏。

### 5.2 可读性

- 背景 `rgba(0,0,0,0.5)`、白字、无文字阴影（`src/widgets.js:58-65`）。在明亮画面上，白字与合成后的灰底对比度约 3.9:1，低于 WCAG AA 的 4.5:1。
- 没有设置 `font-size`、`font-family`、`line-height`，完全继承宿主页面；遇到 `font-size: 10px` 或全局 `* { font-family: ... }` 的站点会明显变形。
- 没有 `white-space: nowrap`，`MM:SS / MM:SS | HH:MM:SS` 在窄容器里可能换行；也没有 `font-variant-numeric: tabular-nums`，秒数跳动时宽度会抖。
- 建议：显式字体与字号、半透明深底 + 轻阴影、`nowrap`、等宽数字；必要时用 Shadow DOM 隔离宿主样式。

### 5.3 交互与可恢复性

- 关闭按钮是 18×18 的 `<span>`，仅 `mouseenter` 时显示（`src/widgets.js:73-87, 94-124`），无 `role`、无 `tabindex`、无键盘处理；触摸设备无法 hover，等于不可用。
- 点击 × 后通过 `fs-time-dismiss` 临时把对应显示开关设为 false（`src/index.js:101-112`）。退出全屏才恢复；期间没有「已隐藏，按 F10 恢复」之类的提示。
- 在默认 snap + 元素全屏下，窗口浮层挂在 `body` 上不会被绘制，所以「隐藏视频浮层」通常等于**完全没有时钟**，而不是出现第二个时钟。
- 自动隐藏：`fadeOut()` 只把 `opacity` 设为 0（`:233-235`），元素仍 `display:block` 且 `pointer-events:auto`（`:64`），透明区域继续拦截点击；唤醒监听只绑在 `<video>` 的 `mousemove`（`:214-224`），鼠标移到浮层本身不会唤醒。该问题仅在 `autoHide=true` 时出现（默认 false），但一旦开启就很烦人。
- 浮动位置：拖拽结束保存未 clamp 的 `left/top`（`:304-306`），换分辨率/缩放/显示器后可能整块跑到屏幕外；`floatPosition` 同时被视频浮层和窗口浮层复用（`:37`），两者会互相覆盖。
- 建议：把 × 改成真正的 `<button>`，24×24 命中区，常驻或整块 hover 时显示，带 `aria-label`；隐藏后给短提示；`fadeOut` 时同时设 `pointer-events:none`，唤醒监听改到全屏容器/document；保存前 clamp 到视口，并拆分两个位置 key。

### 5.4 自动隐藏与全屏状态同步

- `WindowOverlayTimeDisplay.show()` 不调用 `startAutoHide()`（`:388-412`），所以 popup 里的「自动隐藏」对窗口浮层无效，但文案看起来是全局设置。
- `showProgress` 同样只作用于视频浮层：`WindowOverlayTimeDisplay.updateTime()` 只输出 `HH:MM:SS`（`:422-430`），但 popup 把「显示进度」呈现为全局选项（`extension/popup/popup.html:109-112`）。
- 窗口浮层的 `setupEventListeners()` 只做一次初始可见性判断 + 1 秒定时器（`:446-454`），没有监听 `fullscreenchange`；`index.js` 只在 `resize` 时更新（`:38-40`）。进入/退出全屏若没有触发 resize，状态会滞后。
- 建议：统一两个浮层的显示/隐藏生命周期；窗口浮层监听 `fullscreenchange`；`autoHide` 要么对两者一致生效，要么在 UI 上明确只作用于视频浮层。

---

## 6. 功能与架构问题（影响 UI 的部分）

1. **iframe 覆盖缺失。** 内容脚本只在顶层 frame 注入（`manifest.json:26-32` 无 `all_frames`），iframe 内的 `<video>` 不会被扫描；同时元素全屏时窗口浮层又会隐藏（`src/widgets.js:438-440`），嵌入播放器场景等于没有覆盖。
2. **动态视频漏检。** `injectForMedias()` 只在页面存在视频时扫描一次；只有「一个视频都没有」时才每 2 秒重试（`src/index.js:20-32`）。SPA/懒加载页面后插入的视频不会获得浮层；空页面则会永久轮询并 `console.warn`。
3. **每个视频常驻定时器与监听。** 每个 `TimeDisplay` 都创建 1 秒 `setInterval`、4 个 fullscreen 监听、1 个 storage 监听，且没有销毁逻辑（`src/widgets.js:326-379`）；多视频页面会持续累积。
4. **隐藏节点残留。** `TimeDisplay.hide()` 只在父节点是 `media.parentElement` 时移除（`:181-189`）；float 模式挂在 fullscreen 元素/body 上时会留下 `display:none` 节点。`WindowOverlayTimeDisplay.hide()` 同样只处理 `document.body`（`:414-420`）。
5. **快捷键抑制失效。** `preventDefault()/stopPropagation()` 在 `chrome.storage.sync.get` 的回调里（`src/index.js:124-139`），事件分发早已结束；录 `F5`/`Ctrl+R` 会直接刷新，`Tab` 会移走焦点，字母会输入到页面输入框。同时没有 `e.repeat` 过滤，也没有排除 `input/textarea/contenteditable`。
6. **内容脚本 i18n 可能根本取不到语言包。** `src/i18n.js:73-87` 用 `fetch(chrome-extension://.../_locales/...)`，但 manifest 没有 `web_accessible_resources`；失败后退回 `chrome.i18n.getMessage`，会忽略 popup 里的 `language` 设置。即使取到，`reloadFromStorage()`（`:53-64`）也从未被调用。
7. **语言切换不传播。** `switchLang()` 只重译当前页（`shared/i18n.js:69-77`）；已打开的 settings/doc 没有 `storage.onChanged`。内容脚本收到 `language` 变化时只用旧翻译重设关闭按钮标题（`src/widgets.js:371-376`）。
8. **隐私文案不准确。** 文档写「All settings are stored locally … No data is sent to any server」（`extension/_locales/*/messages.json:259`），但设置用的是 `chrome.storage.sync`，会同步到用户的 Google 账户。没有开发者服务器或统计代码，所以不是数据外泄，但措辞需要改为「存储在 Chrome 同步中，不发送给开发者」。
9. **直播流进度显示无效。** `duration === Infinity` 时 `formatTime` 返回 `Infinity:NaN`（`src/utils.js:2-7`、`src/widgets.js:317-320`）。
10. **浏览器全屏判断过严。** `innerHeight === screen.height && innerWidth === screen.width`（`src/utils.js:10-12`）在缩放、滚动条、DevTools、混合 DPI、多显示器下会误判。
11. **构建配置与文档漂移。** `build-prod` 因 `optimization.minimize:false` 实际未压缩，且内联 source map（`webpack.config.js:13,30-39`）；`extension/content.js.map` 是陈旧产物；`AGENTS.md` 的存储键列表和 `clean` 描述已过时。

---

## 7. 值得保留的优点

- **实时生效**：设置通过 `chrome.storage.onChanged` 立即作用于浮层，没有「保存」按钮的心智负担。
- **贴边/浮动双布局**：snap 固定顶部居中，float 可拖拽并记住位置，是有价值的产品差异点。
- **自动淡出理念**：3 秒后淡出、鼠标移动唤醒，方向正确，只是实现细节（pointer-events、唤醒范围）需要修。
- **快捷键临时切换**：不改持久设置，退出全屏恢复，克制的交互思路。
- **完整双语**：中英两套 66 个 key，popup 内可切换语言。
- **文档与隐私在扩展内**：一键可达，降低支持成本。

---

## 8. 建议的修复顺序（不在本次范围内实施）

1. **为全屏渲染位置做 POC**（P0）：先验证「重挂 + 对播放器容器 `requestFullscreen()`」是否可行；top layer 不允许把任意元素放到全屏元素之外，不能只靠改挂载点解决。确认方案后再覆盖「video 元素全屏」与「容器全屏」两条路径。
2. **修快捷键链路**（P0）：持久化默认值 → 内存缓存绑定 → 同步 `preventDefault()` → 输入框守卫 → `e.repeat` 过滤。
3. **修可恢复性**（P1）：× 改为可聚焦按钮、隐藏提示、`fadeOut` 关闭指针事件、float 位置 clamp。
4. **重做设置页交互**（P0/P1）：键盘可录制、Esc 取消、Delete 清除、冲突检测、焦点环、标签关联、页面容器/标题。
5. **整理弹窗信息架构与首屏**（P1）：分组、按钮层级、语言 label、i18n 兜底。
6. **修 i18n 传播与资源加载**（P1）：`web_accessible_resources`、`reloadFromStorage` 接线、跨页 `storage.onChanged`、`doc.html` 动态 `lang`。
7. **修正隐私文案**（P1），再处理 P2 的视觉 token、对比度、深色模式与构建配置。

---

## 9. 评审方法与局限

- 本次为**静态只读评审**：阅读源码、HTML/CSS、locale 文件与构建配置，未加载扩展、未在真实视频站点运行。
- 关于 top layer 的结论（原生 `<video>` 全屏时父元素/子节点不绘制）基于浏览器全屏渲染语义；建议用 `pnpm run build-dev` 构建后，在 Chrome 中分别验证「video 元素全屏」「播放器容器全屏」「F11」三种场景。
- 行号以当前工作区为准；后续改动可能导致偏移，定位时优先按函数名/选择器搜索。
- 评审对象是 `src/` 与各页面源文件，未审查已提交的构建产物 `extension/content.js` 的运行行为（仅核对了其 source map 与当前源码一致）。
- 本次未修改任何源码；交付物仅本文档。
