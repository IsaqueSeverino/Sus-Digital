
import express from 'express';
const router = express.Router();
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/prontuarios:
 *   get:
 *     summary: Listar prontuários
 *     description: Retorna uma lista de prontuários médicos. Em desenvolvimento - funcionalidade básica disponível
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do paciente
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Rota em desenvolvimento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rotas de prontuários - em desenvolvimento
 *                 availableRoutes:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ['GET /', 'POST /', 'GET /:id', 'PUT /:id']
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', (req, res) => {
  res.json({ 
    message: 'Rotas de prontuários - em desenvolvimento',
    availableRoutes: ['GET /', 'POST /', 'GET /:id', 'PUT /:id', 'DELETE /:id']
  });
});

/**
 * @swagger
 * /api/prontuarios/{id}:
 *   get:
 *     summary: Obter prontuário específico
 *     description: Retorna os dados de um prontuário específico. Em desenvolvimento
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do prontuário
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do prontuário (em desenvolvimento)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prontuario'
 *       404:
 *         description: Prontuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => {
  res.status(501).json({
    message: 'Endpoint em desenvolvimento',
    id: req.params.id
  });
});

/**
 * @swagger
 * /api/prontuarios:
 *   post:
 *     summary: Criar novo prontuário
 *     description: Cria um novo prontuário médico. Em desenvolvimento - requer perfil MEDICO ou ADMIN
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pacienteId
 *               - diagnostico
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 example: clxyz1234567890
 *               diagnostico:
 *                 type: string
 *                 example: Hipertensão arterial sistêmica
 *               sintomas:
 *                 type: string
 *                 example: Dores de cabeça, tontura
 *               tratamento:
 *                 type: string
 *                 example: Medicação anti-hipertensiva
 *               observacoes:
 *                 type: string
 *                 example: Paciente apresenta melhora
 *     responses:
 *       201:
 *         description: Prontuário criado (em desenvolvimento)
 *       501:
 *         description: Endpoint em desenvolvimento
 */
router.post('/', (req, res) => {
  res.status(501).json({
    message: 'Endpoint em desenvolvimento'
  });
});

/**
 * @swagger
 * /api/prontuarios/{id}:
 *   put:
 *     summary: Atualizar prontuário
 *     description: Atualiza um prontuário existente. Em desenvolvimento
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do prontuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnostico:
 *                 type: string
 *               sintomas:
 *                 type: string
 *               tratamento:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prontuário atualizado
 *       501:
 *         description: Endpoint em desenvolvimento
 */
router.put('/:id', (req, res) => {
  res.status(501).json({
    message: 'Endpoint em desenvolvimento',
    id: req.params.id
  });
});

/**
 * @swagger
 * /api/prontuarios/{id}:
 *   delete:
 *     summary: Deletar prontuário
 *     description: Remove um prontuário. Em desenvolvimento - requer perfil ADMIN
 *     tags: [Prontuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do prontuário
 *     responses:
 *       200:
 *         description: Prontuário deletado
 *       501:
 *         description: Endpoint em desenvolvimento
 */
router.delete('/:id', (req, res) => {
  res.status(501).json({
    message: 'Endpoint em desenvolvimento',
    id: req.params.id
  });
});

export default router;