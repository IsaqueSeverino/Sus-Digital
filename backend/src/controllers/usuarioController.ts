import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: { id: string }; 
}

class UsuarioController {
  static async listarUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10', tipo, ativo } = req.query as {
        page?: string;
        limit?: string;
        tipo?: string;
        ativo?: string;
      };
      const where: any = {};
      if (tipo) where.tipo = tipo;
      if (ativo !== undefined) where.ativo = ativo === 'true';
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;
      const take = limitNum;
      const [usuarios, total] = await Promise.all([
        prisma.usuario.findMany({
          where,
          select: {
            id: true,
            email: true,
            tipo: true,
            ativo: true,
            createdAt: true,
            medico: { select: { nome: true, especialidade: true, crm: true } },
            paciente: { select: { nome: true, cpf: true, cartaoSus: true } },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.usuario.count({ where }),
      ]);
      res.json({
        usuarios,
        pagination: {
          total,
          pages: Math.ceil(total / take),
          currentPage: pageNum,
          perPage: take,
        },
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async obterUsuario(req: Request, res: Response): Promise<void> {
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
          paciente: true,
        },
      });
      if (!usuario) {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
      }
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async atualizarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { ativo } = req.body as { ativo?: boolean };
      const updateData: any = {};
      if (ativo !== undefined) updateData.ativo = ativo;
      const usuario = await prisma.usuario.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          tipo: true,
          ativo: true,
          updatedAt: true,
        },
      });
      res.json({
        message: 'Usuário atualizado com sucesso',
        usuario,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
      }
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async deletarUsuario(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (id === req.user?.id) {
        res.status(400).json({ erro: 'Você não pode deletar sua própria conta' });
        return;
      }
      await prisma.usuario.delete({ where: { id } });
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ erro: 'Usuário não encontrado' });
        return;
      }
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

export default UsuarioController;
