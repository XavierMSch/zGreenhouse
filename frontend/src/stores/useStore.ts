import { create } from "zustand";

interface Sensors {
  temperature: number;
  humidity: number;
}

interface StoreState {
  sensors: Sensors;
  telemetrySensors: Sensors;
  selectedPlant: string;
  isSimulationMode: boolean;
  setSensor: (key: keyof Sensors, value: number) => void;
  setTelemetrySensor: (key: keyof Sensors, value: number) => void;
  setSelectedPlant: (plant: string) => void;
  setSimulationMode: (value: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  sensors: {
    temperature: 24.5,
    humidity: 42,
  },
  telemetrySensors: {
    temperature: 24.5,
    humidity: 42,
  },
  selectedPlant: "menta",
  isSimulationMode: false,
  setSensor: (key, value) =>
    set((state) => ({ sensors: { ...state.sensors, [key]: value } })),
  setTelemetrySensor: (key, value) =>
    set((state) => ({
      telemetrySensors: { ...state.telemetrySensors, [key]: value },
    })),
  setSelectedPlant: (plant) => set({ selectedPlant: plant }),
  setSimulationMode: (value) => set({ isSimulationMode: value }),
}));
