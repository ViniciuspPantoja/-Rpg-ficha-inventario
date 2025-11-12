# 📝 Gerenciador de Atributos

Uma aplicação React moderna com interface intuitiva para gerenciar pares de atributo-valor, com funcionalidade de drag and drop para reordenação.

## ✨ Características

- ✅ Formulário para adicionar dados tipo-atributo-valor
  - **Tipo**: Campo texto para categorização
  - **Atributo**: Campo texto para identificação
  - **Valor**: Campo texto para valor/descrição
- ✅ Sistema de Vida/HP integrado
  - Barra de vida visual com mudança de cor
  - Controles de vida atual e máxima
  - Botões rápidos: +10, -10 e Restaurar
- ✅ Grid layout responsivo com três colunas:
  - **Coluna 1**: Formulário de cadastro
  - **Coluna 2**: Sistema de abas com 3 visualizações
  - **Coluna 3**: Painel de resultados agrupados por tipo
- ✅ Sistema de abas com 3 visualizações diferentes:
  - 📋 **Lista**: Visualização em cards com drag and drop para reordenar
  - 📊 **Tabela**: Visualização em formato tabular completo
  - 📈 **Resumo**: Estatísticas e métricas dos dados
- ✅ Painel de Resultados agrupados por tipo:
  - Itens organizados em grids separadas por tipo
  - Contador de itens por grupo
  - Estatísticas gerais (total e tipos diferentes)
- ✅ Drag and drop para reordenar itens (na aba Lista)
- ✅ Interface moderna e intuitiva
- ✅ Design clean com cores suaves
- ✅ Animações suaves e transições
- ✅ Layout responsivo (3 colunas → 2 colunas → 1 coluna)

## 🚀 Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool rápido e moderno
- **@dnd-kit** - Biblioteca moderna de drag and drop
- **CSS3** - Estilização com gradientes e animações

## 📋 Pré-requisitos

- Node.js 20.19.5 (recomendado - ver arquivo `.nvmrc`)
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. (Opcional) Se você usa nvm, configure a versão correta do Node:
```bash
nvm use
```

## 🎮 Como Usar

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra o navegador em `http://localhost:5173`

3. Use o formulário na primeira coluna para adicionar dados:
   - **Tipo**: Ex: "Habilidade", "Equipamento", "Característica"
   - **Atributo**: Ex: "Força", "Espada", "Altura"
   - **Valor**: Ex: "15", "Lendária", "1.80m"

4. Navegue pelas abas na coluna central para ver diferentes visualizações

5. Acompanhe os resultados agrupados por tipo na coluna à direita

6. Arraste e solte os itens na aba "Lista" para reordená-los

7. Clique no ícone de lixeira para remover itens

## 🏗️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Executa o linter

## 📁 Estrutura do Projeto

```
gerenciador_ficha/
├── src/
│   ├── components/
│   │   ├── SortableItem.jsx     # Componente de item arrastável
│   │   ├── SortableItem.css     # Estilos do item
│   │   ├── Tabs.jsx             # Componente de sistema de abas
│   │   └── Tabs.css             # Estilos das abas
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos principais
│   ├── index.css                # Estilos globais
│   └── main.jsx                 # Ponto de entrada
├── .nvmrc                       # Versão do Node.js
├── package.json
└── README.md
```

## 🎨 Funcionalidades

### Adicionar Itens
- Preencha os três campos obrigatórios:
  - **Tipo**: Categoria do item
  - **Atributo**: Nome/identificação
  - **Valor**: Valor ou descrição
- Clique em "Adicionar Item"
- O item aparecerá nas visualizações e será agrupado por tipo

### Navegar entre Visualizações
A coluna central possui 3 abas:

1. **📋 Lista**: 
   - Visualização em cards estilizados
   - Mostra Tipo, Atributo e Valor
   - Arraste e solte para reordenar (clique e segure no ícone ⋮⋮)
   - Remover itens clicando na lixeira

2. **📊 Tabela**:
   - Visualização tabular completa
   - Colunas: # | Tipo | Atributo | Valor | Ações
   - Ordem sequencial numerada
   - Remover itens pela coluna "Ações"

3. **📈 Resumo**:
   - Total de itens cadastrados
   - Quantidade de tipos diferentes
   - Quantidade de atributos únicos

### Reordenar Itens (Aba Lista)
- Clique e segure no ícone de arrastar (⋮⋮)
- Arraste o item para a posição desejada
- Solte para fixar na nova posição

### Remover Itens
- Clique no ícone da lixeira (🗑️) do item que deseja remover
- Disponível nas abas Lista e Tabela

### Painel de Resultados (Agrupado por Tipo)
O painel à direita mostra os dados organizados:
- **Grupos por Tipo**: Cada tipo tem sua própria grid
- **Contador por Grupo**: Mostra quantos itens existem em cada tipo
- **Itens do Grupo**: Lista de atributo → valor
- **Estatísticas Gerais**: Total de itens e tipos diferentes
- **Atualização em Tempo Real**: Atualiza automaticamente ao adicionar/remover

### Sistema de Vida/HP
Localizado na primeira coluna, abaixo do formulário:
- **Barra Visual de Vida**: 
  - Verde quando > 50%
  - Laranja quando entre 25% - 50%
  - Vermelho quando < 25%
- **Controles Manuais**:
  - Ajustar vida atual (0 até vida máxima)
  - Ajustar vida máxima (mínimo 1)
- **Botões Rápidos**:
  - ❤️ **+10**: Cura 10 pontos
  - 💔 **-10**: Causa 10 de dano
  - ✨ **Restaurar**: Restaura vida ao máximo

## 💡 Dicas

- **Layout Responsivo**: 
  - Desktop (> 1400px): 3 colunas (Formulário | Abas | Resultados)
  - Tablet (1400px - 968px): 2 colunas
  - Mobile (< 968px): 1 coluna
- **Exemplos de Uso**:
  - RPG: Tipo="Habilidade", Atributo="Força", Valor="18"
  - Inventário: Tipo="Arma", Atributo="Espada Longa", Valor="50 de dano"
  - Personagem: Tipo="Característica", Atributo="Altura", Valor="1.85m"
- Os dados não são persistidos - ao recarregar a página, os itens serão perdidos
- Para adicionar persistência, você pode integrar com localStorage ou uma API
- O painel de resultados agrupa automaticamente por tipo
- Todos os campos aceitam texto livre, permitindo máxima flexibilidade
- O sistema de vida é útil para RPGs, jogos e gerenciamento de personagens
- A barra de vida muda de cor automaticamente baseada no percentual

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.