import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Contributor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

async function getLeaderboard(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/leaderboard`,
      {
        next: { revalidate: 0 }, // Always fetch fresh in dev
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
  const contributors = await getLeaderboard();

  return (
    <Suspense fallback={<LeaderboardLoading />}>
      <div className="py-12">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Leaderboard</h1>
            <p className="text-lg text-muted-foreground">
              Top contributors ranked by points earned from merged pull requests
            </p>
          </div>

          {contributors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No contributors found. Start contributing to see your name here!
              </p>
            </div>
          ) : (
            <LeaderboardTable contributors={contributors} />
          )}

          <div className="mt-8 p-6 rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">How Points Work</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Easy PRs: 10 points</li>
              <li>• Medium PRs: 20 points</li>
              <li>• Hard PRs: 30 points</li>
              <li>• PRs without difficulty labels: 10 points (default)</li>
            </ul>
          </div>
        </Container>
      </div>
    </Suspense>
  );
}
