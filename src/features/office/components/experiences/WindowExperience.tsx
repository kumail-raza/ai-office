"use client";

import { useSettingsStore } from "@/stores/settings.store";

import { WINDOW_MODES } from "../../constants/windowModes";

import styles from "./experiences.module.css";

export function WindowExperience() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  return (
    <div>
      <p className={styles.status}>Set the mood of the workspace.</p>
      <div className={styles.modeGrid} role="radiogroup" aria-label="Environment mode">
        {WINDOW_MODES.map((option) => {
          const active = option.mode === themeMode;
          return (
            <button
              key={option.mode}
              type="button"
              role="radio"
              aria-checked={active}
              className={`${styles.mode} ${active ? styles.modeActive : ""}`}
              onClick={() => setThemeMode(option.mode)}
            >
              <span className={styles.modeLabel}>
                <span aria-hidden="true">{option.icon}</span> {option.label}
              </span>
              <span className={styles.modeHint}>{option.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
