from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any
import json

import database
import llm_service
import models
import schemas
import vpd

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


@router.get("/recomendacion")
def get_recomendacion(db: Session = Depends(database.get_db)):
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

    telemetrias = (
        db.query(models.Telemetria)
        .filter(models.Telemetria.planta_id == planta.id)
        .order_by(models.Telemetria.timestamp.desc())
        .limit(120)
        .all()
    )
    if not telemetrias:
        raise HTTPException(status_code=404, detail="No hay telemetría disponible")

    contexto: list[dict[str, Any]] = []
    for telemetria in reversed(telemetrias):
        contexto.append(
            {
                "timestamp": telemetria.timestamp.isoformat(),
                "temperatura": telemetria.temperatura,
                "humedad": telemetria.humedad,
                "vpd": telemetria.vpd,
            }
        )

    prompt_usuario = llm_service.construir_prompt_usuario(
        planta=planta.nombre,
        contexto=contexto,
    )

    rec = llm_service.obtener_recomendacion(prompt_usuario)

    rec_dict = rec if isinstance(rec, dict) else json.loads(rec)

    comando_llm = rec_dict.get("comando")
    if comando_llm and comando_llm.lower() == "none":
        comando_llm = None

    db_rec = models.RecomendacionLLM(
        planta_id=planta.id,
        mensaje=rec_dict.get("mensaje"),
        severidad=rec_dict.get("severidad"),
        comando=comando_llm,
        contexto=json.dumps(contexto),
    )

    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)

    return rec


@router.post("/recomendacion/simulacion")
def get_recomendacion_simulacion(data: schemas.SimulacionRequest):
    telemetria = {
        "temperatura": data.temperatura,
        "humedad": data.humedad,
        "vpd": vpd.calcular_vpd(data.temperatura, data.humedad),
    }
    prompt_usuario = llm_service.construir_prompt_usuario(
        planta=data.planta_nombre,
        contexto=[],
        telemetria=telemetria,
    )

    return llm_service.obtener_recomendacion(prompt_usuario)
