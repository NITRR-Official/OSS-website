import teamData from "@/data/team.json";
import { TeamMember } from "@/types";
import { LEADERBOARD_CONFIG } from "./config";

function extractUsername(githubUrl?: string) {
  if (!githubUrl) return null;
  const match = githubUrl.match(/github\.com\/([^/]+)/i);
  return match ? match[1] : null;
}

export function getMaintainerUsernames() {
  const maintainers = new Set<string>();

  const envList = process.env.MAINTAINER_USERNAMES || "";
  envList
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((username) => maintainers.add(username.toLowerCase()));

  const team = teamData as TeamMember[];
  team.forEach((member) => {
    if (
      !LEADERBOARD_CONFIG.MAINTAINER_ROLES.includes(
        member.role as (typeof LEADERBOARD_CONFIG.MAINTAINER_ROLES)[number]
      )
    )
      return;
    const username = extractUsername(member.githubUrl);
    if (username) {
      maintainers.add(username.toLowerCase());
    }
  });

  return maintainers;
}
