"use client";

import { useState } from "react";

import { ProjectExplorerToggle } from "../ProjectExplorerToggle";
import { ProjectWorkspace } from "../ProjectWorkspace";

/** Single mount point for the Project Experience: owns open/close state for the toggle + workspace pair. */
export function ProjectExperienceLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ProjectExplorerToggle isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />
      <ProjectWorkspace isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
