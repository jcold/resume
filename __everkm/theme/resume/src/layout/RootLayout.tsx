import { For, ParentComponent, Show } from "solid-js";
import resumeCss from "../assets/css/resume.css";

const PRINT_BUTTON =
  '<button type="button" onclick="window.print()">打印</button>';

/** 当前页所在目录，如 `/rust/`、`/rust/index.html` → `rust`。 */
function sideDir(context: PageContext): string {
  const raw =
    context.page_path || context.post?.path || context.post?.url_path || "";
  const parts = raw.split("/").filter(Boolean);
  if (parts.length && /^index\.(md|html)$/i.test(parts[parts.length - 1])) {
    parts.pop();
  }
  return parts.join("/");
}

const COPY_SCRIPT =
  "document.addEventListener('click',function(e){" +
  "var el=e.target.closest('.contact .copy');" +
  "if(!el||!navigator.clipboard)return;" +
  "navigator.clipboard.writeText(el.textContent.trim()).then(function(){" +
  "el.setAttribute('data-tip','已复制');" +
  "setTimeout(function(){el.removeAttribute('data-tip');},1200);" +
  "});" +
  "});";

type RootLayoutProps = {
  context: PageContext;
  title?: string;
  sides?: PostItem[];
};

export const RootLayout: ParentComponent<RootLayoutProps> = (props) => {
  const title = () =>
    props.title || props.context.post?.title || "余广伟简历";
  const sides = () => (props.sides || []).filter((side) => side.url_path);
  const actionsHtml = () => {
    const dir = sideDir(props.context);
    const name = dir.split("/").pop() || "";
    if (!name) return PRINT_BUTTON;
    const file = `余广伟-${name}.pdf`;
    return (
      PRINT_BUTTON +
      `<a href="${file}?__not_follow" download="${file}">保存 PDF</a>`
    );
  };

  return (
    <html lang={props.context.lang || "zh"}>
      <head>
        <meta charset="utf8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap"
        />
        <title>{title()}</title>
        <style>{resumeCss}</style>
        <script>{COPY_SCRIPT}</script>
      </head>
      <body>
        <div class="actions" innerHTML={actionsHtml()} />
        <main class="sheet">{props.children}</main>
        <Show when={sides().length > 0}>
          <nav hidden>
            <For each={sides()}>
              {(side) => <a href={side.url_path}>{side.title}</a>}
            </For>
          </nav>
        </Show>
      </body>
    </html>
  );
};
