import type { TelemetriaResponse } from "../interfaces/SensorData";
import { API_BASE } from "./api";

export async function getLatestTelemetry(
  plantId: number,
): Promise<TelemetriaResponse | null> {
  const response = await fetch(`${API_BASE}/telemetria/${plantId}`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as TelemetriaResponse[];
  return data[0] ?? null;
}
