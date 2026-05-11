"use client";

import { Research } from "@/types/research";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Users, Github, FileText } from "lucide-react";
import { format } from "date-fns";

interface ResearchCardProps {
  research: Research;
}

export function ResearchCard({ research }: ResearchCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-3">
          {research.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2">{research.title}</CardTitle>
        <CardDescription className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span className="line-clamp-1">{research.authors.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(research.publishedDate), "MMMM dd, yyyy")}</span>
          </div>
          {research.conference && <div className="text-sm italic">{research.conference}</div>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-4">{research.abstract}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {research.pdfUrl && (
          <Button variant="default" size="sm" asChild>
            <a href={research.pdfUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              Read Paper
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
        {research.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={research.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
        {research.doi && (
          <Button variant="ghost" size="sm" asChild>
            <a href={`https://doi.org/${research.doi}`} target="_blank" rel="noopener noreferrer">
              DOI
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
