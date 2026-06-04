import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { ReputationUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

async function getLeaderboard(
  period: "all" | "month",
  role: "community" | "maintainer" = "community"
): Promise<ReputationUser[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/leaderboard?period=${period}&role=${role}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch leaderboard:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

function LeaderboardLoading() {
  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default async function LeaderboardPage() {
  const [allTime, monthly, maintainersAllTime, maintainersMonthly] = await Promise.all([
    getLeaderboard("all", "community"),
    getLeaderboard("month", "community"),
    getLeaderboard("all", "maintainer"),
    getLeaderboard("month", "maintainer"),
  ]);

  return (
    <Suspense fallback={<LeaderboardLoading />}>
      <div className="py-12">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Leaderboard</h1>
            <p className="text-lg text-muted-foreground">
              Meaningful contributions ranked by reputation and sustained impact
            </p>
          </div>

          {allTime.length === 0 && maintainersAllTime.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No contributors found. Start contributing to see your name here!
              </p>
            </div>
          ) : (
            <LeaderboardTable
              allTime={allTime}
              monthly={monthly}
              maintainersAllTime={maintainersAllTime}
              maintainersMonthly={maintainersMonthly}
            />
          )}

          <div className="mt-8 space-y-4">
            <div className="p-6 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">How Points Work</h3>
                <a
                  href="https://github.com/NITRR-Official/Help-and-Resources/blob/main/scoring.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Read full scoring guide →
                </a>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Base scores are weighted by difficulty, impact, and exceptional labels.</li>
                <li>• Reviews, docs, and design contributions have their own base values.</li>
                <li>• Weekly streaks add bonus reputation for consistent, meaningful work.</li>
                <li>• Maintainers and Core Team members are tracked on a separate tab.</li>
              </ul>
            </div>

            <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Updated hourly</span> — The leaderboard syncs every
                hour with the latest contributions from GitHub.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </Suspense>
  );
}
