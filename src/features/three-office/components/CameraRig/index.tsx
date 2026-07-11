"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

import { CAMERA_CONFIG, CAMERA_ZONES, DEFAULT_CAMERA_POSE } from "../../constants";
import { CameraController } from "../../managers/CameraController";
import { type CameraView, CameraZone } from "../../types";

export interface CameraRigProps {
  /** Where the camera should be: a named zone or an ad-hoc object focus. */
  view: CameraView;
}

/**
 * Bridges the framework-agnostic CameraController into the R3F frame loop.
 * Named zones glide to their predefined pose (Entry resumes the idle drift);
 * focus views frame an arbitrary world position.
 */
export function CameraRig({ view }: CameraRigProps) {
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

    if (view.kind === "focus") {
      controller.focusObject(view.position, {
        distance: CAMERA_CONFIG.focusDistance,
        lift: CAMERA_CONFIG.focusLift,
      });
      return;
    }

    if (view.zone === CameraZone.Entry) {
      controller.reset();
      return;
    }

    const pose = CAMERA_ZONES[view.zone];
    controller.moveTo(pose.position, pose.target);
  }, [view]);

  useFrame((_, deltaSec) => {
    controllerRef.current?.update(deltaSec * 1000, camera as PerspectiveCamera);
  });

  return null;
}
