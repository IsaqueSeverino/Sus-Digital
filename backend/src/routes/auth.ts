import express from 'express';
const router = express.Router();
import AuthController from '../controllers/authController.js';
import AuthMiddleware from '../middlewares/auth.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastrar novo usuário no sistema
 *     description: Cria um novo usuário com email, senha e tipo de perfil (ADMIN, MEDICO ou PACIENTE)
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             medico:
 *               summary: Cadastrar médico
 *               value:
 *                 email: medico@exemplo.com
 *                 senha: senha123
 *                 tipo: MEDICO
 *             paciente:
 *               summary: Cadastrar paciente
 *               value:
 *                 email: paciente@exemplo.com
 *                 senha: senha456
 *                 tipo: PACIENTE
 *             admin:
 *               summary: Cadastrar administrador
 *               value:
 *                 email: admin@exemplo.com
 *                 senha: senha789
 *                 tipo: ADMIN
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário cadastrado com sucesso
 *                 usuario:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos ou incompletos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já cadastrado no sistema
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
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login e obter token JWT
 *     description: Autentica o usuário com email e senha, retornando um token JWT para uso nas requisições protegidas
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas (email ou senha incorretos)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Email ou senha inválidos
 *       403:
 *         description: Usuário inativo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Usuário inativo. Contate o administrador
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     description: Retorna as informações completas do usuário atualmente logado, baseado no token JWT
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: Token inválido, expirado ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Token inválido ou expirado
 *       404:
 *         description: Usuário não encontrado
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
router.get('/me', AuthMiddleware.authenticate, AuthController.me);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Alterar senha do usuário
 *     description: Permite que o usuário autenticado altere sua senha fornecendo a senha atual e a nova senha
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senhaAtual
 *               - novaSenha
 *             properties:
 *               senhaAtual:
 *                 type: string
 *                 format: password
 *                 description: Senha atual do usuário
 *                 example: senha123
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Nova senha desejada (mínimo 6 caracteres)
 *                 example: novaSenha456
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos (senha muito curta ou campos faltando)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Senha atual incorreta ou token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Senha atual incorreta
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/change-password', AuthMiddleware.authenticate, AuthController.changePassword);

export default router;