import type { ComponentType } from "react";
import { HeartbeatScene } from "./HeartbeatScene";
import { LakehouseScene } from "./LakehouseScene";
import { FlightScene } from "./FlightScene";
import { MusicScene } from "./MusicScene";
import { TripScene } from "./TripScene";
import { CarRentalScene } from "./CarRentalScene";
import { EcommerceScene } from "./EcommerceScene";
import { SparkStreamingScene } from "./SparkStreamingScene";
import { TmdbSparkScene } from "./TmdbSparkScene";
import { TmdbPandasScene } from "./TmdbPandasScene";
import { InventoryScene } from "./InventoryScene";
import { MlScene } from "./MlScene";
import { InsuranceScene } from "./InsuranceScene";
import { AnalysisScene } from "./AnalysisScene";
import { SocialMediaScene } from "./SocialMediaScene";

/** The animated thumbnail for each project, by slug. */
export const scenes: Record<string, ComponentType> = {
  "heartbeat-monitoring": HeartbeatScene,
  "lakehouse-ecommerce": LakehouseScene,
  "flight-price-analysis": FlightScene,
  "music-streaming-analytics": MusicScene,
  "trip-data-event-pipeline": TripScene,
  "car-rental-analytics": CarRentalScene,
  "ecommerce-event-driven-pipeline": EcommerceScene,
  "realtime-ecommerce-spark-streaming": SparkStreamingScene,
  "tmdb-pyspark": TmdbSparkScene,
  "tmdb-pandas": TmdbPandasScene,
  "inventory-order-sql": InventoryScene,
  "ml-prediction-notebooks": MlScene,
  "insurance-cost-app": InsuranceScene,
  "data-analysis-collection": AnalysisScene,
  "social-media-dashboard": SocialMediaScene,
};
