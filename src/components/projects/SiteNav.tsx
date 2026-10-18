import Link from "next/link";
import { site } from "@/data/site";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/** The plain bar for pages other than home: wordmark, three links, one action. */
export function SiteNav({ current }: { current?: "projects" }) {
  return (
    <nav
      aria-label="Main"
      data-rise
      className="relative z-20 flex items-start justify-between px-margin pt-margin text-small"
    >
      <div className="flex items-baseline gap-6 md:gap-8">
        <Link href="/" className="link font-medium">
          {site.name}
        </Link>
        <ul className="hidden gap-6 text-muted md:flex">
          <li>
            <Link
              className={`link hover:text-ink ${current === "projects" ? "text-ink" : ""}`}
              href="/projects"
              aria-current={current === "projects" ? "page" : undefined}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link className="link hover:text-ink" href="/#path">
              About
            </Link>
          </li>
          <li>
            <Link className="link hover:text-ink" href="/#teaching">
              Teaching
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-5 md:gap-7">
        <ThemeToggle />
        <Link href="/#contact" className="button">
          Work with me
        </Link>
      </div>
    </nav>
  );
}
