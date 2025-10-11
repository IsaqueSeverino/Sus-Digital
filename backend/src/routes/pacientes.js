const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middlewares/auth');

router.use(AuthMiddleware.authenticate);

// Apenas admins e médicos podem listar pacientes
router.get('/', AuthMiddleware.authorize('ADMIN', 'MEDICO'), async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const pacientes = await prisma.paciente.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        cartaoSus: true,
        telefone: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
