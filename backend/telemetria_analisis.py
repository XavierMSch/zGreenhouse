from typing import Any

from models import Telemetria


REGLAS_CULTIVO: dict[str, Any] = {
    "albahaca": {
        "rangos_optimos": {
            "temperatura_min": 18.0,
            "temperatura_max": 29.0,
            "humedad_min": 50.0,
            "humedad_max": 60.0,
            "vpd_min": 1.0,
            "vpd_max": 1.8,
        },
    },
    "menta": {
        "rangos_optimos": {
            "temperatura_min": 18.0,
            "temperatura_max": 24.0,
            "humedad_min": 40.0,
            "humedad_max": 60.0,
            "vpd_min": 1.0,
            "vpd_max": 1.8,
        },
    },
    "romero": {
        "rangos_optimos": {
            "temperatura_min": 13.0,
            "temperatura_max": 24.0,
            "humedad_min": 40.0,
            "humedad_max": 50.0,
            "vpd_min": 1.0,
            "vpd_max": 1.8,
        },
    },
    "tomillo": {
        "rangos_optimos": {
            "temperatura_min": 13.0,
            "temperatura_max": 24.0,
            "humedad_min": 40.0,
            "humedad_max": 50.0,
            "vpd_min": 1.0,
            "vpd_max": 1.8,
        },
    },
}


def _calcular_estadisticas(valores: list[float]) -> dict[str, float]:
    return {
        "min": round(min(valores), 1),
        "max": round(max(valores), 1),
        "avg": round(sum(valores) / len(valores), 1),
    }


def _detectar_tendencia(valores: list[float], umbral: float) -> str:
    if len(valores) < 4:
        return "estable"
    mitad = len(valores) // 2
    media_primera = sum(valores[:mitad]) / mitad
    media_segunda = sum(valores[mitad:]) / (len(valores) - mitad)
    diff = media_segunda - media_primera
    if diff > umbral:
        return "ascendente"
    if diff < -umbral:
        return "descendente"
    return "estable"


def resumir_telemetria(
    telemetrias: list[Telemetria], nombre_planta: str | None = None
) -> dict[str, Any]:
    if not telemetrias:
        return {
            "actual": None,
            "estadisticas": None,
            "tendencia": None,
            "eventos": [],
            "minutos_registro": 0,
            "total_lecturas": 0,
        }

    temps = [t.temperatura for t in telemetrias]
    hums = [t.humedad for t in telemetrias]
    vpds = [t.vpd for t in telemetrias]

    ultima = telemetrias[-1]
    actual = {
        "temperatura": ultima.temperatura,
        "humedad": ultima.humedad,
        "vpd": ultima.vpd,
    }

    estadisticas = {
        "temperatura": _calcular_estadisticas(temps),
        "humedad": _calcular_estadisticas(hums),
        "vpd": _calcular_estadisticas(vpds),
    }

    tendencia = {
        "temperatura": _detectar_tendencia(temps, 1.0),
        "humedad": _detectar_tendencia(hums, 3.0),
        "vpd": _detectar_tendencia(vpds, 0.2),
    }

    eventos: list[dict[str, Any]] = []
    if nombre_planta and nombre_planta.lower() in REGLAS_CULTIVO:
        rangos = REGLAS_CULTIVO[nombre_planta.lower()]["rangos_optimos"]
        for t in reversed(telemetrias[-20:]):
            if t.temperatura < rangos["temperatura_min"]:
                eventos.append({"tipo": "temperatura_baja", "valor": t.temperatura})
            elif t.temperatura > rangos["temperatura_max"]:
                eventos.append({"tipo": "temperatura_alta", "valor": t.temperatura})
            if t.humedad < rangos["humedad_min"]:
                eventos.append({"tipo": "humedad_baja", "valor": t.humedad})
            elif t.humedad > rangos["humedad_max"]:
                eventos.append({"tipo": "humedad_alta", "valor": t.humedad})
            if t.vpd < rangos["vpd_min"]:
                eventos.append({"tipo": "vpd_bajo", "valor": t.vpd})
            elif t.vpd > rangos["vpd_max"]:
                eventos.append({"tipo": "vpd_alto", "valor": t.vpd})
        vistos: set[str] = set()
        eventos_unicos: list[dict[str, Any]] = []
        for ev in eventos:
            if ev["tipo"] not in vistos:
                vistos.add(ev["tipo"])
                eventos_unicos.append(ev)
                if len(eventos_unicos) >= 5:
                    break
        eventos = eventos_unicos

    span = telemetrias[-1].timestamp - telemetrias[0].timestamp
    minutos_registro = round(span.total_seconds() / 60.0, 1)

    return {
        "actual": actual,
        "estadisticas": estadisticas,
        "tendencia": tendencia,
        "eventos": eventos,
        "minutos_registro": minutos_registro,
        "total_lecturas": len(telemetrias),
    }
