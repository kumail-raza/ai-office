"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// Direct leaf import (not the @/features/avatar barrel) so this eagerly-loaded
// launcher never pulls the three.js avatar graph into the initial bundle.
import { AvatarPresenceDebugPanel } from "@/features/avatar/components/AvatarPresenceDebugPanel";
import { useOfficeInteraction } from "@/features/office";

import { useWebGLSupport } from "../../hooks/useWebGLSupport";
import { SceneErrorBoundary } from "../SceneErrorBoundary";

import styles from "./ThreeOfficeLauncher.module.css";

/**
 * Lazy entry for the whole three.js stack — nothing 3D lands in the initial
 * bundle; the chunk loads the first time the visitor opens the 3D view.
 */
const ThreeOfficeScene = dynamic(() => import("../ThreeOfficeScene"), {
  ssr: false,
  loading: () => <p className={styles.loading}>Preparing the 3D office…</p>,
});

/**
 * Parallel entry point for the 3D office. The 2D office stays the default —
 * this only offers a toggle when WebGL is available; without WebGL (or if the
 * scene throws) nothing changes and the 2D experience carries on untouched.
 */
export function ThreeOfficeLauncher() {
  const webgl = useWebGLSupport();
  const { isPanelOpen } = useOfficeInteraction();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Escape exits the 3D view only when no experience panel is open — when one
  // is, Escape belongs to the panel (which closes itself).
  const panelOpenRef = useRef(isPanelOpen);
  panelOpenRef.current = isPanelOpen;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !panelOpenRef.current) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Fallback mode: no WebGL (or still detecting) → no button, 2D office only.
  if (webgl !== true) return null;

  return (
    <>
      {open ? (
        <div className={styles.overlay} role="region" aria-label="3D office view">
          <div className={styles.canvasHost}>
            <SceneErrorBoundary
              fallback={
                <p className={styles.error}>
                  The 3D office couldn&apos;t start on this device — the classic office is still
                  right behind this panel.
                </p>
              }
            >
              <ThreeOfficeScene />
            </SceneErrorBoundary>
          </div>
          {/* Dev-only presence controls (tree-shaken from production builds). */}
          <AvatarPresenceDebugPanel />
        </div>
      ) : null}

      <button
        type="button"
        className={styles.toggle}
        aria-pressed={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Exit 3D" : "Enter 3D"}
        <span className={styles.badge}>beta</span>
      </button>
    </>
  );
}
