import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/layout/Container";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { ExternalLink } from "lucide-react";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Container className="py-12">
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline">{project.status}</Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-lg text-muted-foreground">{project.tagline}</p>
        <p className="mt-4 text-sm text-muted-foreground max-w-3xl">{project.description}</p>
        {project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <Button key={link.url} variant="outline" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3">Problem Statement</h2>
          <p className="text-sm text-muted-foreground">{project.problemStatement}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Core Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Scope</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {project.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Goals</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {project.goals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Impact</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {project.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Roadmap</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {project.roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Repositories</h2>
          <Badge variant="outline">{project.repositories.length} total</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {project.repositories.map((repo) => (
            <Card key={repo.name} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{repo.name}</h3>
                  <p className="text-sm text-muted-foreground">{repo.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs uppercase">
                  {repo.role}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  View Repository
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {project.contributors.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Contributors</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {project.contributors.map((contributor) => (
              <Card key={`${contributor.name}-${contributor.role}`} className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{contributor.name}</p>
                    <p className="text-xs text-muted-foreground">{contributor.role}</p>
                  </div>
                  {contributor.githubUrl ? (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={contributor.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">No profile</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Button asChild variant="outline">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    </Container>
  );
}
