import { CellsToChart } from "@/components/three/CellsToChart";

/**
 * The first screen of the courses page: the promise on the left, and on the right a messy sheet
 * that cleans itself into a table and then a chart, which is the skill the courses teach.
 * On phones the chart comes first and the words follow.
 */
export function CoursesHero() {
  return (
    <header className="px-margin pb-[clamp(56px,7vw,112px)] lg:grid lg:min-h-[calc(100svh-96px)] lg:grid-cols-12 lg:items-center lg:gap-x-[var(--gap)]">
      <CellsToChart className="relative -mx-margin h-[clamp(300px,88vw,520px)] lg:order-2 lg:col-span-7 lg:mx-0 lg:h-[min(76svh,760px)]" />

      <div className="mt-6 lg:order-1 lg:col-span-5 lg:mt-0">
        <h1
          data-rise
          style={{ "--i": 1 } as React.CSSProperties}
          className="text-[clamp(2.5rem,1rem+2.9vw,4rem)] leading-[0.98] font-medium tracking-[-0.04em]"
        >
          <span className="block">I teach the tools</span>
          <span className="block">I use every day.</span>
        </h1>
        <p
          data-rise
          style={{ "--i": 2 } as React.CSSProperties}
          className="mt-6 max-w-[36ch] text-muted"
        >
          Courses in SQL, Python, Excel and Power BI / Tableau for students and working
          professionals, and consulting for teams who need their data working.
        </p>
        <div
          data-rise
          style={{ "--i": 3 } as React.CSSProperties}
          className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
        >
          <a href="#courses" className="button">
            See the courses
          </a>
          <a href="#consulting" className="link text-ink">
            Consulting
          </a>
        </div>
        <p data-rise style={{ "--i": 4 } as React.CSSProperties} className="mt-8 text-small text-muted">
          Click the chart to clean another sheet.
        </p>
      </div>
    </header>
  );
}
