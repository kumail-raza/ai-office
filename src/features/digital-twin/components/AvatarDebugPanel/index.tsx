"use client";

import { useState } from "react";

import { useAvatar } from "../../hooks/useAvatar";
import { avatarManager } from "../../services/AvatarManager";
import { AvatarExpression, AvatarGesture, AvatarState, EyeTarget } from "../../types";

import styles from "./AvatarDebugPanel.module.css";

const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Development-only control panel for the digital-twin runtime. Lets you change
 * state, trigger gestures, change expression, simulate speech, and simulate eye
 * targets. Renders nothing in production builds.
 */
export function AvatarDebugPanel() {
  const { currentState, currentExpression, currentTarget, currentGesture, actions } = useAvatar();
  const [collapsed, setCollapsed] = useState(false);

  if (!IS_DEV) return null;

  const simulateSpeech = () => {
    actions.setState(AvatarState.Speaking);
    window.setTimeout(() => actions.setState(AvatarState.Idle), 2500);
  };

  return (
    <section className={styles.panel} aria-label="Digital twin debug panel">
      <div className={styles.header}>
        <h2 className={styles.title}>Digital Twin</h2>
        <button
          type="button"
          className={styles.collapse}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {collapsed ? null : (
        <>
          <dl className={styles.readout}>
            <dt className={styles.readoutKey}>State</dt>
            <dd className={styles.readoutValue}>{currentState}</dd>
            <dt className={styles.readoutKey}>Expression</dt>
            <dd className={styles.readoutValue}>{currentExpression}</dd>
            <dt className={styles.readoutKey}>Eye target</dt>
            <dd className={styles.readoutValue}>{currentTarget}</dd>
            <dt className={styles.readoutKey}>Gesture</dt>
            <dd className={styles.readoutValue}>{currentGesture}</dd>
          </dl>

          <div className={styles.group}>
            <p className={styles.groupLabel}>State</p>
            <div className={styles.buttons}>
              {Object.values(AvatarState).map((state) => (
                <button
                  key={state}
                  type="button"
                  className={`${styles.chip} ${state === currentState ? styles.chipActive : ""}`}
                  onClick={() => actions.setState(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <p className={styles.groupLabel}>Expression</p>
            <div className={styles.buttons}>
              {Object.values(AvatarExpression).map((expression) => (
                <button
                  key={expression}
                  type="button"
                  className={`${styles.chip} ${expression === currentExpression ? styles.chipActive : ""}`}
                  onClick={() => actions.setExpression(expression)}
                >
                  {expression}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <p className={styles.groupLabel}>Gesture</p>
            <div className={styles.buttons}>
              {Object.values(AvatarGesture).map((gesture) => (
                <button
                  key={gesture}
                  type="button"
                  className={`${styles.chip} ${gesture === currentGesture ? styles.chipActive : ""}`}
                  onClick={() => actions.playGesture(gesture)}
                >
                  {gesture}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <p className={styles.groupLabel}>Eye target</p>
            <div className={styles.buttons}>
              {Object.values(EyeTarget).map((target) => (
                <button
                  key={target}
                  type="button"
                  className={`${styles.chip} ${target === currentTarget ? styles.chipActive : ""}`}
                  onClick={() => {
                    actions.lookAt(target);
                    avatarManager.head.lookAt(target);
                  }}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <p className={styles.groupLabel}>Simulate</p>
            <div className={styles.buttons}>
              <button type="button" className={styles.chip} onClick={simulateSpeech}>
                speech (2.5s)
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
