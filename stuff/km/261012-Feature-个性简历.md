# 个性简历静态页

> **文档性质**：Feature（2026-10-12）
> **关联**：根目录 `index.html`、`{side}/index.md`、`__everkm/theme/resume`
> **状态**：已落地（`make -C __everkm build` 导出 `__everkm/dist/rust/index.html`）

---

## 0. 变更记录

| 版本 | 日期 | 说明 |
|------|------|------|
| 0.1 | 2026-10-12 | 初稿：首页保持根目录 `index.html`；主题 `resume` 用 JS 渲染；遍历 `{side}/index.md` 出独立 HTML；`__everkm` 不通过 npm 安装 everkm-publish |
| 0.2 | 2026-10-12 | 明确主题形态对齐 zzjj（Solid + esbuild 的 JS Render），npm 只用于主题前端依赖，不用于安装 everkm-publish |
| 0.3 | 2026-10-12 | 落地。`everkm-theme.yaml` 需要 `repository`。列举方向页时 `posts` 要同时打开 `include_dir_index` 与 `include_myself`。正文标题被抽到 `<title>` 后，骨架里用标题补回 `h1` |
| 0.4 | 2026-10-12 | 页面外壳改为 `RootLayout`，正文作为子节点。去掉 `shell.html` 字符串替换 |
| 0.5 | 2026-10-12 | 正文页用组件 `<h1>` 显示标题，不再把标题拼进 `content_html` |

---

## 1. 一句话

**通用简历继续用根目录手写的 `index.html`。每个 `{side}/index.md` 由主题 `resume` 渲染成独立 HTML，骨架沿用首页，只替换正文。**

---

## 2. 范围

### 2.1 要做

1. 根目录 `index.html` 不改、不交给 everkm 重写。
2. 内容入口是仓库根下一级目录里的 `index.md`，例如 `rust/index.md`。`work/kb/` 这类资料不是这个路径，不生成页面。
3. 每个命中的文件导出为 `/{side}/index.html`。
4. 主题名 `resume`，放在 `__everkm/theme/resume/`，用 JS Render（对齐 zzjj：`templates/everkm-render.js` 导出 `ping` / `renderPage` / `renderDcard`）。
5. HTML 骨架取自根目录 `index.html`（样式、纸张、打印）。`<main class="sheet">` 内部换成当前 markdown 的 `content_html`。
6. 用 everkm 的 `posts`（`dir: "/"`、`recursive: true`、`include_dir_index: true`）列出目录首页，页面里放指向这些 `{side}/index.md` 的链接，导出时顺着链接生成独立 HTML。
7. `__everkm/Makefile` 的 `build` 调用本机 `/Users/dayu/.local/bin/everkm-publish`，用 `--start-urls` 传入扫到的 `/{side}/index.html`。没有 everkm 首页，不能依赖默认入口 `/index.html`。

### 2.2 不做

1. 不在 `__everkm` 里用 npm / pnpm 安装 `everkm-publish`。
2. 不把根目录 `index.html` 收成 everkm 页面，也不在导出结果里覆盖它。
3. 不做 zzjj 那套列表、关于、分页。个性简历只有一篇正文模板。
4. 不改 `rust/index.md` 的文案。

---

## 3. 目录

```text
index.html                      # 通用简历，保持原样
rust/index.md                   # 一个方向的个性简历
__everkm/
  everkm.yaml
  Makefile                      # build：主题打包 + everkm-publish --export --start-urls
  theme/resume/                 # JS Render 主题，前端依赖用 pnpm
```

`{side}/index.md` 是目录首页，对外 URL 为 `/{side}/index.html`。

---

## 4. 渲染

### 4.1 模板

1. `default_template` 为 `detail`。
2. `renderPage` 用 `post_detail` 取当前页正文。
3. `renderPage` 用 `renderToStringAsync` 输出 `RootLayout`，正文页作为子节点放进 `<main class="sheet">`。样式来自首页。一级标题在组件里用 `<h1>` 显示，`content_html` 原样放入。
4. 用 `posts`（`include_dir_index: true`、`include_myself: true`）找出所有一级 `{side}/index.md`，写成隐藏链接，供导出爬虫继续抓取。目录首页默认不进列表，当前页还会被 `include_myself` 的默认值排除。

### 4.2 构建入口

`Makefile` 扫描仓库根下一级 `*/index.md`，转成 `--start-urls /{side}/index.html`。多个入口分成多次 `--start-urls`。一个都没有则构建失败。

发布命令：

```bash
/Users/dayu/.local/bin/everkm-publish serve \
  --work-dir .. \
  --theme resume \
  --export \
  --start-urls /rust/index.html
```

产物在 `__everkm/dist/`。

---

## 5. 主题工具链

对齐 zzjj，但只保留 JS Render 所需部分：

| 项 | 约定 |
|----|------|
| 包管理 | 主题目录内 `pnpm`，安装 Solid / esbuild |
| 产物 | `templates/everkm-render.js` |
| everkm-publish | 只用 `/Users/dayu/.local/bin/everkm-publish` |
| 浏览器资源包 | 不单独打。样式在 HTML 骨架里 |
