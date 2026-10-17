import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{project.title}</h1>
        <p>{project.summary}</p>
        <p className="text-sm opacity-70">{project.stack.join(" · ")}</p>
        {project.repo && (
          <a href={project.repo} className="underline">
            Source on GitHub
          </a>
        )}
      </header>
      <article className="space-y-4">
        <MDXRemote source={project.body} />
      </article>
    </main>
  );
}
