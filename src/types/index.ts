/**
 * Centralized type definitions
 */

export type ProjectStatus = "Active" | "Dormant" | "Archived";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type TeamRole =
  | "Lead Coordinator"
  | "Technical Coordinator"
  | "Community Manager"
  | "Documentation Lead"
  | "Project Liaison"
  | "Faculty Trustee";

export interface ProjectRepository {
  name: string;
  url: string;
  description: string;
  role: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectContributor {
  name: string;
  role: string;
  githubUrl?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  stack: string[];
  repositories: ProjectRepository[];
  links: ProjectLink[];
  problemStatement: string;
  scope: string[];
  goals: string[];
  impact: string[];
  roadmap: string[];
  contributors: ProjectContributor[];
  featured: boolean;
}

export interface Contributor {
  id: string;
  githubUsername: string;
  username: string;
  name: string;
  avatarUrl: string;
  githubUrl: string;
  points: number;
  totalPoints: number;
  prsMerged: number;
  totalPRs: number;
  projectsContributed: string[];
  projectsContributedTo: string[];
  contributions: Contribution[];
  updatedAt: Date;
}

export interface Contribution {
  repo: string;
  prNumber: number;
  points: number;
  mergedAt: Date;
}

export interface OrgStats {
  totalProjects: number;
  totalContributors: number;
  totalPRsMerged: number;
  totalPRs: number;
  totalStars: number;
  activeMaintainers: number;
  projectsByStatus: {
    active: number;
    dormant: number;
    archived: number;
  };
  activityData: ActivityData[];
  updatedAt: Date;
}

export interface ActivityDataPoint {
  month: string;
  contributions: number;
}

export interface ActivityData {
  month: string;
  commits: number;
  prs: number;
  issues: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  maxParticipants?: number;
  registrationUrl?: string;
  leaderboardUrl?: string;
  tags?: string[];
  status?: "upcoming" | "ongoing" | "past";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  batch?: string;
  avatarUrl?: string;
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  bio?: string;
  expertise?: string[];
}

export interface Research {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  conference?: string;
  pdfUrl?: string;
  doi?: string;
  githubUrl?: string;
  tags?: string[];
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}
