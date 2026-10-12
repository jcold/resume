# 07 简历定位结论

审计日期：2026-10-12。这是给下一版双语简历用的判断，不是简历正文。

## 最推荐的职业定位

**做内容与文档系统的 Rust 工程师，并能独立把引擎送到桌面和移动端。**

英文可以收成一句：`Rust engineer for content systems, shipping Markdown tooling to desktop and mobile.`

这个定位同时用到三件有代码的事：自有 Markdown/发布运行时、Flutter 里的 Rust 引擎、Electron 旁边的 Rust sidecar。它不要求你再证明自己是泛前端或泛管理。

次选，仅当对方明确要“一个人交付模块”而不是 Rust 深度时：`product engineer who owns a vertical slice`（从目录里的设计笔记写到打包脚本）。这个说法真实，但更容易被理解成什么都能做，应放在定位句的后半，而不是代替 Rust。

## Rust 的真实竞争优势

优势不在“也写过 Go/PHP/Java”，而在一条垂直的内容管线：

1. **语义层是自己的。** `md-ast` 与 `everkm-markdown` 把扩展属性、剪枝和 HTML/DOM 从产品里拆出来，PDF 与 Word 复用同一思路。
2. **运行时问题有记录。** 发布器的索引曾在两个宿主里分叉，后来收成 `MemoryPostIndex`；QuickJS 嵌套渲染曾把导出卡死，文档记下了线程池死锁和后续的异步槽位方案。
3. **引擎被放进真实客户端。** aNote 用 flutter_rust_bridge，DaoBox 用 sidecar 加一小块 WASM，而不是只在 CLI 里自测。

不构成优势的 Rust 经历：夹带的 tonic WASM 客户端、停更的 Leptos 界面、只有依赖没有近期提交的 Tauri 壳。

## 最有说服力的 3 个案例

按投递时的顺序：

1. **everkm-publish 0.19.1**：内存索引、预览与导出同一运行时、QuickJS 调度死锁。Rust 浓度最高。
2. **Abox Note 1.3.1**：跨平台产品、SQLite 历史、本地变更 API、Rust/Flutter 边界。证明能交付。云同步保持不写。
3. **DaoBox**：Electron 知识库、libgit2、把发布器嵌进 sidecar、WASM 分词和分步发布。证明系统集成仍在进行（提交到 2026-10-10）。

Typst/PDF 作为第 1 条里的导出能力一句带过即可。账号与 Youlog 作为“这些工具有自己的登录和站点”一句带过即可。

## 普通技术栈列表难以表达、但值得突出的能力

- 能把重复实现收成一个接口，并在文档里禁止双读和临时兼容层（索引重构）。
- 能区分“慢”和“死锁”，并针对阻塞线程池改调度，而不是只加机器。
- 能规定 Markdown 方言的边界（Typst 矩阵里的不支持项），避免无限兼容。
- 能把同一引擎拆到 CLI、桌面进程和移动端静态库，并给每条路写发布步骤。
- 本地数据用补丁链和变更序号，而不是每次全量覆盖；同时知道云同步还没做成，就不把它写成成果。

## 暂时不建议强调的内容

- 技术能力按后端/前端/客户端铺开的长列表。Vue、React、Tauri、Java、PHP、gRPC、CRDT 会冲淡 Rust。
- “全栈”或“什么都能做”。材料支持的是内容系统这一条，不是任意业务系统。
- 多端云同步、CRDT、高并发指标、用户量、GMV。
- 用 2025 年的 `account-serve` 证明 2012 年的企业 CAS。
- AI 工程师。可以在简介保留一句：用书面约束和测试验收辅助生成的代码。
- Abox Mark，除非版面专门展示第二个独立 App。
- `note-app` 的三万行历史代码。它不是现行 DaoBox。

## 适合国内外远程岗位的关键词

优先匹配这些职位描述里的词：

- `Rust`，`Tokio`，`Axum`
- `Markdown`，`static site generation`，`content pipeline`，`document conversion`
- `libgit2`，`SQLite`，`local-first`（仅限本机权威数据；不要写成已完成同步）
- `Electron`，`Flutter`，`WASM`，`flutter_rust_bridge`
- `PDF`，`Typst`（对方做文档或出版时）
- `codebase modernization`，`index consolidation`，`render pipeline`
- `remote`，`contract`，`part-time`，`independent`

对方如果主要招 Kubernetes、分布式存储、广告竞价、支付清结算，现有公开材料对不上，不要用 2015–2021 的概括句去硬贴。

## 为完成最终简历还要补的事实

阻塞初稿用词的只有这些（对应 `06` 的前几题）：

1. 三个项目各自可以放在简历上的 **公开 URL**。
2. Publish 对外版本、Note 的在架情况、DaoBox 的版本号。
3. 云同步与 Tauri/Leptos 是否从简历删除。你不回答的话，初稿应按“删除”处理。
4. 2021 至 2025-03 是否另有仓库。没有的话，Everkm 段的起始可以写 2021（你的经历），但技术细节只写 2025 之后能指向文件的部分。
5. 2015–2021 你希望保留的 **两件** 可被追问的事。其余雇主经历保留公司、职位、时间即可。

在这些事实补上之前，不建议直接重写对外简历。素材已经足够起一版“只含高与中高可信度句子”的草稿，但 URL 和在架状态会改变项目标题怎么写。
