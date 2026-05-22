from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import database
import models
import schemas

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
        planta_id=estado_sistema.planta_activa_id, **data.model_dump()
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
def get_recommendacion():
    # 1. Obtén lecturas de la última hora de tu DB
    # 2. Llama al LLM con ollama
    # 3. Retorna {"recommendation": "...", "command": "OPEN"} o {"command": None}
    ...
