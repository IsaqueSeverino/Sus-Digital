import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import JWTUtils from '../utils/jwt.js';

const prisma = new PrismaClient();

interface UsuarioModel {
  id: string;
  email: string;
  senha: string;
  tipo: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface AuthenticatedRequest extends Request {
  user?: UsuarioModel;
  userId?: string;
  userType?: string;
}

class AuthMiddleware {
  static async authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          erro: 'Token não fornecido ou formato inválido',
          message: 'Use: Authorization: Bearer <token>'
        });
        return;
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        res.status(401).json({ erro: 'Token não encontrado' });
        return;
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
        res.status(401).json({ erro: 'Token inválido ou usuário inativo' });
        return;
      }

      req.user = usuario;
      req.userId = usuario.id;
      req.userType = usuario.tipo;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ erro: 'Token expirado' });
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ erro: 'Token inválido' });
        return;
      }
      console.error('Erro na autenticação:', error);
      res.status(500).json({ erro: 'Erro interno de autenticação' });
    }
  }

  static authorize(...allowedTypes: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({ erro: 'Usuário não autenticado' });
        return;
      }
      if (!allowedTypes.includes(req.user.tipo)) {
        res.status(403).json({
          erro: 'Acesso negado',
          message: `Permissão necessária: ${allowedTypes.join(' ou ')}`,
          userType: req.user.tipo
        });
        return;
      }
      next();
    };
  }

  static authorizeOwnerOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const targetUserId = req.params.id || req.params.userId;
    if (req.user?.tipo === 'ADMIN' || req.user?.id === targetUserId) {
      next();
      return;
    }
    res.status(403).json({
      erro: 'Acesso negado',
      message: 'Você só pode acessar seus próprios dados'
    });
  }
}

export default AuthMiddleware;
