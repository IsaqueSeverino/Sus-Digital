const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middlewares/auth');

// Rotas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rotas protegidas
router.get('/me', AuthMiddleware.authenticate, AuthController.me);
router.post('/change-password', AuthMiddleware.authenticate, AuthController.changePassword);

module.exports = router;
