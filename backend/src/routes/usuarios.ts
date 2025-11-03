import express from 'express';
const router = express.Router();
import UsuarioController from '../controllers/usuarioController.js';
import AuthMiddleware from '../middlewares/auth.js';

router.use(AuthMiddleware.authenticate);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos os usuários
 *     description: Retorna uma lista com todos os usuários cadastrados no sistema. Requer perfil ADMIN
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ADMIN, MEDICO, PACIENTE]
 *         description: Filtrar por tipo de usuário
 *       - in: query
 *         name: ativo
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo/inativo
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
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
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Acesso negado. Você não tem permissão para acessar este recurso
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.listarUsuarios
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obter usuário por ID
 *     description: Retorna os dados de um usuário específico pelo seu ID. Requer perfil ADMIN
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
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
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.obterUsuario
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualizar dados do usuário
 *     description: Atualiza as informações de um usuário específico. Requer perfil ADMIN
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário
 *         example: clxyz1234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario.atualizado@exemplo.com
 *               tipo:
 *                 type: string
 *                 enum: [ADMIN, MEDICO, PACIENTE]
 *                 example: MEDICO
 *               ativo:
 *                 type: boolean
 *                 example: true
 *           examples:
 *             ativarUsuario:
 *               summary: Ativar usuário
 *               value:
 *                 ativo: true
 *             alterarEmail:
 *               summary: Alterar email
 *               value:
 *                 email: novo.email@exemplo.com
 *             alterarTipo:
 *               summary: Alterar tipo de usuário
 *               value:
 *                 tipo: ADMIN
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário atualizado com sucesso
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
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
 *         description: Acesso negado - requer perfil ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já está em uso por outro usuário
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
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.atualizarUsuario
);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     description: Remove permanentemente um usuário do sistema. Requer perfil ADMIN
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único do usuário a ser deletado
 *         example: clxyz1234567890
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário deletado com sucesso
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
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.deletarUsuario
);

export default router;