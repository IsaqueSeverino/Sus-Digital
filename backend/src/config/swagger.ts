import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const swaggerOptions: Options  = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SUS Digital API',
      version: '1.0.0',
      description: 'Sistema Web completo para gestão digital de saúde, seguindo padrões modernos de desenvolvimento',
      contact: {
        name: 'Equipe SUS Digital',
        url: 'https://github.com/IsaqueSeverino/Sus-Digital',
        email: 'contato@susdigital.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.susdigital.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /api/auth/login. Use o formato: Bearer {token}'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Ocorreu um erro ao processar a requisição'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-21T17:30:00.000Z'
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário',
              example: 'clxyz1234567890'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@exemplo.com'
            },
            tipo: {
              type: 'string',
              enum: ['ADMIN', 'MEDICO', 'PACIENTE'],
              description: 'Tipo de usuário',
              example: 'MEDICO'
            },
            ativo: {
              type: 'boolean',
              description: 'Se o usuário está ativo',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-15T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-20T14:30:00.000Z'
            }
          }
        },
        Medico: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxyz1234567890'
            },
            nome: {
              type: 'string',
              example: 'Dr. João Silva'
            },
            crm: {
              type: 'string',
              example: 'CRM/SP 123456'
            },
            especialidade: {
              type: 'string',
              example: 'Cardiologia'
            },
            telefone: {
              type: 'string',
              nullable: true,
              example: '(11) 98765-4321'
            },
            usuarioId: {
              type: 'string',
              example: 'clxyz0987654321'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Paciente: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxyz1234567890'
            },
            nome: {
              type: 'string',
              example: 'Maria Santos'
            },
            cpf: {
              type: 'string',
              example: '123.456.789-00'
            },
            dataNascimento: {
              type: 'string',
              format: 'date-time',
              example: '1990-05-15T00:00:00.000Z'
            },
            telefone: {
              type: 'string',
              nullable: true,
              example: '(11) 91234-5678'
            },
            endereco: {
              type: 'string',
              nullable: true,
              example: 'Rua das Flores, 123 - São Paulo/SP'
            },
            cartaoSus: {
              type: 'string',
              nullable: true,
              example: '123 4567 8901 2345'
            },
            usuarioId: {
              type: 'string',
              example: 'clxyz0987654321'
            }
          }
        },
        Consulta: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxyz1234567890'
            },
            dataHora: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-25T14:30:00.000Z'
            },
            motivo: {
              type: 'string',
              example: 'Consulta de rotina'
            },
            observacoes: {
              type: 'string',
              nullable: true,
              example: 'Paciente relata dores de cabeça frequentes'
            },
            status: {
              type: 'string',
              enum: ['AGENDADA', 'CONFIRMADA', 'REALIZADA', 'CANCELADA'],
              example: 'AGENDADA'
            },
            medicoId: {
              type: 'string',
              example: 'clxyz1111111111'
            },
            pacienteId: {
              type: 'string',
              example: 'clxyz2222222222'
            }
          }
        },
        Prontuario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxyz1234567890'
            },
            data: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-21T14:00:00.000Z'
            },
            diagnostico: {
              type: 'string',
              example: 'Hipertensão arterial sistêmica'
            },
            sintomas: {
              type: 'string',
              nullable: true,
              example: 'Dores de cabeça, tontura'
            },
            tratamento: {
              type: 'string',
              nullable: true,
              example: 'Medicação anti-hipertensiva'
            },
            observacoes: {
              type: 'string',
              nullable: true,
              example: 'Paciente apresenta melhora após início do tratamento'
            },
            pacienteId: {
              type: 'string',
              example: 'clxyz2222222222'
            }
          }
        },
        Exame: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxyz1234567890'
            },
            tipo: {
              type: 'string',
              enum: ['LABORATORIAL', 'IMAGEM', 'CARDIOLOGICO', 'NEUROLOGICO'],
              example: 'LABORATORIAL'
            },
            nome: {
              type: 'string',
              example: 'Hemograma Completo'
            },
            resultado: {
              type: 'string',
              nullable: true,
              example: 'Valores dentro da normalidade'
            },
            dataExame: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-20T09:00:00.000Z'
            },
            observacoes: {
              type: 'string',
              nullable: true,
              example: 'Exame realizado em jejum de 12 horas'
            },
            consultaId: {
              type: 'string',
              example: 'clxyz3333333333'
            }
          }
        },
        Medicacao: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clxyz1234567890'
            },
            nome: {
              type: 'string',
              example: 'Losartana'
            },
            dosagem: {
              type: 'string',
              example: '50mg'
            },
            frequencia: {
              type: 'string',
              example: '1 vez ao dia'
            },
            duracao: {
              type: 'string',
              example: 'Uso contínuo'
            },
            instrucoes: {
              type: 'string',
              nullable: true,
              example: 'Tomar pela manhã, antes do café'
            },
            prontuarioId: {
              type: 'string',
              example: 'clxyz4444444444'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'senha', 'tipo'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'novo.usuario@exemplo.com'
            },
            senha: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'senha123'
            },
            tipo: {
              type: 'string',
              enum: ['ADMIN', 'MEDICO', 'PACIENTE'],
              example: 'MEDICO'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@exemplo.com'
            },
            senha: {
              type: 'string',
              format: 'password',
              example: 'senha123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticação',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para autenticação e gerenciamento de sessão'
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários do sistema (requer perfil ADMIN)'
      },
      {
        name: 'Médicos',
        description: 'Consulta de informações sobre médicos cadastrados'
      },
      {
        name: 'Pacientes',
        description: 'Gerenciamento de pacientes (requer perfil MEDICO ou ADMIN)'
      },
      {
        name: 'Consultas',
        description: 'Gerenciamento de consultas médicas'
      },
      {
        name: 'Prontuários',
        description: 'Gerenciamento de prontuários médicos (em desenvolvimento)'
      },
      {
        name: 'Exames',
        description: 'Gerenciamento de exames (em desenvolvimento)'
      }
    ]
  },
  apis: ['./src/routes/*.ts']

};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;