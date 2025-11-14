export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: 'geral' | 'armas' | 'municoes' | 'carregadores' | 'armaduras' | 'consumiveis' | 'dinheiro' | 'magicos';
  weaponType?: string;
  ammunitionType?: string;
  magazineCapacity?: string;
  linkedAmmunitions?: string[];
  linkedMagazine?: string;
  linkedWeapon?: string;
  loadedQuantity?: number;
  instances?: MagazineInstance[];
  moedas?: Currency[];
  debito?: number;
  credito?: number;
  dinheiroEspecie?: number;
}

export interface MagazineInstance {
  instanceId: string;
  isLoaded: boolean;
  currentAmmo: number;
}

export interface Currency {
  id: string;
  tipo: string;
  simbolo: string;
  debito: number;
  credito: number;
  dinheiroEspecie: number;
}

export interface FichaItem {
  id: string;
  type: string;
  key: string;
  value: string;
}

export interface WeaponMagazine {
  current: number;
  max: number;
}

export interface FichaData {
  items: FichaItem[];
  currentLife: number;
  maxLife: number;
  currentSanity: number;
  maxSanity: number;
  primaryWeapon: InventoryItem | null;
  secondaryWeapon: InventoryItem | null;
  weaponMagazine: WeaponMagazine;
  secondaryWeaponMagazine: WeaponMagazine;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

