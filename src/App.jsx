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
import './App.css';
const API_URL = 'http://localhost:3001/api';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
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
  const [debitAmount, setDebitAmount] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [currency, setCurrency] = useState('BRL');
  const [editingDebit, setEditingDebit] = useState(null);
  const [editingCredit, setEditingCredit] = useState(null);
  const [editingCash, setEditingCash] = useState(null);
  const [tempDebit, setTempDebit] = useState('');
  const [tempCredit, setTempCredit] = useState('');
  const [tempCash, setTempCash] = useState('');
  const [linkedAmmunitions, setLinkedAmmunitions] = useState([]);
  const [linkedMagazine, setLinkedMagazine] = useState('');
  const [linkedWeapon, setLinkedWeapon] = useState('');
  const [selectedAmmunitionToAdd, setSelectedAmmunitionToAdd] = useState('');
  const [activeFichaTab, setActiveFichaTab] = useState('form');
  const [activeFirstGridTab, setActiveFirstGridTab] = useState('formulario');
  const [editingAmmunitionQuantity, setEditingAmmunitionQuantity] = useState(null);
  const [tempAmmunitionQuantity, setTempAmmunitionQuantity] = useState('');
  const [activeInventoryTab, setActiveInventoryTab] = useState('cadastrar');
  const [primaryWeapon, setPrimaryWeapon] = useState(null);
  const [secondaryWeapon, setSecondaryWeapon] = useState(null);
  const [weaponMagazine, setWeaponMagazine] = useState({ current: 0, max: 0 });
  const [secondaryWeaponMagazine, setSecondaryWeaponMagazine] = useState({ current: 0, max: 0 });
  const [currentPrimaryMagazineId, setCurrentPrimaryMagazineId] = useState(null);
  const [currentPrimaryMagazineInfo, setCurrentPrimaryMagazineInfo] = useState(null);
  const [currentSecondaryMagazineId, setCurrentSecondaryMagazineId] = useState(null);
  const [currentSecondaryMagazineInfo, setCurrentSecondaryMagazineInfo] = useState(null);
  const [showPrimaryWeaponList, setShowPrimaryWeaponList] = useState(false);
  const [showSecondaryWeaponList, setShowSecondaryWeaponList] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [importedTxtFileName, setImportedTxtFileName] = useState(null);
  const [importedTxtContent, setImportedTxtContent] = useState(null);
  const [importedTxtFileHandle, setImportedTxtFileHandle] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
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
    setItems(items.map(item => 
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      'BRL': 'R$',
      'USD': 'US$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CNY': '¥',
      'ARS': '$',
      'MXN': '$',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    return symbols[currencyCode] || currencyCode;
  };

  const formatCurrency = (value, currencyCode) => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const groupedByType = items.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  const groupedInventory = inventory.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  // Funções de salvamento e carregamento
  const saveAll = async () => {
    try {
      const response = await fetch(`${API_URL}/save-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        if (importedTxtFileName) {
          const txtContent = generateTxtContent();
          const saved = await saveTxtFile(txtContent, importedTxtFileName);
          if (saved) {
            alert('✅ Todos os dados foram salvos com sucesso! O arquivo TXT foi sobrescrito.');
          } else {
            alert('✅ Todos os dados foram salvos com sucesso! (Download do TXT cancelado)');
          }
        } else {
          alert('✅ Todos os dados foram salvos com sucesso!');
        }
      } else {
        alert('⚠️ Erro ao salvar dados');
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('⚠️ Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.');
    }
  };

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
        alert('✅ Dados carregados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('⚠️ Erro ao conectar com o servidor. Certifique-se de que o backend está rodando.');
    }
  };

  const generateTxtContent = () => {
    let txtContent = '';
    const itemsByType = {};
    items.forEach(item => {
      if (!itemsByType[item.type]) {
        itemsByType[item.type] = [];
      }
      itemsByType[item.type].push(item);
    });
    
    txtContent += '=== FICHA TÉCNICA ===\n\n';
    txtContent += `VIDA: ${currentLife}/${maxLife}\n`;
    txtContent += `SANIDADE: ${currentSanity}/${maxSanity}\n\n`;
    
    Object.keys(itemsByType).forEach(type => {
      txtContent += `${type}:\n`;
      itemsByType[type].forEach(item => {
        txtContent += `  ((Atributo)${item.key}): ((valor)${item.value})\n`;
      });
      txtContent += '\n';
    });

    txtContent += '\n=== INVENTÁRIO ===\n\n';
    if (inventory.length === 0) {
      txtContent += 'Inventário vazio.\n';
    } else {
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
            const loadedQty = item.instances.filter(inst => inst.isLoaded && inst.currentAmmo === parseInt(item.magazineCapacity || 30)).length;
            const emptyQty = item.instances.filter(inst => !inst.isLoaded && inst.currentAmmo === 0).length;
            const partialQty = item.instances.filter(inst => inst.currentAmmo > 0 && inst.currentAmmo < parseInt(item.magazineCapacity || 30)).length;
            txtContent += `  ${item.name} (${item.ammunitionType || 'N/A'}): Total=${item.quantity}, Carregados=${loadedQty}, Vazios=${emptyQty}, Parciais=${partialQty}\n`;
          } else if (item.category === 'armas' && item.weaponType === 'fogo') {
            const ammoInfo = item.linkedAmmunitions && item.linkedAmmunitions.length > 0
              ? item.linkedAmmunitions.map(id => {
                  const ammo = inventory.find(i => i.id === id);
                  return ammo ? ammo.name : id;
                }).join(', ')
              : 'Nenhuma';
            txtContent += `  ${item.name} (${item.weaponType}): Munições=${ammoInfo}\n`;
          } else if (item.category === 'dinheiro') {
            const currencySymbol = getCurrencySymbol(item.currency || 'BRL');
            txtContent += `  ${item.name} (${item.currency || 'BRL'}): Débito=${currencySymbol} ${(item.debitAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, Crédito=${currencySymbol} ${(item.creditAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, Espécie=${currencySymbol} ${(item.cashAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
          } else {
            txtContent += `  ${item.name}: Quantidade=${item.quantity}${item.ammunitionType ? `, Tipo=${item.ammunitionType}` : ''}\n`;
          }
        });
        txtContent += '\n';
      });
    }

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

  const saveTxtFile = async (content, filename) => {
    if ('showSaveFilePicker' in window && importedTxtFileName) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description: 'Arquivos de texto', accept: { 'text/plain': ['.txt'] } }]
        });
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Erro ao salvar com File System Access API, usando download padrão:', error);
        } else {
          return false;
        }
      }
    }
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

  const saveToTxtWithAppend = async () => {
    try {
      if (!('showSaveFilePicker' in window)) {
        alert('⚠️ Seu navegador não suporta a seleção de arquivos. Use Chrome, Edge ou outro navegador compatível.');
        return;
      }
      let fileHandle;
      try {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: 'ficha-rpg.txt',
          types: [{ description: 'Arquivos de texto', accept: { 'text/plain': ['.txt'] } }]
        });
      } catch (error) {
        if (error.name === 'AbortError') return;
        throw error;
      }
      const newContent = generateTxtContent();
      let contentToWrite = newContent;
      try {
        const file = await fileHandle.getFile();
        const existingContent = await file.text();
        if (existingContent.trim().length > 0) {
          const timestamp = new Date().toLocaleString('pt-BR');
          contentToWrite = existingContent + '\n\n' + '='.repeat(50) + '\n' + `SALVAMENTO: ${timestamp}\n` + '='.repeat(50) + '\n\n' + newContent;
        }
      } catch (error) {}
      const writable = await fileHandle.createWritable();
      await writable.write(contentToWrite);
      await writable.close();
      alert('✅ Dados salvos no arquivo TXT com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar em TXT:', error);
      alert('⚠️ Erro ao salvar arquivo TXT. Certifique-se de que seu navegador suporta File System Access API.');
    }
  };

  const importFromTxt = async () => {
    try {
      if (!('showOpenFilePicker' in window)) {
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
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{ description: 'Arquivos de texto', accept: { 'text/plain': ['.txt'] } }]
      });
      const file = await fileHandle.getFile();
      const text = await file.text();
      parseFullTxtFile(text);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao importar TXT:', error);
        alert('⚠️ Erro ao importar arquivo TXT.');
      }
    }
  };

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

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

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
        continue;
      } else if (line.match(/^=+$/)) {
        continue;
      }

      if (currentSection === 'ficha') {
        const lifeMatch = line.match(/^VIDA:\s*(\d+)\/(\d+)$/i);
        if (lifeMatch) {
          parsedLife = {
            current: parseInt(lifeMatch[1]) || 0,
            max: parseInt(lifeMatch[2]) || 100
          };
          continue;
        }
        const sanityMatch = line.match(/^SANIDADE:\s*(\d+)\/(\d+)$/i);
        if (sanityMatch) {
          parsedSanity = {
            current: parseInt(sanityMatch[1]) || 0,
            max: parseInt(sanityMatch[2]) || 100
          };
          continue;
        }
        const typeMatch = line.match(/^([A-ZÁÊÇ]+):$/);
        if (typeMatch) {
          currentType = typeMatch[1].trim();
          continue;
        }
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

      if (currentSection === 'inventory') {
        if (line.includes('Inventário vazio')) continue;
        const categoryMatch = line.match(/^([A-Z_]+):$/);
        if (categoryMatch) {
          currentType = categoryMatch[1].toLowerCase();
          continue;
        }
        const itemMatch = line.match(/^\s*(.+?):\s*(.+)$/);
        if (itemMatch) {
          const itemName = itemMatch[1].trim();
          const itemData = itemMatch[2].trim();
          const quantityMatch = itemData.match(/Quantidade[=:](\d+)/i) || itemData.match(/Total[=:](\d+)/i);
          const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
          const typeMatch = itemName.match(/^(.+?)\s*\(([^)]+)\)$/);
          const cleanName = typeMatch ? typeMatch[1].trim() : itemName;
          const ammoType = typeMatch ? typeMatch[2].trim() : null;

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

            for (let j = 0; j < loadedQty; j++) {
              instances.push({
                instanceId: `${Date.now()}_${j}_${Math.random()}`,
                isLoaded: true,
                currentAmmo: capacity
              });
            }
            for (let j = 0; j < emptyQty; j++) {
              instances.push({
                instanceId: `${Date.now()}_${j + loadedQty}_${Math.random()}`,
                isLoaded: false,
                currentAmmo: 0
              });
            }
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
          } else if (currentType === 'dinheiro') {
            const currencyMatch = itemName.match(/\(([A-Z]{3})\)$/);
            const extractedCurrency = currencyMatch ? currencyMatch[1] : 'BRL';
            const cleanNameWithoutCurrency = currencyMatch ? itemName.replace(/\s*\([A-Z]{3}\)$/, '').trim() : cleanName;
            const debitMatch = itemData.match(/Débito[=:]([A-Z$€£¥C]+\s*)?([\d.,]+)/i);
            const creditMatch = itemData.match(/Crédito[=:]([A-Z$€£¥C]+\s*)?([\d.,]+)/i);
            const cashMatch = itemData.match(/Espécie[=:]([A-Z$€£¥C]+\s*)?([\d.,]+)/i);
            const debitValue = debitMatch ? parseFloat(debitMatch[2].replace(/\./g, '').replace(',', '.')) || 0 : 0;
            const creditValue = creditMatch ? parseFloat(creditMatch[2].replace(/\./g, '').replace(',', '.')) || 0 : 0;
            const cashValue = cashMatch ? parseFloat(cashMatch[2].replace(/\./g, '').replace(',', '.')) || 0 : 0;

            newInventory.push({
              id: Date.now().toString() + Math.random() + i,
              name: cleanNameWithoutCurrency,
              category: 'dinheiro',
              quantity: 1,
              debitAmount: debitValue,
              creditAmount: creditValue,
              cashAmount: cashValue,
              currency: extractedCurrency
            });
          } else {
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

    alert(`✅ Importação concluída!\n- ${newItems.length} atributos\n- ${newInventory.length} itens do inventário`);
  };

  useEffect(() => {
    const sanityItems = items.filter(item => {
      const keyLower = item.key.toLowerCase();
      return keyLower.includes('sanidade') || keyLower.includes('sanity') || keyLower.includes('san');
    });

    let totalSanityPoints = 0;
    sanityItems.forEach(item => {
      const value = item.value;
      if (value.includes('/')) {
        const parts = value.split('/');
        const currentValue = parseInt(parts[0]) || 0;
        totalSanityPoints += currentValue;
      } else {
        const numValue = parseInt(value) || 0;
        totalSanityPoints += numValue;
      }
    });

    const groupsOfFive = Math.floor(totalSanityPoints / 5);
    const newMaxSanity = 100 + (groupsOfFive * 5);

    if (maxSanity !== newMaxSanity) {
      setMaxSanity(newMaxSanity);
      if (currentSanity > newMaxSanity) {
        setCurrentSanity(newMaxSanity);
      }
    }
  }, [items, maxSanity, currentSanity]);

  useEffect(() => {
    loadAll();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportedTxtFileName(file.name);
    if ('showOpenFilePicker' in window) {
      try {
      } catch (error) {
        console.log('File System Access API não disponível, usando download padrão');
      }
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setImportedTxtContent(text);
      parseAndImportFile(text);
    };
    reader.readAsText(file);
  };

  const parseAndImportFile = (text) => {
    const lines = text.split('\n');
    const newItems = [];
    let currentType = '';
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      const typeMatch = trimmedLine.match(/^([A-ZÁÊÇ]+):$/);
      if (typeMatch) {
        currentType = typeMatch[1].trim();
        return;
      }
      const simpleMatch = trimmedLine.match(/^(([^:]+)):\s*(\d+)\/(\d+)$/);
      if (simpleMatch) {
        const name = simpleMatch[1].trim();
        const current = parseInt(simpleMatch[3]) || 0;
        const max = parseInt(simpleMatch[4]) || 0;
        newItems.push({
          id: Date.now().toString() + Math.random(),
          type: currentType || 'FÍSICO',
          key: name,
          value: `${current}/${max}`,
        });
      }
    });
    if (newItems.length > 0) {
      setItems([...items, ...newItems]);
      alert(`✅ ${newItems.length} atributos importados com sucesso!`);
    } else {
      alert('⚠️ Nenhum atributo encontrado no arquivo.');
    }
  };

  const handleAddInventoryItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      handleUpdateInventoryItem(e);
      return;
    }
    
    if (!itemName.trim()) {
      alert(itemCategory === 'municoes' ? '⚠️ Por favor, preencha o tipo da munição.' : '⚠️ Por favor, preencha o nome do item.');
      return;
    }

    if (itemCategory === 'armas' && !weaponType) {
      alert('⚠️ Por favor, selecione o tipo de arma.');
      return;
    }
    if (itemCategory === 'armas' && weaponType === 'fogo' && linkedAmmunitions.length === 0) {
      alert('⚠️ Por favor, adicione pelo menos uma munição compatível para armas de fogo.');
      return;
    }
    if (itemCategory === 'municoes' && !ammunitionType.trim()) {
      alert('⚠️ Por favor, preencha o tipo de munição.');
      return;
    }
    if (itemCategory === 'carregadores' && !magazineCapacity.trim()) {
      alert('⚠️ Por favor, preencha a capacidade do carregador.');
      return;
    }
    if (itemCategory === 'carregadores' && !ammunitionType.trim()) {
      alert('⚠️ Por favor, preencha o tipo de munição que o carregador aceita.');
      return;
    }
    if (itemCategory === 'dinheiro' && debitAmount === 0 && creditAmount === 0 && cashAmount === 0) {
      alert('⚠️ Por favor, preencha pelo menos um dos campos de dinheiro (Débito, Crédito ou Espécie).');
      return;
    }

    const itemKey = JSON.stringify({
      name: itemName.trim(),
      category: itemCategory,
      weaponType: itemCategory === 'armas' ? weaponType : null,
      ammunitionType: itemCategory === 'municoes' ? ammunitionType.trim() : (itemCategory === 'carregadores' ? ammunitionType.trim() : null),
      magazineCapacity: itemCategory === 'carregadores' ? magazineCapacity.trim() : null,
    });

    const existingItemIndex = inventory.findIndex(item => {
      const existingKey = JSON.stringify({
        name: item.name,
        category: item.category,
        weaponType: item.weaponType || null,
        ammunitionType: item.category === 'municoes' ? (item.ammunitionType || null) : (item.category === 'carregadores' ? (item.ammunitionType || null) : null),
        magazineCapacity: item.category === 'carregadores' ? (item.magazineCapacity || null) : null,
      });
      return existingKey === itemKey;
    });

    if (existingItemIndex !== -1) {
      const updatedInventory = [...inventory];
      const existingItem = updatedInventory[existingItemIndex];
      
      if (itemCategory === 'carregadores') {
        const newInstances = Array.from({ length: itemQuantity }, (_, i) => ({
          instanceId: `${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          isLoaded: false,
          currentAmmo: 0
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
      alert(`✅ Item atualizado! Quantidade total: ${updatedInventory[existingItemIndex].quantity}`);
    } else {
      const newInventoryItem = {
        id: Date.now().toString(),
        name: itemName.trim(),
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
          ammunitionType: ammunitionType.trim(),
          linkedWeapon: linkedWeapon || null,
          loadedQuantity: 0,
          instances: Array.from({ length: itemQuantity }, (_, i) => ({
            instanceId: `${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
            isLoaded: false,
            currentAmmo: 0
          }))
        }),
        ...(itemCategory === 'dinheiro' && {
          debitAmount: debitAmount,
          creditAmount: creditAmount,
          cashAmount: cashAmount,
          currency: currency
        }),
      };
      setInventory([...inventory, newInventoryItem]);
      alert(`✅ Item cadastrado com sucesso!`);
    }

      setItemName('');
      setItemQuantity(1);
      setItemCategory('geral');
    setWeaponType('');
    setAmmunitionType('');
    setMagazineCapacity('');
    setLinkedAmmunitions([]);
    setSelectedAmmunitionToAdd('');
    setLinkedMagazine('');
    setLinkedWeapon('');
    setDebitAmount(0);
    setCreditAmount(0);
    setCashAmount(0);
    setCurrency('BRL');
  };

  const handleDeleteInventoryItem = (id) => {
    setInventory(inventory.filter((item) => item.id !== id));
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

  const handleEditInventoryItem = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemCategory(item.category);
    setWeaponType(item.weaponType || '');
    setAmmunitionType(item.ammunitionType || '');
    setMagazineCapacity(item.magazineCapacity || '');
    setLinkedAmmunitions(
      Array.isArray(item.linkedAmmunitions) 
        ? item.linkedAmmunitions 
        : (item.linkedAmmunition ? [item.linkedAmmunition] : [])
    );
    setSelectedAmmunitionToAdd('');
    setLinkedMagazine(item.linkedMagazine || '');
    setLinkedWeapon(item.linkedWeapon || '');
    setDebitAmount(item.debitAmount || 0);
    setCreditAmount(item.creditAmount || 0);
    setCashAmount(item.cashAmount || 0);
    setCurrency(item.currency || 'BRL');
    setActiveInventoryTab('cadastrar');
    setTimeout(() => {
      document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleUpdateInventoryItem = (e) => {
    e.preventDefault();
    if (itemName.trim() && editingItem) {
      if (itemCategory === 'armas' && !weaponType) {
        alert('⚠️ Por favor, selecione o tipo de arma.');
        return;
      }
      if (itemCategory === 'armas' && weaponType === 'fogo' && linkedAmmunitions.length === 0) {
        alert('⚠️ Por favor, adicione pelo menos uma munição compatível para armas de fogo.');
        return;
      }
      if (itemCategory === 'municoes' && !ammunitionType.trim()) {
        alert('⚠️ Por favor, preencha o tipo de munição.');
        return;
      }
      if (itemCategory === 'carregadores' && !magazineCapacity.trim()) {
        alert('⚠️ Por favor, preencha a capacidade do carregador.');
        return;
      }
      if (itemCategory === 'carregadores' && !ammunitionType.trim()) {
        alert('⚠️ Por favor, preencha o tipo de munição que o carregador aceita.');
        return;
      }
      if (itemCategory === 'dinheiro' && debitAmount === 0 && creditAmount === 0 && cashAmount === 0) {
        alert('⚠️ Por favor, preencha pelo menos um dos campos de dinheiro (Débito, Crédito ou Espécie).');
        return;
      }

      const updatedItem = {
        ...editingItem,
        name: itemName.trim(),
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
          ammunitionType: ammunitionType.trim(),
          linkedWeapon: linkedWeapon || null,
          loadedQuantity: editingItem.loadedQuantity !== undefined ? editingItem.loadedQuantity : 0,
        }),
        ...(itemCategory === 'dinheiro' && {
          debitAmount: debitAmount,
          creditAmount: creditAmount,
          cashAmount: cashAmount,
          currency: currency
        }),
      };

      setInventory(inventory.map(item => 
        item.id === editingItem.id ? updatedItem : item
      ));
      
      alert(`✅ Item atualizado com sucesso!`);
      
      setEditingItem(null);
      setItemName('');
      setItemQuantity(1);
      setItemCategory('geral');
      setWeaponType('');
      setAmmunitionType('');
      setMagazineCapacity('');
      setLinkedAmmunitions([]);
      setSelectedAmmunitionToAdd('');
      setLinkedMagazine('');
      setLinkedWeapon('');
      setDebitAmount(0);
      setCreditAmount(0);
      setCashAmount(0);
      setCurrency('BRL');
    }
  };

  const getAvailableMagazines = (weapon) => {
    if (!weapon || weapon.weaponType !== 'fogo') return [];
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    if (ammoIds.length === 0) return [];
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
    if (ammunitionTypes.length === 0) return [];
    return inventory.filter(item => 
      item.category === 'carregadores' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      item.instances && item.instances.some(inst => inst.isLoaded && inst.currentAmmo === parseInt(item.magazineCapacity || 30))
    );
  };

  const getEmptyMagazines = (weapon) => {
    if (!weapon || weapon.weaponType !== 'fogo') return [];
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    if (ammoIds.length === 0) return [];
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
    if (ammunitionTypes.length === 0) return [];
    return inventory.filter(item => 
      item.category === 'carregadores' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      item.instances && item.instances.some(inst => !inst.isLoaded && inst.currentAmmo === 0)
    );
  };

  const getAvailableAmmunition = (weapon) => {
    if (!weapon || weapon.weaponType !== 'fogo') return null;
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    if (ammoIds.length === 0) return null;
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
    if (ammunitionTypes.length === 0) return null;
    return inventory.find(item => 
      item.category === 'municoes' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      item.quantity > 0
    );
  };

  const getAllCompatibleMagazinesForSelect = (weapon, isPrimary = true) => {
    if (!weapon || weapon.weaponType !== 'fogo') return [];
    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    if (ammoIds.length === 0) return [];
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
    if (ammunitionTypes.length === 0) return [];
    const compatibleMagazines = inventory.filter(item => 
      item.category === 'carregadores' && 
      ammunitionTypes.includes(item.ammunitionType) &&
      (item.linkedWeapon === weapon.id || !item.linkedWeapon) &&
      item.quantity > 0
    );
    const allOptions = [];
    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;
    const currentMagazine = isPrimary ? weaponMagazine : secondaryWeaponMagazine;

    compatibleMagazines.forEach(mag => {
      if (mag.instances && Array.isArray(mag.instances)) {
        const capacity = parseInt(mag.magazineCapacity) || 30;
        mag.instances.forEach((instance, idx) => {
          const instanceAmmo = instance.currentAmmo || 0;
          let type = 'empty';
          let displayName = '';
          const isThisOneUsing = currentMagazineId === instance.instanceId && currentMagazineInfo && currentMagazine.max > 0;

          if (isThisOneUsing) {
            type = 'using';
            displayName = `${mag.name} - Usando (${currentMagazine.current}/${currentMagazine.max})`;
          } else if (instance.isLoaded && instanceAmmo === capacity) {
            type = 'loaded';
            displayName = `${mag.name} - Carregado (${capacity} munições)`;
          } else if (instanceAmmo > 0 && instanceAmmo < capacity) {
            type = 'partial';
            displayName = `${mag.name} - Parcial (${instanceAmmo}/${capacity})`;
          } else {
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
      }
    });
    
    return allOptions;
  };

  const getCurrentMagazineSelectId = (weapon, currentMagazineInfo, currentMagazineId, currentMagazine, isPrimary) => {
    if (currentMagazineId && currentMagazineInfo) {
      return currentMagazineId;
    }
    return '';
  };

  const handleSelectMagazine = (magazineOption, isPrimary) => {
    const weapon = isPrimary ? primaryWeapon : secondaryWeapon;
    if (!weapon) return;

    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;

    if (currentMagazineId && currentMagazineInfo) {
      const originalMagazineId = currentMagazineInfo.originalId || currentMagazineId.split('_')[0];
      const originalMagazine = inventory.find(item => item.id === originalMagazineId);
      
      if (originalMagazine && originalMagazine.instances) {
        const instanceIndex = originalMagazine.instances.findIndex(inst => inst.instanceId === currentMagazineId);
        if (instanceIndex !== -1) {
          const updatedInstances = [...originalMagazine.instances];
          updatedInstances[instanceIndex] = {
            ...updatedInstances[instanceIndex],
            isLoaded: false,
            currentAmmo: isPrimary ? weaponMagazine.current : secondaryWeaponMagazine.current
          };
          setInventory(inventory.map(item => 
            item.id === originalMagazineId 
              ? { ...item, instances: updatedInstances }
              : item
          ));
        }
      }
    }

    const selectedMagazine = magazineOption.magazine;
    const selectedInstance = magazineOption.instance;
    const capacity = parseInt(selectedMagazine.magazineCapacity) || 30;
    const ammoInMagazine = selectedInstance.currentAmmo || 0;

    if (isPrimary) {
      setWeaponMagazine({ current: ammoInMagazine, max: capacity });
      setCurrentPrimaryMagazineId(magazineOption.id);
      setCurrentPrimaryMagazineInfo(magazineOption);
    } else {
      setSecondaryWeaponMagazine({ current: ammoInMagazine, max: capacity });
      setCurrentSecondaryMagazineId(magazineOption.id);
      setCurrentSecondaryMagazineInfo(magazineOption);
    }

    if (selectedMagazine.instances) {
      const instanceIndex = selectedMagazine.instances.findIndex(inst => inst.instanceId === magazineOption.id);
      if (instanceIndex !== -1) {
        const updatedInstances = [...selectedMagazine.instances];
        updatedInstances[instanceIndex] = {
          ...updatedInstances[instanceIndex],
          isLoaded: false,
          currentAmmo: 0
        };
        setInventory(inventory.map(item => 
          item.id === selectedMagazine.id 
            ? { ...item, instances: updatedInstances }
            : item
        ));
      }
    }
  };

  const handleReloadWeapon = (isPrimary) => {
    const weapon = isPrimary ? primaryWeapon : secondaryWeapon;
    if (!weapon || weapon.weaponType !== 'fogo') return;

    const currentMagazineId = isPrimary ? currentPrimaryMagazineId : currentSecondaryMagazineId;
    const currentMagazineInfo = isPrimary ? currentPrimaryMagazineInfo : currentSecondaryMagazineInfo;
    const currentMagazine = isPrimary ? weaponMagazine : secondaryWeaponMagazine;

    if (!currentMagazineId || !currentMagazineInfo) {
      alert('⚠️ Selecione um carregador primeiro!');
      return;
    }

    const originalMagazineId = currentMagazineInfo.originalId || currentMagazineId.split('_')[0];
    const originalMagazine = inventory.find(item => item.id === originalMagazineId);
    
    if (originalMagazine && originalMagazine.instances) {
      const instanceIndex = originalMagazine.instances.findIndex(inst => inst.instanceId === currentMagazineId);
      if (instanceIndex !== -1) {
        const updatedInstances = [...originalMagazine.instances];
        const currentAmmoInWeapon = currentMagazine.current;
        const capacity = parseInt(originalMagazine.magazineCapacity) || 30;

        if (currentAmmoInWeapon === capacity) {
          updatedInstances[instanceIndex] = {
            ...updatedInstances[instanceIndex],
            isLoaded: true,
            currentAmmo: capacity
          };
        } else if (currentAmmoInWeapon > 0) {
          updatedInstances[instanceIndex] = {
            ...updatedInstances[instanceIndex],
            isLoaded: false,
            currentAmmo: currentAmmoInWeapon
          };
        } else {
          updatedInstances[instanceIndex] = {
            ...updatedInstances[instanceIndex],
            isLoaded: false,
            currentAmmo: 0
          };
        }

        setInventory(inventory.map(item => 
          item.id === originalMagazineId 
            ? { ...item, instances: updatedInstances }
            : item
        ));
      }
    }

    const availableMagazines = getAvailableMagazines(weapon);
    if (availableMagazines.length > 0) {
      const magazineToUse = availableMagazines[0];
      const capacity = parseInt(magazineToUse.magazineCapacity) || 30;
      
      if (magazineToUse.instances) {
        const loadedInstance = magazineToUse.instances.find(inst => inst.isLoaded && inst.currentAmmo === capacity);
        if (loadedInstance) {
          const instanceIndex = magazineToUse.instances.findIndex(inst => inst.instanceId === loadedInstance.instanceId);
          if (instanceIndex !== -1) {
            const updatedInstances = [...magazineToUse.instances];
            updatedInstances[instanceIndex] = {
              ...updatedInstances[instanceIndex],
              isLoaded: false,
              currentAmmo: 0
            };
            setInventory(inventory.map(item => 
              item.id === magazineToUse.id 
                ? { ...item, instances: updatedInstances }
                : item
            ));
          }

          if (isPrimary) {
            setWeaponMagazine({ current: capacity, max: capacity });
            setCurrentPrimaryMagazineId(loadedInstance.instanceId);
            setCurrentPrimaryMagazineInfo({
              id: loadedInstance.instanceId,
              originalId: magazineToUse.id,
              magazine: magazineToUse,
              instance: loadedInstance
            });
          } else {
            setSecondaryWeaponMagazine({ current: capacity, max: capacity });
            setCurrentSecondaryMagazineId(loadedInstance.instanceId);
            setCurrentSecondaryMagazineInfo({
              id: loadedInstance.instanceId,
              originalId: magazineToUse.id,
              magazine: magazineToUse,
              instance: loadedInstance
            });
          }
        }
      }
    } else {
      if (isPrimary) {
        setWeaponMagazine({ current: 0, max: 0 });
        setCurrentPrimaryMagazineId(null);
        setCurrentPrimaryMagazineInfo(null);
      } else {
        setSecondaryWeaponMagazine({ current: 0, max: 0 });
        setCurrentSecondaryMagazineId(null);
        setCurrentSecondaryMagazineInfo(null);
      }
      alert('⚠️ Não há carregadores carregados disponíveis!');
    }
  };

  const handleLoadMagazines = (weapon) => {
    if (!weapon || weapon.weaponType !== 'fogo') {
      alert('⚠️ Selecione uma arma de fogo primeiro!');
      return;
    }

    const ammoIds = Array.isArray(weapon.linkedAmmunitions) 
      ? weapon.linkedAmmunitions 
      : (weapon.linkedAmmunition ? [weapon.linkedAmmunition] : []);
    
    if (ammoIds.length === 0) {
      alert('⚠️ Esta arma não possui munição vinculada! Configure a munição na arma primeiro.');
      return;
    }

    const emptyMagazines = getEmptyMagazines(weapon);
    const linkedAmmunitions = inventory.filter(a => ammoIds.includes(a.id));
    const ammunitionTypes = linkedAmmunitions.map(a => a.ammunitionType).filter(Boolean);
    const partialMagazines = inventory.filter(item => 
      item.category === 'carregadores' && 
      item.partialAmmo && 
      ammunitionTypes.includes(item.ammunitionType)
    );

    const magazinesByAmmoType = {};
    [...emptyMagazines, ...partialMagazines].forEach(mag => {
      const magAmmoType = mag.ammunitionType;
      if (!magazinesByAmmoType[magAmmoType]) {
        magazinesByAmmoType[magAmmoType] = [];
      }
      magazinesByAmmoType[magAmmoType].push(mag);
    });

    const availableAmmunitionByType = {};
    Object.keys(magazinesByAmmoType).forEach(ammoType => {
      const magazinesForType = magazinesByAmmoType[ammoType];
      const magazineName = magazinesForType[0]?.name;
      const ammo = inventory.find(item => 
        item.category === 'municoes' && 
        item.ammunitionType === ammoType &&
        item.name === magazineName &&
        item.quantity > 0
      );
      if (ammo) {
        availableAmmunitionByType[ammoType] = ammo;
      }
    });
    
    if (Object.keys(availableAmmunitionByType).length === 0) {
      alert('⚠️ Não há munição disponível no inventário para os tipos de carregadores compatíveis!');
      return;
    }
    
    if (emptyMagazines.length === 0 && partialMagazines.length === 0) {
      alert('⚠️ Não há carregadores vazios ou parciais compatíveis disponíveis no inventário!');
      return;
    }

    let totalMagazinesFilled = 0;
    let totalAmmunitionUsed = 0;
    let totalPartialMagazinesFilled = 0;
    
    Object.keys(magazinesByAmmoType).forEach(ammoType => {
      const magazinesForThisType = magazinesByAmmoType[ammoType];
      const ammunitionForThisType = availableAmmunitionByType[ammoType];
      
      if (!ammunitionForThisType) return;
      
      const emptyMagsForType = magazinesForThisType.filter(mag => {
        if (mag.instances && Array.isArray(mag.instances)) {
          return mag.instances.some(inst => !inst.isLoaded && inst.currentAmmo === 0);
        }
        return (mag.loadedQuantity || 0) < mag.quantity;
      });
      
      const partialMagsForType = magazinesForThisType.filter(mag => mag.partialAmmo);
      
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
      
      const totalAmmoNeededForType = partialAmmoNeededForType + (totalEmptyForType * magCapacity);
      const availableAmmo = ammunitionForThisType.quantity;
      const maxMagazinesFromAmmo = Math.floor((availableAmmo + partialMagsForType.reduce((sum, p) => sum + (p.partialAmmo || 0), 0)) / magCapacity);
      const totalAvailableForType = totalEmptyForType + partialMagsForType.length;
      const magazinesToFillForType = Math.min(totalAvailableForType, maxMagazinesFromAmmo);
      
      if (magazinesToFillForType === 0) return;
      
      const ammunitionUsedForType = Math.min(availableAmmo, magazinesToFillForType * magCapacity - partialMagsForType.reduce((sum, p) => sum + (p.partialAmmo || 0), 0));
      const emptyMagazinesToFillForType = Math.min(totalEmptyForType, Math.floor((availableAmmo - partialAmmoNeededForType) / magCapacity) + partialMagsForType.length);
      
      const updatedInventory = inventory.map(item => {
        if (item.id === ammunitionForThisType.id) {
          return {
            ...item,
            quantity: item.quantity - ammunitionUsedForType
          };
        }

        const magazinesByName = {};
        magazinesForThisType.forEach(mag => {
          const key = `${ammoType}_${mag.name}`;
          if (!magazinesByName[key]) {
            magazinesByName[key] = [];
          }
          magazinesByName[key].push(mag);
        });

        Object.keys(magazinesByName).forEach(key => {
          const magsForName = magazinesByName[key];
          const magazineName = magsForName[0]?.name;
          const ammunitionForThisType = inventory.find(item =>
            item.category === 'municoes' &&
            item.ammunitionType === ammoType &&
            item.name === magazineName &&
            item.quantity > 0
          );

          if (!ammunitionForThisType) return;

          magsForName.forEach(mag => {
            if (mag.instances && Array.isArray(mag.instances)) {
              const emptyInstances = mag.instances.filter(inst => !inst.isLoaded && inst.currentAmmo === 0);
              const partialInstances = mag.instances.filter(inst => inst.currentAmmo > 0 && inst.currentAmmo < magCapacity);
              
              let ammoRemaining = ammunitionUsedForType;
              
              partialInstances.forEach(partialInst => {
                const needed = magCapacity - partialInst.currentAmmo;
                if (ammoRemaining >= needed) {
                  const instanceIndex = mag.instances.findIndex(inst => inst.instanceId === partialInst.instanceId);
                  if (instanceIndex !== -1) {
                    mag.instances[instanceIndex] = {
                      ...mag.instances[instanceIndex],
                      isLoaded: true,
                      currentAmmo: magCapacity
                    };
                    ammoRemaining -= needed;
                    totalPartialMagazinesFilled++;
                  }
                }
              });

              emptyInstances.slice(0, Math.floor(ammoRemaining / magCapacity)).forEach(emptyInst => {
                const instanceIndex = mag.instances.findIndex(inst => inst.instanceId === emptyInst.instanceId);
                if (instanceIndex !== -1) {
                  mag.instances[instanceIndex] = {
                    ...mag.instances[instanceIndex],
                    isLoaded: true,
                    currentAmmo: magCapacity
                  };
                  ammoRemaining -= magCapacity;
                  totalMagazinesFilled++;
                }
              });
            }
          });
        });

        return item;
      });

      setInventory(updatedInventory);
      totalAmmunitionUsed += ammunitionUsedForType;
    });

    const partialMessage = totalPartialMagazinesFilled > 0 ? ` ${totalPartialMagazinesFilled} carregador(es) parcial(is) foram removidos e preenchidos.` : '';
    alert(`✅ ${totalMagazinesFilled} carregador(es) carregado(s) com ${totalAmmunitionUsed} munições!${partialMessage} Agora você pode recarregar sua arma.`);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>
              <span dangerouslySetInnerHTML={{ __html: `<svg width="30" height="30" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M128 20 C138 20 146 45 146 65 V90 H110 V65 C110 45 118 20 128 20 Z" fill="currentColor"/><path d="M110 90 H146 L152 115 H104 Z" fill="currentColor"/><rect x="104" y="115" width="48" height="90" fill="currentColor"/><rect x="100" y="205" width="56" height="10" fill="currentColor"/><rect x="96" y="215" width="64" height="10" fill="currentColor"/><rect x="150" y="115" width="6" height="90" fill="currentColor"/></svg>` }} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }}></span>
              Ficha Técnica
            </h1>
            <p>Adicione pares de atributo-valor e arraste para reordenar</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={() => setDarkMode(!darkMode)} className="btn-toggle-dark" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: darkMode ? '#4a5568' : '#e2e8f0', color: darkMode ? '#fff' : '#1a202c' }}>
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </button>
            <button onClick={saveAll} className="btn-save" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: '#4299e1', color: '#fff' }}>
              💾 Salvar Tudo
            </button>
            <button onClick={saveToTxtWithAppend} className="btn-save-txt" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: '#48bb78', color: '#fff' }}>
              📄 Salvar em TXT
            </button>
            <button onClick={importFromTxt} className="btn-import-txt" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: '#ed8936', color: '#fff' }}>
              📥 Importar TXT Completo
          </button>
        </div>
      </div>
      </div>
      <div className="content-grid">
        <div className="form-section">
            <div className="ficha-tabs">
              <button
              className={`ficha-tab ${activeFirstGridTab === 'formulario' ? 'active' : ''}`}
              onClick={() => setActiveFirstGridTab('formulario')}
            >
                Formulário
              </button>
              <button
              className={`ficha-tab ${activeFirstGridTab === 'ficha' ? 'active' : ''}`}
              onClick={() => setActiveFirstGridTab('ficha')}
            >
              <span dangerouslySetInnerHTML={{ __html: `<svg width="14" height="14" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="40" width="176" height="200" rx="4" fill="currentColor"/><rect x="50" y="50" width="156" height="180" fill="#2f3136"/><line x1="80" y1="70" x2="176" y2="70" stroke="currentColor" stroke-width="2"/><line x1="80" y1="100" x2="176" y2="100" stroke="currentColor" stroke-width="2"/><line x1="80" y1="130" x2="176" y2="130" stroke="currentColor" stroke-width="2"/><line x1="80" y1="160" x2="176" y2="160" stroke="currentColor" stroke-width="2"/><line x1="80" y1="190" x2="176" y2="190" stroke="currentColor" stroke-width="2"/><line x1="80" y1="220" x2="176" y2="220" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="70" r="8" fill="currentColor"/><circle cx="60" cy="100" r="8" fill="currentColor"/><circle cx="60" cy="130" r="8" fill="currentColor"/><circle cx="60" cy="160" r="8" fill="currentColor"/><circle cx="60" cy="190" r="8" fill="currentColor"/><circle cx="60" cy="220" r="8" fill="currentColor"/></svg>` }}></span>
              Ficha Técnica
              </button>
            </div>
          {activeFirstGridTab === 'formulario' ? (
            <div className="tab-panel">
              <h2>Adicionar Novo Item</h2>
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
              ➕ Adicionar Item
            </button>
          </form>
          <div className="life-section">
            <h2>Vida</h2>
            <div className="life-content">
              <div className="life-bar-container">
                <div className="life-bar-header">
                  <span className="life-label">HP</span>
                  <span 
                    className="life-values"
                        onClick={() => {
                          setEditingLife(true);
                      setTempLife(currentLife.toString());
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {editingLife ? (
                      <input
                        type="text"
                        value={tempLife}
                        onChange={(e) => setTempLife(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = tempLife.trim();
                            if (value.startsWith('+')) {
                              setCurrentLife(Math.min(maxLife, currentLife + parseFloat(value.slice(1)) || 0));
                            } else if (value.startsWith('-')) {
                              setCurrentLife(Math.max(0, currentLife - parseFloat(value.slice(1)) || 0));
                            } else {
                              setCurrentLife(Math.max(0, Math.min(maxLife, parseFloat(value) || 0)));
                            }
                            setEditingLife(false);
                            setTempLife('');
                          } else if (e.key === 'Escape') {
                            setEditingLife(false);
                            setTempLife('');
                          }
                        }}
                        onBlur={() => {
                          const value = tempLife.trim();
                          if (value.startsWith('+')) {
                            setCurrentLife(Math.min(maxLife, currentLife + parseFloat(value.slice(1)) || 0));
                          } else if (value.startsWith('-')) {
                            setCurrentLife(Math.max(0, currentLife - parseFloat(value.slice(1)) || 0));
                          } else {
                            setCurrentLife(Math.max(0, Math.min(maxLife, parseFloat(value) || 0)));
                          }
                          setEditingLife(false);
                          setTempLife('');
                        }}
                        autoFocus
                        style={{ width: '60px', textAlign: 'center' }}
                      />
                    ) : (
                      `${currentLife} / ${maxLife}`
                  )}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="life-bar-wrapper" style={{ flex: 1 }}>
                    <div 
                      className="life-bar-fill" 
                      style={{ 
                        width: `${(currentLife / maxLife) * 100}%`,
                        backgroundColor: '#9333ea'
                      }}
                    ></div>
                  </div>
                  <button
                    className="btn-edit-max-life"
                    onClick={() => {
                      setEditingMaxLife(true);
                      setTempMaxLife(maxLife.toString());
                    }}
                    title="Editar vida máxima"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {editingMaxLife && (
                    <input
                      type="text"
                      value={tempMaxLife}
                      onChange={(e) => setTempMaxLife(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt(tempMaxLife.trim()) || 0;
                          if (value > 0) {
                            setMaxLife(value);
                            if (currentLife > value) {
                              setCurrentLife(value);
                            }
                          }
                          setEditingMaxLife(false);
                          setTempMaxLife('');
                        } else if (e.key === 'Escape') {
                          setEditingMaxLife(false);
                          setTempMaxLife('');
                        }
                      }}
                      onBlur={() => {
                        const value = parseInt(tempMaxLife.trim()) || 0;
                        if (value > 0) {
                          setMaxLife(value);
                          if (currentLife > value) {
                            setCurrentLife(value);
                          }
                        }
                        setEditingMaxLife(false);
                        setTempMaxLife('');
                      }}
                      autoFocus
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="life-section">
            <h2>Sanidade</h2>
            <div className="life-content">
                <div className="life-bar-container">
                  <div className="life-bar-header">
                  <span className="life-label">SAN</span>
                  <span 
                    className="life-values"
                        onClick={() => {
                          setEditingSanity(true);
                      setTempSanity(currentSanity.toString());
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {editingSanity ? (
                  <input
                        type="text"
                        value={tempSanity}
                        onChange={(e) => setTempSanity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = tempSanity.trim();
                            if (value.startsWith('+')) {
                              setCurrentSanity(Math.min(maxSanity, currentSanity + parseFloat(value.slice(1)) || 0));
                            } else if (value.startsWith('-')) {
                              setCurrentSanity(Math.max(0, currentSanity - parseFloat(value.slice(1)) || 0));
                            } else {
                              setCurrentSanity(Math.max(0, Math.min(maxSanity, parseFloat(value) || 0)));
                            }
                            setEditingSanity(false);
                            setTempSanity('');
                          } else if (e.key === 'Escape') {
                            setEditingSanity(false);
                            setTempSanity('');
                          }
                        }}
                        onBlur={() => {
                          const value = tempSanity.trim();
                          if (value.startsWith('+')) {
                            setCurrentSanity(Math.min(maxSanity, currentSanity + parseFloat(value.slice(1)) || 0));
                          } else if (value.startsWith('-')) {
                            setCurrentSanity(Math.max(0, currentSanity - parseFloat(value.slice(1)) || 0));
                          } else {
                            setCurrentSanity(Math.max(0, Math.min(maxSanity, parseFloat(value) || 0)));
                          }
                          setEditingSanity(false);
                          setTempSanity('');
                        }}
                        autoFocus
                        style={{ width: '60px', textAlign: 'center' }}
                  />
                    ) : (
                      `${currentSanity} / ${maxSanity}`
                  )}
                  </span>
                </div>
                  <div className="life-bar-wrapper">
                    <div 
                      className="life-bar-fill" 
                      style={{ 
                        width: `${(currentSanity / maxSanity) * 100}%`,
                      backgroundColor: '#9333ea'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
                  </div>
          ) : (
            <div className="tab-panel">
              <h2>Ficha Técnica</h2>
              <div className="discord-view">
                {items.length === 0 ? (
                  <div className="discord-empty">
                    <p>Nenhum item adicionado ainda.</p>
                    <p>Use o formulário ao lado para começar!</p>
                      </div>
                ) : (
                  Object.keys(groupedByType).map(type => (
                    <div key={type} className="discord-section">
                      <div className="discord-section-title">{type}</div>
                      <div className="discord-attributes">
                        {groupedByType[type].map(item => (
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
              </div>
            )}
          </div>
        <div className="tabs-section">
              <h2>Lista de Itens ({items.length})</h2>
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
        <div className="inventory-section">
          <Tabs
            tabs={[
              { label: 'Cadastrar', icon: '➕' },
              { label: 'Visualizar', icon: '👁️' },
            ]}
            activeTab={activeInventoryTab}
            onTabChange={setActiveInventoryTab}
          >
            <div className="tab-panel">
              <h2>Cadastrar Item no Inventário</h2>
              <form onSubmit={handleAddInventoryItem} className="form">
                <div className="form-group">
                  <label htmlFor="itemCategory">Categoria:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {['geral', 'armas', 'municoes', 'carregadores', 'consumiveis', 'dinheiro'].map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={itemCategory === cat}
                          onChange={() => setItemCategory(cat)}
                          style={{ cursor: 'pointer', width: '24px', height: '24px', flexShrink: 0 }}
                        />
                        {cat === 'armas' && (
                          <span dangerouslySetInnerHTML={{ __html: `<svg width="40" height="40" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><g fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M25 115 L200 115 L205 120 L200 125 L25 125 Z" fill="currentColor" opacity="0.9"/><rect x="30" y="108" width="165" height="24" rx="3" fill="currentColor" opacity="0.7"/><rect x="35" y="103" width="155" height="8" rx="2" fill="currentColor" opacity="0.6"/><rect x="205" y="112" width="28" height="16" rx="2" fill="currentColor"/><rect x="55" y="130" width="100" height="15" rx="2" fill="currentColor" opacity="0.8"/><rect x="75" y="145" width="60" height="25" rx="4" fill="currentColor"/><rect x="80" y="155" width="50" height="8" rx="1" fill="currentColor" opacity="0.3"/><rect x="120" y="148" width="15" height="20" rx="2" fill="currentColor" opacity="0.9"/><rect x="0" y="105" width="35" height="30" rx="4" fill="currentColor" opacity="1"/><rect x="3" y="103" width="32" height="35" rx="5" fill="currentColor" opacity="0.95"/><line x1="10" y1="110" x2="10" y2="130" stroke="currentColor" stroke-width="2" opacity="0.3"/><line x1="18" y1="110" x2="18" y2="130" stroke="currentColor" stroke-width="2" opacity="0.3"/><line x1="26" y1="110" x2="26" y2="130" stroke="currentColor" stroke-width="2" opacity="0.3"/><line x1="45" y1="108" x2="45" y2="132" stroke="currentColor" stroke-width="2" opacity="0.5"/><line x1="80" y1="108" x2="80" y2="132" stroke="currentColor" stroke-width="2" opacity="0.5"/><line x1="115" y1="108" x2="115" y2="132" stroke="currentColor" stroke-width="2" opacity="0.5"/><line x1="150" y1="108" x2="150" y2="132" stroke="currentColor" stroke-width="2" opacity="0.5"/><line x1="185" y1="108" x2="185" y2="132" stroke="currentColor" stroke-width="2" opacity="0.5"/><circle cx="90" cy="160" r="3" fill="currentColor" opacity="0.4"/><circle cx="120" cy="160" r="3" fill="currentColor" opacity="0.4"/></g></svg>` }}></span>
                        )}
                        {cat === 'municoes' && (
                          <span dangerouslySetInnerHTML={{ __html: `<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><path d="M128 20 C138 20 146 45 146 65 V90 H110 V65 C110 45 118 20 128 20 Z" fill="currentColor"/><path d="M110 90 H146 L152 115 H104 Z" fill="currentColor"/><rect x="104" y="115" width="48" height="90" fill="currentColor"/><rect x="100" y="205" width="56" height="10" fill="currentColor"/><rect x="96" y="215" width="64" height="10" fill="currentColor"/><rect x="150" y="115" width="6" height="90" fill="currentColor"/></svg>` }}></span>
                        )}
                        {cat === 'carregadores' && (
                          <span dangerouslySetInnerHTML={{ __html: `<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><rect x="80" y="40" width="96" height="180" rx="8" fill="currentColor"/><rect x="88" y="50" width="80" height="160" fill="#2f3136"/><rect x="100" y="60" width="56" height="140" fill="currentColor" opacity="0.3"/></svg>` }}></span>
                        )}
                        {cat === 'consumiveis' && (
                          <span dangerouslySetInnerHTML={{ __html: `<svg width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><rect x="60" y="100" width="136" height="100" rx="12" fill="currentColor"/><path d="M100 100 C100 70 156 70 156 100" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round"/><line x1="128" y1="120" x2="128" y2="180" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/><line x1="98" y1="150" x2="158" y2="150" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/></svg>` }}></span>
                        )}
                        {cat === 'dinheiro' && (
                          <span dangerouslySetInnerHTML={{ __html: `<svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle; margin-right: 3px;"><circle cx="128" cy="128" r="100" fill="currentColor"/><text x="128" y="140" font-family="Arial" font-size="80" font-weight="bold" fill="#2f3136" text-anchor="middle">$</text></svg>` }}></span>
                        )}
                        <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                      </label>
                    ))}
                </div>
                </div>
                {itemCategory === 'armas' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="weaponType">Tipo de Arma:</label>
                      <select
                        id="weaponType"
                        value={weaponType}
                        onChange={(e) => setWeaponType(e.target.value)}
                        className="input"
                      >
                        <option value="">Selecione...</option>
                        <option value="fogo">Arma de Fogo</option>
                        <option value="branca">Arma Branca Corpo a Corpo</option>
                      </select>
                    </div>
                    {weaponType === 'fogo' && (
                      <>
                        <div className="form-group">
                          <label>Munições Compatíveis:</label>
                          <select
                            value={selectedAmmunitionToAdd}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              if (selectedId && !linkedAmmunitions.includes(selectedId)) {
                                setLinkedAmmunitions([...linkedAmmunitions, selectedId]);
                                setSelectedAmmunitionToAdd('');
                              }
                            }}
                            className="input"
                          >
                            <option value="">Selecione uma munição...</option>
                            {inventory.filter(item => item.category === 'municoes').map(ammo => (
                              <option key={ammo.id} value={ammo.id}>{ammo.name} ({ammo.ammunitionType})</option>
                            ))}
                          </select>
                          {linkedAmmunitions.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                              {linkedAmmunitions.map(ammoId => {
                                const ammo = inventory.find(i => i.id === ammoId);
                                return ammo ? (
                                  <span key={ammoId} style={{ display: 'inline-block', margin: '5px', padding: '5px 10px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                                    {ammo.name} ({ammo.ammunitionType})
                            <button
                                      type="button"
                                      onClick={() => setLinkedAmmunitions(linkedAmmunitions.filter(id => id !== ammoId))}
                                      style={{ marginLeft: '5px', cursor: 'pointer', border: 'none', background: 'transparent' }}
                                    >
                                      ×
                            </button>
                                  </span>
                                ) : null;
                              })}
                </div>
              )}
            </div>
                        {linkedAmmunitions.length === 0 && (
                          <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', marginTop: '10px', fontSize: '14px' }}>
                            💡 <strong>Dica:</strong> Para cadastrar uma arma de fogo, você precisa primeiro cadastrar a munição compatível. Cadastre a munição primeiro, depois volte aqui e adicione-a como munição compatível.
                </div>
                        )}
                      </>
                    )}
                  </>
                )}
                {itemCategory === 'municoes' && (
                  <div className="form-group">
                    <label htmlFor="ammunitionType">Tipo da Munição:</label>
                    <input
                      id="ammunitionType"
                      type="text"
                      value={ammunitionType}
                      onChange={(e) => setAmmunitionType(e.target.value)}
                      placeholder="Ex: normal, paralisante, etc."
                      className="input"
                    />
                    </div>
                )}
                {itemCategory === 'carregadores' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="ammunitionType">Tipo de Munição:</label>
                      <input
                        id="ammunitionType"
                        type="text"
                        value={ammunitionType}
                        onChange={(e) => setAmmunitionType(e.target.value)}
                        placeholder="Ex: normal, paralisante, etc."
                        className="input"
                      />
                  </div>
                    <div className="form-group">
                      <label htmlFor="magazineCapacity">Capacidade do Carregador:</label>
                      <input
                        id="magazineCapacity"
                        type="number"
                        value={magazineCapacity}
                        onChange={(e) => setMagazineCapacity(e.target.value)}
                        placeholder="Ex: 30"
                        className="input"
                        min="0"
                      />
                      </div>
                  </>
                )}
                {itemCategory === 'dinheiro' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="currency">Moeda:</label>
                      <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="input"
                      >
                        <option value="BRL">BRL (R$)</option>
                        <option value="USD">USD (US$)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CNY">CNY (¥)</option>
                        <option value="ARS">ARS ($)</option>
                        <option value="MXN">MXN ($)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Débito:</label>
                      <span
                        onClick={() => {
                          setEditingDebit(0);
                          setTempDebit(debitAmount.toString());
                        }}
                        style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', display: 'inline-block', minWidth: '100px' }}
                      >
                        {formatCurrency(debitAmount, currency)}
                      </span>
                      {editingDebit === 0 && (
                        <div style={{ position: 'absolute', zIndex: 1000, backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }}>
                          <input
                            type="text"
                            value={tempDebit}
                            onChange={(e) => setTempDebit(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = tempDebit.trim();
                                if (value === '') {
                                  setDebitAmount(0);
                                } else if (value.startsWith('+')) {
                                  setDebitAmount(Math.max(0, debitAmount + parseFloat(value.slice(1)) || 0));
                                } else if (value.startsWith('-')) {
                                  setDebitAmount(Math.max(0, debitAmount - parseFloat(value.slice(1)) || 0));
                                } else {
                                  const num = parseFloat(value);
                                  setDebitAmount(isNaN(num) ? 0 : Math.max(0, num));
                                }
                                setEditingDebit(null);
                                setTempDebit('');
                              } else if (e.key === 'Escape') {
                                setEditingDebit(null);
                                setTempDebit('');
                              }
                            }}
                            onBlur={() => {
                              const value = tempDebit.trim();
                              if (value === '') {
                                setDebitAmount(0);
                              } else if (value.startsWith('+')) {
                                setDebitAmount(Math.max(0, debitAmount + parseFloat(value.slice(1)) || 0));
                              } else if (value.startsWith('-')) {
                                setDebitAmount(Math.max(0, debitAmount - parseFloat(value.slice(1)) || 0));
                              } else {
                                const num = parseFloat(value);
                                setDebitAmount(isNaN(num) ? 0 : Math.max(0, num));
                              }
                              setEditingDebit(null);
                              setTempDebit('');
                            }}
                            autoFocus
                            style={{ width: '200px' }}
                          />
                  </div>
                      )}
                      </div>
                    <div className="form-group">
                      <label>Crédito:</label>
                      <span
                        onClick={() => {
                          setEditingCredit(0);
                          setTempCredit(creditAmount.toString());
                        }}
                        style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', display: 'inline-block', minWidth: '100px' }}
                      >
                        {formatCurrency(creditAmount, currency)}
                      </span>
                      {editingCredit === 0 && (
                        <div style={{ position: 'absolute', zIndex: 1000, backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }}>
                          <input
                            type="text"
                            value={tempCredit}
                            onChange={(e) => setTempCredit(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = tempCredit.trim();
                                if (value === '') {
                                  setCreditAmount(0);
                                } else if (value.startsWith('+')) {
                                  setCreditAmount(Math.max(0, creditAmount + parseFloat(value.slice(1)) || 0));
                                } else if (value.startsWith('-')) {
                                  setCreditAmount(Math.max(0, creditAmount - parseFloat(value.slice(1)) || 0));
                                } else {
                                  const num = parseFloat(value);
                                  setCreditAmount(isNaN(num) ? 0 : Math.max(0, num));
                                }
                                setEditingCredit(null);
                                setTempCredit('');
                              } else if (e.key === 'Escape') {
                                setEditingCredit(null);
                                setTempCredit('');
                              }
                            }}
                            onBlur={() => {
                              const value = tempCredit.trim();
                              if (value === '') {
                                setCreditAmount(0);
                              } else if (value.startsWith('+')) {
                                setCreditAmount(Math.max(0, creditAmount + parseFloat(value.slice(1)) || 0));
                              } else if (value.startsWith('-')) {
                                setCreditAmount(Math.max(0, creditAmount - parseFloat(value.slice(1)) || 0));
                              } else {
                                const num = parseFloat(value);
                                setCreditAmount(isNaN(num) ? 0 : Math.max(0, num));
                              }
                              setEditingCredit(null);
                              setTempCredit('');
                            }}
                            autoFocus
                            style={{ width: '200px' }}
                          />
                    </div>
                      )}
                  </div>
                    <div className="form-group">
                      <label>Espécie:</label>
                      <span
                        onClick={() => {
                          setEditingCash(0);
                          setTempCash(cashAmount.toString());
                        }}
                        style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', display: 'inline-block', minWidth: '100px' }}
                      >
                        {formatCurrency(cashAmount, currency)}
                      </span>
                      {editingCash === 0 && (
                        <div style={{ position: 'absolute', zIndex: 1000, backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }}>
                          <input
                            type="text"
                            value={tempCash}
                            onChange={(e) => setTempCash(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = tempCash.trim();
                                if (value === '') {
                                  setCashAmount(0);
                                } else if (value.startsWith('+')) {
                                  setCashAmount(Math.max(0, cashAmount + parseFloat(value.slice(1)) || 0));
                                } else if (value.startsWith('-')) {
                                  setCashAmount(Math.max(0, cashAmount - parseFloat(value.slice(1)) || 0));
                                } else {
                                  const num = parseFloat(value);
                                  setCashAmount(isNaN(num) ? 0 : Math.max(0, num));
                                }
                                setEditingCash(null);
                                setTempCash('');
                              } else if (e.key === 'Escape') {
                                setEditingCash(null);
                                setTempCash('');
                              }
                            }}
                            onBlur={() => {
                              const value = tempCash.trim();
                              if (value === '') {
                                setCashAmount(0);
                              } else if (value.startsWith('+')) {
                                setCashAmount(Math.max(0, cashAmount + parseFloat(value.slice(1)) || 0));
                              } else if (value.startsWith('-')) {
                                setCashAmount(Math.max(0, cashAmount - parseFloat(value.slice(1)) || 0));
                              } else {
                                const num = parseFloat(value);
                                setCashAmount(isNaN(num) ? 0 : Math.max(0, num));
                              }
                              setEditingCash(null);
                              setTempCash('');
                            }}
                            autoFocus
                            style={{ width: '200px' }}
                          />
                </div>
              )}
            </div>
                  </>
                )}
            <div className="form-group">
                  <label htmlFor="itemName">{itemCategory === 'municoes' ? 'Tipo da Munição:' : itemCategory === 'carregadores' ? 'Tipo de Carregador:' : 'Nome do Item:'}</label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                    placeholder={itemCategory === 'municoes' ? 'Ex: 5.56, 9mm, etc.' : itemCategory === 'carregadores' ? 'Ex: normal, paralisante, etc.' : 'Digite o nome do item...'}
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="itemQuantity">Quantidade:</label>
              <input
                id="itemQuantity"
                type="number"
                value={itemQuantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || val === '0') {
                        setItemQuantity(0);
                      } else {
                        const num = parseInt(val);
                        if (!isNaN(num) && num >= 0) {
                          setItemQuantity(num);
                        }
                      }
                    }}
                className="input"
                    min="0"
              />
            </div>
                <button type="submit" className="btn-submit" style={{ backgroundColor: editingItem ? '#4299e1' : '#48bb78', color: '#fff' }}>
                  {editingItem ? '✏️ Atualizar Item' : '➕ Cadastrar Item'}
            </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setItemName('');
                      setItemQuantity(1);
                      setItemCategory('geral');
                      setWeaponType('');
                      setAmmunitionType('');
                      setMagazineCapacity('');
                      setLinkedAmmunitions([]);
                      setSelectedAmmunitionToAdd('');
                      setLinkedMagazine('');
                      setLinkedWeapon('');
                      setDebitAmount(0);
                      setCreditAmount(0);
                      setCashAmount(0);
                      setCurrency('BRL');
                    }}
                    className="btn-submit"
                    style={{ marginTop: '10px', backgroundColor: '#e53e3e', color: '#fff' }}
                  >
                    ❌ Cancelar Edição
                  </button>
                )}
          </form>
            </div>
            <div className="tab-panel">
              <h2>Visualizar Inventário</h2>
          {inventory.length === 0 ? (
            <div className="empty-state">
              <p>Inventário vazio.</p>
                  <p>Cadastre itens para começar!</p>
            </div>
          ) : (
                <div className="inventory-display">
                  {Object.keys(groupedInventory).map(category => (
                    <div key={category} className="inventory-category">
                      <h3 style={{ textTransform: 'capitalize', marginBottom: '15px' }}>{category}</h3>
                      {groupedInventory[category].map(item => (
                        <div key={item.id} className="inventory-item" style={{ marginBottom: '15px', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: darkMode ? '#2f3136' : '#fff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div>
                              <strong style={{ color: darkMode ? '#dcddde' : '#2c3e50' }}>{item.name}</strong>
                              {item.quantity > 1 && <span style={{ marginLeft: '10px', color: '#718096' }}>×{item.quantity}</span>}
                  </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleEditInventoryItem(item)}
                                className="btn-edit"
                                style={{ padding: '5px 10px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                ✏️ Editar
                            </button>
                            <button
                                onClick={() => handleDeleteInventoryItem(item.id)}
                                className="btn-delete"
                                style={{ padding: '5px 10px', backgroundColor: '#9333ea', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                🗑️ Excluir
                            </button>
                            </div>
                          </div>
                          {item.category === 'armas' && item.weaponType === 'fogo' && (
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                              {item.linkedAmmunitions && item.linkedAmmunitions.length > 0 && (
                                <div>
                                  Munições: {item.linkedAmmunitions.map(id => {
                                    const ammo = inventory.find(i => i.id === id);
                                    return ammo ? ammo.name : id;
                                  }).join(', ')}
                                </div>
                              )}
                            </div>
                          )}
                          {item.category === 'municoes' && item.ammunitionType && (
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                              Tipo: {item.ammunitionType}
                            </div>
                          )}
                          {item.category === 'carregadores' && item.instances && (
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                              <div style={{ marginBottom: '5px' }}>
                                Tipo: {item.ammunitionType || 'N/A'} | Capacidade: {item.magazineCapacity || 'N/A'} munições
                              </div>
                              <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                                <span>Total: {item.quantity}</span>
                                <span>Carregados: {item.instances.filter(inst => inst.isLoaded && inst.currentAmmo === parseInt(item.magazineCapacity || 30)).length}</span>
                                <span>Parciais: {item.instances.filter(inst => inst.currentAmmo > 0 && inst.currentAmmo < parseInt(item.magazineCapacity || 30)).length}</span>
                                <span>Vazios: {item.instances.filter(inst => !inst.isLoaded && inst.currentAmmo === 0).length}</span>
                              </div>
                            </div>
                          )}
                          {item.category === 'dinheiro' && (
                            <div style={{ fontSize: '12px', color: '#718096', marginTop: '5px' }}>
                              <div>Débito: {formatCurrency(item.debitAmount || 0, item.currency || 'BRL')}</div>
                              <div>Crédito: {formatCurrency(item.creditAmount || 0, item.currency || 'BRL')}</div>
                              <div>Espécie: {formatCurrency(item.cashAmount || 0, item.currency || 'BRL')}</div>
                              <div style={{ marginTop: '5px', fontWeight: 'bold' }}>
                                Total: {formatCurrency((item.debitAmount || 0) + (item.creditAmount || 0) + (item.cashAmount || 0), item.currency || 'BRL')}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </div>
        <div className="tabs-section">
          <h2>Armamentos</h2>
          <div className="tab-panel">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Arma Primária:</label>
                            <button
                    onClick={() => setShowPrimaryWeaponList(!showPrimaryWeaponList)}
                    style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                    {primaryWeapon ? primaryWeapon.name : 'Selecione...'}
                            </button>
                  {showPrimaryWeaponList && (
                    <div style={{ marginTop: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                      {inventory.filter(item => item.category === 'armas').map(weapon => (
                        <label key={weapon.id} style={{ display: 'block', padding: '3px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={primaryWeapon?.id === weapon.id}
                            onChange={() => setPrimaryWeapon(weapon)}
                          />
                          {weapon.name}
                        </label>
                      ))}
                          </div>
                  )}
                  {primaryWeapon && primaryWeapon.weaponType === 'fogo' && (
                    <div style={{ marginTop: '10px', fontSize: '11px' }}>
                      <div style={{ marginBottom: '5px' }}>
                        <label style={{ display: 'block', marginBottom: '3px' }}>Carregador:</label>
                        <select
                          value={currentPrimaryMagazineId || ''}
                          onChange={(e) => {
                            const option = getAllCompatibleMagazinesForSelect(primaryWeapon, true).find(opt => opt.id === e.target.value);
                            if (option) {
                              handleSelectMagazine(option, true);
                            }
                          }}
                          style={{ width: '100%', padding: '3px', fontSize: '11px' }}
                        >
                          <option value="">Selecione um carregador...</option>
                          {getAllCompatibleMagazinesForSelect(primaryWeapon, true).map(option => (
                            <option key={option.id} value={option.id}>{option.displayName}</option>
                          ))}
                        </select>
                        </div>
                      <div style={{ fontSize: '10px', color: '#718096', marginBottom: '5px' }}>
                        Munições: {primaryWeapon.linkedAmmunitions && primaryWeapon.linkedAmmunitions.length > 0 ? (
                          primaryWeapon.linkedAmmunitions.map(id => {
                            const ammo = inventory.find(i => i.id === id);
                            return ammo ? ammo.name : id;
                          }).join(', ')
                        ) : 'Nenhuma'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#718096', marginBottom: '5px' }}>
                        Carregador: {currentPrimaryMagazineInfo ? `${weaponMagazine.current}/${weaponMagazine.max}` : 'Nenhum'}
                  </div>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <button
                          onClick={() => handleReloadWeapon(true)}
                          disabled={!currentPrimaryMagazineId}
                          style={{ padding: '3px 8px', fontSize: '10px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Recarregar Arma
                        </button>
                        <button
                          onClick={() => handleLoadMagazines(primaryWeapon)}
                          style={{ padding: '3px 8px', fontSize: '10px', backgroundColor: '#9333ea', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Carregar Carregadores
                        </button>
                </div>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Arma Secundária:</label>
                  <button
                    onClick={() => setShowSecondaryWeaponList(!showSecondaryWeaponList)}
                    style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {secondaryWeapon ? secondaryWeapon.name : 'Selecione...'}
                  </button>
                  {showSecondaryWeaponList && (
                    <div style={{ marginTop: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                      {inventory.filter(item => item.category === 'armas').map(weapon => (
                        <label key={weapon.id} style={{ display: 'block', padding: '3px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={secondaryWeapon?.id === weapon.id}
                            onChange={() => setSecondaryWeapon(weapon)}
                          />
                          {weapon.name}
                        </label>
                      ))}
                </div>
                  )}
                  {secondaryWeapon && secondaryWeapon.weaponType === 'fogo' && (
                    <div style={{ marginTop: '10px', fontSize: '11px' }}>
                      <div style={{ marginBottom: '5px' }}>
                        <label style={{ display: 'block', marginBottom: '3px' }}>Carregador:</label>
                        <select
                          value={currentSecondaryMagazineId || ''}
                          onChange={(e) => {
                            const option = getAllCompatibleMagazinesForSelect(secondaryWeapon, false).find(opt => opt.id === e.target.value);
                            if (option) {
                              handleSelectMagazine(option, false);
                            }
                          }}
                          style={{ width: '100%', padding: '3px', fontSize: '11px' }}
                        >
                          <option value="">Selecione um carregador...</option>
                          {getAllCompatibleMagazinesForSelect(secondaryWeapon, false).map(option => (
                            <option key={option.id} value={option.id}>{option.displayName}</option>
                          ))}
                        </select>
                </div>
                      <div style={{ fontSize: '10px', color: '#718096', marginBottom: '5px' }}>
                        Munições: {secondaryWeapon.linkedAmmunitions && secondaryWeapon.linkedAmmunitions.length > 0 ? (
                          secondaryWeapon.linkedAmmunitions.map(id => {
                            const ammo = inventory.find(i => i.id === id);
                            return ammo ? ammo.name : id;
                          }).join(', ')
                        ) : 'Nenhuma'}
                      </div>
                      <div style={{ fontSize: '10px', color: '#718096', marginBottom: '5px' }}>
                        Carregador: {currentSecondaryMagazineInfo ? `${secondaryWeaponMagazine.current}/${secondaryWeaponMagazine.max}` : 'Nenhum'}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <button
                          onClick={() => handleReloadWeapon(false)}
                          disabled={!currentSecondaryMagazineId}
                          style={{ padding: '3px 8px', fontSize: '10px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Recarregar Arma
                        </button>
                        <button
                          onClick={() => handleLoadMagazines(secondaryWeapon)}
                          style={{ padding: '3px 8px', fontSize: '10px', backgroundColor: '#9333ea', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Carregar Carregadores
                        </button>
              </div>
            </div>
          )}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
