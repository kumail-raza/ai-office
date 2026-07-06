"use client";

import gsap from "gsap";
import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

import { WORKSPACE_TIMING } from "../../workspace.constants";

import styles from "./Avatar.module.css";

export interface AvatarHandle {
  stopTyping: () => void;
  lookAtCamera: () => void;
  smile: () => void;
}

interface AvatarProps {
  ref?: Ref<AvatarHandle>;
  reducedMotion: boolean;
}

export function Avatar({ ref, reducedMotion }: AvatarProps) {
  const rootRef = useRef<SVGSVGElement>(null);
  const typingRef = useRef<gsap.core.Tween[]>([]);
  const headSwayRef = useRef<gsap.core.Tween | null>(null);
  const blinkTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const select = gsap.utils.selector(root);

    const context = gsap.context(() => {
      // Initial pose: head turned slightly toward the monitor, neutral mouth.
      gsap.set(select(".headGroup"), { rotation: -7, x: -5, transformOrigin: "50% 92%" });
      gsap.set(select(".mouthSmile"), { opacity: 0 });

      if (reducedMotion) return;

      gsap.to(select(".chest"), {
        scaleY: 1.035,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 100%",
      });

      headSwayRef.current = gsap.to(select(".headGroup"), {
        rotation: -3,
        x: -1,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      typingRef.current = [
        gsap.to(select(".handL"), {
          y: -3,
          duration: 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
        gsap.to(select(".handR"), {
          y: -3,
          duration: 0.24,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.1,
        }),
      ];

      const blink = (): void => {
        gsap.to(select(".eye"), {
          scaleY: 0.12,
          duration: 0.07,
          yoyo: true,
          repeat: 1,
          transformOrigin: "50% 50%",
          onComplete: () => {
            blinkTimeoutRef.current = window.setTimeout(blink, 1600 + Math.random() * 3200);
          },
        });
      };
      blinkTimeoutRef.current = window.setTimeout(blink, 1200);
    }, root);

    return () => {
      if (blinkTimeoutRef.current !== null) window.clearTimeout(blinkTimeoutRef.current);
      context.revert();
    };
  }, [reducedMotion]);

  useImperativeHandle(
    ref,
    () => ({
      stopTyping: () => {
        const root = rootRef.current;
        if (!root) return;
        const select = gsap.utils.selector(root);
        typingRef.current.forEach((tween) => tween.kill());
        typingRef.current = [];
        gsap.to(select(".handL, .handR"), { y: 0, duration: 0.3, ease: "power2.out" });
      },
      lookAtCamera: () => {
        const root = rootRef.current;
        if (!root) return;
        const select = gsap.utils.selector(root);
        headSwayRef.current?.kill();
        headSwayRef.current = null;
        gsap.to(select(".headGroup"), {
          rotation: 0,
          x: 0,
          y: -2,
          duration: reducedMotion ? 0 : WORKSPACE_TIMING.turnHead,
          ease: "power2.inOut",
          transformOrigin: "50% 92%",
        });
      },
      smile: () => {
        const root = rootRef.current;
        if (!root) return;
        const select = gsap.utils.selector(root);
        const duration = reducedMotion ? 0 : WORKSPACE_TIMING.smile;
        gsap.to(select(".mouthNeutral"), { opacity: 0, duration });
        gsap.to(select(".mouthSmile"), { opacity: 1, duration });
      },
    }),
    [reducedMotion],
  );

  return (
    <svg
      ref={rootRef}
      className={styles.avatar}
      viewBox="0 0 320 300"
      role="img"
      aria-label="Kumail, the AI digital twin, seated at his desk"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* chair */}
      <rect x="86" y="120" width="148" height="170" rx="26" fill="#c3cbdb" />
      <rect x="98" y="132" width="124" height="150" rx="20" fill="#d7deea" />

      {/* torso / shirt */}
      <path
        className="chest"
        d="M104 168 q56 -34 112 0 l10 122 q-66 20 -132 0 Z"
        fill="#3f6b8c"
      />
      <path d="M150 150 h20 l-4 30 h-12 Z" fill="#e8b48f" />

      {/* arms + hands resting near the keyboard */}
      <path d="M108 186 q-16 40 6 78 l24 -8 q-14 -34 -2 -60 Z" fill="#37607d" />
      <path d="M212 186 q16 40 -6 78 l-24 -8 q14 -34 2 -60 Z" fill="#37607d" />
      <ellipse className="handL" cx="128" cy="262" rx="17" ry="12" fill="#e8b48f" />
      <ellipse className="handR" cx="192" cy="262" rx="17" ry="12" fill="#e8b48f" />

      {/* head */}
      <g className="headGroup">
        <ellipse cx="160" cy="150" rx="26" ry="18" fill="#e8b48f" />
        <path d="M120 96 q40 -46 80 0 q6 40 -8 58 q-32 22 -64 0 q-14 -18 -8 -58 Z" fill="#3a2e2a" />
        <ellipse cx="160" cy="96" rx="44" ry="50" fill="#e8b48f" />
        <ellipse cx="116" cy="98" rx="7" ry="11" fill="#e0a87f" />
        <ellipse cx="204" cy="98" rx="7" ry="11" fill="#e0a87f" />
        <path d="M116 74 q44 -52 88 0 q-8 -30 -44 -30 q-36 0 -44 30 Z" fill="#3a2e2a" />

        {/* eyebrows */}
        <path d="M132 82 q12 -6 24 0" stroke="#4a3b34" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M164 82 q12 -6 24 0" stroke="#4a3b34" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* eyes */}
        <g className="eye">
          <ellipse cx="144" cy="94" rx="8" ry="9" fill="#ffffff" />
          <circle cx="145" cy="95" r="4" fill="#2c2320" />
        </g>
        <g className="eye">
          <ellipse cx="176" cy="94" rx="8" ry="9" fill="#ffffff" />
          <circle cx="175" cy="95" r="4" fill="#2c2320" />
        </g>

        {/* nose */}
        <path d="M160 100 q4 8 -2 12" stroke="#d69a72" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* mouth (neutral fades out, smile fades in) */}
        <path className="mouthNeutral" d="M150 120 q10 4 20 0" stroke="#8a4a3c" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path className="mouthSmile" d="M148 118 q12 12 24 0" stroke="#8a4a3c" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
