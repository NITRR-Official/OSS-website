import { NextResponse } from "next/server";
import { searchContent } from "@/lib/search";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Prevent timeout on cold starts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") as "blog" | "resource" | undefined;

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const results = await searchContent(q, type);
    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
