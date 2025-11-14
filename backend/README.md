# Backend API - RPG Ficha Inventário

API backend em TypeScript com Node.js e SQLite para gerenciar dados de ficha de RPG e inventário.

## 🚀 Instalação

```bash
cd backend
npm install
```

## 📦 Dependências

- **express**: Framework web
- **better-sqlite3**: Banco de dados SQLite
- **cors**: Middleware para CORS
- **zod**: Validação de dados (opcional)
- **typescript**: Compilador TypeScript
- **tsx**: Executor TypeScript para desenvolvimento

## 🛠️ Scripts

- `npm run dev`: Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run build`: Compila o TypeScript para JavaScript
- `npm run start`: Inicia o servidor compilado
- `npm run migrate`: Executa migrações do banco de dados

## 📁 Estrutura

```
backend/
├── src/
│   ├── config/          # Configurações (banco de dados)
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── types/           # Tipos TypeScript
│   └── index.ts         # Arquivo principal
├── data/                # Banco de dados SQLite (gerado automaticamente)
├── dist/                # Código compilado (gerado automaticamente)
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Banco de Dados

O banco de dados SQLite é criado automaticamente em `backend/data/rpg_ficha.db` com as seguintes tabelas:

- **inventory**: Armazena itens do inventário
- **ficha_items**: Armazena itens da ficha técnica
- **ficha_data**: Armazena dados da ficha (vida, sanidade, armas, etc.)

## 🔌 Endpoints

### Inventário
- `POST /api/inventory` - Salvar inventário
- `GET /api/inventory` - Carregar inventário

### Ficha
- `POST /api/ficha` - Salvar ficha técnica
- `GET /api/ficha` - Carregar ficha técnica

### Todos os Dados
- `POST /api/save-all` - Salvar inventário e ficha
- `GET /api/load-all` - Carregar inventário e ficha

### Health Check
- `GET /api/health` - Verificar se o servidor está funcionando

## 🚦 Uso

1. Instale as dependências: `npm install`
2. Inicie o servidor: `npm run dev`
3. O servidor estará rodando em `http://localhost:3001`

## 🔄 Migração de Dados

Se você já tem dados salvos nos arquivos JSON (`data/inventory.json` e `data/ficha.json`), você pode migrá-los para o banco de dados SQLite executando:

```bash
npm run migrate
```

(Nota: O script de migração ainda precisa ser implementado)

## 📝 Notas

- O banco de dados é criado automaticamente na primeira execução
- Os dados são persistidos em SQLite localmente
- A API é compatível com o frontend existente (mesma URL: `http://localhost:3001/api`)
- O banco de dados fica em `backend/data/rpg_ficha.db`

