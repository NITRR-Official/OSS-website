import { octokit } from "./client";
import { SITE_CONFIG } from "../constants";
import { calculatePoints } from "../utils/points";
import { Contributor, Contribution } from "@/types";

/**
 * Fetch contributors for a specific repository
 */
export async function fetchRepoContributors(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
    });

    return data;
  } catch (error) {
    console.error(`Error fetching contributors for ${repo}:`, error);
    return [];
  }
}

/**
 * Fetch merged pull requests for a repository
 */
export async function fetchMergedPRs(owner: string, repo: string) {
  try {
    const { data } = await octokit.pulls.list({
      owner,
      repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 100,
    });

    // Filter only merged PRs
    const mergedPRs = data.filter((pr) => pr.merged_at);

    return mergedPRs;
  } catch (error) {
    console.error(`Error fetching PRs for ${repo}:`, error);
    return [];
  }
}

/**
 * Fetch all repositories from the organization
 */
async function fetchAllOrgRepos() {
  try {
    const { data } = await octokit.repos.listForOrg({
      org: SITE_CONFIG.orgName,
      type: "public",
      per_page: 100,
    });

    return data;
  } catch (error) {
    console.error("Error fetching org repos:", error);
    return [];
  }
}

/**
 * Build contribution data from merged PRs
 */
async function buildContributionData(
  owner: string,
  repo: string
): Promise<Map<string, Contribution[]>> {
  const prs = await fetchMergedPRs(owner, repo);
  const contributionMap = new Map<string, Contribution[]>();

  for (const pr of prs) {
    if (!pr.user || !pr.merged_at) continue;

    const username = pr.user.login;
    const labels = pr.labels.map((label) => (typeof label === "string" ? label : label.name || ""));
    const points = calculatePoints(labels);

    const contribution: Contribution = {
      repo,
      prNumber: pr.number,
      points,
      mergedAt: new Date(pr.merged_at),
    };

    if (!contributionMap.has(username)) {
      contributionMap.set(username, []);
    }

    contributionMap.get(username)!.push(contribution);
  }

  return contributionMap;
}

/**
 * Fetch user details from GitHub
 */
async function fetchUserDetails(username: string) {
  try {
    const { data } = await octokit.users.getByUsername({
      username,
    });

    return {
      name: data.name || username,
      avatarUrl: data.avatar_url,
    };
  } catch (error) {
    console.error(`Error fetching user details for ${username}:`, error);
    return {
      name: username,
      avatarUrl: `https://github.com/${username}.png`,
    };
  }
}

/**
 * Fetch all contributors across all organization repositories
 */
export async function fetchAllContributors(): Promise<Omit<Contributor, "id">[]> {
  try {
    const repos = await fetchAllOrgRepos();
    const contributorMap = new Map<string, Omit<Contributor, "id">>();

    // Process each repository
    for (const repo of repos) {
      const contributionData = await buildContributionData(repo.owner.login, repo.name);

      // Aggregate contributions per user
      for (const [username, contributions] of contributionData.entries()) {
        if (!contributorMap.has(username)) {
          const userDetails = await fetchUserDetails(username);

          contributorMap.set(username, {
            githubUsername: username,
            username: username,
            name: userDetails.name,
            avatarUrl: userDetails.avatarUrl,
            githubUrl: `https://github.com/${username}`,
            points: 0,
            totalPoints: 0,
            prsMerged: 0,
            totalPRs: 0,
            projectsContributed: [],
            projectsContributedTo: [],
            contributions: [],
            updatedAt: new Date(),
          });
        }

        const contributor = contributorMap.get(username)!;

        // Add contributions
        contributor.contributions.push(...contributions);

        // Update stats
        contributor.prsMerged += contributions.length;
        contributor.totalPRs += contributions.length;
        contributor.points += contributions.reduce((sum, c) => sum + c.points, 0);
        contributor.totalPoints += contributions.reduce((sum, c) => sum + c.points, 0);

        // Add project if not already included
        if (!contributor.projectsContributed.includes(repo.name)) {
          contributor.projectsContributed.push(repo.name);
        }
        if (!contributor.projectsContributedTo.includes(repo.name)) {
          contributor.projectsContributedTo.push(repo.name);
        }
      }
    }

    return Array.from(contributorMap.values());
  } catch (error) {
    console.error("Error fetching all contributors:", error);
    throw error;
  }
}

/**
 * Fetch contributors for leaderboard (sorted by points)
 */
export async function fetchLeaderboard(limit = 100) {
  try {
    const contributors = await fetchAllContributors();

    // Sort by points descending
    const sorted = contributors.sort((a, b) => b.points - a.points);

    return sorted.slice(0, limit);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}
