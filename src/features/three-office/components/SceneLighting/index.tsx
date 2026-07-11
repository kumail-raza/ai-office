"use client";

import { lightingManager } from "../../managers/LightingManager";
import { useLightingMode } from "../../hooks/useLighting";

/**
 * Renders the active LightingManager preset. Only Day is authored today; other
 * modes resolve to their placeholder recipes until they get a real pass.
 */
export function SceneLighting() {
  useLightingMode();
  const preset = lightingManager.getPreset();

  return (
    <>
      <color attach="background" args={[preset.background]} />
      {preset.fog ? <fog attach="fog" args={[preset.fog.color, preset.fog.near, preset.fog.far]} /> : null}
      <ambientLight intensity={preset.ambient.intensity} color={preset.ambient.color} />
      <hemisphereLight
        args={[preset.hemisphere.skyColor, preset.hemisphere.groundColor, preset.hemisphere.intensity]}
      />
      <directionalLight
        position={preset.directional.position}
        intensity={preset.directional.intensity}
        color={preset.directional.color}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
    </>
  );
}
