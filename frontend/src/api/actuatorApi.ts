import { API_BASE } from "./api";

export async function getWindowState(): Promise<boolean | null> {
  try {
    const r = await fetch(`${API_BASE}/actuador/ventana`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.ventana_abierta;
  } catch {
    return null;
  }
}

export async function setWindowState(abierta: boolean): Promise<boolean | null> {
  try {
    const r = await fetch(`${API_BASE}/actuador/ventana`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ abierta }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.ventana_abierta;
  } catch {
    return null;
  }
}
