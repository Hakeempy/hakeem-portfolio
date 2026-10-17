"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ProjectMeta } from "@/lib/projects";
import { Reveal } from "@/components/motion/Reveal";

type ListProject = Pick<
  ProjectMeta,
  | "slug"
  | "title"
  | "summary"
  | "year"
  | "fact"
  | "stack"
  | "cover"
  | "coverAlt"
>;

export function WorkList({ projects }: { projects: ListProject[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // The row nearest the middle of the viewport becomes active as the list scrolls.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    rows.current.forEach((row) => row && observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const current = projects[active];

  return (
    <section
      id="all-work"
      aria-labelledby="all-work-heading"
      className="px-margin pb-section"
    >
      <div className="md:grid md:grid-cols-12 md:gap-x-[var(--gap)]">
        {/* The picture: a band pinned to the top on phones, a sticky 4:5 print on desktop */}
        <div className="sticky top-0 z-10 -mx-margin bg-bg pb-4 md:top-[12vh] md:col-span-5 md:mx-0 md:self-start md:pb-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface md:aspect-[4/5] md:w-[34vw]">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.slug}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
              >
                {current.cover ? (
                  <Image
                    src={current.cover}
                    alt={current.coverAlt ?? ""}
                    fill
                    sizes="(min-width: 768px) 34vw, 100vw"
                    className="object-cover brightness-[0.88]"
                  />
                ) : (
                  <div className="flex h-full items-end p-6">
                    <p className="text-lead text-muted">{current.fact}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 md:col-span-5 md:col-start-7 md:mt-0">
          <Reveal>
            <h2
              id="all-work-heading"
              data-reveal
              className="display mb-12 text-head"
            >
              The rest of the work
            </h2>
            <ul>
              {projects.map((project, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={project.slug}
                    ref={(el) => {
                      rows.current[i] = el;
                    }}
                    data-index={i}
                    data-reveal
                    style={{ "--i": Math.min(i + 1, 8) } as React.CSSProperties}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group flex min-h-[58px] items-baseline justify-between gap-6 py-3"
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={`text-lead leading-snug transition-colors duration-200 ${
                          isActive
                            ? "text-ink"
                            : "text-muted group-hover:text-ink"
                        }`}
                      >
                        {project.title}
                      </span>
                      <span className="tabular shrink-0 text-small text-muted">
                        {project.year}
                      </span>
                    </Link>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[40ch] pb-5 text-small leading-[1.5] text-muted">
                            {project.summary}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Link href="/projects" className="link mt-10 inline-block text-ink">
            Every project, with its write-up
          </Link>
        </div>
      </div>
    </section>
  );
}
