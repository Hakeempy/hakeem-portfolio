import Image from "next/image";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";
import { Reveal } from "@/components/motion/Reveal";
import { isLightScreen } from "@/data/screens";

export type PrintProject = Pick<
  ProjectMeta,
  "slug" | "title" | "summary" | "year" | "fact" | "cover" | "coverAlt" | "focus"
>;

/**
 * One project hung as a print: its own screen (or, where there is none, its fact set on a
 * field of the surface tone) with the title, year and fact as the caption beneath.
 */
export function ProjectPrint({
  project,
  aspect,
  sizes,
  headingLevel = "h3",
  showSummary = true,
}: {
  project: PrintProject;
  /** Tailwind aspect-ratio classes for the print */
  aspect: string;
  sizes: string;
  headingLevel?: "h2" | "h3";
  showSummary?: boolean;
}) {
  const Heading = headingLevel;
  const href = `/projects/${project.slug}`;

  return (
    <Reveal amount={0.2} className="group">
      {/* The print links too, for the pointer; keyboards reach the project by its title */}
      <Link href={href} tabIndex={-1} className="block">
        <div data-reveal="shutter" className={`relative overflow-hidden bg-surface ${aspect}`}>
          <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.035]">
            {project.cover ? (
              <Image
                src={project.cover}
                alt={project.coverAlt ?? ""}
                fill
                sizes={sizes}
                className={`object-cover ${isLightScreen(project.cover) ? "lit-light" : ""}`}
                style={{ objectPosition: project.focus }}
              />
            ) : (
              <div className="flex h-full items-end bg-surface-2 p-[clamp(20px,2.4vw,36px)]">
                <p className="display max-w-[14ch] text-lead font-medium">{project.fact}</p>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-5">
        <Heading
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="text-lead leading-tight font-medium tracking-[-0.015em] [text-wrap:balance]"
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
        <p
          data-reveal
          style={{ "--i": 2 } as React.CSSProperties}
          className="tabular mt-2 text-small text-muted"
        >
          <span>{project.year}</span>
          {project.cover && <span className="ml-4">{project.fact}</span>}
        </p>
        {showSummary && (
          <p
            data-reveal
            style={{ "--i": 3 } as React.CSSProperties}
            className="mt-3 max-w-[46ch] leading-[1.5]"
          >
            {project.summary}
          </p>
        )}
      </div>
    </Reveal>
  );
}
