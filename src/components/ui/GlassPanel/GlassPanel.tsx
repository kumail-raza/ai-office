import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./GlassPanel.module.css";

type GlassPanelProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function GlassPanel<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: GlassPanelProps<T>) {
  const Component = as ?? "div";
  const combinedClassName = className ? `${styles.glass} ${className}` : styles.glass;

  return (
    <Component className={combinedClassName} {...rest}>
      {children}
    </Component>
  );
}
