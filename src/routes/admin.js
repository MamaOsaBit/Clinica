const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// List all HoraMedica (admin only)
router.get('/admin/horas', adminController.listHoraMedica);

// Create a new Hora (admin only)
router.post('/admin/horas', adminController.createHora);

// add other admin routes as needed

module.exports = router;
