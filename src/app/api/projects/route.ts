import { NextResponse } from "next/server";

import { ProjectRepository } from "@/features/projects/services/ProjectRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const projects = await ProjectRepository.getAll();
  return NextResponse.json(projects, { headers: { "Cache-Control": "no-store" } });
}
