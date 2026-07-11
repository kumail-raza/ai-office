import { type AssetDefinition, OfficeAssetId, OfficeMeshKind } from "../types";

/** All model files live under this public path. */
const ASSET_BASE_PATH = "/models/office";

/** Definition per asset — the only place in the codebase that knows a path. */
const OFFICE_ASSETS: Record<OfficeAssetId, AssetDefinition> = {
  [OfficeAssetId.Desk]: { id: OfficeAssetId.Desk, url: `${ASSET_BASE_PATH}/desk.glb` },
  [OfficeAssetId.Chair]: { id: OfficeAssetId.Chair, url: `${ASSET_BASE_PATH}/chair.glb` },
  [OfficeAssetId.Monitor]: { id: OfficeAssetId.Monitor, url: `${ASSET_BASE_PATH}/monitor.glb` },
  [OfficeAssetId.Bookshelf]: { id: OfficeAssetId.Bookshelf, url: `${ASSET_BASE_PATH}/bookshelf.glb` },
  [OfficeAssetId.Plant]: { id: OfficeAssetId.Plant, url: `${ASSET_BASE_PATH}/plant.glb` },
  [OfficeAssetId.Certificate]: { id: OfficeAssetId.Certificate, url: `${ASSET_BASE_PATH}/certificate.glb` },
  [OfficeAssetId.Window]: { id: OfficeAssetId.Window, url: `${ASSET_BASE_PATH}/window.glb` },
};

/**
 * Which .glb files actually ship in /public today. Empty for now — every mesh
 * renders its placeholder. Drop a file into public/models/office and add its
 * id here to activate the real model; nothing else changes.
 */
const SHIPPED_ASSETS: ReadonlySet<OfficeAssetId> = new Set<OfficeAssetId>([]);

/** Which asset (if any) replaces each placeholder mesh kind. */
export const ASSET_BY_MESH_KIND: Partial<Record<OfficeMeshKind, OfficeAssetId>> = {
  [OfficeMeshKind.Desk]: OfficeAssetId.Desk,
  [OfficeMeshKind.Chair]: OfficeAssetId.Chair,
  [OfficeMeshKind.Monitor]: OfficeAssetId.Monitor,
  [OfficeMeshKind.Bookshelf]: OfficeAssetId.Bookshelf,
  [OfficeMeshKind.Plant]: OfficeAssetId.Plant,
  [OfficeMeshKind.Certificate]: OfficeAssetId.Certificate,
  [OfficeMeshKind.Window]: OfficeAssetId.Window,
  // Coffee has no model planned yet — always the placeholder.
};

/**
 * Central asset registry. Components never hardcode paths; they ask the
 * registry (usually indirectly, via the preloader) by asset id.
 */
export const AssetRegistry = {
  getAll(): AssetDefinition[] {
    return Object.values(OFFICE_ASSETS);
  },

  getById(id: OfficeAssetId): AssetDefinition {
    return OFFICE_ASSETS[id];
  },

  getUrl(id: OfficeAssetId): string {
    return OFFICE_ASSETS[id].url;
  },

  /** Whether the file is expected to exist in /public right now. */
  isShipped(id: OfficeAssetId): boolean {
    return SHIPPED_ASSETS.has(id);
  },

  getShipped(): AssetDefinition[] {
    return Object.values(OFFICE_ASSETS).filter((asset) => SHIPPED_ASSETS.has(asset.id));
  },
};
