"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { path } from "@/data/path";
import { Reveal } from "@/components/motion/Reveal";

// The title pins in the left half while the four stages pass in the right half, so they never collide.
// The years under the title change with each stage. White charts are shown in night mode.
export function Path() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const items = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stage = path[active];

  return (
    <section id="path" aria-labelledby="path-heading" className="px-margin py-section md:grid md:grid-cols-12 md:gap-x-[var(--gap)]">
      <div className="md:col-span-6">
        <div className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center">
          <h2 id="path-heading" className="text-display leading-[0.85] tracking-[-0.04em]">
            Both
            <br />
            ends
          </h2>
          <p className="mt-6 max-w-[34ch] text-muted md:mt-8">
            I have read data as an analyst, taught it, modelled it and now move it. Each step taught me
            what the next one needs.
          </p>
          <div aria-hidden className="mt-8 hidden h-[1.3em] overflow-hidden text-lead md:block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={stage.years}
                className="tabular text-ink"
                initial={reduce ? false : { y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {stage.years}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ol className="mt-16 space-y-20 md:col-span-5 md:col-start-8 md:mt-0 md:space-y-[30svh] md:pt-[30svh] md:pb-[20svh]">
        {path.map((item, i) => (
          <li
            key={item.role}
            ref={(el) => {
              items.current[i] = el;
            }}
            data-index={i}
          >
            <Reveal className={i % 2 === 1 ? "md:ml-[12%]" : "md:mr-[12%]"}>
              <figure>
                <div data-reveal="shutter" className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 768px) 34vw, 100vw"
                    className={`object-cover ${
                      item.image.night
                        ? "invert hue-rotate-180 brightness-[0.92]"
                        : "brightness-[0.9]"
                    }`}
                  />
                </div>
                <figcaption className="mt-5">
                  <h3 data-reveal style={{ "--i": 1 } as React.CSSProperties} className="font-medium">
                    {item.role}
                  </h3>
                  <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="text-small text-muted">
                    {item.where}, <span className="tabular">{item.years}</span>
                  </p>
                  <p data-reveal style={{ "--i": 3 } as React.CSSProperties} className="mt-3 max-w-[38ch]">
                    {item.sentence}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
