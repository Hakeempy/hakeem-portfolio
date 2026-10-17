export type Stage = {
  role: string;
  where: string;
  years: string;
  sentence: string;
  image: { src: string; alt: string; width: number; height: number; night?: boolean };
  // night: a white chart shown inverted so it sits in the dark room
};

// The career, in the order the data moved through it. Sentences are drafts for Hakeem to confirm.
export const path: Stage[] = [
  {
    role: "Data analyst",
    where: "Where it started",
    years: "2021",
    sentence:
      "I started where most people meet data: Excel, SQL and Power BI, turning messy tables into answers someone could act on.",
    image: {
      src: "/images/path/analyst-forest-fires.png",
      night: true,
      alt: "Bar chart from my analysis of forest fires in Brazil, by year from 1998 to 2017",
      width: 859,
      height: 549,
    },
  },
  {
    role: "Data analytics instructor",
    where: "Self-employed",
    years: "2022 to now",
    sentence:
      "I have taught Excel, Power BI, Tableau, SQL and Python to more than 100 students and professionals, and I consult for clients alongside it.",
    image: {
      src: "/images/path/instructor-youtube.png",
      alt: "Missing-values map of the Top 5,000 YouTube channels dataset",
      width: 537,
      height: 507,
    },
  },
  {
    role: "Data scientist",
    where: "Ghana Techlab",
    years: "2022 to 2023",
    sentence:
      "Model-ready datasets, feature engineering that improved model performance by 10%, more than 15 dashboards, and RAG chatbots on LangChain and Gemini.",
    image: {
      src: "/images/path/scientist-segmentation.png",
      night: true,
      alt: "Scatter plot of five customer segments by annual income and spending score",
      width: 699,
      height: 704,
    },
  },
  {
    role: "Data engineer",
    where: "Amalitech, then Bosonit",
    years: "2025 to now",
    sentence:
      "Real-time and batch pipelines on AWS, Kafka microservices feeding IoT platforms across production sites, and the CI/CD that keeps them running.",
    image: {
      src: "/images/work/heartbeat-grafana.png",
      alt: "Grafana dashboard from my real-time heart-rate monitoring pipeline",
      width: 2400,
      height: 1196,
    },
  },
];
