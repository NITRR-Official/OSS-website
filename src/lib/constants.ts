/**
 * Application-wide constants
 */

export const SITE_CONFIG = {
  name: "NIT Raipur Open Source",
  shortName: "NITRR-OSS",
  description:
    "A student-led initiative at National Institute of Technology Raipur creating sustainable, multi-year technical projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  orgName: "NITRR-Official", // GitHub organization name
  links: {
    github: "https://github.com/NITRR-Official",
    discord: "https://discord.gg/nitrr-oss",
    email: "opensource@nitrr.ac.in",
  },
} as const;

export const CACHE_DURATIONS = {
  projects: 12 * 60 * 60, // 12 hours in seconds
  contributors: 24 * 60 * 60, // 24 hours
  stats: 6 * 60 * 60, // 6 hours
  leaderboard: 1 * 60 * 60, // 1 hour
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
  MEDIUM: 20,
  HARD: 30,
  DEFAULT: 10,
} as const;

export const TEAM_ROLES = {
  LEAD_COORDINATOR: "Lead Coordinator",
  TECHNICAL_COORDINATOR: "Technical Coordinator",
  COMMUNITY_MANAGER: "Community Manager",
  DOCUMENTATION_LEAD: "Documentation Lead",
  PROJECT_LIAISON: "Project Liaison",
  FACULTY_TRUSTEE: "Faculty Trustee",
} as const;
