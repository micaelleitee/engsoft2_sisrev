# 🐧 Guia de Instalação PostgreSQL - Arch Linux

## Passo 1: Instalar PostgreSQL

```bash
sudo pacman -S postgresql
```

## Passo 2: Inicializar o Cluster do Banco de Dados

O PostgreSQL precisa criar um cluster (diretório de dados) antes de ser usado:

```bash
sudo -u postgres initdb -D /var/lib/postgresql/data
```

**Nota:** Se você receber um erro dizendo que o diretório não existe, crie-o primeiro:

```bash
sudo mkdir -p /var/lib/postgresql/data
sudo chown postgres:postgres /var/lib/postgresql/data
sudo -u postgres initdb -D /var/lib/postgresql/data
```

## Passo 3: Iniciar o Serviço PostgreSQL

```bash
# Iniciar o serviço
sudo systemctl start postgresql

# Habilitar para iniciar automaticamente no boot
sudo systemctl enable postgresql

# Verificar se está rodando
sudo systemctl status postgresql
```

Você deve ver algo como: `Active: active (running)`

## Passo 4: Criar o Banco de Dados e Usuário

### Opção A: Usar o usuário postgres padrão (mais simples)

```bash
# Entrar no PostgreSQL como usuário postgres
sudo -u postgres psql

# Dentro do psql, execute:
CREATE DATABASE sisrev;
\q
```

Depois, configure o `.env` com:
```env
DATABASE_URL="postgresql://postgres:@localhost:5432/sisrev?schema=public"
```

### Opção B: Criar um usuário específico (recomendado)

```bash
# Entrar no PostgreSQL
sudo -u postgres psql

# Criar um novo usuário
CREATE USER sisrev_user WITH PASSWORD 'sua_senha_segura_aqui';

# Criar o banco de dados
CREATE DATABASE sisrev OWNER sisrev_user;

# Dar todas as permissões
GRANT ALL PRIVILEGES ON DATABASE sisrev TO sisrev_user;

# Sair do psql
\q
```

Depois, configure o `.env` com:
```env
DATABASE_URL="postgresql://sisrev_user:sua_senha_segura_aqui@localhost:5432/sisrev?schema=public"
```

## Passo 5: Testar a Conexão

```bash
# Se usou o usuário postgres
sudo -u postgres psql -d sisrev

# Se criou um usuário específico
psql -U sisrev_user -d sisrev
```

Se conseguir entrar, está tudo funcionando! Digite `\q` para sair.

## Passo 6: Configurar o Backend

1. **Criar arquivo `.env` na pasta `server/`:**

```bash
cd server
cp .env.example .env
```

2. **Editar o `.env` com suas credenciais:**

```env
# Se usou usuário postgres (sem senha)
DATABASE_URL="postgresql://postgres:@localhost:5432/sisrev?schema=public"

# OU se criou usuário específico
DATABASE_URL="postgresql://sisrev_user:sua_senha_segura_aqui@localhost:5432/sisrev?schema=public"

JWT_SECRET="gere-uma-chave-secreta-aqui"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:8081"
```

3. **Gerar JWT_SECRET:**

```bash
openssl rand -base64 32
```

Cole o resultado no campo `JWT_SECRET` do `.env`.

## Passo 7: Instalar Dependências e Configurar Prisma

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Passo 8: Iniciar o Servidor

```bash
npm run dev
```

O servidor deve iniciar em `http://localhost:3000`

## ✅ Verificar se está funcionando

1. Teste o endpoint de health:
```bash
curl http://localhost:3000/health
```

2. Teste o login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"micael@ifce.edu.br","password":"micael"}'
```

## 🛠️ Comandos Úteis

### Parar PostgreSQL
```bash
sudo systemctl stop postgresql
```

### Reiniciar PostgreSQL
```bash
sudo systemctl restart postgresql
```

### Ver logs do PostgreSQL
```bash
sudo journalctl -u postgresql -f
```

### Acessar o banco via linha de comando
```bash
# Com usuário postgres
sudo -u postgres psql -d sisrev

# Com seu usuário
psql -U seu_usuario -d sisrev
```

### Comandos úteis dentro do psql
```sql
-- Listar todos os bancos
\l

-- Conectar a um banco
\c sisrev

-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d nome_da_tabela

-- Sair
\q
```

## 🐛 Troubleshooting

### Erro: "could not connect to server"
- Verifique se o PostgreSQL está rodando: `sudo systemctl status postgresql`
- Se não estiver, inicie: `sudo systemctl start postgresql`

### Erro: "password authentication failed"
- Verifique a senha no `.env`
- Se estiver usando o usuário `postgres` sem senha, use: `postgresql://postgres:@localhost:5432/...`

### Erro: "database does not exist"
- Crie o banco: `sudo -u postgres psql -c "CREATE DATABASE sisrev;"`

### Erro: "permission denied"
- Verifique as permissões do usuário: `GRANT ALL PRIVILEGES ON DATABASE sisrev TO seu_usuario;`

### Resetar o banco de dados (CUIDADO: apaga tudo)
```bash
sudo -u postgres psql -c "DROP DATABASE sisrev;"
sudo -u postgres psql -c "CREATE DATABASE sisrev;"
cd server
npm run prisma:migrate
npm run prisma:seed
```
