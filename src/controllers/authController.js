const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
    try {
        const {
            nombre,
            email,
            edad,
            password
        } = req.body;

        if (!email || !nombre) {
            return res.status(400).json({ error: 'Faltan campos requeridos' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                nombre: capitalizeName(nombre),
                email: normalizeEmail(email),
                edad: edad ? parseInt(edad, 10) : null,
                rol: 'PACIENTE',
                password: hashedPassword
            }
        })
        res.redirect(`https://http.cat/images/201.jpg`)
    } catch (error) {
        res.redirect(`https://http.cat/images/400.jpg`)
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        return res.redirect(`https://http.cat/images/200.jpg`);

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.redirect(`https://http.cat/images/401.jpg`);
    }
};

module.exports = {
    register,
    login
};