# ----- Etapa 1: Build -----
# Usa la imagen oficial de Go como base
FROM golang:1.25-alpine AS builder
WORKDIR /app

# Copia los archivos de módulos y descarga dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copia el resto del código fuente
COPY . .

# Compila la aplicación
# -o /app/server: Saca el binario con el nombre "server"
# -ldflags="-w -s": Reduce el tamaño del binario
# ./cmd/server: El path a tu main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server -ldflags="-w -s" ./cmd/server

# ----- Etapa 2: Final -----
# Usa una imagen base mínima (scratch o alpine)
FROM alpine:latest
# FROM scratch

WORKDIR /root/

# Copia el binario compilado de la etapa 'builder'
COPY --from=builder /app/server .

# (Opcional) Si usas SSL, copia los certificados
# COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Expone el puerto que usa tu aplicación
EXPOSE 8081

# Comando para ejecutar la aplicación
CMD ["./server"]