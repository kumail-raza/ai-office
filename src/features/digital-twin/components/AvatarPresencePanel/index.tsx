"use client";

import { useState } from "react";

import { useAvatar } from "../../hooks/useAvatar";
import { AvatarView } from "../AvatarView";
import { EYE_TARGET_LABEL, STATE_VISUAL } from "../AvatarView/avatarView.constants";

import styles from "./AvatarPresencePanel.module.css";

/**
 * The visible Digital Twin. Subscribes to the runtime via useAvatar and renders
 * a live portrait plus a readout of the current state / expression / gesture /
 * focus target. Purely a consumer of the runtime snapshot — driving happens
 * through the AvatarManager (presence bridge, conversation bridge, debug panel).
 */
export function AvatarPresencePanel() {
  const { currentState, currentExpression, currentTarget, currentGesture } = useAvatar();
  const [collapsed, setCollapsed] = useState(false);

  const visual = STATE_VISUAL[currentState];

  return (
    <section className={styles.panel} aria-label="Digital twin presence">
      <header className={styles.header}>
        <span className={styles.dot} style={{ background: visual.accent }} aria-hidden="true" />
        <h2 className={styles.title}>Digital Twin</h2>
        <button
          type="button"
          className={styles.collapse}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </header>

      {collapsed ? null : (
        <>
          <div className={styles.portrait}>
            <AvatarView
              state={currentState}
              expression={currentExpression}
              gesture={currentGesture}
              eyeTarget={currentTarget}
              size={128}
            />
          </div>

          <dl className={styles.readout} aria-live="polite">
            <div className={styles.row}>
              <dt className={styles.key}>State</dt>
              <dd className={styles.value} style={{ color: visual.accent }}>
                {visual.label}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.key}>Expression</dt>
              <dd className={styles.value}>{currentExpression}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.key}>Gesture</dt>
              <dd className={styles.value}>{currentGesture}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.key}>Focus</dt>
              <dd className={styles.value}>{EYE_TARGET_LABEL[currentTarget]}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
