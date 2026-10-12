/** 新引擎里部分 everkm 函数返回 Promise，旧引擎同步返回。 */
export function maybeAwait<T>(value: MaybePromise<T>): Promise<T> {
  return Promise.resolve(value);
}
