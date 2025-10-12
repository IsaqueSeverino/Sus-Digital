const { PrismaClient } = require('@prisma/client');
const  BcryptUtils  = require('../utils/bcrypt');
const JWTUtils = require('../utils/jwt');

const prisma = new PrismaClient();

class AuthController {
  static async register(req, res) {
    try {
      const { email, senha, tipo, nome, cpf, crm, especialidade, telefone, endereco, dataNascimento, cartaoSus } = req.body;

      // Validações básicas
      if (!email || !senha || !tipo || !nome) {
        return res.status(400).json({
          erro: 'Dados obrigatórios não fornecidos',
          required: ['email', 'senha', 'tipo', 'nome']
        });
      }

      if (!['PACIENTE', 'MEDICO', 'ADMIN'].includes(tipo)) {
        return res.status(400).json({
          erro: 'Tipo de usuário inválido',
          allowed: ['PACIENTE', 'MEDICO', 'ADMIN']
        });
      }

      // Verificar se usuário já existe
      const existingUser = await prisma.usuario.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ erro: 'Email já está em uso' });
      }

      // Hash da senha
      const hashedPassword = await BcryptUtils.hashPassword(senha);

      // Criar usuário em transação
      const result = await prisma.$transaction(async (tx) => {
        // Criar usuário
        const usuario = await tx.usuario.create({
          data: {
            email,
            senha: hashedPassword,
            tipo
          }
        });

        // Criar perfil baseado no tipo
        let perfil = null;

        if (tipo === 'PACIENTE') {
          if (!cpf) {
            throw new Error('CPF é obrigatório para pacientes');
          }

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
          if (!crm || !especialidade) {
            throw new Error('CRM e especialidade são obrigatórios para médicos');
          }

          perfil = await tx.medico.create({
            data: {
              nome,
              crm,
              especialidade,
              telefone,
              endereco,
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
    } catch (error) {
      console.error('Erro no register:', error);

      if (error.message.includes('obrigatório')) {
        return res.status(400).json({ erro: error.message });
      }

      res.status(500).json({ erro: 'Erro interno do servidor', details: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: 'Email e senha são obrigatórios'
        });
      }

      // Buscar usuário com perfil
      const usuario = await prisma.usuario.findUnique({
        where: { email },
        include: {
          medico: true,
          paciente: true
        }
      });

      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      if (!usuario.ativo) {
        return res.status(401).json({ erro: 'Usuário desativado' });
      }

      // Verificar senha
      const senhaValida = await BcryptUtils.comparePassword(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Gerar JWT
      const token = JWTUtils.generateToken({
        userId: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo
      });

      // Dados do perfil
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

  static async me(req, res) {
    try {
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

  static async changePassword(req, res) {
    try {
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          erro: 'Senha atual e nova senha são obrigatórias'
        });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({
          erro: 'Nova senha deve ter pelo menos 6 caracteres'
        });
      }

      // Verificar senha atual
      const senhaValida = await BcryptUtils.comparePassword(senhaAtual, req.user.senha);

      if (!senhaValida) {
        return res.status(400).json({ erro: 'Senha atual incorreta' });
      }

      // Hash da nova senha
      const novaSenhaHash = await BcryptUtils.hashPassword(novaSenha);

      // Atualizar senha
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

module.exports = AuthController;
