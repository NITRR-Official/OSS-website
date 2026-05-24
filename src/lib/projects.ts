import projectsData from "@/data/projects.json";
import { Project } from "@/types";

const projects = projectsData as Project[];

export function getProjects() {
  return projects;
}

export function getFeaturedProjects() {
  const featured = projects.filter((project) => project.featured);
  return featured.length > 0 ? featured : projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs() {
  return projects.map((project) => project.slug);
}
