import type { SensorData } from "../interfaces/SensorData";

export const SENSORS: SensorData[] = [
  {
    key: "temperature",
    label: "TEMPERATURA",
    icon: "🌡️",
    unit: "°C",
    color: "text-sky-400",
    min: -10,
    max: 40,
    step: 0.1,
  },
  {
    key: "humidity",
    label: "HUMEDAD",
    icon: "💧",
    unit: "%",
    color: "text-teal-300",
    min: 0,
    max: 100,
    step: 1,
  },
];
