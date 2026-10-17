import { Reveal } from "@/components/motion/Reveal";

// Figures from the resume. Words in the soft ink, figures alone in full ink.
export function Teaching() {
  const n = (value: string) => <span className="tabular text-ink">{value}</span>;

  return (
    <section
      id="teaching"
      aria-labelledby="teaching-heading"
      className="flex min-h-[70svh] items-center px-margin py-section"
    >
      <Reveal className="grid w-full gap-y-14 md:grid-cols-12 md:gap-x-[var(--gap)]">
        <h2 id="teaching-heading" className="sr-only-heading">
          Teaching and consulting
        </h2>
        <p
          data-reveal
          className="text-lead leading-[1.25] tracking-[-0.015em] text-muted md:col-span-6 md:col-start-2"
        >
          Since {n("2022")} I have taught {n("100+ students")} and professionals to work with
          data in {n("5 tools")}, and {n("95%")} of them left satisfied.
        </p>

        <dl className="grid content-start gap-y-6 md:col-span-4 md:col-start-9">
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            <dt className="text-small text-muted">What I teach</dt>
            <dd className="mt-1">Excel, Power BI, Tableau, SQL and Python</dd>
          </div>
          <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <dt className="text-small text-muted">Who it is for</dt>
            <dd className="mt-1">Students and working professionals starting out with data</dd>
          </div>
          <div data-reveal style={{ "--i": 3 } as React.CSSProperties}>
            <dt className="text-small text-muted">Consulting</dt>
            <dd className="mt-1">Analysis, dashboards and pipelines for clients who need their data working</dd>
          </div>
          <div data-reveal style={{ "--i": 4 } as React.CSSProperties}>
            <a href="#contact" className="link">
              Ask about a course or a project
            </a>
          </div>
        </dl>
      </Reveal>
    </section>
  );
}
