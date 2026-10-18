import { Hero } from "@/components/sections/Hero";
import { WorkPanels } from "@/components/sections/WorkPanels";
import { LivePipeline } from "@/components/sections/LivePipeline";
import { WorkList } from "@/components/sections/WorkList";
import { Path } from "@/components/sections/Path";
import { Teaching } from "@/components/sections/Teaching";
import { Certification } from "@/components/sections/Certification";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { getFeaturedProjects, getOtherProjects } from "@/lib/projects";

export default function Home() {
  const featured = getFeaturedProjects().map(({ slug, title, hook, year, fact, stack }) => ({
    slug,
    title,
    hook,
    year,
    fact,
    stack,
  }));
  const others = getOtherProjects().map(({ slug, title, summary, year, fact, stack }) => ({
    slug,
    title,
    summary,
    year,
    fact,
    stack,
  }));

  return (
    <>
      <Hero />
      <main>
        <WorkPanels projects={featured} />
        <LivePipeline />
        <WorkList projects={others} />
        <Path />
        <Certification />
        <Toolkit />
        <Teaching />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
