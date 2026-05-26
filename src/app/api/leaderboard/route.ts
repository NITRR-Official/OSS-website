import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import { formatMonthKey } from "@/lib/leaderboard/streaks";

export const dynamic = "force-dynamic";

/**
 * GET /api/leaderboard
 * Fetch leaderboard with optional filters
 * Query params:
 * - period: "all" | "month" (filter by time period)
 * - limit: number (default: 100)
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "all";
    const limit = parseInt(searchParams.get("limit") || "100");

    const baseQuery = { isMaintainer: false };
    const currentMonthKey = formatMonthKey(new Date());

    const query =
      period === "month" ? { ...baseQuery, monthlyReputationMonth: currentMonthKey } : baseQuery;

    const sort =
      period === "month"
        ? ({ monthlyReputation: -1 } as Record<string, 1 | -1>)
        : ({ totalReputation: -1 } as Record<string, 1 | -1>);

    const users = await User.find(query).sort(sort).limit(limit).lean();
    const data = users.map((user) => ({
      ...user,
      id: user._id?.toString?.() || user._id,
    }));

    return NextResponse.json({
      data,
      period,
      count: users.length,
      month: currentMonthKey,
    });
  } catch (error) {
    console.error("Error in /api/leaderboard:", error);

    return NextResponse.json(
      { error: "Failed to fetch leaderboard", message: String(error) },
      { status: 500 }
    );
  }
}
