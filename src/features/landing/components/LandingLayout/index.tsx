import type { ReactNode } from "react";

import { FullscreenLayout } from "@/components/layout/FullscreenLayout/FullscreenLayout";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  // The landing is a bright "lobby" (Light Executive) that transitions into the
  // Dark Executive office — the rest of the app uses the dark default.
  return (
    <FullscreenLayout as="main" data-theme="light">
      {children}
    </FullscreenLayout>
  );
}
