/**
 * Application-wide constants
 */

const githubOrgName =
  process.env.NEXT_PUBLIC_GITHUB_ORG_NAME || process.env.GITHUB_ORG_NAME || "NITRR-Official";

const githubOrgUrl = `https://github.com/${githubOrgName}`;

export const SITE_CONFIG = {
  name: "NIT Raipur Open Source",
  shortName: "NITRR-OSS",
  description:
    "A student-led initiative at National Institute of Technology Raipur creating sustainable, multi-year technical projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  orgName: githubOrgName,
  links: {
    github: githubOrgUrl,
    discord: "https://discord.gg/UR7j9gQmu",
    email:
      "The email is not currently available please use discord in the meantime or contact any core team member",
  },
} as const;

export const CACHE_DURATIONS = {
  projects: 12 * 60 * 60, // 12 hours in seconds
  contributors: 24 * 60 * 60, // 24 hours
  stats: 12 * 60 * 60, // 12 hours
  leaderboard: 1 * 60 * 60, // 1 hour
} as const;

export const GITHUB_CONFIG = {
  PAGINATION_LIMIT: 100,
  REPO_ACTIVE_MONTHS: 3,
  REPO_DORMANT_MONTHS: 12,
  ACTIVITY_HISTORY_MONTHS: 6,
  USER_AGENT: "NITRR-OSS-Website/1.0.0",
} as const;

export const PROJECT_STATUS = {
  ACTIVE: "Active",
  DORMANT: "Dormant",
  ARCHIVED: "Archived",
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;

export const CONTRIBUTION_POINTS = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  DEFAULT: 10,
} as const;

export const TEAM_ROLES = {
  FOUNDING_MEMBER: "Founding Member",
  LEAD_COORDINATOR: "Lead Coordinator",
  TECHNICAL_COORDINATOR: "Technical Coordinator",
  COMMUNITY_MANAGER: "Community Manager",
  DOCUMENTATION_LEAD: "Documentation Lead",
  PROJECT_LIAISON: "Project Liaison",
  FACULTY_TRUSTEE: "Faculty Trustee",
} as const;
