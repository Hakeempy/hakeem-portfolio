"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ExplorerCourse = {
  key: string;
  tab: string;
  title: string;
  promise: string;
  logos: { w: number; h: number; body: string }[];
  modules: { title: string; topics: string[] }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function Logo({ logo, className }: { logo: ExplorerCourse["logos"][number]; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${logo.w} ${logo.h}`}
      preserveAspectRatio="xMidYMid meet"
      className={`text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: logo.body }}
    />
  );
}

/**
 * The four courses behind one switcher. Pick a course to see its five modules, from the first
 * lesson to the last, and ask about that course in one click. Keeps the whole curriculum to a
 * single screen instead of four long lists.
 */
export function CourseExplorer({
  courses,
  email,
  audience,
}: {
  courses: ExplorerCourse[];
  email: string;
  audience: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const course = courses[active];

  // Arrow keys move between courses, as in any tab list.
  const onKeyDown = (e: KeyboardEvent) => {
    const last = courses.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const ask = `mailto:${email}?subject=${encodeURIComponent(`${course.title} course`)}`;

  return (
    <div className="mt-[clamp(40px,5vw,72px)] lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]">
      <div className="lg:col-span-8">
        <div
          role="tablist"
          aria-label="Courses"
          onKeyDown={onKeyDown}
          className="-mx-margin flex gap-6 overflow-x-auto px-margin pb-5 sm:gap-8 lg:mx-0 lg:px-0"
        >
          {courses.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`course-tab-${c.key}`}
                aria-selected={on}
                aria-controls="course-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative flex shrink-0 items-center gap-2.5 py-1.5 transition-colors duration-200 ${on ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                <span className={`flex gap-1.5 transition-[filter,opacity] duration-200 ${on ? "" : "opacity-60 grayscale"}`}>
                  {c.logos.map((logo, j) => (
                    <Logo key={j} logo={logo} className="size-5" />
                  ))}
                </span>
                {c.tab}
                {on && (
                  <motion.span
                    layoutId={reduce ? undefined : "course-tab"}
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 block h-[3px] w-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          id="course-panel"
          role="tabpanel"
          aria-labelledby={`course-tab-${course.key}`}
          className="bg-surface p-[clamp(20px,3vw,40px)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={course.key}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <div className="flex items-start gap-5">
                <span className="flex shrink-0 gap-2 pt-1">
                  {course.logos.map((logo, j) => (
                    <Logo key={j} logo={logo} className="size-11 sm:size-12" />
                  ))}
                </span>
                <div>
                  <h3 className="text-lead leading-tight font-medium">{course.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-muted">{course.promise}</p>
                </div>
              </div>

              <ol className="mt-8 grid gap-6 sm:mt-10">
                {course.modules.map((m, i) => (
                  <motion.li
                    key={m.title}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: reduce ? 0 : 0.05 + 0.06 * i, ease: EASE }}
                    className="grid grid-cols-[2rem_1fr] gap-x-3 sm:grid-cols-[2.75rem_1fr]"
                  >
                    <span aria-hidden className="tabular text-lead leading-tight text-accent">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">
                        <span className="sr-only-heading">Module {i + 1}: </span>
                        {m.title}
                      </p>
                      <p className="mt-1 text-small text-muted">{m.topics.join(" · ")}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <dl className="mt-10 grid content-start gap-y-6 lg:sticky lg:top-24 lg:col-span-4 lg:mt-[60px]">
        <div>
          <dt className="text-small text-muted">Who it is for</dt>
          <dd className="mt-1">{audience}</dd>
        </div>
        <div>
          <dt className="text-small text-muted">This course</dt>
          <dd className="mt-1">{course.modules.length} modules, from the first lesson to advanced work</dd>
        </div>
        <div className="pt-2">
          <a href={ask} className="button">
            Ask about the {course.tab} course
          </a>
        </div>
      </dl>
    </div>
  );
}
