import { NextResponse } from "next/server";

import { RecruiterContentLoader } from "@/features/recruiter/services/RecruiterContentLoader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const content = await RecruiterContentLoader.load();
  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}
