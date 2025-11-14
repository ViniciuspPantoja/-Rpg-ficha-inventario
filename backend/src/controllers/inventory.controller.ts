import { Request, Response } from 'express';
import { InventoryService } from '../services/inventory.service.js';
import { ApiResponse, InventoryItem } from '../types/index.js';

const inventoryService = new InventoryService();

export class InventoryController {
  async saveInventory(req: Request, res: Response): Promise<void> {
    try {
      const { inventory } = req.body as { inventory: InventoryItem[] };

      if (!Array.isArray(inventory)) {
        res.status(400).json({
          success: false,
          error: 'Inventário deve ser um array',
        } as ApiResponse);
        return;
      }

      inventoryService.saveInventory(inventory);

      res.json({
        success: true,
        message: 'Inventário salvo com sucesso!',
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao salvar inventário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar inventário',
      } as ApiResponse);
    }
  }

  async loadInventory(req: Request, res: Response): Promise<void> {
    try {
      const inventory = inventoryService.loadInventory();

      res.json({
        success: true,
        inventory,
      } as ApiResponse<{ inventory: InventoryItem[] }>);
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao carregar inventário',
      } as ApiResponse);
    }
  }
}

