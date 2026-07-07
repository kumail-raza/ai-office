"use client";

import type { Project } from "../../../types";

import styles from "./sections.module.css";

export function ResourcesSection({ project }: { project: Project }) {
  return (
    <div>
      <h3 className={styles.heading}>Resources</h3>

      {project.images.length > 0 ? (
        <div className={styles.imageGrid}>
          {project.images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={image.src} src={image.src} alt={image.alt} className={styles.image} />
          ))}
        </div>
      ) : null}

      {project.links.length > 0 ? (
        <ul className={styles.list}>
          {project.links.map((link) => (
            <li key={link.label}>
              <a href={link.url} className={styles.resourceLink}>
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.text}>No external resources linked yet.</p>
      )}
    </div>
  );
}
