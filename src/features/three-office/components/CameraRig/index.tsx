"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

import { CAMERA_CONFIG, DEFAULT_CAMERA_POSE } from "../../constants";
import { CameraController } from "../../managers/CameraController";
import type { ScenePosition } from "../../types";

export interface CameraRigProps {
  /** World position to frame, or null to rest at the overview pose. */
  focusPosition: ScenePosition | null;
}

/**
 * Bridges the framework-agnostic CameraController into the R3F frame loop.
 * When an object is selected the camera glides in to frame it; on deselect it
 * returns to the idle overview drift.
 */
export function CameraRig({ focusPosition }: CameraRigProps) {
  const camera = useThree((state) => state.camera);

  const controllerRef = useRef<CameraController | null>(null);
  if (controllerRef.current === null) {
    controllerRef.current = new CameraController(DEFAULT_CAMERA_POSE, {
      positionSmoothing: CAMERA_CONFIG.positionSmoothing,
      targetSmoothing: CAMERA_CONFIG.targetSmoothing,
      idleAmplitude: CAMERA_CONFIG.idleAmplitude,
      idleSpeed: CAMERA_CONFIG.idleSpeed,
    });
  }

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;
    if (focusPosition) {
      controller.focusObject(focusPosition, {
        distance: CAMERA_CONFIG.focusDistance,
        lift: CAMERA_CONFIG.focusLift,
      });
    } else {
      controller.reset();
    }
  }, [focusPosition]);

  useFrame((_, deltaSec) => {
    controllerRef.current?.update(deltaSec * 1000, camera as PerspectiveCamera);
  });

  return null;
}
