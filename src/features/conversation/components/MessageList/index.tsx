"use client";

import { useEffect, useRef } from "react";

import type { Message } from "../../types";
import { MessageBubble } from "../MessageBubble";

import styles from "./MessageList.module.css";

export function MessageList({ messages }: { messages: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest content (also follows streaming updates).
  const lastContent = messages.at(-1)?.content ?? "";
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, lastContent]);

  return (
    <div className={styles.list} role="log" aria-live="polite">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
