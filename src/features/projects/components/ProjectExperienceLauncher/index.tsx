"use client";

import { useEffect } from "react";

import { BridgeTarget, interactionEvents } from "@/features/three-office";
import { useProjectsStore } from "@/stores/projects.store";

import { ProjectExplorerToggle } from "../ProjectExplorerToggle";
import { ProjectWorkspace } from "../ProjectWorkspace";

/**
 * Single mount point for the Project Experience: the toggle + workspace pair,
 * backed by the shared projects store.
 *
 * The Project Experience owns its open-state locally (unlike Recruiter Mode,
 * which is an app-wide singleton store the office bridge can call directly).
 * So the projects feature subscribes to the shared office-interaction bus here
 * and opens itself when the Projects zone fires — using the very store instance
 * it renders from, which sidesteps any cross-chunk store-identity issues.
 */
export function ProjectExperienceLauncher() {
  const isOpen = useProjectsStore((state) => state.isProjectsOpen);
  const toggleProjects = useProjectsStore((state) => state.toggleProjects);
  const closeProjects = useProjectsStore((state) => state.closeProjects);

  useEffect(() => {
    return interactionEvents.on("interaction-started", ({ bridge }) => {
      if (bridge === BridgeTarget.Projects) useProjectsStore.getState().openProjects();
    });
  }, []);

  return (
    <>
      <ProjectExplorerToggle isOpen={isOpen} onToggle={toggleProjects} />
      <ProjectWorkspace isOpen={isOpen} onClose={closeProjects} />
    </>
  );
}
