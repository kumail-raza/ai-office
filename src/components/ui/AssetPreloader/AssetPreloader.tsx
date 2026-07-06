"use client";

import { Suspense, useEffect, type ReactNode } from "react";

import { assetManager } from "@/engine/managers/AssetManager";
import { SECONDARY_IMAGES } from "@/engine/managers/assetManifest";

import { AssetLoadingProgress } from "@/components/ui/AssetLoadingProgress/AssetLoadingProgress";

interface AssetPreloaderProps {
  children: ReactNode;
}

function CriticalAssetsGate({ children }: AssetPreloaderProps) {
  assetManager.getCriticalResource().read();

  useEffect(() => {
    assetManager.preloadSecondary(SECONDARY_IMAGES);
  }, []);

  return <>{children}</>;
}

export function AssetPreloader({ children }: AssetPreloaderProps) {
  return (
    <Suspense fallback={<AssetLoadingProgress />}>
      <CriticalAssetsGate>{children}</CriticalAssetsGate>
    </Suspense>
  );
}
