"use client";

import { scenes } from "./scenes";

/** A project's animated thumbnail, 3:2, by slug. */
export function ProjectScene({ slug }: { slug: string }) {
  const Scene = scenes[slug];
  return Scene ? <Scene /> : <div className="aspect-[3/2] bg-surface" />;
}
