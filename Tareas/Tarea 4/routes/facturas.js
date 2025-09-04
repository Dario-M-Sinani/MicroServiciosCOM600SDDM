const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

/**
 * @swagger
 * tags:
 *   name: Facturas
 *   description: Gestión de facturas y sus detalles
 */

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtiene todas las facturas, con opción de paginación
 *     tags: [Facturas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página a obtener.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [5, 10, 100]
 *         description: Número de facturas por página.
 *     responses:
 *       200:
 *         description: Lista de facturas. Si no se especifica un límite válido (5, 10, 100), se devuelve la lista completa.
 */
router.get('/', facturaController.getFacturas);

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Obtiene una factura por su ID
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información de la factura
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id', facturaController.getFactura);

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Crea una nueva factura
 *     tags: [Facturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Factura creada
 *       400:
 *         description: El cliente especificado no existe
 */
router.post('/', facturaController.createFactura);

/**
 * @swagger
 * /facturas/{id}:
 *   put:
 *     summary: Actualiza una factura existente
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Factura actualizada
 *       400:
 *         description: El cliente especificado no existe
 *       404:
 *         description: Factura no encontrada
 */
router.put('/:id', facturaController.updateFactura);

/**
 * @swagger
 * /facturas/{id}:
 *   delete:
 *     summary: Elimina una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Factura eliminada
 *       404:
 *         description: Factura no encontrada
 */
router.delete('/:id', facturaController.deleteFactura);

/**
 * @swagger
 * /facturas/cliente/{cliente_id}:
 *   get:
 *     summary: Obtiene todas las facturas de un cliente específico
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de facturas del cliente
 */
router.get('/cliente/:cliente_id', facturaController.getFacturasByCliente);

/**
 * @swagger
 * /facturas/{id}/detalles:
 *   post:
 *     summary: Añade un detalle a una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       201:
 *         description: Detalle añadido
 *       400:
 *         description: El producto especificado no existe
 *       404:
 *         description: Factura no encontrada
 */
router.post('/:id/detalles', facturaController.addDetalleToFactura);

/**
 * @swagger
 * /facturas/{id}/detalles:
 *   get:
 *     summary: Obtiene todos los detalles de una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de detalles de la factura
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id/detalles', facturaController.getDetallesFromFactura);

/**
 * @swagger
 * /facturas/{id}/detalles/{detalle_id}:
 *   put:
 *     summary: Actualiza un detalle de una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: detalle_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Detalle actualizado
 *       404:
 *         description: Factura o detalle no encontrado
 */
router.put('/:id/detalles/:detalle_id', facturaController.updateDetalleInFactura);

/**
 * @swagger
 * /facturas/{id}/detalles/{detalle_id}:
 *   delete:
 *     summary: Elimina un detalle de una factura
 *     tags: [Facturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: detalle_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Detalle eliminado
 *       404:
 *         description: Factura o detalle no encontrado
 */
router.delete('/:id/detalles/:detalle_id', facturaController.deleteDetalleFromFactura);

module.exports = router;
