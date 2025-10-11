const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.criarConsulta = async (req, res) => {
  try {
    const { dataHora, motivo, medicoId, pacienteId } = req.body;

    const consulta = await prisma.consulta.create({
      data: {
        dataHora: new Date(dataHora),
        motivo,
        medicoId,
        pacienteId
      },
      include: {
        medico: true,
        paciente: true
      }
    });

    res.status(201).json(consulta);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.listarConsultas = async (req, res) => {
  try {
    const consultas = await prisma.consulta.findMany({
      include: {
        medico: true,
        paciente: true,
        exames: true
      },
      orderBy: { dataHora: 'asc' }
    });

    res.json(consultas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.obterConsulta = async (req, res) => {
  try {
    const { id } = req.params;

    const consulta = await prisma.consulta.findUnique({
      where: { id },
      include: {
        medico: true,
        paciente: true,
        exames: true
      }
    });

    if (!consulta) {
      return res.status(404).json({ erro: 'Consulta não encontrada' });
    }

    res.json(consulta);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.atualizarConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const consulta = await prisma.consulta.update({
      where: { id },
      data: dados,
      include: {
        medico: true,
        paciente: true
      }
    });

    res.json(consulta);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.deletarConsulta = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.consulta.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
