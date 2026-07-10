"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";

import { ConversationPanel, ConversationProvider } from "@/features/conversation";
import { DigitalTwinRuntime } from "@/features/digital-twin";
import { OfficeExperience, OfficeInteractionProvider, OfficeObjectLayer } from "@/features/office";
import { ProjectExperienceLauncher } from "@/features/projects";
import { RecruiterDashboard, RecruiterModeToggle } from "@/features/recruiter";
import { VoiceIndicator } from "@/features/voice";
import { useAppStore } from "@/stores/app.store";

import {
  Avatar,
  type AvatarHandle,
  CameraRig,
  GreetingController,
  Workspace,
} from "./components";
import { WORKSPACE_TIMING, WorkspacePhase } from "./workspace.constants";

import styles from "./styles/OfficeScene.module.css";

export function OfficeScene() {
  const visitorName = useAppStore((state) => state.visitorName);

  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [phase, setPhase] = useState<WorkspacePhase>(WorkspacePhase.ENTERING);

  const avatarRef = useRef<AvatarHandle>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = fadeOverlayRef.current;
    if (!overlay) return;

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(overlay, { opacity: 0 });
        avatarRef.current?.stopTyping();
        avatarRef.current?.lookAtCamera();
        avatarRef.current?.smile();
        setPhase(WorkspacePhase.GREETING);
        return;
      }

      gsap
        .timeline()
        .to(overlay, { opacity: 0, duration: WORKSPACE_TIMING.fadeIn, ease: "power2.inOut" })
        .call(() => setPhase(WorkspacePhase.IDLE))
        .to({}, { duration: WORKSPACE_TIMING.idleHold })
        .call(() => {
          setPhase(WorkspacePhase.ENTRANCE);
          avatarRef.current?.stopTyping();
          avatarRef.current?.lookAtCamera();
        })
        .to({}, { duration: WORKSPACE_TIMING.turnHead })
        .call(() => avatarRef.current?.smile())
        .to({}, { duration: WORKSPACE_TIMING.smile + WORKSPACE_TIMING.preSpeakWait })
        .call(() => setPhase(WorkspacePhase.GREETING));
    });

    return () => context.revert();
  }, [reducedMotion]);

  const handleGreetingComplete = useCallback(() => {
    setPhase(WorkspacePhase.INTERACTIVE);
  }, []);

  return (
    <div className={styles.root}>
      <CameraRig reducedMotion={reducedMotion}>
        <Workspace>
          <Avatar ref={avatarRef} reducedMotion={reducedMotion} />
        </Workspace>
      </CameraRig>

      <GreetingController
        name={visitorName}
        active={phase === WorkspacePhase.GREETING}
        reducedMotion={reducedMotion}
        onComplete={handleGreetingComplete}
      />

      {phase === WorkspacePhase.INTERACTIVE ? (
        <>
          <OfficeInteractionProvider>
            <OfficeObjectLayer />
            <OfficeExperience />
          </OfficeInteractionProvider>

          <ConversationProvider>
            <ConversationPanel />
            <RecruiterModeToggle />
            <RecruiterDashboard />
            <ProjectExperienceLauncher />
            <VoiceIndicator />
            <DigitalTwinRuntime />
          </ConversationProvider>
        </>
      ) : null}

      <div ref={fadeOverlayRef} className={styles.fadeOverlay} aria-hidden="true" />
    </div>
  );
}
