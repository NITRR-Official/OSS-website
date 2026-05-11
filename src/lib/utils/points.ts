import { CONTRIBUTION_POINTS } from "../constants";

/**
 * Calculate points based on PR difficulty label
 */
export function calculatePoints(labels: string[]): number {
  const difficultyLabel = labels.find((label) => label.toLowerCase().includes("difficulty"));

  if (!difficultyLabel) {
    return CONTRIBUTION_POINTS.DEFAULT;
  }

  const labelLower = difficultyLabel.toLowerCase();

  if (labelLower.includes("easy")) {
    return CONTRIBUTION_POINTS.EASY;
  }
  if (labelLower.includes("medium")) {
    return CONTRIBUTION_POINTS.MEDIUM;
  }
  if (labelLower.includes("hard")) {
    return CONTRIBUTION_POINTS.HARD;
  }

  return CONTRIBUTION_POINTS.DEFAULT;
}

/**
 * Calculate total points for a contributor
 */
export function calculateTotalPoints(contributions: Array<{ points: number }>): number {
  return contributions.reduce((total, contribution) => total + contribution.points, 0);
}
