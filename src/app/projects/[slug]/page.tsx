import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProject } from "@/lib/projects";
import { isLightScreen, projectScreens, type Screen } from "@/data/screens";
import { SiteNav } from "@/components/projects/SiteNav";
import { ProjectScene } from "@/components/thumbs/ProjectScene";
import { ProjectPrint } from "@/components/projects/ProjectPrint";
import { PageClose } from "@/components/projects/PageClose";
import { mdxComponents } from "@/components/projects/mdx";
import { Reveal } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

// The three projects after this one in the running order, wrapping round to the start.
function nextProjects(slug: string) {
  const all = getAllProjects();
  const at = all.findIndex((project) => project.slug === slug);
  return [1, 2, 3].map((step) => all[(at + step) % all.length]);
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  // The project's own screenshots, the old cover first, shown whole under the write-up.
  const cover: Screen[] =
    project.cover && project.coverSize
      ? [
          {
            src: project.cover,
            size: project.coverSize,
            alt: project.coverAlt ?? "",
            caption: project.coverAlt ?? "",
            light: isLightScreen(project.cover),
          },
        ]
      : [];
  const screens = [...cover, ...(projectScreens[project.slug] ?? [])];
  const [next, ...after] = nextProjects(project.slug);
  // Long titles step down a size on phones so they still hold to two lines.
  const titleSize =
    project.title.length > 38 ? "text-lead sm:text-head" : "text-head";

  return (
    <>
      <SiteNav />
      <main>
        <header className="px-margin pt-[clamp(56px,9svh,120px)] lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-[var(--gap)]">
          <h1
            data-rise
            style={{ "--i": 1 } as React.CSSProperties}
            className={`display ${titleSize} max-w-[22ch] font-medium [text-wrap:balance] lg:col-span-9`}
          >
            {project.title}
          </h1>
          <p
            data-rise
            style={{ "--i": 2 } as React.CSSProperties}
            className="tabular mt-4 text-lead leading-tight text-muted lg:col-span-3 lg:mt-0 lg:pb-[0.35em] lg:text-right"
          >
            {project.fact}
          </p>
        </header>

        <div
          data-rise
          style={{ "--i": 3 } as React.CSSProperties}
          className="mt-[clamp(32px,4vw,64px)] px-margin lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]"
        >
          <div className="lg:col-span-8 lg:col-start-3">
            <ProjectScene slug={project.slug} />
          </div>
        </div>

        <section
          aria-label="About this project"
          className="px-margin pt-[clamp(64px,8vw,140px)] pb-section lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]"
        >
          <Reveal className="lg:sticky lg:top-margin lg:col-span-3 lg:self-start">
            <dl className="grid grid-cols-2 gap-x-[var(--gap)] gap-y-6 lg:grid-cols-1">
              <div data-reveal>
                <dt className="text-small text-muted">Year</dt>
                <dd className="tabular mt-1">{project.year}</dd>
              </div>
              <div data-reveal style={{ "--i": 1 } as React.CSSProperties}>
                <dt className="text-small text-muted">Built with</dt>
                <dd className="mt-1">
                  <ul>
                    {project.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              {(project.repo || project.demo) && (
                <div
                  data-reveal
                  style={{ "--i": 2 } as React.CSSProperties}
                  className="col-span-2 lg:col-span-1"
                >
                  <dt className="text-small text-muted">See it</dt>
                  <dd className="mt-1 space-y-1">
                    {project.repo && (
                      <a
                        href={project.repo}
                        className="block underline decoration-muted underline-offset-[0.22em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
                      >
                        The code on GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        className="block underline decoration-muted underline-offset-[0.22em] transition-[text-decoration-color] duration-200 hover:decoration-ink"
                      >
                        The running app
                      </a>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>

          <div className="mt-16 lg:col-span-7 lg:col-start-5 lg:mt-0">
            <Reveal>
              <p data-reveal className="max-w-[40ch] text-lead leading-[1.3]">
                {project.summary}
              </p>
            </Reveal>
            <article className="mt-[clamp(56px,6vw,96px)]">
              <MDXRemote source={project.body} components={mdxComponents} />
            </article>
          </div>
        </section>

        {screens.length > 0 && (
          <section
            aria-labelledby="screens-heading"
            className="px-margin pb-section"
          >
            <h2
              id="screens-heading"
              className="display mb-[clamp(40px,5vw,80px)] text-head font-medium"
            >
              Inside the project
            </h2>
            <div className="space-y-[clamp(56px,6vw,112px)]">
              {screens.map((screen) => (
                <Reveal key={screen.src} amount={0.25}>
                  {/* Small charts keep their own width instead of being blown up past it */}
                  <figure
                    style={{
                      maxWidth:
                        screen.size[0] >= 1600 ? undefined : screen.size[0],
                    }}
                  >
                    {/* Shown whole, at its own proportions, so the numbers in it can be read */}
                    <div
                      data-reveal="shutter"
                      className="relative overflow-hidden bg-surface"
                      style={{
                        aspectRatio: `${screen.size[0]} / ${screen.size[1]}`,
                      }}
                    >
                      <Image
                        src={screen.src}
                        alt={screen.alt}
                        fill
                        sizes="100vw"
                        className={`object-cover ${screen.light ? "lit-light" : ""}`}
                      />
                    </div>
                    <figcaption
                      data-reveal
                      style={{ "--i": 1 } as React.CSSProperties}
                      className="mt-4 max-w-[60ch] text-small text-muted"
                    >
                      {screen.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section
          aria-labelledby="next-heading"
          className="px-margin pb-section"
        >
          <h2
            id="next-heading"
            className="display mb-[clamp(40px,5vw,80px)] text-head font-medium"
          >
            More work
          </h2>
          <div className="flex flex-col gap-y-16 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-[var(--gap)]">
            <div className="lg:col-span-7">
              <ProjectPrint project={next} headingLevel="h3" />
            </div>
            <div className="flex flex-col gap-y-16 lg:col-span-4 lg:col-start-9 lg:mt-[10vw]">
              {after.map((project) => (
                <ProjectPrint
                  key={project.slug}
                  project={project}
                  headingLevel="h3"
                  showHook={false}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <PageClose />
    </>
  );
}
