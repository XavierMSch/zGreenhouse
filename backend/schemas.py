from pydantic import BaseModel, ConfigDict
from datetime import datetime


# Planta
class PlantaBase(BaseModel):
    nombre: str


class PlantaCreate(PlantaBase):
    pass


class Planta(PlantaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# Telemetria
class TelemetriaBase(BaseModel):
    temperatura: float
    humedad: float


class TelemetriaCreate(TelemetriaBase):
    pass


class Telemetria(TelemetriaBase):
    id: int
    planta_id: int
    timestamp: datetime
    vpd: float
    model_config = ConfigDict(from_attributes=True)


class TelemetriaSimulacion(TelemetriaBase):
    model_config = ConfigDict(from_attributes=True)


# RecomendacionLLM
class RecomendacionResponse(BaseModel):
    mensaje: str
    severidad: str
    comando: str | None = None


# Simulacion
class SimulacionRequest(BaseModel):
    planta_nombre: str
    temperatura: float
    humedad: float


# Actuador
class VentanaRequest(BaseModel):
    abierta: bool


class VentanaResponse(BaseModel):
    ventana_abierta: bool
