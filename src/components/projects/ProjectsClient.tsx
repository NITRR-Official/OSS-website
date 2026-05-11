"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/layout/Container";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { Project } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");

  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    projects.forEach((project) => {
      project.languages.forEach((lang) => languages.add(lang));
    });
    return Array.from(languages).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        search === "" ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || project.status === statusFilter;

      const matchesDifficulty =
        difficultyFilter === "all" || project.difficulty === difficultyFilter;

      const matchesLanguage =
        languageFilter === "all" || project.languages.includes(languageFilter);

      return matchesSearch && matchesStatus && matchesDifficulty && matchesLanguage;
    });
  }, [projects, search, statusFilter, difficultyFilter, languageFilter]);

  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h1>
          <p className="text-lg text-muted-foreground">
            Explore our open-source projects and start contributing
          </p>
        </div>

        <div className="mb-8">
          <ProjectFilters
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onDifficultyChange={setDifficultyFilter}
            onLanguageChange={setLanguageFilter}
            availableLanguages={availableLanguages}
          />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No projects found matching your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.githubUrl} project={project} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </Container>
    </div>
  );
}

export function ProjectsLoading() {
  return (
    <div className="py-12">
      <Container>
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </Container>
    </div>
  );
}
