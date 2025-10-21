const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const medicoRoutes = require('./routes/medicos');
const pacienteRoutes = require('./routes/pacientes');
const consultaRoutes = require('./routes/consultas');
const prontuarioRoutes = require('./routes/prontuarios');
const exameRoutes = require('./routes/exames');

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
      theme: 'monokai'
    }
  }
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'SUS Digital API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Sistema funcionando perfeitamente!'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo à API SUS Digital!',
    version: '1.0.0',
    description: 'Sistema de Gestão de Saúde Digital',
    documentation: {
      swagger: `${req.protocol}://${req.get('host')}/api-docs`,
      json: `${req.protocol}://${req.get('host')}/api-docs.json`
    },
    author: 'Isaque Severino, Fhelipe Estumano, José Miguel e Artur Silva',
    disciplina: 'Desenvolvimento de Sistemas Web II',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Cadastrar novo usuário',
        'POST /api/auth/login': 'Fazer login',
        'GET /api/auth/me': 'Obter dados do usuário logado',
        'POST /api/auth/change-password': 'Alterar senha'
      },
      usuarios: {
        'GET /api/usuarios': 'Listar usuários (ADMIN)',
        'GET /api/usuarios/:id': 'Obter usuário por ID (ADMIN)',
        'PUT /api/usuarios/:id': 'Atualizar usuário (ADMIN)',
        'DELETE /api/usuarios/:id': 'Deletar usuário (ADMIN)'
      },
      medicos: {
        'GET /api/medicos': 'Listar médicos',
        'GET /api/medicos/:id': 'Obter médico por ID'
      },
      pacientes: {
        'GET /api/pacientes': 'Listar pacientes (MEDICO/ADMIN)'
      },
      consultas: {
        'GET /api/consultas': 'Listar consultas',
        'POST /api/consultas': 'Criar nova consulta (MEDICO/ADMIN)',
        'GET /api/consultas/:id': 'Obter consulta por ID',
        'PUT /api/consultas/:id': 'Atualizar consulta (MEDICO/ADMIN)',
        'DELETE /api/consultas/:id': 'Deletar consulta (ADMIN)'
      },
      prontuarios: {
        'GET /api/prontuarios': 'Rotas em desenvolvimento'
      },
      exames: {
        'GET /api/exames': 'Rotas em desenvolvimento'
      }
    },
    features: [
      'Autenticação JWT',
      'Controle de perfis (Admin, Médico, Paciente)',
      'CRUD completo para todas as entidades',
      'Relacionamentos entre tabelas',
      'Middleware de segurança',
      'Prisma ORM com PostgreSQL',
      'Documentação Swagger interativa'
    ]
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

app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    message: 'Verifique a documentação em /api-docs',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;