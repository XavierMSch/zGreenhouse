import type { PlantData } from "../interfaces/PlantData";
import { Basil } from "../models/plants/Basil";
import { Mint } from "../models/plants/Mint";
import { Rosemary } from "../models/plants/Rosemary";
import { Thyme } from "../models/plants/Thyme";

export const PLANTS: PlantData[] = [
  {
    id: 1,
    name: "menta",
    label: "Menta",
    emoji: "🍃",
    model: Mint,
  },
  {
    id: 2,
    name: "tomillo",
    label: "Tomillo",
    emoji: "🌱",
    model: Thyme,
  },
  {
    id: 3,
    name: "albahaca",
    label: "Albahaca",
    emoji: "🌿",
    model: Basil,
  },
  {
    id: 4,
    name: "romero",
    label: "Romero",
    emoji: "🪴",
    model: Rosemary,
  },
];
