const clientes = require('../data/clientes.json');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/clientes.json');

const getClientes = (req, res) => {
    const { page = 1, limit } = req.query;
    const parsedLimit = parseInt(limit);

    if (!limit || ![5, 10, 100].includes(parsedLimit)) {
        // Si no se proporciona un límite o no es válido, devuelve la lista completa.
        return res.json(clientes);
    }

    const startIndex = (parseInt(page) - 1) * parsedLimit;
    const paginatedClientes = clientes.slice(startIndex, startIndex + parsedLimit);

    res.json(paginatedClientes);
};

const getCliente = (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.params.id));
    if (!cliente) return res.status(404).send('Cliente no encontrado.');
    res.json(cliente);
};

const createCliente = (req, res) => {
    const nuevoCliente = {
        id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
        ci: req.body.ci,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        sexo: req.body.sexo
    };
    clientes.push(nuevoCliente);
    fs.writeFileSync(dataPath, JSON.stringify(clientes, null, 2));
    res.status(201).json(nuevoCliente);
};

const updateCliente = (req, res) => {
    const cliente = clientes.find(c => c.id === parseInt(req.params.id));
    if (!cliente) return res.status(404).send('Cliente no encontrado.');

    cliente.ci = req.body.ci || cliente.ci;
    cliente.nombres = req.body.nombres || cliente.nombres;
    cliente.apellidos = req.body.apellidos || cliente.apellidos;
    cliente.sexo = req.body.sexo || cliente.sexo;

    fs.writeFileSync(dataPath, JSON.stringify(clientes, null, 2));
    res.json(cliente);
};

const deleteCliente = (req, res) => {
    const clienteIndex = clientes.findIndex(c => c.id === parseInt(req.params.id));
    if (clienteIndex === -1) return res.status(404).send('Cliente no encontrado.');

    clientes.splice(clienteIndex, 1);
    fs.writeFileSync(dataPath, JSON.stringify(clientes, null, 2));
    res.status(204).send();
};

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente
};