from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any
from datetime import datetime, timedelta, timezone
import json

import database
import llm_service
import models
import schemas
import vpd
from telemetria_analisis import resumir_telemetria

router = APIRouter()


# Estado del sistema
@router.get("/planta-activa")
def get_planta_activa(db: Session = Depends(database.get_db)):
    estado_sistema = (
        db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
    )
    if not estado_sistema:
        raise HTTPException(status_code=404, detail="No hay planta configurada")

    return {"planta_activa_id": estado_sistema.planta_activa_id}


@router.post("/planta-activa/{planta_id}")
def set_planta_activa(planta_id: int, db: Session = Depends(database.get_db)):
    planta = db.query(models.Planta).filter(models.Planta.id == planta_id).first()
    if not planta:
        raise HTTPException(status_code=404, detail="Planta no encontrada")

    estado_sistema = (
        db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
    )
    if not estado_sistema:
        estado_sistema = models.EstadoSistema(id=1, planta_activa_id=planta_id)
        db.add(estado_sistema)
    else:
        estado_sistema.planta_activa_id = planta_id

    db.commit()
    return {"planta_activa_id": planta_id}


# Actuador ventana
@router.get("/actuador/ventana", response_model=schemas.VentanaResponse)
def get_ventana(db: Session = Depends(database.get_db)):
    estado = db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
    if not estado:
        raise HTTPException(status_code=404, detail="Sistema no inicializado")
    return schemas.VentanaResponse(ventana_abierta=estado.ventana_abierta)


@router.put("/actuador/ventana", response_model=schemas.VentanaResponse)
def set_ventana(data: schemas.VentanaRequest, db: Session = Depends(database.get_db)):
    estado = db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
    if not estado:
        raise HTTPException(status_code=404, detail="Sistema no inicializado")
    estado.ventana_abierta = data.abierta
    db.commit()
    return schemas.VentanaResponse(ventana_abierta=estado.ventana_abierta)


# Telemetría
@router.post("/telemetria", response_model=schemas.Telemetria)
def create_telemetria(
    data: schemas.TelemetriaCreate, db: Session = Depends(database.get_db)
):
    estado_sistema = (
        db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
    )
    if not estado_sistema:
        raise HTTPException(status_code=404, detail="No hay planta configurada")

    db_telemetria = models.Telemetria(
        planta_id=estado_sistema.planta_activa_id,
        vpd=vpd.calcular_vpd(data.temperatura, data.humedad),
        **data.model_dump(),
    )

    db.add(db_telemetria)
    db.commit()
    db.refresh(db_telemetria)
    return db_telemetria


@router.get("/telemetria/{planta_id}", response_model=list[schemas.Telemetria])
def read_telemetrias(planta_id: int, db: Session = Depends(database.get_db)):
    planta = db.query(models.Planta).filter(models.Planta.id == planta_id).first()
    if not planta:
        raise HTTPException(status_code=404, detail="Planta no encontrada")
    return (
        db.query(models.Telemetria)
        .filter(models.Telemetria.planta_id == planta_id)
        .order_by(models.Telemetria.timestamp.desc())
        .limit(50)
    )


@router.get("/recomendacion", response_model=schemas.RecomendacionResponse)
async def get_recomendacion(db: Session = Depends(database.get_db)):
    estado_sistema = (
        db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
    )
    if not estado_sistema:
        raise HTTPException(status_code=404, detail="No hay planta configurada")

    planta = (
        db.query(models.Planta)
        .filter(models.Planta.id == estado_sistema.planta_activa_id)
        .first()
    )
    if not planta:
        raise HTTPException(status_code=404, detail="Planta no encontrada")

    hace_media_hora = datetime.now(timezone.utc) - timedelta(minutes=30)
    telemetrias = (
        db.query(models.Telemetria)
        .filter(
            models.Telemetria.planta_id == planta.id,
            models.Telemetria.timestamp >= hace_media_hora,
        )
        .order_by(models.Telemetria.timestamp.asc())
        .all()
    )
    if not telemetrias:
        raise HTTPException(status_code=404, detail="No hay telemetría disponible")

    contexto_completo: list[dict[str, Any]] = []
    for telemetria in telemetrias:
        contexto_completo.append(
            {
                "timestamp": telemetria.timestamp.isoformat(),
                "temperatura": telemetria.temperatura,
                "humedad": telemetria.humedad,
                "vpd": telemetria.vpd,
            }
        )

    contexto_resumen = resumir_telemetria(telemetrias, nombre_planta=planta.nombre)
    prompt_usuario = llm_service.construir_prompt_usuario(
        planta=planta.nombre,
        contexto_resumen=contexto_resumen,
        ventana_abierta=estado_sistema.ventana_abierta,
    )

    try:
        rec = await llm_service.obtener_recomendacion(prompt_usuario)
    except llm_service.LLMServiceError as e:
        raise HTTPException(status_code=503, detail=str(e))

    db_rec = models.RecomendacionLLM(
        planta_id=planta.id,
        mensaje=rec.mensaje,
        severidad=rec.severidad,
        comando=rec.comando,
        contexto=json.dumps(contexto_completo),
    )

    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)

    if rec.comando and rec.comando.upper() in ("ABRIR", "CERRAR"):
        estado_sistema.ventana_abierta = rec.comando.upper() == "ABRIR"
        db.commit()

    return schemas.RecomendacionResponse(
        mensaje=rec.mensaje,
        severidad=rec.severidad,
        comando=rec.comando,
    )


@router.post("/recomendacion/simulacion", response_model=schemas.RecomendacionResponse)
async def get_recomendacion_simulacion(data: schemas.SimulacionRequest):
    vpd_val = vpd.calcular_vpd(data.temperatura, data.humedad)
    contexto_resumen = {
        "actual": {
            "temperatura": data.temperatura,
            "humedad": data.humedad,
            "vpd": vpd_val,
        },
        "estadisticas": {
            "temperatura": {
                "min": data.temperatura,
                "max": data.temperatura,
                "avg": data.temperatura,
            },
            "humedad": {
                "min": data.humedad,
                "max": data.humedad,
                "avg": data.humedad,
            },
            "vpd": {
                "min": vpd_val,
                "max": vpd_val,
                "avg": vpd_val,
            },
        },
        "tendencia": {
            "temperatura": "estable",
            "humedad": "estable",
            "vpd": "estable",
        },
        "eventos": [],
        "minutos_registro": 0,
        "total_lecturas": 1,
    }
    prompt_usuario = llm_service.construir_prompt_usuario(
        planta=data.planta_nombre,
        contexto_resumen=contexto_resumen,
    )

    try:
        rec = await llm_service.obtener_recomendacion(prompt_usuario)
    except llm_service.LLMServiceError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return schemas.RecomendacionResponse(
        mensaje=rec.mensaje,
        severidad=rec.severidad,
        comando=rec.comando,
    )
