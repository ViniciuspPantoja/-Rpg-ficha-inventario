import { Request, Response } from 'express';
import { FichaService } from '../services/ficha.service.js';
import { ApiResponse, FichaData } from '../types/index.js';

const fichaService = new FichaService();

export class FichaController {
  async saveFicha(req: Request, res: Response): Promise<void> {
    try {
      const {
        items,
        currentLife,
        maxLife,
        currentSanity,
        maxSanity,
        primaryWeapon,
        secondaryWeapon,
        weaponMagazine,
        secondaryWeaponMagazine,
      } = req.body as FichaData;

      const fichaData: FichaData = {
        items: items || [],
        currentLife: currentLife ?? 100,
        maxLife: maxLife ?? 100,
        currentSanity: currentSanity ?? 0,
        maxSanity: maxSanity ?? 100,
        primaryWeapon: primaryWeapon || null,
        secondaryWeapon: secondaryWeapon || null,
        weaponMagazine: weaponMagazine || { current: 0, max: 0 },
        secondaryWeaponMagazine: secondaryWeaponMagazine || { current: 0, max: 0 },
      };

      fichaService.saveFicha(fichaData);

      res.json({
        success: true,
        message: 'Ficha técnica salva com sucesso!',
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao salvar ficha técnica:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao salvar ficha técnica',
      } as ApiResponse);
    }
  }

  async loadFicha(req: Request, res: Response): Promise<void> {
    try {
      const ficha = fichaService.loadFicha();

      res.json({
        success: true,
        ...ficha,
      } as ApiResponse<FichaData>);
    } catch (error) {
      console.error('Erro ao carregar ficha técnica:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao carregar ficha técnica',
      } as ApiResponse);
    }
  }
}

