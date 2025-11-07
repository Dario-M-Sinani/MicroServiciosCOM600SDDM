# Usar una imagen base ligera de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto interno en el que corre la app
EXPOSE 3001

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]