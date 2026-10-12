# 04 工程经历（Rust 主线之外）

本文件收的是架构、数据、内容、跨平台、集成和交付。Rust 语言细节在 `02`。凡是只有简历句子、没有仓库的，都标成已有简历陈述。

## 1. 复杂系统的边界与演进

**直接证据：发布器从“各宿主一套查询”收成一个内存索引。**  
2026-08 的计划写明 ekmp 与 aNote 曾经各做 `PostIndex`，随后删除宿主侧查询，只保留 core 的 `MemoryPostIndex`。文档还要求不要留双读和长期兼容层。这是可以讲的架构演进：发现问题是语义漂移，处理方式是收接口，而不是再包一层。

**直接证据：笔记产品拆掉了和发布器的耦合。**  
2026-09-25 的 Abox Note 计划把站内预览/导出从 App 去掉，Data API 与云同步计划脱钩。说明产品边界会随决策收缩，不是功能只增不减。

**直接证据：DaoBox 把界面、sidecar、WASM 分词、云托管、发布器分成可独立发布的部分。**  
Electron 不编译 Rust；Drone 编 sidecar；Actions 编安装包；WASM 必须事先入库。这种发布边界本身就是架构。

**直接证据：旧代码还在树上，但提交已经停了。**  
`note-app`、`mdnote-wasm`、`mdnote-tauri`、`wz-server` 说明做过多代笔记客户端（gRPC/Electron、Leptos WASM、Tauri、Flutter、再是现在的 Electron sidecar）。简历可以写“同一产品线换过几代运行时”。不要把每一代都写成当前技能。

**没有材料的部分：** 简历中的“随业务增长推动架构演进”“接手高耦合系统重构”，对应 2005–2021 的雇主项目。本次没有那些仓库，不能补充技术事实。

## 2. 数据、版本与同步

| 机制 | 证据 | 能怎么说 | 不能怎么说 |
|---|---|---|---|
| 笔记历史 | `note` + `note_history`，全量或 diffy patch，`reconstruct_content_from_history` | 做过基于补丁链的笔记版本重建 | 已上线的多设备云同步 |
| 云同步设计 | `260818-Plan` 状态为 draft；文档写当时没有 `/sync/fetch` 实现，并指出 master 写入缺少条件更新 | 做过同步协议设计，并在文档里记下现有丢失条件 | 冲突已在生产中自动合并 |
| 本机 Data API | 计划 status done；有 `/api/changes`、修订、附件、会话令牌 | 做过给外部程序用的变更日志 API | 已有大量第三方客户端 |
| 发布索引 | `ArcSwap` 快照、冷启动按 mtime/size 跳过、frontmatter id 冲突则失败 | 做过单机内容索引的增量与一致性约束 | 分布式索引或百万级在线检索 |
| DaoBox Git | git2：status、commit、fetch/sync、冲突读取、LFS 模块、拒绝二进制冲突 | 把 Git 模型嵌进知识库，并承认二进制冲突不在 UI 里解 | 自研了可替代 Git 的同步协议 |
| 旧 diff_merge | 约 105 行，导入后再无提交 | — | WASM/gRPC 合并经验 |

简历里的“异构数据同步”如果要保留，应改成上面表里有代码的那几行，并删掉没有实现的云同步完成时。

## 3. 内容处理

这条线从 2023-09 的《我的理想 Markdown 语法》写到 2026 年的 AST、HTML/DOM、Typst、Word、编辑器分词，跨度有文档日期，不依赖口头描述。

已实现并被依赖的能力：

- CommonMark/GFM 事件之上的自有树（`md-ast`）
- 扩展属性 `{...}`、行内 span、剪枝 API
- HTML 与 ego-tree DOM 写入（死锁计划里的 A2 提到 `dom_writer.rs`，且该文件存在）
- 内链、目录配置、标签、多语言文案包（publish 功能概述）
- 公式到 SVG/PDF/PNG，失败可降级
- Word 的一期结构转换
- DaoBox 编辑器使用 CodeMirror 6；扩展属性分词用 WASM
- aNote 使用 Flutter 侧的 Markdown/预览组件，Rust 侧仍有 everkm-markdown 依赖

明确不做或降级的（typst README）：裸 URL 不自动变链接、HTML 当源码、Mermaid 不预渲染、无定义的脚注引用会跳过。这些边界适合写进项目描述，避免面试时被追问“所有 Markdown 方言”。

旧前端目录 `fe/packages/note` 在本仓库几乎停更。Web 编辑器的现行实现应指向 DaoBox 的 CodeMirror，以及 aNote 的 Flutter 编辑栈。简历上的 “Web 编辑器” 需要本人确认是否还要保留 React/Vue 时期的编辑器，本次没有在主路径上读到它们。

## 4. 跨平台

| 产品 | 平台证据 | Rust 是否在设备上 |
|---|---|---|
| Abox Note | `PUBLISH.md` 覆盖 Android sideload APK、Play AAB、iOS Ad-hoc 与 App Store 导出说明、macOS DMG、Windows 镜像仓 | 是，FRB 静态库打进 Flutter |
| DaoBox | README：Drone 编 linux、win、mac arm64 与 x64 sidecar；Electron 打安装包 | 是，独立 sidecar 进程 |
| Abox Mark | `marker/README.md`：仅 iOS/Android，无 Rust，SQLite | 否 |
| everkm-publish | Drone 流水线名含 build-base、build-dmg、publish alpha | CLI，不是 App |
| md-ext-attr | 提交进 DaoBox 的 wasm-pkg | 浏览器/Electron 里的 WASM |

Tauri 与 Leptos 有历史 crate，不是这张表的当前行。

发布工程本身有一定复杂度：公证、flavor、OTA 与官网短链分步、R2 与七牛的文档描述、Windows 构建放在单独 GitHub 仓。这是交付能力，不是语言能力。本次没有打开商店后台核对每个制品是否对外可见。

## 5. 身份认证与外部系统

**现行产品（有代码）：**

- `account-serve`：Google OAuth、GitHub OAuth，文件级模块；`httpd.rs` 合并了对应 router
- 同目录有 `wxmp` 与七牛存储文件。微信是否对终端用户开启，待确认
- DaoBox 云文档把登录回调放到公网 CAS 域名，本地用 hosts 和反代模拟生产拓扑
- Youlog / aNote 文档提到 401 时跳 CAS

**2009–2012 简历中的 CAS、LDAP、OAuth2：** 已有简历陈述。不要用现在的 `account-serve` 去证明那段经历，两个系统相隔十余年，代码库也不同。

**电商与 OA 对接（京东、苏宁、网易严选、淘宝、蓝凌、致远、企业微信、钉钉、交通银行）：** 只出现在 `index.html`。`/Users/dayu/Coder/yiibox` 下有 `rise_admin`、`rise_fe` 等目录名，本次没有打开，不能假定它们就是福利商城。标为未核实。

## 6. 从需求到发布的工程化

能在仓库里看到的闭环：

1. `stuff/km` 里大量 Plan / Feature，带状态、变更记录和“不做什么”。
2. 实现落在同一仓库。
3. 测试夹具与 `make test-ci`、golden、导出冒烟写进 README。
4. Drone、GitHub Actions、OTA、hoc 内测页、官网短链分步写进发布文档。
5. 故障处理写进 publish README（数据库锁、重复 id、导出探活失败）和 typst README（Windows 拉依赖失败）。

缺口：

- account/cas 测试很少，和 publish/aNote 不在一个水平。
- 本次没有 CI 的最近一次绿灯记录。流水线文件存在不等于主干始终可发布。
- 没有错误预算、值班或事故复盘邮件。死锁文档是最接近事故分析的材料。

## 7. AI 协作

能看到的痕迹：

- everkm2 根目录有 `.claude/`
- `md-ast/docs/ai_discuss/` 有分析笔记
- 索引计划写了“AI / 人工均适用”的实施约束（禁止双读、禁止只为迁移而留的类型）
- 云同步计划写了针对 AI 编码的测试纪律和机器可断言的不变量

这些说明：近期开发使用了 AI 辅助，并且用书面约束和测试来限制生成结果。它们**不能**证明：

- 做过面向用户的 AI 产品
- 建立了可复用的评测集或代理系统
- 生成代码的缺陷率低于手写

现行简历把 “AI 协作开发” 放在简介里。若保留，应写成工作方式：用设计约束和测试验收生成代码。不要写成 AI 工程师职位。

## 8. 2005–2021 工作经历对照

| 简历条目 | 本次材料 | 标记 |
|---|---|---|
| 2005–2009 中铝信息，组团队，ASP 到 PHP | 无仓库、无提交 | 已有简历陈述，尚无项目材料佐证 |
| 2009–2012 聚胜万合，PHP 框架、CAS、云开发环境、广告排期 | 无仓库 | 同上 |
| 2012–2015 盒拓，移动广告，从 0 组团队，PHP/Java/Android/iOS | 无仓库 | 同上 |
| 2015–2021 爱关怀 / 星光物语，福利电商、多电商对接、OA、交通银行项目、技术总监 | 无对应业务仓库。`yiibox` 目录名未核 | 同上 |
| 2021 起 Everkm 独立产品 | everkm2 与并列仓库 | 2025-03 之后有完整 git；2021–2025-03 的提交不在 everkm2，可能在未审计的旧目录 |

团队规模、客户名称、驻场、讲标、流量增长，都只有简历陈述。在补充旧仓库或可公开的项目说明之前，双语简历里这些句子应降级为职责概述，并避免写出无法被追问的系统细节。
