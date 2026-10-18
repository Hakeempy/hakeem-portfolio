export type Stage = {
  role: string;
  where: string;
  years: string;
  sentence: string;
  /** Which story scene illustrates this stage (src/components/thumbs/scenes/path) */
  scene: "analyst" | "instructor" | "scientist" | "engineer";
};

// The career, in the order the data moved through it. Sentences are drafts for Hakeem to confirm.
export const path: Stage[] = [
  {
    role: "Data analyst",
    where: "Where it started",
    years: "2021",
    sentence:
      "I started where most people meet data: Excel, SQL and Power BI, turning messy tables into answers someone could act on.",
    scene: "analyst",
  },
  {
    role: "Course instructor and consultant",
    where: "Self-employed",
    years: "2022 to now",
    sentence:
      "I have taught Excel, Power BI, Tableau, SQL and Python to more than 100 students and professionals, and I consult for clients alongside it.",
    scene: "instructor",
  },
  {
    role: "Data scientist",
    where: "Ghana Techlab",
    years: "2022 to 2023",
    sentence:
      "Model-ready datasets, feature engineering that improved model performance by 10%, more than 15 dashboards, and RAG chatbots on LangChain and Gemini.",
    scene: "scientist",
  },
  {
    role: "Data engineer",
    where: "Amalitech, then Bosonit",
    years: "2025 to now",
    sentence:
      "Real-time and batch pipelines on AWS, Kafka microservices feeding IoT platforms across production sites, and the CI/CD that keeps them running. AWS Certified Data Engineer since 2025.",
    scene: "engineer",
  },
];
