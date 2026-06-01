import { useEffect, useState } from "react";
import type { TelemetriaResponse } from "../interfaces/SensorData";
import { getLatestTelemetry } from "../api/sensorsApi";
import { useStore } from "../stores/useStore";

export function useTelemetry(plantId: number | null, enabled: boolean) {
  const [telemetry, setTelemetry] = useState<TelemetriaResponse | null>(null);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setTelemetrySensor = useStore((state) => state.setTelemetrySensor);

  useEffect(() => {
    if (!enabled || !plantId) {
      return;
    }

    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchTelemetry = async () => {
      setIsLoading(true);
      setTelemetryError(null);

      const latestTelemetry = await getLatestTelemetry(plantId);
      if (isMounted) {
        setTelemetry(latestTelemetry);
        setTelemetryError(latestTelemetry ? null : "Sin datos de telemetría");
        setIsLoading(false);

        if (latestTelemetry) {
          setTelemetrySensor("temperature", latestTelemetry.temperatura);
          setTelemetrySensor("humidity", latestTelemetry.humedad);
        }
      }
    };

    fetchTelemetry();
    intervalId = setInterval(fetchTelemetry, 5000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enabled, plantId, setTelemetrySensor]);

  return { telemetry, telemetryError, isLoading };
}
