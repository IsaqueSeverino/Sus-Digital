const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar rotas
const authRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuarios');
const medicoRoutes = require('./routes/medicos');
const pacienteRoutes = require('./routes/pacientes');
const consultaRoutes = require('./routes/consultas');
const prontuarioRoutes = require('./routes/prontuarios');
const exameRoutes = require('./routes/exames');

// Importar middlewares
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();

// Middlewares globais
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

// Logger de requisições
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'SUS Digital API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: '🏥 Sistema funcionando perfeitamente!'
  });
});

// Documentação básica da API
app.get('/api', (req, res) => {
  res.json({ 
    message: '🏥 Bem-vindo à API SUS Digital!',
    version: '1.0.0',
    description: 'Sistema de Gestão de Saúde Digital',
    author: 'Isaque Severino',
    disciplina: 'Desenvolvimento de Sistemas Web II',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Cadastrar novo usuário',
        'POST /api/auth/login': 'Fazer login',
        'GET /api/auth/me': 'Obter dados do usuário logado'
      },
      usuarios: {
        'GET /api/usuarios': 'Listar usuários',
        'GET /api/usuarios/:id': 'Obter usuário por ID',
        'PUT /api/usuarios/:id': 'Atualizar usuário',
        'DELETE /api/usuarios/:id': 'Deletar usuário'
      },
      consultas: {
        'GET /api/consultas': 'Listar consultas',
        'POST /api/consultas': 'Criar nova consulta',
        'GET /api/consultas/:id': 'Obter consulta por ID',
        'PUT /api/consultas/:id': 'Atualizar consulta',
        'DELETE /api/consultas/:id': 'Deletar consulta'
      }
    },
    features: [
      '🔐 Autenticação JWT',
      '👥 Controle de perfis (Admin, Médico, Paciente)',
      '📋 CRUD completo para todas as entidades',
      '🔗 Relacionamentos entre tabelas',
      '🛡️ Middleware de segurança',
      '📊 Prisma ORM com SQLite'
    ]
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/prontuarios', prontuarioRoutes);
app.use('/api/exames', exameRoutes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Rota não encontrada (deve ser a penúltima)
app.use('*', (req, res) => {
  res.status(404).json({ 
    erro: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    message: 'Verifique a documentação em /api',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
