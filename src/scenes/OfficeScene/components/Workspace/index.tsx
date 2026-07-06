import type { ReactNode } from "react";

import styles from "./Workspace.module.css";

interface WorkspaceProps {
  children: ReactNode;
}

const WHITEBOARD_STROKES = [
  { top: "26%", left: "14%", width: "44%" },
  { top: "44%", left: "14%", width: "60%" },
  { top: "62%", left: "14%", width: "32%" },
];

const PLANT_LEAVES = [-26, -12, 0, 12, 26];

function Plant({ className }: { className: string }) {
  return (
    <div className={className}>
      {PLANT_LEAVES.map((angle) => (
        <span
          key={angle}
          className={styles.leaf}
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        />
      ))}
      <span className={styles.pot} />
    </div>
  );
}

export function Workspace({ children }: WorkspaceProps) {
  return (
    <div className={styles.room} aria-hidden="true">
      <div className={styles.floor} />

      <div className={styles.window}>
        <span className={styles.windowBar} />
        <span className={styles.windowBarV} />
      </div>

      <div className={styles.whiteboard}>
        {WHITEBOARD_STROKES.map((stroke) => (
          <span key={stroke.top} className={styles.stroke} style={stroke} />
        ))}
      </div>

      <Plant className={`${styles.plant} ${styles.plantLeft}`} />
      <Plant className={`${styles.plant} ${styles.plantRight}`} />

      <div className={styles.monitor}>
        <span className={styles.monitorScreen} />
        <span className={styles.monitorStand} />
      </div>

      <div className={styles.avatarSlot}>{children}</div>

      <div className={styles.desk}>
        <div className={styles.deskTop} />
        <span className={styles.keyboard} />
      </div>

      <div className={styles.lighting} />
    </div>
  );
}
