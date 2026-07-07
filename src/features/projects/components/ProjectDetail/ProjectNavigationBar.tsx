"use client";

import { useRecruiterStore } from "@/stores/recruiter.store";

import styles from "./ProjectDetail.module.css";

interface ProjectNavigationBarProps {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onBackToOffice: () => void;
}

export function ProjectNavigationBar({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onBackToOffice,
}: ProjectNavigationBarProps) {
  const enterRecruiterMode = useRecruiterStore((state) => state.enterRecruiterMode);

  return (
    <div className={styles.navBar} role="navigation" aria-label="Project navigation">
      <button type="button" className={styles.navButton} disabled={!hasPrevious} onClick={onPrevious}>
        ← Previous Project
      </button>
      <button type="button" className={styles.navButton} disabled={!hasNext} onClick={onNext}>
        Next Project →
      </button>
      <button type="button" className={styles.navButton} onClick={onBackToOffice}>
        Back to Office
      </button>
      <button
        type="button"
        className={styles.navButton}
        onClick={() => {
          onBackToOffice();
          enterRecruiterMode();
        }}
      >
        Back to Recruiter Mode
      </button>
    </div>
  );
}
