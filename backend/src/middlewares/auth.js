const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        medico: true,
        paciente: true
      }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Token inválido' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

exports.authorize = (...tipos) => {
  return (req, res, next) => {
    if (!tipos.includes(req.user.tipo)) {
      return res.status(403).json({ 
        erro: 'Acesso negado. Permissão insuficiente.' 
      });
    }
    next();
  };
};
