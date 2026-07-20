import { BoxGeometry, CylinderGeometry, SphereGeometry, TorusGeometry } from "three";

/**
 * Shared unit geometries — every mesh scales one of these, so the whole room
 * costs a handful of GPU buffers regardless of prop count.
 *
 * Materials live in `../../materials` (MaterialKind presets); nothing here
 * constructs a material.
 */
export const UNIT_BOX = new BoxGeometry(1, 1, 1);
export const UNIT_CYLINDER = new CylinderGeometry(0.5, 0.5, 1, 20);
export const UNIT_SPHERE = new SphereGeometry(0.5, 20, 16);
/** Tapered cylinder for lamp shades / pots. */
export const UNIT_TAPER = new CylinderGeometry(0.36, 0.5, 1, 20);
/** Thin ring for trophy handles and accents. */
export const UNIT_TORUS = new TorusGeometry(0.5, 0.12, 10, 24);
