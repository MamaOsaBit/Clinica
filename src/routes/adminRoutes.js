const { Router } = require ('express');
const { createHora, listHoraMedica} = require('../controllers/adminController');

const router = Router();

router.post('hora', createHora);
router.get('/horamedica', listHoraMedica);

module.exports = router;