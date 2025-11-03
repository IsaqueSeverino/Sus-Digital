import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import BcryptUtils from '../utils/bcrypt.js';
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
  medico?: MedicoModel;
  paciente?: PacienteModel;
}
interface MedicoModel {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone?: string;
  usuarioId: string;
}
interface PacienteModel {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: Date;
  telefone?: string;
  endereco?: string;
  cartaoSus?: string;
  usuarioId: string;
}

interface AuthenticatedRequest extends Request {
  user?: UsuarioModel;
}

class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha, tipo, nome, cpf, crm, especialidade, telefone, endereco, dataNascimento, cartaoSus } = req.body;
      if (!email || !senha || !tipo || !nome) {
        res.status(400).json({
          erro: 'Dados obrigatórios não fornecidos',
          required: ['email', 'senha', 'tipo', 'nome']
        });
        return;
      }
      if (!['PACIENTE', 'MEDICO', 'ADMIN'].includes(tipo)) {
        res.status(400).json({
          erro: 'Tipo de usuário inválido',
          allowed: ['PACIENTE', 'MEDICO', 'ADMIN']
        });
        return;
      }
      const existingUser = await prisma.usuario.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ erro: 'Email já está em uso' });
        return;
      }
      const hashedPassword = await BcryptUtils.hashPassword(senha);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const usuario = await tx.usuario.create({
          data: {
            email,
            senha: hashedPassword,
            tipo
          }
        });
        let perfil = null;
        if (tipo === 'PACIENTE') {
          if (!cpf) throw new Error('CPF é obrigatório para pacientes');
          perfil = await tx.paciente.create({
            data: {
              nome,
              cpf,
              dataNascimento: dataNascimento ? new Date(dataNascimento) : new Date('1990-01-01'),
              telefone,
              endereco,
              cartaoSus,
              usuarioId: usuario.id
            }
          });
        } else if (tipo === 'MEDICO') {
          if (!crm || !especialidade) throw new Error('CRM e especialidade são obrigatórios para médicos');
          perfil = await tx.medico.create({
            data: {
              nome,
              crm,
              especialidade,
              telefone,
              usuarioId: usuario.id
            }
          });
        }
        return { usuario, perfil };
      });
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        usuario: {
          id: result.usuario.id,
          email: result.usuario.email,
          tipo: result.usuario.tipo
        },
        perfil: result.perfil
      });
    } catch (error: any) {
      console.error('Erro no register:', error);
      if (error.message && error.message.includes('obrigatório')) {
        res.status(400).json({ erro: error.message });
        return;
      }
      res.status(500).json({ erro: 'Erro interno do servidor', details: error.message });
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        return;
      }
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: { medico: true, paciente: true }
      });
      if (!usuario) {
        res.status(401).json({ erro: 'Credenciais inválidas' });
        return;
      }
      if (!usuario.ativo) {
        res.status(401).json({ erro: 'Usuário desativado' });
        return;
      }
      const senhaValida = await BcryptUtils.comparePassword(senha, usuario.senha);
      if (!senhaValida) {
        res.status(401).json({ erro: 'Credenciais inválidas' });
        return;
      }
      const token = JWTUtils.generateToken({
        userId: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo
      });
      const perfil = usuario.medico || usuario.paciente || null;
      res.json({
        message: 'Login realizado com sucesso',
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          tipo: usuario.tipo,
          perfil
        },
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ erro: 'Usuário não autenticado' });
        return;
      }
      res.json({
        usuario: {
          id: req.user.id,
          email: req.user.email,
          tipo: req.user.tipo,
          ativo: req.user.ativo,
          createdAt: req.user.createdAt,
          perfil: req.user.medico || req.user.paciente || null
        }
      });
    } catch (error) {
      console.error('Erro no me:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { senhaAtual, novaSenha } = req.body;
      if (!senhaAtual || !novaSenha) {
        res.status(400).json({ erro: 'Senha atual e nova senha são obrigatórias' });
        return;
      }
      if (novaSenha.length < 6) {
        res.status(400).json({ erro: 'Nova senha deve ter pelo menos 6 caracteres' });
        return;
      }
      if (!req.user) {
        res.status(401).json({ erro: 'Usuário não autenticado' });
        return;
      }
      const senhaValida = await BcryptUtils.comparePassword(senhaAtual, req.user.senha);
      if (!senhaValida) {
        res.status(400).json({ erro: 'Senha atual incorreta' });
        return;
      }
      const novaSenhaHash = await BcryptUtils.hashPassword(novaSenha);
      await prisma.usuario.update({
        where: { id: req.user.id },
        data: { senha: novaSenhaHash }
      });
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

export default AuthController;
