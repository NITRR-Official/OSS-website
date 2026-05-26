import dbConnect from "@/lib/db/mongodb";
import { octokit } from "@/lib/github/client";
import { SITE_CONFIG, GITHUB_CONFIG } from "@/lib/constants";
import User from "@/lib/db/models/User";
import ReputationContribution from "@/lib/db/models/ReputationContribution";
import SyncState from "@/lib/db/models/SyncState";
import { LEADERBOARD_CONFIG } from "./config";
import { parseContributionLabels } from "./labels";
import { calculateContributionScore, getBaseScore, getStreakBonusPercent } from "./scoring";
import { formatMonthKey, getWeekStart, isConsecutiveWeek } from "./streaks";
import { ContributionCategory, ContributionType } from "@/types";

interface SyncSummary {
  processed: number;
  skipped: number;
  reviewsProcessed: number;
  usersUpdated: number;
}

interface SyncOptions {
  fullSync?: boolean;
  since?: Date;
  repoVisibility?: "public" | "all";
}

function getDefaultBreakdown() {
  return {
    frontend: 0,
    backend: 0,
    infra: 0,
    docs: 0,
    reviews: 0,
    design: 0,
    other: 0,
  } as const;
}

async function fetchUserProfile(username: string) {
  try {
    const { data } = await octokit.users.getByUsername({ username });
    return {
      displayName: data.name || username,
      avatarUrl: data.avatar_url,
    };
  } catch {
    return {
      displayName: username,
      avatarUrl: `https://github.com/${username}.png`,
    };
  }
}

function resolveCategory(contributionType: ContributionType, category: ContributionCategory) {
  if (contributionType === "review_contribution") {
    return "reviews" as const;
  }
  return category;
}

async function upsertUser({
  githubId,
  username,
  isMaintainer,
  monthKey,
}: {
  githubId: number;
  username: string;
  isMaintainer: boolean;
  monthKey: string;
}) {
  const existing = await User.findOne({ githubId });

  if (existing) {
    if (isMaintainer && !existing.isMaintainer) {
      existing.isMaintainer = true;
      await existing.save();
    }
    return existing;
  }

  const profile = await fetchUserProfile(username);
  const created = await User.create({
    githubId,
    username,
    avatarUrl: profile.avatarUrl,
    displayName: profile.displayName,
    isMaintainer,
    totalReputation: 0,
    monthlyReputation: 0,
    monthlyReputationMonth: monthKey,
    currentStreak: 0,
    contributionBreakdown: getDefaultBreakdown(),
  });

  return created;
}

async function applyContributionToUser({
  userId,
  mergedAt,
  totalScore,
  meaningful,
  category,
}: {
  userId: string;
  mergedAt: Date;
  totalScore: number;
  meaningful: boolean;
  category: ContributionCategory;
}) {
  const user = await User.findById(userId);
  if (!user) return null;

  const monthKey = formatMonthKey(mergedAt);
  let monthlyReputation = user.monthlyReputation;
  if (user.monthlyReputationMonth !== monthKey) {
    monthlyReputation = 0;
  }

  let currentStreak = user.currentStreak;
  let lastWeekStart = user.lastContributionWeekStart;
  const contributionWeekStart = getWeekStart(mergedAt);

  if (meaningful) {
    if (!lastWeekStart) {
      currentStreak = 1;
      lastWeekStart = contributionWeekStart;
    } else if (isConsecutiveWeek(contributionWeekStart, lastWeekStart)) {
      currentStreak += 1;
      lastWeekStart = contributionWeekStart;
    } else if (!lastWeekStart || contributionWeekStart > lastWeekStart) {
      currentStreak = 1;
      lastWeekStart = contributionWeekStart;
    }
  }

  const breakdown = user.contributionBreakdown || getDefaultBreakdown();
  breakdown[category] = (breakdown[category] || 0) + totalScore;

  user.totalReputation += totalScore;
  user.monthlyReputation = monthlyReputation + totalScore;
  user.monthlyReputationMonth = monthKey;
  user.currentStreak = currentStreak;
  user.lastContributionWeekStart = lastWeekStart || user.lastContributionWeekStart;
  user.contributionBreakdown = breakdown;

  await user.save();
  return user;
}

async function processReviewContributions({
  repoOwner,
  repoName,
  prId,
  prNumber,
  mergedAt,
  labels,
  authorLogin,
  maintainers,
}: {
  repoOwner: string;
  repoName: string;
  prId: number;
  prNumber: number;
  mergedAt: Date;
  labels: string[];
  authorLogin: string;
  maintainers: Set<string>;
}) {
  const { data: reviews } = await octokit.pulls.listReviews({
    owner: repoOwner,
    repo: repoName,
    pull_number: prNumber,
    per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
  });

  let reviewsProcessed = 0;

  for (const review of reviews) {
    if (!review.user || !review.submitted_at) continue;
    if (
      !LEADERBOARD_CONFIG.REVIEW_STATES.includes(
        review.state as (typeof LEADERBOARD_CONFIG.REVIEW_STATES)[number]
      )
    )
      continue;

    const reviewerLogin = review.user.login.toLowerCase();
    if (reviewerLogin === authorLogin.toLowerCase()) continue;
    if (maintainers.has(reviewerLogin)) continue;

    const githubContributionId = `review:${review.id}`;

    const existing = await ReputationContribution.findOne({ githubContributionId });
    if (existing) continue;

    const user = await upsertUser({
      githubId: review.user.id,
      username: review.user.login,
      isMaintainer: false,
      monthKey: formatMonthKey(mergedAt),
    });

    const parsed = parseContributionLabels(labels);
    const score = calculateContributionScore({
      contributionType: "review_contribution",
      difficulty: parsed.difficulty,
      impact: parsed.impact,
      exceptional: parsed.exceptional,
    });

    const meaningful = score.finalScore >= LEADERBOARD_CONFIG.MEANINGFUL_SCORE_THRESHOLD;
    const streakBonusPercent = meaningful ? getStreakBonusPercent(user.currentStreak) : 0;
    const seasonalBonusPercent = LEADERBOARD_CONFIG.SEASONAL_BONUS_PERCENT;
    const bonusScore = Math.round(score.finalScore * (streakBonusPercent + seasonalBonusPercent));
    const totalScore = score.finalScore + bonusScore;

    await ReputationContribution.create({
      githubContributionId,
      githubPrId: prId,
      githubReviewId: review.id,
      githubRepo: repoName,
      userId: user._id.toString(),
      contributionType: "review_contribution",
      difficulty: parsed.difficulty,
      impact: parsed.impact,
      exceptional: parsed.exceptional,
      finalScore: totalScore,
      mergedAt,
      metadata: {
        baseScore: getBaseScore("review_contribution"),
        multipliers: score,
        bonusScore,
        streakBonusPercent,
        seasonalBonusPercent,
        reviewState: review.state,
      },
    });

    await applyContributionToUser({
      userId: user._id.toString(),
      mergedAt,
      totalScore,
      meaningful,
      category: resolveCategory("review_contribution", parsed.category),
    });

    reviewsProcessed += 1;
  }

  return reviewsProcessed;
}

async function processPullRequests({
  repoOwner,
  repoName,
  since,
  maintainers,
}: {
  repoOwner: string;
  repoName: string;
  since: Date;
  maintainers: Set<string>;
}) {
  let page = 1;
  let processed = 0;
  let skipped = 0;
  let reviewsProcessed = 0;
  let usersUpdated = 0;
  let maxProcessedPrId = 0;
  let shouldContinue = true;

  while (shouldContinue) {
    const { data: prs } = await octokit.pulls.list({
      owner: repoOwner,
      repo: repoName,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
      page,
    });

    if (prs.length === 0) break;

    for (const pr of prs) {
      if (!pr.updated_at || new Date(pr.updated_at) < since) {
        shouldContinue = false;
        break;
      }

      if (!pr.merged_at || !pr.user) {
        skipped += 1;
        continue;
      }

      const githubContributionId = `pr:${pr.id}`;
      const existing = await ReputationContribution.findOne({ githubContributionId });
      if (existing) {
        skipped += 1;
        continue;
      }

      const authorLogin = pr.user.login.toLowerCase();
      if (maintainers.has(authorLogin)) {
        await upsertUser({
          githubId: pr.user.id,
          username: pr.user.login,
          isMaintainer: true,
          monthKey: formatMonthKey(new Date(pr.merged_at)),
        });
        skipped += 1;
        continue;
      }

      const labels = pr.labels.map((label) =>
        typeof label === "string" ? label : label.name || ""
      );
      const parsed = parseContributionLabels(labels);
      const score = calculateContributionScore({
        contributionType: parsed.contributionType,
        difficulty: parsed.difficulty,
        impact: parsed.impact,
        exceptional: parsed.exceptional,
      });

      const mergedAt = new Date(pr.merged_at);
      const monthKey = formatMonthKey(mergedAt);
      const user = await upsertUser({
        githubId: pr.user.id,
        username: pr.user.login,
        isMaintainer: false,
        monthKey,
      });

      const meaningful = score.finalScore >= LEADERBOARD_CONFIG.MEANINGFUL_SCORE_THRESHOLD;
      const streakBonusPercent = meaningful ? getStreakBonusPercent(user.currentStreak) : 0;
      const seasonalBonusPercent = LEADERBOARD_CONFIG.SEASONAL_BONUS_PERCENT;
      const bonusScore = Math.round(score.finalScore * (streakBonusPercent + seasonalBonusPercent));
      const totalScore = score.finalScore + bonusScore;

      await ReputationContribution.create({
        githubContributionId,
        githubPrId: pr.id,
        githubRepo: repoName,
        userId: user._id.toString(),
        contributionType: parsed.contributionType,
        difficulty: parsed.difficulty,
        impact: parsed.impact,
        exceptional: parsed.exceptional,
        finalScore: totalScore,
        mergedAt,
        metadata: {
          prNumber: pr.number,
          prTitle: pr.title,
          prUrl: pr.html_url,
          labels,
          baseScore: getBaseScore(parsed.contributionType),
          multipliers: score,
          bonusScore,
          streakBonusPercent,
          seasonalBonusPercent,
        },
      });

      await applyContributionToUser({
        userId: user._id.toString(),
        mergedAt,
        totalScore,
        meaningful,
        category: resolveCategory(parsed.contributionType, parsed.category),
      });

      usersUpdated += 1;
      processed += 1;
      maxProcessedPrId = Math.max(maxProcessedPrId, pr.id);

      try {
        reviewsProcessed += await processReviewContributions({
          repoOwner,
          repoName,
          prId: pr.id,
          prNumber: pr.number,
          mergedAt,
          labels,
          authorLogin: pr.user.login,
          maintainers,
        });
      } catch (error) {
        console.error(`Failed to process reviews for ${repoName}#${pr.number}:`, error);
      }
    }

    page += 1;
  }

  return { processed, skipped, reviewsProcessed, usersUpdated, maxProcessedPrId };
}

async function fetchOrgRepos(visibility: "public" | "all") {
  let page = 1;
  const repos = [] as Array<{ name: string; owner?: { login?: string } }>;

  while (true) {
    const { data } = await octokit.repos.listForOrg({
      org: SITE_CONFIG.orgName,
      type: visibility,
      per_page: GITHUB_CONFIG.PAGINATION_LIMIT,
      page,
    });

    if (data.length === 0) break;
    repos.push(...data);
    page += 1;
  }

  return repos;
}

export async function syncLeaderboard(options: SyncOptions = {}): Promise<SyncSummary> {
  await dbConnect();

  const maintainers = await (async () => {
    const { getMaintainerUsernames } = await import("./maintainers");
    return getMaintainerUsernames();
  })();

  if (maintainers.size > 0) {
    await User.updateMany(
      { username: { $in: Array.from(maintainers) } },
      { $set: { isMaintainer: true } },
      { collation: { locale: "en", strength: 2 } }
    );
  }

  const syncState = await SyncState.findOne({ key: "leaderboard" });
  const lastSyncedAt = syncState?.lastSyncedAt || new Date(0);
  const effectiveSince = options.fullSync ? new Date(0) : options.since || lastSyncedAt;
  const visibility = options.repoVisibility || "public";

  const repos = await fetchOrgRepos(visibility);

  let processed = 0;
  let skipped = 0;
  let reviewsProcessed = 0;
  let usersUpdated = 0;
  let maxProcessedPrId = 0;

  for (const repo of repos) {
    const repoOwner = repo.owner?.login;
    if (!repoOwner) continue;

    const result = await processPullRequests({
      repoOwner,
      repoName: repo.name,
      since: effectiveSince,
      maintainers,
    });

    processed += result.processed;
    skipped += result.skipped;
    reviewsProcessed += result.reviewsProcessed;
    usersUpdated += result.usersUpdated;
    maxProcessedPrId = Math.max(maxProcessedPrId, result.maxProcessedPrId || 0);
  }

  await SyncState.updateOne(
    { key: "leaderboard" },
    {
      $set: {
        lastSyncedAt: new Date(),
        lastProcessedEventId: maxProcessedPrId || undefined,
      },
    },
    { upsert: true }
  );

  return { processed, skipped, reviewsProcessed, usersUpdated };
}
