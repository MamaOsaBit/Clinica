const express = require('express');
const path = require('path');
const routes = require('./routes');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const medicoRouter = require('./routes/medico');
const loginController = require('./controllers/loginController');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple para depuración de rutas y métodos
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Explicit POST handler to ensure /login is handled (covers direct POST requests)
app.post('/login', (req, res, next) => {
  console.log('app.js caught POST /login, delegating to loginController');
  return loginController.handleLogin(req, res, next);
});

app.use('/api', routes);
app.use('/', registerRouter);
app.use('/', loginRouter);
app.use('/', medicoRouter);
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
// Serve extracted JS for views
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

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

