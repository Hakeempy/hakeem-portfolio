export type Role = {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
};

// Most recent first. Source: resume (2026-10-17).
export const experience: Role[] = [
  {
    title: "Data Engineer",
    company: "Bosonit",
    location: "Spain",
    start: "2025-09",
    end: "Present",
    highlights: [
      "Python pipeline agents bringing IoT sensor data from REST APIs into cloud monitoring platforms across production sites.",
      "Real-time and batch ETL with scheduling, validation and error handling.",
      "Dockerized microservices consuming Kafka and forwarding to cloud IoT brokers.",
      "Grafana dashboards, CI/CD setup and Alembic schema migrations.",
    ],
  },
  {
    title: "Data Engineer (Graduate Trainee)",
    company: "Amalitech",
    location: "Accra, Ghana",
    start: "2025-04",
    end: "2025-09",
    highlights: [
      "Data pipelines feeding Power BI dashboards.",
      "SQL and Power Query for data quality and efficient refresh cycles.",
      "BI reporting, data warehouse design and dashboard publishing.",
    ],
  },
  {
    title: "Data Scientist (NSS)",
    company: "Ghana Techlab",
    location: "Accra, Ghana",
    start: "2022",
    end: "2023",
    highlights: [
      "Engineered model-ready datasets, improving data quality by 20%.",
      "EDA and feature engineering that lifted model performance by 10%.",
      "15+ dashboards in Power BI and Python for stakeholders.",
      "RAG chatbots with LangChain, Gemini APIs and vector databases.",
    ],
  },
  {
    title: "Data Analytics Instructor & Consultant",
    company: "Self-employed",
    location: "Accra, Ghana",
    start: "2022",
    end: "Present",
    highlights: [
      "Designed and taught data analytics courses to 100+ students and professionals.",
      "Excel, Power BI, Tableau, SQL and Python, with a 95% satisfaction rate.",
      "Ongoing consulting for clients.",
    ],
  },
];
