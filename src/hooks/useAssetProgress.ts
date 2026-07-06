import { useSyncExternalStore } from "react";

import { assetManager } from "@/engine/managers/AssetManager";

export function useAssetProgress() {
  return useSyncExternalStore(
    (onStoreChange) => assetManager.subscribe(() => onStoreChange()),
    () => assetManager.getProgress(),
    () => ({ loaded: 0, total: 0 }),
  );
}
