import React from 'react';
import { useDealStore } from './store/dealStore';
import { MOCK_SCENARIOS } from './data/mockDeal';
import { parseEmbedParams } from './logic/embedParams';
import { HeaderPanel } from './components/layout/HeaderPanel';
import { TabBar } from './components/layout/TabBar';
import { ActionButtons } from './components/layout/ActionButtons';
import { MainInfoTab } from './components/tabs/MainInfoTab';
import { LesseeTab } from './components/tabs/LesseeTab';
import { GuarantorTab } from './components/tabs/GuarantorTab';
import { SupplierTab } from './components/tabs/SupplierTab';
import { EndUserTab } from './components/tabs/EndUserTab';
import { SpecProgramTab } from './components/tabs/SpecProgramTab';
import { DealType, VerificationStage } from './types/deal';

const App: React.FC = () => {
  const deal = useDealStore();
  const [scenarioIdx, setScenarioIdx] = React.useState(0);

  const embedParams = React.useMemo(() => parseEmbedParams(), []);

  // In embed mode: load scenario and/or set tab from URL params
  React.useEffect(() => {
    if (!embedParams.embed) return;

    if (embedParams.scenario) {
      const [dealType, stage] = embedParams.scenario.split(':') as [DealType, VerificationStage];
      if (dealType && stage) {
        deal.loadScenario(dealType, stage);
      }
    }

    if (embedParams.tab) {
      deal.setActiveTab(embedParams.tab);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScenarioChange = (idx: number) => {
    setScenarioIdx(idx);
    const scenario = MOCK_SCENARIOS[idx];
    deal.loadScenario(scenario.dealType, scenario.stage);
  };

  const renderTabContent = () => {
    const { activeTab, entities } = deal;

    if (activeTab === 'main') {
      return <MainInfoTab />;
    }

    if (activeTab === 'special_program') {
      return <SpecProgramTab />;
    }

    // Вкладки по сущностям
    for (const entity of entities) {
      if (activeTab === `lessee_${entity.id}` && entity.role === 'lessee') {
        return <LesseeTab entity={entity} />;
      }
      if (activeTab === `guarantor_${entity.id}` && entity.role === 'guarantor') {
        return <GuarantorTab entity={entity} />;
      }
      if (activeTab === `supplier_${entity.id}` && entity.role === 'supplier') {
        return <SupplierTab entity={entity} />;
      }
      if (activeTab === `end_user_${entity.id}` && entity.role === 'end_user') {
        return <EndUserTab entity={entity} />;
      }
    }

    return (
      <div className="tab-content" style={{ padding: 24, color: '#64748b' }}>
        Вкладка не найдена. Выберите другую.
      </div>
    );
  };

  const showScenarioBar = !embedParams.embed;
  const showHeader = !embedParams.hideHeader;
  const showTabBar = !embedParams.hideTabBar;
  const showActions = !embedParams.hideActions;

  return (
    <div className={embedParams.embed ? 'embed-mode' : ''}>
      {showScenarioBar && (
        <div className="scenario-bar">
          <div className="inner-container">
            <label>Сценарий:</label>
            <select
              value={scenarioIdx}
              onChange={e => handleScenarioChange(Number(e.target.value))}
            >
              {MOCK_SCENARIOS.map((s, i) => (
                <option key={i} value={i}>{s.label}</option>
              ))}
            </select>
            <span className="scenario-desc">{MOCK_SCENARIOS[scenarioIdx].description}</span>
          </div>
        </div>
      )}

      {showHeader && <HeaderPanel />}
      {showTabBar && <TabBar />}

      {renderTabContent()}

      {showActions && <ActionButtons />}
    </div>
  );
};

export default App;
