# 03 优先项目案例

只保留 5 个。用户数量、收入、线上 QPS 均没有材料，下面不出现这类数字。

---

### everkm-publish（含 everkm-markdown / md-ast）

- 项目目标：把工作目录中的 Markdown 和目录配置做成可预览、可导出的静态站点，并让笔记应用与 CLI 共用同一套索引和渲染。
- 目标用户及实际使用场景：文档中的场景是官网、博客、Wiki，以及 DaoBox / 早期 aNote 把笔记灌入同一索引。本地内容站仓库 `tehaochi.cn`、主题仓库 `ekmp-themes`、npm 包装仓 `everkm/publish` 与之对应。谁在生产环境每天使用，本次没有访问日志。
- 项目阶段与实际使用情况：Rust crate `everkm-publish` 版本 **0.19.1**。内部发布说明 `be/everkm-publish/PROMOTE.md` 记录 2026-09-23 的 v0.19.1，以及更早的一串版本。npm 包装仓检出仍是 0.16.15。公网安装包版本待确认。2026-08 的索引重构与 2026-09 的渲染死锁修复都有设计文档和代码落点。
- 本人承担的职责：everkm2 中该目录 512 次提交，作者均为 `dayu`。合理推断为独立设计与实现。2025-03-12 导入之前的历史不在本仓库。
- 技术架构：CLI `ekmp` 负责文件系统同步、Axum 预览和导出；`everkm-publish-core` 持有 `MemoryPostIndex`（`ArcSwap`）、Tera 模板、可选 rquickjs。Markdown 走 `everkm-markdown` 与 `md-ast`。aNote 侧 2026-09-25 的计划写明产品内站点预览/导出下线，引擎不再链接 ekmpc；DaoBox 仍把 publish 当作外挂引擎。
- 核心技术决策：索引只保留一个 `PostIndex` 实现，宿主只灌数据；预览和导出共用 `PreviewServer`，文档中的原则是预览与导出走同一套服务；扩展属性由调用方决定剪哪些 tag，解析库不内置产品语义；页面 JS 嵌套渲染改为可等待，避免占死线程池。
- 最难解决的问题：JsRender 在嵌套组件时死锁，导出中途永久停住。其次是 ekmp 与 aNote 各写一套查询导致语义漂移。
- 解决方案：见 `02` 的 3.1 与 3.2。死锁一侧是异步求值、许可与槽位分离、超时重建、文档 IR。索引一侧是内存快照加薄适配，并删除宿主自己的查询实现（以该计划文档为准）。
- 可验证的结果：仓库内有 `make test-ci`、`tests/export_smoke.rs`、死锁回归夹具名。文档自述当时测试通过。本次没有执行测试，也没有复现死锁。版本号可以从 `Cargo.toml` 和 PROMOTE 记录核对。
- 代码、文档或提交证据：
  - `everkm2/be/everkm-publish/README.md`
  - `everkm2/be/everkm-publish/stuff/km/everkm-publish功能概述.md`
  - `everkm2/be/everkm-publish/stuff/km/260806-Plan-内存索引权威与薄数据源适配.md`
  - `everkm2/be/everkm-publish/stuff/km/260922-Plan-渲染调度死锁根治.md`
  - `everkm2/be/everkm-publish/everkm-publish-core/src/memory_index/index.rs`
  - `everkm2/be/md-ast/README.md`
  - `everkm2/be/everkm-markdown/我的理想Markdown语法.md`
- 可公开的项目地址：文档与 remote 指向 `https://github.com/everkm/publish`（npm 包装）和 `https://github.com/everkm/themes`。核心实现在内网 `everkm2`，默认不能当成公开源码，除非本人确认已同步。
- 适合投递的岗位或合作类型：Rust 后端、内容工具链、静态站点与文档系统；需要读代码排查并发和索引一致性的维护型工作。
- 目前缺失、需要本人补充的信息：公网发布物是否等于 0.19.1；有没有可公开的示例站；SQLite 缓存是否还在；死锁修复后的实际导出是否稳定；导入前从哪一年开始做这个生成器。

简历价值：这是最强的 Rust 证据，强过“用过 Axum”这种句子。适合作为代表项目第一条。

---

### Abox Note（aNote）

- 项目目标：面向移动端的 Markdown 笔记。本地 SQLite 为权威存储，Rust 引擎经 flutter_rust_bridge 驱动 Flutter UI，并提供给外部程序用的本机 Data API。
- 目标用户及实际使用场景：商店文案为「妙盒笔记 · Markdown 笔记」/ “Abox Note · Markdown Notes”，副标题「便捷记录、整理与发布」。代码场景是个人笔记、附件、标签、空间、历史版本。是否已有外部用户，没有数据。
- 项目阶段与实际使用情况：`pubspec.yaml` 版本 **1.3.1+124**，`publish_to: none`（不发 pub.dev）。`anote/` 自 2025-06 至 2026-10 约 1908 次提交。发布文档描述了官网 APK、OTA、iOS Ad-hoc、macOS 公证、Windows 镜像，以及 Play AAB 需人工上传。在架状态待确认。
- 本人承担的职责：提交作者为 `dayu`。Flutter 与 Rust 在同一树内一起演进。合理推断为客户端与引擎的同一负责人。
- 技术架构：Flutter UI → FRB → `anote-serve`（Tokio、SeaORM、SQLite）→ `anote.db` 与内容寻址的 `uploads/`。Data API 是 Axum，编译期 utoipa。公式与 PDF 能力会调用 `everkm-typst`（serve 的依赖里有它）。2026-09 起计划把站内 publish 从 App 中移除。
- 核心技术决策：业务规则放在引擎，HTTP 只做壳；笔记 id 使用 ULID；正文与 frontmatter/meta 分离；会话期间让出写权，用变更序号做 reconcile；云同步与 Data API 解耦。云同步方向被写成云端只有 master、快进合并，冲突时服务端做一次不落库的三方合并。该方向仍是草案。
- 最难解决的问题：从文档看，难点集中在移动端编辑体验（键盘、浮层、选区）和本地版本历史。云同步文档自己标出了一个数据丢失条件：master 更新没有按期望的 history id 做条件写入，并发提交会让先写的提交悬空。
- 解决方案：历史链用全量加 diffy patch，读取时回溯再顺序应用（`reconstruct_content_from_history`）。Data API 用阻塞式会话、Bearer、变更 feed、附件内容寻址。云同步的条件写入与合并 UI 没有在计划里标成已完成。
- 可验证的结果：版本号、多平台打包脚本、Data API 路由（含 `GET /api/changes`）、历史重建函数。测试数量是源码里的 `#[test]` 计数（anote-serve 约 464），不是本次运行结果。`frb_generated.rs` 约 9775 行，属于生成代码。
- 代码、文档或提交证据：
  - `everkm2/anote/anote_app/pubspec.yaml`
  - `everkm2/anote/anote_app/PUBLISH.md`
  - `everkm2/anote/anote_app/stuff/km/260925-Plan-AboxNote产品与数据架构.md`
  - `everkm2/anote/anote_app/stuff/km/260818-Plan-云同步初步架构.md`
  - `everkm2/anote/anote-serve/src/module/note.rs`
  - `everkm2/anote/anote-serve/src/module/data_api/`
  - `everkm/store-listing/anote/app-meta.yaml`
- 可公开的项目地址：文档提到 `abox.co` / `abox.cc` 与 `hoc.abox.co`。源码在内网 everkm2。Windows/Linux 镜像 remote 为 `github.com/everkm/anote-windows-linux`，本次未核对公开范围。
- 适合投递的岗位或合作类型：Rust 与客户端结合的产品工程；需要本地数据库、版本历史和明确 API 边界的模块。在云同步计划仍为草案时，不要按“已完成多端云同步”来投。
- 目前缺失、需要本人补充的信息：商店链接、第一个对外版本的日期、Data API 是否已有 DaoBox 以外的调用方、云同步现在的真实状态、历史丢失条件是否已修。

简历价值：证明独立把一个跨平台产品做到可打包，并且把数据与版本留在 Rust 引擎里。产品完成度高。云同步不要写进已交付成果。

---

### DaoBox（工程目录 EverkmNote）

- 项目目标：桌面端本地 Markdown 知识库。编辑、文件树、预览、导出、Git、云托管分开发布。
- 目标用户及实际使用场景：README 的路径是打开工作目录、用 CodeMirror 编辑、经 sidecar 预览/导出、用内置 Git 做版本管理，并可连接自有云（CAS、管理面、Git HTTP）。品牌名 DaoBox，appId `co.abox.daobox`。
- 项目阶段与实际使用情况：2026-07-28 起约 536 次提交，最后一次 2026-10-10，仍在改编辑器侧栏。打包文档把发版拆成 sidecar 编译、GitHub Actions 打 Electron、CDN 归档、OTA promote。`ekmn-client` 的 `package.json` version 仍是 `0.0.0`，产品版本在发版说明里，对外版本号待确认。早期 Phase 小节只写到开库与文件保存，其后的 Git 与云托管要以代码为准。
- 本人承担的职责：同一作者贯穿 Rust sidecar、Electron 客户端、云托管说明和发布脚本。合理推断为独立产品负责人。
- 技术架构：Electron + SolidJS + CodeMirror 6；Rust 二进制 `daobox`（`ekmn-serve`）提供文件、工作区、预览、导出、Git；`md-ext-attr` 的 WASM 在渲染进程里做扩展属性分词；`daobox-cloud` 是另一套 Axum + SeaORM 服务。发布器是独立的 everkm-publish。
- 核心技术决策：GUI 与引擎分离，引擎跨平台由 Drone 编译；WASM 产物入库，CI 不现场编译；Git 使用 libgit2（git2 crate）；二进制冲突直接报错；云环境与生产用域名和 Cookie 域区分。
- 最难解决的问题：文档里反复出现预览/导出与 publish 运行时的配合（DaoBox 路径曾没有背压，见死锁记录），以及把 Git 状态、冲突、远程认证放进桌面工作流。本次没有把每一份交互计划都读完，不能另指一个“最难 UI bug”。
- 解决方案：sidecar 复用 publish 运行时；Git 模块按 commit、conflict、diff、remote、sync、lfs、revision 拆开；冲突读取返回双方文本。
- 可验证的结果：`ekmn-serve` 约 199 个 `#[test]` 标记；`src/git/` 模块边界清楚；README 中的公开交付仓名称是 `abox-co/daobox`。未验证 Release 页上是否已有安装包。
- 代码、文档或提交证据：
  - `everkm2/EverkmNote/README.md`
  - `everkm2/EverkmNote/ekmn-serve/src/git/mod.rs`
  - `everkm2/EverkmNote/ekmn-serve/src/git/conflict.rs`
  - `everkm2/EverkmNote/ekmn-client/package.json`
  - `everkm2/.drone.yml` 中名称为 DaoBox sidecar 的 pipeline
- 可公开的项目地址：README 写 `https://github.com/abox-co/daobox`（交付）与 `abox-cc/daobox`（备用构建）。内网源码不等于该 GitHub 仓的全部历史。官网短链形式在文档中写作 `https://abox.co/f/daobox-*`。
- 适合投递的岗位或合作类型：Rust 桌面 sidecar、本地知识库、Git 集成、Electron 与系统语言分工明确的合同。也适合接手复杂桌面应用并继续演进。
- 目前缺失、需要本人补充的信息：当前对外版本与下载页是否可用；GitHub 仓是否公开、是否含 Rust；云托管是否已有除自己以外的仓库；LFS 与冲突界面的完成度。

简历价值：把 publish 引擎嵌进桌面产品，并实现了 Git 子系统。能证明系统集成和持续迭代。

---

### everkm-typst 与 everkm-docx

- 项目目标：把同一套 Markdown 语义送到 PDF（经 Typst）和 Word，公式走 mitex，而不是把 Markdown 当 HTML 再打印。
- 目标用户及实际使用场景：CLI、aNote/DaoBox 的导出，以及 `mdcard` 的卡片图（平台贴图、长图、PDF）。`mdcard` 在 2026-10 仍有提交。
- 项目阶段与实际使用情况：`everkm-typst` 0.2.0，2026-07 至 2026-10，37 次提交，测试标记约 135。`everkm-docx` 0.1.0，主要集中在 2026-09-15，测试标记约 20。docx 更像可用的一期工具，typst 仍在加功能（卡片、分栏、元数据）。
- 本人承担的职责：目录提交作者为 `dayu`。合理推断为独立实现。
- 技术架构：pulldown-cmark / md-ast 映射到 Typst 结构或 docx-rs。远程图片可预取，失败用占位。字体说明指向 `anote-fonts`。
- 核心技术决策：用户字符进入 Typst 字符串，结构不拼接 markup；公式失败默认降级，避免整篇失败；PDF 与公式 SVG 分两套回归；Word 一期不输出 frontmatter 和 private 块。
- 最难解决的问题：文档把特殊字符误入 Typst 语法当成要根除的问题。其次是公式在独立页与正文里布局不同，不能共用同一段片段做回归。
- 解决方案：转义策略、能力矩阵、`make formula-check` 与 `make golden-check-typ` 分开。README 写了 Windows 下代理和包缓存的排障，说明至少在 Windows 上编过公式回归。
- 可验证的结果：README 的支持矩阵；Makefile 目标；docx 的测试说明。未在本次运行 golden，也未打开生成的 PDF。
- 代码、文档或提交证据：
  - `everkm2/be/everkm-typst/README.md`
  - `everkm2/be/everkm-typst/stuff/km/260711-Plan-MD到Typst特殊字符万无一失转换.md`
  - `everkm2/be/everkm-docx/README.md`
  - `everkm2/be/everkm-docx/stuff/km/260915-Plan-MD到Word平行项目.md`
- 可公开的项目地址：未看到独立公开仓库。它们作为 everkm2 内部 crate 被 App 调用。
- 适合投递的岗位或合作类型：文档编译、内容转换、Rust CLI。对内容基础设施岗位很贴。
- 目前缺失、需要本人补充的信息：是否有可展示的 PDF/Word 样例；golden 最近一次是否全绿；docx 是否已经接到 DaoBox 导出菜单。

简历价值：补强内容系统。docx 单独不够成首条项目，应附在 typst 或 publish 后面一句话。

---

### 账号体系与 Youlog（account-serve、cas、youlog-serve）

- 项目目标：给自己的多个产品提供登录，并把 Markdown 内容发布成可访问的站点或单篇分享。
- 目标用户及实际使用场景：DaoBox 云托管文档把生产 CAS 写为 `cas.abox.co`，管理面 `daobox.abox.co`，Git `git.abox.co`，站点 `{slug}.youlog.net`。Youlog 本地开发域名出现在 README。这些是工程域名，不是用户规模。
- 项目阶段与实际使用情况：`account-serve` 0.2.11，`youlog-serve` 0.5.0。Drone 有对应 image 的 build/deploy 名称。Youlog 前端是 SolidJS。2025-06 至 2026-09 有持续提交，2026 年中有一段明显变少。
- 本人承担的职责：同一作者。合理推断为这些服务的实现者。是否有运维同事，未知。
- 技术架构：Axum + SeaORM；README 中的本地拓扑包含 Postgres、Redis、Nginx。OAuth 有 Google、GitHub 源码文件，另有微信相关模块文件。SSR 由 Rust 托管前端产物。Youlog 依赖 everkm-markdown、oauth2、rust-s3。
- 核心技术决策：本地开发也走 Nginx 与正式类似的反代；SSR 用共享的 `ssr-render`。这是产品工程选择，Rust 语言难度中等。
- 最难解决的问题：本次没有读到一份像 publish 死锁那样完整的故障记录。多域名登录是集成复杂度。
- 解决方案：以现有代码结构为准，未再提炼成单一故事。
- 可验证的结果：OAuth 路由挂在 `account/account-serve/src/httpd.rs`；Youlog README 的进程拓扑；版本号。account 与 cas 的测试标记很少，不要写成高测试覆盖的认证平台。
- 代码、文档或提交证据：
  - `everkm2/account/account-serve/src/oauth_connect/google.rs`
  - `everkm2/account/account-serve/src/oauth_connect/github.rs`
  - `everkm2/youlog/youlog-serve/README.md`
  - `everkm2/EverkmNote/README.md` 中的云托管域名表
- 可公开的项目地址：产品域名见上。服务源码在内网。
- 适合投递的岗位或合作类型：需要私有化登录和内容发布的小团队；作为 publish/DaoBox 的配套。不适合单独当成认证专家项目。
- 目前缺失、需要本人补充的信息：生产是否仍由本人维护；微信登录是否对用户开放。它和 2009–2012 年简历里的企业 CAS 不是同一个系统，对外讲述时必须分开。

简历价值：证明 Rust 库被放进了一套自己在跑的产品拓扑。认证深度不足以取代 publish 成为首屏项目，也不能证明 2012 年那份企业 CAS 陈述。

---

## 未升格为代表案例、但容易被误用的目录

| 目录 | 为什么不放进前五 |
|---|---|
| `be/note-app` | 约 3.3 万行 Rust，OpenAPI 仍叫道盒笔记，但导入后几乎停更。现行产品是 EverkmNote |
| `be/mdnote-wasm`、`mdnote-tauri` | 体量大或依赖完整，提交史表明已离开主路径 |
| `be/diff_merge` | 导入后未再开发，且含第三方 tonic 树 |
| `marker`（Abox Mark） | 活跃的 Flutter 产品，README 写明无 Rust。可在产品交付里提一句，不能支撑 Rust 定位 |
| `re-editor` | 上游项目。本人提交占比低，未读具体 patch |
| `abox-imago` | 独立的 Axum 图片服务，60 次提交。未读业务，暂不写成案例 |
