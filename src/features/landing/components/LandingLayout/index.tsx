import type { ReactNode } from "react";

import styles from "./LandingLayout.module.css";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return <main className={styles.root}>{children}</main>;
}
