import json
import math
from pathlib import Path
from typing import Any

import ollama


BASE_DIR = Path(__file__).resolve().parent
SYSTEM_PROMPT_PATH = BASE_DIR / "prompts" / "system.txt"


def calcular_vpd(temperatura: float, humedad: float) -> float:
    saturacion = 0.6108 * math.exp((17.27 * temperatura) / (temperatura + 237.3))
    return round(saturacion * (1 - (humedad / 100.0)), 2)


def construir_prompt_usuario(
    planta: str,
    contexto: list[dict[str, float | str]],
) -> str:
    payload: dict[str, Any] = {
        "planta": planta,
        "contexto": contexto,
    }
    return json.dumps(payload, ensure_ascii=False)


def obtener_recomendacion(prompt_usuario: str) -> dict[str, object]:
    chat = getattr(ollama, "chat")
    response: Any = chat(
        model="zgreenhousebot",
        messages=[
            {"role": "user", "content": prompt_usuario},
        ],
        format="json",
    )

    contenido = response["message"]["content"]
    if isinstance(contenido, str):
        return json.loads(contenido)
    return contenido
