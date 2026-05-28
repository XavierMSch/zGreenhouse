import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationData } from "../../../interfaces/NotificationData";
import NotificationCard from "../interactive/NotificationCard";
import {
  getRecommendation,
  type RecommendationError,
} from "../../../lib/recommendationsApi";
import { useStore } from "../../../stores/useStore";

export default function NotificationPanel() {
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
  const modeLabel = isSimulationMode ? "SIMULACIÓN" : "TIEMPO REAL";

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
        if (isSimulationMode) {
          setSimulationNotifications((prev) => [result.data!, ...prev]);
        } else {
          setTelemetryNotifications((prev) => [result.data!, ...prev]);
        }
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

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl h-full rounded-2xl p-6 border border-white/5 shadow-2xl w-80 pointer-events-auto flex flex-col">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <h2 className="text-white font-bold text-lg">Recomendaciones</h2>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mt-1">
            {modeLabel}
          </p>
        </div>
        {lastError && (
          <div
            className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
            title="Error en la última consulta"
          />
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {notifications.length === 0 ? (
          <div className="text-sm text-slate-400 text-center py-6">
            No hay recomendaciones todavía.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationCard key={notification.id} data={notification} />
          ))
        )}
      </div>
      {isSimulationMode && (
        <div className="flex-none pt-4">
          <button
            className="w-full py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl transition-all active:scale-95"
            onClick={fetchRecommendation}
            disabled={isLoading}
          >
            {isLoading ? "CARGANDO..." : "PEDIR RECOMENDACIÓN"}
          </button>
        </div>
      )}
    </div>
  );
}
