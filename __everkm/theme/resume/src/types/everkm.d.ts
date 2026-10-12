/// <reference path="./context.d.ts" />
export {};

declare global {
  interface Everkm {
    markdown_to_html(content: string): string;
    base_url(requestId: string, args?: { url?: string }): string;
    posts(
      requestId: string,
      args?: FetchPostsArgs & { offset?: number; limit?: number },
    ): MaybePromise<{
      items: PostItem[];
      total: number;
    }>;
    posts_directory_list(
      requestId: string,
      args?: PostsDirectoryArgs,
    ): MaybePromise<string[]>;
    post_meta(
      requestId: string,
      args: FetchPostArgs,
    ): MaybePromise<PostItem | null>;
    post_detail(
      requestId: string,
      args: FetchPostArgs,
    ): MaybePromise<PostItem | null>;
    config(requestId: string, args: ConfigArgs): any;
    lang(): string;
  }

  interface FetchPostsArgs {
    dir?: string;
    tags?: string[];
    exclude_tags?: string[];
    categories?: string[];
    draft?: boolean;
    recursive?: boolean;
    include_myself?: boolean;
    include_dir_index?: boolean;
    order_by?: "date" | "updated_at" | "title";
    order_direction?: "asc" | "desc";
  }

  interface PostsDirectoryArgs extends FetchPostsArgs {
    prefix?: string;
    max_depth?: number;
  }

  interface FetchPostArgs {
    id?: string;
    path?: string;
    lazy_img?: boolean;
    exclude_tags?: string;
    allow_missing?: boolean;
  }

  interface ConfigArgs {
    key: string;
    default?: any;
  }

  type MaybePromise<T> = T | Promise<T>;

  var everkm: Everkm;
}
