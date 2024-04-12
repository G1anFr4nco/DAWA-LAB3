const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');

// Middleware para procesar datos del cuerpo de las solicitudes HTTP
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para manejar sesiones
app.use(session({
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: true
}));

// Directorio de archivos estáticos
app.use(express.static(__dirname + '/public'));

// Ruta de selección de curso
app.get('/', (req, res) => {
    req.session.curso = null; // Reiniciar la selección de curso en cada visita a la página inicial
    res.render('cursos');
});

// Ruta de selección de curso (POST)
app.post('/matriculas', (req, res) => {
    req.session.curso = req.body.curso;
    req.session.modulos = []; // Reiniciar la selección de módulos al cambiar de curso
    res.render('modulos', { curso: req.session.curso });
});

// Ruta de selección de módulos
app.post('/modulos', (req, res) => {
    if (req.body.modulos) {
        req.session.modulos = req.body.modulos;
    }
    res.render('pago', { curso: req.session.curso, modulos: req.session.modulos });
});

// Ruta de confirmación de matrícula
app.post('/confirmacion', (req, res) => {
    const curso = req.session.curso;
    const modulos = req.session.modulos || [];
    const medioPago = req.body.medioPago;
    let total = 0;
    modulos.forEach(modulo => {
        if (curso === 'Java') {
            total += 1200;
        } else if (curso === 'PHP') {
            total += 800;
        } else if (curso === '.NET') {
            total += 1500;
        }
    });
    if (medioPago === 'Efectivo') {
        total *= 0.9; // Aplicar descuento del 10% si se paga en efectivo
    }
    res.render('confirmacion', { curso, modulos, medioPago, total });
});

// Puerto en el que el servidor escucha las solicitudes
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
