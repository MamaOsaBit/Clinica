const path = require('path');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

function registerForm(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'));
}

async function handleRegister(req, res) {
    try {
        const { email, nombre, password, rol, edad } = req.body || {};
        if (!email || !nombre || !password) {
            if (req.is('application/json') || req.headers['accept']?.includes('application/json')) {
                return res.status(400).json({ error: 'Faltan campos requeridos: email, nombre o password' });
            }
            return res.status(400).send('Faltan campos requeridos');
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            if (req.is('application/json') || req.headers['accept']?.includes('application/json')) {
                return res.status(409).json({ error: 'Usuario ya registrado' });
            }
            return res.status(409).send('Usuario ya registrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                nombre,
                edad: edad ? parseInt(edad, 10) : null,
                rol: rol || 'PACIENTE',
                password: hashedPassword
            }
        });
        if (!req.is('application/json')) {
            return res.redirect('/login');
        }
        return res.status(201).json({ id: newUser.id, email: newUser.email, nombre: newUser.nombre, rol: newUser.rol });
    } catch (error) {
        console.error('handleRegister error:', error);
        if (req.is('application/json') || req.headers['accept']?.includes('application/json')) {
            return res.status(500).json({ error: 'Error interno' });
        }
        return res.redirect('https://http.cat/images/500.jpg');
    }
}

module.exports = {
    registerForm,
    handleRegister
};