"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

import { COFFEE_MESSAGES } from "../../constants/coffeeMessages";

import styles from "./experiences.module.css";

function shuffledOrder(length: number): number[] {
  const order = Array.from({ length }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function CoffeeExperience() {
  const orderRef = useRef<number[]>(shuffledOrder(COFFEE_MESSAGES.length));
  const positionRef = useRef(0);
  const [message, setMessage] = useState<string>(COFFEE_MESSAGES[orderRef.current[0]]);

  // Cycle through every message before any repeats.
  const nextMessage = () => {
    positionRef.current += 1;
    if (positionRef.current >= COFFEE_MESSAGES.length) {
      orderRef.current = shuffledOrder(COFFEE_MESSAGES.length);
      positionRef.current = 0;
    }
    setMessage(COFFEE_MESSAGES[orderRef.current[positionRef.current]]);
  };

  return (
    <div className={styles.coffee}>
      <motion.p
        key={message}
        className={styles.coffeeMessage}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        aria-live="polite"
      >
        {message}
      </motion.p>
      <button type="button" className={styles.primary} onClick={nextMessage}>
        Another sip
      </button>
    </div>
  );
}
