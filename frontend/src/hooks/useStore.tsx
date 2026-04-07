import { create } from "zustand";

interface Sensors {
  sunlight: number;
  temperature: number;
  humidity: number;
}

interface StoreState {
  sensors: Sensors;
  selectedPlant: string;
  setSensor: (key: keyof Sensors, value: number) => void;
  setSelectedPlant: (plant: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  sensors: {
    sunlight: 82,
    temperature: 24.5,
    humidity: 42,
  },
  selectedPlant: "mint",
  setSensor: (key, value) =>
    set((state) => ({ sensors: { ...state.sensors, [key]: value } })),
  setSelectedPlant: (plant) => set({ selectedPlant: plant }),
}));
