import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Diretório para armazenar os dados
const DATA_DIR = path.join(__dirname, 'data');

// Garantir que o diretório existe
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Inicializar diretório ao iniciar o servidor
ensureDataDir();

// Endpoint para salvar dados do inventário
app.post('/api/inventory', async (req, res) => {
  try {
    const { inventory: newInventory } = req.body;
    const filePath = path.join(DATA_DIR, 'inventory.json');
    
    // Tenta carregar o inventário existente
    let existingInventory = [];
    try {
      const existingData = await fs.readFile(filePath, 'utf-8');
      existingInventory = JSON.parse(existingData);
    } catch {
      // Arquivo não existe, usa array vazio
      existingInventory = [];
    }
    
    // Faz merge inteligente baseado em IDs
    // Se o item existe no novo inventário, atualiza. Se não existe, mantém o existente.
    const inventoryMap = new Map();
    
    // Primeiro, adiciona todos os itens existentes ao mapa
    existingInventory.forEach(item => {
      if (item.id) {
        inventoryMap.set(item.id, item);
      }
    });
    
    // Depois, atualiza ou adiciona os itens do novo inventário
    if (Array.isArray(newInventory)) {
      newInventory.forEach(item => {
        if (item.id) {
          inventoryMap.set(item.id, item);
        }
      });
    }
    
    // Converte o mapa de volta para array
    const mergedInventory = Array.from(inventoryMap.values());
    
    // Salva o inventário mesclado
    await fs.writeFile(filePath, JSON.stringify(mergedInventory, null, 2));
    res.json({ success: true, message: 'Inventário salvo com sucesso!', inventory: mergedInventory });
  } catch (error) {
    console.error('Erro ao salvar inventário:', error);
    res.status(500).json({ success: false, error: 'Erro ao salvar inventário' });
  }
});

// Endpoint para carregar dados do inventário
app.get('/api/inventory', async (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, 'inventory.json');
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const inventory = JSON.parse(data);
      res.json({ success: true, inventory });
    } catch {
      // Se o arquivo não existir, retorna array vazio
      res.json({ success: true, inventory: [] });
    }
  } catch (error) {
    console.error('Erro ao carregar inventário:', error);
    res.status(500).json({ success: false, error: 'Erro ao carregar inventário' });
  }
});

// Endpoint para salvar dados da ficha técnica
app.post('/api/ficha', async (req, res) => {
  try {
    const { items, currentLife, maxLife, currentSanity, maxSanity, primaryWeapon, secondaryWeapon, weaponMagazine, secondaryWeaponMagazine } = req.body;
    const fichaData = {
      items,
      currentLife,
      maxLife,
      currentSanity,
      maxSanity,
      primaryWeapon,
      secondaryWeapon,
      weaponMagazine,
      secondaryWeaponMagazine,
      updatedAt: new Date().toISOString()
    };
    const filePath = path.join(DATA_DIR, 'ficha.json');
    await fs.writeFile(filePath, JSON.stringify(fichaData, null, 2));
    res.json({ success: true, message: 'Ficha técnica salva com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar ficha técnica:', error);
    res.status(500).json({ success: false, error: 'Erro ao salvar ficha técnica' });
  }
});

// Endpoint para carregar dados da ficha técnica
app.get('/api/ficha', async (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, 'ficha.json');
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const fichaData = JSON.parse(data);
      res.json({ success: true, ...fichaData });
    } catch {
      // Se o arquivo não existir, retorna valores padrão
      res.json({
        success: true,
        items: [],
        currentLife: 100,
        maxLife: 100,
        currentSanity: 100,
        maxSanity: 100,
        primaryWeapon: null,
        secondaryWeapon: null,
        weaponMagazine: { current: 0, max: 0 },
        secondaryWeaponMagazine: { current: 0, max: 0 }
      });
    }
  } catch (error) {
    console.error('Erro ao carregar ficha técnica:', error);
    res.status(500).json({ success: false, error: 'Erro ao carregar ficha técnica' });
  }
});

// Endpoint para salvar todos os dados de uma vez
app.post('/api/save-all', async (req, res) => {
  try {
    const { inventory: newInventory, ficha } = req.body;
    
    // Salvar inventário com merge
    if (newInventory !== undefined) {
      const inventoryPath = path.join(DATA_DIR, 'inventory.json');
      
      // Tenta carregar o inventário existente
      let existingInventory = [];
      try {
        const existingData = await fs.readFile(inventoryPath, 'utf-8');
        existingInventory = JSON.parse(existingData);
      } catch {
        // Arquivo não existe, usa array vazio
        existingInventory = [];
      }
      
      // Faz merge inteligente baseado em IDs
      const inventoryMap = new Map();
      
      // Primeiro, adiciona todos os itens existentes ao mapa
      existingInventory.forEach(item => {
        if (item.id) {
          inventoryMap.set(item.id, item);
        }
      });
      
      // Depois, atualiza ou adiciona os itens do novo inventário
      if (Array.isArray(newInventory)) {
        newInventory.forEach(item => {
          if (item.id) {
            inventoryMap.set(item.id, item);
          }
        });
      }
      
      // Converte o mapa de volta para array
      const mergedInventory = Array.from(inventoryMap.values());
      
      // Salva o inventário mesclado
      await fs.writeFile(inventoryPath, JSON.stringify(mergedInventory, null, 2));
    }
    
    // Salvar ficha
    if (ficha !== undefined) {
      const fichaData = {
        ...ficha,
        updatedAt: new Date().toISOString()
      };
      const fichaPath = path.join(DATA_DIR, 'ficha.json');
      await fs.writeFile(fichaPath, JSON.stringify(fichaData, null, 2));
    }
    
    res.json({ success: true, message: 'Todos os dados foram salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({ success: false, error: 'Erro ao salvar dados' });
  }
});

// Endpoint para carregar todos os dados de uma vez
app.get('/api/load-all', async (req, res) => {
  try {
    let inventory = [];
    let ficha = {
      items: [],
      currentLife: 100,
      maxLife: 100,
      currentSanity: 100,
      maxSanity: 100,
      primaryWeapon: null,
      secondaryWeapon: null,
      weaponMagazine: { current: 0, max: 0 },
      secondaryWeaponMagazine: { current: 0, max: 0 }
    };
    
    // Carregar inventário
    try {
      const inventoryPath = path.join(DATA_DIR, 'inventory.json');
      const inventoryData = await fs.readFile(inventoryPath, 'utf-8');
      inventory = JSON.parse(inventoryData);
    } catch {
      // Arquivo não existe, usar array vazio
    }
    
    // Carregar ficha
    try {
      const fichaPath = path.join(DATA_DIR, 'ficha.json');
      const fichaData = await fs.readFile(fichaPath, 'utf-8');
      ficha = JSON.parse(fichaData);
    } catch {
      // Arquivo não existe, usar valores padrão
    }
    
    res.json({ success: true, inventory, ficha });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    res.status(500).json({ success: false, error: 'Erro ao carregar dados' });
  }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Servidor está funcionando!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📁 Dados salvos em: ${DATA_DIR}`);
});

