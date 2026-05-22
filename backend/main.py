from fastapi import FastAPI
from database import SessionLocal, engine
import models
import routers
from contextlib import asynccontextmanager
from crear_plantas import iniciar_plantas

models.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        # Que al menos exista una planta
        planta = db.query(models.Planta).order_by(models.Planta.id).first()
        if not planta:
            iniciar_plantas()
            planta = db.query(models.Planta).order_by(models.Planta.id).first()

        # Que exista un estado de sistema
        estado = (
            db.query(models.EstadoSistema).filter(models.EstadoSistema.id == 1).first()
        )
        if not estado and planta:
            db.add(models.EstadoSistema(id=1, planta_activa_id=planta.id))
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(routers.router)
