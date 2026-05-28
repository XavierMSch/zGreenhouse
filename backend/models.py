from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Float, DateTime, Text
from datetime import datetime, timezone


class Base(DeclarativeBase):
    pass


class Planta(Base):
    __tablename__ = "planta"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    telemetrias: Mapped[list["Telemetria"]] = relationship(
        "Telemetria", back_populates="planta"
    )
    recomendaciones: Mapped[list["RecomendacionLLM"]] = relationship(
        "RecomendacionLLM", back_populates="planta"
    )


class Telemetria(Base):
    __tablename__ = "telemetria"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    planta_id: Mapped[int] = mapped_column(ForeignKey("planta.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    temperatura: Mapped[float] = mapped_column(Float)
    humedad: Mapped[float] = mapped_column(Float)
    vpd: Mapped[float] = mapped_column(Float)

    planta: Mapped["Planta"] = relationship("Planta", back_populates="telemetrias")


class RecomendacionLLM(Base):
    __tablename__ = "recomendacion_llm"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    planta_id: Mapped[int] = mapped_column(ForeignKey("planta.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    mensaje: Mapped[str] = mapped_column(Text, default="Sin recomendación disponible")
    severidad: Mapped[str] = mapped_column(String(20), default="baja")
    contexto: Mapped[str] = mapped_column(Text)
    comando: Mapped[str] = mapped_column(
        String(20), nullable=True
    )  # "ABRIR", "CERRAR", o None

    planta: Mapped["Planta"] = relationship("Planta", back_populates="recomendaciones")


class EstadoSistema(Base):
    __tablename__ = "estado_sistema"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    planta_activa_id: Mapped[int] = mapped_column(
        ForeignKey("planta.id"), nullable=False
    )
    ventana_abierta: Mapped[bool] = mapped_column(default=False)
