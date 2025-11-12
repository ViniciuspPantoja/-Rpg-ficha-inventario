import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './SortableItem.css';

export function SortableItem({ id, itemType, itemKey, itemValue, onDelete }) {
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
          <span className="text">{itemValue}</span>
        </div>
      </div>
      <button
        className="btn-delete"
        onClick={() => onDelete(id)}
        title="Remover item"
      >
        🗑️
      </button>
    </div>
  );
}

