const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Obtiene todos los productos, con opción de paginación
 *     tags: [Productos]
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
 *         description: Número de productos por página.
 *     responses:
 *       200:
 *         description: Lista de productos. Si no se especifica un límite válido (5, 10, 100), se devuelve la lista completa.
 */
router.get('/', productoController.getProductos);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productoController.getProducto);

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               marca:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post('/', productoController.createProducto);

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Productos]
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               marca:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', productoController.updateProducto);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', productoController.deleteProducto);

module.exports = router;
