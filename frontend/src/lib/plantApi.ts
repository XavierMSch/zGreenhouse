const API_BASE_URL = "http://localhost:8000";

type ActivePlantResponse = {
  planta_activa_id: number;
};

export async function getActivePlantId(): Promise<number | null> {
  const response = await fetch(`${API_BASE_URL}/planta-activa`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ActivePlantResponse;
  return data.planta_activa_id ?? null;
}

export async function setActivePlantId(plantId: number): Promise<void> {
  await fetch(`${API_BASE_URL}/planta-activa/${plantId}`, {
    method: "POST",
  });
}
