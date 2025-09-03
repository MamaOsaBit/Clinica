const { createHora, listHoraMedica } = require('../services/adminService');

const createHora = async (req, res) => {
    if(req.user.role !== 'ADMIN') {
        return res.redirect('https://http.cat/images/403.jpg');
    }

    const { start, end } = req.body;

    try { 
        const newHora = await createHora(start, end);
        res.status(201).json(newHora);

    } catch (error){
        return res.redirect('https://http.cat/images/500.jpg');
    }
}

const listHoraMedica = async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.redirect('https://http.cat/images/403.jpg');
    }
    
    try {
        const horamedica =  await listHoraMedica();
        res.json(horamedica);
    } catch (error) {
        return res.redirect('https://http.cat/images/500.jpg');
    }
}

module.exports = {
    createHora,
    listHoraMedica
};