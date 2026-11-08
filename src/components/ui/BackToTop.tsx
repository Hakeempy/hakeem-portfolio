"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * A small square in the corner that appears once you are more than a screen and a half down any
 * page, and takes you back to the top. Focus goes to the top of the page too, so keyboard users
 * land where the eye does.
 */
export function BackToTop() {
  const reduce = useReducedMotion() ?? false;
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.querySelector<HTMLElement>("nav a")?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          type="button"
          aria-label="Back to the top"
          onClick={toTop}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed right-margin bottom-[max(20px,env(safe-area-inset-bottom))] z-40 flex size-12 items-center justify-center bg-accent text-accent-ink transition-colors duration-200 hover:bg-accent-hover"
        >
          <svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
          >
            <path d="M9 15V4M4.5 8 9 3.5 13.5 8" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
