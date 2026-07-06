import { NextResponse } from "next/server";

import {
  KnowledgeService,
  PromptAssembler,
  SearchService,
} from "@/features/knowledge";
import { getLanguageModel } from "@/services/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatRequest {
  message?: unknown;
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

  const index = await KnowledgeService.getIndex();
  const results = SearchService.search(index, message, 3);
  const prompt = PromptAssembler.assemble(message, results);
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
      // Citations are returned internally (not rendered by default).
      "X-Citations": encodeURIComponent(JSON.stringify(prompt.citations)),
    },
  });
}
