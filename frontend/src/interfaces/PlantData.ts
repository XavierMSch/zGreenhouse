import type { ComponentType } from "react";

type Plant = "albahaca" | "menta" | "romero" | "tomillo";

export interface PlantData {
  id: number;
  name: Plant;
  label: string;
  emoji: string;
  model: ComponentType;
}
