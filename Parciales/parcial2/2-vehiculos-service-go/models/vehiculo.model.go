package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Vehiculo struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Placa     string             `bson:"placa" json:"placa" binding:"required"`
	Tipo      string             `bson:"tipo" json:"tipo" binding:"required,oneof=camion furgon moto"`
	Capacidad int                `bson:"capacidad" json:"capacidad" binding:"required"`
	Estado    string             `bson:"estado" json:"estado,omitempty" oneof=disponible 'en ruta' mantenimiento`
}