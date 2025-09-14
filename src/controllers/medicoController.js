const path = require('path');
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

// Simulación de autenticación: obtener el doctorId desde req.user o query (ajusta según tu auth real)
function getDoctorId(req) {
    // Soporta múltiples fuentes: req.user (auth), body (form), query (url) o header X-Doctor-Id
    if (req?.user?.id) return req.user.id;
    // body (form POST)
    if (req.body && (req.body.doctorId || req.body.doctorid)) {
        const val = req.body.doctorId || req.body.doctorid;
        const n = parseInt(val, 10);
        if (!Number.isNaN(n)) return n;
    }
    // header
    if (req.headers && (req.headers['x-doctor-id'] || req.headers['x-doctorid'])) {
        const val = req.headers['x-doctor-id'] || req.headers['x-doctorid'];
        const n = parseInt(val, 10);
        if (!Number.isNaN(n)) return n;
    }
    // query
    if (req.query && req.query.doctorId) {
        const n = parseInt(req.query.doctorId, 10);
        if (!Number.isNaN(n)) return n;
    }
    return null;
}

// Mostrar panel del médico con horas libres y tomadas
async function medicoPanel(req, res) {
    const doctorId = getDoctorId(req);
    if (!doctorId) return res.status(401).send('No autenticado');
    try {
        // Servir la vista estática; el HTML hará fetch a /api/medico/horas?doctorId=...
        return res.sendFile(path.join(__dirname, '..', 'views', 'medicoPanel.html'));
    } catch (error) {
        console.error('Error en medicoPanel:', error);
        res.status(500).send('Error interno');
    }
}

// API: devuelve horas libres y tomadas en JSON
async function apiGetHoras(req, res) {
    const doctorId = getDoctorId(req) || parseInt(req.query.doctorId, 10);
    if (!doctorId) return res.status(401).json({ error: 'No autenticado' });
    try {
        const horasLibres = await prisma.horaMedica.findMany({
            where: { doctorId, pacienteId: null },
            include: { hora: true }
        });
        const horasTomadas = await prisma.horaMedica.findMany({
            where: { doctorId, pacienteId: { not: null } },
            include: { hora: true, paciente: true }
        });
        return res.json({ horasLibres, horasTomadas });
    } catch (error) {
        console.error('apiGetHoras error:', error);
        return res.status(500).json({ error: 'Error interno' });
    }
}

// API: listar todas las horas libres (para pacientes)
async function apiGetHorasLibres(req, res) {
    try {
        const horas = await prisma.horaMedica.findMany({
            where: { pacienteId: null },
            include: { hora: true, doctor: true }
        });
        return res.json({ horas });
    } catch (error) {
        console.error('apiGetHorasLibres error:', error);
        return res.status(500).json({ error: 'Error interno' });
    }
}

// API: paciente toma una hora (asignar pacienteId)
async function apiTakeHora(req, res) {
    try {
        const { pacienteId, horaMedicaId } = req.body;
        if (!pacienteId || !horaMedicaId) return res.status(400).json({ error: 'Faltan datos' });

        // Verificar que la hora esté libre
        const target = await prisma.horaMedica.findUnique({ where: { id: parseInt(horaMedicaId, 10) } });
        if (!target) return res.status(404).json({ error: 'Hora no encontrada' });
        if (target.pacienteId) return res.status(409).json({ error: 'Hora ya tomada' });

        const updated = await prisma.horaMedica.update({
            where: { id: parseInt(horaMedicaId, 10) },
            data: { pacienteId: parseInt(pacienteId, 10) },
            include: { hora: true, paciente: true, doctor: true }
        });

        return res.json({ success: true, hora: updated });
    } catch (error) {
        console.error('apiTakeHora error:', error);
        return res.status(500).json({ error: 'Error interno' });
    }
}

// Crear nueva hora disponible
async function crearHora(req, res) {
    const doctorId = getDoctorId(req);
    if (!doctorId) return res.status(401).send('No autenticado');
    try {
        const { start, end } = req.body;
        if (!start || !end) return res.status(400).send('Faltan datos');
        // Crear la hora
        const hora = await prisma.hora.create({
            data: {
                start: new Date(start),
                end: new Date(end)
            }
        });
        // Crear la relación HoraMedica
        await prisma.horaMedica.create({
            data: {
                horaId: hora.id,
                doctorId: doctorId
            }
        });
        res.redirect('/medico/panel?doctorId=' + doctorId);
    } catch (error) {
        console.error('Error al crear hora:', error);
        res.status(500).send('Error interno');
    }
}

module.exports = {
    medicoPanel,
    crearHora,
    apiGetHoras,
    apiGetHorasLibres,
    apiTakeHora
};


