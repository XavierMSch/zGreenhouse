import { useCallback, useEffect, useState } from "react";
import type { NotificationData } from "../../../interfaces/NotificationData";
import NotificationCard from "../interactive/NotificationCard";
import { getRecommendation } from "../../../lib/recommendationsApi";
import { useStore } from "../../../hooks/useStore";

export default function NotificationPanel() {
  const [telemetryNotifications, setTelemetryNotifications] = useState<
    NotificationData[]
  >([]);
  const [simulationNotifications, setSimulationNotifications] = useState<
    NotificationData[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSimulationMode = useStore((state) => state.isSimulationMode);
  const { temperature, humidity } = useStore((state) => state.sensors);
  const selectedPlant = useStore((state) => state.selectedPlant);

  const notifications = isSimulationMode
    ? simulationNotifications
    : telemetryNotifications;
  const modeLabel = isSimulationMode ? "SIMULACIÓN" : "TIEMPO REAL";

  const fetchRecommendation = useCallback(async () => {
    setIsLoading(true);
    try {
      const recommendation = await getRecommendation({
        mode: isSimulationMode ? "simulation" : "telemetry",
        plantName: selectedPlant,
        temperatura: temperature,
        humedad: humidity,
      });
      if (recommendation) {
        if (isSimulationMode) {
          setSimulationNotifications((prev) => [recommendation, ...prev]);
        } else {
          setTelemetryNotifications((prev) => [recommendation, ...prev]);
        }
      }
    } catch {
      // No-op: UI should reset the button state on failure.
    } finally {
      setIsLoading(false);
    }
  }, [isSimulationMode, selectedPlant, humidity, temperature]);

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
      await fetchRecommendation();
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
  }, [fetchRecommendation, isSimulationMode]);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl h-full rounded-2xl p-6 border border-white/5 shadow-2xl w-80 pointer-events-auto flex flex-col">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <h2 className="text-white font-bold text-lg">Recomendaciones</h2>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mt-1">
            {modeLabel}
          </p>
        </div>
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
