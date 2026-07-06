"use client";

import type { CSSProperties } from "react";

import { useAssetProgress } from "@/hooks/useAssetProgress";

import styles from "./AssetLoadingProgress.module.css";

const BOOT_STAGES = [
  { at: 0, label: "Initializing environment..." },
  { at: 25, label: "Loading assets..." },
  { at: 60, label: "Preparing office..." },
  { at: 90, label: "Almost ready..." },
  { at: 100, label: "Ready." },
];

function getStageLabel(percent: number): string {
  let label = BOOT_STAGES[0].label;

  for (const stage of BOOT_STAGES) {
    if (percent >= stage.at) label = stage.label;
  }

  return label;
}

export function AssetLoadingProgress() {
  const { loaded, total } = useAssetProgress();
  const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
  const stageLabel = getStageLabel(percent);

  return (
    <div role="status" aria-live="polite" className={styles.root}>
      <div aria-hidden="true" className={styles.glow} />

      <img src="/assets/images/ui/logo.svg" alt="" className={styles.logo} />

      <p className={styles.stage}>{stageLabel}</p>

      <div className={styles.track}>
        <div className={styles.fill} style={{ "--progress": `${percent}%` } as CSSProperties} />
      </div>

      <p className={styles.percent}>{percent}%</p>
    </div>
  );
}
