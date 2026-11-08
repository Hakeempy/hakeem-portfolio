import { site } from "@/data/site";
import { courses } from "@/data/courses";
import { logos, themedBody } from "@/components/toolkit/logos";
import { Reveal } from "@/components/motion/Reveal";
import { CourseExplorer, type ExplorerCourse } from "@/components/courses/CourseExplorer";

const delay = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** The teaching figures, from the resume, large. */
export function TeachingFigures() {
  const figures = [
    { value: "50+", label: "students and professionals taught" },
    { value: "95%", label: "left satisfied" },
    { value: "4", label: "courses across five tools" },
    { value: "2022", label: "teaching since" },
  ];
  return (
    <section aria-label="Teaching in figures" className="px-margin pb-[clamp(72px,9vw,140px)]">
      <Reveal>
        <dl className="grid grid-cols-2 items-end gap-x-[var(--gap)] gap-y-10 lg:grid-cols-4">
          {figures.map((f, i) => (
            <div key={f.label} data-reveal style={delay(i)} className="flex flex-col-reverse">
              <dt className="mt-2 max-w-[30ch] text-small text-muted">{f.label}</dt>
              <dd className="display tabular text-head leading-none font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

/** The four courses behind one switcher. */
export function Courses() {
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
    <section id="courses" aria-labelledby="courses-heading" className="scroll-mt-6 px-margin pb-section">
      <Reveal className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <h2 id="courses-heading" data-reveal className="display text-head font-medium lg:col-span-6">
          The courses
        </h2>
        <p data-reveal style={delay(1)} className="mt-4 max-w-[40ch] text-muted lg:col-span-5 lg:col-start-8 lg:mt-0">
          Four courses of five modules each, from the first lesson to advanced work. Pick one to see
          what it covers.
        </p>
      </Reveal>
      <CourseExplorer
        courses={list}
        email={site.email}
        audience="Students and working professionals starting out with data"
      />
    </section>
  );
}

const offers = [
  {
    title: "Analysis",
    line: "A business question answered from the data you already have, in SQL, Python or Excel.",
  },
  {
    title: "Dashboards",
    line: "Power BI or Tableau reports built around the decisions the people reading them make.",
  },
  {
    title: "Pipelines",
    line: "Data moved and cleaned automatically, so the reports stay right without work by hand.",
  },
  {
    title: "Team training",
    line: "Any of the four courses, shaped around your team's tools and your own data.",
  },
];

/** Consulting, on a field of the surface colour so it reads as its own offer. */
export function Consulting() {
  return (
    <section id="consulting" aria-labelledby="consulting-heading" className="scroll-mt-6 bg-surface px-margin py-section">
      <Reveal className="lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <div className="lg:col-span-5">
          <h2 id="consulting-heading" data-reveal className="display text-head font-medium">
            Consulting
          </h2>
          <p data-reveal style={delay(1)} className="mt-6 max-w-[34ch] text-lead leading-[1.25]">
            Bring me the question or the mess. You get the answer, the dashboard or the pipeline, and
            an explanation of how it works.
          </p>
          <a data-reveal style={delay(2)} href="#contact" className="button mt-8">
            Talk about a project
          </a>
        </div>
        <dl className="mt-14 grid gap-x-[var(--gap)] gap-y-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:mt-2">
          {offers.map((o, i) => (
            <div key={o.title} data-reveal style={delay(i + 2)}>
              <dt className="text-lead leading-tight font-medium">{o.title}</dt>
              <dd className="mt-2 text-muted">{o.line}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

const steps = [
  {
    title: "Tell me what you need",
    line: "A short message about the course or the project: what you have and what you need from it.",
  },
  {
    title: "We agree the scope",
    line: "For a course, the level, the dates and the format. For a project, what I deliver and when.",
  },
  {
    title: "The work",
    line: "Lessons with practice on real datasets, or the analysis, dashboard or pipeline, handed over with an explanation.",
  },
];

/** How a course or a project starts, in three steps. */
export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-heading" className="px-margin pt-[clamp(80px,9vw,140px)]">
      <Reveal>
        <h2 id="how-heading" data-reveal className="display text-head font-medium">
          How it works
        </h2>
        <ol className="mt-[clamp(40px,5vw,72px)] grid gap-x-[var(--gap)] gap-y-12 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={delay(i + 1)}>
              <span aria-hidden className="display tabular block text-head leading-none font-medium text-accent">
                {i + 1}
              </span>
              <p className="mt-5 text-lead leading-tight font-medium">{s.title}</p>
              <p className="mt-3 max-w-[38ch] text-muted">{s.line}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
