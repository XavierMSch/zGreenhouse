import asyncio
import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import ollama


BASE_DIR = Path(__file__).resolve().parent
SYSTEM_PROMPT_PATH = BASE_DIR / "prompts" / "system.txt"
MODEL_NAME = os.getenv("OLLAMA_MODEL", "zgreenhousebot")
OLLAMA_HOST = os.getenv("OLLAMA_HOST")
OLLAMA_CLIENT = (
    ollama.AsyncClient(host=OLLAMA_HOST, timeout=60.0)
    if OLLAMA_HOST
    else ollama.AsyncClient(timeout=60.0)
)
MAX_RETRIES = 2
RETRY_BACKOFF = [1.0, 2.0]


class LLMServiceError(Exception):
    pass


@dataclass
class RespuestaLLM:
    mensaje: str
    severidad: str
    comando: str | None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "RespuestaLLM":
        mensaje = "Sin recomendación disponible"
        severidad = "baja"
        comando = None
        for k, v in data.items():
            kl = k.lower()
            if kl.startswith("s"):
                severidad = v or "baja"
            elif kl.startswith("m"):
                mensaje = v or "Sin recomendación disponible"
            elif kl.startswith("c"):
                comando = v
        if comando and isinstance(comando, str):
            cmd = comando.lower().strip()
            if cmd in ("none", "nada", "no", ""):
                comando = None
            elif cmd.startswith("abr"):
                comando = "abrir"
            elif cmd.startswith("cer") or cmd.startswith("cie"):
                comando = "cerrar"
        return cls(
            mensaje=str(mensaje),
            severidad=str(severidad),
            comando=comando,
        )


def _load_system_prompt() -> str:
    prompt = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8").strip()
    if not prompt:
        raise ValueError("El prompt del sistema está vacío.")
    return prompt


SYSTEM_PROMPT = _load_system_prompt()


def construir_prompt_usuario(
    planta: str,
    contexto_resumen: dict[str, Any],
    ventana_abierta: bool | None = None,
) -> str:
    payload: dict[str, Any] = {
        "planta": planta,
        "contexto": contexto_resumen,
    }
    if ventana_abierta is not None:
        payload["ventana_abierta"] = ventana_abierta
    return json.dumps(payload, ensure_ascii=False)


async def obtener_recomendacion(prompt_usuario: str) -> RespuestaLLM:
    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES + 1):
        try:
            print(
                "\n[LLM DEBUG] Prompt usuario enviado a Ollama:\n"
                + json.dumps(json.loads(prompt_usuario), indent=2, ensure_ascii=False)
            )
            response: Any = await OLLAMA_CLIENT.chat(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_usuario},
                ],
                format="json",
            )

            contenido = response["message"]["content"]
            if isinstance(contenido, str):
                data = json.loads(contenido)
            else:
                data = contenido

            print(
                "\n[LLM DEBUG] Respuesta del LLM:\n"
                + json.dumps(data, indent=2, ensure_ascii=False)
            )

            return RespuestaLLM.from_dict(data)

        except (json.JSONDecodeError, KeyError, TypeError) as e:
            raise LLMServiceError(f"Respuesta inválida del LLM: {e}") from e
        except Exception as e:
            last_error = e
            if attempt < MAX_RETRIES:
                await asyncio.sleep(RETRY_BACKOFF[attempt])

    raise LLMServiceError(f"Error al comunicarse con Ollama: {last_error}")
