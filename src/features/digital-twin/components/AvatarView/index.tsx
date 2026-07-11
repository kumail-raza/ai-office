"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { AvatarExpression, AvatarGesture, AvatarState, EyeTarget } from "../../types";
import {
  EXPRESSION_BROW,
  EXPRESSION_MOUTH,
  STATE_VISUAL,
  eyeOffset,
} from "./avatarView.constants";

import styles from "./AvatarView.module.css";

export interface AvatarViewProps {
  state: AvatarState;
  expression: AvatarExpression;
  gesture: AvatarGesture;
  eyeTarget: EyeTarget;
  /** Portrait size in px. */
  size?: number;
}

/**
 * Pure presentational 2D avatar. It renders only from the props it is given and
 * holds no reference to the runtime — this is the seam a future React Three
 * Fiber / Ready Player Me / MetaHuman / HeyGen / Tavus view drops into without
 * touching the runtime (AvatarManager / useAvatar) contract.
 */
export function AvatarView({ state, expression, gesture, eyeTarget, size = 128 }: AvatarViewProps) {
  const reduce = useReducedMotion() ?? false;
  const visual = STATE_VISUAL[state];
  const pupil = eyeOffset(eyeTarget);
  const brow = EXPRESSION_BROW[expression];

  const isSpeaking = state === AvatarState.Speaking || expression === AvatarExpression.Speaking;
  const isThinking = state === AvatarState.Thinking || expression === AvatarExpression.Thinking;
  const isListening = state === AvatarState.Listening || expression === AvatarExpression.Listening;
  const isWorking = state === AvatarState.Working || gesture === AvatarGesture.Typing;

  // Breathing: subtle scale loop, slower and calmer at rest.
  const breathe = reduce
    ? {}
    : {
        scale: [1, 1.015, 1],
        transition: {
          duration: state === AvatarState.Idle ? 4.4 : 3.2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <div className={styles.stage} style={{ width: size, height: size }}>
      {/* Aura ring — colour + pulse encode the live state. */}
      <motion.span
        aria-hidden="true"
        className={styles.aura}
        style={{ background: visual.accent }}
        animate={
          reduce
            ? { opacity: 0.18 + visual.energy * 0.25, scale: 1 }
            : {
                opacity: [0.12 + visual.energy * 0.2, 0.28 + visual.energy * 0.35, 0.12 + visual.energy * 0.2],
                scale: [1, 1 + 0.04 + visual.energy * 0.12, 1],
              }
        }
        transition={
          reduce
            ? { duration: 0.4 }
            : { duration: 2.6 - visual.energy * 1.1, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.svg
        className={styles.face}
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Digital twin — ${visual.label}`}
        animate={breathe}
      >
        <defs>
          <radialGradient id="dt-head" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#ffe4cb" />
            <stop offset="100%" stopColor="#f0c3a1" />
          </radialGradient>
        </defs>

        {/* Listening halo */}
        <AnimatePresence>
          {isListening ? (
            <motion.circle
              key="listen-halo"
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={visual.accent}
              strokeWidth="2"
              initial={{ opacity: 0, r: 46 }}
              animate={
                reduce
                  ? { opacity: 0.5, r: 52 }
                  : { opacity: [0.45, 0.05, 0.45], r: [46, 56, 46] }
              }
              exit={{ opacity: 0 }}
              transition={reduce ? { duration: 0.3 } : { duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          ) : null}
        </AnimatePresence>

        {/* Head + hair */}
        <circle cx="60" cy="62" r="40" fill="url(#dt-head)" />
        <path d="M22 58 Q26 24 60 22 Q94 24 98 58 Q92 44 60 44 Q28 44 22 58 Z" fill="#33261c" />
        <path d="M40 96 Q60 108 80 96 L80 112 L40 112 Z" fill="#2f4a63" />

        {/* Eyebrows */}
        <g fill="none" stroke="#5a4634" strokeWidth="2.4" strokeLinecap="round">
          <line x1="40" y1={50 + brow.y} x2="53" y2={50 + brow.y - brow.tilt * 0.3} />
          <line x1="67" y1={50 + brow.y - brow.tilt * 0.3} x2="80" y2={50 + brow.y} />
        </g>

        {/* Eyes — sclera + a pupil group that shifts with the eye target and blinks. */}
        <g>
          <ellipse cx="46.5" cy="60" rx="7" ry="6" fill="#ffffff" />
          <ellipse cx="73.5" cy="60" rx="7" ry="6" fill="#ffffff" />
          <motion.g
            animate={
              reduce ? {} : { scaleY: [1, 1, 0.1, 1] }
            }
            transition={
              reduce
                ? undefined
                : { duration: 0.28, repeat: Infinity, repeatDelay: 3.6, times: [0, 0.85, 0.92, 1] }
            }
            style={{ originY: "60px" }}
          >
            <motion.circle
              cx={46.5}
              cy={60}
              r="3.1"
              fill="#2a2320"
              animate={{ x: pupil.x, y: pupil.y }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
            />
            <motion.circle
              cx={73.5}
              cy={60}
              r="3.1"
              fill="#2a2320"
              animate={{ x: pupil.x, y: pupil.y }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
            />
          </motion.g>
        </g>

        {/* Mouth — morphs with expression; pulses while speaking. */}
        <motion.path
          fill="none"
          stroke="#8a4b3a"
          strokeWidth="2.6"
          strokeLinecap="round"
          animate={{ d: EXPRESSION_MOUTH[expression] }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
        {isSpeaking && !reduce ? (
          <motion.ellipse
            cx="60"
            cy="84"
            rx="6"
            fill="#7a3f30"
            animate={{ ry: [1.5, 5, 2, 4.5, 1.5] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </motion.svg>

      {/* Thinking pulse — three drifting dots above the head. */}
      <AnimatePresence>
        {isThinking ? (
          <motion.div
            key="think"
            className={styles.thinking}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={styles.thinkingDot}
                style={{ background: visual.accent }}
                animate={reduce ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                transition={reduce ? undefined : { duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Typing indicator — appears while working. */}
      <AnimatePresence>
        {isWorking ? (
          <motion.div
            key="typing"
            className={styles.typing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className={styles.typingBar}
                style={{ background: visual.accent }}
                animate={reduce ? { scaleY: 1 } : { scaleY: [0.5, 1, 0.5] }}
                transition={reduce ? undefined : { duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Gesture hand — waves / points / greets. */}
      <AnimatePresence>
        {gesture === AvatarGesture.Wave || gesture === AvatarGesture.Greeting ? (
          <motion.span
            key="wave"
            className={styles.hand}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: reduce ? 0 : [0, 18, -8, 16, -6, 0],
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={reduce ? { duration: 0.2 } : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            👋
          </motion.span>
        ) : gesture === AvatarGesture.Point ? (
          <motion.span
            key="point"
            className={styles.hand}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: reduce ? 0 : [0, 6, 0] }}
            exit={{ opacity: 0, x: -6 }}
            transition={reduce ? { duration: 0.2 } : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          >
            👉
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
