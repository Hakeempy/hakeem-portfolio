import Link from "next/link";
import { site } from "@/data/site";
import { experience } from "@/data/experience";
import { getFeaturedProjects } from "@/lib/projects";

// Wireframe only: sections in order, no styling yet.
export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <main className="mx-auto w-full max-w-3xl space-y-16 px-4 py-16">
      <section>
        <h1 className="text-3xl font-semibold">{site.name}</h1>
        <p>{site.role}</p>
        <p>{site.tagline}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Selected work</h2>
        <ul>
          {featured.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="underline">
                {project.title}
              </Link>
              <p>{project.summary}</p>
            </li>
          ))}
        </ul>
        <Link href="/projects" className="underline">
          All projects
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Experience</h2>
        <ul>
          {experience.map((role) => (
            <li key={`${role.company}-${role.start}`}>
              {role.title}, {role.company} ({role.start} to {role.end})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Contact</h2>
        <a href={`mailto:${site.email}`} className="underline">
          {site.email}
        </a>
      </section>
    </main>
  );
}
