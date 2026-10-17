"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ProjectMeta } from "@/lib/projects";

type PanelProject = Pick<
  ProjectMeta,
  "slug" | "title" | "year" | "fact" | "cover" | "coverAlt" | "focus"
> & { light: boolean };

function Panel({ project }: { project: PanelProject }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // A tight crop that slowly settles as the plate passes, like leaning in to a screen.
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1.3, 1.3] : [1.42, 1.22]);

  return (
    <Link
      ref={ref}
      href={`/projects/${project.slug}`}
      className="group relative block h-[82svh] overflow-hidden bg-surface md:h-svh"
    >
      {project.cover && (
        <motion.div className="absolute inset-0" style={{ scale }}>
          <Image
            src={project.cover}
            alt={project.coverAlt ?? ""}
            fill
            sizes="100vw"
            className={`object-cover transition-[filter] duration-500 ${project.light ? "lit-light" : ""}`}
            style={{ objectPosition: project.focus }}
          />
        </motion.div>
      )}

      {/* The row never moves: on every plate it sits at the same height */}
      <div className="absolute inset-x-0 bottom-5 bg-bg/88 px-margin py-4 md:top-1/2 md:bottom-auto md:flex md:h-[90px] md:-translate-y-1/2 md:items-center md:py-0">
        <h3 className="text-lead leading-tight font-medium tracking-[-0.01em] uppercase md:absolute md:left-[10%]">
          {project.title}
          <span
            aria-hidden
            className="ml-3 inline-block text-accent opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            →
          </span>
        </h3>
        <div className="mt-1 flex justify-between text-small text-muted md:contents">
          <span className="tabular md:absolute md:left-margin">{project.year}</span>
          <span className="md:absolute md:right-margin">{project.fact}</span>
        </div>
      </div>
    </Link>
  );
}

export function WorkPanels({ projects }: { projects: PanelProject[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="relative">
      <h2 id="work-heading" className="sr-only-heading">
        Selected work
      </h2>
      {projects.map((project) => (
        <Panel key={project.slug} project={project} />
      ))}
    </section>
  );
}
