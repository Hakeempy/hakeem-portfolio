import type { Metadata } from "next";
import { SiteNav } from "@/components/projects/SiteNav";
import { PageClose } from "@/components/projects/PageClose";
import { CoursesHero } from "@/components/courses/CoursesHero";
import { TeachingFigures, Courses, Consulting, HowItWorks } from "@/components/courses/CoursesSections";
import { CoursesContact } from "@/components/courses/CoursesContact";

export const metadata: Metadata = {
  title: "Courses & consulting",
  description:
    "Courses in SQL, Python, Excel and Power BI / Tableau from Hakeem Wikireh, and consulting on analysis, dashboards and pipelines.",
};

export default function CoursesPage() {
  return (
    <>
      <SiteNav current="courses" />
      <main>
        <CoursesHero />
        <TeachingFigures />
        <Courses />
        <Consulting />
        <HowItWorks />
        <CoursesContact />
      </main>
      <PageClose />
    </>
  );
}
