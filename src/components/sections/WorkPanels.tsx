import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectScene } from "@/components/thumbs/ProjectScene";

type FeaturedProject = Pick<ProjectMeta, "slug" | "title" | "hook" | "year" | "fact" | "stack">;

/**
 * The featured work: each project's animated scene, large, with its caption beside it. Scene and
 * caption swap sides from one project to the next, so no two neighbours share a layout.
 */
export function WorkPanels({ projects }: { projects: FeaturedProject[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="px-margin pt-section">
      <h2 id="work-heading" className="display mb-[clamp(56px,6vw,112px)] text-head font-medium">
        Selected work
      </h2>
      <div className="space-y-[clamp(88px,10vw,180px)]">
        {projects.map((project, i) => {
          const flip = i % 2 === 1;
          const href = `/projects/${project.slug}`;
          return (
            <Reveal key={project.slug} className="group lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
              <Link
                href={href}
                tabIndex={-1}
                aria-hidden
                className={`block overflow-hidden lg:col-span-7 lg:row-start-1 ${flip ? "lg:col-start-6" : "lg:col-start-1"}`}
              >
                <div data-reveal="shutter" className="relative overflow-hidden bg-surface">
                  <div className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.02]">
                    <ProjectScene slug={project.slug} />
                  </div>
                </div>
              </Link>
              <div className={`mt-6 lg:col-span-4 lg:row-start-1 lg:mt-0 ${flip ? "lg:col-start-1" : "lg:col-start-9"}`}>
                <h3
                  data-reveal
                  style={{ "--i": 2 } as React.CSSProperties}
                  className="text-lead leading-tight font-medium tracking-[-0.015em] [text-wrap:balance]"
                >
                  <Link href={href} className="link">
                    {project.title}
                  </Link>
                </h3>
                <p data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-4 max-w-[38ch]">
                  {project.hook}
                </p>
                <p data-reveal style={{ "--i": 4 } as React.CSSProperties} className="tabular mt-3 text-small text-muted">
                  {project.year}, {project.fact}. {project.stack.slice(0, 4).join(", ")}.
                </p>
                <Link
                  href={href}
                  data-reveal
                  style={{ "--i": 5 } as React.CSSProperties}
                  className="link mt-6 inline-block"
                >
                  Read the case study
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
