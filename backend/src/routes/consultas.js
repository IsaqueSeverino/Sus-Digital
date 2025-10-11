const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const { authenticate, authorize } = require('../middlewares/auth');

// Todas as rotas precisam de autenticação
router.use(authenticate);

// Criar consulta (médicos e admins)
router.post('/', 
  authorize('MEDICO', 'ADMIN'), 
  consultaController.criarConsulta
);

// Listar consultas
router.get('/', consultaController.listarConsultas);

// Obter consulta específica
router.get('/:id', consultaController.obterConsulta);

// Atualizar consulta (médicos e admins)
router.put('/:id', 
  authorize('MEDICO', 'ADMIN'), 
  consultaController.atualizarConsulta
);

// Deletar consulta (apenas admins)
router.delete('/:id', 
  authorize('ADMIN'), 
  consultaController.deletarConsulta
);

module.exports = router;
