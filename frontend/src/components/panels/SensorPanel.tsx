import { useStore } from "../../hooks/useStore";

type SensorKey = "sunlight" | "temperature" | "humidity";

interface SensorConfig {
  key: SensorKey;
  label: string;
  icon: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  step: number;
}

const SENSORS: SensorConfig[] = [
  {
    key: "sunlight",
    label: "SUNLIGHT LEVEL",
    icon: "☀️",
    unit: "%",
    color: "text-emerald-400",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "temperature",
    label: "TEMPERATURE",
    icon: "🌡️",
    unit: "°C",
    color: "text-sky-400",
    min: -10,
    max: 40,
    step: 0.1,
  },
  {
    key: "humidity",
    label: "HUMIDITY",
    icon: "💧",
    unit: "%",
    color: "text-teal-300",
    min: 0,
    max: 100,
    step: 1,
  },
];

export default function SensorPanel() {
  const sensors = useStore((s) => s.sensors);
  const setSensor = useStore((s) => s.setSensor);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl w-80">
      <h2 className="text-white font-bold text-lg mb-6">Sensor Controls</h2>
      <div className="space-y-6">
        {SENSORS.map(({ key, label, icon, unit, color, min, max, step }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-400">
              <span>
                {icon} {label}
              </span>
              <span className={`${color} font-bold`}>
                {sensors[key]}
                {unit}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={sensors[key]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSensor(key, parseFloat(e.target.value))
              }
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
