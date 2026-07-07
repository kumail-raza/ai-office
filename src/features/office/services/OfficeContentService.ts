import type { OfficeContent } from "../types";

let cache: Promise<OfficeContent> | null = null;

/**
 * Client-side accessor for markdown-backed office content. Fetches once from the
 * `/api/office` route and caches the promise for the session.
 */
export const OfficeContentService = {
  load(): Promise<OfficeContent> {
    if (cache === null) {
      cache = fetch("/api/office").then((response) => {
        if (!response.ok) throw new Error(`Office content failed: ${response.status}`);
        return response.json() as Promise<OfficeContent>;
      });
    }
    return cache;
  },
};
