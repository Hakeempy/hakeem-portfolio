import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectScene } from "@/components/thumbs/ProjectScene";

export type PrintProject = Pick<ProjectMeta, "slug" | "title" | "hook" | "year" | "fact">;

/**
 * One project as a print: its animated scene, 3:2, with the title, the hook that says why it is
 * worth opening, and the year and fact as the caption beneath.
 */
export function ProjectPrint({
  project,
  headingLevel = "h3",
  showHook = true,
}: {
  project: PrintProject;
  headingLevel?: "h2" | "h3";
  showHook?: boolean;
}) {
  const Heading = headingLevel;
  const href = `/projects/${project.slug}`;

  return (
    <Reveal amount={0.2} className="group">
      {/* The print links too, for the pointer; keyboards reach the project by its title */}
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <div data-reveal="shutter" className="relative overflow-hidden bg-surface">
          <div className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]">
            <ProjectScene slug={project.slug} />
          </div>
        </div>
      </Link>

      <div className="mt-5">
        <Heading
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className={`${showHook ? "text-lead" : "text-body"} leading-tight font-medium tracking-[-0.015em] [text-wrap:balance]`}
        >
          <Link href={href} className="link">
            {project.title}
          </Link>
          <span
            aria-hidden
            className="ml-3 inline-block text-accent opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-100"
          >
            →
          </span>
        </Heading>
        {showHook && (
          <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-3 max-w-[46ch] leading-[1.5]">
            {project.hook}
          </p>
        )}
        <p data-reveal style={{ "--i": 3 } as React.CSSProperties} className="tabular mt-2 text-small text-muted">
          <span>{project.year}</span>
          <span className="ml-4">{project.fact}</span>
        </p>
      </div>
    </Reveal>
  );
}
