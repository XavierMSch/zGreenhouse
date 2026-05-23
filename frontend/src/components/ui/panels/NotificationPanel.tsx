import { useCallback, useEffect, useState } from "react";
import type { NotificationData } from "../../../interfaces/NotificationData";
import NotificationCard from "../interactive/NotificationCard";
import { getRecommendation } from "../../../lib/recommendationsApi";
import { useStore } from "../../../hooks/useStore";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSimulationMode = useStore((state) => state.isSimulationMode);
  const sensors = useStore((state) => state.sensors);
  const selectedPlant = useStore((state) => state.selectedPlant);

  const fetchRecommendation = useCallback(async () => {
    setIsLoading(true);
    try {
      const recommendation = await getRecommendation({
        mode: isSimulationMode ? "simulation" : "telemetry",
        plantName: selectedPlant,
        temperatura: sensors.temperature,
        humedad: sensors.humidity,
        luz: sensors.sunlight,
      });
      if (recommendation) {
        setNotifications((prev) => [recommendation, ...prev]);
      }
    } catch {
      // No-op: UI should reset the button state on failure.
    } finally {
      setIsLoading(false);
    }
  }, [
    isSimulationMode,
    selectedPlant,
    sensors.humidity,
    sensors.sunlight,
    sensors.temperature,
  ]);

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
      <div>
        <h2 className="text-white font-bold text-lg">Recommendations</h2>
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
            {isLoading ? "LOADING..." : "ASK LLM"}
          </button>
        </div>
      )}
    </div>
  );
}
