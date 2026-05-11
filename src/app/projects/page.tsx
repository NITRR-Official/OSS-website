import { Suspense } from "react";
import { Project } from "@/types";
import { ProjectsClient, ProjectsLoading } from "@/components/projects/ProjectsClient";

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/github/projects`,
      {
        next: { revalidate: 0 }, // Always fetch fresh in dev
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsClient projects={projects} />
    </Suspense>
  );
}
