import json
from pathlib import Path
from typing import Any

import ollama


BASE_DIR = Path(__file__).resolve().parent
SYSTEM_PROMPT_PATH = BASE_DIR / "prompts" / "system.txt"


def construir_prompt_usuario(
    planta: str,
    contexto: list[dict[str, float | str]],
    telemetria: dict[str, float] | None = None,
) -> str:
    payload: dict[str, Any] = {
        "planta": planta,
        "contexto": contexto,
    }
    if telemetria is not None:
        payload["telemetria"] = telemetria
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
