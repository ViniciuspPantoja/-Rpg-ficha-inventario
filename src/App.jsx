import { useState } from 'react';
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

function App() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('');
  const [attribute, setAttribute] = useState('');
  const [value, setValue] = useState('');
  const [currentLife, setCurrentLife] = useState(100);
  const [maxLife, setMaxLife] = useState(100);

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

  // Agrupar itens por tipo
  const groupedByType = items.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {});

  return (
    <div className="app-container">
      <div className="header">
        <h1>📝 Gerenciador de Atributos</h1>
        <p>Adicione pares de atributo-valor e arraste para reordenar</p>
      </div>

      <div className="content-grid">
        <div className="form-section">
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
                  <span className="life-values">
                    {currentLife} / {maxLife}
                  </span>
                </div>
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
              
              <div className="life-controls">
                <div className="life-input-group">
                  <label htmlFor="currentLife">Vida Atual:</label>
                  <input
                    id="currentLife"
                    type="number"
                    value={currentLife}
                    onChange={(e) => setCurrentLife(Math.max(0, Math.min(maxLife, Number(e.target.value))))}
                    className="input"
                    min="0"
                    max={maxLife}
                  />
                </div>
                <div className="life-input-group">
                  <label htmlFor="maxLife">Vida Máxima:</label>
                  <input
                    id="maxLife"
                    type="number"
                    value={maxLife}
                    onChange={(e) => setMaxLife(Math.max(1, Number(e.target.value)))}
                    className="input"
                    min="1"
                  />
                </div>
              </div>

              <div className="life-buttons">
                <button 
                  className="life-btn life-btn-heal" 
                  onClick={() => setCurrentLife(Math.min(currentLife + 10, maxLife))}
                >
                  ❤️ +10
                </button>
                <button 
                  className="life-btn life-btn-damage" 
                  onClick={() => setCurrentLife(Math.max(0, currentLife - 10))}
                >
                  💔 -10
                </button>
                <button 
                  className="life-btn life-btn-full" 
                  onClick={() => setCurrentLife(maxLife)}
                >
                  ✨ Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs-section">
          <Tabs
            tabs={[
              { label: 'Lista', icon: '📋' },
              { label: 'Tabela', icon: '📊' },
              { label: 'Resumo', icon: '📈' },
            ]}
          >
            {/* Aba 1: Lista com Drag and Drop */}
            <div className="tab-panel">
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
                        <th>#</th>
                        <th>Tipo</th>
                        <th>Atributo</th>
                        <th>Valor</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.type}</td>
                          <td>{item.key}</td>
                          <td>{item.value}</td>
                          <td>
                            <button
                              className="btn-delete-small"
                              onClick={() => handleDelete(item.id)}
                              title="Remover"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Aba 3: Resumo/Estatísticas */}
            <div className="tab-panel">
              <h2>Resumo e Estatísticas</h2>
              {items.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhum item adicionado ainda.</p>
                  <p>Use o formulário ao lado para começar!</p>
                </div>
              ) : (
                <div className="stats-container">
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                      <div className="stat-label">Total de Itens</div>
                      <div className="stat-value">{items.length}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                      <div className="stat-label">Tipos Diferentes</div>
                      <div className="stat-value">
                        {new Set(items.map(item => item.type)).size}
                      </div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                      <div className="stat-label">Atributos Únicos</div>
                      <div className="stat-value">
                        {new Set(items.map(item => item.key)).size}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>

        <div className="result-section">
          <h2>Resultados por Tipo</h2>
          {items.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum resultado ainda.</p>
              <p>Adicione itens para ver os resultados!</p>
            </div>
          ) : (
            <div className="result-content">
              {Object.keys(groupedByType).map((type) => (
                <div key={type} className="result-group">
                  <div className="result-group-header">
                    <h3 className="result-group-title">{type}</h3>
                    <span className="result-group-count">
                      {groupedByType[type].length} {groupedByType[type].length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  <div className="result-group-items">
                    {groupedByType[type].map((item) => (
                      <div key={item.id} className="result-item">
                        <div className="result-item-info">
                          <span className="result-item-key">{item.key}</span>
                          <span className="result-item-value">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="result-divider"></div>

              <div className="result-summary">
                <div className="result-summary-item">
                  <span className="result-summary-label">Total de Itens</span>
                  <span className="result-summary-value">{items.length}</span>
                </div>
                <div className="result-summary-item">
                  <span className="result-summary-label">Tipos Diferentes</span>
                  <span className="result-summary-value">
                    {Object.keys(groupedByType).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
