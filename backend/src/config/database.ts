import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../data', 'rpg_ficha.db');

// Garantir que o diretório existe
import fs from 'fs';
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(DB_PATH);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas
export function initializeDatabase() {
  // Tabela de inventário
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      category TEXT NOT NULL,
      weaponType TEXT,
      ammunitionType TEXT,
      magazineCapacity TEXT,
      linkedAmmunitions TEXT,
      linkedMagazine TEXT,
      linkedWeapon TEXT,
      loadedQuantity INTEGER DEFAULT 0,
      instances TEXT,
      moedas TEXT,
      debito REAL DEFAULT 0,
      credito REAL DEFAULT 0,
      dinheiroEspecie REAL DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tabela de itens da ficha
  db.exec(`
    CREATE TABLE IF NOT EXISTS ficha_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Tabela de dados da ficha
  db.exec(`
    CREATE TABLE IF NOT EXISTS ficha_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      currentLife INTEGER DEFAULT 100,
      maxLife INTEGER DEFAULT 100,
      currentSanity INTEGER DEFAULT 0,
      maxSanity INTEGER DEFAULT 100,
      primaryWeapon TEXT,
      secondaryWeapon TEXT,
      weaponMagazine TEXT,
      secondaryWeaponMagazine TEXT,
      updatedAt TEXT DEFAULT (datetime('now'))
    )
  `);

  // Inserir registro inicial se não existir
  const existingData = db.prepare('SELECT COUNT(*) as count FROM ficha_data').get() as { count: number };
  if (existingData.count === 0) {
    db.prepare(`
      INSERT INTO ficha_data (currentLife, maxLife, currentSanity, maxSanity, weaponMagazine, secondaryWeaponMagazine)
      VALUES (100, 100, 0, 100, '{"current":0,"max":0}', '{"current":0,"max":0}')
    `).run();
  }

  console.log('✅ Banco de dados inicializado com sucesso!');
}

export function closeDatabase() {
  db.close();
}

