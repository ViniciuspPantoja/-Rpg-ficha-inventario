import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './SortableItem.css';

export function SortableItem({ id, itemType, itemKey, itemValue, onDelete, onUpdateValue }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(itemValue);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(itemValue);
    }
  }, [itemValue, isEditing]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(itemValue);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onUpdateValue(id, editValue.trim());
      setIsEditing(false);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setEditValue(itemValue);
    setIsEditing(false);
  };

  const handleBlur = (e) => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isButton = activeElement?.closest('.btn-edit, .btn-cancel, .btn-delete');
      if (!isButton) {
        handleSave();
      }
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      <div className="drag-handle" {...attributes} {...listeners}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <circle cx="7" cy="5" r="1.5" />
          <circle cx="13" cy="5" r="1.5" />
          <circle cx="7" cy="10" r="1.5" />
          <circle cx="13" cy="10" r="1.5" />
          <circle cx="7" cy="15" r="1.5" />
          <circle cx="13" cy="15" r="1.5" />
        </svg>
      </div>
      <div className="item-content">
        <div className="item-type">
          <span className="label">Tipo:</span>
          <span className="text">{itemType}</span>
        </div>
        <div className="item-key">
          <span className="label">Atributo:</span>
          <span className="text">{itemKey}</span>
        </div>
        <div className="item-value">
          <span className="label">Valor:</span>
          {isEditing ? (
            <input
              type="text"
              className="value-edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
          <span className="text">{itemValue}</span>
          )}
        </div>
      </div>
      <div className="item-actions">
        {isEditing ? (
          <>
            <button
              className="btn-edit"
              onClick={handleSave}
              title="Salvar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="btn-cancel"
              onClick={handleCancel}
              title="Cancelar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </>
        ) : (
          <button
            className="btn-edit"
            onClick={handleEdit}
            title="Editar valor"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      <button
        className="btn-delete"
        onClick={() => onDelete(id)}
        title="Remover item"
      >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>
      </div>
    </div>
  );
}

