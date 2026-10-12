import { Component, Show } from "solid-js";

export const DetailPage: Component<{ post: PostItem }> = (props) => {
  return (
    <div class="md">
      <Show when={props.post.title}>
        <h1>{props.post.title}</h1>
      </Show>
      <div innerHTML={props.post.content_html || ""} />
    </div>
  );
};
