import React from 'react';
import { useDealStore } from '../../store/dealStore';
import { BlockSection } from '../shared/BlockSection';
import { ParameterCheckTable } from '../shared/ParameterCheckTable';
import { isNegativeResult } from '../../logic/fieldCalculations';

export const SpecProgramTab: React.FC = () => {
  const deal = useDealStore();

  if (!deal.specialProgram) {
    return (
      <div className="tab-content">
        <div style={{ padding: 24, color: '#64748b', fontStyle: 'italic' }}>
          Спец. программа не применяется для данного сценария.
        </div>
      </div>
    );
  }

  const isWarning = deal.specialProgram.verificationResult?.includes('решение УЛ');

  return (
    <div className="tab-content">
      {/* Блок 1: Проверка */}
      <BlockSection title='1. Проверка лизингополучателя на соответствие требованиям спец. программы "Повторный клиент"'>
        <ParameterCheckTable
          parameters={deal.specialProgram.parameters}
          onUpdate={(paramId, correction, comment) =>
            deal.updateSpecialProgramParameter(paramId, correction, comment)
          }
        />
      </BlockSection>

      {/* Блок 2: Результаты */}
      <BlockSection title="2. Результаты проверки на соответствие требованиям специальной программы">
        <div className={`verification-result ${
          isNegativeResult(deal.specialProgram.verificationResult)
            ? 'negative'
            : isWarning
            ? 'warning'
            : 'positive'
        }`}>
          Вывод: {deal.specialProgram.verificationResult || '—'}
        </div>
      </BlockSection>
    </div>
  );
};
