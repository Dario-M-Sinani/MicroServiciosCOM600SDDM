const facturas = require('../data/facturas.json');
const clientes = require('../data/clientes.json');
const productos = require('../data/productos.json');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/facturas.json');

const getFacturas = (req, res) => {
    const { page = 1, limit } = req.query;
    const parsedLimit = parseInt(limit);

    if (!limit || ![5, 10, 100].includes(parsedLimit)) {
        // Si no se proporciona un límite o no es válido, devuelve la lista completa.
        return res.json(facturas);
    }

    const startIndex = (parseInt(page) - 1) * parsedLimit;
    const paginatedFacturas = facturas.slice(startIndex, startIndex + parsedLimit);

    res.json(paginatedFacturas);
};

const getFactura = (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) return res.status(404).send('Factura no encontrada.');
    res.json(factura);
};

const createFactura = (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.body.cliente_id));
    if (!cliente) return res.status(400).send('El cliente especificado no existe.');

    const nuevaFactura = {
        id: facturas.length > 0 ? Math.max(...facturas.map(f => f.id)) + 1 : 1,
        fecha: new Date(),
        cliente_id: req.body.cliente_id,
        detalles: []
    };
    facturas.push(nuevaFactura);
    fs.writeFileSync(dataPath, JSON.stringify(facturas, null, 2));
    res.status(201).json(nuevaFactura);
};

const updateFactura = (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) return res.status(404).send('Factura no encontrada.');

    if (req.body.cliente_id) {
        const cliente = clientes.find(c => c.id === parseInt(req.body.cliente_id));
        if (!cliente) return res.status(400).send('El cliente especificado no existe.');
        factura.cliente_id = req.body.cliente_id;
    }

    fs.writeFileSync(dataPath, JSON.stringify(facturas, null, 2));
    res.json(factura);
};

const deleteFactura = (req, res) => {
    const facturaIndex = facturas.findIndex(f => f.id === parseInt(req.params.id));
    if (facturaIndex === -1) return res.status(404).send('Factura no encontrada.');

    facturas.splice(facturaIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(facturas, null, 2));
    res.status(204).send();
};

const getFacturasByCliente = (req, res) => {
    const clienteFacturas = facturas.filter(f => f.cliente_id === parseInt(req.params.cliente_id));
    res.json(clienteFacturas);
};

const addDetalleToFactura = (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) return res.status(404).send('Factura no encontrada.');

    const producto = productos.find(p => p.id === parseInt(req.body.producto_id));
    if (!producto) return res.status(400).send('El producto especificado no existe.');

    const nuevoDetalle = {
        id: factura.detalles.length > 0 ? Math.max(...factura.detalles.map(d => d.id)) + 1 : 1,
        producto_id: req.body.producto_id,
        cantidad: req.body.cantidad,
        precio: req.body.precio
    };

    factura.detalles.push(nuevoDetalle);
    fs.writeFileSync(dataPath, JSON.stringify(facturas, null, 2));
    res.status(201).json(nuevoDetalle);
};

const getDetallesFromFactura = (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) return res.status(404).send('Factura no encontrada.');
    res.json(factura.detalles);
};

const updateDetalleInFactura = (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) return res.status(404).send('Factura no encontrada.');

    const detalle = factura.detalles.find(d => d.id === parseInt(req.params.detalle_id));
    if (!detalle) return res.status(404).send('Detalle no encontrado.');

    detalle.cantidad = req.body.cantidad || detalle.cantidad;
    detalle.precio = req.body.precio || detalle.precio;

    fs.writeFileSync(dataPath, JSON.stringify(facturas, null, 2));
    res.json(detalle);
};

const deleteDetalleFromFactura = (req, res) => {
    const factura = facturas.find(f => f.id === parseInt(req.params.id));
    if (!factura) return res.status(404).send('Factura no encontrada.');

    const detalleIndex = factura.detalles.findIndex(d => d.id === parseInt(req.params.detalle_id));
    if (detalleIndex === -1) return res.status(404).send('Detalle no encontrado.');

    factura.detalles.splice(detalleIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(facturas, null, 2));
    res.status(204).send();
};

module.exports = {
    getFacturas,
    getFactura,
    createFactura,
    updateFactura,
    deleteFactura,
    getFacturasByCliente,
    addDetalleToFactura,
    getDetallesFromFactura,
    updateDetalleInFactura,
    deleteDetalleFromFactura
};