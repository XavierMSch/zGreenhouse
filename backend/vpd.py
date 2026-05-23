import math


def calcular_vpd(temperatura: float, humedad: float) -> float:
    saturacion = 0.6108 * math.exp((17.27 * temperatura) / (temperatura + 237.3))
    return round(saturacion * (1 - (humedad / 100.0)), 2)
