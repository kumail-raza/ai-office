export interface RecruiterPrompt {
  id: string;
  label: string;
  prompt: string;
}

/** Dedicated quick actions for recruiters — feed straight into the existing conversation engine. */
export const RECRUITER_PROMPTS: RecruiterPrompt[] = [
  { id: "about", label: "Tell me about Kumail", prompt: "Tell me about Kumail." },
  { id: "experience", label: "Show experience", prompt: "Show me your experience." },
  { id: "certifications", label: "Show certifications", prompt: "Show me your certifications." },
  { id: "architecture", label: "Show architecture expertise", prompt: "Show me your architecture expertise." },
  { id: "ai", label: "Show AI experience", prompt: "Show me your AI experience." },
  { id: "schedule", label: "Schedule a discussion", prompt: "I'd like to schedule a discussion with you." },
];
