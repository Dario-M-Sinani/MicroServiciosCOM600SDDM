const express = require('express');
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send(`
        <h1>Calculadora Web</h1>
        <form action="/calcular" method="post">
            <label for="a">Valor de a:</label>
            <input type="text" id="a" name="a" required><br><br>
            <label for="b">Valor de b:</label>
            <input type="text" id="b" name="b" required><br><br>
            <label for="operacion">Operación:</label>
            <select id="operacion" name="operacion">
                <option value="sumar">Sumar</option>
                <option value="restar">Restar</option>
                <option value="multiplicar">Multiplicar</option>
                <option value="dividir">Dividir</option>
            </select><br><br>
            <button type="submit">Calcular</button>
        </form>
    `);
});

app.post('/calcular', (req, res) => {
    const { a, b, operacion } = req.body;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    let resultado;

    switch (operacion) {
        case 'sumar':
            resultado = numA + numB;
            break;
        case 'restar':
            resultado = numA - numB;
            break;
        case 'multiplicar':
            resultado = numA * numB;
            break;
        case 'dividir':
            resultado = numB !== 0 ? numA / numB : 'Error: División por cero';
            break;
        default:
            resultado = 'Operación no válida';
    }

    res.send(`
        <h1>Resultado</h1>
        <p>El resultado de ${operacion} ${a} y ${b} es: ${resultado}</p>
        <a href="/">Volver a la calculadora</a>
    `);
});

app.listen(port, () => {
    console.log(`La aplicación de la calculadora está escuchando en http://localhost:${port}`);
});