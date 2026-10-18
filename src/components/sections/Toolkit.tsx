import { getAllProjects } from "@/lib/projects";
import { toolkit } from "@/data/toolkit";
import { logos, themedBody } from "@/components/toolkit/logos";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The toolkit as a wall of logos, four to a row (three on smaller screens), most-used first.
 * Hovering a logo eases it back and brings up its name and how many projects here use it;
 * on touch screens, which cannot hover, the names are always shown.
 */
export function Toolkit() {
  const projects = getAllProjects();
  const tools = toolkit
    .map((tool, order) => ({
      ...tool,
      order,
      count: projects.filter((p) => p.stack.some((s) => tool.aliases.includes(s))).length,
    }))
    .sort(
      (a, b) =>
        b.count - a.count || Number(Boolean(b.work)) - Number(Boolean(a.work)) || a.order - b.order,
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
          What I build with, most-used first. Hover a tool to see how many of my projects use it.
        </p>
      </Reveal>

      <Reveal className="mt-[clamp(40px,5vw,80px)]" amount={0.05}>
        <ul className="mx-auto grid max-w-[1100px] grid-cols-3 md:grid-cols-4">
          {tools.map((tool, i) => {
            const logo = logos[tool.logo];
            return (
              <li
                key={tool.name}
                data-reveal
                style={{ "--i": Math.min(i * 0.35, 8) } as React.CSSProperties}
                className="group relative flex flex-col items-center px-2 pt-[clamp(20px,3vw,32px)] pb-[clamp(44px,5vw,60px)]"
              >
                <svg
                  role="img"
                  aria-label={tool.name}
                  viewBox={`0 0 ${logo.w} ${logo.h}`}
                  preserveAspectRatio="xMidYMid meet"
                  className="h-[clamp(44px,6vw,76px)] w-[clamp(56px,8vw,100px)] text-ink transition-[transform,opacity] duration-300 ease-[var(--ease-out)] group-hover:scale-90 group-hover:opacity-80"
                  dangerouslySetInnerHTML={{ __html: themedBody(logo) }}
                />
                {/* The caption: hidden until hover, always shown where there is no hover */}
                <span className="absolute inset-x-1 bottom-[clamp(8px,1.4vw,16px)] flex translate-y-1 scale-95 flex-col items-center text-center opacity-0 transition-[transform,opacity] duration-300 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100">
                  <span className="text-small leading-tight text-ink">{tool.name}</span>
                  {tool.count > 0 && (
                    <span className="tabular text-small leading-tight text-muted [@media(hover:none)]:hidden">
                      {tool.count} {tool.count === 1 ? "project" : "projects"}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
