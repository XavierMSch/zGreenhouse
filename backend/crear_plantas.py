from database import engine, SessionLocal
import models

PLANTAS = [
    {"id": 1, "nombre": "menta"},
    {"id": 2, "nombre": "tomillo"},
    {"id": 3, "nombre": "albahaca"},
    {"id": 4, "nombre": "romero"},
]


def iniciar_plantas() -> None:
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for planta in PLANTAS:
            existe = (
                db.query(models.Planta).filter(models.Planta.id == planta["id"]).first()
            )
            if not existe:
                db.add(models.Planta(**planta))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    iniciar_plantas()
