import type { QuickAction } from "../types";

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "hire", label: "Hire Me", prompt: "I'd like to hire you. What's your availability and how do we start?" },
  { id: "projects", label: "View Projects", prompt: "Show me your best projects." },
  { id: "architecture", label: "Architecture Consultation", prompt: "I need an architecture consultation." },
  { id: "cloud", label: "Cloud Migration", prompt: "Help me plan a cloud migration." },
  { id: "ai", label: "AI Solutions", prompt: "What AI solutions do you build?" },
  { id: "exploring", label: "Just Exploring", prompt: "I'm just exploring your work." },
];

const RESPONSES: Array<{ match: RegExp; reply: string }> = [
  {
    match: /hire|availability|start/i,
    reply: [
      "Great — I'd love to help. Here's how engagements usually start:",
      "",
      "- **Discovery call** — we scope goals, timeline, and budget.",
      "- **Proposal** — a fixed plan with milestones.",
      "- **Build** — weekly demos, transparent progress.",
      "",
      "I'm currently available for **contract** and **fractional architect** roles. Want me to share a rate card?",
    ].join("\n"),
  },
  {
    match: /project|work|portfolio/i,
    reply: [
      "Here are a few highlights:",
      "",
      "1. **Realtime analytics platform** — 12M events/day on AWS.",
      "2. **AI document pipeline** — RAG over 2M docs.",
      "3. **Multi-region checkout** — 99.99% uptime.",
      "",
      "Which one would you like to dig into?",
    ].join("\n"),
  },
  {
    match: /architecture|consult|design/i,
    reply: [
      "Happy to help with architecture. A typical serverless API layout I use:",
      "",
      "```typescript",
      "export const handler = async (event: APIGatewayEvent) => {",
      "  const user = await auth.verify(event.headers.authorization);",
      "  const result = await service.process(user, event.body);",
      "  return { statusCode: 200, body: JSON.stringify(result) };",
      "};",
      "```",
      "",
      "What system are we designing?",
    ].join("\n"),
  },
  {
    match: /cloud|migrat|aws|azure/i,
    reply: [
      "A pragmatic cloud migration follows the **6 R's**. I usually start with:",
      "",
      "- **Assess** — inventory + dependency mapping.",
      "- **Re-platform** — quick wins (managed DB, containers).",
      "- **Re-architect** — only where it pays off.",
      "",
      "```bash",
      "aws ecs update-service --cluster prod --service api --force-new-deployment",
      "```",
      "",
      "What's your current stack?",
    ].join("\n"),
  },
  {
    match: /\bai\b|llm|ml|model|rag/i,
    reply: [
      "I build production AI systems — RAG, agents, and streaming assistants (like this one).",
      "",
      "```typescript",
      "const stream = await client.chat.completions.create({",
      "  model: 'gpt-4o',",
      "  messages,",
      "  stream: true,",
      "});",
      "```",
      "",
      "Do you have a use case in mind?",
    ].join("\n"),
  },
];

const DEFAULT_REPLY = [
  "Thanks for exploring! Feel free to ask about my **projects**, **architecture** work, or **cloud & AI** experience.",
  "",
  "You can also use the quick actions to jump right in.",
].join("\n");

/** Maps a user prompt to a mock markdown reply. Swappable for a real model later. */
export const PromptService = {
  quickActions: QUICK_ACTIONS,
  getReply(prompt: string): string {
    return RESPONSES.find((entry) => entry.match.test(prompt))?.reply ?? DEFAULT_REPLY;
  },
};
