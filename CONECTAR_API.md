# 🔌 Guia de Conexão do Front-end com a API

## 📋 Passo a Passo Completo

### 1. Instalar PostgreSQL (se ainda não instalou)

Siga o guia em `server/SETUP_ARCH_LINUX.md` para instalar e configurar o PostgreSQL.

### 2. Configurar e Iniciar o Backend

```bash
# 1. Ir para a pasta do servidor
cd server

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env
cp .env.example .env

# 4. Editar .env com suas credenciais do PostgreSQL
# DATABASE_URL="postgresql://postgres:@localhost:5432/sisrev?schema=public"
# JWT_SECRET="gere-uma-chave-com-openssl-rand-base64-32"
# PORT=3000
# NODE_ENV=development
# CORS_ORIGIN="http://localhost:8081"

# 5. Gerar Prisma Client e criar tabelas
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 6. Iniciar o servidor
npm run dev
```

O servidor deve estar rodando em `http://localhost:3000`

### 3. Instalar Dependências do Front-end

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências (incluindo AsyncStorage)
npm install
```

### 4. Configurar URL da API

**IMPORTANTE:** Para desenvolvimento mobile, você precisa usar o IP da sua máquina ao invés de `localhost`.

#### Encontrar seu IP (Linux):

```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Ou:

```bash
hostname -I
```

Você verá algo como: `192.168.1.100`

#### Atualizar a configuração:

Edite o arquivo `src/config/api.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:3000' // Substitua pelo SEU IP
  : 'https://sua-api-em-producao.com';
```

**Para Android Emulator:**
- Use `http://10.0.2.2:3000` (IP especial do emulador Android)

**Para iOS Simulator:**
- Use `http://localhost:3000` (funciona normalmente)

**Para dispositivo físico:**
- Use o IP da sua máquina na mesma rede WiFi: `http://192.168.1.100:3000`

### 5. Testar a Conexão

#### 5.1. Verificar se o backend está rodando:

```bash
curl http://localhost:3000/health
```

Deve retornar: `{"status":"ok","message":"SISREV API is running"}`

#### 5.2. Testar login via curl:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"micael@ifce.edu.br","password":"micael"}'
```

#### 5.3. Testar no app:

1. Inicie o app: `npm start`
2. Escolha o tipo de usuário (Aluno ou Professor)
3. Faça login com:
   - Email: `micael@ifce.edu.br`
   - Senha: `micael`

### 6. Estrutura Criada

```
src/
├── config/
│   └── api.ts              # Configuração da URL da API
├── services/
│   └── api.ts              # Serviço para fazer requisições HTTP
└── contexts/
    └── AuthContext.tsx     # Contexto de autenticação

app/
├── _layout.tsx             # Atualizado com AuthProvider
└── login/
    ├── sign-in.tsx         # Atualizado para usar API
    └── sign-up.tsx         # Atualizado para usar API
```

## 🔧 Troubleshooting

### Erro: "Network request failed"

**Causa:** O app não consegue conectar ao servidor.

**Soluções:**
1. Verifique se o servidor está rodando: `curl http://localhost:3000/health`
2. Verifique o IP no `src/config/api.ts`
3. Para Android Emulator, use `10.0.2.2:3000`
4. Para dispositivo físico, certifique-se de que está na mesma rede WiFi
5. Verifique o firewall: `sudo ufw allow 3000`

### Erro: "CORS policy"

**Causa:** O servidor está bloqueando requisições do app.

**Solução:** Verifique o `CORS_ORIGIN` no `.env` do servidor:
```env
CORS_ORIGIN="*"  # Para desenvolvimento (não use em produção)
```

### Erro: "Token inválido"

**Causa:** O token expirou ou está incorreto.

**Solução:** Faça logout e login novamente.

### Erro: "Email ou senha inválidos"

**Causa:** Credenciais incorretas ou usuário não existe.

**Solução:**
1. Verifique se executou `npm run prisma:seed` no servidor
2. Use as credenciais: `micael@ifce.edu.br` / `micael`
3. Ou crie um novo usuário pela tela de registro

## 📱 Próximos Passos

Agora que a autenticação está funcionando, você pode:

1. **Atualizar os dashboards** para buscar dados reais da API:
   - `app/dashboard-aluno/index.tsx`
   - `app/dashboard-professor/index.tsx`

2. **Implementar funcionalidades de reserva:**
   - Listar laboratórios disponíveis
   - Criar novas reservas
   - Cancelar reservas

3. **Adicionar notificações:**
   - Buscar notificações do usuário
   - Marcar como lidas

## 🔐 Segurança

⚠️ **IMPORTANTE:** 
- Em produção, nunca use `CORS_ORIGIN="*"`
- Use HTTPS
- Armazene o JWT_SECRET de forma segura
- Use variáveis de ambiente para configurações sensíveis

## 📚 Recursos

- [Documentação do AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do Expo](https://docs.expo.dev/)
