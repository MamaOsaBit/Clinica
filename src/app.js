const express = require('express');
const path = require('path');
const routes = require('./routes');
const registerRouter = require('./routes/registerRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use('/', registerRouter);

// Rutas para vistas HTML
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/paciente/solicitar-hora', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'solicitarHora.html'));
});

app.get('/medico/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'medicoPanel.html'));
});

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

module.exports = app;

