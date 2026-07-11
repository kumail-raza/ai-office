"use client";

import { useSyncExternalStore } from "react";

import { AvatarExpression } from "@/features/digital-twin";

// Import from the leaf modules (not the feature/presence/face barrels) so this
// dev panel stays free of three.js — it is rendered by the eagerly-loaded
// ThreeOfficeLauncher, and must not pull the 3D stack into the initial bundle.
import type { Gaze } from "../../face/FaceRig";
import { presenceDebug } from "../../presence/presenceDebug";

import styles from "./AvatarPresenceDebugPanel.module.css";

const IS_DEV = process.env.NODE_ENV !== "production";

const EXPRESSIONS = Object.values(AvatarExpression);

const GAZE_PRESETS: { label: string; value: Gaze }[] = [
  { label: "left", value: { x: -0.8, y: 0 } },
  { label: "right", value: { x: 0.8, y: 0 } },
  { label: "up", value: { x: 0, y: 0.8 } },
  { label: "down", value: { x: 0, y: -0.8 } },
  { label: "center", value: { x: 0, y: 0 } },
];

function sameGaze(a: Gaze | null, b: Gaze): boolean {
  return a !== null && a.x === b.x && a.y === b.y;
}

/**
 * Dev-only panel for the avatar presence system. Writes overrides into the
 * shared `presenceDebug` channel that the in-canvas PresenceSystem reads each
 * frame: pin an expression, force eye gaze, force head direction, fire a manual
 * blink. Renders nothing in production. State changes use the Digital Twin
 * debug panel (this drives the presence layer specifically).
 */
export function AvatarPresenceDebugPanel() {
  // Re-render when overrides change so the active chips stay in sync.
  useSyncExternalStore(
    (cb) => presenceDebug.subscribe(cb),
    () => presenceDebug.expressionOverride,
    () => null,
  );

  if (!IS_DEV) return null;

  return (
    <section className={styles.panel} aria-label="Avatar presence debug panel">
      <div className={styles.header}>
        <h2 className={styles.title}>Presence</h2>
        <button type="button" className={styles.reset} onClick={() => presenceDebug.reset()}>
          Auto
        </button>
      </div>

      <div className={styles.group}>
        <p className={styles.groupLabel}>Expression</p>
        <div className={styles.buttons}>
          {EXPRESSIONS.map((expression) => (
            <button
              key={expression}
              type="button"
              className={`${styles.chip} ${
                presenceDebug.expressionOverride === expression ? styles.chipActive : ""
              }`}
              onClick={() => presenceDebug.setExpression(expression)}
            >
              {expression}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.groupLabel}>Eye gaze</p>
        <div className={styles.buttons}>
          {GAZE_PRESETS.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              className={`${styles.chip} ${sameGaze(presenceDebug.gazeOverride, value) ? styles.chipActive : ""}`}
              onClick={() => presenceDebug.setGaze(value)}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.chip} ${presenceDebug.gazeOverride === null ? styles.chipActive : ""}`}
            onClick={() => presenceDebug.setGaze(null)}
          >
            auto
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.groupLabel}>Head</p>
        <div className={styles.buttons}>
          {GAZE_PRESETS.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              className={`${styles.chip} ${sameGaze(presenceDebug.headOverride, value) ? styles.chipActive : ""}`}
              onClick={() => presenceDebug.setHead(value)}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.chip} ${presenceDebug.headOverride === null ? styles.chipActive : ""}`}
            onClick={() => presenceDebug.setHead(null)}
          >
            auto
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.groupLabel}>Blink</p>
        <div className={styles.buttons}>
          <button type="button" className={styles.chip} onClick={() => presenceDebug.requestBlink()}>
            blink now
          </button>
        </div>
      </div>
    </section>
  );
}
