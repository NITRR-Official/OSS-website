import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { Star, GitFork, AlertCircle, ExternalLink } from "lucide-react";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const topProjects = projects.sort((a, b) => b.stars - a.stars).slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        <Button variant="outline" asChild>
          <Link href="/projects">View All Projects</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topProjects.map((project) => (
          <Card
            key={project.githubUrl}
            className="flex flex-col p-6 transition-all hover:shadow-lg dark:hover:shadow-primary/10"
          >
            <div className="flex-1">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold leading-tight">{project.name}</h3>
                <Badge
                  variant={
                    project.status === "Active"
                      ? "default"
                      : project.status === "Dormant"
                        ? "secondary"
                        : "outline"
                  }
                  className="ml-2 shrink-0"
                >
                  {project.status}
                </Badge>
              </div>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1">
                {project.languages.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.languages.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.languages.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{project.forks}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{project.openIssues}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                View on GitHub
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
