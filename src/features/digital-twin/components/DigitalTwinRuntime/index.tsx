"use client";

import { useEffect } from "react";

import { useAnimationFrame } from "@/hooks/useAnimationFrame";

import { avatarManager } from "../../services/AvatarManager";
import { connectPresenceToAvatar } from "../../services/PresenceBridge";
import { digitalTwinAnalytics } from "../../services/DigitalTwinAnalytics";
import { AvatarDebugPanel } from "../AvatarDebugPanel";

/**
 * Mount point for the digital-twin runtime: bridges voice presence to avatar
 * state, wires session analytics, and advances controller interpolation each
 * frame. Renders only the dev-only debug panel (nothing in production).
 */
export function DigitalTwinRuntime() {
  useEffect(() => {
    const disconnectPresence = connectPresenceToAvatar();
    const disconnectAnalytics = digitalTwinAnalytics.connect();
    return () => {
      disconnectPresence();
      disconnectAnalytics();
    };
  }, []);

  useAnimationFrame(({ deltaTime }) => {
    avatarManager.update(deltaTime);
  });

  return <AvatarDebugPanel />;
}
