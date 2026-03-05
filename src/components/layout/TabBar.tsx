import React from 'react';
import { useDealStore } from '../../store/dealStore';
import { getVisibleTabs } from '../../logic/tabVisibility';

export const TabBar: React.FC = () => {
  const { dealType, verificationStage, entities, activeTab, setActiveTab, hasSpecialProgram } = useDealStore();
  const tabs = getVisibleTabs(dealType, verificationStage, entities, hasSpecialProgram);

  return (
    <div className="tab-bar">
      <div className="inner-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
