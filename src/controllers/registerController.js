const bcrypt = require('bcrypt');

function registerForm(req, res){
    res.send(`
    <html>
      <head>
        <title>Registro</title>
      </head>
      <body>
        <h1>Crear cuenta</h1>
        <form method="POST" action="/register">
          <label>Email:</label>
          <input type="email" name="email" required />
          <br>
          <label>Nombre:</label>
          <input type="text" name="nombre" required />
          <br>
          <label>Password:</label>
          <input type="password" name="password" required />
          <br>
          <button type="submit">Registrarse</button>
        </form>
      </body>
    </html>
  `);
}

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

async function handleRegister(req, res){
    try {
        const { email, nombre, password, rol } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                nombre,
                rol: rol || 'PACIENTE',
                password: hashedPassword // Guarda la contraseña encriptada
            }
        });

        res.redirect('https://http.cat/images/200.jpg')
    } catch (error) {
        console.error(error);
        res.redirect('https://http.cat/images/500.jpg');
    }
}

module.exports = {
    registerForm,
    handleRegister
};