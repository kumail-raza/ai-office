import type { ReactNode } from "react";

import { FullscreenLayout } from "@/components/layout/FullscreenLayout/FullscreenLayout";

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return <FullscreenLayout as="main">{children}</FullscreenLayout>;
}
