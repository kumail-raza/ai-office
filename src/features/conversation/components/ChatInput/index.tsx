"use client";

import { type KeyboardEvent, useState } from "react";

import styles from "./ChatInput.module.css";

interface ChatInputProps {
  isBusy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function ChatInput({ isBusy, onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (text.length === 0 || isBusy) return;
    onSend(text);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.form}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Attach a file (coming soon)"
        disabled
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.5 12.5 21a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7.5-7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button type="button" className={styles.iconButton} aria-label="Use microphone">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
          <path
            d="M6 11a6 6 0 0 0 12 0M12 17v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <textarea
        className={styles.textarea}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything… (Enter to send, Shift+Enter for a new line)"
        rows={1}
        aria-label="Message input"
      />

      {isBusy ? (
        <button
          type="button"
          className={`${styles.iconButton} ${styles.stop}`}
          aria-label="Stop generating"
          onClick={onStop}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          className={`${styles.iconButton} ${styles.send}`}
          aria-label="Send message"
          onClick={submit}
          disabled={value.trim().length === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12 20 4l-4 16-4-7-8-1Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
