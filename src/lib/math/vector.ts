export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export const ZERO_VECTOR: Vector3 = { x: 0, y: 0, z: 0 };
export const FORWARD_VECTOR: Vector3 = { x: 0, y: 0, z: 1 };

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function lerpVector(from: Vector3, to: Vector3, t: number): Vector3 {
  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t), z: lerp(from.z, to.z, t) };
}

export function vectorEquals(a: Vector3, b: Vector3, epsilon = 1e-4): boolean {
  return (
    Math.abs(a.x - b.x) < epsilon &&
    Math.abs(a.y - b.y) < epsilon &&
    Math.abs(a.z - b.z) < epsilon
  );
}
