package handlers

import (
	"context"
	"net/http"
	"time"

	"vehiculos-service-go/config"
	"vehiculos-service-go/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// @Summary Crea un nuevo vehículo
// @Description Añade un nuevo vehículo a la flota.
// @Tags Vehiculos
// @Accept json
// @Produce json
// @Param vehiculo body models.Vehiculo true "Datos del Vehículo"
// @Success 201 {object} models.Vehiculo
// @Failure 400 {object} map[string]interface{}
// @Security BearerAuth
// @Router /vehiculos [post]
func CrearVehiculo(c *gin.Context) {
	var vehiculo models.Vehiculo
	if err := c.ShouldBindJSON(&vehiculo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Asignar estado por defecto si no se provee
	if vehiculo.Estado == "" {
		vehiculo.Estado = "disponible"
	}
	// MongoDB asignará el _id automáticamente
	vehiculo.ID = primitive.NewObjectID()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := config.VehiculoCollection.InsertOne(ctx, vehiculo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el vehículo"})
		return
	}

	c.JSON(http.StatusCreated, vehiculo)
}

// @Summary Lista todos los vehículos
// @Description Obtiene una lista de todos los vehículos en la flota.
// @Tags Vehiculos
// @Produce json
// @Success 200 {array} models.Vehiculo
// @Failure 500 {object} map[string]interface{}
// @Security BearerAuth
// @Router /vehiculos [get]
func ListarVehiculos(c *gin.Context) {
	var vehiculos []models.Vehiculo
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := config.VehiculoCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al listar vehículos"})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &vehiculos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al decodificar vehículos"})
		return
	}

	c.JSON(http.StatusOK, vehiculos)
}

// ... (después de la función ListarVehiculos) ...

// @Summary Obtiene un vehículo por ID
// @Description Obtiene los detalles de un vehículo específico usando su ID.
// @Tags Vehiculos
// @Produce json
// @Param id path string true "ID del Vehículo (Mongo ObjectID)"
// @Success 200 {object} models.Vehiculo
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Security BearerAuth
// @Router /vehiculos/{id} [get]
func ObtenerVehiculo(c *gin.Context) {
	// Obtener el ID de los parámetros de la URL
	idParam := c.Param("id")
	
	// Convertir el string ID a un ObjectID de MongoDB
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de vehículo inválido"})
		return
	}

	var vehiculo models.Vehiculo
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Buscar el vehículo en la BD por su _id
	err = config.VehiculoCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&vehiculo)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehículo no encontrado"})
		return
	}

	c.JSON(http.StatusOK, vehiculo)
}

// @Summary Actualiza un vehículo
// @Description Actualiza los datos de un vehículo existente por su ID.
// @Tags Vehiculos
// @Accept json
// @Produce json
// @Param id path string true "ID del Vehículo"
// @Param vehiculo body models.Vehiculo true "Datos del Vehículo a actualizar"
// @Success 200 {object} models.Vehiculo
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Security BearerAuth
// @Router /vehiculos/{id} [put]
func ActualizarVehiculo(c *gin.Context) {
	idParam := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de vehículo inválido"})
		return
	}

	var vehiculo models.Vehiculo
	// Validar el JSON del body
	if err := c.ShouldBindJSON(&vehiculo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Crear el filtro para buscar
	filter := bson.M{"_id": objID}
	
	// Crear el set de actualización
	update := bson.M{
		"$set": bson.M{
			"placa":     vehiculo.Placa,
			"tipo":      vehiculo.Tipo,
			"capacidad": vehiculo.Capacidad,
			"estado":    vehiculo.Estado,
		},
	}

	// Ejecutar la actualización
	result, err := config.VehiculoCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el vehículo"})
		return
	}

	// Verificar si algo fue realmente actualizado
	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehículo no encontrado"})
		return
	}

	// Devolver el vehículo "actualizado" (los datos que se enviaron)
	vehiculo.ID = objID // Asignar el ID para la respuesta
	c.JSON(http.StatusOK, vehiculo)
}

// @Summary Elimina un vehículo
// @Description Elimina un vehículo de la flota usando su ID.
// @Tags Vehiculos
// @Produce json
// @Param id path string true "ID del Vehículo (Mongo ObjectID)"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Security BearerAuth
// @Router /vehiculos/{id} [delete]
func EliminarVehiculo(c *gin.Context) {
	idParam := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de vehículo inválido"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Ejecutar la eliminación
	result, err := config.VehiculoCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el vehículo"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehículo no encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensaje": "Vehículo eliminado exitosamente"})
}