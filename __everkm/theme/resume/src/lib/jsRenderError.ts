export const PAGE_NOT_FOUND = "PAGE_NOT_FOUND";

export function pageNotFound(message: string): Error {
  const err = new Error(message);
  (err as Error & { code: string }).code = PAGE_NOT_FOUND;
  return err;
}
