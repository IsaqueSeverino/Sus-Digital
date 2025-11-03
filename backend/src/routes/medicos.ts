import express from 'express';
const router = express.Router();
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/medicos:
 *   get:
 *     summary: Listar todos os médicos
 *     description: Retorna uma lista com todos os médicos cadastrados no sistema. Disponível para todos os usuários autenticados
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: especialidade
 *         schema:
 *           type: string
 *         description: Filtrar por especialidade médica
 *         example: Cardiologia
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Buscar por nome do médico (busca parcial)
 *         example: Silva
 *     responses:
 *       200:
 *         description: Lista de médicos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: clxyz1234567890
 *                   nome:
 *                     type: string
 *                     example: Dr. João Silva
 *                   crm:
 *                     type: string
 *                     example: CRM/SP 123456
 *                   especialidade:
 *                     type: string
 *                     example: Cardiologia
 *                   telefone:
 *                     type: string
 *                     nullable: true
 *                     example: (11) 98765-4321
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/medicos/{id}:
 *   get:
 *     summary: Obter médico específico
 *     description: Retorna os dados completos de um médico específico pelo seu ID. Disponível para todos os usuários autenticados
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do médico
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do médico retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Medico'
 *                 - type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: medico@exemplo.com
 *                         ativo:
 *                           type: boolean
 *                           example: true
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Médico não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Médico não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

export default router;