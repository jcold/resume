import { renderToStringAsync } from "solid-js/web";
import { RootLayout } from "../layout/RootLayout";
import { maybeAwait } from "../lib/engineCompat";
import { pageNotFound } from "../lib/jsRenderError";
import { isSideIndex } from "../lib/posts";
import { DetailPage } from "./detail";

async function loadPost(props: PageContext): Promise<PostItem | null> {
  const meta = props.post;
  if (meta?.id) {
    return (
      (await maybeAwait(
        everkm.post_detail(props.request_id, { id: meta.id }),
      )) ?? meta
    );
  }
  if (meta?.path) {
    return (
      (await maybeAwait(
        everkm.post_detail(props.request_id, { path: meta.path }),
      )) ?? meta
    );
  }
  return null;
}

async function loadSideIndexes(props: PageContext): Promise<PostItem[]> {
  // 目录首页默认被排除；当前页还会被 include_myself 的默认值再排除一次。
  const listed = await maybeAwait(
    everkm.posts(props.request_id, {
      dir: "/",
      recursive: true,
      include_dir_index: true,
      include_myself: true,
      limit: 200,
    }),
  );
  return (listed?.items || []).filter(isSideIndex);
}

async function renderPage(_name: string, props: PageContext) {
  const post = await loadPost(props);
  if (!post) {
    throw pageNotFound(`Post not found: ${props.page_path || props.tpl_path}`);
  }

  const sides = await loadSideIndexes(props);
  const html = await renderToStringAsync(() => (
    <RootLayout
      context={props}
      title={post.title || "余广伟简历"}
      sides={sides}
    >
      <DetailPage post={post} />
    </RootLayout>
  ));

  return `<!DOCTYPE html>${html}`;
}

export { renderPage };
