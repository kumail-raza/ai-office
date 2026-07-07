"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useRecruiterStore } from "@/stores/recruiter.store";

import { DASHBOARD_SECTIONS } from "../../constants/dashboardSections";
import { useRecruiterContent } from "../../hooks/useRecruiterContent";
import { recruiterAnalytics } from "../../services/RecruiterAnalytics";
import { RecruiterSection } from "../../types";
import {
  AvailabilitySection,
  CertificationsSection,
  ContactSection,
  ExperienceSection,
  OverviewSection,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "../sections";

import styles from "./RecruiterDashboard.module.css";

function renderSection(section: RecruiterSection, content: NonNullable<ReturnType<typeof useRecruiterContent>["content"]>) {
  switch (section) {
    case RecruiterSection.Overview:
      return <OverviewSection summary={content.summary} />;
    case RecruiterSection.Summary:
      return <SummarySection summary={content.summary} />;
    case RecruiterSection.Experience:
      return <ExperienceSection experience={content.experience} />;
    case RecruiterSection.Skills:
      return <SkillsSection skills={content.skills} />;
    case RecruiterSection.Certifications:
      return <CertificationsSection certifications={content.certifications} />;
    case RecruiterSection.Projects:
      return <ProjectsSection projects={content.projects} />;
    case RecruiterSection.Availability:
      return <AvailabilitySection availability={content.availability} />;
    case RecruiterSection.Contact:
      return <ContactSection />;
  }
}

export function RecruiterDashboard() {
  const isRecruiterMode = useRecruiterStore((state) => state.isRecruiterMode);
  const exitRecruiterMode = useRecruiterStore((state) => state.exitRecruiterMode);
  const { content, loading, error } = useRecruiterContent();
  const [activeSection, setActiveSection] = useState<RecruiterSection>(RecruiterSection.Overview);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRecruiterMode) return;
    dashboardRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") exitRecruiterMode();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRecruiterMode, exitRecruiterMode]);

  useEffect(() => {
    if (isRecruiterMode) recruiterAnalytics.trackSectionViewed(activeSection);
  }, [isRecruiterMode, activeSection]);

  return (
    <AnimatePresence>
      {isRecruiterMode ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={dashboardRef}
            className={styles.dashboard}
            role="dialog"
            aria-modal="true"
            aria-label="Recruiter dashboard"
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <button
              type="button"
              className={styles.close}
              aria-label="Exit Recruiter Mode"
              onClick={exitRecruiterMode}
            >
              ✕
            </button>

            <nav className={styles.sidebar} aria-label="Dashboard sections">
              <span className={styles.brand}>Recruiter Dashboard</span>
              {DASHBOARD_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`${styles.navItem} ${activeSection === section.id ? styles.navItemActive : ""}`}
                  aria-current={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span aria-hidden="true">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>

            <nav className={styles.mobileNav} aria-label="Dashboard sections">
              {DASHBOARD_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`${styles.mobileNavItem} ${activeSection === section.id ? styles.mobileNavItemActive : ""}`}
                  aria-current={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            <div className={styles.content}>
              {error ? <p>The recruiter dashboard is unavailable right now.</p> : null}
              {loading && !error ? <p>Loading…</p> : null}
              {content ? renderSection(activeSection, content) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
