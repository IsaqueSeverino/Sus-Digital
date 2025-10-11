const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, senha, tipo, nome, cpf } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ erro: 'Usuário já existe' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 12);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        email,
        senha: hashedPassword,
        tipo
      }
    });

    // Criar perfil baseado no tipo
    if (tipo === 'PACIENTE') {
      await prisma.paciente.create({
        data: {
          nome,
          cpf,
          usuarioId: usuario.id
        }
      });
    }

    res.status(201).json({ 
      mensagem: 'Usuário criado com sucesso',
      usuario: { id: usuario.id, email: usuario.email, tipo: usuario.tipo }
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        medico: true,
        paciente: true
      }
    });

    if (!usuario || !await bcrypt.compare(senha, usuario.senha)) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        email: usuario.email,
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
        perfil: usuario.medico || usuario.paciente
      }
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
