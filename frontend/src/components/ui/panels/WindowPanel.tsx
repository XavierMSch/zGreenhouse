import { useState, useEffect, useCallback } from "react";
import { useStore } from "../../../stores/useStore";
import { getWindowState, setWindowState } from "../../../api/actuatorApi";

export default function WindowPanel() {
  const isSimulationMode = useStore((s) => s.isSimulationMode);
  const [abierta, setAbierta] = useState<boolean | null>(null);
  const [enviando, setEnviando] = useState(false);

  const fetchState = useCallback(async () => {
    const state = await getWindowState();
    if (state !== null) setAbierta(state);
  }, []);

  useEffect(() => {
    if (isSimulationMode) return;
    fetchState();
    const id = setInterval(fetchState, 5000);
    return () => clearInterval(id);
  }, [isSimulationMode, fetchState]);

  if (isSimulationMode) return null;

  const toggle = async () => {
    if (abierta === null || enviando) return;
    setEnviando(true);
    const previo = abierta;
    setAbierta(!previo);
    const result = await setWindowState(!previo);
    if (result === null) setAbierta(previo);
    setEnviando(false);
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-4">VENTANA</h2>
        <div className="flex items-center gap-4">
          <span
            className={`w-3 h-3 rounded-full ${
              abierta === null
                ? "bg-slate-600"
                : abierta
                  ? "bg-emerald-400"
                  : "bg-slate-500"
            }`}
          />
          <span className="text-slate-300 text-sm">
            {abierta === null ? "Cargando..." : abierta ? "Abierta" : "Cerrada"}
          </span>
          <button
            onClick={toggle}
            disabled={abierta === null || enviando}
            className={`py-2 px-4 text-xs font-bold rounded-xl border transition-all ${
              abierta
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {enviando ? "..." : abierta ? "CERRAR" : "ABRIR"}
          </button>
        </div>
      </div>
    </div>
  );
}
