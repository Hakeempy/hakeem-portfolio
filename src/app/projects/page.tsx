import type { Metadata } from "next";
import { getAllProjects, type ProjectCategory } from "@/lib/projects";
import { SiteNav } from "@/components/projects/SiteNav";
import { ProjectPrint } from "@/components/projects/ProjectPrint";
import { PageClose } from "@/components/projects/PageClose";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project Hakeem Wikireh has built: data pipelines on Kafka, Spark, Airflow and AWS, the analysis before them, and the models in between.",
};

const groups: {
  id: string;
  category: ProjectCategory;
  title: string;
  line: string;
}[] = [
  {
    id: "engineering",
    category: "data-engineering",
    title: "Data engineering",
    line: "Streaming and batch pipelines on Kafka, Spark, Airflow and AWS, and the databases at their ends.",
  },
  {
    id: "analysis",
    category: "analytics",
    title: "Analysis",
    line: "Questions answered with pandas, PySpark, SQL and Power BI. This is where the work started.",
  },
  {
    id: "models",
    category: "machine-learning",
    title: "Machine learning",
    line: "Prediction models, from notebooks to an app someone can use.",
  },
];

/*
 * The hang. Prints are placed in pairs that alternate sides and sizes, the smaller one dropped
 * lower, like screens pinned up on a wall at different heights. Every print is the same 3:2
 * scene; only its size and place change. One column on phones and tablets, where the smaller
 * prints step in from alternate sides.
 */
const hang = [
  "lg:col-span-7 lg:col-start-1",
  "w-[86%] ml-auto lg:w-auto lg:ml-0 lg:col-span-4 lg:col-start-9 lg:mt-[9vw]",
  "w-[86%] lg:w-auto lg:col-span-5 lg:col-start-2 lg:mt-[2vw]",
  "lg:col-span-6 lg:col-start-7 lg:mt-[7vw]",
];

const numberWords = [
  "no",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];
const inWords = (n: number) => numberWords[n] ?? String(n);
const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ProjectsPage() {
  const projects = getAllProjects();
  const since = Math.min(...projects.map((project) => project.year));
  const sections = groups
    .map((group) => ({
      ...group,
      projects: projects.filter(
        (project) => project.category === group.category,
      ),
    }))
    .filter((group) => group.projects.length > 0);

  return (
    <>
      <SiteNav current="projects" />
      <main>
        <header className="px-margin pt-[clamp(72px,12svh,140px)] pb-[clamp(72px,9vw,140px)] lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]">
          <h1
            data-rise
            style={{ "--i": 1 } as React.CSSProperties}
            className="text-display leading-[0.9] font-medium tracking-[-0.045em] lg:col-span-12"
          >
            All the work
          </h1>
          <p
            data-rise
            style={{ "--i": 2 } as React.CSSProperties}
            className="mt-8 max-w-[30ch] text-lead leading-[1.25] lg:col-span-6 lg:mt-12"
          >
            {capitalise(inWords(projects.length))} projects since {since}. The
            pipelines come first, then the analysis and models they grew out of.
          </p>
          <nav
            aria-label="Project groups"
            data-rise
            style={{ "--i": 3 } as React.CSSProperties}
            className="mt-10 lg:col-span-3 lg:col-start-10 lg:mt-12 lg:self-end"
          >
            <ul className="space-y-1">
              {sections.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="group flex items-baseline justify-between gap-6 py-1"
                  >
                    <span>{group.title}</span>
                    <span className="tabular text-muted transition-colors duration-200 group-hover:text-accent">
                      {group.projects.length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {sections.map((group, g) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
            className={`scroll-mt-8 px-margin ${g === sections.length - 1 ? "pb-section" : "pb-[clamp(96px,10vw,180px)]"}`}
          >
            <div className="mb-[clamp(40px,5vw,80px)] lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
              <h2
                id={`${group.id}-heading`}
                className="display text-head font-medium lg:col-span-6"
              >
                {group.title}
              </h2>
              <p className="mt-4 max-w-[44ch] lg:col-span-4 lg:col-start-9 lg:mt-0">
                {group.line}
              </p>
            </div>

            <ul className="flex flex-col gap-y-[clamp(56px,5vw,96px)] lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-[var(--gap)]">
              {group.projects.map((project, i) => {
                return (
                  <li key={project.slug} className={hang[i % hang.length]}>
                    <ProjectPrint project={project} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </main>
      <PageClose />
    </>
  );
}
