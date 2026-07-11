export { ThreeOfficeLauncher } from "./components/ThreeOfficeLauncher";
export { CameraController } from "./managers/CameraController";
export { lightingManager } from "./managers/LightingManager";
export { useWebGLSupport } from "./hooks/useWebGLSupport";
export { useLightingMode } from "./hooks/useLighting";
export { AssetRegistry } from "./assets";
export { CAMERA_ZONES } from "./constants/cameraZones";
export * from "./types";
// NOTE: loaders (assetPreloader, gltfAssetLoader) are intentionally not
// re-exported here — import them via "@/features/three-office/loaders" with a
// dynamic import so three.js never lands in the initial bundle.
