"use client";

import { memo } from "react";

import { MaterialKind, bookMaterial, material } from "../../materials";
import { OfficeMeshKind } from "../../types";
import { UNIT_BOX, UNIT_CYLINDER, UNIT_SPHERE, UNIT_TAPER, UNIT_TORUS } from "./resources";

/**
 * The office props. Simple primitives, but composed deliberately — an executive
 * desk with a real silhouette, a shelf that tells a story, a gallery wall.
 * Every surface pulls a preset from the materials library; each mesh is
 * memoized and shares the unit geometries.
 */

/* ---------------------------------------------------------------- desk ---- */

export const DeskMesh = memo(function DeskMesh() {
  return (
    <group>
      {/* Top with a slight overhang + a darker edge band for thickness. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wood)} position={[0, 1, 0]} scale={[2.5, 0.07, 1.15]} castShadow receiveShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 0.955, 0]} scale={[2.46, 0.03, 1.12]} />

      {/* Two solid pedestals with drawer reveals and brass pulls. */}
      {[-0.92, 0.92].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 0.47, -0.02]} scale={[0.6, 0.94, 1.02]} castShadow receiveShadow />
          {[0.72, 0.47, 0.22].map((y) => (
            <group key={y}>
              <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wood)} position={[0, y, 0.5]} scale={[0.54, 0.2, 0.02]} />
              <mesh geometry={UNIT_BOX} material={material(MaterialKind.Brass)} position={[0, y, 0.53]} scale={[0.16, 0.02, 0.02]} />
            </group>
          ))}
        </group>
      ))}

      {/* Modesty panel between the pedestals. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 0.62, -0.5]} scale={[1.3, 0.5, 0.04]} castShadow />
    </group>
  );
});

export const MonitorMesh = memo(function MonitorMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.MetalDark)} position={[0, 0.02, 0]} scale={[0.42, 0.03, 0.28]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Metal)} position={[0, 0.17, 0]} scale={[0.05, 0.3, 0.05]} castShadow />
      {/* Slim bezel + inset screen with a soft glow. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.MonitorBezel)} position={[0, 0.5, 0]} scale={[1.08, 0.62, 0.04]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Monitor)} position={[0, 0.505, 0.024]} scale={[1.02, 0.56, 0.01]} />
    </group>
  );
});

export const ChairMesh = memo(function ChairMesh() {
  return (
    <group>
      {/* Five-star base with castors. */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh geometry={UNIT_BOX} material={material(MaterialKind.MetalDark)} position={[0, 0.06, 0.2]} scale={[0.07, 0.04, 0.44]} castShadow />
            <mesh geometry={UNIT_SPHERE} material={material(MaterialKind.MetalDark)} position={[0, 0.035, 0.4]} scale={0.07} />
          </group>
        );
      })}
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Metal)} position={[0, 0.28, 0]} scale={[0.07, 0.42, 0.07]} castShadow />

      {/* Contoured leather seat, tall back, headrest and armrests. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Leather)} position={[0, 0.52, 0]} scale={[0.56, 0.11, 0.54]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Leather)} position={[0, 0.92, -0.24]} scale={[0.54, 0.72, 0.1]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Leather)} position={[0, 1.32, -0.22]} scale={[0.34, 0.16, 0.11]} castShadow />
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} geometry={UNIT_BOX} material={material(MaterialKind.MetalDark)} position={[x, 0.7, -0.02]} scale={[0.05, 0.26, 0.34]} castShadow />
      ))}
    </group>
  );
});

/* --------------------------------------------------------- accessories ---- */

export const NotebookMesh = memo(function NotebookMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Leather)} position={[0, 0.012, 0]} scale={[0.3, 0.024, 0.4]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Paper)} position={[0, 0.026, 0]} scale={[0.28, 0.008, 0.38]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Brass)} position={[0.08, 0.032, 0]} scale={[0.02, 0.004, 0.4]} />
    </group>
  );
});

export const PenCupMesh = memo(function PenCupMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Brass)} position={[0, 0.055, 0]} scale={[0.09, 0.11, 0.09]} castShadow />
      {[
        [0.015, 0.02],
        [-0.018, -0.01],
        [0.005, -0.022],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          geometry={UNIT_CYLINDER}
          material={material(i === 1 ? MaterialKind.MetalDark : MaterialKind.WoodDark)}
          position={[x, 0.135, z]}
          rotation={[i * 0.06, 0, i * 0.05 - 0.05]}
          scale={[0.012, 0.16, 0.012]}
        />
      ))}
    </group>
  );
});

export const DeskLampMesh = memo(function DeskLampMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.MetalDark)} position={[0, 0.015, 0]} scale={[0.17, 0.03, 0.17]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Brass)} position={[0, 0.2, 0]} scale={[0.022, 0.4, 0.022]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Brass)} position={[0.09, 0.39, 0]} rotation={[0, 0, Math.PI / 2.4]} scale={[0.02, 0.24, 0.02]} castShadow />
      <mesh geometry={UNIT_TAPER} material={material(MaterialKind.Brass)} position={[0.19, 0.34, 0]} rotation={[Math.PI, 0, 0.35]} scale={[0.15, 0.14, 0.15]} castShadow />
      {/* The glowing underside of the shade. */}
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.LampGlow)} position={[0.185, 0.27, 0]} scale={[0.1, 0.012, 0.1]} />
    </group>
  );
});

export const CoffeeMesh = memo(function CoffeeMesh() {
  return (
    <group>
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Ceramic)} position={[0, 0.06, 0]} scale={[0.11, 0.13, 0.11]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.WoodDark)} position={[0, 0.115, 0]} scale={[0.09, 0.015, 0.09]} />
      <mesh geometry={UNIT_TORUS} material={material(MaterialKind.Ceramic)} position={[0.085, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.07, 0.07, 0.07]} />
    </group>
  );
});

/* ----------------------------------------------------------- bookshelf ---- */

export const BookshelfMesh = memo(function BookshelfMesh() {
  const shelves = [0.42, 0.94, 1.46, 1.98];
  return (
    <group>
      {/* Carcass: back panel + side gables + top. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 1.15, -0.16]} scale={[1.24, 2.3, 0.04]} receiveShadow />
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[x, 1.15, 0]} scale={[0.05, 2.3, 0.34]} castShadow />
      ))}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wood)} position={[0, 2.31, 0]} scale={[1.28, 0.06, 0.38]} castShadow />

      {shelves.map((y, shelfIndex) => (
        <group key={y}>
          <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wood)} position={[0, y, 0]} scale={[1.16, 0.04, 0.32]} castShadow receiveShadow />

          {/* A run of books — varied heights, one leaning for realism. */}
          {shelfIndex !== 2 &&
            Array.from({ length: 7 }).map((_, i) => {
              const lean = shelfIndex === 1 && i === 6;
              const h = 0.28 + ((i + shelfIndex) % 3) * 0.045;
              return (
                <mesh
                  key={i}
                  geometry={UNIT_BOX}
                  material={bookMaterial(i + shelfIndex)}
                  position={[-0.48 + i * 0.115 + (lean ? 0.03 : 0), y + 0.02 + h / 2, 0]}
                  rotation={[0, 0, lean ? 0.22 : 0]}
                  scale={[0.085, h, 0.24]}
                  castShadow
                />
              );
            })}

          {/* The middle shelf is the "personal" one: trophy, photo, plant. */}
          {shelfIndex === 2 ? (
            <group>
              <group position={[-0.38, y + 0.02, 0]} scale={0.72}>
                <TrophyMesh />
              </group>
              <group position={[0.02, y + 0.14, 0]} scale={0.66}>
                <FramedPhotoMesh />
              </group>
              <group position={[0.42, y + 0.02, 0]} scale={0.42}>
                <PlantMesh />
              </group>
            </group>
          ) : null}
        </group>
      ))}
    </group>
  );
});

/** A low credenza that fills the wall beside the shelf (depth + layering). */
export const SideboardMesh = memo(function SideboardMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 0.4, 0]} scale={[1.6, 0.8, 0.44]} castShadow receiveShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wood)} position={[0, 0.82, 0]} scale={[1.68, 0.05, 0.5]} castShadow />
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} geometry={UNIT_BOX} material={material(MaterialKind.Brass)} position={[x, 0.42, 0.23]} scale={[0.22, 0.02, 0.02]} />
      ))}
    </group>
  );
});

export const TrophyMesh = memo(function TrophyMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 0.03, 0]} scale={[0.16, 0.06, 0.16]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Brass)} position={[0, 0.1, 0]} scale={[0.03, 0.1, 0.03]} />
      <mesh geometry={UNIT_TAPER} material={material(MaterialKind.Brass)} position={[0, 0.19, 0]} scale={[0.11, 0.13, 0.11]} castShadow />
      {[-0.075, 0.075].map((x) => (
        <mesh key={x} geometry={UNIT_TORUS} material={material(MaterialKind.Brass)} position={[x, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.06, 0.06, 0.05]} />
      ))}
    </group>
  );
});

export const FramedPhotoMesh = memo(function FramedPhotoMesh() {
  return (
    <group rotation={[0, 0.18, 0]}>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} scale={[0.24, 0.3, 0.02]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Paper)} position={[0, 0, 0.012]} scale={[0.19, 0.25, 0.01]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, -0.14, -0.07]} rotation={[0.5, 0, 0]} scale={[0.03, 0.14, 0.01]} />
    </group>
  );
});

/* -------------------------------------------------------------- awards ---- */

export const CertificateMesh = memo(function CertificateMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Brass)} scale={[0.66, 0.5, 0.03]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Paper)} position={[0, 0, 0.018]} scale={[0.56, 0.4, 0.01]} />
      {/* Suggested text lines + a seal, so it reads as a certificate. */}
      {[0.1, 0.04, -0.02].map((y, i) => (
        <mesh key={y} geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[0, y, 0.025]} scale={[0.34 - i * 0.06, 0.012, 0.005]} />
      ))}
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.Brass)} position={[0, -0.12, 0.026]} rotation={[Math.PI / 2, 0, 0]} scale={[0.06, 0.006, 0.06]} />
    </group>
  );
});

/** A smaller wall plaque used to build the gallery around the certificate. */
export const AwardPlaqueMesh = memo(function AwardPlaqueMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} scale={[0.4, 0.32, 0.03]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Brass)} position={[0, 0, 0.018]} scale={[0.32, 0.24, 0.01]} />
      {[0.05, 0.0, -0.05].map((y, i) => (
        <mesh key={y} geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, y, 0.025]} scale={[0.2 - i * 0.04, 0.01, 0.004]} />
      ))}
    </group>
  );
});

/* -------------------------------------------------------------- window ---- */

export const WindowMesh = memo(function WindowMesh() {
  return (
    <group>
      {/* Outer casing, glass, and a proper mullion grid. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} scale={[1.72, 2.1, 0.09]} castShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.GlassSky)} position={[0, 0, 0.03]} scale={[1.5, 1.88, 0.02]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[0, 0, 0.05]} scale={[0.05, 1.88, 0.03]} />
      {[0.6, -0.6].map((y) => (
        <mesh key={y} geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[0, y, 0.05]} scale={[1.5, 0.045, 0.03]} />
      ))}
      {/* Sill. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[0, -1.08, 0.09]} scale={[1.84, 0.07, 0.22]} castShadow />
    </group>
  );
});

/**
 * What's outside. A far sky plane plus two silhouette layers reading as a city
 * skyline — the default backdrop. Sky/Landscape variants swap the layers.
 */
export const WindowBackdropMesh = memo(function WindowBackdropMesh() {
  const far = [-1.5, -0.85, -0.2, 0.45, 1.15];
  const near = [-1.15, -0.4, 0.35, 1.05];
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.SkyFar)} scale={[7, 5, 0.02]} />
      {far.map((x, i) => (
        <mesh
          key={`f${x}`}
          geometry={UNIT_BOX}
          material={material(MaterialKind.CityFar)}
          position={[x, -1.5 + (0.7 + (i % 3) * 0.42), 0.25]}
          scale={[0.5, 1.4 + (i % 3) * 0.85, 0.06]}
        />
      ))}
      {near.map((x, i) => (
        <mesh
          key={`n${x}`}
          geometry={UNIT_BOX}
          material={material(MaterialKind.CityNear)}
          position={[x, -1.6 + (0.55 + (i % 2) * 0.3), 0.5]}
          scale={[0.42, 1.1 + (i % 2) * 0.6, 0.06]}
        />
      ))}
    </group>
  );
});

/* --------------------------------------------------------------- decor ---- */

export const PlantMesh = memo(function PlantMesh() {
  return (
    <group>
      <mesh geometry={UNIT_TAPER} material={material(MaterialKind.Terracotta)} position={[0, 0.17, 0]} scale={[0.36, 0.34, 0.36]} castShadow />
      <mesh geometry={UNIT_CYLINDER} material={material(MaterialKind.WoodDark)} position={[0, 0.34, 0]} scale={[0.3, 0.03, 0.3]} />
      <mesh geometry={UNIT_SPHERE} material={material(MaterialKind.Leaf)} position={[0, 0.6, 0]} scale={[0.46, 0.5, 0.46]} castShadow />
      <mesh geometry={UNIT_SPHERE} material={material(MaterialKind.LeafDark)} position={[0.17, 0.78, 0.05]} scale={[0.3, 0.34, 0.3]} castShadow />
      <mesh geometry={UNIT_SPHERE} material={material(MaterialKind.Leaf)} position={[-0.16, 0.74, -0.06]} scale={[0.27, 0.3, 0.27]} castShadow />
    </group>
  );
});

/** A large soft rug that anchors the foreground and warms the floor. */
export const RugMesh = memo(function RugMesh() {
  return (
    <group>
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Rug)} position={[0, 0.006, 0]} scale={[4.6, 0.012, 3]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WoodDark)} position={[0, 0.008, 0]} scale={[4.3, 0.014, 2.72]} receiveShadow />
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
  [OfficeMeshKind.Notebook]: NotebookMesh,
  [OfficeMeshKind.PenCup]: PenCupMesh,
  [OfficeMeshKind.DeskLamp]: DeskLampMesh,
  [OfficeMeshKind.Rug]: RugMesh,
  [OfficeMeshKind.Trophy]: TrophyMesh,
  [OfficeMeshKind.FramedPhoto]: FramedPhotoMesh,
  [OfficeMeshKind.AwardPlaque]: AwardPlaqueMesh,
  [OfficeMeshKind.Sideboard]: SideboardMesh,
  [OfficeMeshKind.WindowBackdrop]: WindowBackdropMesh,
} as const;
