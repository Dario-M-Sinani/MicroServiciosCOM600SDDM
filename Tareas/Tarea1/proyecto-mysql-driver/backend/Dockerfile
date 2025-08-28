FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]