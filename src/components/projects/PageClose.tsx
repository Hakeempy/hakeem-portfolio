import Link from "next/link";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

/** The close for the project pages: an invitation, the ways to reach Hakeem, and the name at full width. */
export function PageClose() {
  const links = [
    { label: site.email, href: `mailto:${site.email}` },
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
  ];

  return (
    <footer className="bg-surface px-margin pt-[clamp(96px,10vw,160px)] pb-6">
      <Reveal className="lg:grid lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <h2 data-reveal className="display text-head font-medium lg:col-span-6">
          Bring me a data&nbsp;problem.
        </h2>
        <ul
          data-reveal
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-8 space-y-2 text-lead leading-snug lg:col-span-4 lg:col-start-9 lg:mt-0"
        >
          {links.map((link) => (
            <li key={link.href}>
              <a className="link break-words" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-4 text-body text-muted">
            <Link className="link hover:text-ink" href="/">
              Back to the home page
            </Link>
          </li>
        </ul>
      </Reveal>

      <Reveal className="mt-[clamp(96px,12vw,200px)]">
        <p
          aria-hidden
          data-reveal
          className="text-display leading-[0.9] font-medium tracking-[-0.045em] sm:whitespace-nowrap"
        >
          {/* On phones the name breaks onto two lines rather than running off the edge */}
          {site.name}
        </p>
        <p className="mt-5 text-small text-muted">
          &copy; 2026 {site.name}. Made in {site.location}.
        </p>
      </Reveal>
    </footer>
  );
}
