const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de clientes
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Obtiene todos los clientes, con opción de paginación
 *     tags: [Clientes]
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
 *         description: Número de clientes por página.
 *     responses:
 *       200:
 *         description: Lista de clientes. Si no se especifica un límite válido (5, 10, 100), se devuelve la lista completa.
 */
router.get('/', clienteController.getClientes);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Obtiene un cliente por su ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', clienteController.getCliente);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Crea un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ci:
 *                 type: string
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               sexo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', clienteController.createCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Actualiza un cliente existente
 *     tags: [Clientes]
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
 *               ci:
 *                 type: string
 *               nombres:
 *                 type: string
 *               apellidos:
 *                 type: string
 *               sexo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/:id', clienteController.updateCliente);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
