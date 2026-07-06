import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import styles from "./FullscreenLayout.module.css";

type FullscreenLayoutProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function FullscreenLayout<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: FullscreenLayoutProps<T>) {
  const Component = as ?? "div";
  const combinedClassName = className ? `${styles.root} ${className}` : styles.root;

  return (
    <Component className={combinedClassName} {...rest}>
      {children}
    </Component>
  );
}
