import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Project from "@/lib/db/models/Project";
import Contributor from "@/lib/db/models/Contributor";
import OrgStats from "@/lib/db/models/Stats";
import { fetchAllProjects } from "@/lib/github/projects";
import { fetchAllContributors } from "@/lib/github/contributors";
import { calculateOrgStats } from "@/lib/github/stats";

export const dynamic = "force-dynamic";

/**
 * POST /api/update-cache
 * Manually trigger cache update (protected endpoint)
 * Requires CACHE_UPDATE_SECRET in headers
 */
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get("authorization");
    const secret = process.env.CACHE_UPDATE_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "Cache update secret not configured" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    console.log("Starting manual cache update...");

    // Update all caches in parallel
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [projects, contributors, stats] = await Promise.all([
      updateProjectsCache(),
      updateContributorsCache(),
      updateStatsCache(),
    ]);

    return NextResponse.json({
      success: true,
      message: "Cache updated successfully",
      updated: {
        projects: projects.count,
        contributors: contributors.count,
        stats: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating cache:", error);

    return NextResponse.json(
      { error: "Failed to update cache", message: String(error) },
      { status: 500 }
    );
  }
}

async function updateProjectsCache() {
  console.log("Updating projects cache...");
  const freshProjects = await fetchAllProjects();
  await Project.deleteMany({});
  await Project.insertMany(freshProjects);
  return { count: freshProjects.length };
}

async function updateContributorsCache() {
  console.log("Updating contributors cache...");
  const freshContributors = await fetchAllContributors();
  await Contributor.deleteMany({});
  await Contributor.insertMany(freshContributors);
  return { count: freshContributors.length };
}

async function updateStatsCache() {
  console.log("Updating stats cache...");
  const freshStats = await calculateOrgStats();
  await OrgStats.deleteMany({});
  await OrgStats.create(freshStats);
  return { success: true };
}
