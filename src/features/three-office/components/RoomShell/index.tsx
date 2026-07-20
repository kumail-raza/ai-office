"use client";

import { memo } from "react";

import { ROOM } from "../../constants";
import { MaterialKind, material } from "../../materials";
import { UNIT_BOX } from "../meshes/resources";

/**
 * The architectural shell: floor with an inlay border, walls with skirting and
 * a picture rail, and a ceiling with a recessed cove. The trim lines give the
 * room scale and stop it reading as an empty box.
 */
export const RoomShell = memo(function RoomShell() {
  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;
  const { height } = ROOM;

  return (
    <group>
      {/* Floor + a darker inlay border for a finished, architectural edge. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.FloorInlay)} position={[0, -0.05, 0]} scale={[ROOM.width, 0.1, ROOM.depth]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Floor)} position={[0, -0.04, 0]} scale={[ROOM.width - 0.7, 0.1, ROOM.depth - 0.7]} receiveShadow />

      {/* Walls */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wall)} position={[0, height / 2, -halfD]} scale={[ROOM.width, height, 0.1]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wall)} position={[-halfW, height / 2, 0]} scale={[0.1, height, ROOM.depth]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Wall)} position={[halfW, height / 2, 0]} scale={[0.1, height, ROOM.depth]} receiveShadow />

      {/* Skirting board along the three walls. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[0, 0.06, -halfD + 0.06]} scale={[ROOM.width, 0.12, 0.03]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[-halfW + 0.06, 0.06, 0]} scale={[0.03, 0.12, ROOM.depth]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[halfW - 0.06, 0.06, 0]} scale={[0.03, 0.12, ROOM.depth]} />

      {/* Picture rail near the ceiling — a horizontal line that adds scale. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[0, height - 0.35, -halfD + 0.06]} scale={[ROOM.width, 0.04, 0.025]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[-halfW + 0.06, height - 0.35, 0]} scale={[0.025, 0.04, ROOM.depth]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.WallTrim)} position={[halfW - 0.06, height - 0.35, 0]} scale={[0.025, 0.04, ROOM.depth]} />

      {/* Ceiling + a recessed cove panel that reads as soft indirect light. */}
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Ceiling)} position={[0, height, 0]} scale={[ROOM.width, 0.1, ROOM.depth]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.LampGlow)} position={[0, height - 0.09, -0.6]} scale={[3.2, 0.02, 1.5]} />
      <mesh geometry={UNIT_BOX} material={material(MaterialKind.Ceiling)} position={[0, height - 0.07, -0.6]} scale={[3.5, 0.06, 1.8]} />
    </group>
  );
});
