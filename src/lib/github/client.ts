import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.warn("GITHUB_TOKEN is not set. GitHub API requests will be rate-limited to 60/hour.");
}

/**
 * Octokit client instance for GitHub API
 * Authenticated requests have 5000 requests/hour limit
 * Unauthenticated requests have 60 requests/hour limit
 */
export const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: "NITRR-OSS-Website/1.0.0",
  throttle: {
    onRateLimit: (retryAfter: number, options: Record<string, unknown>) => {
      console.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
      if ((options.request as { retryCount?: number }).retryCount === 0) {
        console.log(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
      return false;
    },
    onSecondaryRateLimit: (retryAfter: number, options: Record<string, unknown>) => {
      console.warn(`Secondary rate limit hit for request ${options.method} ${options.url}`);
      return false;
    },
  },
});

/**
 * Check GitHub API rate limit status
 */
export async function checkRateLimit() {
  try {
    const { data } = await octokit.rateLimit.get();
    return {
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      reset: new Date(data.rate.reset * 1000),
    };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return null;
  }
}
