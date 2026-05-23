import { useEffect, useState } from "react";
import { SENSORS } from "../../../configs/SensorsConfig";
import SensorSlider from "../interactive/SensorSlider";
import { getActivePlantId } from "../../../lib/plantApi";
import { getLatestTelemetry } from "../../../lib/sensorsApi";
import type { TelemetriaResponse } from "../../../lib/sensorsApi";
import { useStore } from "../../../hooks/useStore";

export default function SensorPanel() {
  const isSimulationMode = useStore((state) => state.isSimulationMode);
  const setSimulationMode = useStore((state) => state.setSimulationMode);
  const [telemetry, setTelemetry] = useState<TelemetriaResponse | null>(null);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const [isTelemetryLoading, setIsTelemetryLoading] = useState(false);
  const sensors = useStore((state) => state.sensors);

  // 3. Create a toggle function
  const toggleMode = () => setSimulationMode(!isSimulationMode);

  useEffect(() => {
    if (isSimulationMode) {
      return;
    }

    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchTelemetry = async () => {
      setIsTelemetryLoading(true);
      setTelemetryError(null);

      const plantId = await getActivePlantId();
      if (!plantId) {
        if (isMounted) {
          setTelemetry(null);
          setTelemetryError("No active plant");
          setIsTelemetryLoading(false);
        }
        return;
      }

      const latestTelemetry = await getLatestTelemetry(plantId);
      if (isMounted) {
        setTelemetry(latestTelemetry);
        setTelemetryError(latestTelemetry ? null : "No telemetry data");
        setIsTelemetryLoading(false);
      }
    };

    fetchTelemetry();
    intervalId = setInterval(fetchTelemetry, 30000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulationMode]);
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl w-80 pointer-events-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white font-bold text-lg">
          {isSimulationMode ? "Sensor Controls" : "Telemetry"}
        </h2>
        <button
          onClick={toggleMode}
          className="py-3 px-3 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl"
        >
          CHANGE MODE
        </button>
      </div>

      {isSimulationMode && (
        <div className="space-y-6">
          {SENSORS.map((data) => (
            <SensorSlider key={data.key} data={data} />
          ))}
        </div>
      )}
      {!isSimulationMode && (
        <>
          <div className="flex justify-between text-xl font-medium text-slate-400 mb-6">
            SUNLIGHT
            <span className="text-emerald-400">
              {Math.round(sensors.sunlight)}%
            </span>
          </div>
          <div className="flex justify-between text-xl font-medium text-slate-400 mb-6">
            TEMPERATURE
            <span className="text-sky-400">
              {telemetry ? `${telemetry.temperatura.toFixed(1)}°C` : "--"}
            </span>
          </div>
          <div className="flex justify-between text-xl font-medium text-slate-400 ">
            HUMIDITY
            <span className="text-teal-400">
              {telemetry ? `${Math.round(telemetry.humedad)}%` : "--"}
            </span>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {isTelemetryLoading && "Loading telemetry..."}
            {!isTelemetryLoading && telemetryError && telemetryError}
            {!isTelemetryLoading && !telemetryError && telemetry && (
              <>Updated {new Date(telemetry.timestamp).toLocaleTimeString()}</>
            )}
          </div>
        </>
      )}
    </div>
  );
}
