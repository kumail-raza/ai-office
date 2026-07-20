"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

import { useAtmosphere } from "../../hooks/useOfficeEnvironment";
import { officeEnvironmentManager } from "../../managers/OfficeEnvironmentManager";
import { useLightingMode } from "../../hooks/useLighting";

/**
 * A four-part luxury lighting rig:
 *   key   — warm directional "sun" through the window, soft-shadowed
 *   fill  — cool, shadowless bounce from the opposite wall so nothing goes black
 *   ambient + hemisphere — a gentle floor of light
 *   practicals — warm point lights at the desk lamp and ceiling cove
 * plus a procedural environment map (offline) and baked contact shadows.
 * Nothing is harsh: low contrast, wide shadow radius, warm/cool balance.
 */
export function SceneLighting() {
  useLightingMode();
  const atmosphere = useAtmosphere();
  const preset = officeEnvironmentManager.getLightingPreset();

  return (
    <>
      <color attach="background" args={[preset.background]} />
      {preset.fog ? <fog attach="fog" args={[preset.fog.color, preset.fog.near, preset.fog.far]} /> : null}

      <ambientLight intensity={preset.ambient.intensity} color={preset.ambient.color} />
      <hemisphereLight
        args={[preset.hemisphere.skyColor, preset.hemisphere.groundColor, preset.hemisphere.intensity]}
      />

      {/* Key light — the sun. The only shadow caster, deliberately soft. */}
      <directionalLight
        position={preset.directional.position}
        intensity={preset.directional.intensity}
        color={preset.directional.color}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-radius={preset.shadow.radius}
        shadow-bias={preset.shadow.bias}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />

      {/* Fill — cool bounce, no shadows, keeps the shadow side readable. */}
      <directionalLight
        position={preset.fill.position}
        intensity={preset.fill.intensity}
        color={preset.fill.color}
      />

      {/* Practicals: the desk lamp pool and the ceiling cove wash. */}
      {atmosphere.practicals ? (
        <>
          <pointLight position={[1.1, 1.45, -0.7]} intensity={2.2} distance={3.4} decay={2} color="#f4d6a0" />
          <pointLight position={[0, 2.75, -0.6]} intensity={1.4} distance={6} decay={2} color="#f0e2cb" />
        </>
      ) : null}

      {preset.environment ? (
        <Environment resolution={64} frames={1} environmentIntensity={preset.environment.intensity}>
          {/* Window-side sky panel (key bounce). */}
          <Lightformer form="rect" position={[3, 2.2, -5]} scale={[6, 4, 1]} intensity={1.5} color="#dfeaf7" />
          {/* Warm interior bounce off the walnut. */}
          <Lightformer form="rect" position={[-3, 1.6, 1]} scale={[5, 3, 1]} intensity={0.8} color="#f3e0c4" />
          <Lightformer form="ring" position={[0, 4, 1]} scale={4} intensity={0.5} color="#ffffff" />
        </Environment>
      ) : null}

      <ContactShadows
        position={[0, 0.014, 0]}
        opacity={preset.shadow.opacity}
        scale={12}
        blur={3}
        far={3.6}
        resolution={512}
        frames={1}
        color="#2a1f16"
      />
    </>
  );
}
