from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from app.db import Base

class Envio(Base):
    __tablename__ = "envios" # Nombre de tu tabla

    id = Column(Integer, primary_key=True, index=True)
    Usuario_Id = Column(Integer, nullable=False) # Asumiendo que es un ID del servicio de auth
    Vehiculo_id = Column(String(24), nullable=False) # ID de Mongo (string)
    origen = Column(String(255), nullable=False)
    destino = Column(String(255), nullable=False)
    Fecha_envio = Column(Date, nullable=False)
    estado = Column(
        Enum("pendiente", "en transito", "entregado", name="estado_envio"),
        default="pendiente"
    )