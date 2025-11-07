from fastapi import FastAPI
from app.schema import graphql_app, init_db
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

@app.on_event("startup")
async def on_startup():
    # Crear las tablas de la BD al iniciar (si no existen)
    await init_db()

# Montar la aplicación GraphQL en la ruta /graphql
app.include_router(graphql_app, prefix="/graphql")

@app.get("/health")
def health_check():
    return {"status": "OK (Python)"}