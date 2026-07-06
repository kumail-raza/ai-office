"use client";

import { motion } from "framer-motion";

import { useConversation } from "../../context/ConversationContext";
import { ChatInput } from "../ChatInput";
import { MessageList } from "../MessageList";
import { QuickActions } from "../QuickActions";

import styles from "./ConversationPanel.module.css";

export function ConversationPanel() {
  const { messages, voiceEnabled, isBusy, sendMessage, stopGeneration, toggleVoice } =
    useConversation();

  const hasMessages = messages.length > 0;

  return (
    <motion.section
      className={styles.panel}
      aria-label="Conversation with Kumail"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>Kumail — AI Assistant</h2>
        <button
          type="button"
          className={`${styles.voice} ${voiceEnabled ? styles.voiceOn : ""}`}
          onClick={toggleVoice}
          aria-pressed={voiceEnabled}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" />
            {voiceEnabled ? (
              <path
                d="M16 8a5 5 0 0 1 0 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : null}
          </svg>
          Voice {voiceEnabled ? "on" : "off"}
        </button>
      </header>

      <div className={styles.body}>
        {hasMessages ? (
          <MessageList messages={messages} />
        ) : (
          <>
            <p className={styles.empty}>Pick a topic or ask me anything:</p>
            <QuickActions onSelect={sendMessage} disabled={isBusy} />
          </>
        )}
      </div>

      <ChatInput isBusy={isBusy} onSend={sendMessage} onStop={stopGeneration} />
    </motion.section>
  );
}
