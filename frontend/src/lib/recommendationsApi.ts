import { API_BASE } from "./api";

const REQUEST_TIMEOUT_MS = 60_000;

type RecommendationResponse = {
  mensaje: string;
  severidad: string;
  comando: string | null;
};

type NotificationSeverity = "fatal" | "warning" | "great";

export type RecommendationNotification = {
  id: number;
  plantName?: string;
  message: string;
  severity: NotificationSeverity;
};

export type RecommendationMode = "telemetry" | "simulation";

export type RecommendationError = "timeout" | "server" | "network";

export type RecommendationResult = {
  data?: RecommendationNotification;
  error?: RecommendationError;
};

type RecommendationRequest = {
  mode: RecommendationMode;
  plantName?: string;
  temperatura?: number;
  humedad?: number;
};

const SEVERITY_MAP: Record<string, NotificationSeverity> = {
  alta: "fatal",
  media: "warning",
  baja: "great",
};

export async function getRecommendation(
  request: RecommendationRequest,
): Promise<RecommendationResult> {
  console.log("[recommendationsApi] getRecommendation called", {
    url:
      request.mode === "simulation"
        ? `${API_BASE}/recomendacion/simulacion`
        : `${API_BASE}/recomendacion`,
    mode: request.mode,
    plantName: request.plantName,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await (request.mode === "simulation"
      ? fetch(`${API_BASE}/recomendacion/simulacion`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planta_nombre: request.plantName,
            temperatura: request.temperatura,
            humedad: request.humedad,
          }),
          signal: controller.signal,
        })
      : fetch(`${API_BASE}/recomendacion`, {
          signal: controller.signal,
        }));

    console.log("[recommendationsApi] response status:", response.status);

    if (!response.ok) {
      return { error: "server" };
    }

    const data = (await response.json()) as RecommendationResponse;
    const severityKey = (data.severidad ?? "").toLowerCase();

    return {
      data: {
        id: Date.now(),
        plantName: request.plantName,
        message: data.mensaje ?? "Sin recomendación disponible",
        severity: SEVERITY_MAP[severityKey] ?? "warning",
      },
    };
  } catch (err) {
    console.log("[recommendationsApi] catch error:", err);
    if (err instanceof DOMException && err.name === "AbortError") {
      return { error: "timeout" };
    }
    return { error: "network" };
  } finally {
    clearTimeout(timeoutId);
  }
}
