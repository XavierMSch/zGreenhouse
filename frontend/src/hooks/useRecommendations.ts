import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationData } from "../interfaces/NotificationData";
import type { RecommendationError } from "../interfaces/Recommendations";
import { getRecommendation } from "../api/recommendationsApi";
import { useStore } from "../stores/useStore";

export function useRecommendations() {
  const [telemetryNotifications, setTelemetryNotifications] = useState<
    NotificationData[]
  >([]);
  const [simulationNotifications, setSimulationNotifications] = useState<
    NotificationData[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<RecommendationError | null>(null);
  const isFetchingRef = useRef(false);
  const isSimulationMode = useStore((state) => state.isSimulationMode);
  const { temperature, humidity } = useStore((state) => state.sensors);
  const selectedPlant = useStore((state) => state.selectedPlant);

  const notifications = isSimulationMode
    ? simulationNotifications
    : telemetryNotifications;

  const fetchRecommendation = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await getRecommendation({
        mode: isSimulationMode ? "simulation" : "telemetry",
        plantName: selectedPlant,
        temperatura: temperature,
        humedad: humidity,
      });
      if (result.data) {
        const addNotification = isSimulationMode
          ? setSimulationNotifications
          : setTelemetryNotifications;
        addNotification((prev) => [result.data!, ...prev]);
        setLastError(null);
      } else if (result.error) {
        setLastError(result.error);
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [isSimulationMode, selectedPlant, humidity, temperature]);

  const fetchRecommendationRef = useRef(fetchRecommendation);

  useEffect(() => {
    fetchRecommendationRef.current = fetchRecommendation;
  }, [fetchRecommendation]);

  useEffect(() => {
    if (isSimulationMode) {
      return;
    }

    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const initialDelayMs = 5000;

    const fetchOnInterval = async () => {
      if (!isMounted) {
        return;
      }
      await fetchRecommendationRef.current();
    };

    timeoutId = setTimeout(() => {
      fetchOnInterval();
      intervalId = setInterval(fetchOnInterval, 90000);
    }, initialDelayMs);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulationMode]);

  return {
    notifications,
    isLoading,
    lastError,
    fetchRecommendation,
  };
}
