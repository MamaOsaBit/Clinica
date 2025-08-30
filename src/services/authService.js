const { PrismaClient } = require('../../generated/prisma') // Ajusta la ruta si es necesario
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (nombre, email, edad, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            nombre,
            email,
            edad,
            password: hashedPassword,
            rol: 'PACIENTE'
        }
    });
    return newUser;
};

const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Usuario no encontrado');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Contraseña incorrecta');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
