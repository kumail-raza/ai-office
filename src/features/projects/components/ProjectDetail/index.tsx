"use client";

import { useEffect, useState } from "react";

import { useConversation } from "@/features/conversation";

import { projectAnalytics } from "../../services/ProjectAnalytics";
import { type Project, ProjectDetailSection } from "../../types";
import { ProjectDeepDiveActions } from "./ProjectDeepDiveActions";
import { ProjectNavigationBar } from "./ProjectNavigationBar";
import {
  ArchitectureSection,
  ChallengesSection,
  ImpactSection,
  LessonsSection,
  OverviewSection,
  ResourcesSection,
  RoleSection,
  SolutionsSection,
  StackSection,
} from "./sections";

import styles from "./ProjectDetail.module.css";

const TABS: Array<{ id: ProjectDetailSection; label: string }> = [
  { id: ProjectDetailSection.Overview, label: "Overview" },
  { id: ProjectDetailSection.Role, label: "My Role" },
  { id: ProjectDetailSection.Architecture, label: "Architecture" },
  { id: ProjectDetailSection.Challenges, label: "Challenges" },
  { id: ProjectDetailSection.Solutions, label: "Solutions" },
  { id: ProjectDetailSection.Impact, label: "Business Impact" },
  { id: ProjectDetailSection.Lessons, label: "Lessons Learned" },
  { id: ProjectDetailSection.Stack, label: "Technology Stack" },
  { id: ProjectDetailSection.Resources, label: "Resources" },
];

function renderSection(section: ProjectDetailSection, project: Project) {
  switch (section) {
    case ProjectDetailSection.Overview:
      return <OverviewSection project={project} />;
    case ProjectDetailSection.Role:
      return <RoleSection project={project} />;
    case ProjectDetailSection.Architecture:
      return <ArchitectureSection project={project} />;
    case ProjectDetailSection.Challenges:
      return <ChallengesSection project={project} />;
    case ProjectDetailSection.Solutions:
      return <SolutionsSection project={project} />;
    case ProjectDetailSection.Impact:
      return <ImpactSection project={project} />;
    case ProjectDetailSection.Lessons:
      return <LessonsSection project={project} />;
    case ProjectDetailSection.Stack:
      return <StackSection project={project} />;
    case ProjectDetailSection.Resources:
      return <ResourcesSection project={project} />;
  }
}

interface ProjectDetailProps {
  project: Project;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onBackToOffice: () => void;
}

export function ProjectDetail({
  project,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onBackToOffice,
}: ProjectDetailProps) {
  const [activeSection, setActiveSection] = useState<ProjectDetailSection>(
    ProjectDetailSection.Overview,
  );
  const { setProjectContext } = useConversation();

  // The AI knows the active project for as long as its detail view is open.
  useEffect(() => {
    projectAnalytics.trackProjectViewed(project.slug);
    setProjectContext({ slug: project.slug, title: project.title, summary: project.summary });

    return () => {
      projectAnalytics.flushTimeSpent();
    };
  }, [project, setProjectContext]);

  useEffect(() => {
    setActiveSection(ProjectDetailSection.Overview);
  }, [project.id]);

  const handleSelectSection = (section: ProjectDetailSection) => {
    setActiveSection(section);
    projectAnalytics.trackSectionOpened(project.slug, section);
  };

  return (
    <div className={styles.detail}>
      <p className={styles.summary}>{project.summary}</p>

      <div className={styles.layout}>
        <nav className={styles.tabs} aria-label="Project sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeSection === tab.id ? styles.tabActive : ""}`}
              aria-current={activeSection === tab.id}
              onClick={() => handleSelectSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.content}>{renderSection(activeSection, project)}</div>
      </div>

      <ProjectDeepDiveActions project={project} />

      <ProjectNavigationBar
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPrevious={onPrevious}
        onNext={onNext}
        onBackToOffice={onBackToOffice}
      />
    </div>
  );
}
