import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err: unknown) => {
  if (err instanceof Error) {
    console.error('❌ Unhandled Rejection:', err.message);
  } else {
    console.error('❌ Unhandled Rejection:', err);
  }
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log('================================');
  console.log('SUS Digital API iniciada!');
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base: http://localhost:${PORT}/api`);
  console.log(`Interface Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log('Prisma Studio: npx prisma studio');
  console.log('================================');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado.');
  });
});

export default server;
