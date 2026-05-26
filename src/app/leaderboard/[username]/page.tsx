import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import ReputationContribution from "@/lib/db/models/ReputationContribution";

export default async function ContributorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  await dbConnect();
  const { username } = await params;

  const user = await User.findOne({ username }).lean();
  if (!user) {
    notFound();
  }

  const contributions = await ReputationContribution.find({ userId: user._id.toString() })
    .sort({ mergedAt: -1 })
    .limit(30)
    .lean();

  const total = user.totalReputation || 0;
  const breakdown = user.contributionBreakdown || {
    frontend: 0,
    backend: 0,
    infra: 0,
    docs: 0,
    reviews: 0,
    design: 0,
    other: 0,
  };

  const breakdownEntries = Object.entries(breakdown).filter(([, value]) => value > 0);

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatarUrl}
              alt={user.username}
              width={72}
              height={72}
              className="h-18 w-18 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              {user.displayName && <p className="text-muted-foreground">{user.displayName}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="secondary">Reputation {user.totalReputation}</Badge>
                <Badge variant="outline">Monthly {user.monthlyReputation}</Badge>
                <Badge variant="outline">Streak {user.currentStreak}w</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              View GitHub Profile
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Contribution Breakdown</h2>
            {breakdownEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contributions recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {breakdownEntries.map(([key, value]) => {
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize">{key}</span>
                        <span className="text-muted-foreground">{value} pts</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary/40"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reputation Snapshot</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">All-time</span>
                <span className="font-semibold">{user.totalReputation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This month</span>
                <span className="font-semibold">{user.monthlyReputation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Streak</span>
                <span className="font-semibold">{user.currentStreak} weeks</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Contributions</h2>
          {contributions.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">No contribution history available.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {contributions.map((contribution) => (
                <Card key={contribution._id.toString()} className="p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">
                        {((contribution.metadata as Record<string, unknown>)?.prTitle as string) ||
                          "PR"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contribution.githubRepo} ·{" "}
                        {contribution.contributionType.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{contribution.finalScore} pts</Badge>
                      <Badge variant="outline">
                        {contribution.difficulty} · {contribution.impact}
                      </Badge>
                      {typeof (contribution.metadata as Record<string, unknown>)?.prUrl ===
                        "string" && (
                        <Link
                          href={(contribution.metadata as Record<string, unknown>)?.prUrl as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          View PR
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
