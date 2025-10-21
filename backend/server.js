require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('================================');
  console.log(`SUS Digital API iniciada!`);
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api`);
  console.log(`Interface Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`Prisma Studio: npx prisma studio`);
  console.log('================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔴 SIGTERM recebido. Fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado.');
  });
});

module.exports = server;
