import { octokit } from "./client";
import { SITE_CONFIG } from "../constants";
import { OrgStats, ActivityDataPoint } from "@/types";
import { getMonthYearString } from "../utils/date";

/**
 * Fetch organization members (maintainers)
 */
async function fetchOrgMembers() {
  try {
    const { data } = await octokit.orgs.listMembers({
      org: SITE_CONFIG.orgName,
      per_page: 100,
    });

    return data;
  } catch (error) {
    console.error("Error fetching org members:", error);
    return [];
  }
}

/**
 * Fetch all repositories
 */
async function fetchAllRepos() {
  try {
    const { data } = await octokit.repos.listForOrg({
      org: SITE_CONFIG.orgName,
      type: "public",
      per_page: 100,
    });

    return data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
}

/**
 * Count project by status
 */
function countProjectsByStatus(repos: Array<{ archived: boolean; updated_at: string }>) {
  const now = new Date();
  const counts = {
    active: 0,
    dormant: 0,
    archived: 0,
  };

  for (const repo of repos) {
    if (repo.archived) {
      counts.archived++;
      continue;
    }

    const lastUpdate = new Date(repo.updated_at);
    const monthsSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsSinceUpdate < 3) {
      counts.active++;
    } else if (monthsSinceUpdate < 12) {
      counts.dormant++;
    } else {
      counts.archived++;
    }
  }

  return counts;
}

/**
 * Fetch activity data for charts (contributions per month)
 */
async function fetchActivityData(
  repos: Array<{ name: string; owner: { login: string } }>
): Promise<ActivityDataPoint[]> {
  const activityMap = new Map<string, number>();

  // Get last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthYearString(date);
    activityMap.set(key, 0);
  }

  // Fetch commits for each repo
  for (const repo of repos) {
    try {
      const { data: commits } = await octokit.repos.listCommits({
        owner: repo.owner.login,
        repo: repo.name,
        since: new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString(),
        per_page: 100,
      });

      // Count commits per month
      for (const commit of commits) {
        if (commit.commit.author?.date) {
          const monthKey = getMonthYearString(commit.commit.author.date);
          if (activityMap.has(monthKey)) {
            activityMap.set(monthKey, activityMap.get(monthKey)! + 1);
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching commits for ${repo.name}:`, error);
    }
  }

  // Convert map to array
  return Array.from(activityMap.entries()).map(([month, contributions]) => ({
    month,
    contributions,
  }));
}

/**
 * Count total merged PRs across all repos
 */
async function countTotalPRs(
  repos: Array<{ name: string; owner: { login: string } }>
): Promise<number> {
  let totalPRs = 0;

  for (const repo of repos) {
    try {
      const { data } = await octokit.pulls.list({
        owner: repo.owner.login,
        repo: repo.name,
        state: "closed",
        per_page: 1,
      });

      // Get total count from headers
      totalPRs += data.length;
    } catch (error) {
      console.error(`Error fetching PR count for ${repo.name}:`, error);
    }
  }

  return totalPRs;
}

/**
 * Count unique contributors across all repos
 */
async function countUniqueContributors(
  repos: Array<{ name: string; owner: { login: string } }>
): Promise<number> {
  const contributorSet = new Set<string>();

  for (const repo of repos) {
    try {
      const { data } = await octokit.repos.listContributors({
        owner: repo.owner.login,
        repo: repo.name,
        per_page: 100,
      });

      data.forEach((contributor) => {
        if (contributor.login) {
          contributorSet.add(contributor.login);
        }
      });
    } catch (error) {
      console.error(`Error fetching contributors for ${repo.name}:`, error);
    }
  }

  return contributorSet.size;
}

/**
 * Calculate organization-wide statistics
 */
export async function calculateOrgStats(): Promise<Omit<OrgStats, "id">> {
  try {
    const repos = await fetchAllRepos();
    const members = await fetchOrgMembers();

    // Cast repos to the types we need for our functions
    const reposTyped = repos as Array<{
      name: string;
      owner: { login: string };
      archived: boolean;
      updated_at: string;
      stargazers_count: number;
    }>;

    const [totalContributors, totalPRsMerged] = await Promise.all([
      countUniqueContributors(reposTyped),
      countTotalPRs(reposTyped),
      fetchActivityData(reposTyped),
    ]);

    const projectsByStatus = countProjectsByStatus(reposTyped);

    // Calculate total stars
    const totalStars = reposTyped.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const stats: Omit<OrgStats, "id"> = {
      totalProjects: repos.length,
      totalContributors,
      totalPRsMerged,
      totalPRs: totalPRsMerged,
      totalStars,
      activeMaintainers: members.length,
      projectsByStatus,
      activityData: [],
      updatedAt: new Date(),
    };

    return stats;
  } catch (error) {
    console.error("Error calculating org stats:", error);
    throw error;
  }
}
