import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectCategory = "data-engineering" | "analytics" | "machine-learning";

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  stack: string[];
  year: number;
  repo?: string;
  demo?: string;
  cover?: string;
  coverAlt?: string;
  /** CSS object-position for the cover's tight crop */
  focus?: string;
  /** One true, short fact shown beside the title */
  fact: string;
  featured: boolean;
  order: number;
};

export type Project = ProjectMeta & { body: string };

function readProject(file: string): Project {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    summary: data.summary,
    category: data.category,
    stack: data.stack ?? [],
    year: data.year,
    repo: data.repo,
    demo: data.demo,
    cover: data.cover,
    coverAlt: data.coverAlt,
    focus: data.focus,
    fact: data.fact ?? "",
    featured: data.featured ?? false,
    order: data.order ?? 999,
    body: content,
  };
}

export function getAllProjects(): Project[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readProject)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getOtherProjects(): Project[] {
  return getAllProjects().filter((project) => !project.featured);
}

export function getProject(slug: string): Project | undefined {
  return getAllProjects().find((project) => project.slug === slug);
}
