"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { LOADER_CONFIG } from "../../constants";

import styles from "./ParticleLayer.module.css";

interface ParticleLayerProps {
  reducedMotion: boolean;
}

interface Particle {
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

// Deterministic pseudo-random so particles are stable across renders and
// SSR-safe (no hydration mismatch, no external libraries).
function pseudoRandom(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    left: pseudoRandom(index, 1) * 100,
    size: 1 + pseudoRandom(index, 2) * 3,
    delay: pseudoRandom(index, 3) * 12,
    duration: 9 + pseudoRandom(index, 4) * 7,
    opacity: 0.1 + pseudoRandom(index, 5) * 0.2,
  }));
}

export function ParticleLayer({ reducedMotion }: ParticleLayerProps) {
  const particles = useMemo(() => buildParticles(LOADER_CONFIG.PARTICLE_COUNT), []);

  return (
    <div className={styles.layer} aria-hidden="true">
      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className={styles.particle}
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={reducedMotion ? undefined : { y: ["0vh", "-115vh"] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}
