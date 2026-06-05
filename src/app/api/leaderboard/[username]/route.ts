import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import ReputationContribution from "@/lib/db/models/ReputationContribution";
import { formatMonthKey } from "@/lib/leaderboard/streaks";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();

    const { username } = await params;
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
    }

    const contributions = await ReputationContribution.find({ userId: user._id.toString() })
      .sort({ mergedAt: -1 })
      .limit(50)
      .lean();

    const currentMonthKey = formatMonthKey(new Date());
    const monthlyReputation =
      user.monthlyReputationMonth === currentMonthKey ? user.monthlyReputation || 0 : 0;

    return NextResponse.json({
      user: {
        ...user,
        id: user._id?.toString?.() || user._id,
        monthlyReputation,
      },
      contributions: contributions.map((contribution) => ({
        ...contribution,
        id: contribution._id?.toString?.() || contribution._id,
      })),
    });
  } catch (error) {
    console.error("Error in /api/leaderboard/[username]:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributor profile", message: String(error) },
      { status: 500 }
    );
  }
}
