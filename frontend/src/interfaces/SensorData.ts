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

export type TelemetriaResponse = {
  id: number;
  planta_id: number;
  timestamp: string;
  temperatura: number;
  humedad: number;
  vpd: number;
};

