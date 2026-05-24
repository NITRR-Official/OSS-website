import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { ArrowRight, GitBranch, Layers } from "lucide-react";
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={statusColors[project.status]}>
            {project.status}
          </Badge>
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.stack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.stack.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.stack.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {project.repositories.length} repos
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              {project.stack.length} tech
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/projects/${project.slug}`}>
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
