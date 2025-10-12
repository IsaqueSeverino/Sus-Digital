# SUS Digital

Sistema Web completo para gestão digital de saúde, seguindo padrões modernos de desenvolvimento (Node.js, Prisma, PostgreSQL, Docker) e requisitos acadêmicos da disciplina "Desenvolvimento de Sistemas Web II".

---

## 🏗️ Estrutura do Projeto

- **Frontend:** HTML, CSS, JavaScript (interface responsiva, área de login, registro, consultas)
- **Backend:** Node.js + Express, Prisma ORM, autenticação JWT, PostgreSQL
- **Infra/Docker:** Dockerfile para backend, docker-compose para ambiente integrado
- **Banco:** Modelagem relacional/prisma, persistência de dados médicos/pacientes

## 📦 Principais Funcionalidades

- Cadastro e autenticação de usuários (Admin, Médico, Paciente)
- CRUD completo de consultas, usuários, médicos e pacientes
- Registro de prontuários, exames, medicações
- Listagem, filtros e busca avançada por entidades
- Segurança via JWT e controle de perfis de acesso
- Deploy fácil via Docker/Docker Compose

## 🚀 Como rodar localmente

### 1. Clone este repositório

```
git clone https://github.com/IsaqueSeverino/Sus-Digital.git
cd Sus-Digital
```

### 2. Configure o ambiente backend

#### Exemplo `.env` para Docker local:

```
DATABASE_URL="postgresql://postgres:postgres@db:5432/sus_digital?schema=public"
JWT_SECRET="SUA_CHAVE_SEGURA_AQUI"
PORT=3000
````

### 3. Rode com Docker Compose

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
```

## 🗄️ Estrutura de Pastas (Resumo)

```
Sus-Digital/
├── backend/
│ ├── prisma/
│ ├── src/
│ ├── Dockerfile
│ ├── docker-compose.yml
│ ├── .env
│ └── package.json
├── html/
├── css/
├── js/
└── assets/
```


## 👩‍💻 Contribuidores

- [IsaqueSeverino](https://github.com/IsaqueSeverino)
- [Art-vieira](https://github.com/Art-vieira)

## 📚 Detalhes técnicos

- **Backend:** Express, Prisma, JWT Auth, Docker-ready
- **Frontend:** HTML/CSS/JS puro para interface médica/paciente
- **Banco:** PostgreSQL modelado para dados de saúde
- **Infra:** Pronto para deploy local ou em nuvem, versionado e seguro (.env não versionado)
- **Documentação:** Endpoints explicados em `/api`, exemplos e scripts para dados de teste disponíveis

## 📑 Licença

MIT (ou adaptar conforme política da disciplina/faculdade)

---

**Dicas finais:**
- Nunca suba o `.env` real, compartilhe apenas `.env.example`!
- Siga o passo-a-passo do Docker para rodar em qualquer máquina.
- Documente endpoints e exemplos de uso conforme necessidade do projeto/acadêmico.

---




