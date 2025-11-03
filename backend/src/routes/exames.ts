import express from 'express';
const router = express.Router();
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/exames:
 *   get:
 *     summary: Listar exames
 *     description: Retorna uma lista de exames médicos. Em desenvolvimento - funcionalidade básica disponível
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: consultaId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da consulta
 *         example: clxyz1234567890
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [LABORATORIAL, IMAGEM, CARDIOLOGICO, NEUROLOGICO]
 *         description: Filtrar por tipo de exame
 *         example: LABORATORIAL
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
 *                   example: Rotas de exames - em desenvolvimento
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
    message: 'Rotas de exames - em desenvolvimento',
    availableRoutes: ['GET /', 'POST /', 'GET /:id', 'PUT /:id', 'DELETE /:id']
  });
});

/**
 * @swagger
 * /api/exames/{id}:
 *   get:
 *     summary: Obter exame específico
 *     description: Retorna os dados de um exame específico. Em desenvolvimento
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do exame
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do exame (em desenvolvimento)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exame'
 *       404:
 *         description: Exame não encontrado
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
 * /api/exames:
 *   post:
 *     summary: Criar novo exame
 *     description: Registra um novo exame médico. Em desenvolvimento - requer perfil MEDICO ou ADMIN
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultaId
 *               - tipo
 *               - nome
 *               - dataExame
 *             properties:
 *               consultaId:
 *                 type: string
 *                 example: clxyz1234567890
 *               tipo:
 *                 type: string
 *                 enum: [LABORATORIAL, IMAGEM, CARDIOLOGICO, NEUROLOGICO]
 *                 example: LABORATORIAL
 *               nome:
 *                 type: string
 *                 example: Hemograma Completo
 *               dataExame:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-20T09:00:00.000Z
 *               resultado:
 *                 type: string
 *                 example: Valores dentro da normalidade
 *               observacoes:
 *                 type: string
 *                 example: Exame realizado em jejum
 *     responses:
 *       201:
 *         description: Exame criado (em desenvolvimento)
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
 * /api/exames/{id}:
 *   put:
 *     summary: Atualizar exame
 *     description: Atualiza os dados de um exame existente. Em desenvolvimento
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exame
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resultado:
 *                 type: string
 *                 example: Atualização dos resultados
 *               observacoes:
 *                 type: string
 *                 example: Observações adicionais
 *     responses:
 *       200:
 *         description: Exame atualizado
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
 * /api/exames/{id}:
 *   delete:
 *     summary: Deletar exame
 *     description: Remove um exame. Em desenvolvimento - requer perfil ADMIN
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do exame
 *     responses:
 *       200:
 *         description: Exame deletado
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