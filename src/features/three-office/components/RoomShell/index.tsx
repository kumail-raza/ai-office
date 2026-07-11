"use client";

import { memo } from "react";

import { ROOM } from "../../constants";
import { UNIT_BOX, standardMaterial } from "../meshes/resources";

const floor = standardMaterial(ROOM.floorColor, { roughness: 0.95 });
const wall = standardMaterial(ROOM.wallColor, { roughness: 1 });

/** Static room: floor plus back and side walls. */
export const RoomShell = memo(function RoomShell() {
  const halfW = ROOM.width / 2;
  const halfD = ROOM.depth / 2;
  const halfH = ROOM.height / 2;

  return (
    <group>
      <mesh geometry={UNIT_BOX} material={floor} position={[0, -0.05, 0]} scale={[ROOM.width, 0.1, ROOM.depth]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={wall} position={[0, halfH, -halfD]} scale={[ROOM.width, ROOM.height, 0.1]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={wall} position={[-halfW, halfH, 0]} scale={[0.1, ROOM.height, ROOM.depth]} receiveShadow />
      <mesh geometry={UNIT_BOX} material={wall} position={[halfW, halfH, 0]} scale={[0.1, ROOM.height, ROOM.depth]} receiveShadow />
    </group>
  );
});
