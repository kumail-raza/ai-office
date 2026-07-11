"use client";

import { memo, useMemo, useSyncExternalStore } from "react";

import { ASSET_BY_MESH_KIND } from "../assets";
import { assetPreloader } from "../loaders/AssetPreloader";
import { AssetStatus, type OfficeMeshKind } from "../types";
import { MESH_BY_KIND } from "../components/meshes";

export interface OfficeModelProps {
  kind: OfficeMeshKind;
}

/**
 * Renders the real .glb model for a mesh kind when the preloader has it, and
 * the placeholder geometry otherwise — a missing or broken asset can never
 * crash the scene. Each instance clones the template so repeated props (two
 * plants) don't share a mutable scene graph.
 */
export const OfficeModel = memo(function OfficeModel({ kind }: OfficeModelProps) {
  const assetId = ASSET_BY_MESH_KIND[kind];

  const status = useSyncExternalStore(
    (onStoreChange) => assetPreloader.subscribe(onStoreChange),
    () => (assetId ? assetPreloader.getStatus(assetId) : AssetStatus.Unavailable),
    () => AssetStatus.Unavailable,
  );

  const scene = useMemo(() => {
    if (!assetId || status !== AssetStatus.Ready) return null;
    return assetPreloader.getScene(assetId)?.clone(true) ?? null;
  }, [assetId, status]);

  if (scene) return <primitive object={scene} />;

  const Placeholder = MESH_BY_KIND[kind];
  return <Placeholder />;
});
