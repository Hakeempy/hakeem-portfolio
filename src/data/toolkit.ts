import type { IconName } from "@/components/thumbs/icons";

export type Tool = {
  name: string;
  icon?: IconName;
  /** Names this tool goes by in project stacks; a project counts once however many match. */
  aliases: string[];
  /** Used in my job or my teaching, per the resume, whether or not a project here uses it. */
  work?: boolean;
};

export type Stage = { label: string; tools: Tool[] };

// The tools, in the order data moves through them. Within a stage the page sorts by how many
// projects use each tool, so the order reflects real use rather than a self-rating.
export const toolkit: Stage[] = [
  {
    label: "Ingest",
    tools: [
      { name: "Apache Kafka", icon: "kafka", aliases: ["Apache Kafka", "Kafka"], work: true },
      { name: "Amazon Kinesis", aliases: ["Amazon Kinesis", "Kinesis"] },
      { name: "Amazon S3", aliases: ["S3", "Amazon S3"] },
      { name: "REST APIs", aliases: ["TMDB API", "REST APIs"] },
    ],
  },
  {
    label: "Process",
    tools: [
      { name: "Python", icon: "python", aliases: ["Python"], work: true },
      {
        name: "Apache Spark",
        icon: "spark",
        aliases: ["PySpark", "Apache Spark", "Spark Structured Streaming", "EMR Serverless"],
      },
      { name: "AWS Glue", aliases: ["AWS Glue"] },
      { name: "Docker", icon: "docker", aliases: ["Docker"], work: true },
      { name: "Step Functions", aliases: ["Step Functions"] },
      { name: "Apache Airflow", icon: "airflow", aliases: ["Apache Airflow", "Apache Airflow (MWAA)"] },
      { name: "GitHub Actions", icon: "githubactions", aliases: ["GitHub Actions"] },
      { name: "AWS Lambda", aliases: ["AWS Lambda"] },
    ],
  },
  {
    label: "Store and serve",
    tools: [
      { name: "PostgreSQL", icon: "postgresql", aliases: ["PostgreSQL"] },
      { name: "DynamoDB", aliases: ["DynamoDB"] },
      { name: "MySQL", icon: "mysql", aliases: ["MySQL"] },
      { name: "Athena", aliases: ["Athena"] },
      { name: "Grafana", icon: "grafana", aliases: ["Grafana"], work: true },
      { name: "Delta Lake", aliases: ["Delta Lake"] },
      { name: "Streamlit", icon: "streamlit", aliases: ["Streamlit"] },
      { name: "Amazon Redshift", aliases: ["Redshift", "Amazon Redshift"], work: true },
    ],
  },
  {
    label: "Analyse and teach",
    tools: [
      { name: "SQL", aliases: ["SQL"], work: true },
      { name: "Power BI", aliases: ["Power BI", "Power Query", "DAX"], work: true },
      { name: "pandas", icon: "pandas", aliases: ["Pandas", "pandas"] },
      { name: "Jupyter", icon: "jupyter", aliases: ["Jupyter"] },
      { name: "scikit-learn", icon: "sklearn", aliases: ["scikit-learn"] },
      { name: "Excel", aliases: ["Excel"], work: true },
      { name: "Tableau", aliases: ["Tableau"], work: true },
      { name: "LangChain", icon: "langchain", aliases: ["LangChain"], work: true },
      { name: "Gemini", icon: "gemini", aliases: ["Gemini"], work: true },
    ],
  },
];
