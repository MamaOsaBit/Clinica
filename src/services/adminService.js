const { PrismaClient } = require('../../generated/prisma') // Ajusta la ruta si es necesario
const prisma = new PrismaClient();

const createHora = async (start, end) => {
    const newHoraMedica = await prisma.horaMedica.create({
        data: {
            start: new Date(start),
            end: new Date(end)
        }
    });
    return newHoraMedica;
};

const listHoraMedica = async () => {
    const horasMedicas = await prisma.horaMedica.findMany({
        include:{
            paciente: true,
            medico: true,
            horaMedica: true
        }
    });
    return horasMedicas;
};

module.exports = {
    createHora,
    listHoraMedica
};