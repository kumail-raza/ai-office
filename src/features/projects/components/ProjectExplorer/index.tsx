"use client";

import { useProjectExplorer } from "../../hooks/useProjectExplorer";
import type { Project, ProjectSortKey } from "../../types";
import { ProjectCard } from "./ProjectCard";

import styles from "./ProjectExplorer.module.css";

const SORT_OPTIONS: Array<{ value: ProjectSortKey; label: string }> = [
  { value: "recent", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
];

const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  maintained: "Maintained",
  archived: "Archived",
};

interface ProjectExplorerProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

export function ProjectExplorer({ projects, onSelect }: ProjectExplorerProps) {
  const {
    filters,
    results,
    availableTechnologies,
    availableStatuses,
    setQuery,
    setSort,
    toggleTechnology,
    toggleStatus,
  } = useProjectExplorer(projects);

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <input
            type="text"
            className={styles.search}
            placeholder="Search projects…"
            aria-label="Search projects"
            value={filters.query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className={styles.sort}
            aria-label="Sort projects"
            value={filters.sort}
            onChange={(event) => setSort(event.target.value as ProjectSortKey)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {availableStatuses.length > 1 ? (
          <div className={styles.filterRow} role="group" aria-label="Filter by status">
            {availableStatuses.map((status) => (
              <button
                key={status}
                type="button"
                className={`${styles.chip} ${filters.statuses.includes(status) ? styles.chipActive : ""}`}
                onClick={() => toggleStatus(status)}
              >
                {STATUS_LABEL[status]}
              </button>
            ))}
          </div>
        ) : null}

        {availableTechnologies.length > 0 ? (
          <div className={styles.filterRow} role="group" aria-label="Filter by technology">
            {availableTechnologies.map((tech) => (
              <button
                key={tech}
                type="button"
                className={`${styles.chip} ${filters.technologies.includes(tech) ? styles.chipActive : ""}`}
                onClick={() => toggleTechnology(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <p className={styles.status}>
        {results.length} project{results.length === 1 ? "" : "s"}
      </p>

      <div className={styles.grid}>
        {results.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={() => onSelect(project)} />
        ))}
      </div>
    </div>
  );
}
