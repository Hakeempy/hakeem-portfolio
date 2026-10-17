"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * When the wrapper first scrolls into view, adds `.is-in` to every `[data-reveal]` inside it;
 * their `--i` index staggers them. The wrapper is observed rather than each part, because a
 * part hidden by clip-path never reports as intersecting.
 * The hidden state lives in CSS under `(scripting: enabled)`, so pages read fine without scripts.
 */
export function Reveal({
  children,
  className,
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
        observer.disconnect();
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
