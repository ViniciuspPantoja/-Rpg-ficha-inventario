import { useState } from 'react';
import './Tabs.css';

export function Tabs({ tabs, children, activeTab: externalActiveTab, onTabChange }) {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {Array.isArray(children) ? children[activeTab] : children}
      </div>
    </div>
  );
}

