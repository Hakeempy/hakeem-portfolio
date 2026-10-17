/**
 * Further screens from a project's own running pipeline, shown under its write-up.
 * Keyed by project slug; the cover in the frontmatter is not repeated here.
 */
export type Screen = {
  src: string;
  alt: string;
  caption: string;
  light: boolean;
  /** Pixel width and height of the capture, so it is shown whole */
  size: [number, number];
};

export const projectScreens: Record<string, Screen[]> = {
  "heartbeat-monitoring": [
    {
      src: "/images/work/heartbeat-kafka.png",
      size: [2400, 552],
      alt: "Kafka-UI topics list: the heartbeats topic holds 27,649 messages, 5 MB, in one partition",
      caption: "Kafka-UI: the heartbeats topic, 27,649 messages deep.",
      light: false,
    },
  ],
  "flight-price-analysis": [
    {
      src: "/images/work/flight-airflow.png",
      size: [2400, 1011],
      alt: "Airflow graph of flight_price_pipeline: ingest_csv_to_mysql, validate_data, transform_and_compute_kpis and load_to_postgres, all successful",
      caption: "Airflow: four tasks, from the CSV in MySQL to the KPIs in PostgreSQL.",
      light: true,
    },
  ],
  "car-rental-analytics": [
    {
      src: "/images/work/lakehouse-athena.png",
      size: [2400, 1198],
      alt: "Athena query editor on the car_rental_analytics database returning daily revenue of 156,020 for 2024-02-17",
      caption: "Athena: daily revenue queried straight from the processed tables.",
      light: true,
    },
  ],
  "ecommerce-event-driven-pipeline": [
    {
      src: "/images/work/ecommerce-stepfn.png",
      size: [2400, 1483],
      alt: "Step Functions graph: CheckFileThreshold, EvaluateThreshold, ValidateFiles and TransformFiles on ECS, then ResetLock, with failures sent to SNS and CloudWatch",
      caption: "Step Functions: validation and transformation on ECS, failures sent to SNS.",
      light: true,
    },
  ],
  "music-streaming-analytics": [
    {
      src: "/images/work/music-metrics.png",
      size: [2400, 1690],
      alt: "DynamoDB genre_metrics table with average listening time and total listens per genre for 2024-06-25",
      caption: "DynamoDB: the genre metrics the DAG writes each day.",
      light: true,
    },
  ],
};

// Screens that are white by nature (AWS consoles, Airflow) get the room's dimmer treatment.
export const isLightScreen = (src?: string) => !!src && !/grafana|kafka/.test(src);
