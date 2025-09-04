const productos = require('../data/productos.json');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/productos.json');

const getProductos = (req, res) => {
    const { page = 1, limit } = req.query;
    const parsedLimit = parseInt(limit);

    if (!limit || ![5, 10, 100].includes(parsedLimit)) {
        // Si no se proporciona un límite o no es válido, devuelve la lista completa.
        return res.json(productos);
    }

    const startIndex = (parseInt(page) - 1) * parsedLimit;
    const paginatedProductos = productos.slice(startIndex, startIndex + parsedLimit);

    res.json(paginatedProductos);
};

const getProducto = (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).send('Producto no encontrado.');
    res.json(producto);
};

const createProducto = (req, res) => {
    const nuevoProducto = {
        id: productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        marca: req.body.marca,
        stock: req.body.stock
    };
    productos.push(nuevoProducto);
    fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
    res.status(201).json(nuevoProducto);
};

const updateProducto = (req, res) => {
    const producto = productos.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).send('Producto no encontrado.');

    producto.nombre = req.body.nombre || producto.nombre;
    producto.descripcion = req.body.descripcion || producto.descripcion;
    producto.marca = req.body.marca || producto.marca;
    producto.stock = req.body.stock || producto.stock;

    fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
    res.json(producto);
};

const deleteProducto = (req, res) => {
    const productoIndex = productos.findIndex(p => p.id === parseInt(req.params.id));
    if (productoIndex === -1) return res.status(404).send('Producto no encontrado.');

    productos.splice(productoIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(productos, null, 2));
    res.status(204).send();
};

module.exports = {
    getProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto
};