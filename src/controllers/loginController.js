const path = require('path');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

function loginForm(req, res) {
    res.sendFile(path.join(__dirname, '../views/login.html'));
}

async function handleLogin(req, res) {
    try {
        console.log('handleLogin reached with body:', req.body);
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.redirect('/login');
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.redirect('/login');
        // Redirigir según el rol
        if (user.rol === 'DOCTOR') {
            return res.redirect(`/medico/panel?doctorId=${user.id}`);
        } else if (user.rol === 'PACIENTE') {
            return res.redirect(`/paciente/solicitar-hora?pacienteId=${user.id}`);
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        console.error('handleLogin error:', error);
        return res.redirect('https://http.cat/images/500.jpg');
    }
}

module.exports = {
    loginForm,
    handleLogin
};