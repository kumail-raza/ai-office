"use client";

import { SkillCategory, type SkillEntry } from "../../types";

import styles from "./sections.module.css";

const CATEGORY_ORDER = Object.values(SkillCategory);

export function SkillsSection({ skills }: { skills: SkillEntry[] }) {
  return (
    <div>
      <h2 className={styles.heading}>Skills Matrix</h2>
      {CATEGORY_ORDER.map((category) => {
        const entries = skills.filter((skill) => skill.category === category);
        if (entries.length === 0) return null;

        return (
          <div key={category} className={styles.skillCategory}>
            <h3 className={styles.subheading}>{category}</h3>
            <ul className={styles.skillList}>
              {entries.map((skill) => (
                <li key={skill.name} className={styles.skillRow}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <span className={styles.skillMeta}>
                    <span className={styles.level}>{skill.level}</span>
                    <span>{skill.years} yrs</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
