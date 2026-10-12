# 01 项目清单与检查范围

审计日期：2026-10-12  
审计方式：只读。未修改任何项目文件，未复跑 `cargo test`，未登录生产环境，未统计用户量或线上性能。

证据分级在后文统一使用：

- **直接证据**：当前能打开的源码、Cargo 清单、设计文档、发布说明或 git 记录。
- **合理推断**：由目录组织、作者邮箱、提交密度推出，尚未由本人确认。
- **已有简历陈述**：只出现在当前简历 `index.html`，本次没有对应项目材料。
- **待确认**：材料互相不一致，或只能看到计划看不到落地。

## 1. 实际检查了什么

### 1.1 当前工作区

`/Users/dayu/YGW/余广伟简历`

| 路径 | 作用 | 检查深度 |
|---|---|---|
| `index.html` | 现行中文简历 | 全文阅读，作为“已有简历陈述”的对照，不把它当成已验证事实 |
| `archives/` | 旧版 typ / html / doc 简历 | 只看到文件名，未逐份对照 |
| `余广伟简历.pdf`、`page-01.png`、`page-02.png` | 导出件 | 未再解析；以 `index.html` 为准 |

工作区本身没有产品源码。

### 1.2 主证据仓库

`/Users/dayu/Coder/everkm/everkm2`

| 项 | 记录 |
|---|---|
| 远程 | `ssh://git@dev.everkm.cn:2222/daobox/everkm2.git`（内网 Gitea，非公开 GitHub） |
| 当前 HEAD | `3c0bf77a0`，2026-10-10，`feat(sidebar): 打开外部 Markdown 时侧栏切到大纲` |
| 作者 | `git shortlog -sn --all` 仅 `dayu`；提交邮箱 `jcoldyu@gmail.com` |
| 历史起点 | 2025-03-12，首提交信息为「导入起步项目」 |
| HEAD 提交数 | 5137（`rev-list --count HEAD`）。`shortlog --all` 为 6903，含其它分支 |

**含义：** 2025-03-12 之前的 Everkm / 道盒开发不在这份 git 历史里。导入时已经带入大量 Rust crate。那些目录如果之后几乎没有新提交，不能把“仓库里有这段代码”写成“近一年仍在维护”。

### 1.3 `/Users/dayu/Coder/everkm` 下的并列仓库

只做了仓库级清单（是否 git、作者、最后一次提交、remote）。下面是和简历主线相关、并且至少打开过说明文档或清单的仓库。

| 路径 | 提交规模（约） | 最后提交 | 作者 | 公开 remote | 与简历的关系 | 本次深度 |
|---|---|---|---|---|---|---|
| `everkm2` | 5137 | 2026-10-10 | dayu | 内网 | 主代码库 | 深入 |
| `abox` | 272 | 2026-10-09 | dayu，另有 jcold | `github.com/jcold/abox` | 官网 / 文档站材料 | 只确认 `www2026` 存在；aNote README 指向 `abox/www2026/zh/note` |
| `abox-imago` | 60 | 2026-07-26 | dayu | `github.com/abox-co/abox-imago` | Rust 图片服务（Axum、SeaORM、S3 签名） | 只读 Cargo 依赖，未读业务 |
| `abox-publisher` | 63 | 2026-07-30 | dayu | `github.com/abox-cc/abox-publisher` | 发布相关 | 未读源码 |
| `everkm-publish-npm` | 33 | 2026-07-04 | dayu | `github.com/everkm/publish` | Publish CLI 的 npm 包装 | 读了 `package.json` |
| `everkm-pages` | 462 | 2026-09-24 | dayu，另有 jcold | `github.com/jcold/publish-pages` | 发布页 / 文档 | 未读正文 |
| `ekmp-themes` | 35 | 2026-07-25 | jcold、dayu | `github.com/everkm/themes` | 主题 | 未读模板 |
| `tehaochi.cn` | 435 | 2026-08-21 | dayu | `github.com/everkm/tehaochi` | 使用 everkm-publish 的内容站 | 未读文章；在 publish 设计文档里被当作导出死锁的真实站点 |
| `youlog-dayu` | 148 | 2026-08-24 | dayu，另有 jcold | `github.com/jcold/youlog-dayu` | 个人 youlog 内容 | 未读 |
| `youlog-cicd` | 45 | 2026-04-27 | dayu | `github.com/everkm/youlog-cicd` | 发布流水线 | 未读 |
| `hoc.abox.co` | 20 | 2026-08-25 | dayu | `github.com/jcold/hoc` | 内测分发页 | 只在发布文档中被引用 |
| `store-listing` | 10 | 2026-09-13 | dayu | `github.com/everkm/store-listing` | 商店文案 | 读了 aNote 的名称与副标题 |
| `anote-windows-linux` | 47 | 2026-08-14 | dayu | `github.com/everkm/anote-windows-linux` | Windows/Linux 同步镜像 | 未读源码 |
| `anote-fonts` | 7 | 2026-08-22 | dayu | `github.com/abox-co/anote-fonts` | PDF 字体 | 未读 |
| `markdown-body` | 6 | 2026-03-15 | dayu，1 次 jcold | `github.com/abox-co/markdown-body` | 前端 Markdown 样式 | 未读 |
| `re-editor` | 149 | 2026-05-20 | 上游作者为主；dayu 约 15 次 | `github.com/jcold/re-editor` | 编辑器 fork | 未读 diff。不能把上游提交算成本人 |
| `daobox-dl` | 21 | 2023-10-11 | dayu | 内网 | Rust CLI（clap、reqwest、tokio） | 只读依赖；2023 后无提交 |
| `thc-api` | 46 | 2023-10-23 | dayu | 内网 | Axum + SeaORM + Redis | 只读依赖；早于 everkm2 |
| `mdnote_desktop_gh` | git 元数据异常 | — | — | 无 remote | 桌面仓残片 | 未分析 |

同目录还有 `domain_register`、`xInterest`、`ss`、`base_docker_images`、`daobox_devops`、录屏目录等。它们没有进入案例，因为和“可证明的 Rust / 系统交付”关系弱，或只是运维与素材。

### 1.4 点到为止、没有深入的目录

| 路径 | 看到的事实 | 未做的事 |
|---|---|---|
| `/Users/dayu/Coder/yiibox` | 存在 `daobox_fe`、`daobox-server-next`、`daobox-note` 等。`everkm2/be/note-app/README.md` 仍引用这些旧路径 | 没有读 yiibox 源码，也没有读它的 git。导入前的笔记服务历史在这里，不在 everkm2 |
| `/Users/dayu/Coder` 其它目录 | `rust_demo`、`go-playground`、`generatorgo`、`flutter`、`dayu_me` 等 | 未打开。不能用来证明技术深度 |
| 供应商 / 第三方树 | `be/tera-1.17.1`、`be/diff_merge/tonic-web-wasm-client-0.3.3`、aNote 的 `third_party/`、Pods | 排除在能力统计之外 |

### 1.5 简历里的历史雇主

2005–2021 的中铝信息、聚胜万合、盒拓、爱关怀 / 星光物语：**本次可访问目录中没有对应业务仓库。** 下文一律标为已有简历陈述。

## 2. everkm2 里和简历相关的工程

行数为本次用脚本统计的 `*.rs` 行数，已排除 `target/`。含测试；aNote 含 `frb_generated.rs`（约 9775 行生成代码）。

| 工程路径 | 是什么 | 代码规模（Rust） | everkm2 内提交 | 最近活动 | 判断出的状态 |
|---|---|---|---|---|---|
| `be/everkm-publish` + `everkm-publish-core` | Markdown 静态站点生成器 CLI `ekmp`：预览、导出、内存索引、QuickJS 渲染 | 约 4.0 万行 / 153 个 rs 文件；`#[test]` 约 437 | 512 | 2026-09 | **持续开发，且有内部版本发布记录至 v0.19.1（2026-09-23）**。是否已上 npm 公网见待确认 |
| `be/everkm-markdown` | 自有 Markdown 渲染库，基于 pulldown-cmark | 约 6900 行；测试约 94；声明了 criterion bench | 48 | 2026-09 | 被 publish、aNote、DaoBox、youlog 等依赖。**库，不是独立产品** |
| `be/md-ast` | Markdown 语义 IR（扩展属性、剪枝） | 约 5400 行；测试约 67 | 43 | 2026-09 | 2026-01 起的新基座，edition 2024 |
| `be/md-ext-attr` | 扩展属性分词，编译为 WASM 给 DaoBox 编辑器 | 小库 | 未单列 | 文档要求改完重编 wasm-pkg | **生产路径上的 WASM 组件**（DaoBox README） |
| `be/everkm-typst` | Markdown → Typst → PDF；公式 SVG/PNG；卡片多产物 | 约 7900 行；测试约 135 | 37 | 2026-10 | 2026-07 起持续做；有 golden 测试说明 |
| `be/everkm-docx` | Markdown → docx | 约 2700 行；测试约 20 | 3（同一天） | 2026-09-15 | 有实现和测试，提交很少。**不能说成长期产品** |
| `anote/anote-serve` + `anote/anote_app` | Abox Note：Flutter 客户端 + Rust 引擎，flutter_rust_bridge | Rust 约 6.2 万行（含生成代码）/ 250 文件；`anote-serve` 测试约 464 | 路径 `anote` 1908 | 2026-10-09 | **活跃产品**。`pubspec.yaml`：`1.3.1+124`，包名描述 “Abox Note”。发布脚本书写了 iOS / Android / macOS / Windows |
| `EverkmNote/` | DaoBox：Electron + Solid 客户端，Rust sidecar `daobox`，云托管 `daobox-cloud` | `ekmn-serve` 约 2.7 万行量级中的 59 个 rs、测试约 199 | 536 | 2026-10-10 | **2026-07 起的新桌面产品，当前仍在提交**。README 写明交付仓 `github.com/abox-co/daobox` |
| `account/account-serve` + `be/cas` | 自有账号 / CAS：Google、GitHub OAuth，微信相关模块 | account 约 6500 行；cas 约 3300 行 | account 142，cas 55 | 2026-09 | Drone 有 build/deploy image。测试很少（account 约 2、cas 约 4） |
| `youlog/youlog-serve` + `fe2/youlog-fe` | 内容站 / 单篇分享。Axum 提供 API、静态资源和 SSR | Rust 约 1.1 万行；测试约 23 | youlog 223；`fe2` 588 | 2026-09 | 有本地与生产拓扑文档（Nginx、Postgres、Redis）。前端是 Solid + esbuild |
| `be/note-app` | 旧「道盒笔记」服务（OpenAPI 文案仍写道盒笔记，含 gRPC 示例） | 约 3.3 万行 | **导入后仅 5 次** | 2026-10 的提交内容是换域名一类 | **遗留代码**。现行 DaoBox 不是这个 crate |
| `be/mdnote-tauri` | 旧 Tauri 桌面壳 | 约 2800 行 | 3 | 2026-07 | 遗留。现行桌面是 Electron DaoBox |
| `be/mdnote-wasm`、`be/everkm-wasm-ui` | Leptos WASM UI | mdnote-wasm 约 2.1 万行 | 导入后 8 次与 4 次，且集中在 2025-03 / 2025-09 | 2025-09 | **有大段代码，近年几乎不动**。不能当当前主栈 |
| `be/mdnote-serve`、`be/mdnote-flutter` | 旧笔记服务 / Flutter 桥 | serve 约 1.1 万行 | serve 24；flutter 仅导入那一次 | 2026-05 / 2025-03 | 旧零件。DaoBox README 写明「旧 mdnote* 仅作零件库」 |
| `be/diff_merge` | 很小的合并库，并夹带一份 tonic-web-wasm-client 第三方树 | 自有约 105 行 | 1（导入） | 2025-03-12 | **不能证明 tonic / WASM gRPC 经验** |
| `be/wz-server` | 「道盒网页收藏」 | 约 9400 行 | 导入后 6 次 | 2026-10 换域名 | 遗留服务 |
| `marker/` | Abox Mark，Flutter，README 写明无 Rust | — | 73 | 2026-09-13 | 另一款移动产品。商店文案仓有 `mark/app-meta.yaml` |
| `be/abox-favorites` | 收藏 + Meilisearch + SeaORM | 未逐模块统计 | 72 | 2026-08 | 有 README 级维护，未做案例深读 |
| `mdcard/` | 调用 everkm-typst 的卡片物料 | — | 9 | 2026-10-07 | typst 的使用方 |
| `be/everkm-httpd`、`storage`、`flog`、`yousha-serve`、`quick-into`、`notify`、`rbox`、`urlb`、`wxagent`、`tgagent`、`wxtoken`、`page-screenshot` 等 | 一批 Axum 服务或工具 | 各自有 Cargo.toml | 多数在导入后活动有限 | 见各目录 | 说明做过多套服务骨架，**不足以各自写成代表项目** |

`fe/packages/note` 在导入后只有 2 次提交。现行笔记 UI 在 `anote/anote_app` 与 `EverkmNote/ekmn-client`，不在旧 `fe/packages/note`。

## 3. 技术栈（按代码，不按简历列表）

**Rust 侧反复出现且有调用代码的：**

- 异步 HTTP：Tokio、Axum、Tower
- 数据：SeaORM migration（aNote、account、youlog、daobox-cloud 等）、部分 sqlx / redis
- 内容：pulldown-cmark、自研 `md-ast` / `everkm-markdown`、nom、rayon、html5ever / ego-tree
- 嵌入运行时：rquickjs（页面 JS 渲染）、Typst / mitex（公式与 PDF）
- 跨语言：flutter_rust_bridge 2.11.1、wasm-bindgen（`md-ext-attr`）、git2
- CLI / 观测：clap、tracing、anyhow、thiserror
- 索引并发：`arc-swap` + `tokio::sync::watch`（`MemoryPostIndex`）

**客户端：**

- Abox Note：Flutter（iOS、Android、macOS、Windows 的发布脚本都有），Riverpod，InAppWebView
- DaoBox：Electron、electron-vite、SolidJS、CodeMirror 6、TypeScript、Vitest
- Youlog 前端：SolidJS、esbuild、Tailwind
- Abox Mark：Flutter，无 Rust

**本次没有找到作为主力框架的证据：** Actix Web、Diesel、Leptos 作为现行 UI（只有旧 wasm crate）。Vue / React 出现在简历和旧 `fe/` 包名里，现行主界面代码更接近 Solid 与 Flutter。PHP / Java 的企业项目没有源码。

## 4. 作者身份

- everkm2 全部提交作者名是 `dayu`，邮箱 `jcoldyu@gmail.com`。
- 若干 GitHub remote 与少量提交使用 `jcold`。
- **合理推断：** `dayu` 与 `jcold` 是同一人的两种提交名。简历姓名是余广伟，本次没有在代码里核对身份证或合同，身份对应关系仍建议本人确认一句。
- `re-editor` 的大部分提交属于上游作者。只统计到约 15 次 `dayu`，且未读 diff。

## 5. 明确没检查的部分

- 122 个 Cargo.toml 都抽了包名和关键依赖，但只对第 2 节里的主线读了 README、设计笔记和关键模块。
- 未读 `node_modules`、`target`、字体缓存、Pods。
- 未打开 Drone 服务器，只从 `.drone.yml` 的 pipeline 名称确认存在 DaoBox sidecar、account、anote-serve、EverkmPublish、youlog 等相关流水线。流水线文件里有部署参数，报告不摘录密钥或令牌。
- 未访问 App Store / Play 后台，因此不能断言审核状态或下载量。
- 未统计 `tehaochi.cn`、`youlog.net`、`abox.co` 的访问量。这些域名出现在文档和本地站点仓库中。
