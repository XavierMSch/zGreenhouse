const API_BASE_URL = "http://localhost:8000";

type RecommendationResponse = {
  severidad?: string;
  recomendacion?: string;
  mensaje?: string;
  comando?: string | null;
};

type NotificationSeverity = "fatal" | "warning" | "great";

export type RecommendationNotification = {
  id: number;
  plantName?: string;
  message: string;
  severity: NotificationSeverity;
};

export type RecommendationMode = "telemetry" | "simulation";

type RecommendationRequest = {
  mode: RecommendationMode;
  plantName?: string;
  temperatura?: number;
  humedad?: number;
  luz?: number;
};

const SEVERITY_MAP: Record<string, NotificationSeverity> = {
  alta: "fatal",
  media: "warning",
  baja: "great",
};

export async function getRecommendation(
  request: RecommendationRequest,
): Promise<RecommendationNotification | null> {
  const response = await (request.mode === "simulation"
    ? fetch(`${API_BASE_URL}/recomendacion/simulacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planta_nombre: request.plantName,
          temperatura: request.temperatura,
          humedad: request.humedad,
          luz: request.luz,
        }),
      })
    : fetch(`${API_BASE_URL}/recomendacion`));

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as RecommendationResponse;
  const severityKey = (data.severidad ?? "").toLowerCase();

  return {
    id: Date.now(),
    plantName: request.plantName,
    message: data.recomendacion ?? data.mensaje ?? "No recommendation",
    severity: SEVERITY_MAP[severityKey] ?? "warning",
  };
}
