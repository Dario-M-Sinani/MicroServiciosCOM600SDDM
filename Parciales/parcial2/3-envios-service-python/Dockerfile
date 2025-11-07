# Usar una imagen base de Python
FROM python:3.10-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente de la aplicación
COPY ./app /app/app

# Exponer el puerto interno en el que corre la app
EXPOSE 3003

# Comando para iniciar la aplicación con Uvicorn
# 0.0.0.0 para escuchar en todas las interfaces
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3003"]