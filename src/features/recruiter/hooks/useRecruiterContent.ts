"use client";

import { useEffect, useState } from "react";

import { RecruiterContentService } from "../services/RecruiterContentService";
import type { RecruiterContent } from "../types";

interface RecruiterContentState {
  content: RecruiterContent | null;
  loading: boolean;
  error: boolean;
}

export function useRecruiterContent(): RecruiterContentState {
  const [content, setContent] = useState<RecruiterContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    RecruiterContentService.load()
      .then((loaded) => {
        if (active) setContent(loaded);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { content, loading: content === null && !error, error };
}
