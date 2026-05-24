import { octokit } from "./client";
import { SITE_CONFIG, GITHUB_CONFIG } from "../constants";
import { OrgStats, ActivityData } from "@/types";
import { getMonthYearString } from "../utils/date";

/**
 * Fetch organization members (maintainers)
 */
async function fetchOrgMembers() {
  try {
    const { data } = await octokit.orgs.listMembers({
      org: SITE_CONFIG.orgName,
      per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
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
      per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
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

    if (monthsSinceUpdate < GITHUB_CONFIG.REPO_ACTIVE_MONTHS) {
      counts.active++;
    } else if (monthsSinceUpdate < GITHUB_CONFIG.REPO_DORMANT_MONTHS) {
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
): Promise<ActivityData[]> {
  const activityMap = new Map<string, ActivityData>();

  // Get last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - GITHUB_CONFIG.ACTIVITY_HISTORY_MONTHS,
    1
  );

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthYearString(date);
    activityMap.set(key, {
      month: key,
      commits: 0,
      prs: 0,
      issues: 0,
    });
  }

  // Fetch commits, PRs, and issues for each repo
  for (const repo of repos) {
    try {
      // Fetch commits
      const { data: commits } = await octokit.repos.listCommits({
        owner: repo.owner.login,
        repo: repo.name,
        since: sixMonthsAgo.toISOString(),
        per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
      });

      for (const commit of commits) {
        if (commit.commit.author?.date) {
          const monthKey = getMonthYearString(commit.commit.author.date);
          const entry = activityMap.get(monthKey);
          if (entry) {
            entry.commits += 1;
          }
        }
      }
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status !== 409) {
        console.error(`Error fetching commits for ${repo.name}:`, error);
      }
    }

    // Fetch all PRs (both open and closed)
    try {
      let allPRs: Array<{ created_at: string | null; [key: string]: unknown }> = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { data: prs } = await octokit.pulls.list({
          owner: repo.owner.login,
          repo: repo.name,
          state: "all",
          per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
          page,
        });

        if (prs.length === 0) {
          hasMore = false;
        } else {
          allPRs = allPRs.concat(prs);
          page++;
        }
      }

      for (const pr of allPRs) {
        if (pr.created_at) {
          const prDate = new Date(pr.created_at);
          if (prDate >= sixMonthsAgo) {
            const monthKey = getMonthYearString(prDate);
            const entry = activityMap.get(monthKey);
            if (entry) {
              entry.prs += 1;
            }
          }
        }
      }
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status !== 409) {
        console.error(`Error fetching PRs for ${repo.name}:`, error);
      }
    }

    // Fetch all issues (both open and closed)
    try {
      let allIssues: Array<{
        created_at: string | null;
        pull_request?: unknown;
        [key: string]: unknown;
      }> = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { data: issues } = await octokit.issues.listForRepo({
          owner: repo.owner.login,
          repo: repo.name,
          state: "all",
          per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
          page,
        });

        if (issues.length === 0) {
          hasMore = false;
        } else {
          // Filter out PRs (issues endpoint returns both issues and PRs)
          const issuesOnly = issues.filter((issue) => !issue.pull_request);
          allIssues = allIssues.concat(issuesOnly);
          page++;
        }
      }

      for (const issue of allIssues) {
        if (issue.created_at) {
          const issueDate = new Date(issue.created_at);
          if (issueDate >= sixMonthsAgo) {
            const monthKey = getMonthYearString(issueDate);
            const entry = activityMap.get(monthKey);
            if (entry) {
              entry.issues += 1;
            }
          }
        }
      }
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status !== 409) {
        console.error(`Error fetching issues for ${repo.name}:`, error);
      }
    }
  }

  // Convert map to array
  return Array.from(activityMap.values());
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
      const contributors = Array.isArray(data) ? data : [];

      contributors.forEach((contributor) => {
        if (contributor.login) {
          contributorSet.add(contributor.login);
        }
      });
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status !== 409) {
        console.error(`Error fetching contributors for ${repo.name}:`, error);
      }
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

    const [totalContributors, totalPRsMerged, activityData] = await Promise.all([
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
      activityData,
      updatedAt: new Date(),
    };

    return stats;
  } catch (error) {
    console.error("Error calculating org stats:", error);
    throw error;
  }
}
