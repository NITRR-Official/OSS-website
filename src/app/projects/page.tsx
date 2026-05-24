import { Suspense } from "react";
import { ProjectsClient, ProjectsLoading } from "@/components/projects/ProjectsClient";
import { getProjects } from "@/lib/projects";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsClient projects={projects} />
    </Suspense>
  );
}
