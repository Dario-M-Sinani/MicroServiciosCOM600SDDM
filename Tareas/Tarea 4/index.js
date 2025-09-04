const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const productosRouter = require('./routes/productos');

app.use('/productos', productosRouter);

const clientesRouter = require('./routes/clientes');
app.use('/clientes', clientesRouter);

const facturasRouter = require('./routes/facturas');
app.use('/facturas', facturasRouter);

app.get('/', (req, res) => {
  res.send('API de Ventas');
});

const { setupSwagger } = require('./swagger');
setupSwagger(app);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
});
