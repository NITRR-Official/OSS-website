import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Project from "@/lib/db/models/Project";
import { fetchAllProjects } from "@/lib/github/projects";
import { CACHE_DURATIONS } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * GET /api/github/projects
 * Fetch all projects with caching
 */
export async function GET() {
  try {
    // Try to connect to MongoDB for caching
    let useCache = true;
    try {
      await dbConnect();
    } catch {
      console.log("MongoDB not available, fetching directly from GitHub");
      useCache = false;
    }

    if (useCache) {
      // Check if we have cached data
      const cachedProjects = await Project.find().sort({ stars: -1 });

      if (cachedProjects.length > 0) {
        // Check if cache is still fresh (12 hours)
        const latestCache = cachedProjects[0];
        const cacheAge = Date.now() - latestCache.cachedAt.getTime();
        const isFresh = cacheAge < CACHE_DURATIONS.projects * 1000;

        if (isFresh) {
          return NextResponse.json({
            data: cachedProjects,
            cached: true,
            cachedAt: latestCache.cachedAt,
          });
        }
      }
    }

    // Cache is stale or doesn't exist, fetch fresh data
    console.log("Fetching fresh project data from GitHub...");
    const freshProjects = await fetchAllProjects();

    if (useCache) {
      // Update cache
      try {
        await Project.deleteMany({});
        await Project.insertMany(freshProjects);

        // Fetch updated data from DB
        const updatedProjects = await Project.find().sort({ stars: -1 });

        return NextResponse.json({
          data: updatedProjects,
          cached: false,
          cachedAt: new Date(),
        });
      } catch (cacheError) {
        console.error("Failed to update cache:", cacheError);
        // Return fresh data without caching
        return NextResponse.json({
          data: freshProjects,
          cached: false,
          cachedAt: new Date(),
        });
      }
    }

    // Return fresh data without caching
    return NextResponse.json({
      data: freshProjects,
      cached: false,
      cachedAt: new Date(),
    });
  } catch (error) {
    console.error("Error in /api/github/projects:", error);

    // Try to return cached data even if it's stale
    try {
      const cachedProjects = await Project.find().sort({ stars: -1 });
      if (cachedProjects.length > 0) {
        return NextResponse.json({
          data: cachedProjects,
          cached: true,
          cachedAt: cachedProjects[0].cachedAt,
          warning: "Using stale cache due to API error",
        });
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    return NextResponse.json(
      { error: "Failed to fetch projects", message: String(error) },
      { status: 500 }
    );
  }
}
