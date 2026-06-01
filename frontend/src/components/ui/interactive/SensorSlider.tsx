import { useStore } from "../../../stores/useStore";
import type { SensorData } from "../../../interfaces/SensorData";

interface SensorSliderProps {
  data: SensorData;
}

export default function SensorSlider(props: SensorSliderProps) {
  const sensorData = props.data;
  const sensorValue = useStore((s) => s.sensors[sensorData.key]);
  const setSensor = useStore((s) => s.setSensor);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium text-slate-400">
        <span>
          {sensorData.icon} {sensorData.label}
        </span>
        <span className={`${sensorData.color} font-bold`}>
          {sensorValue}
          {sensorData.unit}
        </span>
      </div>
      <input
        type="range"
        min={sensorData.min}
        max={sensorData.max}
        step={sensorData.step}
        value={sensorValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSensor(sensorData.key, parseFloat(e.target.value))
        }
        className="w-full accent-emerald-400 cursor-pointer"
      />
    </div>
  );
}
