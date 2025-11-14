import { db } from '../config/database.js';
import { InventoryItem, MagazineInstance, Currency } from '../types/index.js';

export class InventoryService {
  // Salvar inventário completo (substitui tudo)
  saveInventory(inventory: InventoryItem[]): void {
    const deleteStmt = db.prepare('DELETE FROM inventory');
    const insertStmt = db.prepare(`
      INSERT INTO inventory (
        id, name, quantity, category, weaponType, ammunitionType,
        magazineCapacity, linkedAmmunitions, linkedMagazine, linkedWeapon,
        loadedQuantity, instances, moedas, debito, credito, dinheiroEspecie, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const transaction = db.transaction((items: InventoryItem[]) => {
      deleteStmt.run();
      for (const item of items) {
        insertStmt.run(
          item.id,
          item.name,
          item.quantity,
          item.category,
          item.weaponType || null,
          item.ammunitionType || null,
          item.magazineCapacity || null,
          item.linkedAmmunitions ? JSON.stringify(item.linkedAmmunitions) : null,
          item.linkedMagazine || null,
          item.linkedWeapon || null,
          item.loadedQuantity || 0,
          item.instances ? JSON.stringify(item.instances) : null,
          item.moedas ? JSON.stringify(item.moedas) : null,
          item.debito || 0,
          item.credito || 0,
          item.dinheiroEspecie || 0
        );
      }
    });

    transaction(inventory);
  }

  // Carregar inventário completo
  loadInventory(): InventoryItem[] {
    const stmt = db.prepare('SELECT * FROM inventory ORDER BY createdAt');
    const rows = stmt.all() as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      quantity: row.quantity,
      category: row.category as InventoryItem['category'],
      weaponType: row.weaponType || undefined,
      ammunitionType: row.ammunitionType || undefined,
      magazineCapacity: row.magazineCapacity || undefined,
      linkedAmmunitions: row.linkedAmmunitions ? JSON.parse(row.linkedAmmunitions) : undefined,
      linkedMagazine: row.linkedMagazine || undefined,
      linkedWeapon: row.linkedWeapon || undefined,
      loadedQuantity: row.loadedQuantity || undefined,
      instances: row.instances ? JSON.parse(row.instances) as MagazineInstance[] : undefined,
      moedas: row.moedas ? JSON.parse(row.moedas) as Currency[] : undefined,
      debito: row.debito || undefined,
      credito: row.credito || undefined,
      dinheiroEspecie: row.dinheiroEspecie || undefined,
    }));
  }
}

