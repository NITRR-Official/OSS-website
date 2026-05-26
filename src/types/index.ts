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

export type ContributionType =
  | "pr_merged"
  | "review_contribution"
  | "documentation"
  | "design_contribution";

export type DifficultyLabel = "easy" | "medium" | "hard" | "critical";
export type ImpactLabel = "docs" | "feature" | "infra" | "security";
export type ContributionCategory =
  | "frontend"
  | "backend"
  | "infra"
  | "docs"
  | "reviews"
  | "design"
  | "other";

export interface ContributionBreakdown {
  frontend: number;
  backend: number;
  infra: number;
  docs: number;
  reviews: number;
  design: number;
  other: number;
}

export interface ReputationUser {
  id: string;
  githubId: number;
  username: string;
  displayName?: string;
  avatarUrl: string;
  totalReputation: number;
  monthlyReputation: number;
  monthlyReputationMonth: string;
  currentStreak: number;
  lastContributionWeekStart?: Date;
  isMaintainer: boolean;
  contributionBreakdown: ContributionBreakdown;
  updatedAt: Date;
}

export interface ReputationContribution {
  id: string;
  githubContributionId: string;
  githubPrId: number;
  githubReviewId?: number;
  githubRepo: string;
  userId: string;
  contributionType: ContributionType;
  difficulty: DifficultyLabel;
  impact: ImpactLabel;
  exceptional: boolean;
  finalScore: number;
  mergedAt: Date;
  metadata: Record<string, unknown>;
}

export interface SyncState {
  id: string;
  key: string;
  lastSyncedAt?: Date;
  lastProcessedEventId?: number;
  updatedAt: Date;
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
