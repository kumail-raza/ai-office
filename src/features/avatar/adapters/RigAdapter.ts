import type { Object3D } from "three";
import type { Mesh } from "three";

import { type AvatarRig, type LoadedAvatar, type RigMetadata, RigType } from "../types";

/**
 * Skeleton naming per rig convention. Detection walks the scene graph once and
 * matches against these signatures; bone lookup then uses the vendor's own
 * names first, falling back to the generic union. Adding a vendor (or a real
 * MetaHuman export, once one is validated) is a table entry, not code.
 */
interface RigConvention {
  /** A node whose name matches identifies the convention. */
  signature: (name: string) => boolean;
  headNames: string[];
  armRightNames: string[];
}

const CONVENTIONS: Record<Exclude<RigType, RigType.GenericGltf | RigType.Procedural>, RigConvention> = {
  [RigType.ReadyPlayerMe]: {
    signature: (name) => name.startsWith("Wolf3D_"),
    headNames: ["Head", "Wolf3D_Head"],
    armRightNames: ["RightArm", "RightUpperArm"],
  },
  [RigType.Mixamo]: {
    signature: (name) => name.startsWith("mixamorig"),
    headNames: ["mixamorigHead"],
    armRightNames: ["mixamorigRightArm"],
  },
  /* Reserved: Unreal/MetaHuman skeletal naming. Untested against a real
   * export — treat as a seam, not a supported pipeline. */
  [RigType.MetaHuman]: {
    signature: (name) => name === "FACIAL_C_FacialRoot" || name.startsWith("spine_0"),
    headNames: ["head"],
    armRightNames: ["upperarm_r"],
  },
};

/** Union fallback for rigs no convention claimed. */
const GENERIC_HEAD_NAMES = ["Head", "head", "mixamorigHead", "Wolf3D_Head"];
const GENERIC_ARM_RIGHT_NAMES = ["ArmRight", "RightArm", "mixamorigRightArm", "RightUpperArm", "upperarm_r"];

function findNode(root: Object3D, names: string[]): Object3D | null {
  for (const name of names) {
    const node = root.getObjectByName(name);
    if (node) return node;
  }
  return null;
}

function detectType(root: Object3D): RigType {
  let detected: RigType = RigType.GenericGltf;
  root.traverse((node) => {
    if (detected !== RigType.GenericGltf) return;
    for (const [type, convention] of Object.entries(CONVENTIONS)) {
      if (convention.signature(node.name)) {
        detected = type as RigType;
        return;
      }
    }
  });
  return detected;
}

function detectBlendShapes(root: Object3D): boolean {
  let found = false;
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) found = true;
  });
  return found;
}

/** A normalized rig plus everything the adapter learned about the model. */
export interface AdaptedRig {
  rig: AvatarRig;
  metadata: RigMetadata;
}

/**
 * Normalizes any loaded GLB/GLTF into the office's AvatarRig: detects the rig
 * convention by skeleton naming (Ready Player Me / Mixamo / generic, with a
 * reserved MetaHuman seam), resolves the head and right-arm nodes through the
 * vendor's naming first, and reports what it found as RigMetadata. The one
 * place vendor knowledge lives — no lock-in anywhere else.
 */
export const RigAdapter = {
  adapt(loaded: LoadedAvatar): AdaptedRig {
    const { scene, animations } = loaded;
    const type = detectType(scene);
    const convention = type in CONVENTIONS ? CONVENTIONS[type as keyof typeof CONVENTIONS] : null;

    const head =
      (convention ? findNode(scene, convention.headNames) : null) ??
      findNode(scene, GENERIC_HEAD_NAMES);
    const armRight =
      (convention ? findNode(scene, convention.armRightNames) : null) ??
      findNode(scene, GENERIC_ARM_RIGHT_NAMES);

    return {
      rig: { root: scene, head, armRight },
      metadata: {
        type,
        hasHead: head !== null,
        hasArmRight: armRight !== null,
        hasBlendShapes: detectBlendShapes(scene),
        clipNames: animations.map((clip) => clip.name),
      },
    };
  },

  /** Metadata for the procedural figure (which always has a full "rig"). */
  proceduralMetadata(): RigMetadata {
    return {
      type: RigType.Procedural,
      hasHead: true,
      hasArmRight: true,
      hasBlendShapes: true,
      clipNames: [],
    };
  },
};
