import { NextResponse } from "next/server";

import { OfficeContentLoader } from "@/features/office/services/OfficeContentLoader";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const content = await OfficeContentLoader.load();
  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}
