import {
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  MeshStandardMaterial,
  SphereGeometry,
} from "three";

/**
 * Shared, memoized geometries + materials for the procedural avatar. Kept
 * inside the avatar feature (rather than reaching into three-office) so the
 * feature stays self-contained; the figure costs a handful of GPU buffers.
 */

export const HEAD_GEOMETRY = new SphereGeometry(0.5, 24, 20);
export const CAPSULE_GEOMETRY = new CapsuleGeometry(0.5, 1, 6, 16);
export const CYLINDER_GEOMETRY = new CylinderGeometry(0.5, 0.5, 1, 16);
export const BOX_GEOMETRY = new BoxGeometry(1, 1, 1);

const materialCache = new Map<string, MeshStandardMaterial>();

export function avatarMaterial(
  color: string,
  options: { roughness?: number; metalness?: number; emissive?: string; emissiveIntensity?: number } = {},
): MeshStandardMaterial {
  const key = `${color}|${options.roughness ?? 0.8}|${options.metalness ?? 0.05}|${options.emissive ?? ""}|${options.emissiveIntensity ?? 0}`;
  let material = materialCache.get(key);
  if (!material) {
    material = new MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.8,
      metalness: options.metalness ?? 0.05,
      ...(options.emissive
        ? { emissive: options.emissive, emissiveIntensity: options.emissiveIntensity ?? 1 }
        : {}),
    });
    materialCache.set(key, material);
  }
  return material;
}

/** Node names the animator looks up on the rig. */
export const RIG_NODE = {
  root: "AvatarRoot",
  head: "Head",
  armRight: "ArmRight",
} as const;
