import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';
import { FichaService } from '../services/ficha.service.js';
import { ApiResponse, InventoryItem, FichaData } from '../types/index.js';

const inventoryService = new InventoryService();
const fichaService = new FichaService();

export class SaveAllController {
  async saveAll(req: Request, res: Response): Promise<void> {
    try {
      const { inventory, ficha } = req.body as {
        inventory?: InventoryItem[];
        ficha?: FichaData;
      };

      if (inventory !== undefined) {
        inventoryService.saveInventory(inventory);
      }

      if (ficha !== undefined) {
        fichaService.saveFicha(ficha);
      }

      res.json({
        success: true,
        message: 'Todos os dados foram salvos com sucesso!',
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar dados',
      } as ApiResponse);
    }
  }

  async loadAll(req: Request, res: Response): Promise<void> {
    try {
      const inventory = inventoryService.loadInventory();
      const ficha = fichaService.loadFicha();

      res.json({
        success: true,
        inventory,
        ficha,
      } as ApiResponse<{ inventory: InventoryItem[]; ficha: FichaData }>);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao carregar dados',
      } as ApiResponse);
    }
  }
}

