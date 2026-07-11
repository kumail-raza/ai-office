import { BoxGeometry, CylinderGeometry, MeshStandardMaterial, SphereGeometry } from "three";

/**
 * Shared unit geometries — every placeholder mesh scales one of these, so the
 * whole room costs a handful of GPU buffers regardless of object count.
 */
export const UNIT_BOX = new BoxGeometry(1, 1, 1);
export const UNIT_CYLINDER = new CylinderGeometry(0.5, 0.5, 1, 20);
export const UNIT_SPHERE = new SphereGeometry(0.5, 20, 16);

const materialCache = new Map<string, MeshStandardMaterial>();

/** Memoized material per recipe — reused across meshes and rerenders. */
export function standardMaterial(
  color: string,
  options: { roughness?: number; metalness?: number; emissive?: string; emissiveIntensity?: number } = {},
): MeshStandardMaterial {
  const key = `${color}|${options.roughness ?? 0.85}|${options.metalness ?? 0.05}|${options.emissive ?? ""}|${options.emissiveIntensity ?? 0}`;
  let material = materialCache.get(key);
  if (!material) {
    material = new MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.85,
      metalness: options.metalness ?? 0.05,
      ...(options.emissive
        ? { emissive: options.emissive, emissiveIntensity: options.emissiveIntensity ?? 1 }
        : {}),
    });
    materialCache.set(key, material);
  }
  return material;
}
