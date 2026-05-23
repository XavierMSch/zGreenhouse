type SensorKey = "temperature" | "humidity";

export interface SensorData {
  key: SensorKey;
  label: string;
  icon: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  step: number;
}
