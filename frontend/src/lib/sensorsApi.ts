const API_BASE_URL = "http://localhost:8000";

export type TelemetriaResponse = {
  id: number;
  planta_id: number;
  timestamp: string;
  temperatura: number;
  humedad: number;
};

export async function getLatestTelemetry(
  plantId: number,
): Promise<TelemetriaResponse | null> {
  const response = await fetch(`${API_BASE_URL}/telemetria/${plantId}`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as TelemetriaResponse[];
  return data[0] ?? null;
}
