"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useConversation } from "@/features/conversation";

import { useProjects } from "../../hooks/useProjects";
import { projectAnalytics } from "../../services/ProjectAnalytics";
import type { Project } from "../../types";
import { ProjectDetail } from "../ProjectDetail";
import { ProjectExplorer } from "../ProjectExplorer";

import styles from "./ProjectWorkspace.module.css";

interface ProjectWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectWorkspace({ isOpen, onClose }: ProjectWorkspaceProps) {
  const { projects, loading, error } = useProjects();
  const { setProjectContext } = useConversation();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    shellRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setActiveProject(null);
      setProjectContext(null);
      projectAnalytics.flushTimeSpent();
    }
  }, [isOpen, setProjectContext]);

  const handleClose = () => {
    setActiveProject(null);
    setProjectContext(null);
    onClose();
  };

  const activeIndex = activeProject ? projects.findIndex((p) => p.id === activeProject.id) : -1;
  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < projects.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) setActiveProject(projects[activeIndex - 1]);
  };
  const goToNext = () => {
    if (hasNext) setActiveProject(projects[activeIndex + 1]);
  };

  const title = activeProject ? activeProject.title : "Project Explorer";

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className={styles.backdrop}
            aria-hidden="true"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={shellRef}
            className={styles.shell}
            role="dialog"
            aria-modal="true"
            aria-label="Project deep dive"
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <header className={styles.header}>
              <span className={styles.headerIcon} aria-hidden="true">
                🗂️
              </span>
              <h2 className={styles.title}>{title}</h2>
              <button type="button" className={styles.close} aria-label="Close" onClick={handleClose}>
                ✕
              </button>
            </header>

            <div className={styles.body}>
              {error ? <p>Projects are unavailable right now.</p> : null}
              {loading && !error ? <p>Loading projects…</p> : null}

              {!loading && !error && activeProject ? (
                <ProjectDetail
                  project={activeProject}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  onPrevious={goToPrevious}
                  onNext={goToNext}
                  onBackToOffice={handleClose}
                />
              ) : null}

              {!loading && !error && !activeProject ? (
                <ProjectExplorer projects={projects} onSelect={setActiveProject} />
              ) : null}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
