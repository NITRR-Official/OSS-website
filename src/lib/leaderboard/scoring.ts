import { ContributionType, DifficultyLabel, ImpactLabel } from "@/types";
import { LEADERBOARD_CONFIG } from "./config";

interface ScoreInput {
  contributionType: ContributionType;
  difficulty: DifficultyLabel;
  impact: ImpactLabel;
  exceptional: boolean;
}

export function getBaseScore(contributionType: ContributionType) {
  switch (contributionType) {
    case "documentation":
      return LEADERBOARD_CONFIG.BASE_SCORES.DOCUMENTATION;
    case "design_contribution":
      return LEADERBOARD_CONFIG.BASE_SCORES.DESIGN_CONTRIBUTION;
    case "review_contribution":
      return LEADERBOARD_CONFIG.BASE_SCORES.REVIEW_CONTRIBUTION;
    default:
      return LEADERBOARD_CONFIG.BASE_SCORES.PR_MERGED;
  }
}

export function calculateContributionScore({
  contributionType,
  difficulty,
  impact,
  exceptional,
}: ScoreInput) {
  const baseScore = getBaseScore(contributionType);
  const difficultyMultiplier = LEADERBOARD_CONFIG.DIFFICULTY_MULTIPLIERS[difficulty];
  const impactMultiplier = LEADERBOARD_CONFIG.IMPACT_MULTIPLIERS[impact];
  const exceptionalMultiplier = exceptional ? LEADERBOARD_CONFIG.EXCEPTIONAL_MULTIPLIER : 1;

  const rawScore = baseScore * difficultyMultiplier * impactMultiplier * exceptionalMultiplier;
  const finalScore = Math.round(rawScore);

  return {
    baseScore,
    difficultyMultiplier,
    impactMultiplier,
    exceptionalMultiplier,
    finalScore,
  };
}

export function getStreakBonusPercent(currentStreak: number) {
  if (currentStreak >= 12) {
    return LEADERBOARD_CONFIG.STREAK_BONUSES.twelveWeeks;
  }
  if (currentStreak >= 4) {
    return LEADERBOARD_CONFIG.STREAK_BONUSES.fourWeeks;
  }
  if (currentStreak >= 2) {
    return LEADERBOARD_CONFIG.STREAK_BONUSES.twoWeeks;
  }
  return 0;
}
