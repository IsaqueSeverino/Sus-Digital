import express from 'express';
const router = express.Router();
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Listar todos os pacientes
 *     description: Retorna uma lista com todos os pacientes cadastrados. Requer perfil ADMIN ou MEDICO
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Buscar por nome do paciente (busca parcial)
 *         example: Maria
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: Buscar por CPF do paciente
 *         example: 123.456.789-00
 *       - in: query
 *         name: cartaoSus
 *         schema:
 *           type: string
 *         description: Buscar por número do Cartão SUS
 *         example: 123 4567 8901 2345
 *     responses:
 *       200:
 *         description: Lista de pacientes retornada com sucesso
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
 *                     example: Maria Santos
 *                   cpf:
 *                     type: string
 *                     example: 123.456.789-00
 *                   cartaoSus:
 *                     type: string
 *                     nullable: true
 *                     example: 123 4567 8901 2345
 *                   telefone:
 *                     type: string
 *                     nullable: true
 *                     example: (11) 91234-5678
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil ADMIN ou MEDICO
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

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obter paciente específico
 *     description: Retorna os dados completos de um paciente específico pelo seu ID. Requer perfil ADMIN ou MEDICO
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do paciente
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do paciente retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil ADMIN ou MEDICO
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Paciente não encontrado
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
router.get('/:id', AuthMiddleware.authorize('ADMIN', 'MEDICO'), async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { email: true, ativo: true }
        }
      }
    });

    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Erro ao obter paciente:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;