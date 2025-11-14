import { useEffect } from 'react';
import './Alert.css';

export function Alert({ message, type = 'info', onClose, duration = 3000 }) {
  if (!message) return null;
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`alert alert-${type}`} onClick={onClose}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
        <button className="alert-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      </div>
    </div>
  );
}

