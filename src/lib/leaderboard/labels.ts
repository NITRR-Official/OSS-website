import { ContributionCategory, ContributionType, DifficultyLabel, ImpactLabel } from "@/types";

const difficultyMap: Record<string, DifficultyLabel> = {
  "difficulty:easy": "easy",
  "difficulty:medium": "medium",
  "difficulty:hard": "hard",
  "difficulty:critical": "critical",
};

const impactMap: Record<string, ImpactLabel> = {
  "type:docs": "docs",
  "type:feature": "feature",
  "type:infra": "infra",
  "type:security": "security",
};

const DESIGN_HINTS = ["design", "ui", "ux", "figma"];
const FRONTEND_HINTS = ["frontend", "ui", "web"];
const BACKEND_HINTS = ["backend", "api", "server"];
const INFRA_HINTS = ["infra", "devops", "ci", "cd", "deployment"];

function normalizeLabels(labels: string[]) {
  return labels.map((label) => label.trim().toLowerCase()).filter((label) => label.length > 0);
}

export function parseContributionLabels(labels: string[]) {
  const normalized = normalizeLabels(labels);

  const difficultyLabel = normalized.find((label) => label.startsWith("difficulty:"));
  const impactLabel = normalized.find((label) => label.startsWith("type:"));

  const difficulty: DifficultyLabel = difficultyLabel
    ? difficultyMap[difficultyLabel] || "medium"
    : "medium";

  const impact: ImpactLabel = impactLabel ? impactMap[impactLabel] || "docs" : "docs";

  const exceptional = normalized.includes("exceptional");
  const isDocs =
    impact === "docs" || normalized.includes("docs") || normalized.includes("documentation");
  const isDesign = DESIGN_HINTS.some((hint) => normalized.some((label) => label.includes(hint)));

  const contributionType: ContributionType = isDocs
    ? "documentation"
    : isDesign
      ? "design_contribution"
      : "pr_merged";

  const category: ContributionCategory = isDocs
    ? "docs"
    : isDesign
      ? "design"
      : INFRA_HINTS.some((hint) => normalized.some((label) => label.includes(hint))) ||
          impact === "infra"
        ? "infra"
        : FRONTEND_HINTS.some((hint) => normalized.some((label) => label.includes(hint)))
          ? "frontend"
          : BACKEND_HINTS.some((hint) => normalized.some((label) => label.includes(hint)))
            ? "backend"
            : "other";

  return {
    difficulty,
    impact,
    exceptional,
    contributionType,
    category,
  };
}
