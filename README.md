# SUS Digital

SUS Digital é uma plataforma web completa para gerenciamento de processos de saúde, focada em simplicidade, modernidade e segurança. O sistema contempla cadastro de usuários (Admin, Médico, Paciente), consultas, registros médicos, exames e controle de acesso, seguindo padrões modernos de desenvolvimento web: Node.js, Express, Prisma ORM, PostgreSQL, Docker e Swagger.

---

## 🏗️ Estrutura do Projeto

- **Frontend:** HTML, CSS, JavaScript (interface responsiva, área de login, registro, consultas)
- **Backend:** Node.js + Express, Prisma ORM, autenticação JWT, PostgreSQL e Swagger
- **Infra/Docker:** Dockerfile para backend, docker-compose para ambiente integrado
- **Banco:** Modelagem relacional/prisma, persistência de dados médicos/pacientes

## 📦 Principais Funcionalidades

- Autenticação JWT (Admin, Médico, Paciente)
- CRUD completo de usuários, médicos, pacientes, consultas e prontuários
- Registro e consulta de exames e medicações
- Busca avançada por entidades médicas
- Segurança robusta com controle de acesso (RBAC)
- Documentação interativa da API via Swagger
- Deploy simplificado com Docker/Docker Compose
- Health check para monitoramento

## Tecnologias Utilizadas

- Backend: Node.js + Express
- ORM: Prisma
- Banco de dados: PostgreSQL
- Autenticação/JWT: bcrypt + jsonwebtoken
- Documentação: Swagger UI
- Containerização: Docker & Docker Compose
- Infra: Variáveis de ambiente (.env)

## 🔐 Autenticação & Segurança

- Fluxo JWT: login, geração de token, autorização via middleware
- Proteção de rotas: RBAC para Admin, Médico, Paciente
- Senhas com bcrypt
- Variáveis sensíveis mantidas apenas no .env

## 🗄️ Estrutura de Pastas (Resumo)

```
SUS-DIGITAL/
├── assets/
├── backend/
│   ├── node_modules/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── swagger.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── consultaController.ts
│   │   │   └── usuarioController.ts
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── logger.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── consultas.ts
│   │   │   ├── exames.ts
│   │   │   ├── medicos.ts
│   │   │   ├── pacientes.ts
│   │   │   ├── prontuarios.ts
│   │   │   └── usuarios.ts
│   │   ├── utils/
│   │   │   ├── bcrypt.ts
│   │   │   ├── jwt.ts
│   │   │   └── seed.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── conteudos/
├── css/
└── html/
```

## 🚀 Como rodar localmente

### 1. Clone este repositório

```
git clone https://github.com/IsaqueSeverino/Sus-Digital.git
cd Sus-Digital
```

### 2. Configure o ambiente backend

#### Configure seu .env em /backend/.env:

```
DATABASE_URL="postgresql://[user]%2Elpfoivzqxzowtaifrtdx:[senha]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# JWT
JWT_SECRET=""
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"
````

### 3. Suba os containers com Docker Compose

```
docker-compose up --build
```

### 4. Execute migrações no container backend

```
docker-compose exec backend npx prisma migrate dev
```

### 5. Acesse a aplicação

```
- Backend API: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`
- Prisma Studio: `docker-compose exec backend npx prisma studio` → `http://localhost:5555`
- Swagger UI: `http://localhost:3000/api-docs` (docker-compose exec backend npx prisma studio)
```

## ⚡ Endpoints Principais

```
POST   /api/auth/register         # Cadastro
POST   /api/auth/login            # Login
GET    /api/users                 # Listar usuários (Admin)
GET    /api/pacientes             # Listar pacientes
GET    /api/medicos               # Listar médicos
GET    /api/consultas             # Listar consultas
POST   /api/consultas             # Agendar consulta
POST   /api/prontuarios           # Prontuário
GET    /health                    # Health check
GET    /api-docs                  # Swagger UI
```

## 👩‍💻 Contribuidores

- [IsaqueSeverino](https://github.com/IsaqueSeverino)
- [Art-vieira](https://github.com/Art-vieira)

## 📄 Licença

Projeto acadêmico, código aberto para fins educativos e de demonstração.








