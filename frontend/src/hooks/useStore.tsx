import { create } from "zustand";

interface Sensors {
  sunlight: number;
  temperature: number;
  humidity: number;
}

interface StoreState {
  sensors: Sensors;
  selectedPlant: string;
  isSimulationMode: boolean;
  setSensor: (key: keyof Sensors, value: number) => void;
  setSelectedPlant: (plant: string) => void;
  setSimulationMode: (value: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  sensors: {
    sunlight: 82,
    temperature: 24.5,
    humidity: 42,
  },
  selectedPlant: "mint",
  isSimulationMode: true,
  setSensor: (key, value) =>
    set((state) => ({ sensors: { ...state.sensors, [key]: value } })),
  setSelectedPlant: (plant) => set({ selectedPlant: plant }),
  setSimulationMode: (value) => set({ isSimulationMode: value }),
}));
