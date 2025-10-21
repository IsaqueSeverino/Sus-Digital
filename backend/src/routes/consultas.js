const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

/**
 * @swagger
 * /api/consultas:
 *   post:
 *     summary: Criar nova consulta
 *     description: Agenda uma nova consulta entre um paciente e um médico. Requer perfil MEDICO ou ADMIN
 *     tags: [Consultas]
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
 *               - medicoId
 *               - dataHora
 *               - motivo
 *             properties:
 *               pacienteId:
 *                 type: string
 *                 description: ID do paciente
 *                 example: clxyz1234567890
 *               medicoId:
 *                 type: string
 *                 description: ID do médico
 *                 example: clxyz0987654321
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora da consulta
 *                 example: 2025-10-25T14:30:00.000Z
 *               motivo:
 *                 type: string
 *                 description: Motivo da consulta
 *                 example: Consulta de rotina
 *               observacoes:
 *                 type: string
 *                 description: Observações adicionais
 *                 example: Paciente relata dores de cabeça frequentes
 *     responses:
 *       201:
 *         description: Consulta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consulta criada com sucesso
 *                 consulta:
 *                   $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Dados inválidos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil MEDICO ou ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Paciente ou médico não encontrado
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
router.post('/', 
  authorize('MEDICO', 'ADMIN'), 
  consultaController.criarConsulta
);

/**
 * @swagger
 * /api/consultas:
 *   get:
 *     summary: Listar consultas
 *     description: Retorna lista de consultas com filtros opcionais. Usuários veem apenas suas próprias consultas, exceto ADMIN
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pacienteId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do paciente
 *         example: clxyz1234567890
 *       - in: query
 *         name: medicoId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do médico
 *         example: clxyz0987654321
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AGENDADA, CONFIRMADA, REALIZADA, CANCELADA]
 *         description: Filtrar por status da consulta
 *         example: AGENDADA
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar consultas a partir desta data
 *         example: 2025-10-01
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar consultas até esta data
 *         example: 2025-10-31
 *     responses:
 *       200:
 *         description: Lista de consultas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consulta'
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
router.get('/', consultaController.listarConsultas);

/**
 * @swagger
 * /api/consultas/{id}:
 *   get:
 *     summary: Obter consulta específica
 *     description: Retorna os detalhes completos de uma consulta específica pelo ID
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da consulta
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados da consulta retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consulta'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - você não tem permissão para ver esta consulta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consulta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Consulta não encontrada
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', consultaController.obterConsulta);

/**
 * @swagger
 * /api/consultas/{id}:
 *   put:
 *     summary: Atualizar consulta
 *     description: Atualiza os dados de uma consulta existente. Requer perfil MEDICO ou ADMIN
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da consulta
 *         example: clxyz1234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data e hora da consulta
 *                 example: 2025-10-26T15:00:00.000Z
 *               motivo:
 *                 type: string
 *                 description: Novo motivo da consulta
 *                 example: Consulta de acompanhamento
 *               status:
 *                 type: string
 *                 enum: [AGENDADA, CONFIRMADA, REALIZADA, CANCELADA]
 *                 description: Novo status da consulta
 *                 example: CONFIRMADA
 *               observacoes:
 *                 type: string
 *                 description: Novas observações
 *                 example: Paciente confirma presença
 *           examples:
 *             confirmar:
 *               summary: Confirmar consulta
 *               value:
 *                 status: CONFIRMADA
 *             remarcar:
 *               summary: Remarcar consulta
 *               value:
 *                 dataHora: 2025-10-27T10:00:00.000Z
 *                 observacoes: Consulta remarcada a pedido do paciente
 *             cancelar:
 *               summary: Cancelar consulta
 *               value:
 *                 status: CANCELADA
 *                 observacoes: Paciente não pode comparecer
 *     responses:
 *       200:
 *         description: Consulta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consulta atualizada com sucesso
 *                 consulta:
 *                   $ref: '#/components/schemas/Consulta'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil MEDICO ou ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consulta não encontrada
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
router.put('/:id', 
  authorize('MEDICO', 'ADMIN'), 
  consultaController.atualizarConsulta
);

/**
 * @swagger
 * /api/consultas/{id}:
 *   delete:
 *     summary: Deletar consulta
 *     description: Remove permanentemente uma consulta do sistema. Requer perfil ADMIN
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único da consulta a ser deletada
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Consulta deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Consulta deletada com sucesso
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado - requer perfil ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Consulta não encontrada
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
router.delete('/:id', 
  authorize('ADMIN'), 
  consultaController.deletarConsulta
);

module.exports = router;