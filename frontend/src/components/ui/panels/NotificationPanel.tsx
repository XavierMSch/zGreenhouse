import NotificationCard from "../interactive/NotificationCard";
import { useStore } from "../../../stores/useStore";
import { useRecommendations } from "../../../hooks/useRecommendations";

export default function NotificationPanel() {
  const isSimulationMode = useStore((state) => state.isSimulationMode);
  const { notifications, isLoading, lastError, fetchRecommendation } =
    useRecommendations();
  const modeLabel = isSimulationMode ? "SIMULACIÓN" : "TIEMPO REAL";

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
