import { db } from '../config/database.js';
import { FichaItem, FichaData, InventoryItem, WeaponMagazine } from '../types/index.js';

export class FichaService {
  // Salvar itens da ficha
  saveItems(items: FichaItem[]): void {
    const deleteStmt = db.prepare('DELETE FROM ficha_items');
    const insertStmt = db.prepare(`
      INSERT INTO ficha_items (id, type, key, value, updatedAt)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    const transaction = db.transaction((items: FichaItem[]) => {
      deleteStmt.run();
      for (const item of items) {
        insertStmt.run(item.id, item.type, item.key, item.value);
      }
    });

    transaction(items);
  }

  // Carregar itens da ficha
  loadItems(): FichaItem[] {
    const stmt = db.prepare('SELECT * FROM ficha_items ORDER BY createdAt');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      id: row.id,
      type: row.type,
      key: row.key,
      value: row.value,
    }));
  }

  // Salvar dados da ficha
  saveFichaData(data: Omit<FichaData, 'items' | 'updatedAt'>): void {
    const stmt = db.prepare(`
      UPDATE ficha_data SET
        currentLife = ?,
        maxLife = ?,
        currentSanity = ?,
        maxSanity = ?,
        primaryWeapon = ?,
        secondaryWeapon = ?,
        weaponMagazine = ?,
        secondaryWeaponMagazine = ?,
        updatedAt = datetime('now')
      WHERE id = 1
    `);

    stmt.run(
      data.currentLife,
      data.maxLife,
      data.currentSanity,
      data.maxSanity,
      data.primaryWeapon ? JSON.stringify(data.primaryWeapon) : null,
      data.secondaryWeapon ? JSON.stringify(data.secondaryWeapon) : null,
      JSON.stringify(data.weaponMagazine),
      JSON.stringify(data.secondaryWeaponMagazine)
    );
  }

  // Carregar dados da ficha
  loadFichaData(): Omit<FichaData, 'items'> {
    const stmt = db.prepare('SELECT * FROM ficha_data WHERE id = 1');
    const row = stmt.get() as any;

    if (!row) {
      return {
        currentLife: 100,
        maxLife: 100,
        currentSanity: 0,
        maxSanity: 100,
        primaryWeapon: null,
        secondaryWeapon: null,
        weaponMagazine: { current: 0, max: 0 },
        secondaryWeaponMagazine: { current: 0, max: 0 },
      };
    }

    return {
      currentLife: row.currentLife,
      maxLife: row.maxLife,
      currentSanity: row.currentSanity,
      maxSanity: row.maxSanity,
      primaryWeapon: row.primaryWeapon ? JSON.parse(row.primaryWeapon) as InventoryItem : null,
      secondaryWeapon: row.secondaryWeapon ? JSON.parse(row.secondaryWeapon) as InventoryItem : null,
      weaponMagazine: JSON.parse(row.weaponMagazine) as WeaponMagazine,
      secondaryWeaponMagazine: JSON.parse(row.secondaryWeaponMagazine) as WeaponMagazine,
      updatedAt: row.updatedAt,
    };
  }

  // Carregar ficha completa (items + data)
  loadFicha(): FichaData {
    const items = this.loadItems();
    const data = this.loadFichaData();
    return {
      ...data,
      items,
    };
  }

  // Salvar ficha completa
  saveFicha(ficha: FichaData): void {
    this.saveItems(ficha.items);
    this.saveFichaData({
      currentLife: ficha.currentLife,
      maxLife: ficha.maxLife,
      currentSanity: ficha.currentSanity,
      maxSanity: ficha.maxSanity,
      primaryWeapon: ficha.primaryWeapon,
      secondaryWeapon: ficha.secondaryWeapon,
      weaponMagazine: ficha.weaponMagazine,
      secondaryWeaponMagazine: ficha.secondaryWeaponMagazine,
    });
  }
}

