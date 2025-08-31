/* === VALIDACIONES === */
const errorHandler = require('./src/middlewares/errorHandler')
const LoggerMiddleware = require('./src/middlewares/logger')
const { capitalizeName, normalizeEmail } = require('./src/utils/validacion')

const authenticateToken = require('./src/middlewares/auth');

/* === DOTENV === */
require('dotenv').config()
const dotenvVersion = require('dotenv/package.json').version
console.log(`🚀 Iniciando server con dotenv v${dotenvVersion}`)

/* ======= */
const express = require ('express')
const bodyParser = require('body-parser')
const { PrismaClient } = require('./generated/prisma')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(LoggerMiddleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000


/* === RAIZ / ROOT === */
app.get('/', (req, res) => {
  res.send(`
    <h1>Hello World!  v1</h1>
    <p>Welcome to my Express app!</p>
    <p>Current PORT: ${PORT}</p>
  `);
})

/* === BUSQUEDA === */
app.get('/search', (req, res) => {
  const terms = req.query.q || 'NO EXISTE';
  const category = req.query.categoria || 'TODAS';
  res.send(`
    <h1>Resultado de búsqueda</h1>
    <p>Término de búsqueda: ${terms}</p>
    <p>Categoría: ${category}</p>
  `);
})

/* === FORMULARIO REGISTRO === */
app.get('/register', (req, res) =>{
  res.send(`
    <form action="/register" method="POST">
      <label>Nombre: <input type="text" name="nombre" required></label><br>
      <label>Email: <input type="email" name="email" required></label><br>
      <label>Edad: <input type="number" name="edad"></label><br>
      <label>Contraseña: <input type="password" name="password" required></label>
      <br>
      <button type="submit">Crear</button>
    </form>
    <a href="/db-users">Ver usuarios</a>
  `);
})

/* === API SIMPLE === */
app.post('/api/form', (req, res) => {
  const { nombre, email, edad, rol } = req.body || {}
  res.json({ mensaje: 'Formulario recibido', data: { nombre, email, edad, rol } })
})

app.post('/api/data', (req, res) => {
  const data = req.body
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ mensaje: 'No se recibieron datos' })
  }
  res.status(200).json({ mensaje: 'Datos JSON recibidos', data })
})

/* === LISTAR USUARIOS DB === */
app.get('/db-users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})


app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <label>Email: <input type="email" name="email" required></label><br>
      <label>Contraseña: <input type="password" name="password" required></label><br>
      <button type="submit">Iniciar sesión</button>
    </form>
  `);

  
});

/* === RUTA PROTEGIDA === */
app.get('/protected-route', authenticateToken, (req, res) => {
  res.send('Acceso a ruta protegida')
})

/* === ERROR FORZADO === */
app.get('/error', (req, res, next) => {
  next(new Error('Error forzado para pruebas'))
})

/* === SERVER === */
app.listen(PORT, () => {
  console.log(`Haz click en el link ==> http://localhost:${PORT}`)
})
