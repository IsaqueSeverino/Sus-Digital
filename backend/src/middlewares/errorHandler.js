const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro capturado:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo';
    return res.status(400).json({
      erro: 'Dados duplicados',
      message: `O ${field} informado já está em uso`,
      field,
      code: 'DUPLICATE_ENTRY'
    });
  }

  // Erro de registro não encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      erro: 'Registro não encontrado',
      message: 'O recurso solicitado não foi encontrado',
      code: 'NOT_FOUND'
    });
  }

  // Erro de relacionamento
  if (err.code === 'P2003') {
    return res.status(400).json({
      erro: 'Erro de relacionamento',
      message: 'Referência a registro inexistente',
      code: 'FOREIGN_KEY_CONSTRAINT'
    });
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      erro: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }

  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      erro: 'Token expirado',
      message: 'Faça login novamente',
      code: 'EXPIRED_TOKEN'
    });
  }

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      erro: 'Dados inválidos',
      message: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Erro padrão
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    })
  });
};

module.exports = errorHandler;
