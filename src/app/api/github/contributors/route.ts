import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Contributor from "@/lib/db/models/Contributor";
import { fetchAllContributors } from "@/lib/github/contributors";
import { CACHE_DURATIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * GET /api/github/contributors
 * Fetch all contributors with caching
 */
export async function GET() {
  try {
    await dbConnect();

    // Check if we have cached data
    const cachedContributors = await Contributor.find().sort({ points: -1 });

    if (cachedContributors.length > 0) {
      // Check if cache is still fresh (24 hours)
      const latestCache = cachedContributors[0];
      const cacheAge = Date.now() - latestCache.updatedAt.getTime();
      const isFresh = cacheAge < CACHE_DURATIONS.contributors * 1000;

      if (isFresh) {
        return NextResponse.json({
          contributors: cachedContributors,
          cached: true,
          cachedAt: latestCache.updatedAt,
        });
      }
    }

    // Cache is stale or doesn't exist, fetch fresh data
    console.log("Fetching fresh contributor data from GitHub...");
    const freshContributors = await fetchAllContributors();

    // Update cache
    await Contributor.deleteMany({});
    await Contributor.insertMany(freshContributors);

    // Fetch updated data from DB
    const updatedContributors = await Contributor.find().sort({ points: -1 });

    return NextResponse.json({
      contributors: updatedContributors,
      cached: false,
      cachedAt: new Date(),
    });
  } catch (error) {
    console.error("Error in /api/github/contributors:", error);

    // Try to return cached data even if it's stale
    try {
      const cachedContributors = await Contributor.find().sort({ points: -1 });
      if (cachedContributors.length > 0) {
        return NextResponse.json({
          contributors: cachedContributors,
          cached: true,
          cachedAt: cachedContributors[0].updatedAt,
          warning: "Using stale cache due to API error",
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json(
      { error: "Failed to fetch contributors", message: String(error) },
      { status: 500 }
    );
  }
}
