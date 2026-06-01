import type { NotificationData } from "./NotificationData";

export type RecommendationMode = "telemetry" | "simulation";

export type RecommendationError = "timeout" | "server" | "network";

export type RecommendationResult = {
  data?: NotificationData;
  error?: RecommendationError;
};

type RecommendationResponse = {
  mensaje: string;
  severidad: string;
  comando: string | null;
};

type InternalRequest = {
  mode: RecommendationMode;
  plantName?: string;
  temperatura?: number;
  humedad?: number;
};

export type { RecommendationResponse, InternalRequest as RecommendationRequest };
