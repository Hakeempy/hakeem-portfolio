import Link from "next/link";
import { site } from "@/data/site";
import { DataJourney } from "@/components/three/DataJourney";

/**
 * The hero: the raw-to-gold particle pipeline fills the first screen, with the name, the
 * headline and one action set over it. No screenshots, no empty quadrants.
 */
export function Hero() {
  return (
    <header className="relative h-svh min-h-[640px] overflow-hidden">
      <DataJourney className="absolute inset-0" />

      <nav
        aria-label="Main"
        className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-margin pt-margin text-small"
      >
        <div className="flex items-baseline gap-6 md:gap-8">
          <Link href="/" className="font-medium">
            {site.name}
          </Link>
          <ul className="hidden gap-6 text-muted md:flex">
            <li>
              <a className="link hover:text-ink" href="#work">
                Work
              </a>
            </li>
            <li>
              <a className="link hover:text-ink" href="#path">
                About
              </a>
            </li>
            <li>
              <a className="link hover:text-ink" href="#teaching">
                Teaching
              </a>
            </li>
          </ul>
        </div>
        <a href="#contact" className="button">
          Work with me
        </a>
      </nav>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid gap-6 px-margin pb-[clamp(24px,4vw,56px)] lg:grid-cols-12 lg:items-end">
        <h1
          data-rise
          style={{ "--i": 1 } as React.CSSProperties}
          className="display max-w-[16ch] text-[clamp(2.5rem,1rem+5.4vw,6.5rem)] leading-[0.98] font-medium tracking-[-0.04em] lg:col-span-8"
        >
          I build the pipelines your data runs&nbsp;on.
        </h1>
        <div data-rise style={{ "--i": 3 } as React.CSSProperties} className="pointer-events-auto lg:col-span-3 lg:col-start-10">
          <p className="max-w-[30ch] text-muted">
            Data engineer in Accra. Analyst first, teacher still. From a raw record to a trusted
            number, on AWS.
          </p>
          <a href="#work" className="link mt-5 inline-block text-ink">
            See the pipelines
          </a>
          <p className="mt-6 text-small text-muted">
            Click the stream to send a surge of records.
          </p>
        </div>
      </div>
    </header>
  );
}
