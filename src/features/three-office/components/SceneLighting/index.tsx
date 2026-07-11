"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

import { lightingManager } from "../../managers/LightingManager";
import { useLightingMode } from "../../hooks/useLighting";

/**
 * Renders the active LightingManager preset: ambient + hemisphere fill,
 * directional sunlight with shadows, a procedural environment map (built from
 * Lightformers — no HDRI download, fully offline), and once-baked contact
 * shadows to ground the furniture. Only Day is authored today; other modes
 * resolve to their placeholder recipes.
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
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {preset.environment ? (
        // Procedural environment: a soft "sky" panel and a warm window glow,
        // rendered once into a small env map — cheap, offline, PBR-friendly.
        <Environment resolution={64} frames={1} environmentIntensity={preset.environment.intensity}>
          <Lightformer form="rect" position={[0, 4, -6]} scale={[10, 4, 1]} intensity={1.4} color="#dfe9f6" />
          <Lightformer form="rect" position={[3, 2, -4]} scale={[3, 2.4, 1]} intensity={1.1} color="#ffe9c9" />
          <Lightformer form="ring" position={[-4, 3, 2]} scale={3} intensity={0.5} color="#ffffff" />
        </Environment>
      ) : null}

      <ContactShadows
        position={[0, 0.011, 0]}
        opacity={0.32}
        scale={11}
        blur={2.4}
        far={3.2}
        resolution={512}
        frames={1}
      />
    </>
  );
}
