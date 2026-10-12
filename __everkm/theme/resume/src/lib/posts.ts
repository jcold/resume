/** 一级目录首页：`/rust/index.md`，不含 `work/kb/` 这类更深的文件。 */
export function isSideIndex(post: PostItem): boolean {
  return /^\/[^/]+\/index\.md$/i.test(post.path || "");
}
