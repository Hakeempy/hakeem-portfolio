import { getAllProjects } from "@/lib/projects";
import { toolkit } from "@/data/toolkit";
import { logos, themedBody } from "@/components/toolkit/logos";
import { Reveal } from "@/components/motion/Reveal";
import { ToolkitExplorer, type ExplorerTool } from "@/components/toolkit/ToolkitExplorer";

/**
 * The toolkit: a compact wall of logos beside a spotlight that names the tool under the cursor
 * and lists the projects it powers. Works out, from the project pages themselves, which projects
 * use each tool, so the order and the links stay true as projects change.
 */
export function Toolkit() {
  const projects = getAllProjects();
  const tools: ExplorerTool[] = toolkit
    .map((tool, order) => {
      const used = projects.filter((p) => p.stack.some((s) => tool.aliases.includes(s)));
      const logo = logos[tool.logo];
      return {
        name: tool.name,
        stage: tool.stage,
        work: Boolean(tool.work),
        order,
        logo: { w: logo.w, h: logo.h, body: themedBody(logo) },
        projects: used.map((p) => ({ slug: p.slug, title: p.title })),
      };
    })
    .sort(
      (a, b) =>
        b.projects.length - a.projects.length ||
        Number(b.work) - Number(a.work) ||
        a.order - b.order,
    );

  return (
    <section id="toolkit" aria-labelledby="toolkit-heading" className="px-margin py-section">
      <Reveal className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
        <h2 id="toolkit-heading" data-reveal className="display text-head font-medium lg:col-span-6">
          The toolkit
        </h2>
        <p
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-4 max-w-[40ch] text-muted lg:col-span-5 lg:col-start-8 lg:mt-0"
        >
          The tools I build with, most-used first. Pick one to see the projects it powers.
        </p>
      </Reveal>
      <ToolkitExplorer tools={tools} />
    </section>
  );
}
