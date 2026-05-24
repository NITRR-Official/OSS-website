import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import OrgStats from "@/lib/db/models/Stats";
import { calculateOrgStats } from "@/lib/github/stats";
import { CACHE_DURATIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * GET /api/github/stats
 * Fetch organization statistics with caching
 */
export async function GET(request: NextRequest) {
  try {
    const forceRefresh =
      request.nextUrl.searchParams.get("refresh") === "1" ||
      request.nextUrl.searchParams.get("refresh") === "true";
    // Try to connect to MongoDB for caching
    let useCache = true;
    try {
      await dbConnect();
    } catch {
      console.log("MongoDB not available, calculating stats directly");
      useCache = false;
    }

    if (useCache && !forceRefresh) {
      // Check if we have cached data
      const cachedStats = await OrgStats.findOne().sort({ updatedAt: -1 });

      if (cachedStats) {
        // Check if cache is still fresh
        const cacheAge = Date.now() - cachedStats.updatedAt.getTime();
        const isFresh = cacheAge < CACHE_DURATIONS.stats * 1000;
        const hasMeaningfulData =
          cachedStats.totalProjects > 0 ||
          cachedStats.totalContributors > 0 ||
          cachedStats.totalStars > 0;

        if (isFresh && hasMeaningfulData) {
          return NextResponse.json({
            data: cachedStats,
            cached: true,
            cachedAt: cachedStats.updatedAt,
          });
        }
      }
    }

    // Cache is stale or doesn't exist, fetch fresh data
    console.log("Calculating fresh org stats from GitHub...");
    const freshStats = await calculateOrgStats();

    if (useCache) {
      // Update cache (replace old data)
      try {
        await OrgStats.deleteMany({});
        const newStats = await OrgStats.create(freshStats);

        return NextResponse.json({
          data: newStats,
          cached: false,
          cachedAt: new Date(),
        });
      } catch (cacheError) {
        console.error("Failed to update cache:", cacheError);
        return NextResponse.json({
          data: freshStats,
          cached: false,
          cachedAt: new Date(),
        });
      }
    }

    // Return fresh data without caching
    return NextResponse.json({
      data: freshStats,
      cached: false,
      cachedAt: new Date(),
    });
  } catch (error) {
    console.error("Error in /api/github/stats:", error);

    // Try to return cached data even if it's stale
    try {
      const cachedStats = await OrgStats.findOne().sort({ updatedAt: -1 });
      if (cachedStats) {
        return NextResponse.json({
          data: cachedStats,
          cached: true,
          cachedAt: cachedStats.updatedAt,
          warning: "Using stale cache due to API error",
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json(
      { error: "Failed to fetch stats", message: String(error) },
      { status: 500 }
    );
  }
}
