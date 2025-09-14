const express = require('express');
const medicoController = require('../controllers/medicoController');
const router = express.Router();

router.get('/medico/panel', medicoController.medicoPanel);
router.post('/medico/crear-hora', medicoController.crearHora);
// API endpoint to fetch horas for a doctor
router.get('/api/medico/horas', medicoController.apiGetHoras);
// API: listar horas libres para pacientes
router.get('/api/horas/libres', medicoController.apiGetHorasLibres);
// API: paciente toma una hora
router.post('/api/paciente/tomar-hora', medicoController.apiTakeHora);

module.exports = router;
