import { getAllProjects } from "@/lib/projects";
import { toolkit } from "@/data/toolkit";
import { icons } from "@/components/thumbs/icons";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The tools, laid out as the pipeline itself: four stages from left to right, each tool counted
 * by the projects on this site that use it. The columns fill in stage by stage as the section
 * arrives, and a gold marker keeps travelling along the stage names.
 */
export function Toolkit() {
  const projects = getAllProjects();
  const stages = toolkit.map((stage) => ({
    ...stage,
    tools: stage.tools
      .map((tool) => ({
        ...tool,
        count: projects.filter((p) => p.stack.some((s) => tool.aliases.includes(s))).length,
      }))
      .sort((a, b) => b.count - a.count || Number(Boolean(b.work)) - Number(Boolean(a.work))),
  }));

  return (
    <section id="toolkit" aria-labelledby="toolkit-heading" className="px-margin py-section">
      <Reveal className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <h2 id="toolkit-heading" data-reveal className="display text-head font-medium lg:col-span-6">
          The toolkit
        </h2>
        <p data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-4 max-w-[44ch] text-muted lg:col-span-5 lg:col-start-8 lg:mt-0">
          In the order data moves through them. Each tool is ranked by how many of my projects use it,
          and marked work where I also use it in my job or my teaching.
        </p>
      </Reveal>

      <Reveal className="mt-[clamp(48px,6vw,96px)]" amount={0.1}>
        {/* The stage names, with a gold marker travelling along them like a record down the line */}
        <div className="relative mb-6 hidden h-2 overflow-hidden lg:block" aria-hidden>
          <span className="toolkit-runner absolute inset-0 block">
            <span className="absolute top-0 right-0 block size-2 bg-accent" />
          </span>
        </div>

        <div className="grid gap-x-[var(--gap)] gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, s) => (
            <div key={stage.label}>
              <h3
                data-reveal
                style={{ "--i": s * 2 } as React.CSSProperties}
                className="flex items-baseline justify-between pb-4 text-small text-muted"
              >
                <span>{stage.label}</span>
                <span className="tabular">{String(stage.tools.length)}</span>
              </h3>
              <ul>
                {stage.tools.map((tool, t) => (
                  <li
                    key={tool.name}
                    data-reveal
                    style={{ "--i": s * 2 + 1 + t * 0.5 } as React.CSSProperties}
                    className="group flex items-center gap-3 py-2.5"
                  >
                    {/* A monochrome logo where a clean one exists, otherwise the site's square mark */}
                    <span className="flex size-5 shrink-0 items-center justify-center text-muted transition-colors duration-200 group-hover:text-accent">
                      {tool.icon ? (
                        <svg aria-hidden viewBox="0 0 24 24" width="20" height="20">
                          <path d={icons[tool.icon]} fill="currentColor" />
                        </svg>
                      ) : (
                        <span aria-hidden className="block size-2 bg-current" />
                      )}
                    </span>
                    <span className="text-body leading-tight transition-transform duration-200 ease-out group-hover:translate-x-1">
                      {tool.name}
                    </span>
                    <span className="tabular ml-auto text-small whitespace-nowrap text-muted">
                      {tool.count > 0 && (
                        <>
                          <span className="group-hover:hidden">{tool.count}</span>
                          <span className="hidden group-hover:inline">
                            {tool.count} {tool.count === 1 ? "project" : "projects"}
                          </span>
                        </>
                      )}
                      {tool.count > 0 && tool.work && " · "}
                      {tool.work && "work"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
