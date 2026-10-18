"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Each headline is two lines; a word marked gold carries the raw-to-gold idea of the scene behind it.
const HEADLINES: { line: string; gold?: string }[][] = [
  [{ line: "I build the pipelines" }, { line: "your data runs on." }],
  [{ line: "Data is the new oil." }, { line: "I build the", gold: "refineries." }],
];

const HOLD = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The hero headline, alternating between two lines that say the same thing two ways. Words leave
 * upwards and the next line's words rise into the same spot, so the layout never moves. It pauses
 * while the hero is off screen or the tab is hidden. Screen readers get the first line only.
 */
export function HeroHeadline({ className, style }: { className: string; style?: React.CSSProperties }) {
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    const id = window.setInterval(() => {
      if (visible && !document.hidden) setIndex((i) => (i + 1) % HEADLINES.length);
    }, HOLD);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, []);

  let n = 0;
  const word = (text: string, gold = false) => {
    const i = n++;
    return (
      <motion.span
        key={i}
        className={`inline-block ${gold ? "text-accent" : ""}`}
        variants={{
          hidden: reduce ? { opacity: 0 } : { opacity: 0, y: "0.45em", filter: "blur(8px)" },
          shown: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: reduce ? 0.4 : 0.7, delay: reduce ? 0 : 0.06 * i, ease: EASE },
          },
          gone: reduce
            ? { opacity: 0, transition: { duration: 0.3 } }
            : {
                opacity: 0,
                y: "-0.35em",
                filter: "blur(6px)",
                transition: { duration: 0.35, delay: 0.03 * i, ease: EASE },
              },
        }}
      >
        {text}
      </motion.span>
    );
  };

  return (
    <h1 ref={ref} data-rise style={style} className={className}>
      <span className="sr-only">I build the pipelines your data runs on.</span>
      <span aria-hidden className="grid">
        <AnimatePresence initial={false}>
          <motion.span
            key={index}
            className="col-start-1 row-start-1"
            initial="hidden"
            animate="shown"
            exit="gone"
          >
            {HEADLINES[index].map(({ line, gold }) => {
              const words = line.split(" ");
              return (
                <span key={line} className="block">
                  {words.map((w, j) => (
                    <span key={j}>
                      {word(w)}
                      {j < words.length - 1 || gold ? " " : ""}
                    </span>
                  ))}
                  {gold && word(gold, true)}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
