# SISREV Backend API

Backend API para o Sistema de Agendamento de Laboratórios do IFCE - SISREV.

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🚀 Configuração Inicial

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/sisrev?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
PORT=3000
NODE_ENV=development
```

### 3. Criar banco de dados

```bash
# Criar o banco de dados no PostgreSQL
createdb sisrev

# Ou usando psql
psql -U postgres
CREATE DATABASE sisrev;
```

### 4. Executar migrações do Prisma

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar as tabelas no banco
npm run prisma:migrate
```

### 5. Popular banco com dados iniciais (opcional)

```bash
npm run prisma:seed
```

## 🏃 Executando o servidor

### Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Produção

```bash
npm run build
npm start
```

## 📚 Estrutura do Projeto

```
server/
├── prisma/
│   ├── schema.prisma      # Schema do banco de dados
│   └── seed.ts            # Dados iniciais
├── src/
│   ├── controllers/       # Lógica de negócio
│   ├── middleware/        # Middlewares (auth, error handling)
│   ├── routes/            # Rotas da API
│   └── server.ts          # Arquivo principal
├── .env                   # Variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🔌 Endpoints da API

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Laboratórios

- `GET /api/laboratories` - Listar todos
- `GET /api/laboratories/:id` - Detalhes de um laboratório

### Reservas

- `GET /api/reservations` - Listar reservas
- `GET /api/reservations/:id` - Detalhes de uma reserva
- `POST /api/reservations` - Criar reserva (apenas professores)
- `PUT /api/reservations/:id` - Atualizar reserva
- `DELETE /api/reservations/:id` - Cancelar reserva

### Usuários

- `GET /api/users/profile` - Perfil do usuário logado
- `PUT /api/users/profile` - Atualizar perfil

### Notificações

- `GET /api/notifications` - Listar notificações
- `PUT /api/notifications/:id/read` - Marcar como lida

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 🗄️ Banco de Dados

### Usando Prisma Studio (Interface Visual)

```bash
npm run prisma:studio
```

Acesse `http://localhost:5555` para visualizar e editar dados.

### Migrações

```bash
# Criar nova migração
npm run prisma:migrate

# Aplicar migrações em produção
npx prisma migrate deploy
```

## 🌐 Opções de Banco de Dados Online

### Desenvolvimento/Produção

1. **Supabase** (Recomendado - gratuito)
   - https://supabase.com
   - PostgreSQL gerenciado
   - Interface web para gerenciar dados

2. **Railway**
   - https://railway.app
   - Deploy fácil
   - PostgreSQL incluído

3. **Render**
   - https://render.com
   - PostgreSQL gratuito disponível

4. **Neon**
   - https://neon.tech
   - PostgreSQL serverless

### Configuração com Supabase

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a connection string
5. Atualize `DATABASE_URL` no `.env`

## 📝 Exemplo de Uso

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "micael@ifce.edu.br",
    "password": "micael"
  }'
```

### Criar Reserva (com token)

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "laboratoryId": "...",
    "startDate": "2025-07-20T14:00:00Z",
    "endDate": "2025-07-20T16:00:00Z",
    "description": "Aula de Engenharia de Software"
  }'
```

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Teste a conexão: `psql -U usuario -d sisrev`

### Erro "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Resetar banco de dados

```bash
npx prisma migrate reset
npm run prisma:seed
```

