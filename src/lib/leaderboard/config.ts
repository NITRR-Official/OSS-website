export const LEADERBOARD_CONFIG = {
  BASE_SCORES: {
    PR_MERGED: 20,
    REVIEW_CONTRIBUTION: 10,
    DOCUMENTATION: 12,
    DESIGN_CONTRIBUTION: 15,
  },
  DIFFICULTY_MULTIPLIERS: {
    easy: 0.8,
    medium: 1.0,
    hard: 1.5,
    critical: 2.5,
  },
  IMPACT_MULTIPLIERS: {
    docs: 1.0,
    feature: 1.2,
    infra: 1.5,
    security: 2.0,
  },
  EXCEPTIONAL_MULTIPLIER: 1.5,
  MEANINGFUL_SCORE_THRESHOLD: 20,
  STREAK_BONUSES: {
    twoWeeks: 0.05,
    fourWeeks: 0.1,
    twelveWeeks: 0.25,
  },
  SEASONAL_BONUS_PERCENT: 0,
  WEEK_STARTS_ON: 1,
  MONTH_KEY_FORMAT: "yyyy-MM",
  REVIEW_STATES: ["APPROVED", "CHANGES_REQUESTED"],
  MAINTAINER_ROLES: ["Maintainer", "Lead", "Founding Member"],
} as const;
