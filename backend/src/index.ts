import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initializeDatabase();

// Rotas
app.use('/api', routes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Banco de dados SQLite inicializado`);
  console.log(`📁 Dados salvos em: backend/data/rpg_ficha.db`);
  console.log(`\n📡 Endpoints disponíveis:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/inventory`);
  console.log(`   POST /api/inventory`);
  console.log(`   GET  /api/ficha`);
  console.log(`   POST /api/ficha`);
  console.log(`   GET  /api/load-all`);
  console.log(`   POST /api/save-all`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  process.exit(0);
});

