import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: any;
}

class ConsultaController {
  static async criarConsulta(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dataHora, motivo, medicoId, pacienteId, observacoes } = req.body;
      if (!dataHora || !motivo || !medicoId || !pacienteId) {
        res.status(400).json({
          erro: 'Dados obrigatórios não fornecidos',
          required: ['dataHora', 'motivo', 'medicoId', 'pacienteId']
        });
        return;
      }
      const medico = await prisma.medico.findUnique({ where: { id: medicoId } });
      const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
      if (!medico) {
        res.status(404).json({ erro: 'Médico não encontrado' });
        return;
      }
      if (!paciente) {
        res.status(404).json({ erro: 'Paciente não encontrado' });
        return;
      }
      const dataConsulta = new Date(dataHora);
      if (dataConsulta < new Date()) {
        res.status(400).json({ erro: 'Data da consulta não pode ser no passado' });
        return;
      }
      const consulta = await prisma.consulta.create({
        data: { dataHora: dataConsulta, motivo, observacoes, medicoId, pacienteId },
        include: {
          medico: { select: { nome: true, especialidade: true, crm: true } },
          paciente: { select: { nome: true, cpf: true, cartaoSus: true } }
        }
      });
      res.status(201).json({
        message: 'Consulta criada com sucesso',
        consulta
      });
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async listarConsultas(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = '1', limit = '10', status, medicoId, pacienteId, dataInicio, dataFim } = req.query as Record<string, string>;
      const where: any = {};
      if (status) where.status = status;
      if (medicoId) where.medicoId = medicoId;
      if (pacienteId) where.pacienteId = pacienteId;
      if (dataInicio || dataFim) {
        where.dataHora = {};
        if (dataInicio) where.dataHora.gte = new Date(dataInicio);
        if (dataFim) where.dataHora.lte = new Date(dataFim);
      }
      if (req.user?.tipo === 'MEDICO' && req.user.medico) {
        where.medicoId = req.user.medico.id;
      } else if (req.user?.tipo === 'PACIENTE' && req.user.paciente) {
        where.pacienteId = req.user.paciente.id;
      }
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;
      const take = limitNum;
      const [consultas, total] = await Promise.all([
        prisma.consulta.findMany({
          where,
          include: {
            medico: { select: { nome: true, especialidade: true, crm: true } },
            paciente: { select: { nome: true, cpf: true, cartaoSus: true } },
            exames: { select: { id: true, nome: true, tipo: true, dataExame: true } }
          },
          orderBy: { dataHora: 'asc' },
          skip,
          take
        }),
        prisma.consulta.count({ where })
      ]);
      res.json({
        consultas,
        pagination: {
          total,
          pages: Math.ceil(total / take),
          currentPage: pageNum,
          perPage: take,
          hasNext: skip + take < total,
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('Erro ao listar consultas:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async obterConsulta(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const consulta = await prisma.consulta.findUnique({
        where: { id },
        include: {
          medico: { select: { nome: true, especialidade: true, crm: true, telefone: true } },
          paciente: { select: { nome: true, cpf: true, cartaoSus: true, telefone: true, endereco: true } },
          exames: true
        }
      });
      if (!consulta) {
        res.status(404).json({ erro: 'Consulta não encontrada' });
        return;
      }
      // Verificar permissão
      if (req.user?.tipo === 'MEDICO' && consulta.medicoId !== req.user.medico?.id) {
        res.status(403).json({ erro: 'Acesso negado' });
        return;
      }
      if (req.user?.tipo === 'PACIENTE' && consulta.pacienteId !== req.user.paciente?.id) {
        res.status(403).json({ erro: 'Acesso negado' });
        return;
      }
      res.json(consulta);
    } catch (error) {
      console.error('Erro ao obter consulta:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async atualizarConsulta(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { dataHora, motivo, observacoes, status } = req.body;
      const consultaExistente = await prisma.consulta.findUnique({ where: { id } });
      if (!consultaExistente) {
        res.status(404).json({ erro: 'Consulta não encontrada' });
        return;
      }
      if (req.user?.tipo === 'MEDICO' && consultaExistente.medicoId !== req.user.medico?.id) {
        res.status(403).json({ erro: 'Acesso negado' });
        return;
      }
      const updateData: any = {};
      if (dataHora) {
        const novaData = new Date(dataHora);
        if (novaData < new Date()) {
          res.status(400).json({ erro: 'Data da consulta não pode ser no passado' });
          return;
        }
        updateData.dataHora = novaData;
      }
      if (motivo) updateData.motivo = motivo;
      if (observacoes !== undefined) updateData.observacoes = observacoes;
      if (status && ['AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA'].includes(status)) {
        updateData.status = status;
      }
      const consulta = await prisma.consulta.update({
        where: { id },
        data: updateData,
        include: {
          medico: { select: { nome: true, especialidade: true, crm: true } },
          paciente: { select: { nome: true, cpf: true, cartaoSus: true } }
        }
      });
      res.json({
        message: 'Consulta atualizada com sucesso',
        consulta
      });
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async deletarConsulta(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const consulta = await prisma.consulta.findUnique({ where: { id } });
      if (!consulta) {
        res.status(404).json({ erro: 'Consulta não encontrada' });
        return;
      }
      if (req.user?.tipo !== 'ADMIN' && (req.user?.tipo !== 'MEDICO' || consulta.medicoId !== req.user.medico?.id)) {
        res.status(403).json({ erro: 'Acesso negado' });
        return;
      }
      await prisma.consulta.delete({ where: { id } });
      res.json({ message: 'Consulta deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar consulta:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async consultasPorMedico(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { medicoId } = req.params;
      if (req.user?.tipo === 'MEDICO' && medicoId !== req.user.medico?.id) {
        res.status(403).json({ erro: 'Acesso negado' });
        return;
      }
      const consultas = await prisma.consulta.findMany({
        where: { medicoId },
        include: {
          paciente: { select: { nome: true, cpf: true, cartaoSus: true } }
        },
        orderBy: { dataHora: 'asc' }
      });
      res.json(consultas);
    } catch (error) {
      console.error('Erro ao buscar consultas por médico:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async consultasPorPaciente(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pacienteId } = req.params;
      if (req.user?.tipo === 'PACIENTE' && pacienteId !== req.user.paciente?.id) {
        res.status(403).json({ erro: 'Acesso negado' });
        return;
      }
      const consultas = await prisma.consulta.findMany({
        where: { pacienteId },
        include: {
          medico: { select: { nome: true, especialidade: true, crm: true } }
        },
        orderBy: { dataHora: 'desc' }
      });
      res.json(consultas);
    } catch (error) {
      console.error('Erro ao buscar consultas por paciente:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

export default ConsultaController;
