import type { PlantData } from '../interfaces/PlantData';
import { Basil } from '../models/plants/Basil';
import { Mint } from '../models/plants/Mint';
import { Rosemary } from '../models/plants/Rosemary';
import { Thyme } from '../models/plants/Thyme';

export const PLANTS: PlantData[] = [
  { 
    name: 'mint',
    label: 'Mint', 
    emoji: '🍃',
    model: Mint,
  },
  { 
    name: 'thyme', 
    label: 'Thyme', 
    emoji: '🌱' ,
    model: Thyme,
  },
  { name: 'basil', 
    label: 'Basil', 
    emoji: '🌿',
    model: Basil,
  },
  { 
    name: 'rosemary', 
    label: 'Rosemary', 
    emoji: '🪴',
    model: Rosemary,
  },
];