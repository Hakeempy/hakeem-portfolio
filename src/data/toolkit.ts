export type StageKey = "ingest" | "process" | "store" | "analyse";

export const STAGES: { key: StageKey; label: string }[] = [
  { key: "ingest", label: "Ingest" },
  { key: "process", label: "Process" },
  { key: "store", label: "Store" },
  { key: "analyse", label: "Analyse" },
];

export type Tool = {
  name: string;
  /** Key into src/components/toolkit/logos.ts */
  logo: string;
  stage: StageKey;
  /** Names this tool goes by in project stacks; a project counts once however many match. */
  aliases: string[];
  /** Used in my job or teaching (resume). Not shown on the grid; it breaks ties in the order. */
  work?: boolean;
};

// The page shows these most-used first: by how many projects on the site use each tool, then
// tools from my job and teaching. So the order reflects real use rather than a self-rating.
export const toolkit: Tool[] = [
  { name: "Python", logo: "python", stage: "process", aliases: ["Python"], work: true },
  {
    name: "Apache Spark",
    logo: "spark",
    stage: "process",
    aliases: ["PySpark", "Apache Spark", "Spark Structured Streaming", "EMR Serverless"],
  },
  { name: "Amazon S3", logo: "s3", stage: "ingest", aliases: ["S3", "Amazon S3"] },
  { name: "AWS Glue", logo: "glue", stage: "process", aliases: ["AWS Glue"] },
  { name: "Docker", logo: "docker", stage: "process", aliases: ["Docker"], work: true },
  { name: "Apache Kafka", logo: "kafka", stage: "ingest", aliases: ["Apache Kafka", "Kafka"], work: true },
  { name: "Amazon Kinesis", logo: "kinesis", stage: "ingest", aliases: ["Amazon Kinesis", "Kinesis"] },
  {
    name: "Apache Airflow",
    logo: "airflow",
    stage: "process",
    aliases: ["Apache Airflow", "Apache Airflow (MWAA)"],
  },
  { name: "AWS Step Functions", logo: "stepfunctions", stage: "process", aliases: ["Step Functions"] },
  { name: "AWS Lambda", logo: "lambda", stage: "process", aliases: ["AWS Lambda"] },
  { name: "PostgreSQL", logo: "postgresql", stage: "store", aliases: ["PostgreSQL"] },
  { name: "MySQL", logo: "mysql", stage: "store", aliases: ["MySQL"] },
  { name: "Amazon DynamoDB", logo: "dynamodb", stage: "store", aliases: ["DynamoDB"] },
  { name: "Amazon Athena", logo: "athena", stage: "store", aliases: ["Athena"] },
  { name: "Amazon Redshift", logo: "redshift", stage: "store", aliases: ["Redshift", "Amazon Redshift"], work: true },
  { name: "Delta Lake", logo: "deltalake", stage: "store", aliases: ["Delta Lake"] },
  { name: "SQL", logo: "sql", stage: "analyse", aliases: ["SQL"], work: true },
  { name: "pandas", logo: "pandas", stage: "analyse", aliases: ["Pandas", "pandas"] },
  { name: "Jupyter", logo: "jupyter", stage: "analyse", aliases: ["Jupyter"] },
  { name: "scikit-learn", logo: "sklearn", stage: "analyse", aliases: ["scikit-learn"] },
  { name: "Power BI", logo: "powerbi", stage: "analyse", aliases: ["Power BI", "Power Query", "DAX"], work: true },
  { name: "Tableau", logo: "tableau", stage: "analyse", aliases: ["Tableau"], work: true },
  { name: "Excel", logo: "excel", stage: "analyse", aliases: ["Excel"], work: true },
  { name: "Grafana", logo: "grafana", stage: "analyse", aliases: ["Grafana"], work: true },
  { name: "Streamlit", logo: "streamlit", stage: "analyse", aliases: ["Streamlit"] },
  { name: "GitHub Actions", logo: "githubactions", stage: "process", aliases: ["GitHub Actions"] },
  { name: "Portainer", logo: "portainer", stage: "process", aliases: ["Portainer"], work: true },
  { name: "REST APIs", logo: "openapi", stage: "ingest", aliases: ["TMDB API", "REST APIs"] },
  { name: "LangChain", logo: "langchain", stage: "analyse", aliases: ["LangChain"], work: true },
];
