import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function Footer() {
  return (
    <footer className="relative h-[88svh] overflow-hidden md:h-svh">
      <Image
        src="/images/found/independence-arch-accra-ghana1.jpg"
        alt="Independence Arch in Accra, its black star above the words Freedom and Justice"
        fill
        sizes="100vw"
        className="found-photo object-cover"
        style={{ objectPosition: "50% 45%" }}
      />

      <div className="absolute inset-x-0 top-0 flex flex-col gap-6 px-margin pt-8 text-base sm:flex-row sm:justify-between">
        <ul className="space-y-1">
          <li>
            <a className="link" href="#work">Work</a>
          </li>
          <li>
            <Link className="link" href="/projects">All projects</Link>
          </li>
          <li>
            <a className="link" href="#path">About</a>
          </li>
          <li>
            <a className="link" href="#teaching">Teaching</a>
          </li>
        </ul>
        <ul className="space-y-1 sm:text-right">
          <li>
            <a className="link" href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            <a className="link" href={site.links.linkedin}>LinkedIn</a>
          </li>
          <li>
            <a className="link" href={site.links.github}>GitHub</a>
          </li>
        </ul>
      </div>

      <Reveal className="absolute inset-x-0 bottom-0 px-margin pb-6">
        <p aria-hidden data-reveal className="text-display leading-[0.8] font-medium tracking-[-0.045em] whitespace-nowrap">
          {site.name}
        </p>
        <p className="mt-5 text-small text-muted">
          &copy; 2026 {site.name}. Photograph:{" "}
          <a
            className="link"
            href="https://commons.wikimedia.org/w/index.php?curid=4730648"
          >
            &ldquo;Independence Arch - Accra, Ghana1&rdquo; by George Appiah
          </a>
          ,{" "}
          <a className="link" href="https://creativecommons.org/licenses/by/2.0/">
            CC BY 2.0
          </a>
          , via Wikimedia Commons.
        </p>
      </Reveal>
    </footer>
  );
}
