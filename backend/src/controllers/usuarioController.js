const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class UsuarioController {
  static async listarUsuarios(req, res) {
    try {
      const { page = 1, limit = 10, tipo, ativo } = req.query;

      const where = {};
      if (tipo) where.tipo = tipo;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const skip = (page - 1) * parseInt(limit);
      const take = parseInt(limit);

      const [usuarios, total] = await Promise.all([
        prisma.usuario.findMany({
          where,
          select: {
            id: true,
            email: true,
            tipo: true,
            ativo: true,
            createdAt: true,
            medico: {
              select: { nome: true, especialidade: true, crm: true }
            },
            paciente: {
              select: { nome: true, cpf: true, cartaoSus: true }
            }
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.usuario.count({ where })
      ]);

      res.json({
        usuarios,
        pagination: {
          total,
          pages: Math.ceil(total / take),
          currentPage: parseInt(page),
          perPage: take
        }
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async obterUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          tipo: true,
          ativo: true,
          createdAt: true,
          updatedAt: true,
          medico: true,
          paciente: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async atualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      const updateData = {};
      if (ativo !== undefined) updateData.ativo = ativo;

      const usuario = await prisma.usuario.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          tipo: true,
          ativo: true,
          updatedAt: true
        }
      });

      res.json({
        message: 'Usuário atualizado com sucesso',
        usuario
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async deletarUsuario(req, res) {
    try {
      const { id } = req.params;

      // Não permitir deletar próprio usuário
      if (id === req.user.id) {
        return res.status(400).json({ erro: 'Você não pode deletar sua própria conta' });
      }

      await prisma.usuario.delete({
        where: { id }
      });

      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = UsuarioController;
