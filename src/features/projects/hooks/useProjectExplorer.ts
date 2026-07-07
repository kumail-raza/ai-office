"use client";

import { useMemo, useState } from "react";

import { type Project, type ProjectFilterState, ProjectStatus, type ProjectSortKey } from "../types";

const DEFAULT_FILTERS: ProjectFilterState = {
  query: "",
  technologies: [],
  statuses: [],
  sort: "recent",
};

function matchesQuery(project: Project, query: string): boolean {
  if (query.trim().length === 0) return true;
  const haystack = `${project.title} ${project.summary} ${project.technologies.join(" ")}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function toSortableDate(value: string): number {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function sortProjects(projects: Project[], sort: ProjectSortKey): Project[] {
  const sorted = [...projects];
  if (sort === "title") return sorted.sort((a, b) => a.title.localeCompare(b.title));

  sorted.sort((a, b) => {
    const aEnd = a.endDate.toLowerCase() === "present" ? Date.now() : toSortableDate(a.endDate);
    const bEnd = b.endDate.toLowerCase() === "present" ? Date.now() : toSortableDate(b.endDate);
    return sort === "recent" ? bEnd - aEnd : aEnd - bEnd;
  });
  return sorted;
}

/**
 * Pure client-side search/filter/sort logic for the Project Explorer, kept
 * separate from rendering. Derives the visible list and the available
 * technology/status facets from the loaded project list.
 */
export function useProjectExplorer(projects: Project[]) {
  const [filters, setFilters] = useState<ProjectFilterState>(DEFAULT_FILTERS);

  const availableTechnologies = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.technologies))).sort(),
    [projects],
  );

  const availableStatuses = useMemo(
    () => Array.from(new Set(projects.map((project) => project.status))) as ProjectStatus[],
    [projects],
  );

  const results = useMemo(() => {
    const filtered = projects.filter((project) => {
      if (!matchesQuery(project, filters.query)) return false;
      if (filters.technologies.length > 0) {
        const hasTech = filters.technologies.some((tech) => project.technologies.includes(tech));
        if (!hasTech) return false;
      }
      if (filters.statuses.length > 0 && !filters.statuses.includes(project.status)) return false;
      return true;
    });
    return sortProjects(filtered, filters.sort);
  }, [projects, filters]);

  const setQuery = (query: string) => setFilters((prev) => ({ ...prev, query }));
  const setSort = (sort: ProjectSortKey) => setFilters((prev) => ({ ...prev, sort }));

  const toggleTechnology = (technology: string) =>
    setFilters((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(technology)
        ? prev.technologies.filter((tech) => tech !== technology)
        : [...prev.technologies, technology],
    }));

  const toggleStatus = (status: ProjectStatus) =>
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((entry) => entry !== status)
        : [...prev.statuses, status],
    }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    filters,
    results,
    availableTechnologies,
    availableStatuses,
    setQuery,
    setSort,
    toggleTechnology,
    toggleStatus,
    resetFilters,
  };
}
