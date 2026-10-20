import { site } from "@/data/site";
import { courses } from "@/data/courses";
import { logos, themedBody } from "@/components/toolkit/logos";
import { Reveal } from "@/components/motion/Reveal";
import { CourseExplorer, type ExplorerCourse } from "@/components/teaching/CourseExplorer";

/**
 * Learn with me: the teaching figures, then the four courses behind one switcher, each with its
 * five modules and a one-click way to ask about it. Figures from the resume; words in the soft
 * ink, figures alone in full ink.
 */
export function Teaching() {
  const n = (value: string) => <span className="tabular text-ink">{value}</span>;
  const list: ExplorerCourse[] = courses.map((c) => ({
    key: c.key,
    tab: c.tab,
    title: c.title,
    promise: c.promise,
    modules: c.modules,
    logos: c.logos.map((key) => {
      const logo = logos[key];
      return { w: logo.w, h: logo.h, body: themedBody(logo) };
    }),
  }));

  return (
    <section id="courses" aria-labelledby="courses-heading" className="px-margin py-section">
      <Reveal className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <h2 id="courses-heading" data-reveal className="display text-head font-medium lg:col-span-6">
          Learn with me
        </h2>
        <p
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-4 max-w-[40ch] text-muted lg:col-span-5 lg:col-start-8 lg:mt-0"
        >
          Since {n("2022")} I have taught {n("50+\u00a0students")} and professionals to work with data in{" "}
          {n("5\u00a0tools")}, and {n("95%")} of them left satisfied.
        </p>
      </Reveal>
      <CourseExplorer
        courses={list}
        email={site.email}
        audience="Students and working professionals starting out with data"
        consulting="Analysis, dashboards and pipelines for clients who need their data working"
      />
    </section>
  );
}
