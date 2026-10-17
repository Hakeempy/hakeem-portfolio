import { Hero } from "@/components/sections/Hero";
import { WorkPanels } from "@/components/sections/WorkPanels";
import { LivePipeline } from "@/components/sections/LivePipeline";
import { WorkList } from "@/components/sections/WorkList";
import { Path } from "@/components/sections/Path";
import { Teaching } from "@/components/sections/Teaching";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getFeaturedProjects, getOtherProjects } from "@/lib/projects";

// Covers that are white by nature (AWS consoles, Airflow) get the room's dimmer treatment.
const isLight = (cover?: string) => !!cover && !/grafana/.test(cover);

export default function Home() {
  const featured = getFeaturedProjects().map(
    ({ slug, title, year, fact, cover, coverAlt, focus }) => ({
      slug,
      title,
      year,
      fact,
      cover,
      coverAlt,
      focus,
      light: isLight(cover),
    }),
  );
  const others = getOtherProjects().map(
    ({ slug, title, summary, year, fact, stack, cover, coverAlt }) => ({
      slug,
      title,
      summary,
      year,
      fact,
      stack,
      cover,
      coverAlt,
    }),
  );

  return (
    <>
      <Hero />
      <main>
        <WorkPanels projects={featured} />
        <LivePipeline />
        <WorkList projects={others} />
        <Path />
        <Teaching />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
