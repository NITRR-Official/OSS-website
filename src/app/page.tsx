import Link from "next/link";
import {
  ArrowRight,
  Github,
  Code2,
  Users,
  GitPullRequest,
  Star,
  Rocket,
  Award,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/Container";
import { StatsCard } from "@/components/home/StatsCard";
import { ActivityChart } from "@/components/home/ActivityChart";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/lib/constants";
import { getProjects } from "@/lib/projects";
import { formatNumber } from "@/lib/utils";
import { OrgStats } from "@/types";

async function getStats(): Promise<OrgStats | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/github/stats`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch stats");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export default async function Home() {
  const stats = await getStats();
  const projects = getProjects();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        <AnimatedBackground />
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Target className="mr-1 h-3 w-3" />
              Student-Led Open Source Initiative
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Building Sustainable{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Open Source Projects
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A student-led initiative at NIT Raipur creating multi-year technical projects that
              outlive individual batches. Join us in fostering a real open source culture.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/projects">
                  Explore Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={SITE_CONFIG.links.github} target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-muted/50 py-20">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Our Impact</h2>
            <p className="mt-4 text-muted-foreground">
              Real-time metrics from our GitHub organization
            </p>
          </div>
          {stats ? (
            <>
              <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  icon={Code2}
                  title="Total Repositories"
                  value={formatNumber(stats.totalProjects)}
                  description="Public repos (lifetime)"
                />
                <StatsCard
                  icon={Users}
                  title="Contributors"
                  value={formatNumber(stats.totalContributors)}
                  description="All time contributors"
                />
                <StatsCard
                  icon={GitPullRequest}
                  title="Pull Requests"
                  value={formatNumber(stats.totalPRsMerged)}
                  description="Merged (lifetime)"
                />
                <StatsCard
                  icon={Star}
                  title="Total Stars"
                  value={formatNumber(stats.totalStars)}
                  description="Across all repos"
                />
              </div>

              {stats.activityData && stats.activityData.length > 0 && (
                <ActivityChart data={stats.activityData} />
              )}
            </>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Featured Projects Section */}
      {projects.length > 0 ? (
        <section className="border-t py-20">
          <Container>
            <FeaturedProjects projects={projects} />
          </Container>
        </section>
      ) : (
        <section className="border-t py-20">
          <Container>
            <div className="rounded-lg border border-dashed p-12 text-center">
              <Code2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Projects Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our project registry is being curated.
                <br />
                Check back soon for detailed project pages.
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* Features Section */}
      <section className="border-t py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Join Us?</h2>
            <p className="mt-4 text-muted-foreground">
              Be part of something bigger than individual projects
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Real Projects</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Work on projects that are actually used by students and maintained for years.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Community</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Collaborate with fellow students and learn from experienced maintainers.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Recognition</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Participate in contribution drives and earn recognition on the leaderboard.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20">
        <Container>
          <div className="rounded-lg border bg-card p-8 text-center shadow-lg md:p-12">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Contribute?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start your open source journey today and make an impact
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/contribute">
                  How to Contribute
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
