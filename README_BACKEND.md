# Backend - Sistema de Persistência

Este projeto agora possui um backend em Node.js/Express para salvar e carregar os dados do inventário e da ficha técnica.

## Instalação

1. Instale as dependências:
```bash
npm install
```

## Como Usar

### Opção 1: Rodar Backend e Frontend Separadamente

1. **Iniciar o backend:**
```bash
npm run server
```

2. **Em outro terminal, iniciar o frontend:**
```bash
npm run dev
```

### Opção 2: Rodar Ambos Simultaneamente

```bash
npm run dev:full
```

Isso iniciará o backend na porta 3001 e o frontend na porta padrão do Vite.

## Endpoints da API

### Inventário
- `POST /api/inventory` - Salvar inventário
- `GET /api/inventory` - Carregar inventário

### Ficha Técnica
- `POST /api/ficha` - Salvar ficha técnica
- `GET /api/ficha` - Carregar ficha técnica

### Todos os Dados
- `POST /api/save-all` - Salvar inventário e ficha técnica
- `GET /api/load-all` - Carregar inventário e ficha técnica

### Health Check
- `GET /api/health` - Verificar se o servidor está funcionando

## Armazenamento

Os dados são salvos em arquivos JSON na pasta `data/`:
- `data/inventory.json` - Dados do inventário
- `data/ficha.json` - Dados da ficha técnica

## Notas

- Os dados são carregados automaticamente ao iniciar a aplicação
- Use os botões "Salvar Tudo" e "Carregar Tudo" no header para gerenciar os dados manualmente
- Certifique-se de que o backend está rodando antes de usar as funcionalidades de salvar/carregar

