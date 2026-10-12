# 02 Rust 能力审计

审计日期：2026-10-12。证据来自 `/Users/dayu/Coder/everkm/everkm2` 及少数并列仓库。分级：

- **A** 有充分代码或文档证明实际写过并被调用。
- **B** 项目里出现过，深度或是否仍在维护不清楚。
- **C** 只有依赖、生成代码或第三方树，不能证明掌握。
- **D** 未找到证据。

依赖某个 crate 只记入 C，除非同时看到调用点和测试或设计说明。

## 1. Rust 在这些产品里的角色

本人职责的默认判断：**合理推断为独立开发**。依据是 everkm2 提交作者只有 `dayu`，设计文档用第一人称工程口吻写决策，发布 Makefile 也在同一仓库。没有看到第二名长期协作者。此判断仍需本人确认是否有未进 git 的合作。

| 项目 | Rust 的角色 | 状态 | 代码能证明什么 | 文档能证明什么 |
|---|---|---|---|---|
| `everkm-markdown` + `md-ast` + `md-ext-attr` | 内容引擎：解析、扩展语法、HTML/DOM、剪枝、编辑器分词 WASM | 库，被多个产品链接；2026 年仍在改 | 自有 AST、nom 分词、pulldown-cmark 事件、rayon、大量单测 | 《我的理想 Markdown 语法》（2023-09 起的诉求清单）与 md-ast README 说明扩展属性模型 |
| `everkm-publish` / `ekmpc` | 静态站点生成器的全部核心：索引、模板、预览 HTTP、导出、JS 渲染调度 | 持续开发；内部发布记录到 **v0.19.1（2026-09-23）** | Axum 预览、`MemoryPostIndex`、rquickjs worker、导出冒烟测试 | `stuff/km/` 有完整架构与一次死锁根治记录 |
| `everkm-typst` | Markdown/公式到 Typst、PDF、SVG、PNG、卡片 | 2026-07 至 2026-10 活跃 | Typst AST 映射、golden 测试目标写在 Makefile 说明里 | 特殊字符策略、能力矩阵、明确写出不支持项 |
| `everkm-docx` | Markdown 到 Word | 2026-09-15 集中提交 | docx-rs 转换与测试 | 计划文档写明一期不做 frontmatter / private |
| Abox Note `anote-serve` | 移动/桌面笔记的本地引擎：SQLite、历史、Data API、经 FRB 暴露给 Flutter | 产品版本 `1.3.1+124`；2025-06 起约 1900 次提交落在 `anote/` | SeaORM、Axum Data API、diff 历史重建、utoipa、FRB | Data API 计划状态为 done；云同步计划状态为 draft，且写明 `/sync/fetch` 当时没有实现 |
| DaoBox `ekmn-serve` | 桌面知识库 sidecar：文件、预览、导出、Git、反向链接 | 2026-07 起约 536 次提交 | git2 的 status/diff/commit/sync/conflict/LFS、嵌入 publish | README 与打包文档描述 Drone 编 sidecar、GitHub Actions 编 Electron |
| `account-serve` + `cas` | 账号与登录 | 有镜像构建与部署流水线名 | OAuth Google/GitHub 路由、SeaORM | 测试极少。能证明做过登录集成，不能证明有完整安全审计 |
| `youlog-serve` | 内容产品的 API + SSR 宿主 | 持续到 2026-09 | Axum、SeaORM、markdown、oauth2、rust-s3 | README 描述 Nginx 反代与 SSR 拓扑 |
| `note-app`、`mdnote-*`、`wz-server`、`diff_merge` | 旧笔记 / 旧桌面 / 实验 | 导入后几乎停更 | 大段历史代码还在 | DaoBox README 把 mdnote 称为零件库 |

## 2. 语言与工程实践

### 2.1 已达到 A 的部分

**所有权、Arc 与并发读路径。**  
`everkm-publish-core/src/memory_index/index.rs` 中 `MemoryPostIndex` 用 `ArcSwap<IndexSnapshot>` 换根，条目为 `Arc<PostItem>`，写路径用 `Mutex` 串行化 copy-on-write，读路径不走这把锁，并用 `tokio::sync::watch` 广播代际。同文件使用 `async_trait`。这是业务索引，不是教程示例。

**trait 作为模块边界。**  
索引重构文档（`260806-Plan-内存索引权威与薄数据源适配.md`）把 `PostIndex` 收成唯一实现，文件系统与 aNote 只做灌入。文档记录当时 `cargo test --lib` 的通过数。本次没有复跑，那些数字只代表文档撰写时的自述。

**错误处理与类型建模。**  
主线 crate 同时使用 `anyhow` 与 `thiserror`。DaoBox Git 冲突读取定义了 `FsError { code, message }`，二进制冲突返回明确错误码 `binary_conflict`（`EverkmNote/ekmn-serve/src/git/conflict.rs`）。aNote Data API 文档要求 `map_anyhow` 优先映射 `BizError`。

**async/await 与 Tokio。**  
publish 约 248 个 `async fn`，anote-serve 约 630 个，ekmn-serve 约 166 个，youlog 约 207 个。Web 框架是 Axum，不是 Actix。

**嵌入式 JS 运行时与死锁。**  
`260922-Plan-渲染调度死锁根治.md` 描述的问题是：固定大小 worker 池里，父页面渲染同步等待子 dcard，子任务又要同一个池里的 worker，线程在阻塞 `recv` 上不再 poll，超时也无效。文档记录的处理包括：QuickJS 槽位独立 `AsyncRuntime`、嵌套 API 改为 Promise、等待时释放 CPU 许可、看门狗取消后重建槽位、`PublishEngine` 循环强引用改为 `Weak`。状态写明 P0–P1、A1、permit-on-await、R4、A2 的 T0–T2 已合入，可选缓存仍开放。这是本次看到的最完整的 Rust 并发问题记录。

**Markdown 解析。**  
`everkm-markdown` 依赖 pulldown-cmark、nom、nom_locate、rayon、html5ever、scraper。源码拆出 `parse.rs`、`dom_writer.rs`、`html_writer.rs`、`ext_attrs.rs`、多种 marker。`md-ast` 在 Event 之上建树，扩展属性挂在宿主节点上，按标签剪枝，并声明不内置产品标签。aNote 需要 UTF-16 偏移时才开 feature。这是跨编辑器与发布器的接口设计，不是把一个 markdown crate 包一层。

**数据库。**  
aNote、account、youlog、daobox-cloud、favorites 等使用 SeaORM 与 `sea-orm-migration`。aNote 笔记历史是 `note` + `note_history`（全量或 diffy unified patch），读取函数 `reconstruct_content_from_history` 在 `anote/anote-serve/src/module/note.rs`。云同步计划自己指出：master 写入当时没有真正的 compare-and-swap，并发可能丢提交。这是代码审查结论，不是已修复声明。

**序列化、HTTP API、OpenAPI。**  
aNote Data API 用 utoipa 在编译期生成 OpenAPI，路由包括 `/api/changes`。DaoBox Git 结构体使用 serde camelCase 与 `ToSchema`。

**文件系统、监听与导出。**  
publish README 描述工作目录 Markdown、watch 增量、冷启动按 mtime/size 跳过未改文件、frontmatter id 冲突则启动失败。`notify` 出现在 publish 与 abox-vat 依赖中。

**Git 集成。**  
`EverkmNote/ekmn-serve/src/git/mod.rs` 用 git2 实现 init/clone、status、stage、commit、diff、history、restore、fetch/sync、冲突读写、LFS、ignore。这是桌面应用里的版本管理子系统，不是调用 `git` 命令的一行脚本。二进制冲突被明确拒绝，而不是假装能合并。

**FFI / 跨语言。**

- Flutter：`anote_app` 依赖 `flutter_rust_bridge: 2.11.1` 与 path 包 `rust_lib_anote_app`。`frb_generated.rs` 约 9775 行，是生成代码。手写引擎在 `anote-serve` 其余模块。发布脚本要求 Android 打包时先编 Rust release 再编 APK。
- WASM：DaoBox 把 `md-ext-attr` 编进客户端 `wasm-pkg/`，README 规定 GitHub Actions 不编译 WASM，只消费已提交产物。这是有发布约束的集成，不是 demo。
- 桌面 sidecar：DaoBox 的 Electron 不把业务写进 Node，而是拉起 Rust 二进制 `daobox`。Drone 流水线名称包含 linux/win、mac arm64+x64、R2 上传。

**测试与发布流程（流程存在，本次未复跑）。**

- publish：`make test-ci` 含 workspace lib 测试、export feature、`export_smoke`、core API 面检查。README 解释为何 `--test-threads=1`（共享 sqlite/夹具）。注意：2026-08 架构文档称已删除 SQLite 查询主路径；当前 README 仍有 `everkm-publish.db` 一节。以 `MemoryPostIndex` 源码为准，README 该节可能滞后。
- typst：`make test` 含 golden typ/png；文档把公式管线与正文管线分开回归。
- aNote：`note/tests.rs` 体量在云同步文档里被写成约 4700 行；Data API 计划列出鉴权、变更日志、附件等测试名。dev-dependencies 文档称已加入 proptest 与 insta，本次未打开 `Cargo.toml` 逐项核对版本号是否仍在。
- CI：`.drone.yml` 含 DaoBox sidecar、account-serve、anote-serve、EverkmPublish、youlog 等 pipeline 名称。这证明仓库里写了流水线，不证明每次提交都绿。

**生命周期。**  
everkm-markdown 源码中 `'a` 出现约 88 次，anote-serve 约 346 次。次数只能说明生命周期标注真实存在，不能单独当成“精通生命周期”的证明。结合解析器和索引代码，更稳妥的说法是：在解析、借用和跨异步边界传递 `Arc` 上有生产代码，而不是只在练习里写过。

### 2.2 标为 B 的部分

| 项 | 原因 |
|---|---|
| Leptos + WASM UI（`mdnote-wasm` 约 2.1 万行） | 代码量大，但 2025-09 之后基本没有提交。现行界面是 Flutter 与 Solid。可能是放弃的前端路线 |
| Tauri（`mdnote-tauri`） | 依赖完整，提交只有 3 次。现行 DaoBox 是 Electron + sidecar |
| SeaORM 在 everkm-publish 主路径 | 架构文档写已删除查询用 SQLite；README 仍描述 db 缓存。需要本人确认现在到底还有没有库文件 |
| `git2` 在 `note-app` / `mdnote-serve` | 依赖在，那些 crate 已不是现行产品。现行 Git 子系统看 `ekmn-serve` |
| Meilisearch（`abox-favorites`） | 依赖和一篇运维 README。未读索引与查询实现 |
| S3 / rust-s3 / rusty-s3 / 自写 SigV4（imago-storage、youlog、daobox-cloud） | 多个服务声明了对象存储。未读上传、签名和失败重试是否完整 |
| Redis | flog、wz-server、thc-api、aNote 云同步文档中的 checkpoint。使用点分散 |
| sqlx 与 SeaORM 并存 | 若干服务两边都依赖。看不出是迁移中还是各用一层 |
| criterion bench | `everkm-markdown` 声明了 `[[bench]]`。未读 bench 内容，也未运行 |
| OAuth | Google 与 GitHub 有独立模块和路由。安全细节（state、nonce、token 存储）未逐行审计。报告不摘录环境变量 |
| 微信模块 `wxmp` | account-serve 有该文件。未读协议完成度 |
| rquickjs 主题 ABI | 死锁文档描述了主题迁移到 async render。主题仓库 `ekmp-themes` 本次未对照 JS 源码 |

### 2.3 标为 C 的部分

| 项 | 原因 |
|---|---|
| `tonic` / `prost` / `tonic-web-wasm-client` | `diff_merge` 自有代码约 105 行，并夹带整份第三方 crate。`note-app` README 只有 grpcurl 示例，且该服务已停更。不能写成 gRPC/WASM 客户端经验 |
| 本地 fork 的 Tera 1.17.1 | 死锁文档写明 Tera 内核无需改造成 async。仓库里有一份 fork，不等于维护了模板引擎 |
| `json-patch` | 云同步文档写明已声明但未使用 |
| Actix、Diesel、Yew | 未作为依赖出现在抽查的主线 Cargo.toml |

### 2.4 标为 D 的部分

- 没有 CRDT、OT、多人实时光标。云同步文档把这些列为非目标。
- 没有在代码中找到 Kubernetes operator、自研异步运行时、内核或嵌入式裸机 Rust。
- 没有独立的 Rust 编译器、语言工具链或数据库引擎项目。
- 性能数字：架构文档里的「5 万篇约百兆」「8 核利用率约 37%」是设计推演，不是本次测量，也没有生产监控导出。简历里不要写成基准测试结果。

## 3. 有证据链的工程难点

下面三条有「问题 → 旧方案不足 → 做法 → 文档中的结果」。其余想法只记在待确认。

### 3.1 发布器渲染死锁（2026-09-22）

- **问题：** 站点在 DaoBox 里导出，大约 40 页后停住；预览会永久转圈。文档认为是 JsRender 实例报废，不是单纯慢。
- **旧方案不足：** worker 固定为 3，导出并发为 4，嵌套 dcard 在已占用的 worker 上阻塞等待同一队列。Tokio 的 timeout 包不住已经不 poll 的线程。为了避开死锁，页并发被压到 2。
- **方案：** 求值链改为可等待的 Promise；CPU 许可与 JS 上下文槽分离；超时后丢弃挂起的 Runtime 并补槽；文档 IR 避免重复解析；拆掉 `JsRender` 与 `PublishEngine` 的循环 `Arc`。
- **文档记载的验证：** 夹具 `test_data/tehaochi-nest`，用例名 `export_tehaochi_nest_high_concurrency_completes`（workers=4，墙钟 90s）；`js_render` 组 34/34；`make test-ci` 全绿。**这是文档自述，本次未复跑。**
- **仍开放：** 可选的 dcard 结果缓存、CTX_POOL RSS。计划状态写的是 in_progress。

### 3.2 索引从各宿主各写一份，收成内存权威（2026-08-06）

- **问题：** ekmp 用 SQLite 做查询，aNote 自研另一套 snapshot，`include_dir_index` 等语义会漂移。
- **旧方案不足：** 双实现、深拷贝整表、用缓存框架当主索引。
- **方案：** core 内唯一 `MemoryPostIndex`；宿主只负责 parse 后灌入；快照文件只为冷启动；传递用 `Arc`。文档强调不要留双读和兼容层。
- **文档记载的结果：** 计划状态「全部完成」，并记录当时 publish 与 anote-serve 的测试通过数。
- **限制：** 容量假设是单机内存，文档写明不做多进程共享索引。README 与该计划对 SQLite 的描述不一致，见 2.2。

### 3.3 Markdown 到 Typst 时避免标记字符被误解析（2026-07）

- **问题：** 用户正文里的 `# $ * _` 等如果拼进 Typst markup，会变成语法。
- **方案：** 用户文本只进入字符串字面量，结构走 AST / ContentBlock；公式失败默认降级为 raw，整篇 PDF 仍生成（`math_strict` 可改为失败）。
- **结果：** README 有支持 / 不支持矩阵。不支持项包括裸 URL autolink、HTML 当源码展示、Mermaid 不当图渲染。这种边界写进了文档，适合简历里写“知道自己没做什么”。
- **限制：** 缺字被文档归为字体覆盖问题。视觉一致性依赖 `anote-fonts`，本次未打开字体仓库。

### 3.4 有代码、但证据链不完整

| 主题 | 能看到的 | 缺什么 |
|---|---|---|
| aNote 本地历史与三方合并 | `diffy`、history patch 链、`reconstruct_content_from_history`；云同步文档指出 master 无 CAS | 云同步计划仍是 draft。文档写 `/sync/fetch` 与 `/sync/push` 当时全库无实现。不能写成已经上线的多设备同步 |
| aNote Data API | 计划 status done（2026-09-25 至 10-09）；路由与变更查询代码存在 | 未核对是否已有外部客户端在日常使用。DaoBox 同步 Tab 只在关联文档标题里出现 |
| DaoBox Git 冲突 | `conflict_read` / `conflict_resolve`，拒绝二进制冲突 | 未读 UI 是否把 ours/theirs 完整交给用户。未看到大规模仓库上的事故记录 |
| 扩展属性 WASM | 构建与入库流程写在 DaoBox README | 未读 `md-ext-attr` 源码复杂度 |

## 4. 和其他语言的边界

Rust 没有包办 UI。

- 笔记交互、键盘、弹层、商店打包在 Flutter。
- DaoBox 编辑器是 CodeMirror 6 + Solid，Rust 提供文件、Git、预览、导出和发布。
- Youlog 页面是 Solid，Rust 负责 API 与 SSR 宿主。
- 主题模板是 Tera / JS，不是 Rust。

简历如果只写 “Rust 工程师” 而完全不提客户端，会丢掉交付事实；如果把 Vue/React/Flutter/Tauri 并列成同等深度，又和现行代码不符。建议的比重见 `07-resume-positioning.md`。

## 5. 待确认（细节在 06）

1. everkm-publish v0.19.1 是否已发布到公网 npm。本地 `everkm-publish-npm/package.json` 仍是 0.16.15，最后提交 2026-07-04。
2. SQLite 元数据缓存是否还在 publish 运行路径上。
3. 死锁修复之后，tehaochi 或 DaoBox 导出是否还复现过。
4. aNote `1.3.1+124` 是否已在 App Store、Play 或官网提供下载。发布脚本存在，不等于商店在架。
5. Leptos WASM 与 Tauri 壳是否可以公开称为已放弃。
6. `frb_generated.rs` 之外，Rust API 面有多少是手写。生成代码不能算进“手写行数”。
