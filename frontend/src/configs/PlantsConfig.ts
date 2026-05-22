import type { PlantData } from '../interfaces/PlantData';
import { Basil } from '../models/plants/Basil';
import { Mint } from '../models/plants/Mint';
import { Rosemary } from '../models/plants/Rosemary';
import { Thyme } from '../models/plants/Thyme';

export const PLANTS: PlantData[] = [
  { 
    id: 1,
    name: 'mint',
    label: 'Mint', 
    emoji: '🍃',
    model: Mint,
  },
  { 
    id: 2,
    name: 'thyme', 
    label: 'Thyme', 
    emoji: '🌱' ,
    model: Thyme,
  },
  { 
    id: 3,
    name: 'basil', 
    label: 'Basil', 
    emoji: '🌿',
    model: Basil,
  },
  { 
    id: 4,
    name: 'rosemary', 
    label: 'Rosemary', 
    emoji: '🪴',
    model: Rosemary,
  },
];