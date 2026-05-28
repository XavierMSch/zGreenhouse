import { API_BASE } from "./api";

type ActivePlantResponse = {
  planta_activa_id: number;
};

export async function getActivePlantId(): Promise<number | null> {
  const response = await fetch(`${API_BASE}/planta-activa`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ActivePlantResponse;
  return data.planta_activa_id ?? null;
}

export async function setActivePlantId(plantId: number): Promise<void> {
  await fetch(`${API_BASE}/planta-activa/${plantId}`, {
    method: "POST",
  });
}
