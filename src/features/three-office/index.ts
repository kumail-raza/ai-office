export { ThreeOfficeLauncher } from "./components/ThreeOfficeLauncher";
// Interaction bridge + zones are three.js-free (view-layer pub/sub), so they are
// safe to re-export here alongside the eager launcher.
export {
  OfficeInteractionBridge,
  interactionAnalytics,
  interactionEvents,
  InteractionZoneId,
  BridgeTarget,
} from "./interaction";
export { CameraController } from "./managers/CameraController";
export { lightingManager } from "./managers/LightingManager";
export { useWebGLSupport } from "./hooks/useWebGLSupport";
export { useLightingMode } from "./hooks/useLighting";
export { AssetRegistry } from "./assets";
export { CAMERA_ZONES } from "./constants/cameraZones";
export * from "./types";
// NOTE: modules that import three at module scope — loaders (assetPreloader,
// gltfAssetLoader), the materials library, and the environment manager — are
// deliberately NOT re-exported here. This barrel is reached eagerly via
// ThreeOfficeLauncher, so anything added here risks pulling the 3D stack into
// the initial bundle. Import those from their leaf paths inside the lazy scene.
