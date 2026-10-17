import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-16">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <ul className="space-y-6">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="underline">
              {project.title}
            </Link>
            <p>{project.summary}</p>
            <p className="text-sm opacity-70">{project.stack.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
