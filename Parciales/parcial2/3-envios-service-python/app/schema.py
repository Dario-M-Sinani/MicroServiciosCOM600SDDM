import strawberry
import datetime
from typing import List
from strawberry.types import Info
from strawberry.fastapi import GraphQLRouter
from sqlalchemy.future import select
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db_session, Base, engine
from app.models import Envio
from app.grpc_client.client import verificar_disponibilidad_vehiculo

# ---------------------------------------------------
# Inicialización de la BD (crear tablas)
# ---------------------------------------------------
async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all) # Opcional: para limpiar
        await conn.run_sync(Base.metadata.create_all) # Crea la tabla 'envios'

# ---------------------------------------------------
# Tipos de GraphQL
# ---------------------------------------------------
@strawberry.type
class EnvioType:
    id: int
    Usuario_Id: int
    Vehiculo_id: str
    origen: str
    destino: str
    Fecha_envio: datetime.date
    estado: str

# Input para la mutación de crear envío
@strawberry.input
class CrearEnvioInput:
    Usuario_Id: int
    Vehiculo_id: str # ID de Mongo
    origen: str
    destino: str
    Fecha_envio: datetime.date

# ---------------------------------------------------
# Queries (Consultas)
# ---------------------------------------------------
@strawberry.type
class Query:
    @strawberry.field
    async def get_all_envios(self, info: Info) -> List[EnvioType]:
        session = info.context["db"]
        result = await session.execute(select(Envio))
        envios = result.scalars().all()
        return [EnvioType(**envio.__dict__) for envio in envios]
        
    @strawberry.field
    async def get_envio_by_id(self, info: Info, id: int) -> EnvioType:
        session = info.context["db"]
        envio = await session.get(Envio, id)
        if not envio:
            raise Exception("Envío no encontrado")
        return EnvioType(**envio.__dict__)

# ---------------------------------------------------
# Mutations (Modificaciones)
# ---------------------------------------------------
@strawberry.type
class Mutation:
    @strawberry.mutation
    async def crear_envio(self, info: Info, input: CrearEnvioInput) -> EnvioType:
        session = info.context["db"]
        
        # ----------------------------------------------
        # ¡AQUÍ OCURRE LA MAGIA! (Llamada gRPC)
        # ----------------------------------------------
        try:
            grpc_response = await verificar_disponibilidad_vehiculo(input.Vehiculo_id)
        except Exception as e:
            # Propagar el error de gRPC a GraphQL
            raise Exception(f"Error de gRPC: {str(e)}")

        if not grpc_response.disponible:
            raise Exception(f"Vehículo no disponible. Estado actual: {grpc_response.estado_actual}")
        
        # Si está disponible, crear el envío
        nuevo_envio = Envio(
            Usuario_Id=input.Usuario_Id,
            Vehiculo_id=input.Vehiculo_id,
            origen=input.origen,
            destino=input.destino,
            Fecha_envio=input.Fecha_envio,
            estado="pendiente"
        )
        
        session.add(nuevo_envio)
        await session.commit()
        await session.refresh(nuevo_envio)
        
        return EnvioType(**nuevo_envio.__dict__)

# ---------------------------------------------------
# Crear el esquema de Strawberry
# ---------------------------------------------------
schema = strawberry.Schema(query=Query, mutation=Mutation)

# Crear el "router" de GraphQL
async def get_context(db_session: AsyncSession = Depends(get_db_session)):
    return {"db": db_session}

graphql_app = GraphQLRouter(schema, context_getter=get_context)