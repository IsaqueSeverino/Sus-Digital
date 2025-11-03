import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import authRoutes from './routes/auth.js';
import usuarioRoutes from './routes/usuarios.js';
import medicoRoutes from './routes/medicos.js';
import pacienteRoutes from './routes/pacientes.js';
import consultaRoutes from './routes/consultas.js';
import prontuarioRoutes from './routes/prontuarios.js';
import exameRoutes from './routes/exames.js';

import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(logger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { font-size: 36px; }
  `,
  customSiteTitle: 'SUS Digital API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai',
    },
  },
}));

app.get('/api-docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'SUS Digital API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Sistema funcionando perfeitamente!',
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Bem-vindo à API SUS Digital!',
    version: '1.0.0',
    description: 'Sistema de Gestão de Saúde Digital',
    documentation: {
      swagger: `${req.protocol}://${req.get('host')}/api-docs`,
      json: `${req.protocol}://${req.get('host')}/api-docs.json`,
    },
    author: 'Isaque Severino, Fhelipe Estumano, José Miguel e Artur Silva',
    disciplina: 'Desenvolvimento de Sistemas Web II',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Cadastrar novo usuário',
        'POST /api/auth/login': 'Fazer login',
        'GET /api/auth/me': 'Obter dados do usuário logado',
        'POST /api/auth/change-password': 'Alterar senha',
      },
      usuarios: {
        'GET /api/usuarios': 'Listar usuários (ADMIN)',
        'GET /api/usuarios/:id': 'Obter usuário por ID (ADMIN)',
        'PUT /api/usuarios/:id': 'Atualizar usuário (ADMIN)',
        'DELETE /api/usuarios/:id': 'Deletar usuário (ADMIN)',
      },
      medicos: {
        'GET /api/medicos': 'Listar médicos',
        'GET /api/medicos/:id': 'Obter médico por ID',
      },
      pacientes: {
        'GET /api/pacientes': 'Listar pacientes (MEDICO/ADMIN)',
      },
      consultas: {
        'GET /api/consultas': 'Listar consultas',
        'POST /api/consultas': 'Criar nova consulta (MEDICO/ADMIN)',
        'GET /api/consultas/:id': 'Obter consulta por ID',
        'PUT /api/consultas/:id': 'Atualizar consulta (MEDICO/ADMIN)',
        'DELETE /api/consultas/:id': 'Deletar consulta (ADMIN)',
      },
      prontuarios: {
        'GET /api/prontuarios': 'Rotas em desenvolvimento',
      },
      exames: {
        'GET /api/exames': 'Rotas em desenvolvimento',
      },
    },
    features: [
      'Autenticação JWT',
      'Controle de perfis (Admin, Médico, Paciente)',
      'CRUD completo para todas as entidades',
      'Relacionamentos entre tabelas',
      'Middleware de segurança',
      'Prisma ORM com PostgreSQL',
      'Documentação Swagger interativa',
    ],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/prontuarios', prontuarioRoutes);
app.use('/api/exames', exameRoutes);

app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    message: 'Verifique a documentação em /api-docs',
    timestamp: new Date().toISOString(),
  });
});

export default app;
