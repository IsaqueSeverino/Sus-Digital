const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');
const AuthMiddleware = require('../middlewares/auth');

// Todas as rotas precisam de autenticação
router.use(AuthMiddleware.authenticate);

// Apenas admins podem acessar essas rotas
router.get('/', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.listarUsuarios
);

router.get('/:id', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.obterUsuario
);

router.put('/:id', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.atualizarUsuario
);

router.delete('/:id', 
  AuthMiddleware.authorize('ADMIN'), 
  UsuarioController.deletarUsuario
);

module.exports = router;
