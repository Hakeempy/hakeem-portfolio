"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";

// Screens from Hakeem's own pipelines. The large print crossfades through them like light shifting in a room.
const screens = [
  {
    src: "/images/work/heartbeat-grafana.png",
    alt: "Grafana dashboard from the heart-rate pipeline: 34,978 records, minimum 50 and maximum 120 bpm",
    focus: "8% 40%",
    light: false,
  },
  {
    src: "/images/work/flight-grafana.png",
    alt: "Grafana dashboard from the flight price pipeline: average fare by airline",
    focus: "18% 88%",
    light: false,
  },
  {
    src: "/images/work/lakehouse-stepfn.png",
    alt: "Step Functions graph from the lakehouse pipeline running Glue jobs in parallel",
    focus: "52% 45%",
    light: true,
  },
  {
    src: "/images/work/ecommerce-dashboard.png",
    alt: "Dashboard of daily revenue by product category from the e-commerce pipeline",
    focus: "18% 45%",
    light: true,
  },
];

const HOLD_MS = 5600;

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let timer: number | undefined;
    const start = () => {
      stop();
      timer = window.setInterval(() => setIndex((i) => (i + 1) % screens.length), HOLD_MS);
    };
    const stop = () => window.clearInterval(timer);
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  const screen = screens[index];

  return (
    <header className="relative h-svh min-h-[640px] overflow-hidden">
      <nav
        aria-label="Main"
        className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-margin pt-margin text-small"
      >
        <div className="flex items-baseline gap-6 md:gap-8">
          <Link href="/" className="font-medium">
            {site.name}
          </Link>
          <ul className="hidden gap-6 text-muted md:flex">
            <li>
              <a className="link hover:text-ink" href="#work">
                Work
              </a>
            </li>
            <li>
              <a className="link hover:text-ink" href="#path">
                About
              </a>
            </li>
            <li>
              <a className="link hover:text-ink" href="#teaching">
                Teaching
              </a>
            </li>
          </ul>
        </div>
        <a href="#contact" className="button">
          Work with me
        </a>
      </nav>

      {/* The large print: 4:5, the brightest thing in the room */}
      <div
        data-rise
        className="absolute top-[11svh] right-margin aspect-[4/5] h-[52svh] max-w-[calc(100vw-2*var(--margin))] lg:top-[8%] lg:right-auto lg:left-1/2 lg:h-[74svh] lg:w-auto lg:max-w-none"
      >
        <div className="relative h-full w-full overflow-hidden bg-surface">
          <AnimatePresence initial={false}>
            <motion.div
              key={screen.src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.33, 1, 0.68, 1] }}
            >
              <Image
                src={screen.src}
                alt={screen.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 45vw, 78vw"
                className={`object-cover ${screen.light ? "lit-light" : ""}`}
                style={{ objectPosition: screen.focus }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* The small print: 1:1, dimmed so the large one stays brightest */}
      <div
        data-rise
        style={{ "--i": 2 } as React.CSSProperties}
        className="absolute top-[60svh] left-margin w-[18svh] lg:top-[52%] lg:left-[8.33%] lg:w-[12vw]"
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src="/images/work/music-airflow.png"
            alt="Airflow grid of task runs, green for success and red for failure, from the music streaming pipeline"
            fill
            sizes="(min-width: 1024px) 12vw, 30vw"
            className="object-cover invert hue-rotate-180 brightness-[0.7]"
            style={{ objectPosition: "17% 63%" }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 grid gap-4 px-margin pb-margin lg:grid-cols-12 lg:items-end">
        <h1
          data-rise
          style={{ "--i": 1 } as React.CSSProperties}
          className="display max-w-[22ch] text-head lg:col-span-6"
        >
          I build the pipelines your data runs&nbsp;on.
        </h1>
        <p
          data-rise
          style={{ "--i": 3 } as React.CSSProperties}
          className="max-w-[26ch] text-small leading-[1.45] text-muted lg:col-span-3 lg:col-start-10"
        >
          Data engineer in Accra. Analyst first, teacher still. Real-time and batch pipelines on AWS.
        </p>
      </div>
    </header>
  );
}
