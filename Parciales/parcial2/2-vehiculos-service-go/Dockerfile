FROM golang:1.21-alpine AS builder

WORKDIR /app

RUN go install github.com/swaggo/swag/cmd/swag@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

COPY ../protos/vehiculos.pb.go ./protos/
COPY ../protos/vehiculos_grpc.pb.go ./protos/

RUN swag init -g main.go

RUN CGO_ENABLED=0 GOOS=linux go build -o /vehiculo-server ./main.go

FROM alpine:3.18

WORKDIR /root/

COPY --from=builder /vehiculo-server .

COPY --from=builder /app/docs ./docs

EXPOSE 3002
EXPOSE 50051

CMD ["./vehiculo-server"]