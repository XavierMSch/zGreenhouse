import { useEffect, useState } from "react";
import { SENSORS } from "../../../configs/SensorsConfig";
import { PLANTS } from "../../../configs/PlantsConfig";
import SensorSlider from "../interactive/SensorSlider";
import { getLatestTelemetry } from "../../../lib/sensorsApi";
import type { TelemetriaResponse } from "../../../lib/sensorsApi";
import { calculateVpd } from "../../../lib/vpd";
import { useStore } from "../../../hooks/useStore";

export default function SensorPanel() {
  const isSimulationMode = useStore((state) => state.isSimulationMode);
  const setSimulationMode = useStore((state) => state.setSimulationMode);
  const setTelemetrySensor = useStore((state) => state.setTelemetrySensor);
  const selectedPlant = useStore((state) => state.selectedPlant);
  const [telemetry, setTelemetry] = useState<TelemetriaResponse | null>(null);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);
  const sensors = useStore((state) => state.sensors);
  const simulationVpd = calculateVpd(sensors.temperature, sensors.humidity);

  const plantId = PLANTS.find((p) => p.name === selectedPlant)?.id ?? null;

  const toggleMode = () => setSimulationMode(!isSimulationMode);

  useEffect(() => {
    if (isSimulationMode || !plantId) {
      return;
    }

    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchTelemetry = async () => {
      setIsTelemetryLoading(true);
      setTelemetryError(null);

      const latestTelemetry = await getLatestTelemetry(plantId);
      if (isMounted) {
        setTelemetry(latestTelemetry);
        setTelemetryError(latestTelemetry ? null : "Sin datos de telemetría");
        setIsTelemetryLoading(false);

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
  }, [isSimulationMode, plantId, setTelemetrySensor]);
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl w-80 pointer-events-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white font-bold text-lg">
          {isSimulationMode ? "Controles" : "Telemetría"}
        </h2>
        <button
          onClick={toggleMode}
          className="py-3 px-3 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl"
        >
          CAMBIAR MODO
        </button>
      </div>

      {isSimulationMode && (
        <>
          <div className="space-y-6">
            {SENSORS.map((data) => (
              <SensorSlider key={data.key} data={data} />
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/5 bg-slate-800/80 p-4">
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
              VPD
            </div>
            <div className="text-4xl font-bold text-amber-300">
              {simulationVpd.toFixed(2)} kPa
            </div>
          </div>
        </>
      )}
      {!isSimulationMode && (
        <>
          <div className="flex justify-between text-xs uppercase tracking-[0.25em] text-slate-400 mb-4">
            <span>Telemetría en tiempo real</span>
            <span>Fuente: backend</span>
          </div>
          <div className="flex justify-between text-xl font-medium text-slate-400 mb-6">
            TEMPERATURA
            <span className="text-sky-400">
              {telemetry ? `${telemetry.temperatura.toFixed(1)}°C` : "--"}
            </span>
          </div>
          <div className="flex justify-between text-xl font-medium text-slate-400 mb-6">
            HUMEDAD
            <span className="text-teal-400">
              {telemetry ? `${Math.round(telemetry.humedad)}%` : "--"}
            </span>
          </div>
          <div className="flex justify-between text-xl font-medium text-slate-400 mb-6">
            VPD
            <span className="text-amber-300">
              {telemetry ? `${telemetry.vpd.toFixed(2)} kPa` : "--"}
            </span>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {isTelemetryLoading && "Cargando telemetría..."}
            {!isTelemetryLoading && telemetryError && telemetryError}
            {!isTelemetryLoading && !telemetryError && telemetry && (
              <>
                Actualizado {new Date(telemetry.timestamp).toLocaleTimeString()}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
