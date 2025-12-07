# Deploy no Vercel

Este guia explica como fazer deploy desta aplicação no Vercel.

## Arquivos Criados

Os seguintes arquivos foram criados para suportar o deploy no Vercel:

- `vercel.json` - Configuração do Vercel
- `api/index.ts` - API serverless para o Vercel

## Passo a Passo

### 1. Faça push do código para o GitHub

```bash
git add .
git commit -m "Configurar deploy Vercel"
git push origin main
```

### 2. Importe o projeto no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New..."** → **"Project"**
3. Selecione seu repositório GitHub

### 3. Configure o projeto

Na tela de configuração do Vercel:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Other |
| **Root Directory** | `.` (deixe em branco ou raiz) |
| **Build Command** | `npx vite build --config vite.config.ts` |
| **Output Directory** | `dist/public` |
| **Install Command** | `npm install` |

### 4. Clique em Deploy

Aguarde o build completar.

## Estrutura do Projeto

```
projeto/
├── api/
│   └── index.ts      ← API serverless (rotas da API)
├── client/
│   ├── src/          ← Código React
│   └── index.html
├── dist/
│   └── public/       ← Build output (gerado)
├── vercel.json       ← Configuração Vercel
└── vite.config.ts
```

## Como Funciona

1. **Frontend (React/Vite):** O Vercel builda o frontend usando Vite e serve os arquivos estáticos de `dist/public`.

2. **API (Serverless):** O arquivo `api/index.ts` é convertido automaticamente em uma função serverless. Todas as requisições para `/api/*` são roteadas para essa função.

## Importante: Armazenamento de Dados

**Atenção:** A API usa armazenamento em memória que reseta a cada cold start. Para dados persistentes em produção, você precisa:

1. Criar um banco de dados em um serviço como:
   - [Neon](https://neon.tech) (PostgreSQL serverless - recomendado)
   - [Supabase](https://supabase.com)
   - [PlanetScale](https://planetscale.com)

2. Adicionar a variável de ambiente `DATABASE_URL` no Vercel:
   - Vá em **Settings** → **Environment Variables**
   - Adicione `DATABASE_URL` com a connection string do seu banco

3. Atualize `api/index.ts` para usar o banco de dados

## Troubleshooting

### Site fazendo download ao invés de exibir

Se o site fizer download de um arquivo ao invés de exibir:

1. Verifique se o `vercel.json` está configurado corretamente
2. Confirme que o **Output Directory** está como `dist/public`
3. Verifique se o **Framework Preset** está como "Other" (não Vite)

### Erro 404 nas rotas da API

- Confirme que `api/index.ts` existe na raiz do projeto
- Verifique os logs no dashboard do Vercel

### Build falha

Verifique:
- Se todas as dependências estão no `package.json`
- Se não há erros de TypeScript (`npm run check`)

## Comandos Úteis

```bash
# Testar build localmente
npx vite build --config vite.config.ts

# Verificar TypeScript
npm run check

# Deploy via CLI (opcional)
npm i -g vercel
vercel login
vercel --prod
```

## Links

- [Vercel + Express](https://vercel.com/guides/using-express-with-vercel)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Neon PostgreSQL](https://neon.tech)
