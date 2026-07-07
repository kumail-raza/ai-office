"use client";

import { OfficeObjectRegistry } from "../../services/OfficeObjectRegistry";
import { InteractiveObject } from "../InteractiveObject";

import styles from "./OfficeObjectLayer.module.css";

export function OfficeObjectLayer() {
  return (
    <div className={styles.layer} role="group" aria-label="Interactive office objects">
      {OfficeObjectRegistry.getAll().map((object) => (
        <InteractiveObject key={object.id} object={object} />
      ))}
    </div>
  );
}
