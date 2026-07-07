import { NextResponse } from "next/server";

import { KnowledgeProvider, PromptAssembler } from "@/knowledge";
import type { ConversationTurn } from "@/knowledge/types";
import { getLanguageModel } from "@/services/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequest {
  message?: unknown;
  history?: unknown;
}

function parseHistory(value: unknown): ConversationTurn[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (turn): turn is ConversationTurn =>
        typeof turn === "object" &&
        turn !== null &&
        (turn as ConversationTurn).role !== undefined &&
        typeof (turn as ConversationTurn).content === "string",
    )
    .slice(-10);
}

export async function POST(request: Request): Promise<Response> {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length === 0) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  const documents = await KnowledgeProvider.retrieve(message, 3);
  const prompt = PromptAssembler.assemble({
    documents,
    history: parseHistory(body.history),
    userMessage: message,
  });
  const model = getLanguageModel();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of model.stream(prompt, request.signal)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Citations": encodeURIComponent(JSON.stringify(prompt.citations)),
    },
  });
}
