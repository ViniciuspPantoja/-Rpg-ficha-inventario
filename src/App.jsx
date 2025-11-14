import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './components/SortableItem';
import { Tabs } from './components/Tabs';
import { Alert } from './components/Alert';
import medicalIcon from './assets/medical.png';
import m4Icon from './assets/m4.png';
import clipIcon from './assets/clip.png';
import municaoIcon from './assets/municao.png';
import coleteIcon from './assets/colete.png';
import dinheiroIcon from './assets/dinheiro.png';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('');
  const [attribute, setAttribute] = useState('');
  const [value, setValue] = useState('');
  const [currentLife, setCurrentLife] = useState(100);
  const [maxLife, setMaxLife] = useState(100);
  const [currentSanity, setCurrentSanity] = useState(0);
  const [maxSanity, setMaxSanity] = useState(100);
  const [editingLife, setEditingLife] = useState(false);
  const [editingSanity, setEditingSanity] = useState(false);
  const [editingMaxLife, setEditingMaxLife] = useState(false);
  const [editingMaxSanity, setEditingMaxSanity] = useState(false);
  const [tempLife, setTempLife] = useState('');
  const [tempSanity, setTempSanity] = useState('');
  const [tempMaxLife, setTempMaxLife] = useState('');
  const [tempMaxSanity, setTempMaxSanity] = useState('');
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCategory, setItemCategory] = useState('geral');
  const [weaponType, setWeaponType] = useState('');
  const [ammunitionType, setAmmunitionType] = useState('');
  const [magazineCapacity, setMagazineCapacity] = useState('');
  const [initialAmmo, setInitialAmmo] = useState(0);
  const [debito, setDebito] = useState(0);
  const [credito, setCredito] = useState(0);
  const [dinheiroEspecie, setDinheiroEspecie] = useState(0);
  const [moedas, setMoedas] = useState([{ id: Date.now().toString(), tipo: 'BRL', simbolo: 'R$', debito: 0, credito: 0, dinheiroEspecie: 0 }]);
  
  // Lista de moedas comuns e seus símbolos
  const moedasDisponiveis = [
    { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$' },
    { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$' },
    { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
    { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£' },
    { codigo: 'JPY', nome: 'Iene Japonês', simbolo: '¥' },
    { codigo: 'CNY', nome: 'Yuan Chinês', simbolo: '¥' },
    { codigo: 'ARS', nome: 'Peso Argentino', simbolo: '$' },
    { codigo: 'CLP', nome: 'Peso Chileno', simbolo: '$' },
    { codigo: 'MXN', nome: 'Peso Mexicano', simbolo: '$' },
    { codigo: 'BTC', nome: 'Bitcoin', simbolo: '₿' },
    { codigo: 'ETH', nome: 'Ethereum', simbolo: 'Ξ' },
    { codigo: 'CUSTOM', nome: 'Personalizada', simbolo: '' },
  ];
  const [linkedAmmunitions, setLinkedAmmunitions] = useState([]); // Array de IDs de munições compatíveis
  const [linkedMagazine, setLinkedMagazine] = useState('');
  const [linkedWeapon, setLinkedWeapon] = useState('');
  const [selectedAmmunitionToAdd, setSelectedAmmunitionToAdd] = useState(''); // Para adicionar nova munição
  const [activeStatusTab, setActiveStatusTab] = useState('status');
  const [activeFichaTab, setActiveFichaTab] = useState('form');
  const [editingAmmunitionQuantity, setEditingAmmunitionQuantity] = useState(null); // ID do item sendo editado ou null
  const [tempAmmunitionQuantity, setTempAmmunitionQuantity] = useState('');
  const [editingPrimaryMagazine, setEditingPrimaryMagazine] = useState(false);
  const [editingSecondaryMagazine, setEditingSecondaryMagazine] = useState(false);
  const [tempMagazineValue, setTempMagazineValue] = useState('');
  const [editingMoneyField, setEditingMoneyField] = useState(null); // Formato: `${itemId}-${moedaId}-${tipo}` (debito, credito, especie)
  const [tempMoneyValue, setTempMoneyValue] = useState('');
  const [showItemInfo, setShowItemInfo] = useState(null); // ID do item que está mostrando informações
  const [selectedPrimaryMagazine, setSelectedPrimaryMagazine] = useState('');
  const [selectedSecondaryMagazine, setSelectedSecondaryMagazine] = useState('');
  const [activeInventoryTab, setActiveInventoryTab] = useState('cadastrar');
  const [primaryWeapon, setPrimaryWeapon] = useState(null);
  const [secondaryWeapon, setSecondaryWeapon] = useState(null);
  const [weaponMagazine, setWeaponMagazine] = useState({ current: 0, max: 0 });
  const [secondaryWeaponMagazine, setSecondaryWeaponMagazine] = useState({ current: 0, max: 0 });
  const [currentPrimaryMagazineId, setCurrentPrimaryMagazineId] = useState(null); // ID do carregador atualmente na arma primária
  const [currentSecondaryMagazineId, setCurrentSecondaryMagazineId] = useState(null); // ID do carregador atualmente na arma secundária
  const [currentPrimaryMagazineInfo, setCurrentPrimaryMagazineInfo] = useState(null); // Informações do carregador na arma primária
  const [currentSecondaryMagazineInfo, setCurrentSecondaryMagazineInfo] = useState(null); // Informações do carregador na arma secundária
  const [prevPrimaryMagazine, setPrevPrimaryMagazine] = useState({ current: 0, max: 0 }); // Para detectar mudanças
  const [prevSecondaryMagazine, setPrevSecondaryMagazine] = useState({ current: 0, max: 0 }); // Para detectar mudanças
  const [primaryWeaponEquipped, setPrimaryWeaponEquipped] = useState(false);
  const [secondaryWeaponEquipped, setSecondaryWeaponEquipped] = useState(false);
  const [showPrimaryWeaponList, setShowPrimaryWeaponList] = useState(false);
  const [showSecondaryWeaponList, setShowSecondaryWeaponList] = useState(false);
  const [activeItems, setActiveItems] = useState(new Set());
  const [darkMode, setDarkMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [importedTxtFileName, setImportedTxtFileName] = useState(null); // Nome do arquivo TXT importado
  const [importedTxtContent, setImportedTxtContent] = useState(null); // Conteúdo original do TXT importado
  const [importedTxtFileHandle, setImportedTxtFileHandle] = useState(null); // Handle do arquivo para sobrescrever
  const [alert, setAlert] = useState({ message: null, type: 'info' }); // Estado para controlar o alert

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // URL da API do backend
  const API_URL = 'http://localhost:3001/api';

  // Função helper para mostrar alerts
  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  // Funções para salvar/carregar dados do backend
  const saveInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventory }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert('Inventário salvo com sucesso!', 'success');
      } else {
        showAlert('Erro ao salvar inventário', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar inventário:', error);
      showAlert('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.', 'error');
    }
  };

  const loadInventory = async () => {
    try {
      const response = await fetch(`${API_URL}/inventory`);
      const data = await response.json();
      if (data.success && data.inventory) {
        setInventory(data.inventory);
        showAlert('Inventário carregado com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      showAlert('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.', 'error');
    }
  };

  const saveFicha = async () => {
    try {
      const response = await fetch(`${API_URL}/ficha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          currentLife,
          maxLife,
          currentSanity,
          maxSanity,
          primaryWeapon,
          secondaryWeapon,
          weaponMagazine,
          secondaryWeaponMagazine,
        }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert('Ficha técnica salva com sucesso!', 'success');
      } else {
        showAlert('Erro ao salvar ficha técnica', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar ficha técnica:', error);
      showAlert('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.', 'error');
    }
  };

  const loadFicha = async () => {
    try {
      const response = await fetch(`${API_URL}/ficha`);
      const data = await response.json();
      if (data.success) {
        if (data.items) setItems(data.items);
        if (data.currentLife !== undefined) setCurrentLife(data.currentLife);
        if (data.maxLife !== undefined) setMaxLife(data.maxLife);
        if (data.currentSanity !== undefined) setCurrentSanity(data.currentSanity);
        if (data.maxSanity !== undefined) setMaxSanity(data.maxSanity);
        if (data.primaryWeapon !== undefined) setPrimaryWeapon(data.primaryWeapon);
        if (data.secondaryWeapon !== undefined) setSecondaryWeapon(data.secondaryWeapon);
        if (data.weaponMagazine !== undefined) setWeaponMagazine(data.weaponMagazine);
        if (data.secondaryWeaponMagazine !== undefined) setSecondaryWeaponMagazine(data.secondaryWeaponMagazine);
        showAlert('Ficha técnica carregada com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao carregar ficha técnica:', error);
      showAlert('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.', 'error');
    }
  };

  // Função para gerar o conteúdo TXT a partir dos dados atuais
  const generateTxtContent = () => {
    let txtContent = '';
    
    // Agrupa itens por tipo
    const itemsByType = {};
    items.forEach(item => {
      if (!itemsByType[item.type]) {
        itemsByType[item.type] = [];
      }
      itemsByType[item.type].push(item);
    });
    
    // Adiciona ficha técnica
    txtContent += '=== FICHA TÉCNICA ===\n\n';
    
    // Adiciona vida e sanidade
    txtContent += `VIDA: ${currentLife}/${maxLife}\n`;
    txtContent += `SANIDADE: ${currentSanity}/${maxSanity}\n\n`;
    
    // Adiciona itens agrupados por tipo
    Object.keys(itemsByType).forEach(type => {
      txtContent += `${type}:\n`;
      itemsByType[type].forEach(item => {
        txtContent += `  ((Atributo)${item.key}): ((valor)${item.value})\n`;
      });
      txtContent += '\n';
    });
    
    // Adiciona inventário
    txtContent += '\n=== INVENTÁRIO ===\n\n';
    
    if (inventory.length === 0) {
      txtContent += 'Inventário vazio.\n';
    } else {
      // Agrupa inventário por categoria
      const inventoryByCategory = {};
      inventory.forEach(item => {
        if (!inventoryByCategory[item.category]) {
          inventoryByCategory[item.category] = [];
        }
        inventoryByCategory[item.category].push(item);
      });
      
      Object.keys(inventoryByCategory).forEach(category => {
        txtContent += `${category.toUpperCase()}:\n`;
        inventoryByCategory[category].forEach(item => {
          if (item.category === 'carregadores' && item.instances) {
            // Para carregadores com instâncias, mostra detalhes
            const loadedQty = item.instances.filter(inst => inst.isLoaded && inst.currentAmmo === parseInt(item.magazineCapacity || 30)).length;
            const emptyQty = item.instances.filter(inst => !inst.isLoaded && inst.currentAmmo === 0).length;
            const partialQty = item.instances.filter(inst => inst.currentAmmo > 0 && inst.currentAmmo < parseInt(item.magazineCapacity || 30)).length;
            txtContent += `  ${item.name} (${item.ammunitionType || 'N/A'}): Total=${item.quantity}, Carregados=${loadedQty}, Vazios=${emptyQty}, Parciais=${partialQty}\n`;
          } else if (item.category === 'armas' && item.weaponType === 'fogo') {
            // Para armas de fogo, mostra informações de munição
            const ammoInfo = item.linkedAmmunitions && item.linkedAmmunitions.length > 0 
              ? item.linkedAmmunitions.map(id => {
                  const ammo = inventory.find(i => i.id === id);
                  return ammo ? ammo.name : id;
                }).join(', ')
              : 'Nenhuma';
            txtContent += `  ${item.name} (${item.weaponType}): Munições=${ammoInfo}\n`;
          } else {
            txtContent += `  ${item.name}: Quantidade=${item.quantity}${item.ammunitionType ? `, Tipo=${item.ammunitionType}` : ''}\n`;
          }
        });
        txtContent += '\n';
      });
    }
    
    // Adiciona informações de armas equipadas
    if (primaryWeapon || secondaryWeapon) {
      txtContent += '\n=== ARMAS EQUIPADAS ===\n\n';
      if (primaryWeapon) {
        txtContent += `Arma Primária: ${primaryWeapon.name}\n`;
        if (primaryWeapon.weaponType === 'fogo') {
          txtContent += `  Munição: ${weaponMagazine.current}/${weaponMagazine.max}\n`;
        }
      }
      if (secondaryWeapon) {
        txtContent += `Arma Secundária: ${secondaryWeapon.name}\n`;
        if (secondaryWeapon.weaponType === 'fogo') {
          txtContent += `  Munição: ${secondaryWeaponMagazine.current}/${secondaryWeaponMagazine.max}\n`;
        }
      }
    }
    
    return txtContent;
  };

  // Função para salvar/sobrescrever o arquivo TXT
  const saveTxtFile = async (content, filename) => {
    // Tenta usar File System Access API para salvar diretamente no arquivo original
    if ('showSaveFilePicker' in window && importedTxtFileName) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Arquivos de texto',
            accept: { 'text/plain': ['.txt'] }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return true;
      } catch (error) {
        // Se o usuário cancelar ou houver erro, usa download padrão
        if (error.name !== 'AbortError') {
          console.log('Erro ao salvar com File System Access API, usando download padrão:', error);
        } else {
          // Usuário cancelou
          return false;
        }
      }
    }
    
    // Fallback: download padrão (o navegador perguntará se quer sobrescrever)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  };

  // Função para importar todos os dados de um arquivo TXT
  const importFromTxt = async () => {
    try {
      // Verifica se o navegador suporta File System Access API
      if (!('showOpenFilePicker' in window)) {
        // Fallback: usa input file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            parseFullTxtFile(event.target.result);
          };
          reader.readAsText(file);
        };
        input.click();
        return;
      }

      // Usa File System Access API
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'Arquivos de texto',
          accept: { 'text/plain': ['.txt'] }
        }]
      });

      const file = await fileHandle.getFile();
      const text = await file.text();
      parseFullTxtFile(text);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao importar TXT:', error);
        showAlert('Erro ao importar arquivo TXT.', 'warning');
      }
    }
  };

  // Função para parsear o arquivo TXT completo
  const parseFullTxtFile = (text) => {
    const lines = text.split('\n');
    let currentSection = '';
    let currentType = '';
    const newItems = [];
    const newInventory = [];
    let parsedLife = null;
    let parsedSanity = null;
    let parsedPrimaryWeapon = null;
    let parsedSecondaryWeapon = null;
    let parsedPrimaryMagazine = null;
    let parsedSecondaryMagazine = null;

    // Processa cada linha
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Detecta seções principais
      if (line.includes('=== FICHA TÉCNICA ===')) {
        currentSection = 'ficha';
        continue;
      } else if (line.includes('=== INVENTÁRIO ===')) {
        currentSection = 'inventory';
        continue;
      } else if (line.includes('=== ARMAS EQUIPADAS ===')) {
        currentSection = 'weapons';
        continue;
      } else if (line.includes('SALVAMENTO:')) {
        // Ignora separadores de salvamento
        continue;
      } else if (line.match(/^=+$/)) {
        // Ignora linhas de separador
        continue;
      }

      // Processa FICHA TÉCNICA
      if (currentSection === 'ficha') {
        // Vida
        const lifeMatch = line.match(/^VIDA:\s*(\d+)\/(\d+)$/i);
        if (lifeMatch) {
          parsedLife = {
            current: parseInt(lifeMatch[1]) || 0,
            max: parseInt(lifeMatch[2]) || 100
          };
          continue;
        }

        // Sanidade
        const sanityMatch = line.match(/^SANIDADE:\s*(\d+)\/(\d+)$/i);
        if (sanityMatch) {
          parsedSanity = {
            current: parseInt(sanityMatch[1]) || 0,
            max: parseInt(sanityMatch[2]) || 100
          };
          continue;
        }

        // Tipo (FÍSICO:, MENTAL:, etc.)
        const typeMatch = line.match(/^([A-ZÁÊÇ]+):$/);
        if (typeMatch) {
          currentType = typeMatch[1].trim();
          continue;
        }

        // Atributo no formato: ((Atributo)nome): ((valor)valor)
        const attrMatch = line.match(/\(\(Atributo\)([^)]+)\):\s*\(\(valor\)(.+)\)/);
        if (attrMatch) {
          newItems.push({
            id: Date.now().toString() + Math.random() + i,
            type: currentType || 'FÍSICO',
            key: attrMatch[1].trim(),
            value: attrMatch[2].trim()
          });
          continue;
        }
      }

      // Processa INVENTÁRIO
      if (currentSection === 'inventory') {
        // Ignora "Inventário vazio"
        if (line.includes('Inventário vazio')) continue;

        // Categoria (GERAL:, ARMAS:, etc.)
        const categoryMatch = line.match(/^([A-Z_]+):$/);
        if (categoryMatch) {
          currentType = categoryMatch[1].toLowerCase();
          continue;
        }

        // Item do inventário
        // Formato: nome: Quantidade=X, Tipo=Y
        // ou: nome (tipo): Total=X, Carregados=Y, Vazios=Z, Parciais=W
        // ou: nome (tipo): Munições=lista
        const itemMatch = line.match(/^\s*(.+?):\s*(.+)$/);
        if (itemMatch) {
          const itemName = itemMatch[1].trim();
          const itemData = itemMatch[2].trim();

          // Tenta extrair informações do item
          const quantityMatch = itemData.match(/Quantidade[=:](\d+)/i) || itemData.match(/Total[=:](\d+)/i);
          const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;

          // Extrai tipo de munição se houver
          const typeMatch = itemName.match(/^(.+?)\s*\(([^)]+)\)$/);
          const cleanName = typeMatch ? typeMatch[1].trim() : itemName;
          const ammoType = typeMatch ? typeMatch[2].trim() : null;

          // Para carregadores, extrai detalhes
          if (currentType === 'carregadores') {
            const loadedMatch = itemData.match(/Carregados[=:](\d+)/i);
            const emptyMatch = itemData.match(/Vazios[=:](\d+)/i);
            const partialMatch = itemData.match(/Parciais[=:](\d+)/i);
            const capacityMatch = itemData.match(/Capacidade[=:](\d+)/i) || itemData.match(/(\d+)\s*munições/i);

            const instances = [];
            const loadedQty = loadedMatch ? parseInt(loadedMatch[1]) : 0;
            const emptyQty = emptyMatch ? parseInt(emptyMatch[1]) : 0;
            const partialQty = partialMatch ? parseInt(partialMatch[1]) : 0;
            const capacity = capacityMatch ? parseInt(capacityMatch[1]) : 30;

            // Cria instâncias carregadas
            for (let j = 0; j < loadedQty; j++) {
              instances.push({
                instanceId: `${Date.now()}_${j}_${Math.random()}`,
                isLoaded: true,
                currentAmmo: capacity
              });
            }

            // Cria instâncias vazias
            for (let j = 0; j < emptyQty; j++) {
              instances.push({
                instanceId: `${Date.now()}_${j + loadedQty}_${Math.random()}`,
                isLoaded: false,
                currentAmmo: 0
              });
            }

            // Cria instâncias parciais (assume metade da capacidade)
            for (let j = 0; j < partialQty; j++) {
              instances.push({
                instanceId: `${Date.now()}_${j + loadedQty + emptyQty}_${Math.random()}`,
                isLoaded: false,
                currentAmmo: Math.floor(capacity / 2)
              });
            }

            newInventory.push({
              id: Date.now().toString() + Math.random() + i,
              name: cleanName,
              category: 'carregadores',
              quantity: quantity,
              ammunitionType: ammoType || 'normal',
              magazineCapacity: capacity.toString(),
              instances: instances
            });
          } else {
            // Outros itens
            const typeFromData = itemData.match(/Tipo[=:]([^,]+)/i);
            const finalAmmoType = ammoType || (typeFromData ? typeFromData[1].trim() : null);

            newInventory.push({
              id: Date.now().toString() + Math.random() + i,
              name: cleanName,
              category: currentType || 'geral',
              quantity: quantity,
              ...(finalAmmoType && { ammunitionType: finalAmmoType })
            });
          }
          continue;
        }
      }

      // Processa ARMAS EQUIPADAS
      if (currentSection === 'weapons') {
        const primaryMatch = line.match(/^Arma Primária:\s*(.+)$/i);
        if (primaryMatch) {
          parsedPrimaryWeapon = primaryMatch[1].trim();
          continue;
        }

        const secondaryMatch = line.match(/^Arma Secundária:\s*(.+)$/i);
        if (secondaryMatch) {
          parsedSecondaryWeapon = secondaryMatch[1].trim();
          continue;
        }

        const primaryAmmoMatch = line.match(/^\s*Munição:\s*(\d+)\/(\d+)$/i);
        if (primaryAmmoMatch && parsedPrimaryWeapon) {
          parsedPrimaryMagazine = {
            current: parseInt(primaryAmmoMatch[1]) || 0,
            max: parseInt(primaryAmmoMatch[2]) || 0
          };
          continue;
        }

        const secondaryAmmoMatch = line.match(/^\s*Munição:\s*(\d+)\/(\d+)$/i);
        if (secondaryAmmoMatch && parsedSecondaryWeapon) {
          parsedSecondaryMagazine = {
            current: parseInt(secondaryAmmoMatch[1]) || 0,
            max: parseInt(secondaryAmmoMatch[2]) || 0
          };
          continue;
        }
      }
    }

    // Aplica os dados importados
    if (newItems.length > 0) {
      setItems(newItems);
    }
    if (newInventory.length > 0) {
      setInventory(newInventory);
    }
    if (parsedLife) {
      setCurrentLife(parsedLife.current);
      setMaxLife(parsedLife.max);
    }
    if (parsedSanity) {
      setCurrentSanity(parsedSanity.current);
      setMaxSanity(parsedSanity.max);
    }
    if (parsedPrimaryWeapon && newInventory.length > 0) {
      const weapon = newInventory.find(item => item.name === parsedPrimaryWeapon && item.category === 'armas');
      if (weapon) {
        setPrimaryWeapon(weapon);
        if (parsedPrimaryMagazine) {
          setWeaponMagazine(parsedPrimaryMagazine);
        }
      }
    }
    if (parsedSecondaryWeapon && newInventory.length > 0) {
      const weapon = newInventory.find(item => item.name === parsedSecondaryWeapon && item.category === 'armas');
      if (weapon) {
        setSecondaryWeapon(weapon);
        if (parsedSecondaryMagazine) {
          setSecondaryWeaponMagazine(parsedSecondaryMagazine);
        }
      }
    }

    showAlert(`Importação concluída!\n- ${newItems.length} atributos\n- ${newInventory.length} itens do inventário`, 'success');
  };

  // Função para salvar em TXT com append (adiciona ao final do arquivo se existir)
  const saveToTxtWithAppend = async () => {
    try {
      // Verifica se o navegador suporta File System Access API
      if (!('showSaveFilePicker' in window)) {
        showAlert('Seu navegador não suporta a seleção de arquivos. Use Chrome, Edge ou outro navegador compatível.', 'warning');
        return;
      }

      // Permite ao usuário escolher ou criar um arquivo
      let fileHandle;
      try {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: 'ficha-rpg.txt',
          types: [{
            description: 'Arquivos de texto',
            accept: { 'text/plain': ['.txt'] }
          }]
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          // Usuário cancelou
          return;
        }
        throw error;
      }

      // Gera o conteúdo atual
      const newContent = generateTxtContent();
      
      // Adiciona separador com data/hora se o arquivo já existir
      let contentToWrite = newContent;
      
      try {
        // Tenta ler o arquivo existente
        const file = await fileHandle.getFile();
        const existingContent = await file.text();
        
        // Se o arquivo já tem conteúdo, adiciona separador e novo conteúdo
        if (existingContent.trim().length > 0) {
          const timestamp = new Date().toLocaleString('pt-BR');
          contentToWrite = existingContent + '\n\n' + 
            '='.repeat(50) + '\n' +
            `SALVAMENTO: ${timestamp}\n` +
            '='.repeat(50) + '\n\n' +
            newContent;
        }
      } catch (error) {
        // Arquivo não existe ou não pode ser lido, cria novo
        // contentToWrite já está com newContent
      }

      // Escreve no arquivo (cria novo ou sobrescreve)
      const writable = await fileHandle.createWritable();
      await writable.write(contentToWrite);
      await writable.close();
      
      showAlert('Dados salvos no arquivo TXT com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao salvar em TXT:', error);
      showAlert('Erro ao salvar arquivo TXT. Certifique-se de que seu navegador suporta File System Access API.', 'warning');
    }
  };

  const saveAll = async () => {
    try {
      const response = await fetch(`${API_URL}/save-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventory,
          ficha: {
            items,
            currentLife,
            maxLife,
            currentSanity,
            maxSanity,
            primaryWeapon,
            secondaryWeapon,
            weaponMagazine,
            secondaryWeaponMagazine,
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Se houver um arquivo TXT importado, sobrescreve o arquivo TXT
        if (importedTxtFileName) {
          const txtContent = generateTxtContent();
          const saved = await saveTxtFile(txtContent, importedTxtFileName);
          if (saved) {
            showAlert('Todos os dados foram salvos com sucesso! O arquivo TXT foi sobrescrito.', 'success');
          } else {
            showAlert('Todos os dados foram salvos com sucesso! (Download do TXT cancelado)', 'success');
          }
        } else {
          showAlert('Todos os dados foram salvos com sucesso!', 'success');
        }
      } else {
        showAlert('Erro ao salvar dados', 'warning');
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      showAlert('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.', 'warning');
    }
  };

  // Monitora mudanças no pente da arma apenas para atualizar o estado prev
  // O salvamento do carregador parcial agora é feito manualmente pelo botão "Salvar"
  useEffect(() => {
    // Arma primária - apenas atualiza o estado prev para rastrear mudanças
    if (primaryWeapon && primaryWeapon.weaponType === 'fogo') {
      setPrevPrimaryMagazine(weaponMagazine);
    }
    
    // Arma secundária - apenas atualiza o estado prev para rastrear mudanças
    if (secondaryWeapon && secondaryWeapon.weaponType === 'fogo') {
      setPrevSecondaryMagazine(secondaryWeaponMagazine);
    }
  }, [weaponMagazine, secondaryWeaponMagazine, primaryWeapon, secondaryWeapon]);

  // Calcula a sanidade da ficha técnica e atualiza a sanidade máxima da ficha de status
  // A cada 5 pontos na ficha técnica, aumenta 5 pontos na sanidade máxima
  useEffect(() => {
    // Procura por itens relacionados a sanidade na ficha técnica
    // Pode ser pelo nome do atributo (key) contendo "sanidade" ou similar
    const sanityItems = items.filter(item => {
      const keyLower = item.key.toLowerCase();
      return keyLower.includes('sanidade') || keyLower.includes('sanity') || keyLower.includes('san');
    });

    // Calcula o total de pontos de sanidade (usando o valor ATUAL, da esquerda)
    let totalSanityPoints = 0;
    sanityItems.forEach(item => {
      // O valor pode estar no formato "atual/máximo" ou apenas um número
      const value = item.value;
      if (value.includes('/')) {
        // Formato "atual/máximo" - pega o valor ATUAL (da esquerda)
        const parts = value.split('/');
        const currentValue = parseInt(parts[0]) || 0;
        totalSanityPoints += currentValue;
      } else {
        // Apenas um número (considera como valor atual)
        const numValue = parseInt(value) || 0;
        totalSanityPoints += numValue;
      }
    });

    // A cada 5 pontos na ficha técnica, aumenta 5 pontos na sanidade máxima
    // Calcula quantos grupos de 5 pontos existem
    const groupsOfFive = Math.floor(totalSanityPoints / 5);
    const newMaxSanity = 100 + (groupsOfFive * 5); // Começa em 100 e adiciona 5 para cada grupo de 5 pontos

    // Atualiza a sanidade máxima se mudou
    if (maxSanity !== newMaxSanity) {
      setMaxSanity(newMaxSanity);
      // Se a sanidade atual for maior que o novo máximo, ajusta
      if (currentSanity > newMaxSanity) {
        setCurrentSanity(newMaxSanity);
      }
    }
  }, [items, maxSanity, currentSanity]);

  const loadAll = async () => {
    try {
      const response = await fetch(`${API_URL}/load-all`);
      const data = await response.json();
      if (data.success) {
        if (data.inventory) setInventory(data.inventory);
        if (data.ficha) {
          if (data.ficha.items) setItems(data.ficha.items);
          if (data.ficha.currentLife !== undefined) setCurrentLife(data.ficha.currentLife);
          if (data.ficha.maxLife !== undefined) setMaxLife(data.ficha.maxLife);
          if (data.ficha.currentSanity !== undefined) setCurrentSanity(data.ficha.currentSanity);
          if (data.ficha.maxSanity !== undefined) setMaxSanity(data.ficha.maxSanity);
          if (data.ficha.primaryWeapon !== undefined) setPrimaryWeapon(data.ficha.primaryWeapon);
          if (data.ficha.secondaryWeapon !== undefined) setSecondaryWeapon(data.ficha.secondaryWeapon);
          if (data.ficha.weaponMagazine !== undefined) setWeaponMagazine(data.ficha.weaponMagazine);
          if (data.ficha.secondaryWeaponMagazine !== undefined) setSecondaryWeaponMagazine(data.ficha.secondaryWeaponMagazine);
        }
        showAlert('Todos os dados foram carregados com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showAlert('Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.', 'warning');
    }
  };


  // Carregar dados ao iniciar o componente
  useEffect(() => {
    loadAll();
  }, []); // Executa apenas uma vez ao montar o componente

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type.trim() && attribute.trim() && value.trim()) {
      const newItem = {
        id: Date.now().toString(),
        type: type.trim(),
        key: attribute.trim(),
        value: value.trim(),
      };
      setItems([...items, newItem]);
      setType('');
      setAttribute('');
      setValue('');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleUpdateValue = (id, newValue) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Armazena o nome do arquivo e o conteúdo para salvar depois
    setImportedTxtFileName(file.name);

    // Tenta obter o handle do arquivo usando File System Access API (se disponível)
    // Isso permite sobrescrever o arquivo original
    if ('showOpenFilePicker' in window) {
      try {
        // Se o navegador suporta File System Access API, podemos obter o handle
        // Mas como já temos o arquivo do input, vamos armazenar apenas o nome
        // O handle será obtido quando for salvar
      } catch (error) {
        console.log('File System Access API não disponível, usando download padrão');
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setImportedTxtContent(text); // Armazena o conteúdo original
      parseAndImportFile(text);
    };
    reader.readAsText(file);
  };

  const parseAndImportFile = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const newItems = [];
    let currentType = '';

    lines.forEach((line) => {
      // Detecta tipo (FÍSICO:, MENTAL:, TÉCNICO:, SOCIAL:)
      const typeMatch = line.match(/^([A-ZÁÊÇ]+):/);
      if (typeMatch) {
        currentType = typeMatch[1].trim();
        return;
      }

      // Formato 1: ((Atributo)Força): ((valor)0/20)
      let attributeMatch = line.match(/\(\(Atributo\)([^)]+)\):\s*\(\(valor\)(\d+)\/(\d+)\)/);
      if (attributeMatch) {
        const attributeName = attributeMatch[1].trim();
        const currentValue = parseInt(attributeMatch[2]) || 0;
        const maxValue = parseInt(attributeMatch[3]) || 0;
        
        newItems.push({
          id: Date.now().toString() + Math.random(),
          type: currentType || 'FÍSICO',
          key: attributeName,
          value: `${currentValue}/${maxValue}`,
        });
        return;
      }

      // Formato 2: Nome: atual/máximo (ex: Resistência: 0/20)
      const simpleMatch = line.match(/^([^:]+):\s*(\d+)\/(\d+)$/);
      if (simpleMatch) {
        const name = simpleMatch[1].trim();
        const current = parseInt(simpleMatch[2]) || 0;
        const max = parseInt(simpleMatch[3]) || 0;
        
        newItems.push({
          id: Date.now().toString() + Math.random(),
          type: currentType || 'FÍSICO',
          key: name,
          value: `${current}/${max}`,
        });
      }
    });

    // Adiciona todos os itens de uma vez
    if (newItems.length > 0) {
      setItems([...items, ...newItems]);
      showAlert(`${newItems.length} atributos importados com sucesso!`, 'success');
    } else {
      showAlert('Nenhum atributo encontrado no arquivo.', 'warning');
    }
  };

  const handleAddInventoryItem = (e) => {
    e.preventDefault();
    // Se estiver editando, usar a função de atualização
    if (editingItem) {
      handleUpdateInventoryItem(e);
      return;
    }
    
    if (itemCategory !== 'dinheiro' && !itemName.trim()) {
      showAlert(itemCategory === 'municoes' ? 'Por favor, preencha o tipo da munição.' : 'Por favor, preencha o nome do item.', 'warning');
      return;
    }

    // Validações específicas por categoria
    if (itemCategory === 'armas' && !weaponType) {
      showAlert('Por favor, selecione o tipo de arma.', 'warning');
      return;
    }
    if (itemCategory === 'armas' && weaponType === 'fogo' && linkedAmmunitions.length === 0) {
      showAlert('Por favor, adicione pelo menos uma munição compatível para armas de fogo.', 'warning');
      return;
    }
    if (itemCategory === 'municoes' && !ammunitionType.trim()) {
      showAlert('Por favor, preencha o tipo de munição.', 'warning');
      return;
    }
    if (itemCategory === 'carregadores' && !magazineCapacity.trim()) {
      showAlert('Por favor, preencha a capacidade do carregador.', 'warning');
      return;
    }
    if (itemCategory === 'carregadores' && !ammunitionType.trim()) {
      showAlert('Por favor, preencha o tipo de munição que o carregador aceita.', 'warning');
      return;
    }
    if (itemCategory === 'dinheiro') {
      const hasValue = moedas.some(m => m.debito > 0 || m.credito > 0 || m.dinheiroEspecie > 0);
      if (!hasValue) {
        showAlert('Por favor, preencha pelo menos um dos campos de dinheiro (Débito, Crédito ou Dinheiro em Espécie) em pelo menos uma moeda.', 'warning');
        return;
      }
    }

    // Criar chave única para identificar itens duplicados
    const itemKey = JSON.stringify({
      name: itemCategory === 'dinheiro' ? 'Dinheiro' : itemName.trim(),
      category: itemCategory,
      weaponType: itemCategory === 'armas' ? weaponType : null,
      ammunitionType: itemCategory === 'municoes' ? ammunitionType.trim() : (itemCategory === 'carregadores' ? ammunitionType.trim() : null),
      magazineCapacity: itemCategory === 'carregadores' ? magazineCapacity.trim() : null,
    });

    // Verificar se já existe um item com as mesmas características
    const existingItemIndex = inventory.findIndex(item => {
      const existingKey = JSON.stringify({
        name: item.category === 'dinheiro' ? 'Dinheiro' : item.name,
        category: item.category,
        weaponType: item.weaponType || null,
        ammunitionType: item.category === 'municoes' ? (item.ammunitionType || null) : (item.category === 'carregadores' ? (item.ammunitionType || null) : null),
        magazineCapacity: item.category === 'carregadores' ? (item.magazineCapacity || null) : null,
      });
      return existingKey === itemKey;
    });

    if (existingItemIndex !== -1) {
      // Atualizar quantidade do item existente
      const updatedInventory = [...inventory];
      const existingItem = updatedInventory[existingItemIndex];
      
      if (itemCategory === 'carregadores') {
        // Para carregadores, adiciona novas instâncias com IDs únicos
        const initialAmmoValue = initialAmmo !== null && initialAmmo !== undefined ? parseInt(initialAmmo) : 0;
        const capacity = parseInt(magazineCapacity) || 30;
        const finalAmmo = Math.min(Math.max(0, initialAmmoValue), capacity); // Garante que não exceda a capacidade e seja >= 0
        const newInstances = Array.from({ length: itemQuantity }, (_, i) => ({
          instanceId: `${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          isLoaded: finalAmmo === capacity,
          currentAmmo: finalAmmo
        }));
        updatedInventory[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + itemQuantity,
          instances: [...(existingItem.instances || []), ...newInstances]
        };
      } else {
        updatedInventory[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + itemQuantity,
        };
      }
      setInventory(updatedInventory);
      showAlert(`Item atualizado! Quantidade total: ${updatedInventory[existingItemIndex].quantity}`, 'success');
    } else {
      // Criar novo item
      const newInventoryItem = {
        id: Date.now().toString(),
        name: itemCategory === 'dinheiro' ? 'Dinheiro' : itemName.trim(),
        quantity: itemQuantity,
        category: itemCategory,
        ...(itemCategory === 'armas' && weaponType && { weaponType }),
        ...(itemCategory === 'armas' && weaponType === 'fogo' && {
          linkedAmmunitions: linkedAmmunitions.length > 0 ? linkedAmmunitions : [],
          linkedMagazine: linkedMagazine || null,
        }),
        ...(itemCategory === 'municoes' && {
          ammunitionType: ammunitionType.trim(),
          linkedWeapon: linkedWeapon || null,
        }),
        ...(itemCategory === 'carregadores' && {
          magazineCapacity: magazineCapacity.trim(),
          ammunitionType: ammunitionType.trim(), // Tipo de munição que o carregador aceita
          linkedWeapon: linkedWeapon || null,
          loadedQuantity: 0, // Inicializa sem carregadores carregados
          // Cria instâncias individuais para cada carregador físico com IDs únicos
          instances: (() => {
            const initialAmmoValue = initialAmmo !== null && initialAmmo !== undefined ? parseInt(initialAmmo) : 0;
            const capacity = parseInt(magazineCapacity) || 30;
            const finalAmmo = Math.min(Math.max(0, initialAmmoValue), capacity); // Garante que não exceda a capacidade e seja >= 0
            console.log('Criando carregadores:', { initialAmmo, initialAmmoValue, capacity, finalAmmo, itemQuantity });
            return Array.from({ length: itemQuantity }, (_, i) => ({
              instanceId: `${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              isLoaded: finalAmmo === capacity,
              currentAmmo: finalAmmo
            }));
          })()
        }),
        ...(itemCategory === 'dinheiro' && {
          moedas: moedas.filter(m => m.debito > 0 || m.credito > 0 || m.dinheiroEspecie > 0),
        }),
      };
      setInventory([...inventory, newInventoryItem]);
      showAlert(`Item cadastrado com sucesso!`, 'success');
    }

    // Limpar formulário
    setEditingItem(null); // Garante que o estado de edição seja limpo
    setItemName('');
    setItemQuantity(1);
    setItemCategory('geral');
    setWeaponType('');
    setAmmunitionType('');
    setMagazineCapacity('');
    setInitialAmmo(0);
    setLinkedAmmunitions([]);
    setSelectedAmmunitionToAdd('');
    setLinkedMagazine('');
    setLinkedWeapon('');
    setDebito(0);
    setCredito(0);
    setDinheiroEspecie(0);
    setMoedas([{ id: Date.now().toString(), tipo: 'BRL', simbolo: 'R$', debito: 0, credito: 0, dinheiroEspecie: 0 }]);
  };

  const handleDeleteInventoryItem = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
    // Remove o item do conjunto de itens ativos se estiver presente
    const newActiveItems = new Set(activeItems);
    newActiveItems.delete(id);
    setActiveItems(newActiveItems);
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleDeleteInventoryItem(id);
    } else {
      setInventory(inventory.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Função para verificar se há carregadores disponíveis no inventário (carregados)
  const getAvailableMagazines = (weapon) => {
    if (!weapon) return [];
    
    // Compatibilidade: se linkedAmmunition é string (antigo), converte para array
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) return [];
    
    // Busca todas as munições vinculadas para obter os tipos
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions
      .map(a => a.ammunitionType)
      .filter(Boolean);
    
    if (ammunitionTypes.length === 0) return [];
    
    // Busca todos os carregadores compatíveis
    const compatibleMagazines = inventory.filter(item => 
      item.category === 'carregadores' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      (item.linkedWeapon === weapon.id || !item.linkedWeapon) &&
      item.quantity > 0
    );
    
    // Se tem instâncias, retorna apenas os que têm instâncias carregadas
    return compatibleMagazines.filter(item => {
      if (item.instances && Array.isArray(item.instances)) {
        return item.instances.some(inst => inst.isLoaded && inst.currentAmmo === parseInt(item.magazineCapacity || 30));
      }
      // Fallback: sistema antigo
      return item.loadedQuantity !== undefined ? item.loadedQuantity > 0 : false;
    });
  };

  // Função para verificar se há carregadores vazios disponíveis
  const getEmptyMagazines = (weapon) => {
    if (!weapon) return [];
    
    // Compatibilidade: se linkedAmmunition é string (antigo), converte para array
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) return [];
    
    // Busca todas as munições vinculadas para obter os tipos
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions
      .map(a => a.ammunitionType)
      .filter(Boolean);
    
    if (ammunitionTypes.length === 0) return [];
    
    const compatibleMagazines = inventory.filter(item => 
      item.category === 'carregadores' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      (item.linkedWeapon === weapon.id || !item.linkedWeapon) &&
      item.quantity > 0
    );
    
    // Se tem instâncias, retorna apenas os que têm instâncias vazias
    return compatibleMagazines.filter(item => {
      if (item.instances && Array.isArray(item.instances)) {
        return item.instances.some(inst => !inst.isLoaded && inst.currentAmmo === 0);
      }
      // Fallback: sistema antigo
      return item.loadedQuantity === undefined || item.loadedQuantity < item.quantity;
    });
  };

  // Função para verificar se há munição disponível no inventário
  const getAvailableAmmunition = (weapon) => {
    if (!weapon) return null;
    
    // Compatibilidade: se linkedAmmunition é string (antigo), converte para array
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) return null;
    
    // Busca qualquer munição compatível (mesmo tipo que qualquer munição vinculada) que tenha quantidade > 0
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions
      .map(a => a.ammunitionType)
      .filter(Boolean);
    
    return inventory.find(item => 
      item.category === 'municoes' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      item.quantity > 0
    );
  };

  // Função para buscar todas as munições compatíveis com a arma
  const getCompatibleAmmunitions = (weapon) => {
    if (!weapon) return [];
    
    // Compatibilidade: se linkedAmmunition é string (antigo), converte para array
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) return [];
    
    // Busca todas as munições vinculadas para obter os tipos
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions
      .map(a => a.ammunitionType)
      .filter(Boolean);
    
    // Busca todas as munições compatíveis com qualquer tipo vinculado
    return inventory.filter(item => 
      item.category === 'municoes' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      item.quantity > 0
    );
  };

  // Função para buscar todos os carregadores compatíveis com a arma
  const getCompatibleMagazines = (weapon) => {
    if (!weapon) return [];
    
    // Compatibilidade: se linkedAmmunition é string (antigo), converte para array
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) return [];
    
    // Busca todas as munições vinculadas para obter os tipos
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions
      .map(a => a.ammunitionType)
      .filter(Boolean);
    
    // Busca todos os carregadores compatíveis com qualquer tipo vinculado
    return inventory.filter(item => 
      item.category === 'carregadores' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      item.quantity > 0
    );
  };

  // Função para obter todos os carregadores compatíveis para o select (incluindo vazios, parciais e usando)
  const getAllCompatibleMagazinesForSelect = (weapon, isPrimary = true) => {
    if (!weapon) return [];
    
    const compatibleMagazines = getCompatibleMagazines(weapon);
    const allOptions = [];
    
    // Busca carregadores parciais compatíveis
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
    
    const partialMagazines = inventory.filter(item => 
      item.category === 'carregadores' && 
      item.partialAmmo &&
      ammunitionTypes.includes(item.ammunitionType)
    );
    
    // Obtém informações do carregador atual na arma
    const currentMagazine = isPrimary ? weaponMagazine : secondaryWeaponMagazine;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;
    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    
    // Adiciona carregadores normais (carregados e vazios)
    compatibleMagazines.forEach(mag => {
      const capacity = parseInt(mag.magazineCapacity) || 30;
      const currentAmmoInWeapon = currentMagazine.max > 0 ? currentMagazine.current : null;
      
      // Se o carregador tem instâncias individuais, usa elas
      if (mag.instances && Array.isArray(mag.instances)) {
        mag.instances.forEach(instance => {
          const isThisOneUsing = currentMagazineId === instance.instanceId && currentMagazineInfo && currentMagazine.max > 0;
          const instanceAmmo = isThisOneUsing ? currentAmmoInWeapon : instance.currentAmmo;
          
          // Determina o tipo baseado no estado
          let type = 'empty';
          let displayName = '';
          
          if (isThisOneUsing) {
            // Está sendo usado na arma
            type = 'using';
            displayName = `${mag.name} - Usando (${instanceAmmo}/${capacity})`;
          } else if (instance.isLoaded && instance.currentAmmo === capacity) {
            // Carregador cheio
            type = 'loaded';
            displayName = `${mag.name} - Carregado (${capacity} munições)`;
          } else if (instance.currentAmmo > 0 && instance.currentAmmo < capacity) {
            // Carregador parcial
            type = 'partial';
            displayName = `${mag.name} - Parcial (${instance.currentAmmo}/${capacity})`;
          } else {
            // Carregador vazio
            type = 'empty';
            displayName = `${mag.name} - Vazio (${capacity} munições)`;
          }
          
          allOptions.push({
            id: instance.instanceId,
            originalId: mag.id,
            magazine: mag,
            instance: instance,
            type: type,
            displayName: displayName,
            capacity: capacity,
            currentAmmo: instanceAmmo || instance.currentAmmo || 0
          });
        });
      } else {
        // Fallback: sistema antigo sem instâncias (compatibilidade)
        const loadedQty = mag.loadedQuantity || 0;
        const totalQty = mag.quantity;
        const emptyQty = totalQty - loadedQty;
        
        // Adiciona carregadores carregados
        for (let i = 0; i < loadedQty; i++) {
          const instanceId = `${mag.id}_loaded_${i}`;
          const isThisOneUsing = currentMagazineId === instanceId && currentMagazineInfo && currentMagazine.max > 0;
          
          allOptions.push({
            id: instanceId,
            originalId: mag.id,
            magazine: mag,
            type: isThisOneUsing ? 'using' : 'loaded',
            displayName: isThisOneUsing 
              ? `${mag.name} - Usando (${currentAmmoInWeapon}/${capacity})`
              : `${mag.name} - Carregado (${capacity} munições)`,
            capacity: capacity,
            currentAmmo: capacity
          });
        }
        
        // Adiciona carregadores vazios
        for (let i = 0; i < emptyQty; i++) {
          const instanceId = `${mag.id}_empty_${i}`;
          const isThisOneUsing = currentMagazineId === instanceId && currentMagazineInfo && currentMagazine.max > 0;
          
          allOptions.push({
            id: instanceId,
            originalId: mag.id,
            magazine: mag,
            type: isThisOneUsing ? 'using' : 'empty',
            displayName: isThisOneUsing 
              ? `${mag.name} - Usando (${currentAmmoInWeapon || 0}/${capacity})`
              : `${mag.name} - Vazio (${capacity} munições)`,
            capacity: capacity,
            currentAmmo: 0
          });
        }
      }
    });
    
    // Adiciona carregadores parciais
    partialMagazines.forEach(partial => {
      const partialAmmo = partial.partialAmmo || 0;
      const capacity = parseInt(partial.magazineCapacity) || 30;
      
      // Verifica se ESTE parcial específico está sendo usado na arma
      // O ID do parcial já é único (é o próprio ID do item no inventário)
      const isUsing = currentMagazineId === partial.id && currentMagazineInfo && currentMagazine.max > 0;
      const currentAmmoInWeapon = isUsing ? currentMagazine.current : null;
      
      // Se a munição for 0, trata como vazio
      if (partialAmmo === 0) {
        allOptions.push({
          id: partial.id,
          originalId: partial.id,
          magazine: partial,
          type: isUsing ? 'using' : 'empty',
          displayName: isUsing 
            ? `${partial.name} - Usando (0/${capacity})`
            : `${partial.name} - Vazio (${capacity} munições)`,
          capacity: capacity,
          currentAmmo: 0
        });
      } else {
        // Se a munição for > 0, trata como parcial
        allOptions.push({
          id: partial.id,
          originalId: partial.id,
          magazine: partial,
          type: isUsing ? 'using' : 'partial',
          displayName: isUsing 
            ? `${partial.name} - Usando (${currentAmmoInWeapon || partialAmmo}/${capacity})`
            : `${partial.name} - Parcial (${partialAmmo}/${capacity})`,
          capacity: capacity,
          currentAmmo: partialAmmo
        });
      }
    });
    
    return allOptions;
  };

  // Função para encontrar o ID do carregador atual no select
  const getCurrentMagazineSelectId = (weapon, currentMagazineInfo, currentMagazineId, currentMagazine, isPrimary) => {
    if (!weapon || !currentMagazineInfo || !currentMagazineId || currentMagazine.max === 0) {
      return '';
    }
    
    const allMagazines = getAllCompatibleMagazinesForSelect(weapon, isPrimary);
    
    // Procura pelo carregador que está sendo usado (type === 'using')
    const usingMagazine = allMagazines.find(m => m.type === 'using');
    if (usingMagazine) return usingMagazine.id;
    
    // Se não encontrou "using", tenta encontrar pelo estado atual
    // Se for um carregador cheio, procura por um "loaded"
    if (currentMagazine.current === currentMagazine.max) {
      const found = allMagazines.find(m => 
        m.originalId === currentMagazineId && 
        m.type === 'loaded'
      );
      if (found) return found.id;
    }
    // Se for um carregador parcial, procura pelo ID do parcial ou "partial"
    else if (currentMagazine.current > 0 && currentMagazine.current < currentMagazine.max) {
      const found = allMagazines.find(m => 
        (m.id === currentMagazineId || m.originalId === currentMagazineId) && 
        (m.type === 'partial' || m.type === 'using')
      );
      if (found) return found.id;
    }
    // Se for vazio, procura por um "empty"
    else if (currentMagazine.current === 0) {
      const found = allMagazines.find(m => 
        m.originalId === currentMagazineId && 
        m.type === 'empty'
      );
      if (found) return found.id;
    }
    
    return '';
  };

  // Função para colocar um carregador selecionado na arma
  const handleSelectMagazine = (magazineOption, isPrimary) => {
    if (!magazineOption) return;
    
    const weapon = isPrimary ? primaryWeapon : secondaryWeapon;
    if (!weapon || weapon.weaponType !== 'fogo') return;
    
    // Salva o carregador atual ANTES de colocar o novo
    const currentMagazine = isPrimary ? weaponMagazine : secondaryWeaponMagazine;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;
    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    
    // Atualiza o inventário em uma única operação para evitar inconsistências
    setInventory(prevInventory => {
      let updatedInventory = [...prevInventory];
      
      // 1. Devolve o carregador atual ao inventário (se houver)
      if (currentMagazine.current > 0 && currentMagazineInfo && currentMagazineId) {
        // Encontra o item do carregador no inventário
        const usedMagazineInInventory = updatedInventory.find(
          item => item.id === currentMagazineInfo.id && item.category === 'carregadores'
        );
        
        if (usedMagazineInInventory) {
          // Se tem instâncias, atualiza a instância específica
          if (usedMagazineInInventory.instances && Array.isArray(usedMagazineInInventory.instances)) {
            updatedInventory = updatedInventory.map(item => {
              if (item.id === usedMagazineInInventory.id) {
                const updatedInstances = item.instances.map(inst => {
                  if (inst.instanceId === currentMagazineId) {
                    // Atualiza a instância com o estado atual
                    return {
                      ...inst,
                      isLoaded: currentMagazine.current === currentMagazine.max,
                      currentAmmo: currentMagazine.current
                    };
                  }
                  return inst;
                });
                return {
                  ...item,
                  instances: updatedInstances
                };
              }
              return item;
            });
          } else {
            // Fallback: sistema antigo
            if (currentMagazine.current === currentMagazine.max) {
              updatedInventory = updatedInventory.map(item => {
                if (item.id === usedMagazineInInventory.id) {
                  return {
                    ...item,
                    loadedQuantity: (item.loadedQuantity || 0) + 1
                  };
                }
                return item;
              });
            } else if (currentMagazine.current > 0 && currentMagazine.current < currentMagazine.max) {
              const partialMagazine = {
                ...currentMagazineInfo,
                id: `${usedMagazineInInventory.id}_partial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                quantity: 0,
                loadedQuantity: 0,
                partialAmmo: currentMagazine.current,
              };
              updatedInventory = [...updatedInventory, partialMagazine];
            }
          }
        }
      }
      
      // 2. Remove o novo carregador do inventário (se necessário)
      const newMagazineInInventory = updatedInventory.find(
        item => item.id === magazineOption.originalId && item.category === 'carregadores'
      );
      
      if (newMagazineInInventory) {
        if (newMagazineInInventory.instances && Array.isArray(newMagazineInInventory.instances)) {
          // Sistema novo com instâncias
          updatedInventory = updatedInventory.map(item => {
            if (item.id === magazineOption.originalId) {
              const updatedInstances = item.instances.map(inst => {
                if (inst.instanceId === magazineOption.id) {
                  // Marca como usado (será atualizado quando devolver)
                  return {
                    ...inst,
                    isLoaded: false,
                    currentAmmo: 0
                  };
                }
                return inst;
              });
              return {
                ...item,
                instances: updatedInstances
              };
            }
            return item;
          });
        } else {
          // Fallback: sistema antigo
          if (magazineOption.type === 'loaded' || magazineOption.type === 'using') {
            updatedInventory = updatedInventory.map(item => {
              if (item.id === magazineOption.originalId) {
                const currentLoaded = item.loadedQuantity || 0;
                return {
                  ...item,
                  loadedQuantity: Math.max(0, currentLoaded - 1)
                };
              }
              return item;
            });
          } else if (magazineOption.type === 'partial') {
            updatedInventory = updatedInventory.filter(item => item.id !== magazineOption.id);
          }
        }
      }
      // Se for 'empty', não precisa atualizar (já está vazio no inventário)
      
      return updatedInventory;
    });
    
    // Coloca o novo carregador na arma
    const capacity = magazineOption.capacity;
    const currentAmmo = magazineOption.currentAmmo;
    
    if (isPrimary) {
      setWeaponMagazine({ current: currentAmmo, max: capacity });
      // IMPORTANTE: Salva o ID da instância específica, não o originalId
      setCurrentPrimaryMagazineId(magazineOption.id);
      setCurrentPrimaryMagazineInfo(magazineOption.magazine);
      setPrevPrimaryMagazine({ current: currentAmmo, max: capacity });
      // Atualiza o select para mostrar o carregador selecionado
      setSelectedPrimaryMagazine(magazineOption.id);
    } else {
      setSecondaryWeaponMagazine({ current: currentAmmo, max: capacity });
      // IMPORTANTE: Salva o ID da instância específica, não o originalId
      setCurrentSecondaryMagazineId(magazineOption.id);
      setCurrentSecondaryMagazineInfo(magazineOption.magazine);
      setPrevSecondaryMagazine({ current: currentAmmo, max: capacity });
      // Atualiza o select para mostrar o carregador selecionado
      setSelectedSecondaryMagazine(magazineOption.id);
    }
  };

  // Função para recarregar arma (usa um carregador carregado do inventário)
  const handleReloadWeapon = (isPrimary) => {
    const weapon = isPrimary ? primaryWeapon : secondaryWeapon;
    const currentMagazine = isPrimary ? weaponMagazine : secondaryWeaponMagazine;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;
    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    
    if (!weapon || weapon.weaponType !== 'fogo') {
      showAlert('Selecione uma arma de fogo primeiro!', 'warning');
      return;
    }

    // ANTES DE RECARREGAR: Salva o carregador atual se houver munições restantes
    // IMPORTANTE: Só salva se current > 0, nunca salva carregador zerado
    // IMPORTANTE: Cria apenas 1 item (parcial OU devolve ao inventário), nunca duplica
    let updatedInventory = inventory;
    
    // Extrai o originalId do currentMagazineId (pode ser instância como "mag.id_loaded_0")
    let originalMagazineId = currentMagazineId;
    if (currentMagazineId && (currentMagazineId.includes('_loaded_') || currentMagazineId.includes('_empty_'))) {
      originalMagazineId = currentMagazineId.split('_loaded_')[0].split('_empty_')[0];
    }
    
    if (currentMagazine.current > 0 && currentMagazineInfo && currentMagazineId) {
      const usedMagazineInInventory = originalMagazineId 
        ? inventory.find(item => item.id === originalMagazineId && item.category === 'carregadores')
        : null;
      
      if (currentMagazine.current === currentMagazine.max) {
        // Carregador está cheio - devolve ao inventário aumentando loadedQuantity
        // NÃO cria parcial, apenas devolve
        if (usedMagazineInInventory) {
          updatedInventory = inventory.map(item => {
            if (item.id === originalMagazineId) {
              return {
                ...item,
                loadedQuantity: (item.loadedQuantity || 0) + 1
              };
            }
            return item;
          });
        }
      } else if (currentMagazine.current > 0 && currentMagazine.current < currentMagazine.max) {
        // Carregador parcialmente usado - cria um parcial com ID único
        // Cada parcial tem um ID único baseado em timestamp + random para garantir unicidade
        // É possível ter múltiplos parciais com a mesma quantidade (de carregadores diferentes)
        const uniqueId = `${originalMagazineId}_partial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const partialMagazine = {
          ...currentMagazineInfo,
          id: uniqueId,
          quantity: 0, // NÃO conta para o total
          loadedQuantity: 0,
          partialAmmo: currentMagazine.current,
        };
        updatedInventory = [...inventory, partialMagazine];
      }
      // Atualiza o inventário antes de continuar
      setInventory(updatedInventory);
    }
    
    // Se o carregador está zerado (current === 0), NÃO salva nada, apenas limpa referências
    if (currentMagazine.current === 0 && currentMagazineInfo) {
      // Limpa as referências do carregador zerado
      if (isPrimary) {
        setCurrentPrimaryMagazineId(null);
        setCurrentPrimaryMagazineInfo(null);
      } else {
        setCurrentSecondaryMagazineId(null);
        setCurrentSecondaryMagazineInfo(null);
      }
      // NÃO cria nada no inventário quando está vazio
    }

    // Compatibilidade: verifica se tem munições vinculadas
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) {
      showAlert('Esta arma não possui munição vinculada! Configure a munição na arma primeiro.', 'warning');
      return;
    }

    // Usa o inventário atualizado para buscar carregadores
    const currentInventory = updatedInventory;
    
    // Funções auxiliares que usam o inventário atualizado
    const getAvailableMagazinesUpdated = (weapon) => {
      if (!weapon) return [];
      const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
        ? weapon.linkedAmmunitions 
        : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
      if (ammoIds.length === 0) return [];
      const linkedAmmunitions = currentInventory.filter(a => ammoIds.includes(a.id));
      const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
      if (ammunitionTypes.length === 0) return [];
      const compatibleMagazines = currentInventory.filter(item => 
        item.category === 'carregadores' && 
        ammunitionTypes.includes(item.ammunitionType) &&
        (item.linkedWeapon === weapon.id || !item.linkedWeapon) &&
        item.quantity > 0
      );
      // Se tem instâncias, retorna apenas os que têm instâncias carregadas
      return compatibleMagazines.filter(item => {
        if (item.instances && Array.isArray(item.instances)) {
          return item.instances.some(inst => inst.isLoaded && inst.currentAmmo === parseInt(item.magazineCapacity || 30));
        }
        return item.loadedQuantity !== undefined ? item.loadedQuantity > 0 : false;
      });
    };
    
    const getEmptyMagazinesUpdated = (weapon) => {
      if (!weapon) return [];
      const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
        ? weapon.linkedAmmunitions 
        : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
      if (ammoIds.length === 0) return [];
      const linkedAmmunitions = currentInventory.filter(a => ammoIds.includes(a.id));
      const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
      if (ammunitionTypes.length === 0) return [];
      const compatibleMagazines = currentInventory.filter(item => 
        item.category === 'carregadores' && 
        ammunitionTypes.includes(item.ammunitionType) &&
        (item.linkedWeapon === weapon.id || !item.linkedWeapon) &&
        item.quantity > 0
      );
      // Se tem instâncias, retorna apenas os que têm instâncias vazias
      return compatibleMagazines.filter(item => {
        if (item.instances && Array.isArray(item.instances)) {
          return item.instances.some(inst => !inst.isLoaded && inst.currentAmmo === 0);
        }
        return item.loadedQuantity === undefined || item.loadedQuantity < item.quantity;
      });
    };
    
    const getAvailableAmmunitionUpdated = (weapon) => {
      if (!weapon) return null;
      const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
        ? weapon.linkedAmmunitions 
        : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
      if (ammoIds.length === 0) return null;
      const linkedAmmunitions = currentInventory.filter(a => ammoIds.includes(a.id));
      const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
      return currentInventory.find(item => 
        item.category === 'municoes' && 
        ammunitionTypes.includes(item.ammunitionType) &&
        item.quantity > 0
      );
    };
    
    let availableMagazines = getAvailableMagazinesUpdated(weapon);
    let magazineToUse = null;
    let magazineCapacity = 0;
    let wasAutoFilled = false; // Flag para saber se foi preenchido automaticamente
    
    // Se não há carregadores carregados, tenta encher um carregador vazio automaticamente
    if (availableMagazines.length === 0) {
      const availableAmmunition = getAvailableAmmunitionUpdated(weapon);
      const emptyMagazines = getEmptyMagazinesUpdated(weapon);
      
      if (availableAmmunition && emptyMagazines.length > 0) {
        // Encontra um carregador vazio compatível
        const emptyMag = emptyMagazines[0];
        const magCapacity = parseInt(emptyMag.magazineCapacity) || 30;
        const ammoNeeded = magCapacity;
        
        if (availableAmmunition.quantity >= ammoNeeded) {
          // Enche o carregador automaticamente e já usa ele na mesma ação
          // Não precisa alterar loadedQuantity porque encheu e usou na mesma ação
          // Apenas remove a munição do inventário
          updatedInventory = currentInventory.map(item => {
            if (item.id === availableAmmunition.id) {
              // Remove a munição usada para encher o carregador
              return {
                ...item,
                quantity: availableAmmunition.quantity - ammoNeeded
              };
            }
            return item;
          });
          
          setInventory(updatedInventory);
          
          // Usa o carregador que acabou de ser preenchido
          // Cria uma cópia do carregador para rastrear
          magazineToUse = { ...emptyMag };
          magazineCapacity = magCapacity;
          wasAutoFilled = true;
        } else {
          showAlert(`Não há munição suficiente! Precisa de ${ammoNeeded} munições para encher um carregador, mas você tem apenas ${availableAmmunition.quantity}.`, 'warning');
          return;
        }
      } else {
        if (!availableAmmunition) {
          showAlert('Não há munição disponível no inventário para encher um carregador!', 'warning');
        } else if (emptyMagazines.length === 0) {
          showAlert('Não há carregadores vazios disponíveis no inventário!', 'warning');
        } else {
          showAlert('Não há carregadores carregados disponíveis e não é possível encher um carregador automaticamente!', 'warning');
        }
        return;
      }
    } else {
      // Usa o primeiro carregador carregado disponível
      magazineToUse = availableMagazines[0];
      magazineCapacity = parseInt(magazineToUse.magazineCapacity) || 30;
    }

    // Atualiza o inventário: reduz a quantidade de carregadores carregados
    // (só se não foi preenchido automaticamente, porque nesse caso já foi usado na mesma ação)
    if (!wasAutoFilled) {
      // Se havia carregadores carregados, apenas reduz o loadedQuantity
      updatedInventory = currentInventory.map(item => {
        if (item.id === magazineToUse.id) {
          const currentLoaded = item.loadedQuantity || 0;
          const newLoaded = Math.max(0, currentLoaded - 1);
          const updatedItem = {
            ...item,
            loadedQuantity: newLoaded
          };
          
          // Se não há mais carregadores carregados, mostra feedback visual
          if (newLoaded === 0 && currentLoaded > 0) {
            console.log(`⚠️ Todos os carregadores de ${item.name} foram usados!`);
          }
          
          return updatedItem;
        }
        return item;
      });
      setInventory(updatedInventory);
    }

    // Recarrega a arma e rastreia qual carregador está sendo usado
    if (isPrimary) {
      setWeaponMagazine({ current: magazineCapacity, max: magazineCapacity });
      // Busca a instância específica do carregador que será usado
      const allMagazines = getAllCompatibleMagazinesForSelect(primaryWeapon, true);
      const currentMagazineOption = allMagazines.find(m => 
        m.originalId === magazineToUse.id && m.type === 'loaded'
      );
      if (currentMagazineOption) {
        // Salva o ID da instância específica
        setCurrentPrimaryMagazineId(currentMagazineOption.id);
        setCurrentPrimaryMagazineInfo(magazineToUse);
        setSelectedPrimaryMagazine(currentMagazineOption.id);
      } else {
        // Fallback: cria um ID temporário se não encontrar
        const tempId = `${magazineToUse.id}_loaded_0`;
        setCurrentPrimaryMagazineId(tempId);
        setCurrentPrimaryMagazineInfo(magazineToUse);
        setSelectedPrimaryMagazine(tempId);
      }
      setPrevPrimaryMagazine({ current: magazineCapacity, max: magazineCapacity });
    } else {
      setSecondaryWeaponMagazine({ current: magazineCapacity, max: magazineCapacity });
      // Busca a instância específica do carregador que será usado
      const allMagazines = getAllCompatibleMagazinesForSelect(secondaryWeapon, false);
      const currentMagazineOption = allMagazines.find(m => 
        m.originalId === magazineToUse.id && m.type === 'loaded'
      );
      if (currentMagazineOption) {
        // Salva o ID da instância específica
        setCurrentSecondaryMagazineId(currentMagazineOption.id);
        setCurrentSecondaryMagazineInfo(magazineToUse);
        setSelectedSecondaryMagazine(currentMagazineOption.id);
      } else {
        // Fallback: cria um ID temporário se não encontrar
        const tempId = `${magazineToUse.id}_loaded_0`;
        setCurrentSecondaryMagazineId(tempId);
        setCurrentSecondaryMagazineInfo(magazineToUse);
        setSelectedSecondaryMagazine(tempId);
      }
      setPrevSecondaryMagazine({ current: magazineCapacity, max: magazineCapacity });
    }

    showAlert(`Arma recarregada! ${magazineCapacity} munições no pente.`, 'success');
  };

  // Função para salvar o carregador atual da arma no inventário
  const handleSaveMagazine = (isPrimary) => {
    const weapon = isPrimary ? primaryWeapon : secondaryWeapon;
    const magazine = isPrimary ? weaponMagazine : secondaryWeaponMagazine;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;
    
    if (!weapon || weapon.weaponType !== 'fogo') {
      showAlert('Selecione uma arma de fogo primeiro!', 'warning');
      return;
    }
    
    if (magazine.current <= 0) {
      showAlert('O carregador está vazio! Não há nada para salvar.', 'warning');
      return;
    }
    
    // Tenta obter informações do carregador
    let magazineInfo = currentMagazineInfo;
    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    
    // Verifica se o carregador usado ainda existe no inventário
    const usedMagazineInInventory = currentMagazineId 
      ? inventory.find(item => item.id === currentMagazineId && item.category === 'carregadores')
      : null;
    
    // Se não há informações do carregador atual, tenta buscar do inventário
    if (!magazineInfo) {
      // Busca carregadores compatíveis com a arma
      const compatibleMagazines = getCompatibleMagazines(weapon);
      if (compatibleMagazines.length > 0) {
        // Usa o primeiro carregador compatível como base
        magazineInfo = compatibleMagazines[0];
      } else {
        showAlert('Não foi possível identificar o tipo de carregador. Cadastre um carregador compatível no inventário primeiro.', 'warning');
        return;
      }
    }
    
    // IMPORTANTE: Quando você salva o carregador, você está devolvendo o carregador que foi usado
    // Se o carregador usado ainda existe no inventário, devolvemos o carregador aumentando quantity em 1
    // e criando um parcial apenas se houver munições restantes
    if (usedMagazineInInventory && magazine.current < magazine.max) {
      // O carregador foi usado e tem munições restantes - cria um parcial
      // IMPORTANTE: quantity: 0 para não aumentar o total de carregadores
      const partialMagazine = {
        ...magazineInfo,
        id: `${magazineInfo.id}_partial_${Date.now()}`, // ID único para o carregador parcial
        quantity: 0, // NÃO conta para o total - é apenas uma representação do estado
        loadedQuantity: 0, // Não está carregado, é parcial
        partialAmmo: magazine.current, // Quantidade de munições no carregador parcial
      };
      
      // Adiciona o carregador parcial ao inventário
      // O carregador original já teve seu loadedQuantity reduzido quando foi usado
      setInventory(prevInventory => [...prevInventory, partialMagazine]);
    } else if (usedMagazineInInventory && magazine.current === magazine.max) {
      // O carregador está cheio - devolve aumentando loadedQuantity em 1
      setInventory(prevInventory => prevInventory.map(item => {
        if (item.id === currentMagazineId) {
          return {
            ...item,
            loadedQuantity: (item.loadedQuantity || 0) + 1
          };
        }
        return item;
      }));
    } else {
      // Não encontrou o carregador usado - cria um parcial novo (caso raro)
      // IMPORTANTE: quantity: 0 para não aumentar o total
      const partialMagazine = {
        ...magazineInfo,
        id: `${magazineInfo.id}_partial_${Date.now()}`,
        quantity: 0, // NÃO conta para o total
        loadedQuantity: 0,
        partialAmmo: magazine.current,
      };
      setInventory(prevInventory => [...prevInventory, partialMagazine]);
    }
    
    // Limpa o carregador da arma
    if (isPrimary) {
      setWeaponMagazine({ current: 0, max: magazine.max });
      setCurrentPrimaryMagazineId(null);
      setCurrentPrimaryMagazineInfo(null);
      setPrevPrimaryMagazine({ current: 0, max: magazine.max });
    } else {
      setSecondaryWeaponMagazine({ current: 0, max: magazine.max });
      setCurrentSecondaryMagazineId(null);
      setCurrentSecondaryMagazineInfo(null);
      setPrevSecondaryMagazine({ current: 0, max: magazine.max });
    }
    
    showAlert(`Carregador salvo no inventário com ${magazine.current} munições!`, 'success');
  };

  // Função para carregar carregadores (usa munição solta para encher carregadores vazios)
  const handleLoadMagazines = (weapon) => {
    if (!weapon || weapon.weaponType !== 'fogo') {
      showAlert('Selecione uma arma de fogo primeiro!', 'warning');
      return;
    }

    // Compatibilidade: verifica se tem munições vinculadas
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) {
      showAlert('Esta arma não possui munição vinculada! Configure a munição na arma primeiro.', 'warning');
      return;
    }

    // Busca carregadores vazios compatíveis primeiro
    const emptyMagazines = getEmptyMagazines(weapon);
    
    // Busca carregadores parciais compatíveis (que também serão preenchidos)
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions
      .map(a => a.ammunitionType)
      .filter(Boolean);
    
    const partialMagazines = inventory.filter(item => 
      item.category === 'carregadores' && 
      item.partialAmmo && 
      ammunitionTypes.includes(item.ammunitionType)
    );
    
    // Agrupa carregadores por tipo de munição para usar a munição correta
    const magazinesByAmmoType = {};
    [...emptyMagazines, ...partialMagazines].forEach(mag => {
      const magAmmoType = mag.ammunitionType;
      if (!magazinesByAmmoType[magAmmoType]) {
        magazinesByAmmoType[magAmmoType] = [];
      }
      magazinesByAmmoType[magAmmoType].push(mag);
    });
    
    // Busca munição disponível para cada tipo de carregador
    // Verifica tanto o ammunitionType quanto o name para garantir correspondência exata
    const availableAmmunitionByType = {};
    Object.keys(magazinesByAmmoType).forEach(ammoType => {
      const magazinesForType = magazinesByAmmoType[ammoType];
      // Pega o nome do primeiro carregador deste tipo para comparar
      const magazineName = magazinesForType[0]?.name;
      
      const ammo = inventory.find(item => 
        item.category === 'municoes' && 
        item.ammunitionType === ammoType &&
        item.name === magazineName && // Verifica se o nome corresponde exatamente
        item.quantity > 0
      );
      if (ammo) {
        availableAmmunitionByType[ammoType] = ammo;
      }
    });
    
    if (Object.keys(availableAmmunitionByType).length === 0) {
      showAlert('Não há munição disponível no inventário para os tipos de carregadores compatíveis!', 'warning');
      return;
    }
    
    if (emptyMagazines.length === 0 && partialMagazines.length === 0) {
      showAlert('Não há carregadores vazios ou parciais compatíveis disponíveis no inventário!', 'warning');
      return;
    }

    // Processa cada tipo de munição separadamente
    let totalMagazinesFilled = 0;
    let totalAmmunitionUsed = 0;
    let totalPartialMagazinesFilled = 0;
    
    // Processa cada tipo de munição
    Object.keys(magazinesByAmmoType).forEach(ammoType => {
      const magazinesForThisType = magazinesByAmmoType[ammoType];
      const ammunitionForThisType = availableAmmunitionByType[ammoType];
      
      if (!ammunitionForThisType) return; // Não há munição para este tipo
      
      // Separa carregadores vazios e parciais deste tipo
      const emptyMagsForType = magazinesForThisType.filter(mag => {
        if (mag.instances && Array.isArray(mag.instances)) {
          return mag.instances.some(inst => !inst.isLoaded && inst.currentAmmo === 0);
        }
        return (mag.loadedQuantity || 0) < mag.quantity;
      });
      
      const partialMagsForType = magazinesForThisType.filter(mag => mag.partialAmmo);
      
      if (emptyMagsForType.length === 0 && partialMagsForType.length === 0) return;
      
      // Usa o primeiro carregador para obter a capacidade
      const compatibleMag = emptyMagsForType.length > 0 ? emptyMagsForType[0] : partialMagsForType[0];
      const magCapacity = parseInt(compatibleMag.magazineCapacity) || 30;
      
      // Calcula quantos carregadores vazios deste tipo existem
      const totalEmptyForType = emptyMagsForType.reduce((sum, mag) => {
        if (mag.instances && Array.isArray(mag.instances)) {
          return sum + mag.instances.filter(inst => !inst.isLoaded && inst.currentAmmo === 0).length;
        } else {
          const currentLoaded = mag.loadedQuantity || 0;
          return sum + (mag.quantity - currentLoaded);
        }
      }, 0);
      
      // Calcula munição necessária para completar parciais deste tipo
      const partialAmmoNeededForType = partialMagsForType.reduce((sum, partial) => {
        const currentAmmo = partial.partialAmmo || 0;
        return sum + (magCapacity - currentAmmo);
      }, 0);
      
      // Calcula quantos carregadores podem ser preenchidos com a munição disponível
      const totalAmmoNeededForType = partialAmmoNeededForType + (totalEmptyForType * magCapacity);
      const availableAmmo = ammunitionForThisType.quantity;
      const maxMagazinesFromAmmo = Math.floor((availableAmmo + partialMagsForType.reduce((sum, p) => sum + (p.partialAmmo || 0), 0)) / magCapacity);
      const totalAvailableForType = totalEmptyForType + partialMagsForType.length;
      const magazinesToFillForType = Math.min(totalAvailableForType, maxMagazinesFromAmmo);
      
      if (magazinesToFillForType === 0) return;
      
      // Calcula munição usada para este tipo
      const partialAmmoToUseForType = Math.min(partialAmmoNeededForType, availableAmmo);
      const emptyMagazinesToFillForType = Math.min(totalEmptyForType, Math.floor((availableAmmo - partialAmmoToUseForType) / magCapacity));
      const ammunitionUsedForType = partialAmmoToUseForType + (emptyMagazinesToFillForType * magCapacity);
      
      totalMagazinesFilled += magazinesToFillForType;
      totalAmmunitionUsed += ammunitionUsedForType;
      totalPartialMagazinesFilled += partialMagsForType.length;
      
      // Atualiza o inventário para este tipo específico
      // Isso será feito no map abaixo, mas precisamos rastrear qual munição usar para cada carregador
    });
    
    if (totalMagazinesFilled === 0) {
      showAlert(`Não há munição suficiente para preencher nenhum carregador!`, 'warning');
      return;
    }

    // Prepara dados para processar cada tipo
    // Agrupa por combinação de ammunitionType + name para garantir correspondência exata
    const processingData = {};
    Object.keys(magazinesByAmmoType).forEach(ammoType => {
      const magazinesForThisType = magazinesByAmmoType[ammoType];
      
      // Agrupa carregadores por nome também (além do tipo)
      const magazinesByName = {};
      magazinesForThisType.forEach(mag => {
        const key = `${ammoType}_${mag.name}`;
        if (!magazinesByName[key]) {
          magazinesByName[key] = [];
        }
        magazinesByName[key].push(mag);
      });
      
      // Processa cada combinação de tipo + nome
      Object.keys(magazinesByName).forEach(key => {
        const magsForName = magazinesByName[key];
        const magazineName = magsForName[0]?.name;
        
        // Busca munição que corresponde exatamente ao tipo E ao nome
        const ammunitionForThisType = inventory.find(item => 
          item.category === 'municoes' && 
          item.ammunitionType === ammoType &&
          item.name === magazineName && // Verifica se o nome corresponde exatamente
          item.quantity > 0
        );
        
        if (!ammunitionForThisType) return;
        
        const emptyMagsForType = magsForName.filter(mag => {
          if (mag.instances && Array.isArray(mag.instances)) {
            return mag.instances.some(inst => !inst.isLoaded && inst.currentAmmo === 0);
          }
          return (mag.loadedQuantity || 0) < mag.quantity;
        });
        const partialMagsForType = magsForName.filter(mag => mag.partialAmmo);
        
        if (emptyMagsForType.length === 0 && partialMagsForType.length === 0) return;
        
        const compatibleMag = emptyMagsForType.length > 0 ? emptyMagsForType[0] : partialMagsForType[0];
        const magCapacity = parseInt(compatibleMag.magazineCapacity) || 30;
        
        const totalEmptyForType = emptyMagsForType.reduce((sum, mag) => {
          if (mag.instances && Array.isArray(mag.instances)) {
            return sum + mag.instances.filter(inst => !inst.isLoaded && inst.currentAmmo === 0).length;
          } else {
            const currentLoaded = mag.loadedQuantity || 0;
            return sum + (mag.quantity - currentLoaded);
          }
        }, 0);
        
        const partialAmmoNeededForType = partialMagsForType.reduce((sum, partial) => {
          const currentAmmo = partial.partialAmmo || 0;
          return sum + (magCapacity - currentAmmo);
        }, 0);
        
        const availableAmmo = ammunitionForThisType.quantity;
        const partialAmmoToUseForType = Math.min(partialAmmoNeededForType, availableAmmo);
        const emptyMagazinesToFillForType = Math.min(totalEmptyForType, Math.floor((availableAmmo - partialAmmoToUseForType) / magCapacity));
        const ammunitionUsedForType = partialAmmoToUseForType + (emptyMagazinesToFillForType * magCapacity);
        
        // Usa a chave combinada (tipo + nome) para identificar unicamente
        processingData[key] = {
          ammunition: ammunitionForThisType,
          ammunitionUsed: ammunitionUsedForType,
          emptyMags: emptyMagsForType,
          partialMags: partialMagsForType,
          capacity: magCapacity,
          remainingToFill: emptyMagazinesToFillForType + partialMagsForType.length,
          ammoType: ammoType,
          magazineName: magazineName
        };
      });
    });
    
    // Atualiza o inventário: marca carregadores como carregados, remove munição e remove carregadores parciais
    const partialMagazineIds = new Set();
    const originalMagazineMap = new Map();
    
    // Coleta todos os IDs de parciais
    Object.values(processingData).forEach(data => {
      data.partialMags.forEach(partial => {
        partialMagazineIds.add(partial.id);
        const originalIdMatch = partial.id.match(/^(.+?)_partial_\d+/);
        if (originalIdMatch) {
          const originalId = originalIdMatch[1];
          const originalMag = inventory.find(m => m.id === originalId && m.category === 'carregadores' && !m.partialAmmo);
          if (originalMag) {
            originalMagazineMap.set(partial.id, originalId);
          }
        }
      });
    });
    
    let partialMagazinesFilled = 0;
    
    const updatedInventory = inventory
      .map(item => {
        // Atualiza munição baseada no tipo e nome
        if (item.category === 'municoes') {
          // Procura em todos os dados de processamento para encontrar a munição correspondente
          const matchingData = Object.values(processingData).find(data => data.ammunition.id === item.id);
          if (matchingData) {
            return {
              ...item,
              quantity: item.quantity - matchingData.ammunitionUsed
            };
          }
        }
        
        // Remove carregadores parciais (eles foram preenchidos e recarregados)
        if (item.partialAmmo && partialMagazineIds.has(item.id)) {
          partialMagazinesFilled++;
          return null; // Remove o carregador parcial
        }
        
        // Se o item tem instâncias, atualiza as instâncias individuais
        if (item.instances && Array.isArray(item.instances) && item.category === 'carregadores') {
          // Encontra o dado de processamento correspondente (tipo + nome)
          const matchingKey = `${item.ammunitionType}_${item.name}`;
          const data = processingData[matchingKey];
          
          if (!data) return item;
          const isInEmptyList = data.emptyMags.some(mag => mag.id === item.id);
          const isInPartialList = data.partialMags.some(mag => {
            const originalIdMatch = mag.id.match(/^(.+?)_partial_\d+/);
            if (originalIdMatch) {
              return originalIdMatch[1] === item.id;
            }
            return false;
          });
          
          if (!isInEmptyList && !isInPartialList) {
            return item; // Não é um carregador que precisa ser preenchido
          }
          
          const updatedInstances = [...item.instances];
          let instancesFilled = 0;
          let remainingForThisType = data.remainingToFill;
          
          // Atualiza instâncias vazias para carregadas
          for (let i = 0; i < updatedInstances.length && remainingForThisType > 0; i++) {
            if (!updatedInstances[i].isLoaded && updatedInstances[i].currentAmmo === 0) {
              updatedInstances[i] = {
                ...updatedInstances[i],
                isLoaded: true,
                currentAmmo: data.capacity
              };
              instancesFilled++;
              remainingForThisType--;
            }
          }
          
          // Se há parciais correspondentes a este item, adiciona novas instâncias carregadas
          const partialsForThisOriginal = Array.from(originalMagazineMap.entries())
            .filter(([partialId, originalId]) => originalId === item.id)
            .length;
          
          if (partialsForThisOriginal > 0 && remainingForThisType > 0) {
            const toAdd = Math.min(partialsForThisOriginal, remainingForThisType);
            for (let i = 0; i < toAdd; i++) {
              updatedInstances.push({
                instanceId: `${item.id}_loaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                isLoaded: true,
                currentAmmo: data.capacity
              });
              remainingForThisType--;
            }
          }
          
          if (instancesFilled > 0 || partialsForThisOriginal > 0) {
            return {
              ...item,
              instances: updatedInstances,
              quantity: updatedInstances.length
            };
          }
          
          return item;
        }
        
        // Sistema antigo (fallback): atualiza carregadores originais correspondentes aos parciais removidos
        if (item.category === 'carregadores') {
          const matchingKey = `${item.ammunitionType}_${item.name}`;
          const data = processingData[matchingKey];
          
          if (data) {
            const partialsForThisOriginal = Array.from(originalMagazineMap.entries())
              .filter(([partialId, originalId]) => originalId === item.id)
              .length;
            
            if (partialsForThisOriginal > 0 && data.remainingToFill > 0) {
              const currentLoaded = item.loadedQuantity || 0;
              const toAdd = Math.min(partialsForThisOriginal, data.remainingToFill);
              return {
                ...item,
                loadedQuantity: currentLoaded + toAdd
              };
            }
            
            // Preenche carregadores vazios (sistema antigo)
            if (data.remainingToFill > 0 && data.emptyMags.some(mag => mag.id === item.id)) {
              const currentLoaded = item.loadedQuantity || 0;
              const emptySlots = item.quantity - currentLoaded;
              const toFill = Math.min(data.remainingToFill, emptySlots);
              return {
                ...item,
                loadedQuantity: currentLoaded + toFill
              };
            }
          }
        }
        
        return item;
      })
      .filter(item => item !== null); // Remove os carregadores parciais (null)
    
    setInventory(updatedInventory);

    const partialMessage = partialMagazinesFilled > 0 ? ` ${partialMagazinesFilled} carregador(es) parcial(is) foram removidos e preenchidos.` : '';
    showAlert(`${totalMagazinesFilled} carregador(es) carregado(s) com ${totalAmmunitionUsed} munições!${partialMessage} Agora você pode recarregar sua arma.`, 'success');
  };

  const handleEditInventoryItem = (item) => {
    setEditingItem(item);
    if (item.category === 'dinheiro' && item.moedas) {
      setMoedas(item.moedas.length > 0 ? item.moedas : [{ id: Date.now().toString(), tipo: 'BRL', simbolo: 'R$', debito: 0, credito: 0, dinheiroEspecie: 0 }]);
    } else if (item.category === 'dinheiro') {
      // Compatibilidade com sistema antigo
      setMoedas([{ id: Date.now().toString(), tipo: 'BRL', simbolo: 'R$', debito: item.debito || 0, credito: item.credito || 0, dinheiroEspecie: item.dinheiroEspecie || 0 }]);
    } else {
      setDebito(item.debito || 0);
      setCredito(item.credito || 0);
      setDinheiroEspecie(item.dinheiroEspecie || 0);
      setMoedas([{ id: Date.now().toString(), tipo: 'BRL', simbolo: 'R$', debito: 0, credito: 0, dinheiroEspecie: 0 }]);
    }
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemCategory(item.category);
    setWeaponType(item.weaponType || '');
    setAmmunitionType(item.ammunitionType || '');
    setMagazineCapacity(item.magazineCapacity || '');
    setInitialAmmo(0); // Reset ao editar (não aplicável para itens já criados)
    // Compatibilidade: se linkedAmmunitions existe (array), usa; senão, converte linkedAmmunition (string) para array
    setLinkedAmmunitions(
      Array.isArray(item.linkedAmmunitions) 
        ? item.linkedAmmunitions 
        : (item.linkedAmmunition ? [item.linkedAmmunition] : [])
    );
    setSelectedAmmunitionToAdd('');
    setLinkedMagazine(item.linkedMagazine || '');
    setLinkedWeapon(item.linkedWeapon || '');
    setActiveInventoryTab('cadastrar');
    // Scroll para o formulário
    setTimeout(() => {
      document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleUpdateInventoryItem = (e) => {
    e.preventDefault();
    if ((itemCategory === 'dinheiro' || itemName.trim()) && editingItem) {
      if (itemCategory === 'armas' && !weaponType) {
        showAlert('Por favor, selecione o tipo de arma.', 'warning');
        return;
      }
      if (itemCategory === 'armas' && weaponType === 'fogo' && linkedAmmunitions.length === 0) {
        showAlert('Por favor, adicione pelo menos uma munição compatível para armas de fogo.', 'warning');
        return;
      }
      if (itemCategory === 'municoes' && !ammunitionType.trim()) {
        showAlert('Por favor, preencha o tipo de munição.', 'warning');
        return;
      }
      if (itemCategory === 'dinheiro') {
        const hasValue = moedas.some(m => m.debito > 0 || m.credito > 0 || m.dinheiroEspecie > 0);
        if (!hasValue) {
          showAlert('Por favor, preencha pelo menos um dos campos de dinheiro (Débito, Crédito ou Dinheiro em Espécie) em pelo menos uma moeda.', 'warning');
          return;
        }
      }
      if (itemCategory === 'carregadores' && !magazineCapacity.trim()) {
        showAlert('Por favor, preencha a capacidade do carregador.', 'warning');
        return;
      }
      if (itemCategory === 'carregadores' && !ammunitionType.trim()) {
        showAlert('Por favor, preencha o tipo de munição que o carregador aceita.', 'warning');
        return;
      }

      const updatedItem = {
        ...editingItem,
        name: itemCategory === 'dinheiro' ? 'Dinheiro' : itemName.trim(),
        quantity: itemQuantity,
        category: itemCategory,
        ...(itemCategory === 'armas' && weaponType && { weaponType }),
        ...(itemCategory === 'armas' && weaponType === 'fogo' && {
          linkedAmmunitions: linkedAmmunitions.length > 0 ? linkedAmmunitions : [],
          linkedMagazine: linkedMagazine || null,
        }),
        ...(itemCategory === 'municoes' && {
          ammunitionType: ammunitionType.trim(),
          linkedWeapon: linkedWeapon || null,
        }),
        ...(itemCategory === 'carregadores' && {
          magazineCapacity: magazineCapacity.trim(),
          ammunitionType: ammunitionType.trim(), // Tipo de munição que o carregador aceita
          linkedWeapon: linkedWeapon || null,
          loadedQuantity: editingItem.loadedQuantity !== undefined ? editingItem.loadedQuantity : 0,
        }),
        ...(itemCategory === 'dinheiro' && {
          moedas: moedas.filter(m => m.debito > 0 || m.credito > 0 || m.dinheiroEspecie > 0),
        }),
      };

      setInventory(inventory.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      
      showAlert(`Item atualizado com sucesso!`, 'success');
      
      // Limpar formulário e estado de edição
      setEditingItem(null);
      setItemName('');
      setItemQuantity(1);
      setItemCategory('geral');
      setWeaponType('');
      setAmmunitionType('');
      setMagazineCapacity('');
      setInitialAmmo(0);
      setLinkedAmmunitions([]);
      setSelectedAmmunitionToAdd('');
      setLinkedMagazine('');
      setLinkedWeapon('');
      setDebito(0);
      setCredito(0);
      setDinheiroEspecie(0);
      setMoedas([{ id: Date.now().toString(), tipo: 'BRL', simbolo: 'R$', debito: 0, credito: 0, dinheiroEspecie: 0 }]);
    }
  };

  // Função para formatar valores monetários
  const formatMoney = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0,00';
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleUpdateMoneyField = (itemId, moedaId, fieldType, newValue) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId && item.category === 'dinheiro' && item.moedas) {
        const updatedMoedas = item.moedas.map(moeda => {
          if (moeda.id === moedaId) {
            return {
              ...moeda,
              [fieldType]: newValue
            };
          }
          return moeda;
        });
        return {
          ...item,
          moedas: updatedMoedas
        };
      }
      return item;
    }));
  };

  // Agrupar itens por tipo
  const groupedByType = items.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  // Agrupar inventário por categoria
  const groupedInventory = inventory.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <div className="header-content">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.2"/>
                <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
                <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
                <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              </svg>
              Ficha de Personagem RPG
            </h1>
            <p>Gerencie atributos, vida e inventário do seu personagem</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={saveAll}
              style={{
                padding: '0.5rem 1rem',
                background: darkMode ? '#7289da' : '#5b9bd5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              title="Salvar todos os dados"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Salvar Tudo
            </button>
            <button
              onClick={saveToTxtWithAppend}
              style={{
                padding: '0.5rem 1rem',
                background: darkMode ? '#faa61a' : '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              title="Salvar em arquivo TXT (append)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Salvar em TXT
            </button>
            <button
              onClick={importFromTxt}
              style={{
                padding: '0.5rem 1rem',
                background: darkMode ? '#5865f2' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              title="Importar todos os dados de um arquivo TXT"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Importar TXT Completo
            </button>
            <button
              onClick={loadAll}
              style={{
                padding: '0.5rem 1rem',
                background: darkMode ? '#43b581' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              title="Carregar todos os dados"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Carregar Tudo
            </button>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
          >
            {darkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="content-grid">
        <div className="first-column">
        <div className="form-section">
            <div className="form-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ficha Técnica
              </h2>
            </div>
            
            {/* Tabs da Ficha Técnica */}
            <div className="ficha-tabs">
              <button
                className={`ficha-tab ${activeFichaTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveFichaTab('form')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Formulário
              </button>
              <button
                className={`ficha-tab ${activeFichaTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveFichaTab('view')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 9h6M9 15h6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Visualização
              </button>
            </div>

            {activeFichaTab === 'form' && (
              <>
                <label className="btn-import" style={{ marginBottom: '1rem', display: 'block' }}>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Importar TXT
                </label>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="type">Tipo:</label>
              <input
                id="type"
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Digite o tipo..."
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="attribute">Atributo:</label>
              <input
                id="attribute"
                type="text"
                value={attribute}
                onChange={(e) => setAttribute(e.target.value)}
                placeholder="Digite o atributo..."
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="value">Valor:</label>
              <input
                id="value"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Digite o valor..."
                className="input"
              />
            </div>
            <button type="submit" className="btn-submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Adicionar Item
            </button>
          </form>
              </>
            )}

            {activeFichaTab === 'view' && (
              <div className="discord-view">
                {Object.keys(groupedByType).length === 0 ? (
                  <div className="discord-empty">
                    <p>Nenhum atributo adicionado ainda.</p>
                    <p>Use a aba Formulário para adicionar atributos!</p>
                  </div>
                ) : (
                  Object.keys(groupedByType).map((type) => (
                    <div key={type} className="discord-section">
                      <div className="discord-section-title">{type}:</div>
                      <div className="discord-attributes">
                        {groupedByType[type].map((item) => (
                          <div key={item.id} className="discord-attribute">
                            <span className="discord-attr-name">{item.key}:</span>
                            <span className="discord-attr-value">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Separador entre Ficha Técnica e Status */}
            <div style={{ 
              height: '1px', 
              background: darkMode ? '#4a4d52' : '#e3e8ed', 
              margin: '1.5rem 0',
              transition: 'background 0.3s ease'
            }}></div>

            {/* Seção de Status */}
            <div>
              <h2 style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '1rem',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: darkMode ? '#7289da' : '#5b9bd5',
                transition: 'color 0.3s ease'
              }}>
              <svg className="status-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Ficha Status
            </h2>
            
            {/* Seção de Status - apenas Status agora */}
            <div className="life-content">
              {/* Vida */}
              <div className="stat-block">
              <div className="life-bar-container">
                <div className="life-bar-header">
                    <span className="life-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
                      </svg>
                    </span>
                    <div className="life-header-right">
                      {editingLife ? (
                        <input
                          type="text"
                          className="life-operation-input"
                          value={tempLife}
                          onChange={(e) => setTempLife(e.target.value)}
                          onBlur={() => {
                            const input = tempLife.trim();
                            
                            if (input) {
                              // Operação de adição (+X)
                              if (input.startsWith('+')) {
                                const value = parseInt(input.substring(1)) || 0;
                                setCurrentLife(Math.max(0, Math.min(maxLife, currentLife + value)));
                              }
                              // Operação de subtração (-X)
                              else if (input.startsWith('-')) {
                                const value = parseInt(input.substring(1)) || 0;
                                setCurrentLife(Math.max(0, Math.min(maxLife, currentLife - value)));
                              }
                              // Formato atual / máximo
                              else if (input.includes('/')) {
                                const values = input.split('/').map(v => v.trim());
                                if (values.length === 2) {
                                  const current = parseInt(values[0]) || 0;
                                  const max = parseInt(values[1]) || 1;
                                  setCurrentLife(Math.max(0, Math.min(max, current)));
                                  setMaxLife(Math.max(1, max));
                                }
                              }
                              // Valor absoluto
                              else {
                                const value = parseInt(input);
                                if (!isNaN(value)) {
                                  setCurrentLife(Math.max(0, Math.min(maxLife, value)));
                                }
                              }
                            }
                            
                            setEditingLife(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            } else if (e.key === 'Escape') {
                              setEditingLife(false);
                            }
                          }}
                          placeholder={currentLife.toString()}
                          autoFocus
                          style={{
                            width: '100px',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            padding: '0.25rem',
                            border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                            borderRadius: '4px',
                            background: darkMode ? '#404245' : '#fff',
                            color: darkMode ? '#dcddde' : '#2c3e50',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <div 
                          className="life-values-display"
                          onClick={() => {
                            setTempLife('');
                            setEditingLife(true);
                          }}
                        >
                          {currentLife} / {maxLife}
                        </div>
                      )}
                      <button
                        className="btn-edit-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempMaxLife(maxLife.toString());
                          setEditingMaxLife(true);
                        }}
                        title="Editar vida máxima"
                      >
                        ⚙️
                      </button>
                    </div>
                  </div>
                  
                  {editingMaxLife && (
                    <div className="life-edit-popup">
                      <div className="life-current-display">
                        <span className="current-label">VIDA MÁXIMA</span>
                        <span className="current-value">{maxLife}</span>
                      </div>
                      <input
                        type="number"
                        className="life-operation-input"
                        value={tempMaxLife}
                        onChange={(e) => setTempMaxLife(e.target.value)}
                        onBlur={() => {
                          const value = parseInt(tempMaxLife);
                          if (!isNaN(value) && value > 0) {
                            setMaxLife(value);
                            if (currentLife > value) {
                              setCurrentLife(value);
                            }
                          }
                          setEditingMaxLife(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur();
                          } else if (e.key === 'Escape') {
                            setEditingMaxLife(false);
                          }
                        }}
                        placeholder="Novo máximo"
                        autoFocus
                        min="1"
                      />
                      <div className="life-edit-hint">Defina o novo máximo</div>
                </div>
                  )}
                  
                <div className="life-bar-wrapper">
                  <div 
                    className="life-bar-fill" 
                    style={{ 
                      width: `${(currentLife / maxLife) * 100}%`,
                      backgroundColor: currentLife > maxLife * 0.5 ? '#27ae60' : currentLife > maxLife * 0.25 ? '#f39c12' : '#e74c3c'
                    }}
                  ></div>
                  </div>
                </div>
              </div>

              {/* Sanidade */}
              <div className="stat-block">
                <div className="life-bar-container">
                  <div className="life-bar-header">
                    <span className="life-label">SANIDADE</span>
                    <div className="life-header-right">
                      {editingSanity ? (
                        <input
                          type="text"
                          className="life-operation-input"
                          value={tempSanity}
                          onChange={(e) => setTempSanity(e.target.value)}
                          onBlur={() => {
                            const input = tempSanity.trim();
                            
                            if (input) {
                              // Operação de adição (+X)
                              if (input.startsWith('+')) {
                                const value = parseInt(input.substring(1)) || 0;
                                setCurrentSanity(Math.max(0, Math.min(maxSanity, currentSanity + value)));
                              }
                              // Operação de subtração (-X)
                              else if (input.startsWith('-')) {
                                const value = parseInt(input.substring(1)) || 0;
                                setCurrentSanity(Math.max(0, Math.min(maxSanity, currentSanity - value)));
                              }
                              // Formato atual / máximo
                              else if (input.includes('/')) {
                                const values = input.split('/').map(v => v.trim());
                                if (values.length === 2) {
                                  const current = parseInt(values[0]) || 0;
                                  const max = parseInt(values[1]) || 1;
                                  setCurrentSanity(Math.max(0, Math.min(max, current)));
                                  setMaxSanity(Math.max(1, max));
                                }
                              }
                              // Valor absoluto
                              else {
                                const value = parseInt(input);
                                if (!isNaN(value)) {
                                  setCurrentSanity(Math.max(0, Math.min(maxSanity, value)));
                                }
                              }
                            }
                            
                            setEditingSanity(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.target.blur();
                            } else if (e.key === 'Escape') {
                              setEditingSanity(false);
                            }
                          }}
                          placeholder={currentSanity.toString()}
                          autoFocus
                          style={{
                            width: '100px',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            padding: '0.25rem',
                            border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                            borderRadius: '4px',
                            background: darkMode ? '#404245' : '#fff',
                            color: darkMode ? '#dcddde' : '#2c3e50',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <div 
                          className="life-values-display"
                          onClick={() => {
                            setTempSanity('');
                            setEditingSanity(true);
                          }}
                        >
                          {currentSanity} / {maxSanity}
                        </div>
                      )}
                      <button
                        className="btn-edit-max"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTempMaxSanity(maxSanity.toString());
                          setEditingMaxSanity(true);
                        }}
                        title="Editar sanidade máxima"
                      >
                        ⚙️
                      </button>
                </div>
              </div>
                  
                  {editingMaxSanity && (
                    <div className="life-edit-popup">
                      <div className="life-current-display">
                        <span className="current-label">SANIDADE MÁXIMA</span>
                        <span className="current-value">{maxSanity}</span>
                </div>
                  <input
                    type="number"
                        className="life-operation-input"
                        value={tempMaxSanity}
                        onChange={(e) => setTempMaxSanity(e.target.value)}
                        onBlur={() => {
                          const value = parseInt(tempMaxSanity);
                          if (!isNaN(value) && value > 0) {
                            setMaxSanity(value);
                            if (currentSanity > value) {
                              setCurrentSanity(value);
                            }
                          }
                          setEditingMaxSanity(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.target.blur();
                          } else if (e.key === 'Escape') {
                            setEditingMaxSanity(false);
                          }
                        }}
                        placeholder="Novo máximo"
                        autoFocus
                    min="1"
                  />
                      <div className="life-edit-hint">Defina o novo máximo</div>
                    </div>
                  )}
                  
                  <div className="life-bar-wrapper">
                    <div 
                      className="life-bar-fill" 
                      style={{ 
                        width: `${(currentSanity / maxSanity) * 100}%`,
                        backgroundColor: currentSanity > maxSanity * 0.5 ? '#3498db' : currentSanity > maxSanity * 0.25 ? '#9b59b6' : '#e74c3c'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
                  </div>
          </div>
        </div>

        <div className="tabs-section">
          <Tabs
            tabs={[
              { 
                label: 'Ficha Técnica', 
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              { label: 'Tabela', icon: '📊' },
              { label: 'Resumo', icon: '📈' },
            ]}
          >
            {/* Aba 1: Ficha Técnica com Drag and Drop */}
            <div className="tab-panel">
              <h2>Ficha Técnica ({items.length})</h2>
              {items.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum item adicionado ainda.</p>
                  <p>Use o formulário ao lado para começar!</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="items-grid">
                      {items.map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          itemType={item.type}
                          itemKey={item.key}
                          itemValue={item.value}
                          onDelete={handleDelete}
                          onUpdateValue={handleUpdateValue}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Aba 2: Visualização em Tabela */}
            <div className="tab-panel">
              <h2>Visualização em Tabela ({items.length})</h2>
              {items.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum item adicionado ainda.</p>
                  <p>Use o formulário ao lado para começar!</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Chave</th>
                        <th>Valor</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.type}</td>
                          <td>{item.key}</td>
                          <td>{item.value}</td>
                          <td>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="btn-delete"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Aba 3: Resumo */}
            <div className="tab-panel">
              <h2>Resumo ({items.length})</h2>
              {items.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum item adicionado ainda.</p>
                  <p>Use o formulário ao lado para começar!</p>
                </div>
              ) : (
                <div className="summary-container">
                  <div className="summary-stats">
                  <div className="stat-card">
                      <h3>Total de Itens</h3>
                      <p className="stat-value">{items.length}</p>
                  </div>
                  <div className="stat-card">
                      <h3>Tipos Únicos</h3>
                      <p className="stat-value">
                        {new Set(items.map((item) => item.type)).size}
                      </p>
                      </div>
                    </div>
                  <div className="summary-list">
                    <h3>Itens por Tipo</h3>
                    {Object.entries(
                      items.reduce((acc, item) => {
                        if (!acc[item.type]) {
                          acc[item.type] = [];
                        }
                        acc[item.type].push(item);
                        return acc;
                      }, {})
                    ).map(([type, typeItems]) => (
                      <div key={type} className="type-group">
                        <h4>{type} ({typeItems.length})</h4>
                        <ul>
                          {typeItems.map((item) => (
                            <li key={item.id}>
                              {item.key}: {item.value}
                            </li>
                          ))}
                        </ul>
                  </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>

        <div className="result-section">
          <h2>🎒 Inventário</h2>
          
            {/* Tabs do Inventário */}
          <div className="inventory-tabs">
            <button
              className={`inventory-tab ${activeInventoryTab === 'cadastrar' ? 'active' : ''}`}
              onClick={() => setActiveInventoryTab('cadastrar')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Cadastrar
            </button>
            <button
              className={`inventory-tab ${activeInventoryTab === 'visualizar' ? 'active' : ''}`}
              onClick={() => setActiveInventoryTab('visualizar')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 9h6M9 15h6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Visualizar
            </button>
          </div>

          {activeInventoryTab === 'cadastrar' && (
            <div className="inventory-tab-panel">
              {/* Instruções de Ajuda */}
              {itemCategory === 'armas' && weaponType === 'fogo' && (
                <div style={{ 
                  padding: '1rem', 
                  background: darkMode ? 'rgba(114, 137, 218, 0.15)' : '#e3f2fd', 
                  borderRadius: '8px', 
                  marginBottom: '1.5rem',
                  border: `1px solid ${darkMode ? 'rgba(114, 137, 218, 0.3)' : '#5b9bd5'}`,
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  <strong style={{ color: darkMode ? '#7289da' : '#5b9bd5', display: 'block', marginBottom: '0.5rem' }}>
                    💡 Dica de Cadastro:
                  </strong>
                  <div style={{ color: darkMode ? '#dcddde' : '#333' }}>
                    <p style={{ margin: '0.25rem 0' }}>⚠️ <strong>Importante:</strong> Você precisa cadastrar a Munição primeiro!</p>
                    <p style={{ margin: '0.25rem 0' }}>A arma precisa selecionar munições do inventário, então elas devem estar cadastradas.</p>
                    <p style={{ margin: '0.25rem 0' }}>O Carregador é opcional e pode ser vinculado depois.</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleAddInventoryItem} className="form">
            {editingItem && (
              <div style={{ 
                padding: '0.75rem', 
                background: darkMode ? 'rgba(114, 137, 218, 0.1)' : '#e3f2fd', 
                borderRadius: '8px', 
                marginBottom: '1rem',
                border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`
              }}>
                <strong style={{ color: darkMode ? '#7289da' : '#5b9bd5' }}>
                  ✏️ Editando: {editingItem.name}
                </strong>
              </div>
            )}
            {itemCategory !== 'dinheiro' && (
            <div className="form-group">
                <label htmlFor="itemName">
                  {itemCategory === 'municoes' ? 'Tipo da Munição' : itemCategory === 'carregadores' ? 'Tipo de Carregador' : 'Nome do Item'}: <span style={{ color: '#e74c3c' }}>*</span>
                </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                  placeholder={itemCategory === 'municoes' ? 'Ex: 9mm, 5.56mm, Plasma...' : itemCategory === 'carregadores' ? 'Ex: normal, estendido, curto...' : 'Ex: M4, Poção de Vida, Espada...'}
                className="input"
                  required
              />
            </div>
            )}
            <div className="form-group">
                  <label>Categoria:</label>
                  <div className="category-checkboxes">
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'geral'}
                        onChange={() => {
                          setItemCategory('geral');
                          setWeaponType('');
                          setAmmunitionType('');
                          setMagazineCapacity('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3"/>
                        </svg>
                        Geral
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'armas'}
                        onChange={() => {
                          setItemCategory('armas');
                          setAmmunitionType('');
                          setMagazineCapacity('');
                          setLinkedAmmunitions([]);
                          setSelectedAmmunitionToAdd('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={m4Icon} alt="Armas" style={{ width: '27px', height: '27px' }} />
                        Armas
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'armaduras'}
                        onChange={() => {
                          setItemCategory('armaduras');
                          setWeaponType('');
                          setAmmunitionType('');
                          setMagazineCapacity('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={coleteIcon} alt="Armaduras" style={{ width: '27px', height: '27px' }} />
                        Armaduras
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'consumiveis'}
                        onChange={() => {
                          setItemCategory('consumiveis');
                          setWeaponType('');
                          setAmmunitionType('');
                          setMagazineCapacity('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={medicalIcon} alt="Consumíveis" style={{ width: '27px', height: '27px' }} />
                        Consumíveis
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'magicos'}
                        onChange={() => {
                          setItemCategory('magicos');
                          setWeaponType('');
                          setAmmunitionType('');
                          setMagazineCapacity('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Itens Mágicos
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'municoes'}
                        onChange={() => {
                          setItemCategory('municoes');
                          setWeaponType('');
                          setMagazineCapacity('');
                          setLinkedAmmunitions([]);
                          setSelectedAmmunitionToAdd('');
                          setLinkedMagazine('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={municaoIcon} alt="Munições" style={{ width: '35px', height: '35px' }} />
                        Munições
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'carregadores'}
                        onChange={() => {
                          setItemCategory('carregadores');
                          setWeaponType('');
                          setAmmunitionType('');
                          setLinkedAmmunitions([]);
                          setSelectedAmmunitionToAdd('');
                          setLinkedMagazine('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={clipIcon} alt="Carregadores" style={{ width: '35px', height: '35px' }} />
                        Carregadores
                      </span>
                    </label>
                    <label className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={itemCategory === 'dinheiro'}
                        onChange={() => {
                          setItemCategory('dinheiro');
                          setWeaponType('');
                          setAmmunitionType('');
                          setMagazineCapacity('');
                          setLinkedAmmunitions([]);
                          setSelectedAmmunitionToAdd('');
                          setLinkedMagazine('');
                        }}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src={dinheiroIcon} alt="Dinheiro" style={{ width: '27px', height: '27px' }} />
                        Dinheiro
                      </span>
                    </label>
                  </div>
                </div>
                {itemCategory === 'armas' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="weaponType">
                        Tipo de Arma: <span style={{ color: '#e74c3c' }}>*</span>
                      </label>
              <select
                        id="weaponType"
                        value={weaponType}
                        onChange={(e) => {
                          setWeaponType(e.target.value);
                          if (e.target.value !== 'fogo') {
                            setLinkedAmmunitions([]);
                            setSelectedAmmunitionToAdd('');
                            setLinkedMagazine('');
                          }
                        }}
                className="input"
                required
              >
                        <option value="">Selecione o tipo</option>
                        <option value="fogo">Arma de Fogo</option>
                        <option value="corpo-a-corpo">Arma Branca Corpo a Corpo</option>
              </select>
            </div>
                    {weaponType === 'fogo' && (
                      <>
                        <div className="form-group">
                          <label>
                            Munições Compatíveis: <span style={{ color: '#e74c3c' }}>*</span>
                            {inventory.filter(item => item.category === 'municoes').length === 0 && (
                              <span style={{ 
                                color: '#f39c12', 
                                fontSize: '0.75rem', 
                                display: 'block', 
                                marginTop: '0.25rem',
                                fontWeight: 'normal'
                              }}>
                                ⚠️ Nenhuma munição cadastrada. Cadastre primeiro uma munição!
                              </span>
                            )}
                          </label>
                          
                          {/* Lista de munições já vinculadas */}
                          {linkedAmmunitions.length > 0 && (
                            <div style={{ 
                              marginBottom: '0.75rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}>
                              {linkedAmmunitions.map(ammoId => {
                                const ammo = inventory.find(a => a.id === ammoId);
                                if (!ammo) return null;
                                return (
                                  <div key={ammoId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.5rem',
                                    background: darkMode ? 'rgba(114, 137, 218, 0.1)' : '#e3f2fd',
                                    borderRadius: '6px',
                                    border: `1px solid ${darkMode ? 'rgba(114, 137, 218, 0.3)' : '#5b9bd5'}`
                                  }}>
                                    <span style={{ fontSize: '0.875rem' }}>
                                      {ammo.name} ({ammo.ammunitionType})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setLinkedAmmunitions(linkedAmmunitions.filter(id => id !== ammoId));
                                      }}
                                      style={{
                                        background: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.25rem 0.5rem',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      Remover
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Select para adicionar nova munição */}
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                              <select
                                value={selectedAmmunitionToAdd}
                                onChange={(e) => setSelectedAmmunitionToAdd(e.target.value)}
                                className="input"
                              >
                                <option value="">Selecione uma munição para adicionar</option>
                                {inventory
                                  .filter(item => 
                                    item.category === 'municoes' && 
                                    !linkedAmmunitions.includes(item.id)
                                  )
                                  .map(item => (
                                    <option key={item.id} value={item.id}>
                                      {item.name} ({item.ammunitionType})
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedAmmunitionToAdd && !linkedAmmunitions.includes(selectedAmmunitionToAdd)) {
                                  setLinkedAmmunitions([...linkedAmmunitions, selectedAmmunitionToAdd]);
                                  setSelectedAmmunitionToAdd('');
                                }
                              }}
                              disabled={!selectedAmmunitionToAdd}
                              style={{
                                background: selectedAmmunitionToAdd ? '#27ae60' : '#95a5a6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.5rem 1rem',
                                cursor: selectedAmmunitionToAdd ? 'pointer' : 'not-allowed',
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Adicionar
                            </button>
                          </div>
                          
                          {linkedAmmunitions.length === 0 && (
                            <small style={{ 
                              color: '#e74c3c', 
                              fontSize: '0.75rem',
                              display: 'block',
                              marginTop: '0.25rem'
                            }}>
                              ⚠️ Você deve adicionar pelo menos uma munição compatível!
                            </small>
                          )}
                          
                          <small style={{ 
                            color: darkMode ? '#72767d' : '#7f8c8d', 
                            fontSize: '0.75rem',
                            display: 'block',
                            marginTop: '0.5rem'
                          }}>
                            Adicione todas as munições que esta arma pode usar. Você pode adicionar mais tipos durante o RPG.
                          </small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="linkedMagazine">
                            Carregador Compatível: <span style={{ color: '#95a5a6', fontSize: '0.75rem' }}>(opcional)</span>
                            {linkedAmmunitions.length > 0 && (() => {
                              const compatibleMagazines = inventory.filter(item => {
                                if (item.category !== 'carregadores') return false;
                                const linkedAmmos = inventory.filter(a => linkedAmmunitions.includes(a.id));
                                const ammoTypes = linkedAmmos.map(a => a.ammunitionType).filter(Boolean);
                                return ammoTypes.includes(item.ammunitionType);
                              });
                              return compatibleMagazines.length === 0 ? (
                                <span style={{ 
                                  color: '#f39c12', 
                                  fontSize: '0.75rem', 
                                  display: 'block', 
                                  marginTop: '0.25rem',
                                  fontWeight: 'normal'
                                }}>
                                  ⚠️ Nenhum carregador compatível encontrado para os tipos de munição selecionados.
                                </span>
                              ) : null;
                            })()}
                          </label>
                          <select
                            id="linkedMagazine"
                            value={linkedMagazine}
                            onChange={(e) => setLinkedMagazine(e.target.value)}
                            className="input"
                          >
                            <option value="">Selecione o carregador (opcional)</option>
                            {linkedAmmunitions.length > 0 && inventory
                              .filter(item => {
                                if (item.category !== 'carregadores') return false;
                                const linkedAmmos = inventory.filter(a => linkedAmmunitions.includes(a.id));
                                const ammoTypes = linkedAmmos.map(a => a.ammunitionType).filter(Boolean);
                                return ammoTypes.includes(item.ammunitionType);
                              })
                              .map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name} ({item.ammunitionType}, {item.magazineCapacity} munições)
                                </option>
                              ))}
                          </select>
                          <small style={{ 
                            color: darkMode ? '#72767d' : '#7f8c8d', 
                            fontSize: '0.75rem',
                            display: 'block',
                            marginTop: '0.25rem'
                          }}>
                            Selecione um carregador compatível com uma das munições escolhidas. Isso define a capacidade do pente.
                          </small>
                        </div>
                      </>
                    )}
                  </>
                )}
                {itemCategory === 'municoes' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="ammunitionType">
                        Tipo de Munição: <span style={{ color: '#e74c3c' }}>*</span>
                      </label>
                      <input
                        id="ammunitionType"
                        type="text"
                        value={ammunitionType}
                        onChange={(e) => setAmmunitionType(e.target.value)}
                        placeholder="Ex: 9mm, .45 ACP, 5.56mm, 7.62mm..."
                        className="input"
                        required
                      />
                      <small style={{ 
                        color: darkMode ? '#72767d' : '#7f8c8d', 
                        fontSize: '0.75rem',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        Defina o calibre/tipo da munição. Este tipo será usado para relacionar com carregadores e armas.
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="linkedWeaponAmmo">
                        Arma Compatível: <span style={{ color: '#95a5a6', fontSize: '0.75rem' }}>(opcional)</span>
                      </label>
                      <select
                        id="linkedWeaponAmmo"
                        value={linkedWeapon}
                        onChange={(e) => setLinkedWeapon(e.target.value)}
                        className="input"
                      >
                        <option value="">Selecione a arma (opcional)</option>
                        {inventory
                          .filter(item => item.category === 'armas' && item.weaponType === 'fogo')
                          .map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      <small style={{ 
                        color: darkMode ? '#72767d' : '#7f8c8d', 
                        fontSize: '0.75rem',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        Você pode vincular esta munição a uma arma específica, ou deixar em branco para usar em qualquer arma compatível.
                      </small>
                    </div>
                  </>
                )}
                {itemCategory === 'carregadores' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="magazineCapacity">
                        Capacidade do Carregador (munições): <span style={{ color: '#e74c3c' }}>*</span>
                      </label>
                      <input
                        id="magazineCapacity"
                        type="number"
                        value={magazineCapacity}
                        onChange={(e) => setMagazineCapacity(e.target.value)}
                        placeholder="Ex: 30"
                        className="input"
                        min="1"
                        required
                      />
                      <small style={{ 
                        color: darkMode ? '#72767d' : '#7f8c8d', 
                        fontSize: '0.75rem',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        Quantas munições cabem neste carregador quando está cheio.
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="initialAmmo">
                        Quantidade Inicial de Munições: <span style={{ color: '#95a5a6', fontSize: '0.75rem' }}>(opcional)</span>
                      </label>
                      <input
                        id="initialAmmo"
                        type="number"
                        value={initialAmmo === 0 ? '' : initialAmmo}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                          const capacity = parseInt(magazineCapacity) || 30;
                          setInitialAmmo(Math.min(value, capacity)); // Garante que não exceda a capacidade
                        }}
                        placeholder="Ex: 0"
                        className="input"
                        min="0"
                        max={magazineCapacity ? parseInt(magazineCapacity) : undefined}
                      />
                      <small style={{ 
                        color: darkMode ? '#72767d' : '#7f8c8d', 
                        fontSize: '0.75rem',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        Quantidade de munições que cada carregador começa com. Deixe em branco ou 0 para começar vazio.
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="ammunitionTypeMag">
                        Tipo de Munição (compatível): <span style={{ color: '#e74c3c' }}>*</span>
                        {inventory.filter(item => item.category === 'municoes').length === 0 && (
                          <span style={{ 
                            color: '#e74c3c', 
                            fontSize: '0.75rem', 
                            display: 'block', 
                            marginTop: '0.25rem',
                            fontWeight: 'normal'
                          }}>
                            ⚠️ Cadastre primeiro uma munição! O tipo deve ser igual ao tipo da munição cadastrada.
                          </span>
                        )}
                        {inventory.filter(item => item.category === 'municoes').length > 0 && (
                          <span style={{ 
                            color: '#27ae60', 
                            fontSize: '0.75rem', 
                            display: 'block', 
                            marginTop: '0.25rem',
                            fontWeight: 'normal'
                          }}>
                            💡 Selecione um tipo de munição cadastrado para relacionar automaticamente.
                          </span>
                        )}
                      </label>
                      <select
                        id="ammunitionTypeMag"
                        value={ammunitionType}
                        onChange={(e) => {
                          setAmmunitionType(e.target.value);
                          // Preenche automaticamente o tipo de carregador com o mesmo valor do tipo de munição
                          if (e.target.value) {
                            setItemName(e.target.value);
                          }
                        }}
                        className="input"
                        required
                      >
                        <option value="">Selecione o tipo de munição</option>
                        {inventory
                          .filter(item => item.category === 'municoes')
                          .map(item => item.ammunitionType)
                          .filter((v, i, a) => a.indexOf(v) === i)
                          .map(ammoType => (
                            <option key={ammoType} value={ammoType}>
                              {ammoType}
                            </option>
                          ))}
                      </select>
                      <small style={{ 
                        color: darkMode ? '#72767d' : '#7f8c8d', 
                        fontSize: '0.75rem',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        O tipo de munição deve corresponder ao tipo de uma munição cadastrada para que sejam compatíveis.
                      </small>
                      <small style={{ 
                        color: darkMode ? '#72767d' : '#7f8c8d', 
                        fontSize: '0.75rem',
                        display: 'block',
                        marginTop: '0.25rem'
                      }}>
                        O tipo de munição deve ser <strong>exatamente igual</strong> ao tipo da munição cadastrada (ex: "9mm" ou "5.56mm").
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="linkedWeaponMag">Arma Compatível:</label>
                      <select
                        id="linkedWeaponMag"
                        value={linkedWeapon}
                        onChange={(e) => setLinkedWeapon(e.target.value)}
                        className="input"
                      >
                        <option value="">Selecione a arma (opcional)</option>
                        {inventory
                          .filter(item => item.category === 'armas' && item.weaponType === 'fogo')
                          .map(item => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}
                {itemCategory === 'dinheiro' && (
                  <>
                    <div className="form-group">
                      <label>Moedas:</label>
                      {moedas.map((moeda, index) => {
                        const moedaInfo = moedasDisponiveis.find(m => m.codigo === moeda.tipo);
                        return (
                          <div key={moeda.id} style={{ 
                            marginBottom: '1rem', 
                            padding: '1rem', 
                            background: darkMode ? '#404245' : '#f8f9fa',
                            borderRadius: '8px',
                            border: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`,
                            minWidth: 0,
                            overflow: 'hidden'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                <select
                                  value={moeda.tipo}
                                  onChange={(e) => {
                                    const newMoedas = [...moedas];
                                    const selectedMoeda = moedasDisponiveis.find(m => m.codigo === e.target.value);
                                    newMoedas[index] = {
                                      ...newMoedas[index],
                                      tipo: e.target.value,
                                      simbolo: selectedMoeda ? selectedMoeda.simbolo : '',
                                    };
                                    setMoedas(newMoedas);
                                  }}
                                  className="input"
                                  style={{ flex: 1 }}
                                >
                                  {moedasDisponiveis.map(m => (
                                    <option key={m.codigo} value={m.codigo}>
                                      {m.nome} ({m.simbolo})
                                    </option>
                                  ))}
                                </select>
                                {moeda.tipo === 'CUSTOM' && (
                                  <input
                                    type="text"
                                    value={moeda.simbolo}
                                    onChange={(e) => {
                                      const newMoedas = [...moedas];
                                      newMoedas[index] = { ...newMoedas[index], simbolo: e.target.value };
                                      setMoedas(newMoedas);
                                    }}
                                    placeholder="Símbolo"
                                    className="input"
                                    style={{ width: '80px' }}
                                  />
                                )}
                              </div>
                              {moedas.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMoedas(moedas.filter((_, i) => i !== index));
                                  }}
                                  style={{
                                    background: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    marginLeft: '0.5rem'
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', minWidth: 0 }}>
                              <div style={{ minWidth: 0 }}>
                                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                                  Débito:
                                </label>
                                <input
                                  type="number"
                                  value={moeda.debito === 0 ? '' : moeda.debito}
                                  onChange={(e) => {
                                    const newMoedas = [...moedas];
                                    newMoedas[index] = { ...newMoedas[index], debito: parseFloat(e.target.value) || 0 };
                                    setMoedas(newMoedas);
                                  }}
                                  placeholder="0.00"
                                  className="input"
                                  min="0"
                                  step="0.01"
                                  style={{ width: '100%', boxSizing: 'border-box' }}
                                />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                                  Crédito:
                                </label>
                                <input
                                  type="number"
                                  value={moeda.credito === 0 ? '' : moeda.credito}
                                  onChange={(e) => {
                                    const newMoedas = [...moedas];
                                    newMoedas[index] = { ...newMoedas[index], credito: parseFloat(e.target.value) || 0 };
                                    setMoedas(newMoedas);
                                  }}
                                  placeholder="0.00"
                                  className="input"
                                  min="0"
                                  step="0.01"
                                  style={{ width: '100%', boxSizing: 'border-box' }}
                                />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                                  Espécie:
                                </label>
                                <input
                                  type="number"
                                  value={moeda.dinheiroEspecie === 0 ? '' : moeda.dinheiroEspecie}
                                  onChange={(e) => {
                                    const newMoedas = [...moedas];
                                    newMoedas[index] = { ...newMoedas[index], dinheiroEspecie: parseFloat(e.target.value) || 0 };
                                    setMoedas(newMoedas);
                                  }}
                                  placeholder="0.00"
                                  className="input"
                                  min="0"
                                  step="0.01"
                                  style={{ width: '100%', boxSizing: 'border-box' }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setMoedas([...moedas, { 
                            id: Date.now().toString() + Math.random(), 
                            tipo: 'BRL', 
                            simbolo: 'R$', 
                            debito: 0, 
                            credito: 0, 
                            dinheiroEspecie: 0 
                          }]);
                        }}
                        style={{
                          background: darkMode ? '#7289da' : '#5b9bd5',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          width: '100%',
                          marginTop: '0.5rem'
                        }}
                      >
                        + Adicionar Moeda
                      </button>
                    </div>
                  </>
                )}
            <div className="form-group">
              <label htmlFor="itemQuantity">Quantidade:</label>
              <input
                id="itemQuantity"
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(Math.max(1, Number(e.target.value)))}
                className="input"
                min="1"
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {editingItem && (
                <button 
                  type="button" 
                  className="btn-submit" 
                  onClick={() => {
                    setEditingItem(null);
                    setItemName('');
                    setItemQuantity(1);
                    setItemCategory('geral');
                    setWeaponType('');
                    setAmmunitionType('');
                    setMagazineCapacity('');
                    setLinkedAmmunition('');
                    setLinkedMagazine('');
                    setLinkedWeapon('');
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem',
                    background: '#95a5a6',
                    flex: 1
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Cancelar
            </button>
              )}
              <button type="submit" className="btn-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flex: editingItem ? 2 : 1 }}>
                {editingItem ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Atualizar Item
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Adicionar ao Inventário
                  </>
                )}
              </button>
            </div>
          </form>
            </div>
          )}

          {activeInventoryTab === 'visualizar' && (
            <div className="inventory-tab-panel">
          {inventory.length === 0 ? (
            <div className="empty-state">
              <p>Inventário vazio.</p>
                  <p>Use a aba Cadastrar para adicionar itens!</p>
            </div>
          ) : (
                <div className="discord-view">
              {Object.keys(groupedInventory).map((category) => (
                    <div key={category} className="discord-section">
                      <div className="discord-section-title">
                        {category === 'armas' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={m4Icon} alt="Armas" style={{ width: '20px', height: '20px' }} />
                            ARMAS
                    </span>
                        )}
                        {category === 'armaduras' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={coleteIcon} alt="Armaduras" style={{ width: '20px', height: '20px' }} />
                            ARMADURAS
                          </span>
                        )}
                        {category === 'consumiveis' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={medicalIcon} alt="Consumíveis" style={{ width: '20px', height: '20px' }} />
                            CONSUMÍVEIS
                    </span>
                        )}
                        {category === 'magicos' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            ITENS MÁGICOS
                          </span>
                        )}
                        {category === 'municoes' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={municaoIcon} alt="Munições" style={{ width: '35px', height: '35px' }} />
                            MUNIÇÕES
                          </span>
                        )}
                        {category === 'carregadores' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={clipIcon} alt="Carregadores" style={{ width: '35px', height: '35px' }} />
                            CARREGADORES
                          </span>
                        )}
                        {category === 'geral' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.3"/>
                            </svg>
                            GERAL
                          </span>
                        )}
                        {category === 'dinheiro' && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src={dinheiroIcon} alt="Dinheiro" style={{ width: '20px', height: '20px' }} />
                            DINHEIRO
                          </span>
                        )}
                  </div>
                      <div className="discord-attributes">
                    {groupedInventory[category].map((item) => {
                            // Para carregadores, renderiza cada instância individualmente
                            if (item.category === 'carregadores') {
                              const capacity = parseInt(item.magazineCapacity) || 30;
                              let instances = [];
                              
                              if (item.instances && Array.isArray(item.instances)) {
                                // Sistema novo: usa instâncias existentes
                                instances = item.instances;
                                console.log('Renderizando carregadores com instâncias:', item.name, instances.map(i => ({ currentAmmo: i.currentAmmo, isLoaded: i.isLoaded })));
                              } else {
                                // Sistema antigo: cria instâncias baseadas na quantidade
                                const quantity = item.quantity || 1;
                                for (let i = 0; i < quantity; i++) {
                                  instances.push({
                                    instanceId: `${item.id}_${i}`,
                                    currentAmmo: 0 // Carregador novo começa vazio
                                  });
                                }
                              }
                              
                              // Renderiza cada instância individualmente
                              return instances.map((instance, instanceIndex) => (
                                <div key={`${item.id}-${instance.instanceId || instanceIndex}`} className="discord-attribute" style={{ position: 'relative' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                      <span className="discord-attr-name" style={{ flex: 1 }}>
                                        {item.name}
                                        {item.ammunitionType && ` (${item.ammunitionType})`}
                                        {` (${instance.currentAmmo !== undefined && instance.currentAmmo !== null ? instance.currentAmmo : 0}/${capacity} munições)`}
                                        :
                                      </span>
                                      <div style={{ position: 'relative' }}>
                                        <span className="discord-attr-value" style={{ userSelect: 'none' }}>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {item.category !== 'dinheiro' && (
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                      <button
                                        onClick={() => handleEditInventoryItem(item)}
                                        style={{
                                          padding: '0.25rem 0.5rem',
                                          background: 'rgba(114, 137, 218, 0.2)',
                                          border: '1px solid rgba(114, 137, 218, 0.3)',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          color: '#7289da',
                                          fontSize: '0.75rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = 'rgba(114, 137, 218, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = 'rgba(114, 137, 218, 0.2)';
                                        }}
                                        title="Editar item"
                                      >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm('Tem certeza que deseja excluir este item?')) {
                                            handleDeleteInventoryItem(item.id);
                                          }
                                        }}
                                        style={{
                                          padding: '0.25rem 0.5rem',
                                          background: 'rgba(123, 31, 162, 0.2)',
                                          border: '1px solid rgba(123, 31, 162, 0.3)',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          color: '#ba68c8',
                                          fontSize: '0.75rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = 'rgba(123, 31, 162, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = 'rgba(123, 31, 162, 0.2)';
                                        }}
                                        title="Excluir item"
                                      >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Excluir
                                      </button>
                                      {(item.linkedAmmunitions || item.linkedMagazine || item.linkedWeapon) && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowItemInfo(showItemInfo === item.id ? null : item.id);
                                          }}
                                          style={{
                                            padding: '0.25rem 0.5rem',
                                            background: showItemInfo === item.id ? (darkMode ? 'rgba(114, 137, 218, 0.3)' : 'rgba(91, 155, 213, 0.2)') : 'rgba(114, 137, 218, 0.2)',
                                            border: '1px solid rgba(114, 137, 218, 0.3)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: '#7289da',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            transition: 'all 0.2s ease'
                                          }}
                                          onMouseEnter={(e) => {
                                            if (showItemInfo !== item.id) {
                                              e.target.style.background = 'rgba(114, 137, 218, 0.3)';
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (showItemInfo !== item.id) {
                                              e.target.style.background = 'rgba(114, 137, 218, 0.2)';
                                            }
                                          }}
                                          title="Ver informações do item"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                          </svg>
                                          Info
                                        </button>
                                      )}
                                    </div>
                                  )}
                                  {showItemInfo === item.id && (
                                    <div 
                                      style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '0.5rem',
                                        padding: '1rem',
                                        background: darkMode ? '#3a3c40' : '#ffffff',
                                        border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        zIndex: 1000,
                                        minWidth: '250px',
                                        maxWidth: '400px'
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        marginBottom: '0.75rem',
                                        paddingBottom: '0.75rem',
                                        borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`
                                      }}>
                                        <h3 style={{ 
                                          margin: 0, 
                                          fontSize: '1rem', 
                                          fontWeight: '700',
                                          color: darkMode ? '#7289da' : '#5b9bd5'
                                        }}>
                                          Informações do Item
                                        </h3>
                                        <button
                                          onClick={() => setShowItemInfo(null)}
                                          style={{
                                            padding: '0.25rem',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: darkMode ? '#dcddde' : '#2c3e50',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '4px',
                                            transition: 'background 0.2s ease'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.background = darkMode ? 'rgba(114, 137, 218, 0.2)' : 'rgba(91, 155, 213, 0.1)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                          }}
                                        >
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                          </svg>
                                        </button>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div>
                                          <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600', 
                                            color: darkMode ? '#7289da' : '#5b9bd5',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            Nome:
                                          </span>
                                          <div style={{ 
                                            fontSize: '0.9rem', 
                                            color: darkMode ? '#dcddde' : '#2c3e50',
                                            marginTop: '0.25rem'
                                          }}>
                                            {item.name}
                                          </div>
                                        </div>
                                        <div>
                                          <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600', 
                                            color: darkMode ? '#7289da' : '#5b9bd5',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            Categoria:
                                          </span>
                                          <div style={{ 
                                            fontSize: '0.9rem', 
                                            color: darkMode ? '#dcddde' : '#2c3e50',
                                            marginTop: '0.25rem'
                                          }}>
                                            Carregadores
                                          </div>
                                        </div>
                                        {item.ammunitionType && (
                                          <div>
                                            <span style={{ 
                                              fontSize: '0.75rem', 
                                              fontWeight: '600', 
                                              color: darkMode ? '#7289da' : '#5b9bd5',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.5px'
                                            }}>
                                              Tipo de Munição Aceita:
                                            </span>
                                            <div style={{ 
                                              fontSize: '0.9rem', 
                                              color: darkMode ? '#dcddde' : '#2c3e50',
                                              marginTop: '0.25rem'
                                            }}>
                                              {item.ammunitionType}
                                            </div>
                                          </div>
                                        )}
                                        {item.magazineCapacity && (
                                          <div>
                                            <span style={{ 
                                              fontSize: '0.75rem', 
                                              fontWeight: '600', 
                                              color: darkMode ? '#7289da' : '#5b9bd5',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.5px'
                                            }}>
                                              Capacidade:
                                            </span>
                                            <div style={{ 
                                              fontSize: '0.9rem', 
                                              color: darkMode ? '#dcddde' : '#2c3e50',
                                              marginTop: '0.25rem'
                                            }}>
                                              {item.magazineCapacity} munições
                                            </div>
                                          </div>
                                        )}
                                        <div>
                                          <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600', 
                                            color: darkMode ? '#7289da' : '#5b9bd5',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            Munições Atuais:
                                          </span>
                                          <div style={{ 
                                            fontSize: '0.9rem', 
                                            color: darkMode ? '#dcddde' : '#2c3e50',
                                            marginTop: '0.25rem'
                                          }}>
                                            {instance.currentAmmo || 0}/{capacity}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ));
                            }
                            
                            // Para outros itens (não carregadores), renderiza normalmente
                            return (
                          <div key={item.id} className="discord-attribute" style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                <span className="discord-attr-name" style={{ flex: 1 }}>
                                  {item.name}
                                  {item.category === 'municoes' && item.ammunitionType && ` (${item.ammunitionType})`}
                                  {item.category === 'carregadores' && item.ammunitionType && ` (${item.ammunitionType})`}
                                  {item.magazineCapacity && ` (${item.magazineCapacity} munições)`}
                                  {item.category === 'dinheiro' && item.moedas && item.moedas.length > 0 && (
                                    <div style={{
                                      marginTop: '0.5rem',
                                      padding: '0.75rem',
                                      background: darkMode ? '#3a3c40' : '#ffffff',
                                      borderRadius: '6px',
                                      border: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`,
                                      fontFamily: 'monospace',
                                      fontSize: '0.85rem'
                                    }}>
                                      {item.moedas.map((moeda, idx) => {
                                        const moedaInfo = moedasDisponiveis.find(m => m.codigo === moeda.tipo);
                                        const simbolo = moeda.simbolo || (moedaInfo ? moedaInfo.simbolo : '');
                                        const fieldKeyDebito = `${item.id}-${moeda.id}-debito`;
                                        const fieldKeyCredito = `${item.id}-${moeda.id}-credito`;
                                        const fieldKeyEspecie = `${item.id}-${moeda.id}-especie`;
                                        const total = (moeda.debito || 0) + (moeda.credito || 0) + (moeda.dinheiroEspecie || 0);
                                        
                                        return (
                                          <div key={idx} style={{ marginBottom: idx < item.moedas.length - 1 ? '0.75rem' : '0', paddingBottom: idx < item.moedas.length - 1 ? '0.75rem' : '0', borderBottom: idx < item.moedas.length - 1 ? `1px dashed ${darkMode ? '#4a4d52' : '#e3e8ed'}` : 'none' }}>
                                            <div style={{ 
                                              fontWeight: '600', 
                                              marginBottom: '0.5rem',
                                              color: darkMode ? '#7289da' : '#5b9bd5',
                                              fontSize: '0.9rem'
                                            }}>
                                              {moedaInfo ? moedaInfo.nome : moeda.tipo} ({simbolo})
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                              {moeda.debito > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <span style={{ color: darkMode ? '#dcddde' : '#2c3e50' }}>Débito</span>
                                                  {editingMoneyField === fieldKeyDebito ? (
                                                    <input
                                                      type="text"
                                                      className="life-operation-input"
                                                      value={tempMoneyValue}
                                                      onChange={(e) => setTempMoneyValue(e.target.value)}
                                                      onBlur={() => {
                                                        const input = tempMoneyValue.trim();
                                                        if (input) {
                                                          const currentValue = moeda.debito || 0;
                                                          if (input.startsWith('+')) {
                                                            const value = parseFloat(input.substring(1)) || 0;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'debito', Math.max(0, currentValue + value));
                                                          } else if (input.startsWith('-')) {
                                                            const value = parseFloat(input.substring(1)) || 0;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'debito', Math.max(0, currentValue - value));
                                                          } else if (input.startsWith('*')) {
                                                            const value = parseFloat(input.substring(1)) || 1;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'debito', Math.max(0, currentValue * value));
                                                          } else if (input.startsWith('/')) {
                                                            const value = parseFloat(input.substring(1)) || 1;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'debito', Math.max(0, currentValue / value));
                                                          } else {
                                                            const value = parseFloat(input);
                                                            if (!isNaN(value)) {
                                                              handleUpdateMoneyField(item.id, moeda.id, 'debito', Math.max(0, value));
                                                            }
                                                          }
                                                        }
                                                        setEditingMoneyField(null);
                                                      }}
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.target.blur();
                                                        } else if (e.key === 'Escape') {
                                                          setEditingMoneyField(null);
                                                        }
                                                      }}
                                                      placeholder={formatMoney(moeda.debito || 0)}
                                                      autoFocus
                                                      style={{
                                                        width: '120px',
                                                        textAlign: 'right',
                                                        fontSize: '0.85rem',
                                                        padding: '0.25rem',
                                                        border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                                        borderRadius: '4px',
                                                        background: darkMode ? '#404245' : '#fff',
                                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                                        outline: 'none'
                                                      }}
                                                    />
                                                  ) : (
                                                    <span 
                                                      style={{ 
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                        padding: '0.125rem 0.25rem',
                                                        borderRadius: '4px',
                                                        transition: 'background 0.2s',
                                                        backgroundColor: 'transparent',
                                                        fontWeight: '600',
                                                        color: darkMode ? '#dcddde' : '#2c3e50'
                                                      }}
                                                      onClick={() => {
                                                        setTempMoneyValue('');
                                                        setEditingMoneyField(fieldKeyDebito);
                                                      }}
                                                      onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = darkMode ? 'rgba(114, 137, 218, 0.1)' : 'rgba(91, 155, 213, 0.05)';
                                                      }}
                                                      onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                      }}
                                                    >
                                                      {simbolo}{formatMoney(moeda.debito || 0)}
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                              {moeda.credito > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <span style={{ color: darkMode ? '#dcddde' : '#2c3e50' }}>Crédito</span>
                                                  {editingMoneyField === fieldKeyCredito ? (
                                                    <input
                                                      type="text"
                                                      className="life-operation-input"
                                                      value={tempMoneyValue}
                                                      onChange={(e) => setTempMoneyValue(e.target.value)}
                                                      onBlur={() => {
                                                        const input = tempMoneyValue.trim();
                                                        if (input) {
                                                          const currentValue = moeda.credito || 0;
                                                          if (input.startsWith('+')) {
                                                            const value = parseFloat(input.substring(1)) || 0;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'credito', Math.max(0, currentValue + value));
                                                          } else if (input.startsWith('-')) {
                                                            const value = parseFloat(input.substring(1)) || 0;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'credito', Math.max(0, currentValue - value));
                                                          } else if (input.startsWith('*')) {
                                                            const value = parseFloat(input.substring(1)) || 1;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'credito', Math.max(0, currentValue * value));
                                                          } else if (input.startsWith('/')) {
                                                            const value = parseFloat(input.substring(1)) || 1;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'credito', Math.max(0, currentValue / value));
                                                          } else {
                                                            const value = parseFloat(input);
                                                            if (!isNaN(value)) {
                                                              handleUpdateMoneyField(item.id, moeda.id, 'credito', Math.max(0, value));
                                                            }
                                                          }
                                                        }
                                                        setEditingMoneyField(null);
                                                      }}
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.target.blur();
                                                        } else if (e.key === 'Escape') {
                                                          setEditingMoneyField(null);
                                                        }
                                                      }}
                                                      placeholder={formatMoney(moeda.credito || 0)}
                                                      autoFocus
                                                      style={{
                                                        width: '120px',
                                                        textAlign: 'right',
                                                        fontSize: '0.85rem',
                                                        padding: '0.25rem',
                                                        border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                                        borderRadius: '4px',
                                                        background: darkMode ? '#404245' : '#fff',
                                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                                        outline: 'none'
                                                      }}
                                                    />
                                                  ) : (
                                                    <span 
                                                      style={{ 
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                        padding: '0.125rem 0.25rem',
                                                        borderRadius: '4px',
                                                        transition: 'background 0.2s',
                                                        backgroundColor: 'transparent',
                                                        fontWeight: '600',
                                                        color: darkMode ? '#dcddde' : '#2c3e50'
                                                      }}
                                                      onClick={() => {
                                                        setTempMoneyValue('');
                                                        setEditingMoneyField(fieldKeyCredito);
                                                      }}
                                                      onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = darkMode ? 'rgba(114, 137, 218, 0.1)' : 'rgba(91, 155, 213, 0.05)';
                                                      }}
                                                      onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                      }}
                                                    >
                                                      {simbolo}{formatMoney(moeda.credito || 0)}
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                              {moeda.dinheiroEspecie > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <span style={{ color: darkMode ? '#dcddde' : '#2c3e50' }}>Espécie</span>
                                                  {editingMoneyField === fieldKeyEspecie ? (
                                                    <input
                                                      type="text"
                                                      className="life-operation-input"
                                                      value={tempMoneyValue}
                                                      onChange={(e) => setTempMoneyValue(e.target.value)}
                                                      onBlur={() => {
                                                        const input = tempMoneyValue.trim();
                                                        if (input) {
                                                          const currentValue = moeda.dinheiroEspecie || 0;
                                                          if (input.startsWith('+')) {
                                                            const value = parseFloat(input.substring(1)) || 0;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'especie', Math.max(0, currentValue + value));
                                                          } else if (input.startsWith('-')) {
                                                            const value = parseFloat(input.substring(1)) || 0;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'especie', Math.max(0, currentValue - value));
                                                          } else if (input.startsWith('*')) {
                                                            const value = parseFloat(input.substring(1)) || 1;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'especie', Math.max(0, currentValue * value));
                                                          } else if (input.startsWith('/')) {
                                                            const value = parseFloat(input.substring(1)) || 1;
                                                            handleUpdateMoneyField(item.id, moeda.id, 'especie', Math.max(0, currentValue / value));
                                                          } else {
                                                            const value = parseFloat(input);
                                                            if (!isNaN(value)) {
                                                              handleUpdateMoneyField(item.id, moeda.id, 'especie', Math.max(0, value));
                                                            }
                                                          }
                                                        }
                                                        setEditingMoneyField(null);
                                                      }}
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.target.blur();
                                                        } else if (e.key === 'Escape') {
                                                          setEditingMoneyField(null);
                                                        }
                                                      }}
                                                      placeholder={formatMoney(moeda.dinheiroEspecie || 0)}
                                                      autoFocus
                                                      style={{
                                                        width: '120px',
                                                        textAlign: 'right',
                                                        fontSize: '0.85rem',
                                                        padding: '0.25rem',
                                                        border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                                        borderRadius: '4px',
                                                        background: darkMode ? '#404245' : '#fff',
                                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                                        outline: 'none'
                                                      }}
                                                    />
                                                  ) : (
                                                    <span 
                                                      style={{ 
                                                        cursor: 'pointer',
                                                        userSelect: 'none',
                                                        padding: '0.125rem 0.25rem',
                                                        borderRadius: '4px',
                                                        transition: 'background 0.2s',
                                                        backgroundColor: 'transparent',
                                                        fontWeight: '600',
                                                        color: darkMode ? '#dcddde' : '#2c3e50'
                                                      }}
                                                      onClick={() => {
                                                        setTempMoneyValue('');
                                                        setEditingMoneyField(fieldKeyEspecie);
                                                      }}
                                                      onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = darkMode ? 'rgba(114, 137, 218, 0.1)' : 'rgba(91, 155, 213, 0.05)';
                                                      }}
                                                      onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                      }}
                                                    >
                                                      {simbolo}{formatMoney(moeda.dinheiroEspecie || 0)}
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                              <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center',
                                                marginTop: '0.5rem',
                                                paddingTop: '0.5rem',
                                                borderTop: `2px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`,
                                                fontWeight: '700',
                                                fontSize: '0.95rem'
                                              }}>
                                                <span style={{ color: darkMode ? '#7289da' : '#5b9bd5' }}>TOTAL</span>
                                                <span style={{ color: darkMode ? '#7289da' : '#5b9bd5' }}>{simbolo}{formatMoney(total)}</span>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}` }}>
                                        <button
                                          onClick={() => handleEditInventoryItem(item)}
                                          style={{
                                            padding: '0.25rem 0.5rem',
                                            background: 'rgba(114, 137, 218, 0.2)',
                                            border: '1px solid rgba(114, 137, 218, 0.3)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: '#7289da',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            transition: 'all 0.2s ease',
                                            flex: 1
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(114, 137, 218, 0.3)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(114, 137, 218, 0.2)';
                                          }}
                                          title="Editar item"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Editar
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm('Tem certeza que deseja excluir este item?')) {
                                              handleDeleteInventoryItem(item.id);
                                            }
                                          }}
                                          style={{
                                            padding: '0.25rem 0.5rem',
                                            background: 'rgba(123, 31, 162, 0.2)',
                                            border: '1px solid rgba(123, 31, 162, 0.3)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: '#ba68c8',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            transition: 'all 0.2s ease',
                                            flex: 1
                                          }}
                                          onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(123, 31, 162, 0.3)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(123, 31, 162, 0.2)';
                                          }}
                                          title="Excluir item"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Excluir
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {item.category === 'dinheiro' && !item.moedas && (
                                    <>
                                      {item.debito > 0 && ` | Débito: ${formatMoney(item.debito)}`}
                                      {item.credito > 0 && ` | Crédito: ${formatMoney(item.credito)}`}
                                      {item.dinheiroEspecie > 0 && ` | Espécie: ${formatMoney(item.dinheiroEspecie)}`}
                                    </>
                                  )}
                                  {item.category !== 'dinheiro' && ':'}
                                </span>
                                <div style={{ position: 'relative' }}>
                                  <span 
                                    className="discord-attr-value"
                                    style={{ 
                                      cursor: item.category === 'municoes' ? 'pointer' : 'default',
                                      userSelect: 'none'
                                    }}
                                    onClick={() => {
                                      if (item.category === 'municoes') {
                                        setTempAmmunitionQuantity('');
                                        setEditingAmmunitionQuantity(item.id);
                                      }
                                    }}
                                  >
                                    ×{item.quantity}
                                  </span>
                                  {editingAmmunitionQuantity === item.id && item.category === 'municoes' && (
                                    <div 
                                      style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '0.5rem',
                                        padding: '0.75rem',
                                        background: darkMode ? '#3a3c40' : '#fff',
                                        border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        zIndex: 1000,
                                        minWidth: '200px'
                                      }}
                                    >
                                      <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                        paddingBottom: '0.5rem',
                                        borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`
                                      }}>
                                        <span style={{ 
                                          fontSize: '0.7rem', 
                                          fontWeight: '700', 
                                          color: darkMode ? '#7289da' : '#5b9bd5',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px'
                                        }}>
                                          ATUAL
                                        </span>
                                        <span style={{ 
                                          fontSize: '1.2rem', 
                                          fontWeight: '600', 
                                          color: darkMode ? '#dcddde' : '#2c3e50'
                                        }}>
                                          {item.quantity}
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        value={tempAmmunitionQuantity}
                                        onChange={(e) => setTempAmmunitionQuantity(e.target.value)}
                                        onBlur={() => {
                                          const input = tempAmmunitionQuantity.trim();
                                          
                                          if (input) {
                                            const currentQuantity = item.quantity;
                                            
                                            // Operação de adição (+X)
                                            if (input.startsWith('+')) {
                                              const value = parseInt(input.substring(1)) || 0;
                                              const newQuantity = Math.max(0, currentQuantity + value);
                                              handleUpdateQuantity(item.id, newQuantity);
                                            }
                                            // Operação de subtração (-X)
                                            else if (input.startsWith('-')) {
                                              const value = parseInt(input.substring(1)) || 0;
                                              const newQuantity = Math.max(0, currentQuantity - value);
                                              handleUpdateQuantity(item.id, newQuantity);
                                            }
                                            // Valor absoluto
                                            else {
                                              const value = parseInt(input);
                                              if (!isNaN(value) && value >= 0) {
                                                handleUpdateQuantity(item.id, value);
                                              }
                                            }
                                          }
                                          
                                          setEditingAmmunitionQuantity(null);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.target.blur();
                                          } else if (e.key === 'Escape') {
                                            setEditingAmmunitionQuantity(null);
                                          }
                                        }}
                                        placeholder="+10, -5, 50"
                                        autoFocus
                                        style={{
                                          width: '100%',
                                          padding: '0.5rem',
                                          fontSize: '0.9rem',
                                          border: `1px solid ${darkMode ? '#4a4d52' : '#d1dce5'}`,
                                          borderRadius: '4px',
                                          background: darkMode ? '#404245' : '#fff',
                                          color: darkMode ? '#dcddde' : '#2c3e50',
                                          outline: 'none'
                                        }}
                                      />
                                      <div style={{ 
                                        fontSize: '0.7rem', 
                                        color: darkMode ? '#72767d' : '#7f8c8d',
                                        marginTop: '0.25rem'
                                      }}>
                                        Digite +/- ou valor
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {item.category !== 'dinheiro' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                                onClick={() => handleEditInventoryItem(item)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(114, 137, 218, 0.2)',
                                  border: '1px solid rgba(114, 137, 218, 0.3)',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#7289da',
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'rgba(114, 137, 218, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'rgba(114, 137, 218, 0.2)';
                                }}
                                title="Editar item"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Editar
                            </button>
                            <button
                                onClick={() => {
                                  if (confirm('Tem certeza que deseja excluir este item?')) {
                                    handleDeleteInventoryItem(item.id);
                                  }
                                }}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(123, 31, 162, 0.2)',
                                  border: '1px solid rgba(123, 31, 162, 0.3)',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#ba68c8',
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'rgba(123, 31, 162, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'rgba(123, 31, 162, 0.2)';
                                }}
                                title="Excluir item"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Excluir
                            </button>
                            <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowItemInfo(showItemInfo === item.id ? null : item.id);
                                }}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  background: showItemInfo === item.id ? (darkMode ? 'rgba(114, 137, 218, 0.3)' : 'rgba(91, 155, 213, 0.2)') : 'rgba(114, 137, 218, 0.2)',
                                  border: '1px solid rgba(114, 137, 218, 0.3)',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#7289da',
                                  fontSize: '0.75rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  if (showItemInfo !== item.id) {
                                    e.target.style.background = 'rgba(114, 137, 218, 0.3)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (showItemInfo !== item.id) {
                                    e.target.style.background = 'rgba(114, 137, 218, 0.2)';
                                  }
                                }}
                                title="Ver informações do item"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                  <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                Info
                            </button>
                          </div>
                            )}
                            {showItemInfo === item.id && (
                              <div 
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  left: 0,
                                  right: 0,
                                  marginTop: '0.5rem',
                                  padding: '1rem',
                                  background: darkMode ? '#3a3c40' : '#ffffff',
                                  border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  zIndex: 1000,
                                  minWidth: '250px',
                                  maxWidth: '400px'
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  marginBottom: '0.75rem',
                                  paddingBottom: '0.75rem',
                                  borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`
                                }}>
                                  <h3 style={{ 
                                    margin: 0, 
                                    fontSize: '1rem', 
                                    fontWeight: '700',
                                    color: darkMode ? '#7289da' : '#5b9bd5'
                                  }}>
                                    Informações do Item
                                  </h3>
                                  <button
                                    onClick={() => setShowItemInfo(null)}
                                    style={{
                                      padding: '0.25rem',
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: darkMode ? '#dcddde' : '#2c3e50',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      borderRadius: '4px',
                                      transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = darkMode ? 'rgba(114, 137, 218, 0.2)' : 'rgba(91, 155, 213, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = 'transparent';
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                  <div>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      fontWeight: '600', 
                                      color: darkMode ? '#7289da' : '#5b9bd5',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      Nome:
                                    </span>
                                    <div style={{ 
                                      fontSize: '0.9rem', 
                                      color: darkMode ? '#dcddde' : '#2c3e50',
                                      marginTop: '0.25rem'
                                    }}>
                                      {item.name}
                                    </div>
                                  </div>
                                  <div>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      fontWeight: '600', 
                                      color: darkMode ? '#7289da' : '#5b9bd5',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      Categoria:
                                    </span>
                                    <div style={{ 
                                      fontSize: '0.9rem', 
                                      color: darkMode ? '#dcddde' : '#2c3e50',
                                      marginTop: '0.25rem'
                                    }}>
                                      {item.category === 'armas' ? 'Armas' : 
                                       item.category === 'municoes' ? 'Munições' :
                                       item.category === 'carregadores' ? 'Carregadores' :
                                       item.category === 'armaduras' ? 'Armaduras' :
                                       item.category === 'consumiveis' ? 'Consumíveis' :
                                       item.category === 'magicos' ? 'Itens Mágicos' :
                                       item.category === 'dinheiro' ? 'Dinheiro' : 'Geral'}
                                    </div>
                                  </div>
                                  {item.category === 'armas' && item.weaponType && (
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: darkMode ? '#7289da' : '#5b9bd5',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Tipo de Arma:
                                      </span>
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                        marginTop: '0.25rem'
                                      }}>
                                        {item.weaponType === 'fogo' ? 'Fogo' : item.weaponType === 'branca' ? 'Branca' : item.weaponType}
                                      </div>
                                    </div>
                                  )}
                                  {(() => {
                                    const ammoIds = Array.isArray(item.linkedAmmunitions) 
                                      ? item.linkedAmmunitions 
                                      : (item.linkedAmmunition ? [item.linkedAmmunition] : []);
                                    if (ammoIds.length > 0) {
                                      const ammos = inventory.filter(a => ammoIds.includes(a.id));
                                      return (
                                        <div>
                                          <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600', 
                                            color: darkMode ? '#7289da' : '#5b9bd5',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            Munições:
                                          </span>
                                          <div style={{ 
                                            fontSize: '0.9rem', 
                                            color: darkMode ? '#dcddde' : '#2c3e50',
                                            marginTop: '0.25rem'
                                          }}>
                                            {ammos.map(a => `${a.name} (${a.ammunitionType})`).join(', ') || 'N/A'}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                  {item.linkedMagazine && (
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: darkMode ? '#7289da' : '#5b9bd5',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Carregador:
                                      </span>
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                        marginTop: '0.25rem'
                                      }}>
                                        {inventory.find(m => m.id === item.linkedMagazine)?.name || 'N/A'}
                                      </div>
                                    </div>
                                  )}
                                  {item.linkedWeapon && (
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: darkMode ? '#7289da' : '#5b9bd5',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Arma Compatível:
                                      </span>
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                        marginTop: '0.25rem'
                                      }}>
                                        {inventory.find(w => w.id === item.linkedWeapon)?.name || 'N/A'}
                                      </div>
                                    </div>
                                  )}
                                  {item.category === 'municoes' && item.ammunitionType && (
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: darkMode ? '#7289da' : '#5b9bd5',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Tipo de Munição:
                                      </span>
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                        marginTop: '0.25rem'
                                      }}>
                                        {item.ammunitionType}
                                      </div>
                                    </div>
                                  )}
                                  {item.category === 'carregadores' && item.ammunitionType && (
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: darkMode ? '#7289da' : '#5b9bd5',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Tipo de Munição Aceita:
                                      </span>
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                        marginTop: '0.25rem'
                                      }}>
                                        {item.ammunitionType}
                                      </div>
                                    </div>
                                  )}
                                  {item.category === 'carregadores' && item.magazineCapacity && (
                                    <div>
                                      <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        color: darkMode ? '#7289da' : '#5b9bd5',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Capacidade:
                                      </span>
                                      <div style={{ 
                                        fontSize: '0.9rem', 
                                        color: darkMode ? '#dcddde' : '#2c3e50',
                                        marginTop: '0.25rem'
                                      }}>
                                        {item.magazineCapacity} munições
                                      </div>
                                    </div>
                                  )}
                                  <div>
                                    <span style={{ 
                                      fontSize: '0.75rem', 
                                      fontWeight: '600', 
                                      color: darkMode ? '#7289da' : '#5b9bd5',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      Quantidade:
                                    </span>
                                    <div style={{ 
                                      fontSize: '0.9rem', 
                                      color: darkMode ? '#dcddde' : '#2c3e50',
                                      marginTop: '0.25rem'
                                    }}>
                                      ×{item.quantity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                </div>
                        );
                      })}
                </div>
                </div>
                  ))}
              </div>
              )}
            </div>
          )}
        </div>

        {/* Quarta Coluna - Armamentos */}
        <div className="result-section">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 10h20M2 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="3" y="8" width="18" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <rect x="5" y="10" width="14" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
              <path d="M8 6h8M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            </svg>
            Armamentos
          </h2>
          
          <div className="weapons-content">
            <div className="weapon-section">
              <div className="weapon-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10h20M2 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="3" y="8" width="18" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="5" y="10" width="14" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
                  <path d="M8 6h8M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                <span className="weapon-label">Arma Principal</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', alignItems: 'center' }}>
                            <button
                    className="btn-change-weapon"
                    onClick={() => setShowPrimaryWeaponList(!showPrimaryWeaponList)}
                    title={showPrimaryWeaponList ? 'Ocultar lista' : 'Trocar arma'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {showPrimaryWeaponList ? (
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                            </button>
                          </div>
                        </div>
              {showPrimaryWeaponList && (
              <div className="weapon-checkboxes">
                {inventory.filter(item => item.category === 'armas').length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: darkMode ? '#72767d' : '#7f8c8d', fontSize: '0.875rem' }}>
                    Nenhuma arma cadastrada no inventário
                      </div>
                ) : (
                  inventory
                    .filter(item => item.category === 'armas')
                    .map(item => (
                      <label key={item.id} className="weapon-checkbox-item">
                        <input
                          type="checkbox"
                          checked={primaryWeapon?.id === item.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (primaryWeapon && primaryWeapon.id !== item.id) {
                              }
                              setPrimaryWeapon(item);
                              if (item.weaponType === 'fogo') {
                                setWeaponMagazine({ current: 0, max: 0 });
                                setCurrentPrimaryMagazineId(null);
                                setCurrentPrimaryMagazineInfo(null);
                                setPrevPrimaryMagazine({ current: 0, max: 0 });
                              } else {
                                setWeaponMagazine({ current: 0, max: 30 });
                              }
                            } else {
                              setPrimaryWeapon(null);
                              setWeaponMagazine({ current: 0, max: 0 });
                              setCurrentPrimaryMagazineId(null);
                              setCurrentPrimaryMagazineInfo(null);
                            }
                          }}
                        />
                        <span>
                          {item.name} 
                          {item.weaponType === 'fogo' ? ' [Fogo]' : item.weaponType === 'corpo-a-corpo' ? ' [Corpo a Corpo]' : ''} 
                          {' '}(×{item.quantity})
                        </span>
                      </label>
                    ))
                )}
                  </div>
              )}
              {primaryWeapon && (
                <div className="weapon-info">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span className="weapon-name" style={{ fontSize: '0.85rem' }}>{primaryWeapon.name}</span>
                      {primaryWeapon.weaponType === 'fogo' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', position: 'relative' }}>
                          <span style={{ fontSize: '0.7rem', color: darkMode ? '#7289da' : '#5b9bd5' }}>Carregador:</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: darkMode ? '#dcddde' : '#2c3e50',
                              cursor: currentPrimaryMagazineInfo ? 'pointer' : 'not-allowed',
                              userSelect: 'none',
                              padding: '0.15rem 0.3rem',
                              borderRadius: '3px',
                              background: currentPrimaryMagazineInfo 
                                ? (darkMode ? 'rgba(114, 137, 218, 0.1)' : 'rgba(91, 155, 213, 0.1)')
                                : (darkMode ? 'rgba(114, 137, 218, 0.05)' : 'rgba(91, 155, 213, 0.05)'),
                              border: `1px solid ${darkMode ? 'rgba(114, 137, 218, 0.3)' : 'rgba(91, 155, 213, 0.3)'}`,
                              opacity: currentPrimaryMagazineInfo ? 1 : 0.5
                            }}
                            onClick={() => {
                              if (currentPrimaryMagazineInfo) {
                                setTempMagazineValue('');
                                setEditingPrimaryMagazine(true);
                              } else {
                                showAlert('Selecione um carregador primeiro!', 'warning');
                              }
                            }}
                            title={currentPrimaryMagazineInfo ? 'Clique para editar' : 'Selecione um carregador primeiro'}
                          >
                            {weaponMagazine.max > 0 ? `${weaponMagazine.current} / ${weaponMagazine.max}` : '0 / 0 (Vazio)'}
                          </span>
                          {editingPrimaryMagazine && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                background: darkMode ? '#3a3c40' : '#fff',
                                border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '200px'
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                marginBottom: '0.5rem',
                                paddingBottom: '0.5rem',
                                borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`
                              }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  fontWeight: '700',
                                  color: darkMode ? '#7289da' : '#5b9bd5',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  ATUAL
                                </span>
                                <span style={{
                                  fontSize: '1.2rem',
                                  fontWeight: '600',
                                  color: darkMode ? '#dcddde' : '#2c3e50'
                                }}>
                                  {weaponMagazine.current} / {weaponMagazine.max}
                                </span>
                </div>
                              <input
                                type="text"
                                value={tempMagazineValue}
                                onChange={(e) => setTempMagazineValue(e.target.value)}
                                onBlur={() => {
                                  const input = tempMagazineValue.trim();
                                  
                                  if (input) {
                                    const currentCurrent = weaponMagazine.current;
                                    const currentMax = weaponMagazine.max;
                                    const prevCurrent = prevPrimaryMagazine.current;
                                    
                                    let newCurrent = currentCurrent;
                                    
                                    if (input.startsWith('+')) {
                                      const value = parseInt(input.substring(1)) || 0;
                                      newCurrent = Math.max(0, Math.min(currentMax, currentCurrent + value));
                                      setWeaponMagazine(prev => ({ ...prev, current: newCurrent }));
                                    }
                                    else if (input.startsWith('-')) {
                                      const value = parseInt(input.substring(1)) || 0;
                                      newCurrent = Math.max(0, currentCurrent - value);
                                      setWeaponMagazine(prev => ({ ...prev, current: newCurrent }));
                                    }
                                    else if (input.includes('/')) {
                                      const values = input.split('/').map(v => v.trim());
                                      if (values.length === 2) {
                                        const current = parseInt(values[0]) || 0;
                                        const max = parseInt(values[1]) || 1;
                                        newCurrent = Math.max(0, Math.min(max, current));
                                        setWeaponMagazine({
                                          current: newCurrent,
                                          max: Math.max(1, max)
                                        });
                                      }
                                    }
                                    else {
                                      const value = parseInt(input);
                                      if (!isNaN(value)) {
                                        newCurrent = Math.max(0, Math.min(currentMax, value));
                                        setWeaponMagazine(prev => ({
                                          ...prev,
                                          current: newCurrent
                                        }));
                                      }
                                    }
                                    
                                    setPrevPrimaryMagazine({ current: newCurrent, max: currentMax });
                                  }
                                  
                                  setEditingPrimaryMagazine(false);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  } else if (e.key === 'Escape') {
                                    setEditingPrimaryMagazine(false);
                                  }
                                }}
                                placeholder="+10, -5, 25/30, 25"
                                autoFocus
                                style={{
                                  width: '100%',
                                  padding: '0.5rem',
                                  fontSize: '0.9rem',
                                  border: `1px solid ${darkMode ? '#4a4d52' : '#d1dce5'}`,
                                  borderRadius: '4px',
                                  background: darkMode ? '#404245' : '#fff',
                                  color: darkMode ? '#dcddde' : '#2c3e50',
                                  outline: 'none'
                                }}
                              />
                              <div style={{
                                fontSize: '0.7rem',
                                color: darkMode ? '#72767d' : '#7f8c8d',
                                marginTop: '0.25rem'
                              }}>
                                Digite +/- ou valor (ex: +10, -5, 25/30)
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {primaryWeapon.weaponType && (
                      <div style={{ 
                        fontSize: '0.65rem', 
                        color: darkMode ? '#72767d' : '#7f8c8d',
                        padding: '0.125rem 0',
                        borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`,
                        paddingBottom: '0.25rem'
                      }}>
                        <strong>Tipo:</strong> {primaryWeapon.weaponType === 'fogo' ? 'Arma de Fogo' : primaryWeapon.weaponType === 'corpo-a-corpo' ? 'Arma Branca Corpo a Corpo' : primaryWeapon.weaponType}
                      </div>
                    )}
                    {primaryWeapon.weaponType === 'fogo' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.125rem',
                          marginBottom: '0.25rem'
                        }}>
                          <label style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: '600',
                            color: darkMode ? '#7289da' : '#5b9bd5'
                          }}>
                            Selecionar Carregador:
                          </label>
                          <select
                            value={selectedPrimaryMagazine || getCurrentMagazineSelectId(primaryWeapon, currentPrimaryMagazineInfo, currentPrimaryMagazineId, weaponMagazine, true)}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              if (selectedId) {
                                const allMagazines = getAllCompatibleMagazinesForSelect(primaryWeapon, true);
                                const selectedMagazine = allMagazines.find(m => m.id === selectedId);
                                if (selectedMagazine) {
                                  handleSelectMagazine(selectedMagazine, true);
                                }
                              } else {
                                setSelectedPrimaryMagazine('');
                              }
                            }}
                            style={{
                              padding: '0.375rem',
                              fontSize: '0.7rem',
                              border: `1px solid ${darkMode ? '#4a4d52' : '#d1dce5'}`,
                              borderRadius: '4px',
                              background: darkMode ? '#404245' : '#fff',
                              color: darkMode ? '#dcddde' : '#2c3e50',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Selecione um carregador...</option>
                            {getAllCompatibleMagazinesForSelect(primaryWeapon, true).map(mag => (
                              <option key={mag.id} value={mag.id}>
                                {mag.displayName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {primaryWeapon && primaryWeapon.weaponType === 'fogo' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.375rem' }}>
                              <button
                                className="btn-reload"
                                onClick={() => {
                                  if (!currentPrimaryMagazineInfo) {
                                    showAlert('Selecione um carregador primeiro!', 'warning');
                                    return;
                                  }
                                  handleReloadWeapon(true);
                                }}
                                disabled={!currentPrimaryMagazineInfo || weaponMagazine.max === 0 || weaponMagazine.current >= weaponMagazine.max || getAvailableMagazines(primaryWeapon).length === 0}
                                style={{ flex: 1 }}
                                title={!currentPrimaryMagazineInfo ? 'Selecione um carregador primeiro' : ''}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Recarregar Arma
                              </button>
                              <button
                                className="btn-load-magazines"
                                onClick={() => handleLoadMagazines(primaryWeapon)}
                                disabled={!getAvailableAmmunition(primaryWeapon) || getEmptyMagazines(primaryWeapon).length === 0}
                                style={{ flex: 1 }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Carregar Carregadores
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="weapon-section">
              <div className="weapon-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10h20M2 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="3" y="8" width="18" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="5" y="10" width="14" height="4" rx="0.5" fill="currentColor" opacity="0.3"/>
                  <path d="M8 6h8M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                <span className="weapon-label">Arma Secundária</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', alignItems: 'center' }}>
                  <button
                    className="btn-change-weapon"
                    onClick={() => setShowSecondaryWeaponList(!showSecondaryWeaponList)}
                    title={showSecondaryWeaponList ? 'Ocultar lista' : 'Trocar arma'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {showSecondaryWeaponList ? (
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              {showSecondaryWeaponList && (
              <div className="weapon-checkboxes">
                {inventory.filter(item => item.category === 'armas' && item.id !== primaryWeapon?.id).length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: darkMode ? '#72767d' : '#7f8c8d', fontSize: '0.875rem' }}>
                    {primaryWeapon ? 'Todas as armas já estão selecionadas' : 'Nenhuma arma cadastrada no inventário'}
                  </div>
                ) : (
                  inventory
                    .filter(item => item.category === 'armas' && item.id !== primaryWeapon?.id)
                    .map(item => (
                      <label key={item.id} className="weapon-checkbox-item">
                        <input
                          type="checkbox"
                          checked={secondaryWeapon?.id === item.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (secondaryWeapon && secondaryWeapon.id !== item.id) {
                              }
                              setSecondaryWeapon(item);
                              if (item.weaponType === 'fogo') {
                                setSecondaryWeaponMagazine({ current: 0, max: 0 });
                                setCurrentSecondaryMagazineId(null);
                                setCurrentSecondaryMagazineInfo(null);
                                setPrevSecondaryMagazine({ current: 0, max: 0 });
                              } else {
                                setSecondaryWeaponMagazine({ current: 0, max: 30 });
                              }
                            } else {
                              setSecondaryWeapon(null);
                              setSecondaryWeaponMagazine({ current: 0, max: 0 });
                              setCurrentSecondaryMagazineId(null);
                              setCurrentSecondaryMagazineInfo(null);
                            }
                          }}
                        />
                        <span>
                          {item.name} 
                          {item.weaponType === 'fogo' ? ' [Fogo]' : item.weaponType === 'corpo-a-corpo' ? ' [Corpo a Corpo]' : ''} 
                          {' '}(×{item.quantity})
                  </span>
                      </label>
                    ))
                )}
                </div>
              )}
              {secondaryWeapon && (
                <div className="weapon-info">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span className="weapon-name" style={{ fontSize: '0.85rem' }}>{secondaryWeapon.name}</span>
                      {secondaryWeapon.weaponType === 'fogo' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', position: 'relative' }}>
                          <span style={{ fontSize: '0.7rem', color: darkMode ? '#7289da' : '#5b9bd5' }}>Carregador:</span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: darkMode ? '#dcddde' : '#2c3e50',
                              cursor: currentSecondaryMagazineInfo ? 'pointer' : 'not-allowed',
                              userSelect: 'none',
                              padding: '0.15rem 0.3rem',
                              borderRadius: '3px',
                              background: currentSecondaryMagazineInfo 
                                ? (darkMode ? 'rgba(114, 137, 218, 0.1)' : 'rgba(91, 155, 213, 0.1)')
                                : (darkMode ? 'rgba(114, 137, 218, 0.05)' : 'rgba(91, 155, 213, 0.05)'),
                              border: `1px solid ${darkMode ? 'rgba(114, 137, 218, 0.3)' : 'rgba(91, 155, 213, 0.3)'}`,
                              opacity: currentSecondaryMagazineInfo ? 1 : 0.5
                            }}
                            onClick={() => {
                              if (currentSecondaryMagazineInfo) {
                                setTempMagazineValue('');
                                setEditingSecondaryMagazine(true);
                              } else {
                                showAlert('Selecione um carregador primeiro!', 'warning');
                              }
                            }}
                            title={currentSecondaryMagazineInfo ? 'Clique para editar' : 'Selecione um carregador primeiro'}
                          >
                            {secondaryWeaponMagazine.max > 0 ? `${secondaryWeaponMagazine.current} / ${secondaryWeaponMagazine.max}` : '0 / 0 (Vazio)'}
                          </span>
                          {editingSecondaryMagazine && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  marginTop: '0.5rem',
                                  padding: '0.75rem',
                                  background: darkMode ? '#3a3c40' : '#fff',
                                  border: `2px solid ${darkMode ? '#7289da' : '#5b9bd5'}`,
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  zIndex: 1000,
                                  minWidth: '200px'
                                }}
                              >
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.5rem',
                                  marginBottom: '0.5rem',
                                  paddingBottom: '0.5rem',
                                  borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`
                                }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    color: darkMode ? '#7289da' : '#5b9bd5',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                  }}>
                                    ATUAL
                                  </span>
                                  <span style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    color: darkMode ? '#dcddde' : '#2c3e50'
                                  }}>
                                    {secondaryWeaponMagazine.current} / {secondaryWeaponMagazine.max}
                                  </span>
                </div>
                                <input
                                  type="text"
                                  value={tempMagazineValue}
                                  onChange={(e) => setTempMagazineValue(e.target.value)}
                                  onBlur={() => {
                                    const input = tempMagazineValue.trim();
                                    
                                    if (input) {
                                      const currentCurrent = secondaryWeaponMagazine.current;
                                      const currentMax = secondaryWeaponMagazine.max;
                                      
                                      let newCurrent = currentCurrent;
                                      
                                      if (input.startsWith('+')) {
                                        const value = parseInt(input.substring(1)) || 0;
                                        newCurrent = Math.max(0, Math.min(currentMax, currentCurrent + value));
                                        setSecondaryWeaponMagazine(prev => ({ ...prev, current: newCurrent }));
                                      }
                                      else if (input.startsWith('-')) {
                                        const value = parseInt(input.substring(1)) || 0;
                                        newCurrent = Math.max(0, currentCurrent - value);
                                        setSecondaryWeaponMagazine(prev => ({ ...prev, current: newCurrent }));
                                      }
                                      else if (input.includes('/')) {
                                        const values = input.split('/').map(v => v.trim());
                                        if (values.length === 2) {
                                          const current = parseInt(values[0]) || 0;
                                          const max = parseInt(values[1]) || 1;
                                          newCurrent = Math.max(0, Math.min(max, current));
                                          setSecondaryWeaponMagazine({
                                            current: newCurrent,
                                            max: Math.max(1, max)
                                          });
                                        }
                                      }
                                      else {
                                        const value = parseInt(input);
                                        if (!isNaN(value)) {
                                          newCurrent = Math.max(0, Math.min(currentMax, value));
                                          setSecondaryWeaponMagazine(prev => ({
                                            ...prev,
                                            current: newCurrent
                                          }));
                                        }
                                      }
                                      
                                      setPrevSecondaryMagazine({ current: newCurrent, max: currentMax });
                                    }
                                    
                                    setEditingSecondaryMagazine(false);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.target.blur();
                                    } else if (e.key === 'Escape') {
                                      setEditingSecondaryMagazine(false);
                                    }
                                  }}
                                  placeholder="+10, -5, 25/30, 25"
                                  autoFocus
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    fontSize: '0.9rem',
                                    border: `1px solid ${darkMode ? '#4a4d52' : '#d1dce5'}`,
                                    borderRadius: '4px',
                                    background: darkMode ? '#404245' : '#fff',
                                    color: darkMode ? '#dcddde' : '#2c3e50',
                                    outline: 'none'
                                  }}
                                />
                                <div style={{
                                  fontSize: '0.7rem',
                                  color: darkMode ? '#72767d' : '#7f8c8d',
                                  marginTop: '0.25rem'
                                }}>
                                  Digite +/- ou valor (ex: +10, -5, 25/30)
              </div>
            </div>
          )}
        </div>
                      )}
                    </div>
                    {secondaryWeapon.weaponType && (
                      <div style={{ 
                        fontSize: '0.65rem', 
                        color: darkMode ? '#72767d' : '#7f8c8d',
                        padding: '0.125rem 0',
                        borderBottom: `1px solid ${darkMode ? '#4a4d52' : '#e3e8ed'}`,
                        paddingBottom: '0.25rem'
                      }}>
                        <strong>Tipo:</strong> {secondaryWeapon.weaponType === 'fogo' ? 'Arma de Fogo' : secondaryWeapon.weaponType === 'corpo-a-corpo' ? 'Arma Branca Corpo a Corpo' : secondaryWeapon.weaponType}
                      </div>
                    )}
                    {secondaryWeapon.weaponType === 'fogo' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.125rem',
                          marginBottom: '0.25rem'
                        }}>
                          <label style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: '600',
                            color: darkMode ? '#7289da' : '#5b9bd5'
                          }}>
                            Selecionar Carregador:
                          </label>
                          <select
                            value={selectedSecondaryMagazine || getCurrentMagazineSelectId(secondaryWeapon, currentSecondaryMagazineInfo, currentSecondaryMagazineId, secondaryWeaponMagazine, false)}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              if (selectedId) {
                                const allMagazines = getAllCompatibleMagazinesForSelect(secondaryWeapon, false);
                                const selectedMagazine = allMagazines.find(m => m.id === selectedId);
                                if (selectedMagazine) {
                                  handleSelectMagazine(selectedMagazine, false);
                                }
                              } else {
                                setSelectedSecondaryMagazine('');
                              }
                            }}
                            style={{
                              padding: '0.375rem',
                              fontSize: '0.7rem',
                              border: `1px solid ${darkMode ? '#4a4d52' : '#d1dce5'}`,
                              borderRadius: '4px',
                              background: darkMode ? '#404245' : '#fff',
                              color: darkMode ? '#dcddde' : '#2c3e50',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Selecione um carregador...</option>
                            {getAllCompatibleMagazinesForSelect(secondaryWeapon, false).map(mag => (
                              <option key={mag.id} value={mag.id}>
                                {mag.displayName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {secondaryWeapon && secondaryWeapon.weaponType === 'fogo' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.375rem' }}>
                              <button
                                className="btn-reload"
                                onClick={() => {
                                  if (!currentSecondaryMagazineInfo) {
                                    showAlert('Selecione um carregador primeiro!', 'warning');
                                    return;
                                  }
                                  handleReloadWeapon(false);
                                }}
                                disabled={!currentSecondaryMagazineInfo || secondaryWeaponMagazine.max === 0 || secondaryWeaponMagazine.current >= secondaryWeaponMagazine.max || getAvailableMagazines(secondaryWeapon).length === 0}
                                title={!currentSecondaryMagazineInfo ? 'Selecione um carregador primeiro' : ''}
                                style={{ flex: 1 }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Recarregar Arma
                              </button>
                              <button
                                className="btn-load-magazines"
                                onClick={() => handleLoadMagazines(secondaryWeapon)}
                                disabled={!getAvailableAmmunition(secondaryWeapon) || getEmptyMagazines(secondaryWeapon).length === 0}
                                style={{ flex: 1 }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Carregar Carregadores
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Alert 
        message={alert.message} 
        type={alert.type} 
        onClose={() => setAlert({ message: null, type: 'info' })} 
      />
    </div>
  );
}

export default App;
