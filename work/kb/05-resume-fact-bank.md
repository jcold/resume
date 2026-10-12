# 05 双语简历事实素材库

用法：每条先看「可信度」。可信度低的句子可以留在谈话里，不适合写进投递稿。本文件不组成完整简历。

可信度：

- 高：源码或版本文件能直接核对
- 中：设计文档自述，或由单一作者 git 推出的职责
- 低：只有现行简历，或文档与代码不一致

---

## 首屏可用

### F1 独立完成内容工具链与笔记产品

- 推荐的中文表述方向：自 2025 年以来独立实现 Markdown 发布引擎、桌面知识库和跨平台笔记，Rust 负责解析、索引、渲染调度和本地数据，界面用 Flutter 或 Electron。
- 对应的英文关键词或简洁英文表达：`independent product engineer`，`Rust content toolchain`，`markdown publishing engine`，`desktop knowledge base`，`Flutter/Electron clients`
- 证据位置：everkm2 作者仅 `dayu`；`anote/`、`EverkmNote/`、`be/everkm-publish/` 的提交跨度见 `01`
- 可信度与限制：中。职责是合理推断。2021–2025-03 的工作没有这段 git。不要写“2005 年起用 Rust”。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：首屏一句，后面用三个项目展开。

### F2 面向远程的合作方式

- 推荐的中文表述方向：接受远程全职、兼职和有明确交付物的项目合作，优先内容系统、Rust 服务和已有系统的修复。
- 对应的英文关键词或简洁英文表达：`open to remote full-time, part-time, and contract work`
- 证据位置：本人在本次任务中的意向，不是代码能证明的事实
- 可信度与限制：这是求职意向，不是项目证据
- 是否适合放在首屏、技术能力、代表项目或工作经历中：首屏末尾或页脚。

---

## 技术能力

### F3 Rust 异步服务与进程内索引

- 推荐的中文表述方向：用 Tokio 和 Axum 提供预览与 API；内容索引用 `ArcSwap` 做无锁读、写路径串行化，避免多宿主各维护一套查询。
- 对应的英文关键词或简洁英文表达：`Tokio`，`Axum`，`ArcSwap`，`in-memory content index`，`single PostIndex implementation`
- 证据位置：`everkm-publish-core/src/memory_index/index.rs`；`260806-Plan-内存索引权威与薄数据源适配.md`
- 可信度与限制：高（代码）。性能与篇数上限只在设计文档里出现，不要写数字。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：技术能力，并在 publish 项目中重复一次。

### F4 自有 Markdown 语义层

- 推荐的中文表述方向：在 pulldown-cmark 事件之上实现语义树、扩展属性和按标签剪枝，供 HTML、编辑器高亮、PDF 和 Word 共用。
- 对应的英文关键词或简洁英文表达：`custom Markdown AST`，`pulldown-cmark`，`extension attributes`，`shared IR for HTML, PDF, and DOCX`
- 证据位置：`be/md-ast/README.md`，`be/everkm-markdown/`，typst 与 docx 的 README
- 可信度与限制：高。不要写成实现了全部 GFM/HTML/Mermaid。不支持项见 typst README。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：技术能力第一条。

### F5 嵌入 QuickJS 的渲染调度

- 推荐的中文表述方向：在静态站点渲染中嵌入 QuickJS，处理模板嵌套调用导致的线程池死锁：嵌套渲染改为可等待，超时后丢弃并重建 JS 运行时槽位。
- 对应的英文关键词或简洁英文表达：`embedded QuickJS`，`rquickjs`，`async render scheduling`，`worker-pool deadlock`，`runtime slot reclaim`
- 证据位置：`260922-Plan-渲染调度死锁根治.md`
- 可信度与限制：中高。问题与方案写得很具体，验证结果是文档自述，本次未复跑测试。计划状态仍含未做完的可选项。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：代表项目中的一条难点，技术能力里用半句带过。

### F6 Flutter 与 Rust 的引擎边界

- 推荐的中文表述方向：Abox Note 的笔记、历史和本地 HTTP API 在 Rust，Flutter 通过 flutter_rust_bridge 2.11 调用。生成绑定约 9700 行，业务在 `anote-serve` 模块中。
- 对应的英文关键词或简洁英文表达：`flutter_rust_bridge`，`Rust core with Flutter UI`，`local HTTP API`
- 证据位置：`anote_app/pubspec.yaml`，`anote-serve/src/frb_generated.rs` 行数，`module/data_api`
- 可信度与限制：高。不要把生成代码说成手写。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：技术能力与 aNote 项目。

### F7 桌面 sidecar 与 WASM 分词

- 推荐的中文表述方向：DaoBox 用 Electron/Solid/CodeMirror 做界面，Rust sidecar 负责文件、预览、导出和 Git；扩展属性分词编译为 WASM 并随客户端提交。
- 对应的英文关键词或简洁英文表达：`Electron sidecar`，`SolidJS`，`CodeMirror 6`，`wasm-bindgen`，`libgit2` / `git2`
- 证据位置：`EverkmNote/README.md`，`ekmn-client/package.json`，`ekmn-serve/src/git/mod.rs`
- 可信度与限制：高。Tauri 不是这条产品的当前壳。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：技术能力与 DaoBox 项目。

### F8 文档编译

- 推荐的中文表述方向：将 Markdown 映射为 Typst 字符串与结构以生成 PDF，公式经 mitex，失败可降级；另有到 docx 的一期转换。用分列的 golden 与公式回归避免两条管线互相污染。
- 对应的英文关键词或简洁英文表达：`Typst`，`mitex`，`Markdown to PDF`，`docx-rs`，`golden tests`
- 证据位置：`be/everkm-typst/README.md`，`be/everkm-docx/README.md`
- 可信度与限制：高（设计与代码存在）。视觉效果未在本次打开样张核对。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：技术能力后部，或 publish 项目下的导出格式。

### F9 数据访问

- 推荐的中文表述方向：笔记、账号和内容服务使用 SeaORM 与迁移；笔记历史混合存储全量与 unified diff。
- 对应的英文关键词或简洁英文表达：`SeaORM`，`SQLite`，`schema migrations`，`patch-based note history`
- 证据位置：各 `*-migration` crate；`anote-serve/src/module/note.rs`
- 可信度与限制：高。publish 主索引已不是 SQL 查询（见 F3）。不要写 Diesel。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：技术能力，短句。

### F10 登录集成

- 推荐的中文表述方向：为自有产品实现账号服务，接入 Google 与 GitHub OAuth，并被 DaoBox 云托管和 Youlog 引用。
- 对应的英文关键词或简洁英文表达：`OAuth (Google, GitHub)`，`account service`，`Axum`
- 证据位置：`account-serve/src/oauth_connect/`，`EverkmNote/README.md` 域名表
- 可信度与限制：中。测试很少。微信模块未确认是否对用户开放。不要和 2012 年的企业 CAS 写成一件事。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：工作经历中 Everkm 段的一句，不放首屏。

---

## 代表项目

### F11 everkm-publish 0.19.1

- 推荐的中文表述方向：独立维护 Markdown 静态发布器至 0.19.1，提供本地预览与导出，索引与渲染在 Rust core，可选 QuickJS 做页面脚本。
- 对应的英文关键词或简洁英文表达：`static site generator`，`Markdown preview and export`，`v0.19.1`
- 证据位置：`be/everkm-publish/Cargo.toml`，`PROMOTE.md`
- 可信度与限制：版本号高。npm 公网是否同版本为低，待确认。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：代表项目标题。

### F12 死锁是存活性问题

- 推荐的中文表述方向：导出在嵌套动态卡片时会永久停住。原因是固定线程池里父任务阻塞等待子任务。随后把嵌套渲染改成异步，并在超时后重建 JS 运行时。
- 对应的英文关键词或简洁英文表达：`fixed a render-pool deadlock that aborted site export`，`nested async component rendering`
- 证据位置：`260922-Plan-渲染调度死锁根治.md`
- 可信度与限制：中高。不要写“性能提升 xx%”。文档里的 37% CPU 是死锁被绕开之前的推演。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：代表项目的难点子弹。

### F13 Abox Note 1.3.1+124

- 推荐的中文表述方向：跨平台 Markdown 笔记，Rust 引擎保存 SQLite 与历史，Flutter 负责界面，并提供带变更日志的本地 API。
- 对应的英文关键词或简洁英文表达：`cross-platform Markdown notes`，`SQLite`，`change feed`，`build 124`
- 证据位置：`pubspec.yaml`，Data API 计划与路由
- 可信度与限制：版本号高。商店在架与用户量为待确认。云同步不要写入这条。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：代表项目。

### F14 DaoBox 的 Git

- 推荐的中文表述方向：桌面知识库内置基于 libgit2 的状态、提交、同步、历史和冲突读取；二进制冲突返回明确错误，不在界面里假装已合并。
- 对应的英文关键词或简洁英文表达：`built-in Git via libgit2`，`conflict read/resolve`，`binary conflicts rejected`
- 证据位置：`ekmn-serve/src/git/`
- 可信度与限制：高（API 存在）。界面是否覆盖全部操作待确认。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：代表项目子弹。

### F15 多平台打包流程存在

- 推荐的中文表述方向：笔记应用有 Android 双通道、iOS、macOS 与 Windows 的打包说明；桌面知识库把 Rust sidecar 与 Electron 安装包分成两条发布链。
- 对应的英文关键词或简洁英文表达：`multi-platform release pipeline`，`sidecar plus Electron`，`OTA promote`
- 证据位置：`anote_app/PUBLISH.md`，`EverkmNote/README.md`
- 可信度与限制：中。证明流程被写下来并有脚本入口。不证明每个商店当前有在售版本。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：代表项目的结果子弹，用“建立了发布流程”而不是“已上架全球商店”。

---

## 工作经历（Everkm，2021 起）

### F16 产品线名称

- 推荐的中文表述方向：Everkm / Abox 下的 Abox Note、Everkm Publish、DaoBox、Youlog。Abox Mark 是另一款无 Rust 的移动应用，仅在需要体现多产品时提及。
- 对应的英文关键词或简洁英文表达：`Abox Note`，`Everkm Publish`，`DaoBox`，`Youlog`
- 证据位置：各 README 与商店文案
- 可信度与限制：名称高。Mark 与 Rust 定位无关时可以不写。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：工作经历标题下的产品列表，控制在三条。

### F17 同一人贯穿需求、实现和发布

- 推荐的中文表述方向：设计笔记、实现和发布脚本在同一仓库，由同一 git 作者完成。
- 对应的英文关键词或简洁英文表达：`sole committer on the product monorepo since the 2025 import`，`spec, implementation, and release scripts in one repo`
- 证据位置：`git shortlog`；`stuff/km` 与 Makefile
- 可信度与限制：中。导入前和未进 git 的合作未知。英文不要写 `team of one` 除非本人确认。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：工作经历首句。

---

## 2015 年之前与 2015–2021（仅简历陈述）

### F18 技术管理与行业项目

- 推荐的中文表述方向：若本人确认无误，可保留职位与公司、时间，以及“负责团队与交付”这种职责句。系统细节（具体电商平台、OA、银行项目范围）在有材料或可公开讲述之前，简历上保持概括。
- 对应的英文关键词或简洁英文表达：`engineering lead`（仅当本人确认头衔可对外使用），`delivery of custom enterprise systems`
- 证据位置：`余广伟简历/index.html` 工作经历一节
- 可信度与限制：低（相对本次审计）。标记为已有简历陈述，尚无项目材料佐证。
- 是否适合放在首屏、技术能力、代表项目或工作经历中：工作经历后部。不要放进技术能力清单。

---

## 建议先不要写进投递稿的句子

| 句子 | 原因 |
|---|---|
| 精通 Vue、React、Tauri、Leptos、Java、PHP，与 Rust 并列 | 现行主路径是 Rust、Flutter、Solid、Electron。旧栈缺少近期提交 |
| 完成 CRDT 或生产级多端云同步 | 计划为草案，且文档称接口当时未实现 |
| 高并发、日活、GMV、性能提升百分比 | 没有测量数据 |
| gRPC over WASM | `diff_merge` 基本是导入的第三方树 |
| 企业级统一认证专家（用现在的 CAS 证明 2012 年） | 两个系统不能互相证明 |
| AI 工程 / LLM 应用负责人 | 只有辅助开发的流程痕迹 |
| npm 上的 everkm-publish 已是 0.19.1 | 本地包装仓仍是 0.16.15 |
