"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";

import styles from "./InteractionPanel.module.css";

interface InteractionPanelProps {
  visible: boolean;
}

const CARDS = [
  { title: "Hire me", sub: "Roles & availability" },
  { title: "Collaborate", sub: "Projects & ideas" },
  { title: "Explore work", sub: "Case studies" },
];

const QUICK_ACTIONS = ["View Projects", "Download Resume", "Contact"];

// x: "-50%" keeps the panel centered: the CSS uses left: 50%, and because this
// motion element animates transforms, the horizontal centering must live in the
// variants (Framer owns the transform property).
const container: Variants = {
  hidden: { opacity: 0, y: 24, x: "-50%" },
  visible: {
    opacity: 1,
    y: 0,
    x: "-50%",
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: 16, x: "-50%", transition: { duration: 0.25 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function InteractionPanel({ visible }: InteractionPanelProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.section
          className={styles.panel}
          aria-label="Conversation panel"
          variants={container}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className={styles.cards} variants={item}>
            {CARDS.map((card) => (
              <button key={card.title} type="button" className={styles.card}>
                <span className={styles.cardTitle}>{card.title}</span>
                <span className={styles.cardSub}>{card.sub}</span>
              </button>
            ))}
          </motion.div>

          <motion.div className={styles.inputRow} variants={item}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ask me anything…"
              aria-label="Message input"
            />
            <button type="button" className={styles.mic} aria-label="Use microphone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
                <path
                  d="M6 11a6 6 0 0 0 12 0M12 17v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>

          <motion.div className={styles.quickActions} variants={item}>
            {QUICK_ACTIONS.map((action) => (
              <button key={action} type="button" className={styles.chip}>
                {action}
              </button>
            ))}
          </motion.div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
