# 🚀 Guia Rápido de Setup

## Opção 1: PostgreSQL Local com Docker (Recomendado para desenvolvimento)

### 1. Iniciar PostgreSQL com Docker

```bash
docker-compose up -d
```

Isso criará um container PostgreSQL rodando na porta 5432.

### 2. Configurar .env

Crie um arquivo `.env` na pasta `server/` com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sisrev?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura-aqui-mude-isso"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:8081"
```

### 3. Instalar dependências e configurar

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Iniciar servidor

```bash
npm run dev
```

## Opção 2: PostgreSQL Local (sem Docker)

### 1. Instalar PostgreSQL

**Linux (Arch):**
```bash
sudo pacman -S postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Criar banco de dados

```bash
sudo -u postgres psql
CREATE DATABASE sisrev;
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE sisrev TO seu_usuario;
\q
```

### 3. Configurar .env

```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/sisrev?schema=public"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
PORT=3000
NODE_ENV=development
```

### 4. Continuar com os passos 3 e 4 da Opção 1

## Opção 3: Banco Online (Supabase - Recomendado para produção)

### 1. Criar conta no Supabase

1. Acesse https://supabase.com
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Aguarde o provisionamento (2-3 minutos)

### 2. Obter connection string

1. Vá em **Settings** > **Database**
2. Role até **Connection string**
3. Selecione **URI** e copie a string
4. Substitua `[YOUR-PASSWORD]` pela senha do seu banco

### 3. Configurar .env

```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres"
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
PORT=3000
NODE_ENV=production
```

### 4. Executar migrações

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 🔑 Gerar JWT_SECRET seguro

```bash
# Linux/Mac
openssl rand -base64 32

# Ou use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ✅ Verificar se está funcionando

1. Inicie o servidor: `npm run dev`
2. Acesse: http://localhost:3000/health
3. Deve retornar: `{"status":"ok","message":"SISREV API is running"}`

## 🧪 Testar autenticação

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"micael@ifce.edu.br","password":"micael"}'
```

## 🛑 Parar PostgreSQL (Docker)

```bash
docker-compose down
```

Para remover os dados também:
```bash
docker-compose down -v
```

