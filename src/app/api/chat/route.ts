import { NextResponse } from "next/server";

import { ProjectContextBuilder } from "@/features/projects/services/ProjectContextBuilder";
import { ProjectRepository } from "@/features/projects/services/ProjectRepository";
import { KnowledgeProvider, PromptAssembler } from "@/knowledge";
import type { ConversationTurn, RetrievedDocument } from "@/knowledge/types";
import { getLanguageModel } from "@/services/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProjectContextInput {
  slug: string;
  title: string;
  summary: string;
}

interface ChatRequest {
  message?: unknown;
  history?: unknown;
  project?: unknown;
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

function parseProjectContext(value: unknown): ProjectContextInput | null {
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.slug !== "string" || record.slug.length === 0) return null;

  return {
    slug: record.slug,
    title: typeof record.title === "string" ? record.title : "",
    summary: typeof record.summary === "string" ? record.summary : "",
  };
}

/**
 * Synthesizes the active project as a top-ranked "retrieved" document so
 * PromptAssembler.assemble() grounds its answer in it — without any changes to
 * the Knowledge Brain itself (KnowledgeLoader/Index/Retriever/PromptAssembler).
 */
async function buildProjectDocument(context: ProjectContextInput): Promise<RetrievedDocument> {
  const project = await ProjectRepository.getBySlug(context.slug);
  const content = project ? ProjectContextBuilder.build(project) : context.summary;

  return {
    document: {
      id: `project-context:${context.slug}`,
      path: `projects/${context.slug}.md`,
      metadata: {
        title: project?.title ?? context.title,
        category: "active-project",
        tags: project?.technologies ?? [],
        headings: [],
        summary: context.summary,
      },
      content,
      tokens: [],
    },
    score: Number.POSITIVE_INFINITY,
    snippet: context.summary,
  };
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

  const projectContext = parseProjectContext(body.project);
  const retrieved = await KnowledgeProvider.retrieve(message, 3);
  const documents = projectContext
    ? [await buildProjectDocument(projectContext), ...retrieved]
    : retrieved;

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
