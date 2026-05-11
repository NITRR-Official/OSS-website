import { octokit } from "./client";
import { SITE_CONFIG, PROJECT_STATUS, DIFFICULTY_LEVELS } from "../constants";
import { Project } from "@/types";

/**
 * Fetch all repositories from the organization
 */
export async function fetchOrgRepos() {
  try {
    const { data: repos } = await octokit.repos.listForOrg({
      org: SITE_CONFIG.orgName,
      type: "public",
      sort: "updated",
      per_page: 100,
    });

    return repos;
  } catch (error) {
    console.error("Error fetching organization repos:", error);
    throw error;
  }
}

/**
 * Fetch languages for a repository
 */
export async function fetchRepoLanguages(owner: string, repo: string) {
  try {
    const { data } = await octokit.repos.listLanguages({
      owner,
      repo,
    });

    return Object.keys(data);
  } catch (error) {
    console.error(`Error fetching languages for ${repo}:`, error);
    return [];
  }
}

/**
 * Determine project status based on last update
 */
function determineProjectStatus(updatedAt: string): Project["status"] {
  const lastUpdate = new Date(updatedAt);
  const now = new Date();
  const monthsSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsSinceUpdate < 3) {
    return PROJECT_STATUS.ACTIVE;
  } else if (monthsSinceUpdate < 12) {
    return PROJECT_STATUS.DORMANT;
  } else {
    return PROJECT_STATUS.ARCHIVED;
  }
}

/**
 * Determine difficulty level based on repo characteristics
 */
function determineDifficulty(
  openIssues: number,
  stars: number,
  languages: string[]
): Project["difficulty"] {
  // Simple heuristic - can be customized
  const complexLanguages = ["Rust", "C++", "Go", "Scala"];
  const hasComplexLanguage = languages.some((lang) => complexLanguages.includes(lang));

  if (hasComplexLanguage || stars > 100 || openIssues > 50) {
    return DIFFICULTY_LEVELS.HARD;
  } else if (stars > 20 || openIssues > 10) {
    return DIFFICULTY_LEVELS.MEDIUM;
  } else {
    return DIFFICULTY_LEVELS.EASY;
  }
}

/**
 * Fetch maintainers from MAINTAINERS.md or repository collaborators
 */
async function fetchMaintainers(owner: string, repo: string): Promise<string[]> {
  try {
    // Try to fetch MAINTAINERS.md file
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: "MAINTAINERS.md",
    });

    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString();
      // Extract GitHub usernames (assuming format: @username or github.com/username)
      const usernames = content.match(/@([a-zA-Z0-9-]+)/g);
      if (usernames) {
        return usernames.map((u) => u.substring(1));
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // MAINTAINERS.md doesn't exist, fall back to collaborators
  }

  try {
    const { data: collaborators } = await octokit.repos.listCollaborators({
      owner,
      repo,
      per_page: 10,
    });

    return collaborators.map((c) => c.login);
  } catch (error: unknown) {
    console.error(`Error fetching maintainers for ${repo}:`, error);
    return [];
  }
}

/**
 * Transform GitHub repo data to Project type
 */
async function transformRepoToProject(repo: Record<string, unknown>): Promise<Omit<Project, "id">> {
  const owner = (repo.owner as { login: string }).login;
  const name = repo.name as string;
  const languages = await fetchRepoLanguages(owner, name);
  const maintainers = await fetchMaintainers(owner, name);
  const status = determineProjectStatus(repo.updated_at as string);
  const difficulty = determineDifficulty(
    repo.open_issues_count as number,
    repo.stargazers_count as number,
    languages
  );

  return {
    name: name,
    description: (repo.description as string) || "No description provided",
    url: repo.html_url as string,
    githubUrl: repo.html_url as string,
    stars: repo.stargazers_count as number,
    forks: repo.forks_count as number,
    openIssues: repo.open_issues_count as number,
    languages,
    maintainers,
    status,
    difficulty,
    updatedAt: new Date(repo.updated_at as string),
    cachedAt: new Date(),
  };
}

/**
 * Fetch all projects with complete information
 */
export async function fetchAllProjects(): Promise<Omit<Project, "id">[]> {
  try {
    const repos = await fetchOrgRepos();

    // Transform repos to projects with additional data
    const projects = await Promise.all(repos.map((repo) => transformRepoToProject(repo)));

    return projects;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    throw error;
  }
}
