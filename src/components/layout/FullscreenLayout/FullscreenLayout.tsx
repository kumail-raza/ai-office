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
  // Typed as "div" only for the JSX spread below: with @react-three/fiber's
  // global JSX augmentation in the program, TS collapses the props of the
  // generic `T | "div"` tag union to `never`. Runtime behaviour is unchanged
  // and the public generic API stays fully typed.
  const Component = (as ?? "div") as "div";
  const combinedClassName = className ? `${styles.root} ${className}` : styles.root;

  return (
    <Component className={combinedClassName} {...(rest as ComponentPropsWithoutRef<"div">)}>
      {children}
    </Component>
  );
}
