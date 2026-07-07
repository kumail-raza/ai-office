import type { RecruiterContent } from "../types";

let cache: Promise<RecruiterContent> | null = null;

/**
 * Client-side accessor for markdown-backed recruiter dashboard content. Fetches
 * once from `/api/recruiter` and caches the promise for the session.
 */
export const RecruiterContentService = {
  load(): Promise<RecruiterContent> {
    if (cache === null) {
      cache = fetch("/api/recruiter").then((response) => {
        if (!response.ok) throw new Error(`Recruiter content failed: ${response.status}`);
        return response.json() as Promise<RecruiterContent>;
      });
    }
    return cache;
  },
};
