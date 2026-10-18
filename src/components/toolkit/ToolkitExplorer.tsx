"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { STAGES, type StageKey } from "@/data/toolkit";

export type ExplorerTool = {
  name: string;
  stage: StageKey;
  work: boolean;
  order: number;
  logo: { w: number; h: number; body: string };
  projects: { slug: string; title: string }[];
};

const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.key, s.label])) as Record<StageKey, string>;
const EASE = [0.22, 1, 0.36, 1] as const;

function Logo({ tool, className }: { tool: ExplorerTool; className: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${tool.logo.w} ${tool.logo.h}`}
      preserveAspectRatio="xMidYMid meet"
      className={`text-ink ${className}`}
      dangerouslySetInnerHTML={{ __html: tool.logo.body }}
    />
  );
}

/**
 * A compact wall of logos with a spotlight beside it. Pointing at a tile (or focusing or tapping
 * it) puts that tool in the spotlight: its logo large, its stage, and the projects it powers as
 * links. The stage filters bring one stage's tools forward and let the rest recede.
 */
export function ToolkitExplorer({ tools }: { tools: ExplorerTool[] }) {
  const reduce = useReducedMotion() ?? false;
  const [stage, setStage] = useState<StageKey | "all">("all");
  const [selected, setSelected] = useState(tools[0].name);
  const current = tools.find((t) => t.name === selected) ?? tools[0];

  const pickStage = (next: StageKey | "all") => {
    setStage(next);
    // Keep the spotlight on a tool that belongs to the chosen stage.
    if (next !== "all" && current.stage !== next) {
      const first = tools.find((t) => t.stage === next);
      if (first) setSelected(first.name);
    }
  };

  // The chosen stage's tools shuffle to the front; the rest fall in behind them, faded.
  const shown =
    stage === "all"
      ? tools
      : [...tools.filter((t) => t.stage === stage), ...tools.filter((t) => t.stage !== stage)];

  const filters: { key: StageKey | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: tools.length },
    ...STAGES.map((s) => ({ ...s, count: tools.filter((t) => t.stage === s.key).length })),
  ];

  return (
    <div className="mt-[clamp(40px,5vw,72px)] lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]">
      <div className="lg:col-span-8">
        {/* Stage filters */}
        <div role="group" aria-label="Filter by stage" className="-mx-margin flex gap-4 overflow-x-auto sm:gap-6 px-margin pb-5 lg:mx-0 lg:px-0">
          {filters.map((f) => {
            const on = stage === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => pickStage(f.key)}
                className={`group relative shrink-0 py-1 text-small transition-colors duration-200 ${on ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {f.label} <span className="tabular text-muted">{f.count}</span>
                {/* One gold bar that slides to the chosen stage */}
                {on && (
                  <motion.span
                    layoutId={reduce ? undefined : "toolkit-filter"}
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 block h-[3px] w-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* The wall */}
        <ul className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 sm:gap-2">
          {shown.map((tool) => {
            const inStage = stage === "all" || tool.stage === stage;
            const isOn = tool.name === current.name;
            return (
              <motion.li
                key={tool.name}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 14, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  default: { duration: 0.5, delay: reduce ? 0 : 0.02 * tools.indexOf(tool), ease: EASE },
                  layout: { type: "spring", stiffness: 380, damping: 34 },
                }}
              >
                <motion.button
                  type="button"
                  aria-label={tool.name}
                  aria-pressed={isOn}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setSelected(tool.name)}
                  onFocus={() => setSelected(tool.name)}
                  onClick={() => setSelected(tool.name)}
                  animate={{
                    opacity: inStage ? 1 : 0.16,
                    scale: inStage ? 1 : 0.9,
                    filter: inStage ? "grayscale(0%)" : "grayscale(100%)",
                  }}
                  whileHover={reduce || !inStage ? undefined : { y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  className={`relative flex aspect-square w-full items-center justify-center transition-colors duration-200 ${isOn ? "bg-surface-2" : "bg-surface hover:bg-surface-2"}`}
                >
                  <Logo tool={tool} className="h-[46%] w-[62%]" />
                  {/* The selected tile carries the gold mark, which slides between tiles */}
                  {isOn && (
                    <motion.span
                      layoutId={reduce ? undefined : "toolkit-mark"}
                      aria-hidden
                      className="absolute top-2 left-2 block size-1.5 bg-accent"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* The spotlight */}
      <div className="mt-10 lg:col-span-4 lg:mt-[52px]">
        <div className="lg:sticky lg:top-24" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.name}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="bg-surface p-[clamp(20px,2.4vw,32px)]"
            >
              <div className="flex items-center gap-5">
                <Logo tool={current} className="size-16 shrink-0" />
                <div>
                  <p className="text-lead leading-tight font-medium">{current.name}</p>
                  <p className="mt-1 text-small text-muted">{STAGE_LABEL[current.stage]}</p>
                </div>
              </div>
              <div className="mt-6">
                {current.projects.length > 0 ? (
                  <>
                    <p className="text-small text-muted">
                      Used in {current.projects.length} {current.projects.length === 1 ? "project" : "projects"}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {current.projects.slice(0, 5).map((p, i) => (
                        <motion.li
                          key={p.slug}
                          initial={reduce ? false : { opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: reduce ? 0 : 0.04 * i, ease: EASE }}
                        >
                          <Link href={`/projects/${p.slug}`} className="group/p flex items-baseline justify-between gap-4">
                            <span className="link">{p.title}</span>
                            <span aria-hidden className="text-accent transition-transform duration-200 group-hover/p:translate-x-1">
                              →
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                    {current.projects.length > 5 && (
                      <p className="mt-3 text-small text-muted">and {current.projects.length - 5} more</p>
                    )}
                  </>
                ) : (
                  <p className="text-muted">Part of my day-to-day work and teaching, rather than a project on this site.</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
