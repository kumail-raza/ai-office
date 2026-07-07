"use client";

import type { RecruiterProject } from "../../types";

import styles from "./sections.module.css";

export function ProjectsSection({ projects }: { projects: RecruiterProject[] }) {
  return (
    <div>
      <h2 className={styles.heading}>Projects</h2>
      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.card}>
            <p className={styles.cardTitle}>{project.title}</p>
            <p className={styles.cardMeta}>{project.role}</p>
            <p className={styles.cardText}>{project.description}</p>
            <p className={styles.cardText}>
              <strong>Impact:</strong> {project.businessImpact}
            </p>
            <div className={styles.tags}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.tag}>
                  {tech}
                </span>
              ))}
            </div>
            {project.links.length > 0 ? (
              <div className={styles.tags}>
                {project.links.map((link) => (
                  <a key={link.label} href={link.url} className={styles.tag}>
                    {link.label} ↗
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
