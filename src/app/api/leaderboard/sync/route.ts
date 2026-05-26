import { NextRequest, NextResponse } from "next/server";
import { syncLeaderboard } from "@/lib/leaderboard/sync";

export const dynamic = "force-dynamic";

function getSyncOptions(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fullSync = searchParams.get("full") === "1" || searchParams.get("full") === "true";
  const visibilityParam = (searchParams.get("visibility") === "all" ? "all" : "public") as
    | "all"
    | "public";
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : undefined;

  return {
    fullSync,
    since: since && !Number.isNaN(since.getTime()) ? since : undefined,
    repoVisibility: visibilityParam,
  };
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.CACHE_UPDATE_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Sync secret not configured" }, { status: 500 });
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await syncLeaderboard(getSyncOptions(request));

    return NextResponse.json({
      success: true,
      summary,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/leaderboard/sync:", error);
    return NextResponse.json(
      { error: "Failed to sync leaderboard", message: String(error) },
      { status: 500 }
    );
  }
}
