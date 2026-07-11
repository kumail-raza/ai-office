"use client";

import { memo } from "react";

import { OfficeMeshKind } from "../../types";
import { UNIT_BOX, UNIT_CYLINDER, UNIT_SPHERE, standardMaterial } from "./resources";

/**
 * Placeholder office meshes — simple scaled primitives, no external assets.
 * Each is memoized and built from the shared unit geometries so the scene
 * renders with minimal draw state and zero per-frame allocation.
 */

const wood = standardMaterial("#a97e52");
const woodDark = standardMaterial("#7d5a38");
const fabric = standardMaterial("#3e5c76");
const metal = standardMaterial("#8d99ae", { roughness: 0.4, metalness: 0.6 });
const screen = standardMaterial("#101828", {
  roughness: 0.3,
  emissive: "#3b82f6",
  emissiveIntensity: 0.55,
});
const paper = standardMaterial("#f8f4ec");
const frameGold = standardMaterial("#c9a227", { roughness: 0.35, metalness: 0.5 });
const leaf = standardMaterial("#4f7942");
const terracotta = standardMaterial("#b5653f");
const ceramic = standardMaterial("#e7e2d8", { roughness: 0.5 });
const glassSky = standardMaterial("#bcd7f0", {
  roughness: 0.15,
  emissive: "#9fc8ef",
  emissiveIntensity: 0.7,
});

export const DeskMesh = memo(function DeskMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={wood} position={[0, 0.98, 0]} scale={[2.4, 0.08, 1.1]} castShadow receiveShadow />
      <mesh geometry={UNIT_BOX} material={woodDark} position={[-1.1, 0.48, 0]} scale={[0.08, 0.96, 1]} castShadow />
      <mesh geometry={UNIT_BOX} material={woodDark} position={[1.1, 0.48, 0]} scale={[0.08, 0.96, 1]} castShadow />
    </group>
  );
});

export const MonitorMesh = memo(function MonitorMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={metal} position={[0, 0.05, 0]} scale={[0.36, 0.05, 0.36]} castShadow />
      <mesh geometry={UNIT_BOX} material={metal} position={[0, 0.16, 0]} scale={[0.06, 0.24, 0.06]} castShadow />
      <mesh geometry={UNIT_BOX} material={standardMaterial("#1f2733")} position={[0, 0.44, 0]} scale={[0.94, 0.56, 0.05]} castShadow />
      <mesh geometry={UNIT_BOX} material={screen} position={[0, 0.44, 0.028]} scale={[0.86, 0.48, 0.01]} />
    </group>
  );
});

export const ChairMesh = memo(function ChairMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={metal} position={[0, 0.06, 0]} scale={[0.56, 0.06, 0.56]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={metal} position={[0, 0.3, 0]} scale={[0.08, 0.48, 0.08]} castShadow />
      <mesh geometry={UNIT_BOX} material={fabric} position={[0, 0.58, 0]} scale={[0.52, 0.09, 0.5]} castShadow />
      <mesh geometry={UNIT_BOX} material={fabric} position={[0, 0.95, -0.22]} scale={[0.5, 0.68, 0.09]} castShadow />
    </group>
  );
});

export const PlantMesh = memo(function PlantMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={terracotta} position={[0, 0.16, 0]} scale={[0.34, 0.32, 0.34]} castShadow />
      <mesh geometry={UNIT_SPHERE} material={leaf} position={[0, 0.55, 0]} scale={[0.44, 0.5, 0.44]} castShadow />
      <mesh geometry={UNIT_SPHERE} material={leaf} position={[0.16, 0.74, 0.04]} scale={[0.3, 0.36, 0.3]} castShadow />
      <mesh geometry={UNIT_SPHERE} material={leaf} position={[-0.15, 0.7, -0.05]} scale={[0.26, 0.3, 0.26]} castShadow />
    </group>
  );
});

export const CertificateMesh = memo(function CertificateMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={frameGold} scale={[0.62, 0.46, 0.035]} castShadow />
      <mesh geometry={UNIT_BOX} material={paper} position={[0, 0, 0.012]} scale={[0.52, 0.36, 0.02]} />
    </group>
  );
});

export const BookshelfMesh = memo(function BookshelfMesh() {
  const bookColors = ["#7d5ba6", "#c2563e", "#3e6b8f", "#5f7f4f", "#b98a3f"];
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={woodDark} position={[0, 0.9, 0]} scale={[1.1, 1.8, 0.34]} castShadow />
      {[0.45, 0.95, 1.45].map((y) => (
        <group key={y}>
          <mesh geometry={UNIT_BOX} material={wood} position={[0, y - 0.16, 0]} scale={[1, 0.05, 0.3]} />
          {bookColors.map((color, i) => (
            <mesh
              key={color}
              geometry={UNIT_BOX}
              material={standardMaterial(color)}
              position={[-0.36 + i * 0.18, y + 0.02, 0]}
              scale={[0.11, 0.3 + (i % 3) * 0.035, 0.22]}
            />
          ))}
        </group>
      ))}
    </group>
  );
});

export const WindowMesh = memo(function WindowMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={ceramic} scale={[1.5, 1.9, 0.08]} castShadow />
      <mesh geometry={UNIT_BOX} material={glassSky} position={[0, 0, 0.025]} scale={[1.3, 1.7, 0.02]} />
      <mesh geometry={UNIT_BOX} material={ceramic} position={[0, 0, 0.045]} scale={[0.05, 1.7, 0.02]} />
      <mesh geometry={UNIT_BOX} material={ceramic} position={[0, 0, 0.045]} scale={[1.3, 0.05, 0.02]} />
    </group>
  );
});

export const CoffeeMesh = memo(function CoffeeMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={ceramic} position={[0, 0.06, 0]} scale={[0.11, 0.13, 0.11]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={standardMaterial("#5a3a24")} position={[0, 0.115, 0]} scale={[0.09, 0.015, 0.09]} />
      <mesh geometry={UNIT_BOX} material={ceramic} position={[0.075, 0.06, 0]} scale={[0.035, 0.08, 0.03]} />
    </group>
  );
});

/** Kind → component, so scene nodes stay data-driven. */
export const MESH_BY_KIND = {
  [OfficeMeshKind.Desk]: DeskMesh,
  [OfficeMeshKind.Monitor]: MonitorMesh,
  [OfficeMeshKind.Chair]: ChairMesh,
  [OfficeMeshKind.Plant]: PlantMesh,
  [OfficeMeshKind.Certificate]: CertificateMesh,
  [OfficeMeshKind.Bookshelf]: BookshelfMesh,
  [OfficeMeshKind.Window]: WindowMesh,
  [OfficeMeshKind.Coffee]: CoffeeMesh,
} as const;
