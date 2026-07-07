import type { Project } from "../types";

let cache: Promise<Project[]> | null = null;

/** Client-side accessor for markdown-backed projects. Fetches once and caches the promise for the session. */
export const ProjectService = {
  load(): Promise<Project[]> {
    if (cache === null) {
      cache = fetch("/api/projects").then((response) => {
        if (!response.ok) throw new Error(`Projects request failed: ${response.status}`);
        return response.json() as Promise<Project[]>;
      });
    }
    return cache;
  },
};
