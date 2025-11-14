import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller.js';
import { FichaController } from '../controllers/ficha.controller.js';
import { SaveAllController } from '../controllers/save-all.controller.js';

const router = Router();
const inventoryController = new InventoryController();
const fichaController = new FichaController();
const saveAllController = new SaveAllController();

// Rotas de inventário
router.post('/inventory', (req, res) => inventoryController.saveInventory(req, res));
router.get('/inventory', (req, res) => inventoryController.loadInventory(req, res));

// Rotas de ficha
router.post('/ficha', (req, res) => fichaController.saveFicha(req, res));
router.get('/ficha', (req, res) => fichaController.loadFicha(req, res));

// Rotas para salvar/carregar tudo
router.post('/save-all', (req, res) => saveAllController.saveAll(req, res));
router.get('/load-all', (req, res) => saveAllController.loadAll(req, res));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Servidor está funcionando!' });
});

export default router;

