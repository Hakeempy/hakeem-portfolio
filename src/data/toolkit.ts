export type Tool = {
  name: string;
  /** Key into src/components/toolkit/logos.ts */
  logo: string;
  /** Names this tool goes by in project stacks; a project counts once however many match. */
  aliases: string[];
  /** Used in my job or teaching (resume). Not shown; it only breaks ties in the order. */
  work?: boolean;
};

// The page shows these most-used first: by how many projects on the site use each tool, then
// tools from my job and teaching. So the order reflects real use rather than a self-rating.
export const toolkit: Tool[] = [
  { name: "Python", logo: "python", aliases: ["Python"], work: true },
  {
    name: "Apache Spark",
    logo: "spark",
    aliases: ["PySpark", "Apache Spark", "Spark Structured Streaming", "EMR Serverless"],
  },
  { name: "Amazon S3", logo: "s3", aliases: ["S3", "Amazon S3"] },
  { name: "AWS Glue", logo: "glue", aliases: ["AWS Glue"] },
  { name: "Docker", logo: "docker", aliases: ["Docker"], work: true },
  { name: "Apache Kafka", logo: "kafka", aliases: ["Apache Kafka", "Kafka"], work: true },
  { name: "Amazon Kinesis", logo: "kinesis", aliases: ["Amazon Kinesis", "Kinesis"] },
  { name: "Apache Airflow", logo: "airflow", aliases: ["Apache Airflow", "Apache Airflow (MWAA)"] },
  { name: "AWS Step Functions", logo: "stepfunctions", aliases: ["Step Functions"] },
  { name: "AWS Lambda", logo: "lambda", aliases: ["AWS Lambda"] },
  { name: "PostgreSQL", logo: "postgresql", aliases: ["PostgreSQL"] },
  { name: "MySQL", logo: "mysql", aliases: ["MySQL"] },
  { name: "Amazon DynamoDB", logo: "dynamodb", aliases: ["DynamoDB"] },
  { name: "Amazon Athena", logo: "athena", aliases: ["Athena"] },
  { name: "Amazon Redshift", logo: "redshift", aliases: ["Redshift", "Amazon Redshift"], work: true },
  { name: "Delta Lake", logo: "deltalake", aliases: ["Delta Lake"] },
  { name: "SQL", logo: "sql", aliases: ["SQL"], work: true },
  { name: "pandas", logo: "pandas", aliases: ["Pandas", "pandas"] },
  { name: "Jupyter", logo: "jupyter", aliases: ["Jupyter"] },
  { name: "scikit-learn", logo: "sklearn", aliases: ["scikit-learn"] },
  { name: "Power BI", logo: "powerbi", aliases: ["Power BI", "Power Query", "DAX"], work: true },
  { name: "Tableau", logo: "tableau", aliases: ["Tableau"], work: true },
  { name: "Excel", logo: "excel", aliases: ["Excel"], work: true },
  { name: "Grafana", logo: "grafana", aliases: ["Grafana"], work: true },
  { name: "Streamlit", logo: "streamlit", aliases: ["Streamlit"] },
  { name: "GitHub Actions", logo: "githubactions", aliases: ["GitHub Actions"] },
  { name: "Portainer", logo: "portainer", aliases: ["Portainer"], work: true },
  { name: "REST APIs", logo: "openapi", aliases: ["TMDB API", "REST APIs"] },
  { name: "LangChain", logo: "langchain", aliases: ["LangChain"], work: true },
  { name: "Google Gemini", logo: "gemini", aliases: ["Gemini"], work: true },
];
