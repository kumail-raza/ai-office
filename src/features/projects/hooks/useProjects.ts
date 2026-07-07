"use client";

import { useEffect, useState } from "react";

import { ProjectService } from "../services/ProjectService";
import type { Project } from "../types";

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: boolean;
}

export function useProjects(): ProjectsState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    ProjectService.load()
      .then((loaded) => {
        if (active) {
          setProjects(loaded);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { projects, loading, error };
}
