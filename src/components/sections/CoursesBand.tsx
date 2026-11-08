import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/** A short pointer from the portfolio to the courses and consulting page, which lives on its own. */
export function CoursesBand() {
  return (
    <section aria-labelledby="courses-band-heading" className="px-margin py-[clamp(72px,8vw,128px)]">
      <Reveal className="bg-surface px-[clamp(20px,4vw,64px)] py-[clamp(40px,5vw,80px)] lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <h2 id="courses-band-heading" data-reveal className="text-lead leading-[1.25] font-medium lg:col-span-7">
          <span className="block">I also teach and consult.</span>
          <span className="block text-muted">
            Courses in SQL, Python, Excel and Power BI / Tableau, and consulting for teams.
          </span>
        </h2>
        <div data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:justify-self-end">
          <Link href="/courses" className="button group gap-2">
            Courses &amp; consulting
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
