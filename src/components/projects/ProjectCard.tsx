import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { Star, GitFork, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    Active: "bg-green-500/10 text-green-600 border-green-500/20",
    Dormant: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  };

  const difficultyColors = {
    Easy: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    Hard: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={statusColors[project.status]}>
            {project.status}
          </Badge>
          <Badge variant="outline" className={difficultyColors[project.difficulty]}>
            {project.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.languages.slice(0, 3).map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">
              {lang}
            </Badge>
          ))}
          {project.languages.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.languages.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {project.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              {project.forks}
            </span>
            {project.openIssues > 0 && (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {project.openIssues}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {project.maintainers && project.maintainers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Maintainers:</p>
            <div className="flex flex-wrap gap-2">
              {project.maintainers.map((maintainer) => (
                <Link
                  key={maintainer}
                  href={`https://github.com/${maintainer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:text-primary transition-colors"
                >
                  @{maintainer}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
