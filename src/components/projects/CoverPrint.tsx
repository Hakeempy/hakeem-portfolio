"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The case study's large print. The crop starts a little close and settles back as the page
 * scrolls past it, like stepping away from a screen to see all of it.
 */
export function CoverPrint({
  src,
  alt,
  focus,
  light,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  focus?: string;
  light: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.06, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-surface ${className}`}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover ${light ? "lit-light" : ""}`}
          style={{ objectPosition: focus }}
        />
      </motion.div>
    </div>
  );
}
