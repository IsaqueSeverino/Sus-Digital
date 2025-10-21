const { PrismaClient } = require('@prisma/client');
const JWTUtils = require('../utils/jwt');

const prisma = new PrismaClient();
class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          erro: 'Token não fornecido ou formato inválido',
          message: 'Use: Authorization: Bearer <token>'
        });
      }

      const token = authHeader.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ erro: 'Token não encontrado' });
      }

      const decoded = JWTUtils.verifyToken(token);
      
      const usuario = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        include: {
          medico: true,
          paciente: true
        }
      });

      if (!usuario || !usuario.ativo) {
        return res.status(401).json({ erro: 'Token inválido ou usuário inativo' });
      }

      req.user = usuario;
      req.userId = usuario.id;
      req.userType = usuario.tipo;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ erro: 'Token expirado' });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ erro: 'Token inválido' });
      }

      console.error('Erro na autenticação:', error);
      return res.status(500).json({ erro: 'Erro interno de autenticação' });
    }
  }

  static authorize(...allowedTypes) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ erro: 'Usuário não autenticado' });
      }

      if (!allowedTypes.includes(req.user.tipo)) {
        return res.status(403).json({ 
          erro: 'Acesso negado',
          message: `Permissão necessária: ${allowedTypes.join(' ou ')}`,
          userType: req.user.tipo
        });
      }
      
      next();
    };
  }

  static authorizeOwnerOrAdmin(req, res, next) {
    const targetUserId = req.params.id || req.params.userId;
    
    if (req.user.tipo === 'ADMIN' || req.user.id === targetUserId) {
      return next();
    }

    return res.status(403).json({ 
      erro: 'Acesso negado',
      message: 'Você só pode acessar seus próprios dados'
    });
  }
}

module.exports = AuthMiddleware;
