const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middlewares/auth');

// Middleware de autenticação
router.use(AuthMiddleware.authenticate);

// Listar médicos (todos podem ver)
router.get('/', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const medicos = await prisma.medico.findMany({
      select: {
        id: true,
        nome: true,
        crm: true,
        especialidade: true,
        telefone: true
      },
      orderBy: { nome: 'asc' }
    });

    res.json(medicos);
  } catch (error) {
    console.error('Erro ao listar médicos:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Obter médico específico
router.get('/:id', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const { id } = req.params;

    const medico = await prisma.medico.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { email: true, ativo: true }
        }
      }
    });

    if (!medico) {
      return res.status(404).json({ erro: 'Médico não encontrado' });
    }

    res.json(medico);
  } catch (error) {
    console.error('Erro ao obter médico:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
