import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Contributor from "@/lib/db/models/Contributor";

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

    let query = {};

    // Filter by time period
    if (period === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Filter contributors with contributions in the last month
      query = {
        "contributions.mergedAt": { $gte: oneMonthAgo },
      };
    }

    // Fetch contributors
    let contributors = await Contributor.find(query).sort({ points: -1 }).limit(limit).lean();

    // If filtering by month, recalculate points for that period
    if (period === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      contributors = contributors.map((contributor) => {
        const recentContributions = contributor.contributions.filter(
          (c) => new Date(c.mergedAt) >= oneMonthAgo
        );

        const monthlyPoints = recentContributions.reduce((sum, c) => sum + c.points, 0);
        const monthlyPRs = recentContributions.length;

        return {
          ...contributor,
          points: monthlyPoints,
          prsMerged: monthlyPRs,
        };
      });

      // Re-sort by monthly points
      contributors.sort((a, b) => b.points - a.points);
    }

    return NextResponse.json({
      leaderboard: contributors,
      period,
      count: contributors.length,
    });
  } catch (error) {
    console.error("Error in /api/leaderboard:", error);

    return NextResponse.json(
      { error: "Failed to fetch leaderboard", message: String(error) },
      { status: 500 }
    );
  }
}
