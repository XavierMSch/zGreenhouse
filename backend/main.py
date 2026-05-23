from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers.router)
