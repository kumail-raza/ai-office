"use client";

import { AnimatePresence, motion } from "framer-motion";

import {
  Background,
  DoorArrow,
  LandingLayout,
  ProfileCard,
  SmartDoor,
  VisitorPanel,
} from "@/features/landing/components";
import { DOOR_CONFIG } from "@/features/landing/config";
import { useDoorInteraction } from "@/features/landing/hooks";

import styles from "./styles/LandingScene.module.css";

export function LandingScene() {
  const {
    doorPhase,
    visitorName,
    continueButtonRef,
    doorRef,
    arrowPath,
    handleContinue,
    handleArrowArrive,
    handleUnlockComplete,
    handleDoorClick,
    handleDoorOpenComplete,
  } = useDoorInteraction();

  const panelVisible = doorPhase === "idle";

  return (
    <LandingLayout>
      <Background />

      <div className={styles.stage}>
        <ProfileCard />

        <SmartDoor
          doorRef={doorRef}
          phase={doorPhase}
          visitorName={visitorName}
          onOpenClick={handleDoorClick}
          onUnlockComplete={handleUnlockComplete}
          onOpenComplete={handleDoorOpenComplete}
        />

        <motion.div
          className={styles.panelSlot}
          animate={{ opacity: panelVisible ? 1 : 0 }}
          transition={{
            duration: DOOR_CONFIG.panelFadeOut.duration,
            ease: DOOR_CONFIG.panelFadeOut.ease,
          }}
          style={{ pointerEvents: panelVisible ? "auto" : "none" }}
        >
          <VisitorPanel continueButtonRef={continueButtonRef} onContinue={handleContinue} />
        </motion.div>
      </div>

      <AnimatePresence>
        {doorPhase === "activating" && arrowPath ? (
          <DoorArrow path={arrowPath} onArrive={handleArrowArrive} />
        ) : null}
      </AnimatePresence>
    </LandingLayout>
  );
}
