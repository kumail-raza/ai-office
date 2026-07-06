"use client";

import { motion } from "framer-motion";

import { type Message, MessageRole, MessageStatus } from "../../types";
import { MarkdownMessage } from "../MarkdownMessage";
import { ThinkingIndicator } from "../ThinkingIndicator";

import styles from "./MessageBubble.module.css";

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === MessageRole.User;
  const isError = message.status === MessageStatus.Error;
  const isThinking = message.status === MessageStatus.Thinking;
  const isTyping = message.status === MessageStatus.Typing;

  const rowClass = [
    styles.row,
    isUser ? styles.user : styles.assistant,
    isError ? styles.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={rowClass}
      initial={isUser ? { opacity: 0, x: 28 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={styles.bubble}>
        {isThinking ? (
          <ThinkingIndicator />
        ) : isUser ? (
          <span>{message.content}</span>
        ) : (
          <>
            <MarkdownMessage content={message.content} />
            {isTyping ? <span className={styles.caret}>▋</span> : null}
          </>
        )}
      </div>
      {!isThinking ? <span className={styles.meta}>{formatTime(message.createdAt)}</span> : null}
    </motion.div>
  );
}
