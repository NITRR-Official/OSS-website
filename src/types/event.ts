export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "past";
  participatingProjects: string[];
  registrationLink: string | null;
  prizes: string[] | null;
  stats?: {
    totalContributors: number;
    totalPRs: number;
    topContributor: string;
  };
}
