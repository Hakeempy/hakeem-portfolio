"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { icons, type IconName } from "./icons";

/*
 * The kit for the animated thumbnails. Every scene is a 600 by 400 SVG: the project's subject
 * on top (the "stage", 30..570 by 40..210) and its pipeline below (the "row", 250..360), with
 * data tokens travelling from the subject through the pipeline to the served result in gold.
 * Animations are SMIL, so they cost no React renders; they play only while the scene is on
 * screen, and visitors who turn motion off get the still frame.
 */

export const C = {
  ground: "#181512",
  block: "#231f1b",
  line: "#4a433c",
  muted: "#a39d96",
  ink: "#f4f4f3",
  gold: "#c9a45a",
  goldInk: "#0c0a08",
};

export const STAGE = { x: 30, y: 40, w: 540, h: 170 };
export const ROW = { y: 250, h: 110, gap: 20, lane: 230 };

export function StoryScene({
  label,
  children,
}: {
  label: string;
  children: (still: boolean) => ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const svg = ref.current;
    if (!svg || reduce) return;
    svg.pauseAnimations();
    const observer = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations(),
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 400"
      role="img"
      aria-label={label}
      className="block h-auto w-full"
      style={{ background: C.ground }}
      fontFamily="inherit"
    >
      {children(reduce)}
    </svg>
  );
}

/** The stage backdrop: one block where the subject is drawn. */
export function Stage({ caption }: { caption?: string }) {
  return (
    <>
      <rect x={STAGE.x} y={STAGE.y} width={STAGE.w} height={STAGE.h} fill={C.block} />
      {caption && (
        <text x={STAGE.x + 16} y={STAGE.y + 28} fontSize="15" fill={C.muted}>
          {caption}
        </text>
      )}
    </>
  );
}

export type Step = { name: string; role: string; icon?: IconName };

/** Evenly spaced pipeline boxes across the row; the last one is served, in gold. */
export function rowLayout(count: number) {
  const w = (540 - ROW.gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => ({ x: 30 + i * (w + ROW.gap), w, cx: 30 + i * (w + ROW.gap) + w / 2 }));
}

export function Row({ steps, children }: { steps: Step[]; children?: ReactNode }) {
  const layout = rowLayout(steps.length);
  return (
    <>
      {steps.map((s, i) => (
        <Box key={i} x={layout[i].x} y={ROW.y} w={layout[i].w} h={ROW.h} {...s} served={i === steps.length - 1} />
      ))}
      {children}
    </>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  name,
  role,
  icon,
  served = false,
}: Step & { x: number; y: number; w: number; h: number; served?: boolean }) {
  const ink = served ? C.goldInk : C.ink;
  const soft = served ? C.goldInk : C.muted;
  // The name shrinks in narrow boxes so the longest ones ("PostgreSQL", "Step Functions") fit.
  const nameSize = Math.min(20, (w - 28) / (name.length * 0.56));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={served ? C.gold : C.block} />
      {icon && (
        <g transform={`translate(${x + 16} ${y + 14}) scale(${20 / 24})`}>
          <path d={icons[icon]} fill={soft} />
        </g>
      )}
      <text x={x + 16} y={y + 62} fontSize={nameSize} fontWeight="500" fill={ink}>
        {name}
      </text>
      <text x={x + 16} y={y + 84} fontSize="14" fill={soft}>
        {role}
      </text>
    </g>
  );
}

/**
 * The route a token takes from a point on the stage, down to the lane between stage and row,
 * then through each pipeline box in turn, ending inside the served one.
 */
export function rowPath(fromX: number, fromY: number, count: number) {
  const layout = rowLayout(count);
  const dip = ROW.y + ROW.h / 2 + 10;
  let d = `M${fromX} ${fromY} L${fromX} ${ROW.lane}`;
  layout.forEach((b, i) => {
    d += ` L${b.cx} ${ROW.lane} L${b.cx} ${dip}`;
    if (i < layout.length - 1) d += ` L${b.cx} ${ROW.lane}`;
  });
  return d;
}

/** A small square of data travelling along a path, fading in and out. */
export function Token({
  path,
  dur,
  begin = 0,
  gold = false,
  size = 12,
  still,
}: {
  path: string;
  dur: number;
  begin?: number;
  gold?: boolean;
  size?: number;
  still: boolean;
}) {
  if (still) return null;
  return (
    <rect x={-size / 2} y={-size / 2} width={size} height={size} fill={gold ? C.gold : C.ink} opacity="0">
      <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.06;0.9;1"
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
    </rect>
  );
}

/** Bars standing on a baseline that breathe between two heights. */
export function Bars({
  x,
  base,
  values,
  width = 14,
  gap = 6,
  max = 40,
  highlight,
  dur = 4,
  still,
  ink = C.line,
}: {
  x: number;
  base: number;
  values: number[];
  width?: number;
  gap?: number;
  max?: number;
  highlight?: number;
  dur?: number;
  still: boolean;
  ink?: string;
}) {
  return (
    <>
      {values.map((v, i) => {
        const h = v * max;
        const low = h * 0.6 + 4;
        return (
          <rect key={i} x={x + i * (width + gap)} y={base - h} width={width} height={h} fill={i === highlight ? C.gold : ink}>
            {!still && (
              <>
                <animate attributeName="height" values={`${h};${low};${h}`} dur={`${dur}s`} begin={`${i * 0.25}s`} repeatCount="indefinite" />
                <animate attributeName="y" values={`${base - h};${base - low};${base - h}`} dur={`${dur}s`} begin={`${i * 0.25}s`} repeatCount="indefinite" />
              </>
            )}
          </rect>
        );
      })}
    </>
  );
}

/** Opacity keyed to fractions of a loop: hidden, then shown from `on` to `off`. */
export function showBetween(on: number, off: number) {
  const k = (n: number) => Math.min(Math.max(n, 0), 1).toFixed(3);
  return {
    attributeName: "opacity",
    values: "0;0;1;1;0;0",
    keyTimes: `0;${k(on)};${k(on + 0.03)};${k(off)};${k(off + 0.03)};1`,
    repeatCount: "indefinite",
  } as const;
}
