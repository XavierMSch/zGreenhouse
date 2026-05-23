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
class RecomendacionLLMBase(BaseModel):
    severidad: str  # "verde", "amarillo", "rojo"
    mensaje: str
    contexto_analizado: str  # Snapshot JSON en formato texto
    planta_id: int


class RecomendacionLLMCreate(RecomendacionLLMBase):
    pass


class RecomendacionLLM(RecomendacionLLMBase):
    id: int
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)


# Simulacion
class SimulacionRequest(BaseModel):
    planta_nombre: str
    temperatura: float
    humedad: float
    luz: float
