"use client";

import { useEffect, useState } from "react";

import { OfficeContentService } from "../services/OfficeContentService";
import type { OfficeContent } from "../types";

interface OfficeContentState {
  content: OfficeContent | null;
  loading: boolean;
  error: boolean;
}

export function useOfficeContent(): OfficeContentState {
  const [content, setContent] = useState<OfficeContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    OfficeContentService.load()
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
