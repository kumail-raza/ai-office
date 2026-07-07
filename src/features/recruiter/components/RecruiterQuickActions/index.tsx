"use client";

import { useConversation } from "@/features/conversation";
import { useRecruiterStore } from "@/stores/recruiter.store";

import { RECRUITER_PROMPTS } from "../../constants/recruiterPrompts";
import styles from "../sections/sections.module.css";

/**
 * Recruiter-specific quick actions. These feed into the SAME conversation
 * engine used by the office chat (via useConversation) rather than a separate
 * chat surface. Sending a prompt exits Recruiter Mode so the visitor
 * immediately sees the streaming reply in the conversation panel.
 */
export function RecruiterQuickActions() {
  const { sendMessage, isBusy } = useConversation();
  const exitRecruiterMode = useRecruiterStore((state) => state.exitRecruiterMode);

  const handleSelect = (prompt: string) => {
    sendMessage(prompt);
    exitRecruiterMode();
  };

  return (
    <div className={styles.quickActions} role="group" aria-label="Recruiter quick actions">
      {RECRUITER_PROMPTS.map((action) => (
        <button
          key={action.id}
          type="button"
          className={styles.quickAction}
          disabled={isBusy}
          onClick={() => handleSelect(action.prompt)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
