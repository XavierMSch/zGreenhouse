from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Float, DateTime, Text
from datetime import datetime


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
        DateTime, default=datetime.now(datetime.timezone.utc)
    )
    temperatura: Mapped[float] = mapped_column(Float)
    humedad: Mapped[float] = mapped_column(Float)
    luminosidad: Mapped[float] = mapped_column(Float)

    planta: Mapped["Planta"] = relationship("Planta", back_populates="telemetrias")


class RecomendacionLLM(Base):
    __tablename__ = "recomendacion_llm"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    planta_id: Mapped[int] = mapped_column(ForeignKey("planta.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(datetime.timezone.utc)
    )
    mensaje: Mapped[str] = mapped_column(Text)
    severidad: Mapped[str] = mapped_column(String(20))
    contexto: Mapped[str] = mapped_column(Text)

    planta: Mapped["Planta"] = relationship("Planta", back_populates="recomendaciones")
