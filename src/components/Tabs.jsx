import { useState } from 'react';
import './Tabs.css';

export function Tabs({ tabs, children }) {
  const [activeTab, setActiveTab] = useState(0);

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
        {children[activeTab]}
      </div>
    </div>
  );
}

